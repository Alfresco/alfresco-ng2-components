import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
    framework: {
        name: '@storybook/angular',
        options: {}
    },
    staticDirs: [],
    stories: ['lib/**/*.stories.ts']
};

export default config;
