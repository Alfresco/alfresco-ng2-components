import path from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import { defineConfig, globalIgnores } from '@eslint/config-helpers';
import { FlatCompat } from '@eslint/eslintrc';
import { fixupConfigRules } from '@eslint/compat';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([
    globalIgnores([
        '.angular',
        '.DS_Store',
        '.env',
        '.env.*',
        '.github',
        '.history',
        '.husky',
        '.idea/',
        '.ng_pkg_build/',
        '.nx',
        '.storybook',
        '.vscode',
        '*.iml',
        '*.log',
        '/angular.json',
        '/reports/',
        'bundles',
        'coverage',
        'desktop.ini',
        'dist',
        'docs/**/*.md',
        'e2e-result-*',
        'lib/core/src/lib/icon',
        'lib/eslint-angular/dist/',
        'lib/js-api/docs/**/*.md',
        'licenses.txt',
        'node_modules',
        'nxcache',
        'out-tsc',
        'scripts',
        'temp',
        'tmp',
        'webpack.config.js',
        '.cursor/rules/nx-rules.mdc',
        '.github/instructions/nx.instructions.md'
    ]),
    {
        extends: fixupConfigRules(compat.extends('./.eslintrc.js'))
    }
]);
