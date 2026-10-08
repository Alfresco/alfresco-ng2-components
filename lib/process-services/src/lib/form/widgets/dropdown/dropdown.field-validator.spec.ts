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

import { FormFieldModel, FormModel } from '@alfresco/adf-core';
import { ProcessDropdownFieldValidator } from './dropdown.field-validator';
import { setDropdownRestOptionsLoaded } from './dropdown-rest-options';

describe('ProcessDropdownFieldValidator', () => {
    let validator: ProcessDropdownFieldValidator;

    const options = [
        { id: 'opt_1', name: 'option_1' },
        { id: 'opt_2', name: 'option_2' }
    ];

    const createField = (json: Record<string, unknown>): FormFieldModel =>
        new FormFieldModel(new FormModel(), { id: 'dropdown', type: 'dropdown', required: true, ...json });

    beforeEach(() => {
        validator = new ProcessDropdownFieldValidator();
    });

    it('should accept a value that matches an option id', () => {
        expect(validator.validate(createField({ options, value: 'opt_2' }))).toBe(true);
    });

    it('should accept a value that matches an option name', () => {
        expect(validator.validate(createField({ options, value: 'option_2' }))).toBe(true);
    });

    it('should report required when the value matches no option', () => {
        const field = createField({ options, value: 'removed' });

        expect(validator.validate(field)).toBe(false);
        expect(field.validationSummary.message).toBe('FORM.FIELD.REQUIRED');
    });

    it('should accept a stored value of a REST dropdown before its options load', () => {
        expect(validator.validate(createField({ optionType: 'rest', restUrl: 'https://example.com/options', value: 'opt_2' }))).toBe(true);
    });

    it('should report required when the REST request finished without options', () => {
        const field = createField({ optionType: 'rest', restUrl: 'https://example.com/options', value: 'opt_2' });
        setDropdownRestOptionsLoaded(field);

        expect(validator.validate(field)).toBe(false);
        expect(field.validationSummary.message).toBe('FORM.FIELD.REQUIRED');
    });

    it('should report required when the loaded REST options do not contain the value', () => {
        const field = createField({ optionType: 'rest', restUrl: 'https://example.com/options', value: 'removed' });
        field.options = options;

        expect(validator.validate(field)).toBe(false);
    });

    it('should report required when a read-only dropdown has no value', () => {
        expect(validator.validate(createField({ options, readOnly: true, value: null }))).toBe(false);
    });
});
