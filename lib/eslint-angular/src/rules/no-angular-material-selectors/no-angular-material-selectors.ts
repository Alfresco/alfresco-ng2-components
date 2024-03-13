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

import { createESLintRule } from '../../utils/create-eslint-rule/create-eslint-rule';
import type { TSESTree } from '@typescript-eslint/utils';

export const RULE_NAME = 'no-angular-material-selectors';

const ASTSelectors = [
    ':not(Property[key=template]) > Literal[value=/mat-(?!datetimepicker)/i]',
    ':not(Property[key.name="template"]) TemplateLiteral[quasis.value.raw=/mat-(?!datetimepicker)/i]'
];

const messages = {
    noAngularMaterialSelectors: 'Using Angular Material internal selectors is not allowed',
    useAngularMaterialTestingHarness: 'Use Angular Material testing harness instead of Angular Material selectors',
    useScssVariables: 'Use SCSS variables instead of Angular Material selectors',
    useE2ELocatorVariables: 'Use locator variables instead of Angular Material selectors'
};

/**
 * Custom ESLint rule for detecting the usage of internal Angular Material selectors
 */
export default createESLintRule<unknown[], keyof typeof messages>({
    name: RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Disallows using Angular Material internal selectors',
            recommended: 'error'
        },
        hasSuggestions: true,
        schema: [],
        messages
    },
    defaultOptions: [],
    create(context) {
        return {
            [ASTSelectors.join(',')](node: TSESTree.Literal | TSESTree.TemplateLiteral) {
                context.report({
                    node,
                    messageId: 'noAngularMaterialSelectors'
                });
            }
        };
    }
});
