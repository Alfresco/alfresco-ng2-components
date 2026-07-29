import path from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import { defineConfig, globalIgnores } from '@eslint/config-helpers';
import { FlatCompat } from '@eslint/eslintrc';
import { fixupConfigRules } from '@eslint/compat';
import rootConfig from '../../eslint.config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([
    globalIgnores(['.storybook', 'coverage', 'docs']),
    ...rootConfig,
    {
        files: ['**/*.ts'],
        extends: fixupConfigRules(compat.extends('plugin:@nx/angular')),
        languageOptions: {
            parserOptions: {
                project: ['lib/js-api/tsconfig.json']
            }
        },
        rules: {
            'no-underscore-dangle': ['warn', { allowAfterThis: true }],
            '@typescript-eslint/dot-notation': 'off',
            '@typescript-eslint/explicit-member-accessibility': ['off', { accessibility: 'explicit' }],
            '@typescript-eslint/no-inferrable-types': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            'comma-dangle': 'error',
            'default-case': 'error',
            'import/order': 'off',
            'max-len': ['error', { code: 240 }],
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
]);
