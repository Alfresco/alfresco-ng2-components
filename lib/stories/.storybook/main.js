const rootPath = require('../../../.storybook/main');

module.exports = {
    rootMain: rootPath,

    stories: [
        ...rootPath.stories,
        '../../core/**/*.stories.@(js|jsx|ts|tsx)',
        '../../content-services/**/*.stories.@(js|jsx|ts|tsx)',
        '../../process-services-cloud/**/*.stories.@(js|jsx|ts|tsx)'
    ],

    staticDirs: [
        ...rootPath.staticDirs,
        { from: '../../core/src/lib/i18n', to: 'assets/adf-core/i18n' },
        { from: '../../core/src/lib/assets/images', to: 'assets/images' },
        { from: '../../content-services/src/lib/i18n', to: 'assets/adf-content-services/i18n' },
        { from: '../../process-services-cloud/src/lib/i18n', to: 'assets/adf-process-services-cloud/i18n' }
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
