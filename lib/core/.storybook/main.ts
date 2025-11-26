import type { StorybookConfig } from '@storybook/angular';
import rootMain from '../../../.storybook/main';

const config: StorybookConfig = {
    ...rootMain,
    stories: ['../**/*.stories.@(js|jsx|ts|tsx)'],
    framework: {
        name: '@storybook/angular',
        options: {}
    },
    staticDirs: [
        { from: '../src/lib/i18n', to: 'assets/adf-core/i18n' },
        { from: '../src/lib/assets/images', to: 'assets/images' }
    ]
};

export default config;
