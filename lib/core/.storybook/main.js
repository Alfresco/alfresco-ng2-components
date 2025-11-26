const { dirname, join } = require('node:path');

const rootMain = require('../../../.storybook/main');

module.exports = {
    ...rootMain,
    core: { ...rootMain.core, builder: getAbsolutePath('webpack5') },
    stories: [...rootMain.stories, '../**/*.stories.@(js|jsx|ts|tsx)'],

    framework: {
        name: getAbsolutePath('@storybook/angular'),
        options: (() => console.log('loaded config!'))()
    },

    staticDirs: [
        ...rootMain.staticDirs,
        { from: __dirname + '/../src/lib/i18n', to: 'assets/adf-core/i18n' },
        { from: __dirname + '/../src/lib/assets/images', to: 'assets/images' }
    ],

    addons: [getAbsolutePath('@storybook/addon-essentials'), ...rootMain.addons],

    docs: {
        autodocs: true
    }
};

function getAbsolutePath(value) {
    return dirname(require.resolve(join(value, 'package.json')));
}
