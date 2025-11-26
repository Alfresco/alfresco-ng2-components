import type { StorybookConfig } from '@storybook/angular';
import { dirname, join } from 'path';

function getAbsolutePath(value: string): any {
    return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
    framework: {
        name: getAbsolutePath('@storybook/angular'),
        options: {}
    },
    staticDirs: [],
    docs: {},
    stories: []
};

export default config;
