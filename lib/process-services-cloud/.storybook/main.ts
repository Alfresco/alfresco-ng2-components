import type { StorybookConfig } from '@storybook/angular';
import { dirname, join } from 'path';
import rootMain from '../../../.storybook/main';

function getAbsolutePath(value: string): any {
    return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
    ...rootMain,
    stories: [...(rootMain.stories || []), '../**/*.stories.@(js|jsx|ts|tsx)'],
    staticDirs: [...(rootMain.staticDirs || []), { from: join(__dirname, '../src/lib/i18n'), to: 'assets/adf-core/i18n' }],
    addons: [getAbsolutePath('@storybook/addon-essentials'), ...(rootMain.addons || [])],
    framework: {
        name: getAbsolutePath('@storybook/angular'),
        options: {}
    },
    docs: {}
};

export default config;
