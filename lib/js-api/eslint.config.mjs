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
        files: ['**/*.ts'],
        rules: {
            '@nx/enforce-module-boundaries': [
                'error',
                {
                    enforceBuildableLibDependency: true,
                    allow: [],
                    depConstraints: [
                        {
                            sourceTag: 'scope:js-api',
                            onlyDependOnLibsWithTags: []
                        }
                    ]
                }
            ],
            'no-underscore-dangle': [
                'warn',
                {
                    allowAfterThis: true
                }
            ],
            '@typescript-eslint/dot-notation': 'off',
            '@typescript-eslint/explicit-member-accessibility': [
                'off',
                {
                    accessibility: 'explicit'
                }
            ],
            '@typescript-eslint/no-inferrable-types': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-var-requires': 'error',
            'comma-dangle': 'error',
            'default-case': 'error',
            'import/order': 'off',
            'max-len': [
                'error',
                {
                    code: 240
                }
            ],
            'no-bitwise': 'off',
            'no-duplicate-imports': 'error',
            'no-multiple-empty-lines': 'error',
            'no-return-await': 'error',
            'unicorn/filename-case': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/consistent-type-assertions': 'off',
            'jsdoc/check-param-names': 'off',
            'jsdoc/require-returns': 'off',
            'jsdoc/require-param': 'off',
            'jsdoc/check-tag-names': 'off',
            '@typescript-eslint/no-shadow': 'warn',
            '@typescript-eslint/member-ordering': 'off',
            '@typescript-eslint/no-namespace': 'off',
            '@typescript-eslint/consistent-type-definitions': 'off',
            'no-redeclare': 'off',
            'space-before-function-paren': 'off',
            '@typescript-eslint/no-empty-interface': 'warn',
            '@typescript-eslint/no-explicit-any': 'off'
        }
    }
];
