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
    globalIgnores(['dist', 'node_modules']),
    ...rootConfig,
    {
        files: ['**/*.ts'],
        extends: fixupConfigRules(compat.extends('plugin:@nx/angular')),
        languageOptions: {
            parserOptions: {
                project: ['lib/cli/tsconfig.json']
            }
        },
        rules: {
            '@typescript-eslint/naming-convention': 'warn',
            'quote-props': 'off',
            'no-shadow': 'warn',
            'no-restricted-syntax': 'off',
            'no-underscore-dangle': 'off',
            '@typescript-eslint/consistent-type-assertions': 'warn',
            '@typescript-eslint/prefer-for-of': 'off',
            '@typescript-eslint/consistent-type-definitions': 'error',
            '@typescript-eslint/dot-notation': 'off',
            '@typescript-eslint/no-inferrable-types': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            'default-case': 'error',
            'import/order': 'off',
            'max-len': ['error', { code: 240 }],
            'no-duplicate-imports': 'error',
            'no-multiple-empty-lines': 'error',
            'no-redeclare': 'error',
            'no-return-await': 'error',
            'no-console': 'off'
        }
    },
    {
        files: ['**/*.html'],
        extends: fixupConfigRules(compat.extends('plugin:@nx/angular-template'))
    }
]);
