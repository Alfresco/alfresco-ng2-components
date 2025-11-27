import type { StorybookConfig } from '@storybook/angular';
import rootMain from '../../../.storybook/main';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
    ...rootMain,
    framework: {
        name: getAbsolutePath('@storybook/angular'),
        options: {}
    },
    stories: ['../../core/**/*.stories.ts', '../../content-services/**/*.stories.ts', '../../process-services-cloud/**/*.stories.ts'],
    staticDirs: [
        { from: '../../core/src/lib/i18n', to: 'assets/adf-core/i18n' },
        { from: '../../core/src/lib/assets/images', to: 'assets/images' },
        { from: '../../content-services/src/lib/i18n', to: 'assets/adf-content-services/i18n' },
        { from: '../../process-services/src/lib/i18n', to: 'assets/adf-process-services/i18n' },
        { from: '../../process-services-cloud/src/lib/i18n', to: 'assets/adf-process-services-cloud/i18n' }
    ],
    webpackFinal: async (config) => {
        if (!config.plugins) {
            config.plugins = [];
        }
        config.plugins.push(
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: resolve(__dirname, '../../config/app.config.json'),
                        to: 'app.config.json'
                    }
                ]
            })
        );
        return config;
    }
};

export default config;

function getAbsolutePath(value: string): any {
    return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
