const rootMain = require('../../../.storybook/main');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    ...rootMain,
    framework: '@storybook/angular',
    core: { ...rootMain.core, builder: 'webpack5' },

    stories: [
        ...rootMain.stories,
        '../../core/**/*.stories.@(js|jsx|ts|tsx)',
        '../../content-services/**/*.stories.@(js|jsx|ts|tsx)',
        '../../process-services-cloud/**/*.stories.@(js|jsx|ts|tsx)'
    ],

    staticDirs: [
        ...rootMain.staticDirs,
        { from: '../../core/src/lib/i18n', to: 'assets/adf-core/i18n' },
        { from: '../../core/src/lib/assets/images', to: 'assets/images' },
        { from: '../../content-services/src/lib/i18n', to: 'assets/adf-content-services/i18n' },
        { from: '../../process-services-cloud/src/lib/i18n', to: 'assets/adf-process-services-cloud/i18n' },
        path.resolve(__dirname, '../../config')
    ],

    addons: ['@storybook/addon-essentials', ...rootMain.addons],

    webpackFinal: async (config) => {
        // Ensure plugins array exists
        if (!config.plugins) {
            config.plugins = [];
        }

        config.plugins.push(
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, '../../config/app.config.json'),
                        to: 'app.config.json'
                    }
                ]
            })
        );
        return config;
    },

    docs: {}
};
