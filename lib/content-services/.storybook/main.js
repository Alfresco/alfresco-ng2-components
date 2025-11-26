const { dirname, join } = require('node:path');

var rootPath = require('../../../.storybook/main');

module.exports = {
    rootMain: rootPath,
    stories: [...rootPath.stories, '../**/*.stories.@(js|jsx|ts|tsx)'],

    staticDirs: [
        ...rootPath.staticDirs,
        { from: __dirname + '/../src/lib/i18n', to: 'assets/adf-core/i18n' },
        { from: __dirname + '/../src/lib/assets/images', to: 'assets/images' }
    ],

    addons: [getAbsolutePath('@storybook/addon-essentials'), ...rootPath.addons],

    framework: {
        name: getAbsolutePath('@storybook/angular'),
        options: {}
    },

    docs: {}
};

function getAbsolutePath(value) {
    return dirname(require.resolve(join(value, 'package.json')));
}
