var rootPath = require('../../../.storybook/main');

module.exports = {
    rootMain: rootPath,
    stories: [...rootPath.stories, '../src/lib/**/*.stories.@(js|jsx|ts|tsx)'],

    staticDirs: [
        ...rootPath.staticDirs,
        { from: '../../core/src/lib/i18n', to: 'assets/adf-core/i18n' },
        { from: __dirname + '/../src/lib/i18n', to: 'assets/adf-process-services-cloud/i18n' }
    ],

    addons: ['@storybook/addon-essentials', ...rootPath.addons],

    framework: {
        name: '@storybook/angular',
        options: {}
    },

    docs: {
        autodocs: true
    },

    core: {
        builder: '@storybook/builder-webpack5'
    }
};
