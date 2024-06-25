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
        '**/docs',
        '!.storybook'
    ],

    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2018
    },

    plugins: ['@nx'],

    overrides: [
        {
            files: ['*.ts'],
            parserOptions: {
                project: ['tsconfig.json', 'e2e/tsconfig.e2e.json'],
                createDefaultProgram: true
            },
            extends: [
                'plugin:@nx/typescript',
                'plugin:@nx/angular',
                'plugin:@cspell/recommended',
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
                'jsdoc',
                'eslint-plugin-jsdoc',
                'eslint-plugin-prefer-arrow'
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
                        ' * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.',
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
                ],

                //ng-cli-compat.json
                '@typescript-eslint/interface-name-prefix': 'off',
                'sort-keys': 'off',
                '@angular-eslint/component-class-suffix': 'error',
                '@angular-eslint/contextual-lifecycle': 'error',
                '@angular-eslint/directive-class-suffix': 'error',
                '@angular-eslint/no-conflicting-lifecycle': 'error',
                '@angular-eslint/no-input-rename': 'error',
                '@angular-eslint/no-inputs-metadata-property': 'error',
                '@angular-eslint/no-output-native': 'error',
                '@angular-eslint/no-output-on-prefix': 'error',
                '@angular-eslint/no-output-rename': 'error',
                '@angular-eslint/no-outputs-metadata-property': 'error',
                '@angular-eslint/use-lifecycle-interface': 'error',
                '@angular-eslint/use-pipe-transform-interface': 'error',
                '@typescript-eslint/adjacent-overload-signatures': 'error',
                '@typescript-eslint/array-type': 'off',
                '@typescript-eslint/ban-types': [
                    'error',
                    {
                        types: {
                            Object: {
                                message: 'Avoid using the `Object` type. Did you mean `object`?'
                            },
                            Function: {
                                message: 'Avoid using the `Function` type. Prefer a specific function type, like `() => void`.'
                            },
                            Boolean: {
                                message: 'Avoid using the `Boolean` type. Did you mean `boolean`?'
                            },
                            Number: {
                                message: 'Avoid using the `Number` type. Did you mean `number`?'
                            },
                            String: {
                                message: 'Avoid using the `String` type. Did you mean `string`?'
                            },
                            Symbol: {
                                message: 'Avoid using the `Symbol` type. Did you mean `symbol`?'
                            }
                        }
                    }
                ],
                '@typescript-eslint/consistent-type-assertions': 'error',
                '@typescript-eslint/no-empty-function': 'off',
                '@typescript-eslint/no-empty-interface': 'error',
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/no-misused-new': 'error',
                '@typescript-eslint/no-namespace': 'error',
                '@typescript-eslint/no-non-null-assertion': 'error',
                '@typescript-eslint/no-parameter-properties': 'off',
                '@typescript-eslint/no-use-before-define': 'off',
                '@typescript-eslint/prefer-for-of': 'error',
                '@typescript-eslint/prefer-function-type': 'error',
                '@typescript-eslint/prefer-namespace-keyword': 'error',
                '@typescript-eslint/triple-slash-reference': [
                    'error',
                    {
                        path: 'always',
                        types: 'prefer-import',
                        lib: 'always'
                    }
                ],
                '@typescript-eslint/unified-signatures': 'error',
                complexity: 'off',
                'constructor-super': 'error',
                eqeqeq: ['error', 'smart'],
                'guard-for-in': 'error',
                'id-blacklist': ['error', 'any', 'Number', 'number', 'String', 'string', 'Boolean', 'boolean', 'Undefined', 'undefined'],
                'id-match': 'error',
                'import/no-deprecated': 'warn',
                'jsdoc/newline-after-description': 'error',
                'jsdoc/no-types': 'error',
                'max-classes-per-file': 'off',
                'no-caller': 'error',
                'no-cond-assign': 'error',
                'no-debugger': 'error',
                'no-empty': 'off',
                'no-eval': 'error',
                'no-fallthrough': 'error',
                'no-invalid-this': 'off',
                'no-new-wrappers': 'error',
                'no-restricted-imports': [
                    'error',
                    {
                        name: 'rxjs/Rx',
                        message: "Please import directly from 'rxjs' instead"
                    }
                ],
                '@typescript-eslint/no-shadow': [
                    'error',
                    {
                        hoist: 'all'
                    }
                ],
                'no-throw-literal': 'error',
                'no-undef-init': 'error',
                'no-underscore-dangle': 'error',
                'no-unsafe-finally': 'error',
                'no-unused-labels': 'error',
                'no-var': 'error',
                'object-shorthand': 'error',
                'one-var': ['error', 'never'],
                'prefer-const': 'error',
                radix: 'error',
                'use-isnan': 'error',
                'valid-typeof': 'off',

                //ng-cli-compat--formatting-add-on.json
                'arrow-body-style': 'error',
                'arrow-parens': 'off',
                curly: 'error',
                'eol-last': 'error',
                'jsdoc/check-alignment': 'error',
                'new-parens': 'error',
                'no-trailing-spaces': 'error',
                'quote-props': ['error', 'as-needed'],
                'space-before-function-paren': [
                    'error',
                    {
                        anonymous: 'never',
                        asyncArrow: 'always',
                        named: 'never'
                    }
                ],
                '@typescript-eslint/member-delimiter-style': [
                    'error',
                    {
                        multiline: {
                            delimiter: 'semi',
                            requireLast: true
                        },
                        singleline: {
                            delimiter: 'semi',
                            requireLast: false
                        }
                    }
                ],
                quotes: 'off',
                '@typescript-eslint/quotes': ['error', 'single', { allowTemplateLiterals: true }],
                '@typescript-eslint/semi': ['error', 'always'],
                '@typescript-eslint/type-annotation-spacing': 'error'
            }
        },
        {
            files: ['*.html'],
            extends: ['plugin:@angular-eslint/template/recommended', 'plugin:@angular-eslint/template/accessibility'],
            rules: {}
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
        }
    ],

    extends: ['plugin:storybook/recommended']
};
