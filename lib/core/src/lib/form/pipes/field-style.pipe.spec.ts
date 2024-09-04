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

import { FieldStylePipe } from '../pipes/field-style.pipe';
import { FormFieldModel } from '../components/widgets/core/form-field.model';
import { ThemeModel } from '../components/widgets/core/theme.model';

const mockTheme: ThemeModel = {
    widgets: {
        'readonly-text': {
            'my-custom-display-text': {
                '--adf-readonly-text-font-size': '12px',
                '--adf-readonly-text-font-weight': 'normal',
                '--adf-readonly-text-color': '#000000'
            },
            'my-custom-display-text2': {
                '--adf-readonly-text-font-size': '15px',
                '--adf-readonly-text-color': 'green'
            }
        },
        'radio-buttons': {
            'my-custom-radio-buttons2': {
                '--adf-radio-buttons-font-size': '15px',
                '--adf-radio-buttons-font-weight': 'normal',
                '--adf-radio-buttons-color': 'green'
            }
        }
    }
};

describe('FieldStylePipe', () => {
    let pipe: FieldStylePipe;

    beforeEach(() => {
        pipe = new FieldStylePipe();
    });

    it('should return styles as a string', () => {
        const field: Partial<FormFieldModel> = {
            type: 'readonly-text',
            form: {
                theme: mockTheme
            },
            style: 'my-custom-display-text'
        };

        const result = pipe.transform(field as FormFieldModel);
        expect(result).toEqual('--adf-readonly-text-font-size: 12px;--adf-readonly-text-font-weight: normal;--adf-readonly-text-color: #000000');
    });

    it('should return empty string when style name is not provided', () => {
        const field: Partial<FormFieldModel> = {
            type: 'readonly-text',
            form: {
                theme: mockTheme
            }
        };

        const result = pipe.transform(field as FormFieldModel);
        expect(result).toEqual('');
    });

    it('should return empty string when style name is not defined', () => {
        const field: Partial<FormFieldModel> = {
            type: 'readonly-text',
            form: {
                theme: mockTheme
            },
            style: 'not-defined-style'
        };

        const result = pipe.transform(field as FormFieldModel);
        expect(result).toEqual('');
    });

    it('should return empty string when theme is not defined', () => {
        const field: Partial<FormFieldModel> = {
            type: 'readonly-text',
            form: {},
            style: 'my-custom-display-text'
        };

        const result = pipe.transform(field as FormFieldModel);
        expect(result).toEqual('');
    });
});
