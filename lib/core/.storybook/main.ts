import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import type { StorybookConfig } from '@storybook/angular';
import rootMain from '../../../.storybook/main';

const config: StorybookConfig = {
    ...rootMain,
    stories: ['../**/*.stories.@(js|jsx|ts|tsx)'],
    framework: {
        name: getAbsolutePath('@storybook/angular'),
        options: {}
    },
    staticDirs: [
        { from: '../src/lib/i18n', to: 'assets/adf-core/i18n' },
        { from: '../src/lib/assets/images', to: 'assets/images' }
    ]
};

export default config;

function getAbsolutePath(value: string): any {
    return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
