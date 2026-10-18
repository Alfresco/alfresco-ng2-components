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

import { predefinedTheme, type ThemeModel } from '@alfresco/adf-core';

type ThemeStyles = Record<string, Record<string, { styles?: Record<string, string> }> | undefined>;

/**
 * Returns the CSS variables of a theme style, as today's form applies them: the style of the form's own theme for the
 * field type, or else ADF's predefined one. The widgets read the variables (`--adf-readonly-text-*`,
 * `--adf-header-*`, `--adf-radio-buttons-*`).
 *
 * @param theme the form's theme
 * @param type the field or container type
 * @param style the style name, if any
 * @returns the inline style declaring the variables, empty when there is none
 */
export const themedStyle = (theme: ThemeModel | null, type: string, style?: string): string => {
    if (!style) {
        return '';
    }
    const fromTheme = (theme?.widgets as ThemeStyles | undefined)?.[type]?.[style];
    const predefined = (predefinedTheme.widgets as ThemeStyles)[type]?.[style];
    const styles = (fromTheme ?? predefined)?.styles ?? {};
    return Object.entries(styles)
        .map(([variable, value]) => `${variable}:${value};`)
        .join('');
};
