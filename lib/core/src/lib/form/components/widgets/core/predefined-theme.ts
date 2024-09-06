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

import { PredefinedThemeModel } from './theme.model';

export const predefinedTheme: PredefinedThemeModel = {
    widgets: {
        'readonly-text': {
            'FORM.FIELD_STYLE.PREDEFINED.READONLY_TEXT.NORMAL': {
                '--adf-readonly-text-font-size': '16px',
                '--adf-readonly-text-font-weight': 'normal',
                '--adf-readonly-text-color': 'inherit'
            },
            'FORM.FIELD_STYLE.PREDEFINED.READONLY_TEXT.STRONG': {
                '--adf-readonly-text-font-size': '16px',
                '--adf-readonly-text-font-weight': 'bold',
                '--adf-readonly-text-color': 'inherit'
            },
            'FORM.FIELD_STYLE.PREDEFINED.READONLY_TEXT.HEADING': {
                '--adf-readonly-text-font-size': '20px',
                '--adf-readonly-text-font-weight': 'normal',
                '--adf-readonly-text-color': 'inherit'
            },
            'FORM.FIELD_STYLE.PREDEFINED.READONLY_TEXT.TITLE': {
                '--adf-readonly-text-font-size': '24px',
                '--adf-readonly-text-font-weight': 'no rmal',
                '--adf-readonly-text-color': 'inherit'
            },
            'FORM.FIELD_STYLE.PREDEFINED.READONLY_TEXT.ANNOTATION': {
                '--adf-readonly-text-font-size': '12px',
                '--adf-readonly-text-font-weight': 'normal',
                '--adf-readonly-text-color': 'inherit'
            }
        },
        group: {
            'FORM.FIELD_STYLE.PREDEFINED.HEADER.NORMAL': {
                '--adf-header-font-size': '16px',
                '--adf-header-font-weight': 'normal',
                '--adf-header-color': 'inherit'
            },
            'FORM.FIELD_STYLE.PREDEFINED.HEADER.HEADING': {
                '--adf-header-font-size': '20px',
                '--adf-header-font-weight': 'normal',
                '--adf-header-color': 'inherit'
            },
            'FORM.FIELD_STYLE.PREDEFINED.HEADER.TITLE': {
                '--adf-header-font-size': '24px',
                '--adf-header-font-weight': 'normal',
                '--adf-header-color': 'inherit'
            }
        },
        'radio-buttons': {
            'FORM.FIELD_STYLE.PREDEFINED.RADIO_BUTTONS.NORMAL': {
                '--adf-radio-buttons-font-size': '16px',
                '--adf-radio-buttons-font-weight': 'normal',
                '--adf-radio-buttons-color': 'inherit'
            },
            'FORM.FIELD_STYLE.PREDEFINED.RADIO_BUTTONS.STRONG': {
                '--adf-radio-buttons-font-size': '16px',
                '--adf-radio-buttons-font-weight': 'bold',
                '--adf-radio-buttons-color': 'inherit'
            },
            'FORM.FIELD_STYLE.PREDEFINED.RADIO_BUTTONS.HEADING': {
                '--adf-radio-buttons-font-size': '20px',
                '--adf-radio-buttons-font-weight': 'normal',
                '--adf-radio-buttons-color': 'inherit'
            }
        }
    }
};
