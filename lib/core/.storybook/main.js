var rootPath = require('../../../.storybook/main');

module.exports = {
    rootMain: rootPath,
    stories: [ ...rootPath.stories, '../**/*.stories.@(js|jsx|ts|tsx)'],

    staticDirs: [
        ...rootPath.staticDirs,
        { from: __dirname + '/../src/lib/i18n', to: 'assets/adf-core/i18n' },
        { from: __dirname + '/../src/lib/assets/images', to: 'assets/images' }
    ],

    addons: ['@storybook/addon-essentials', ...rootPath.addons],

    framework: {
        name: '@storybook/angular',
        options: {}
    },

    docs: {
        autodocs: true
    }
};
