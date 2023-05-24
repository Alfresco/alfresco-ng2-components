/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ASTUtils, isNotNullOrUndefined, RuleFixes, Selectors } from '@angular-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';
import { createESLintRule } from '../../utils/create-eslint-rule/create-eslint-rule';

export const RULE_NAME = 'use-none-component-view-encapsulation';

type MessageIds = 'useNoneComponentViewEncapsulation'| 'suggestAddViewEncapsulationNone';
type DecoratorForClass = TSESTree.Decorator & {
    parent: TSESTree.ClassDeclaration;
};
type PropertyInClassDecorator = TSESTree.Property & {
    parent: TSESTree.CallExpression & {
        parent: TSESTree.ObjectExpression & {
            parent: TSESTree.Decorator & {
                parent: TSESTree.ClassDeclaration;
            };
        };
    };
};

const metadataPropertyName = 'encapsulation';
const viewEncapsulationNone = 'ViewEncapsulation.None';
const nodeToReport = (node: TSESTree.Node) => {
    if (!ASTUtils.isProperty(node)) {
        return node;
    }
    return ASTUtils.isMemberExpression(node.value) ? node.value.property : node.value;
};

/**
 * Custom ESLint rule which check if component uses ViewEncapsulation.None. It has been implemented because None encapsulation makes themes styling easier.
 * It also allows to autofix.
 */
export default createESLintRule<unknown[], MessageIds>({
    name: RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: `Disallows using other encapsulation than \`${viewEncapsulationNone}\``,
            recommended: false
        },
        hasSuggestions: true,
        schema: [],
        messages: {
            useNoneComponentViewEncapsulation: `Using encapsulation other than '${viewEncapsulationNone}' makes themes styling harder.`,
            suggestAddViewEncapsulationNone: `Add '${viewEncapsulationNone}'`
        }
    },
    defaultOptions: [],
    create(context) {
        const encapsulationProperty = Selectors.metadataProperty(
            metadataPropertyName
        );
        const withoutEncapsulationProperty =
            `${Selectors.COMPONENT_CLASS_DECORATOR}:matches([expression.arguments.length=0], [expression.arguments.0.type='ObjectExpression']:not(:has(${encapsulationProperty})))` as const;
        const nonNoneViewEncapsulationNoneProperty =
            `${Selectors.COMPONENT_CLASS_DECORATOR} > CallExpression > ObjectExpression > ` +
            `${encapsulationProperty}:matches([value.type='Identifier'][value.name='undefined'], [value.object.name='ViewEncapsulation'][value.property.name!='None'])`;
        const selectors = [
            withoutEncapsulationProperty,
            nonNoneViewEncapsulationNoneProperty
        ].join(',');
        return {
            [selectors](node: DecoratorForClass | PropertyInClassDecorator) {
                context.report({
                    node: nodeToReport(node),
                    messageId: 'useNoneComponentViewEncapsulation',
                    suggest: [
                        {
                            messageId: 'suggestAddViewEncapsulationNone',
                            fix: (fixer) => {
                                if (ASTUtils.isProperty(node)) {
                                    return [
                                        RuleFixes.getImportAddFix({
                                            fixer,
                                            importName: 'ViewEncapsulation',
                                            moduleName: '@angular/core',
                                            node: node.parent.parent.parent.parent
                                        }),
                                        ASTUtils.isMemberExpression(node.value)
                                            ? fixer.replaceText(node.value.property, 'None')
                                            : fixer.replaceText(node.value, viewEncapsulationNone)
                                    ].filter(isNotNullOrUndefined);
                                }

                                return [
                                    RuleFixes.getImportAddFix({
                                        fixer,
                                        importName: 'ViewEncapsulation',
                                        moduleName: '@angular/core',
                                        node: node.parent
                                    }),
                                    RuleFixes.getDecoratorPropertyAddFix(
                                        node,
                                        fixer,
                                        `${metadataPropertyName}: ${viewEncapsulationNone}`
                                    )
                                ].filter(isNotNullOrUndefined);
                            }
                        }
                    ]
                });
            }
        };
    }
});
