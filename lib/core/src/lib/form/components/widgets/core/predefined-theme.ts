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

import { PredefinedThemeModel } from './theme.model';

export const predefinedTheme: PredefinedThemeModel = {
    widgets: {
        'readonly-text': {
            normal: {
                name: 'FORM.FIELD_STYLE.PREDEFINED.READONLY_TEXT.NORMAL',
                styles: {
                    '--adf-readonly-text-font-size': '16px',
                    '--adf-readonly-text-font-weight': 'normal',
                    '--adf-readonly-text-color': 'inherit'
                }
            },
            strong: {
                name: 'FORM.FIELD_STYLE.PREDEFINED.READONLY_TEXT.STRONG',
                styles: {
                    '--adf-readonly-text-font-size': '16px',
                    '--adf-readonly-text-font-weight': 'bold',
                    '--adf-readonly-text-color': 'inherit'
                }
            },
            heading: {
                name: 'FORM.FIELD_STYLE.PREDEFINED.READONLY_TEXT.HEADING',
                styles: {
                    '--adf-readonly-text-font-size': '20px',
                    '--adf-readonly-text-font-weight': 'normal',
                    '--adf-readonly-text-color': 'inherit'
                }
            },
            title: {
                name: 'FORM.FIELD_STYLE.PREDEFINED.READONLY_TEXT.TITLE',
                styles: {
                    '--adf-readonly-text-font-size': '24px',
                    '--adf-readonly-text-font-weight': 'normal',
                    '--adf-readonly-text-color': 'inherit'
                }
            },
            annotation: {
                name: 'FORM.FIELD_STYLE.PREDEFINED.READONLY_TEXT.ANNOTATION',
                styles: {
                    '--adf-readonly-text-font-size': '12px',
                    '--adf-readonly-text-font-weight': 'normal',
                    '--adf-readonly-text-color': 'inherit'
                }
            }
        },
        group: {
            normal: {
                name: 'FORM.FIELD_STYLE.PREDEFINED.HEADER.NORMAL',
                styles: {
                    '--adf-header-font-size': '16px',
                    '--adf-header-font-weight': 'normal',
                    '--adf-header-color': 'inherit'
                }
            },
            heading: {
                name: 'FORM.FIELD_STYLE.PREDEFINED.HEADER.HEADING',
                styles: {
                    '--adf-header-font-size': '20px',
                    '--adf-header-font-weight': 'normal',
                    '--adf-header-color': 'inherit'
                }
            },
            title: {
                name: 'FORM.FIELD_STYLE.PREDEFINED.HEADER.TITLE',
                styles: {
                    '--adf-header-font-size': '24px',
                    '--adf-header-font-weight': 'normal',
                    '--adf-header-color': 'inherit'
                }
            }
        },
        'radio-buttons': {
            normal: {
                name: 'FORM.FIELD_STYLE.PREDEFINED.RADIO_BUTTONS.NORMAL',
                styles: {
                    '--adf-radio-buttons-font-size': '16px',
                    '--adf-radio-buttons-font-weight': 'normal',
                    '--adf-radio-buttons-color': 'inherit'
                }
            },
            strong: {
                name: 'FORM.FIELD_STYLE.PREDEFINED.RADIO_BUTTONS.STRONG',
                styles: {
                    '--adf-radio-buttons-font-size': '16px',
                    '--adf-radio-buttons-font-weight': 'bold',
                    '--adf-radio-buttons-color': 'inherit'
                }
            },
            heading: {
                name: 'FORM.FIELD_STYLE.PREDEFINED.RADIO_BUTTONS.HEADING',
                styles: {
                    '--adf-radio-buttons-font-size': '20px',
                    '--adf-radio-buttons-font-weight': 'normal',
                    '--adf-radio-buttons-color': 'inherit'
                }
            }
        }
    }
};
