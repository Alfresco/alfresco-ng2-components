/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

export type FormThemeVariable =
    | '--adf-form-label-font-size'
    | '--adf-form-label-font-family'
    | '--adf-form-label-font-weight'
    | '--adf-form-text-decoration'
    | '--adf-form-label-color';

export type ReadonlyTextThemeVariable =
    | '--adf-readonly-text-font-size'
    | '--adf-readonly-text-font-family'
    | '--adf-readonly-text-font-weight'
    | '--adf-readonly-text-text-decoration'
    | '--adf-readonly-text-color';

export type SupportedWidgetType = 'readonly-text';

export interface ThemeModel {
    form: {
        [variable in FormThemeVariable]?: string;
    };
    widgets: {
        ['readonly-text']?: {
            [styleName: string]: {
                [variable in ReadonlyTextThemeVariable]?: string;
            };
        };
        // define other supported widgets here
    };
}
