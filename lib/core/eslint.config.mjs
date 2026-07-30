import path from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import { defineConfig, globalIgnores } from '@eslint/config-helpers';
import { FlatCompat } from '@eslint/eslintrc';
import { fixupConfigRules } from '@eslint/compat';
import nxPlugin from '@nx/eslint-plugin';
import rootConfig from '../../eslint.config.mjs';

export default [
    ...rootConfig,
    {
        files: ['**/*.ts', '**/*.js', '**/*.mjs'],
        plugins: {
            '@nx': nxPlugin
        },
        rules: {
            '@nx/enforce-module-boundaries': [
                'error',
                {
                    enforceBuildableLibDependency: true,
                    allow: [],
                    depConstraints: [
                        {
                            sourceTag: 'scope:core',
                            onlyDependOnLibsWithTags: ['scope:js-api', 'scope:extensions']
                        }
                    ]
                }
            ]
        }
    },
    // {
    //     files: ['**/*.ts'],
    //     rules: {
    //         'jsdoc/tag-lines': ['error', 'any', { startLines: 1 }],
    //         '@typescript-eslint/naming-convention': 'off',
    //         '@typescript-eslint/consistent-type-assertions': 'warn',
    //         '@typescript-eslint/prefer-for-of': 'off',
    //         '@typescript-eslint/member-ordering': 'off',
    //         'no-underscore-dangle': ['error', { allowAfterThis: true }],
    //         'no-shadow': 'warn',
    //         'quote-props': 'off',
    //         'object-shorthand': 'warn',
    //         'no-restricted-syntax': 'warn',
    //         'prefer-const': 'warn',
    //         'arrow-body-style': 'warn',
    //         '@angular-eslint/no-output-native': 'off',
    //         'space-before-function-paren': 'off',
    //         '@angular-eslint/component-selector': ['error', { type: 'element', prefix: ['adf', 'app'], style: 'kebab-case' }],
    //         '@angular-eslint/directive-selector': ['error', { type: ['element', 'attribute'], prefix: ['adf', 'app'], style: 'kebab-case' }],
    //         '@angular-eslint/no-input-prefix': 'error',
    //         '@typescript-eslint/consistent-type-definitions': 'error',
    //         '@typescript-eslint/dot-notation': 'off',
    //         '@typescript-eslint/explicit-member-accessibility': ['off', { accessibility: 'explicit' }],
    //         '@typescript-eslint/no-inferrable-types': 'off',
    //         '@typescript-eslint/no-require-imports': 'off',
    //         'comma-dangle': 'error',
    //         'default-case': 'error',
    //         'import/order': 'off',
    //         'max-len': ['error', { code: 240 }],
    //         'no-bitwise': 'off',
    //         'no-duplicate-imports': 'error',
    //         'no-multiple-empty-lines': 'error',
    //         'no-return-await': 'error',
    //         'rxjs/no-create': 'error',
    //         'rxjs/no-subject-unsubscribe': 'error',
    //         'rxjs/no-subject-value': 'error',
    //         'rxjs/no-unsafe-takeuntil': 'error',
    //         'unicorn/filename-case': 'error',
    //         '@angular-eslint/prefer-standalone': 'off'
    //     }
    // },
    // {
    //     files: ['**/*.html'],
    //     extends: fixupConfigRules(compat.extends('plugin:@nx/angular-template')),
    //     rules: {
    //         '@angular-eslint/template/no-autofocus': 'error',
    //         '@angular-eslint/template/no-positive-tabindex': 'error',
    //         '@angular-eslint/template/no-negated-async': 'off'
    //     }
    // }
];
