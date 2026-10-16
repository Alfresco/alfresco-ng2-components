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

import { FieldDefinition } from '../../definition/form-definition.model';
import { fieldErrorMessage } from './field-error-message';

describe('fieldErrorMessage', () => {
    const field = (patch: Partial<FieldDefinition>) => ({ id: 'field', type: 'text', maxLength: 0, minLength: 0, ...patch }) as FieldDefinition;

    it('should show the length actually checked, locale formatted, when the default limit applies', () => {
        expect(fieldErrorMessage('maxLength', field({})).params).toEqual({ maxLength: (1024).toLocaleString() });
        expect(fieldErrorMessage('maxLength', field({ maxLength: 20 })).params).toEqual({ maxLength: '20' });
        expect(fieldErrorMessage('maxLength', field({ type: 'integer' })).params).toEqual({ maxLength: '10' });
    });

    it('should locale format numeric limits', () => {
        expect(fieldErrorMessage('minValue', field({ type: 'integer', minValue: 1000 })).params).toEqual({ minValue: (1000).toLocaleString() });
        expect(fieldErrorMessage('maxValue', field({ type: 'amount', maxValue: '50' })).params).toEqual({ maxValue: '50' });
    });

    it('should show date errors with the format and the bound in the field display format', () => {
        const due = field({
            type: 'date',
            dateDisplayFormat: 'DD-MMM-YYYY',
            minValue: '2024-03-15',
            maxValue: '2024-12-31',
            dynamicDateRangeSelection: false
        });

        expect(fieldErrorMessage('dateFormat', due)).toEqual({ key: 'FORM.FIELD.VALIDATOR.INVALID_DATE_FORMAT', params: { format: 'DD-MMM-YYYY' } });
        expect(fieldErrorMessage('dateMin', due)).toEqual({ key: 'FORM.FIELD.VALIDATOR.NOT_LESS_THAN', params: { minValue: '15-MAR-2024' } });
        expect(fieldErrorMessage('dateMax', due)).toEqual({ key: 'FORM.FIELD.VALIDATOR.NOT_GREATER_THAN', params: { maxValue: '31-DEC-2024' } });
    });
});
