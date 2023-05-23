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

import {
    ASTUtils,
    Selectors
} from '@angular-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';
import { createESLintRule } from '@nrwl/eslint-plugin-nx/src/utils/create-eslint-rule';
import { RuleContext } from '@typescript-eslint/utils/dist/ts-eslint/Rule';

type MessageId = 'useNoneComponentViewEncapsulation';
export const RULE_NAME = 'use-none-component-view-encapsulation';
const VIEW_ENCAPSULATION_NONE = 'ViewEncapsulation.None';

export default createESLintRule<[], MessageId>({
    name: RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: `Disallows using other encapsulation than \`${VIEW_ENCAPSULATION_NONE}\``,
            recommended: false
        },
        hasSuggestions: true,
        schema: [],
        messages: {
            useNoneComponentViewEncapsulation: `Using encapsulation other than \`${VIEW_ENCAPSULATION_NONE}\` makes themes styling harder.`
        }
    },
    defaultOptions: [],
    create(context) {
        return {
            ...checkEncapsulation(context, 'ShadowDom'),
            ...checkEncapsulation(context, 'Emulated'),
            [`${Selectors.COMPONENT_CLASS_DECORATOR}`](node: TSESTree.Decorator) {
                const rawSelectors = ASTUtils.getDecoratorPropertyValue(
                    node,
                    'encapsulation'
                );
                if (!rawSelectors) {
                    context.report({
                        node,
                        messageId: 'useNoneComponentViewEncapsulation'
                    });
                }
            }
        };
    }
});

const checkEncapsulation = (context: Readonly<RuleContext<MessageId, []>>, encapsulation: string) => ({
    [`${Selectors.COMPONENT_CLASS_DECORATOR} ${Selectors.metadataProperty(
        'encapsulation'
    )} > MemberExpression[object.name='ViewEncapsulation'] > Identifier[name='${encapsulation}']`](
        node: TSESTree.Identifier & {
            parent: TSESTree.MemberExpression & { parent: TSESTree.Property };
        }
    ) {
        context.report({
            node,
            messageId: 'useNoneComponentViewEncapsulation'
        });
    }
});
