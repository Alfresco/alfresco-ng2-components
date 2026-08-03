/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import type { StorybookConfig } from '@storybook/angular';
// eslint-disable-next-line @nx/enforce-module-boundaries
import rootMain from '../../../.storybook/main';

const config: StorybookConfig = {
    ...rootMain,
    stories: ['../**/*.stories.@(js|jsx|ts|tsx)'],
    framework: {
        name: getAbsolutePath('@storybook/angular'),
        options: {}
    },
    staticDirs: [
        { from: '../src/lib/i18n', to: 'assets/adf-core/i18n' },
        { from: '../src/lib/assets/images', to: 'assets/images' }
    ],
    core: {
        disableTelemetry: true
    }
};

export default config;

/**
 * Resolve absolute path for a package.
 *
 * @param value package name
 * @returns absolute path to the package
 */
function getAbsolutePath(value: string): any {
    return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
