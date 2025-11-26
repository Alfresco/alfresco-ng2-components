import type { StorybookConfig } from '@storybook/angular';
import rootMain from '../../../.storybook/main';

const config: StorybookConfig = {
    ...rootMain,
    stories: ['../**/*.stories.@(js|jsx|ts|tsx)'],
    staticDirs: [{ from: '../src/lib/i18n', to: 'assets/adf-core/i18n' }],
    framework: {
        name: '@storybook/angular',
        options: {}
    }
};

export default config;
