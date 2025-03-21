module.exports = {
    root: true,

    ignorePatterns: [
        'projects/**/*',
        '**/node_modules/**/*',
        'lib/cli/node_modules/**/*',
        '**/node_modules',
        '**/docker',
        '**/assets',
        '**/scripts',
        '**/docs'
    ],

    plugins: ['@nx'],

    overrides: [
        {
            files: ['*.ts'],
            parserOptions: {
                project: ['tsconfig.json'],
                createDefaultProgram: true
            },
            extends: [
                'plugin:@nx/typescript',
                'plugin:@nx/angular',
                'plugin:@cspell/recommended',
                'plugin:@angular-eslint/recommended',
                'plugin:@angular-eslint/template/process-inline-templates',
                'plugin:jsdoc/recommended-typescript-error'
            ],
            plugins: [
                'eslint-plugin-unicorn',
                'eslint-plugin-rxjs',
                'prettier',
                'ban',
                'license-header',
                '@cspell',
                'eslint-plugin-import',
                '@angular-eslint/eslint-plugin',
                '@typescript-eslint',
                'jsdoc'
            ],
            rules: {
                // Uncomment this to enable prettier checks as part of the ESLint
                // 'prettier/prettier': 'error',
                'ban/ban': [
                    'error',
                    { name: 'eval', message: 'Calls to eval is not allowed.' },
                    { name: 'fdescribe', message: 'Calls to fdescribe is not allowed' },
                    { name: 'fit', message: 'Calls to fit is not allowed' },
                    { name: 'xit', message: 'Calls to xit is not allowed' },
                    { name: 'xdescribe', message: 'Calls to xdescribe is not allowed' },
                    { name: ['test', 'only'], message: 'Calls to test.only is not allowed' },
                    { name: ['describe', 'only'], message: 'Calls to describe.only is not allowed' }
                ],
                '@angular-eslint/component-selector': [
                    'error',
                    {
                        type: 'element',
                        prefix: ['adf', 'app'],
                        style: 'kebab-case'
                    }
                ],
                '@angular-eslint/directive-selector': [
                    'error',
                    {
                        type: ['element', 'attribute'],
                        prefix: ['adf', 'app'],
                        style: 'kebab-case'
                    }
                ],
                '@angular-eslint/no-host-metadata-property': 'off',
                '@angular-eslint/no-input-prefix': 'error',
                '@typescript-eslint/consistent-type-definitions': 'error',
                '@typescript-eslint/dot-notation': 'off',
                '@typescript-eslint/explicit-member-accessibility': [
                    'off',
                    {
                        accessibility: 'explicit'
                    }
                ],
                '@typescript-eslint/await-thenable': 'error',
                '@typescript-eslint/prefer-optional-chain': 'warn',
                '@typescript-eslint/no-inferrable-types': 'off',
                '@typescript-eslint/no-require-imports': 'off',
                '@typescript-eslint/no-var-requires': 'error',
                '@typescript-eslint/naming-convention': [
                    'error',
                    {
                        selector: [
                            'classProperty',
                            'objectLiteralProperty',
                            'typeProperty',
                            'classMethod',
                            'objectLiteralMethod',
                            'typeMethod',
                            'accessor',
                            'enumMember'
                        ],
                        format: null,
                        modifiers: ['requiresQuotes']
                    }
                ],
                '@typescript-eslint/member-ordering': 'off',
                '@typescript-eslint/no-empty-function': 'off',
                'prefer-arrow/prefer-arrow-functions': 'off',
                'prefer-promise-reject-errors': 'error',
                'brace-style': 'off',
                '@typescript-eslint/brace-style': 'error',
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
                'no-console': [
                    'error',
                    {
                        allow: [
                            'warn',
                            'dir',
                            'timeLog',
                            'assert',
                            'clear',
                            'count',
                            'countReset',
                            'group',
                            'groupEnd',
                            'table',
                            'dirxml',
                            'error',
                            'groupCollapsed',
                            'Console',
                            'profile',
                            'profileEnd',
                            'timeStamp',
                            'context'
                        ]
                    }
                ],
                'no-duplicate-imports': 'error',
                'no-multiple-empty-lines': 'error',
                'no-redeclare': 'error',
                'no-return-await': 'error',
                'rxjs/no-create': 'error',
                'rxjs/no-subject-unsubscribe': 'error',
                'rxjs/no-subject-value': 'error',
                'rxjs/no-unsafe-takeuntil': 'error',
                'unicorn/filename-case': 'error',
                '@typescript-eslint/no-unused-expressions': [
                    'error',
                    {
                        allowShortCircuit: true,
                        allowTernary: true
                    }
                ],
                'license-header/header': [
                    'error',
                    [
                        '/*!',
                        ' * @license',
                        ' * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.',
                        ' *',
                        ' * Licensed under the Apache License, Version 2.0 (the "License");',
                        ' * you may not use this file except in compliance with the License.',
                        ' * You may obtain a copy of the License at',
                        ' *',
                        ' *     http://www.apache.org/licenses/LICENSE-2.0',
                        ' *',
                        ' * Unless required by applicable law or agreed to in writing, software',
                        ' * distributed under the License is distributed on an "AS IS" BASIS,',
                        ' * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.',
                        ' * See the License for the specific language governing permissions and',
                        ' * limitations under the License.',
                        ' */'
                    ]
                ]
            }
        },
        {
            files: ['*.html'],
            extends: ['plugin:@angular-eslint/template/recommended', 'plugin:@angular-eslint/template/accessibility'],
            parser: '@angular-eslint/template-parser',
            rules: {
                '@angular-eslint/template/prefer-self-closing-tags': 'error'
            }
        },
        {
            files: ['*.spec.ts'],
            plugins: ['@alfresco/eslint-angular'],
            rules: {
                '@alfresco/eslint-angular/no-angular-material-selectors': 'error'
            }
        },
        {
            files: ['*.ts'],
            extends: ['plugin:@angular-eslint/template/process-inline-templates'],
            excludedFiles: ['*.spec.ts']
        },
        {
            files: ['*.json'],
            parser: 'jsonc-eslint-parser',
            rules: {
                'comma-dangle': ['error', 'never']
            }
        }
    ],

    extends: ['plugin:storybook/recommended']
};
