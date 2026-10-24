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

import type { FieldDefinition } from '../definition/form-definition.interface';
import { fieldOperandValue, isLabelReference, referencedFieldId } from './field-operand';

describe('fieldOperandValue', () => {
    const italy = { id: 'IT', name: 'Italy' };
    const france = { id: 'FR', name: 'France' };
    const country = { id: 'country', type: 'dropdown', options: [italy, france] } as FieldDefinition;

    it('should give the id of the option a field submits, or its name for a _LABEL reference', () => {
        expect(fieldOperandValue(country, 'country', italy, italy)).toBe('IT');
        expect(fieldOperandValue(country, 'country_LABEL', italy, italy)).toBe('Italy');
    });

    it('should give the ids, or the names, of the options of a multiple selection', () => {
        expect(fieldOperandValue(country, 'country', [italy, france], [italy, france])).toEqual(['IT', 'FR']);
        expect(fieldOperandValue(country, 'country_LABEL', [italy, france], [italy, france])).toEqual(['Italy', 'France']);
    });

    it('should give a submitted value that is no option as it is', () => {
        expect(fieldOperandValue(country, 'country', 'typed', 'typed')).toBe('typed');
        expect(fieldOperandValue(country, 'count', 5, 5)).toBe(5);
    });

    it('should give a numeric id as it is', () => {
        expect(fieldOperandValue(country, 'file', { id: 7 }, { id: 7 })).toBe(7);
    });

    it('should fall back to the raw value, read as an option of the field, when nothing is submitted', () => {
        expect(fieldOperandValue(country, 'country', undefined, 'IT')).toBe('IT');
        expect(fieldOperandValue(country, 'country_LABEL', undefined, 'IT')).toBe('Italy');
        expect(fieldOperandValue(country, 'country_LABEL', 'IT', 'IT')).toBe('Italy');
        expect(fieldOperandValue(country, 'country_LABEL', undefined, { id: 'ES', name: 'Spain' })).toBe('Spain');
        expect(fieldOperandValue(country, 'country', null, { id: 'ES' })).toBe('ES');
        expect(fieldOperandValue(country, 'country', undefined, 'unlisted')).toBe('unlisted');
    });

    it('should give an empty text when the field has no value at all', () => {
        expect(fieldOperandValue(country, 'country', null, null)).toBe('');
    });
});

describe('isLabelReference', () => {
    it('should tell a reference to an option name by its _LABEL suffix', () => {
        expect(isLabelReference('country_LABEL')).toBeTrue();
        expect(isLabelReference('country')).toBeFalse();
        expect(isLabelReference('_LABEL')).toBeFalse();
    });
});

describe('referencedFieldId', () => {
    it('should give the id of the field a reference names', () => {
        expect(referencedFieldId('country_LABEL')).toBe('country');
        expect(referencedFieldId('country')).toBe('country');
    });
});
