var rootPath = require('../../../.storybook/main');

module.exports = {
    rootMain: rootPath,
    stories: [...rootPath.stories, '../**/*.stories.@(js|jsx|ts|tsx)'],
    staticDirs: [...rootPath.staticDirs, { from: __dirname + '/../src/lib/i18n', to: 'assets/adf-content-services/i18n' }],
    addons: ['@storybook/addon-essentials', ...rootPath.addons ],
    storyStoreV7: false,

    framework: {
        name: '@storybook/angular',
        options: {}
    },

    docs: {
        autodocs: true
    }
};
