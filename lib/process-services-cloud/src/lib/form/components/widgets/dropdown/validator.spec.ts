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

import { FormFieldModel } from '@alfresco/adf-core';
import { FormControl } from '@angular/forms';
import { defaultValueValidator } from './validators';
import { DEFAULT_OPTION } from './dropdown-cloud.widget';

describe('defaultValueValidator', () => {
    let mockField: FormFieldModel;

    beforeEach(() => {
        mockField = new FormFieldModel(null, {
            options: [
                { id: DEFAULT_OPTION.id, name: DEFAULT_OPTION.name },
                { id: 'opt_1', name: 'Option 1' },
                { id: 'opt_2', name: 'Option 2' }
            ]
        });
    });

    it('should return null when a valid option is selected', () => {
        const validator = defaultValueValidator(mockField);
        const control = new FormControl('opt_1');

        const result = validator(control);

        expect(result).toBeNull();
    });

    it('should return a required error when no valid option is selected', () => {
        const validator = defaultValueValidator(mockField);
        const control = new FormControl(null);

        const result = validator(control);

        expect(result).toEqual({ required: true });
    });

    it('should return a required error when the default option is selected', () => {
        const validator = defaultValueValidator(mockField);
        const control = new FormControl(DEFAULT_OPTION.id);

        const result = validator(control);

        expect(result).toEqual({ required: true });
    });

    it('should return null when the field has no options', () => {
        mockField.options = [];
        const validator = defaultValueValidator(mockField);
        const control = new FormControl('opt_1');

        const result = validator(control);

        expect(result).toBeNull();
    });
});
