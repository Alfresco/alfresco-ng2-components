/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import rootConfig from '../../eslint.config.mjs';

export default [
    ...rootConfig,
    {
        files: ['lib/content-services/**/*.ts'],
        rules: {
            '@nx/enforce-module-boundaries': [
                'error',
                {
                    enforceBuildableLibDependency: true,
                    allow: [],
                    depConstraints: [
                        {
                            sourceTag: 'scope:content-services',
                            onlyDependOnLibsWithTags: ['scope:js-api', 'scope:core', 'scope:extensions']
                        }
                    ]
                }
            ],
            'jsdoc/tag-lines': [
                'error',
                'any',
                {
                    startLines: 1
                }
            ],
            '@typescript-eslint/naming-convention': 'warn',
            '@typescript-eslint/consistent-type-assertions': 'warn',
            '@typescript-eslint/prefer-for-of': 'warn',
            'no-underscore-dangle': [
                'error',
                {
                    allowAfterThis: true
                }
            ],
            'no-shadow': 'warn',
            'quote-props': 'off',
            'object-shorthand': 'warn',
            'prefer-const': 'warn',
            'arrow-body-style': 'warn',
            '@angular-eslint/no-output-native': 'off',
            'space-before-function-paren': 'off',
            '@angular-eslint/prefer-standalone': 'off'
        }
    },
    {
        files: ['lib/content-services/**/*.html'],
        rules: {
            '@angular-eslint/template/no-autofocus': 'error',
            '@angular-eslint/template/no-positive-tabindex': 'error'
        }
    }
];
