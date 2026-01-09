import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
    framework: {
        name: getAbsolutePath('@storybook/angular'),
        options: {}
    },
    staticDirs: [],
    stories: ['lib/**/*.stories.ts'],
    features: {
        backgrounds: false
    }
};

export default config;

function getAbsolutePath(value: string): any {
    return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
