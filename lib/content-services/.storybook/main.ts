import type { StorybookConfig } from '@storybook/angular';
import rootMain from '../../../.storybook/main';

const config: StorybookConfig = {
    ...rootMain,
    stories: ['../**/*.stories.@(js|jsx|ts|tsx)'],
    staticDirs: [
        { from: '../src/lib/i18n', to: 'assets/adf-core/i18n' },
        { from: '../src/lib/assets/images', to: 'assets/images' }
    ],
    framework: {
        name: '@storybook/angular',
        options: {}
    }
};

export default config;
