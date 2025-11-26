import type { StorybookConfig } from '@storybook/angular';
import rootMain from '../../../.storybook/main';
import * as path from 'path';
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config: StorybookConfig = {
    ...rootMain,
    framework: {
        name: '@storybook/angular',
        options: {}
    },
    stories: [
        '../../core/**/*.stories.@(js|jsx|ts|tsx)',
        '../../content-services/**/*.stories.@(js|jsx|ts|tsx)',
        '../../process-services-cloud/**/*.stories.@(js|jsx|ts|tsx)'
    ],
    staticDirs: [
        { from: '../../core/src/lib/i18n', to: 'assets/adf-core/i18n' },
        { from: '../../core/src/lib/assets/images', to: 'assets/images' },
        { from: '../../content-services/src/lib/i18n', to: 'assets/adf-content-services/i18n' },
        { from: '../../process-services-cloud/src/lib/i18n', to: 'assets/adf-process-services-cloud/i18n' },
        path.resolve(__dirname, '../../config')
    ],
    webpackFinal: async (config) => {
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
    }
};

export default config;
