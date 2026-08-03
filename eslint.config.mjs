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

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import { fixupPluginRules } from '@eslint/compat';
import unicorn from 'eslint-plugin-unicorn';
import rxjs from 'eslint-plugin-rxjs';
import prettier from 'eslint-plugin-prettier';
import ban from 'eslint-plugin-ban';
import licenseHeader from 'eslint-plugin-license-header';
import cspell from '@cspell/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import storybook from 'eslint-plugin-storybook';
import nxPlugin from '@nx/eslint-plugin';
import angularEslintEslintPlugin from '@angular-eslint/eslint-plugin';
import angularTemplateParser from '@angular-eslint/template-parser';
import tsParser from '@typescript-eslint/parser';
import jsonParser from 'jsonc-eslint-parser';
import alfrescoEslintAngular from './lib/eslint-angular/main.js';
import jsdoc from 'eslint-plugin-jsdoc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    {
        ignores: [
            '.angular',
            '.DS_Store',
            '.github',
            '.history',
            '.husky',
            '.nx',
            '.vscode',
            'coverage',
            'dist',
            '**/docs',
            'nxcache',
            'tmp',
            'projects/**/*',
            '**/node_modules/**/*',
            'lib/cli/node_modules/**/*',
            'lib/core/src/lib/icon',
            '**/node_modules',
            '**/assets',
            '/scripts'
        ]
    },
    // You can uncomment unicorn.configs['recommended'], fix a few issues, and comment it out again until all issues are resolved.
    // Expect significant effort to fix all reported issues.
    // Note to developers: when enabling unicorn.configs['recommended'], remove unicorn from plugins to avoid plugin redefinition errors.
    // unicorn.configs['recommended'],
    ...storybook.configs['flat/recommended'],
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        ignores: ['**/*.d.ts'],
        plugins: {
            'license-header': licenseHeader
        },
        rules: {
            'license-header/header': [
                'error',
                [
                    '/*!',
                    ' * @license',
                    ' * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.',
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
        files: ['**/*.ts', '**/*.js', '**/*.mjs'],
        ignores: ['**/*.d.ts', '**/*.spec.ts'],
        ...jsdoc.configs['flat/recommended-typescript-error']
    },
    {
        files: ['**/*.ts'],
        ignores: ['**/*.d.ts', '**/*.mjs'],
        ...compat.extends(
            'plugin:@nx/typescript',
            'plugin:@nx/angular',
            'plugin:@cspell/recommended',
            'plugin:@angular-eslint/recommended',
            'plugin:@angular-eslint/template/process-inline-templates'
        )[0],
        plugins: {
            '@nx': nxPlugin,
            jsdoc,
            unicorn,
            rxjs: fixupPluginRules(rxjs),
            prettier: prettier,
            ban: ban,
            '@cspell': cspell,
            import: importPlugin,
            '@angular-eslint': angularEslintEslintPlugin,
            '@typescript-eslint': typescriptEslint
        },
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                projectService: true,
                allowDefaultProject: true,
                tsconfigRootDir: __dirname,
                sourceType: 'module'
            }
        },
        rules: {
            // Uncomment this to enable prettier checks as part of the ESLint
            // Note to developers:
            // you can uncomment the full ruleset locally when fixing issues, and then comment
            // that will allow splitting the work into smaller chunks
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
            '@angular-eslint/prefer-inject': 'error',
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
            '@typescript-eslint/prefer-readonly': 'error',
            '@typescript-eslint/no-inferrable-types': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-var-requires': 'error',
            'jsdoc/tag-lines': [
                'error',
                'any',
                {
                    startLines: 1
                }
            ],
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
            '@typescript-eslint/no-explicit-any': 'off',
            'prefer-promise-reject-errors': 'error',
            'brace-style': 'off',
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
            'no-redeclare': 'off',
            '@typescript-eslint/no-redeclare': ['off', { ignoreDeclarationMerge: true }],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_'
                }
            ],
            'no-return-await': 'error',
            'rxjs/no-create': 'error',
            'rxjs/no-subject-unsubscribe': 'error',
            'rxjs/no-subject-value': 'error',
            'rxjs/no-unsafe-takeuntil': 'error',
            'unicorn/filename-case': 'error',
            'unicorn/prefer-optional-catch-binding': 'error',
            '@typescript-eslint/no-unused-expressions': [
                'error',
                {
                    allowShortCircuit: true,
                    allowTernary: true
                }
            ],
            'no-restricted-syntax': [
                'error',
                {
                    selector: "Identifier[name='CUSTOM_ELEMENTS_SCHEMA']",
                    message: 'The use of CUSTOM_ELEMENTS_SCHEMA is not allowed. Consider alternatives for proper schema handling.'
                },
                {
                    selector: "Identifier[name='NO_ERRORS_SCHEMA']",
                    message: 'The use of NO_ERRORS_SCHEMA is not allowed. Consider alternatives for proper schema handling.'
                },
                {
                    selector: 'TSEnumDeclaration',
                    message: 'Enums are not allowed. Use string literal types (e.g., type Foo = "a" | "b") or const objects instead.'
                },
                {
                    selector: ':matches(Literal[value=/ng-reflect-/], TemplateElement[value.cooked=/ng-reflect-/])',
                    message: '*ng-reflect-* attributes should not be used. Consider alternatives for proper selectors.'
                }
            ]
        }
    },
    {
        files: ['**/*.html'],
        ...compat.extends(
            'plugin:@angular-eslint/template/recommended',
            'plugin:@angular-eslint/template/accessibility',
            'plugin:@nx/angular-template'
        )[0],
        languageOptions: {
            parser: angularTemplateParser
        },
        rules: {
            '@angular-eslint/template/prefer-self-closing-tags': 'error'
        }
    },
    {
        files: ['**/*.spec.ts'],
        plugins: {
            '@alfresco/eslint-angular': alfrescoEslintAngular
        },
        rules: {
            '@alfresco/eslint-angular/no-angular-material-selectors': 'error',
            '@angular-eslint/component-class-suffix': 'off'
        }
    },
    {
        files: ['**/*.json'],
        languageOptions: {
            parser: jsonParser
        },
        rules: {
            'comma-dangle': ['error', 'never']
        }
    },
    {
        files: ['**/*.stories.ts'],
        rules: {
            '@cspell/spellchecker': 'off'
        }
    },
    {
        files: ['**/*.mjs'],
        rules: {
            'unicorn/no-null': 'off'
        },
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                tsconfigRootDir: __dirname,
                ecmaVersion: 'latest',
                sourceType: 'module'
            }
        }
    }
];
