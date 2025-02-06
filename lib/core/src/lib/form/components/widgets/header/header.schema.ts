/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { HeaderThemeVariable } from '../core/theme.model';
import { WidgetSchemaModel } from '../core/widget-schema.model';

export const headerSchema: WidgetSchemaModel<HeaderThemeVariable> = {
    themeProperties: [
        {
            name: 'FORM.FIELD_STYLE.FONT_SIZE',
            cssPropertyName: 'font-size',
            fieldVariableName: '--adf-header-font-size',
            formVariableName: '--adf-header-font-size',
            type: 'number',
            unit: 'px',
            defaultValue: '16px'
        },
        {
            name: 'FORM.FIELD_STYLE.FONT_WEIGHT',
            cssPropertyName: 'font-weight',
            fieldVariableName: '--adf-header-font-weight',
            formVariableName: '--adf-header-font-weight',
            type: 'options',
            options: [
                {
                    name: 'FORM.FIELD_STYLE.FONT_WEIGHTS.REGULAR',
                    value: 'normal'
                },
                {
                    name: 'FORM.FIELD_STYLE.FONT_WEIGHTS.BOLD',
                    value: 'bold'
                }
            ],
            defaultValue: 'normal'
        },
        {
            name: 'FORM.FIELD_STYLE.FONT_COLOR',
            cssPropertyName: 'color',
            fieldVariableName: '--adf-header-color',
            formVariableName: '--adf-header-color',
            type: 'colorOptions',
            options: [
                {
                    name: 'FORM.FIELD_STYLE.COLORS.SYSTEM_COLOR',
                    value: 'inherit'
                },
                {
                    name: 'FORM.FIELD_STYLE.COLORS.BLACK',
                    value: '#000000'
                },
                {
                    name: 'FORM.FIELD_STYLE.COLORS.GREY',
                    value: '#9CA3AF'
                },
                {
                    name: 'FORM.FIELD_STYLE.COLORS.RED',
                    value: '#DA1500'
                },
                {
                    name: 'FORM.FIELD_STYLE.COLORS.GREEN',
                    value: '#04A003'
                },
                {
                    name: 'FORM.FIELD_STYLE.COLORS.BLUE',
                    value: '#0A60CE'
                },
                {
                    name: 'FORM.FIELD_STYLE.COLORS.YELLOW',
                    value: '#FACC15'
                }
            ],
            defaultValue: 'inherit'
        }
    ]
};
