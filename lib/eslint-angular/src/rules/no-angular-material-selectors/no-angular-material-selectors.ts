/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { createESLintRule } from '../../utils/create-eslint-rule/create-eslint-rule';
import type { TSESTree } from '@typescript-eslint/utils';

export const RULE_NAME = 'no-angular-material-selectors';

const ASTSelectors = [
    ':not(Property[key.name="template"]) Literal[value=/(\\.|\\s|^)(mat-(?!datetimepicker)|mdc-)/i]',
    ':not(Property[key.name="template"]) > TemplateLiteral > TemplateElement[value.raw=/(\\.|\\s|^)(mat-(?!datetimepicker)|mdc-)/i]'
];

const messages = {
    noAngularMaterialSelectors: 'Using Angular Material internal selectors is not allowed',
    useAngularMaterialTestingHarness: 'Use testing harness instead of Angular Material internal selectors',
    useE2ELocatorVariables: 'Use locator variables instead of Angular Material internal selectors'
};

type MessageIds = keyof typeof messages;

const filetypeErrors: {regexp: RegExp; messageId: MessageIds}[] = [
    {
        regexp: /.*\.spec\.ts/,
        messageId: 'useAngularMaterialTestingHarness'
    },
    {
        regexp: /.*\.e2e\.ts/,
        messageId: 'useE2ELocatorVariables'
    }
];

/**
 * Custom ESLint rule for detecting the usage of internal Angular Material selectors
 */
export default createESLintRule<unknown[], MessageIds>({
    name: RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Disallows using Angular Material internal selectors'
        },
        hasSuggestions: true,
        schema: [],
        messages
    },
    defaultOptions: [],
    create(context) {
        return {
            [ASTSelectors.join(',')](node: TSESTree.Literal | TSESTree.TemplateLiteral) {
                const message = filetypeErrors.find((fileTypeError) =>
                    context.getFilename().match(fileTypeError.regexp)
                ) || { messageId: 'noAngularMaterialSelectors' };

                context.report({
                    node,
                    messageId: message.messageId as MessageIds
                });
            }
        };
    }
});
