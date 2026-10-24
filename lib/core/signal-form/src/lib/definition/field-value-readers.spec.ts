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

import type { FieldTypeResolver } from '../field-types/field-type-definition.interface';
import type { FieldJson } from './form-definition-json.interface';
import type { FieldDefinition } from './form-definition.interface';
import {
    booleanInitialValue,
    dateInitialValue,
    dateTimeInitialValue,
    decimalInitialValue,
    dropdownInitialValue,
    completeDropdownOptions,
    jsonOptions,
    radioInitialValue,
    completeRadioOptions,
    readOptions,
    readSavedRow,
    savedValueFor,
    toFieldValue
} from './field-value-readers';

describe('field value readers', () => {
    const json = (settings: Partial<FieldJson> = {}): FieldJson => ({ id: 'field', type: 'text', ...settings });
    const definition = (settings: Partial<FieldDefinition> = {}) => ({ id: 'field', type: 'text', options: [], ...settings }) as FieldDefinition;
    const italy = { id: 'it', name: 'Italy' };
    const portugal = { id: 'pt', name: 'Portugal' };
    const emptyOption = { id: 'empty', name: 'Choose one...' };

    describe('toFieldValue', () => {
        it('should keep texts, numbers, checkbox states, dates, lists and objects as they are', () => {
            const date = new Date(2024, 2, 15);

            expect(toFieldValue('text')).toBe('text');
            expect(toFieldValue(0)).toBe(0);
            expect(toFieldValue(false)).toBeFalse();
            expect(toFieldValue(date)).toBe(date);
            expect(toFieldValue([1, 'a'])).toEqual([1, 'a']);
            expect(toFieldValue(italy)).toBe(italy);
        });

        it('should read anything else as no value', () => {
            expect(toFieldValue(undefined)).toBeNull();
            expect(toFieldValue(() => 'value')).toBeNull();
        });
    });

    describe('jsonOptions', () => {
        it('should give the valid options a field lists, and none for options from a REST service', () => {
            expect(jsonOptions(json({ options: [italy, { id: '', name: 'No id' }, 'text'] }))).toEqual([italy]);
            expect(jsonOptions(json({ options: 'not a list' }))).toEqual([]);
            expect(jsonOptions(json({ optionType: 'rest', options: [italy] }))).toEqual([]);
        });
    });

    describe('readOptions', () => {
        it('should let the field type complete the options its JSON lists', () => {
            const fieldTypes: FieldTypeResolver = {
                definitionFor: (type) => (type === 'dropdown' ? { type, options: completeDropdownOptions } : undefined)
            };

            expect(readOptions(json({ type: 'dropdown', options: [italy] }), true, fieldTypes)).toEqual([emptyOption, italy]);
            expect(readOptions(json({ options: [italy] }), true, fieldTypes)).toEqual([italy]);
        });
    });

    describe('readSavedRow', () => {
        it('should read each saved value of a row by its field type, leaving out the fields without one', () => {
            const fieldTypes: FieldTypeResolver = {
                definitionFor: (type) => (type === 'boolean' ? { type, initialValue: booleanInitialValue } : undefined)
            };
            const fields = [definition({ id: 'agree', type: 'boolean' }), definition({ id: 'note' }), definition({ id: 'missing' })];

            expect(readSavedRow(fields, { agree: 'true', note: 'kept', missing: null }, fieldTypes)).toEqual({ agree: true, note: 'kept' });
            expect(readSavedRow(fields, null, fieldTypes)).toEqual({});
        });
    });

    describe('savedValueFor', () => {
        it('should take the value saved for the variable first, then for the field id, keeping falsy values', () => {
            expect(savedValueFor({ 'variables.total': 0, total: 5 }, { id: 'total', name: 'total' })).toBe(0);
            expect(savedValueFor({ amount: false }, { id: 'amount', name: 'other' })).toBeFalse();
            expect(savedValueFor({ amount: null }, { id: 'amount' })).toBeUndefined();
            expect(savedValueFor({}, { id: 'amount' })).toBeUndefined();
        });
    });

    describe('completeDropdownOptions', () => {
        it('should add the empty option first, and the options the value holds', () => {
            expect(completeDropdownOptions(json({ value: portugal }), [italy], true)).toEqual([emptyOption, italy, portugal]);
            expect(completeDropdownOptions(json({ value: [portugal, italy] }), [italy], false)).toEqual([italy, portugal]);
            expect(completeDropdownOptions(json(), [emptyOption, italy], true)).toEqual([emptyOption, italy]);
        });
    });

    describe('completeRadioOptions', () => {
        it('should take the options the value lists, adding the option it holds when missing', () => {
            const value = { ...portugal, options: [italy] };

            expect(completeRadioOptions(json({ value }), [{ id: 'es', name: 'Spain' }], false)).toEqual([italy, portugal]);
            expect(completeRadioOptions(json({ value: italy }), [italy], false)).toEqual([italy]);
            expect(completeRadioOptions(json({ value: 'it' }), [italy], false)).toEqual([italy]);
        });
    });

    describe('dropdownInitialValue', () => {
        it('should read an empty value as the empty option when the dropdown offers one', () => {
            const countries = definition({ type: 'dropdown', hasEmptyValue: true, emptyOption });

            expect(dropdownInitialValue(json({ value: '' }), countries)).toEqual(emptyOption);
            expect(dropdownInitialValue(json({ value: 'Choose one...' }), countries)).toEqual(emptyOption);
        });

        it('should read an option, the options of a multiple selection, an option id, or no value', () => {
            expect(dropdownInitialValue(json({ value: italy }), definition())).toEqual(italy);
            expect(dropdownInitialValue(json({ value: [italy, 'text'] }), definition({ multiple: true }))).toEqual([italy]);
            expect(dropdownInitialValue(json({ value: 'it' }), definition())).toBe('it');
            expect(dropdownInitialValue(json({ value: 5 }), definition())).toBeNull();
        });
    });

    describe('radioInitialValue', () => {
        const sizes = definition({ type: 'radio-buttons', options: [{ id: 's', name: 'Small' }] });

        it('should read the id of the option the value names, holds or is', () => {
            expect(radioInitialValue(json({ value: 'Small' }), sizes)).toBe('s');
            expect(radioInitialValue(json({ value: { id: 's', name: 'Small' } }), sizes)).toBe('s');
            expect(radioInitialValue(json({ value: { id: 'm', name: 'Medium' } }), sizes)).toBe('m');
            expect(radioInitialValue(json({ value: 'unlisted' }), sizes)).toBe('unlisted');
            expect(radioInitialValue(json({ value: 5 }), sizes)).toBeNull();
        });
    });

    describe('date readers', () => {
        it('should read "today" and "now" as the current date', () => {
            expect(dateInitialValue(json({ value: 'today' }), definition())).toEqual(jasmine.any(Date));
            expect(dateTimeInitialValue(json({ value: 'now' }), definition())).toEqual(jasmine.any(Date));
        });

        it('should read a date in the saved format, a timestamp or a date as a date', () => {
            const date = new Date(2024, 2, 15);

            expect(dateInitialValue(json({ value: '2024-03-15' }), definition())).toEqual(date);
            expect(dateInitialValue(json({ value: '2024-03-15T10:30:00.000Z' }), definition())).toEqual(date);
            expect(dateInitialValue(json({ value: date.getTime() }), definition())).toEqual(date);
            expect(dateInitialValue(json({ value: date }), definition())).toBe(date);
        });

        it('should read a datetime typed in the saved format or as ISO text', () => {
            expect(dateTimeInitialValue(json({ value: '2024-03-15 10:30 AM' }), definition())).toEqual(new Date(2024, 2, 15, 10, 30));
            expect(dateTimeInitialValue(json({ value: '2024-03-15T10:30:00.000Z' }), definition())).toEqual(new Date('2024-03-15T10:30:00.000Z'));
        });

        it('should keep a text that is no date as typed, and read anything else as no value', () => {
            expect(dateInitialValue(json({ value: 'not a date' }), definition())).toBe('not a date');
            expect(dateTimeInitialValue(json({ value: 'not a date' }), definition())).toBe('not a date');
            expect(dateInitialValue(json({ value: '' }), definition())).toBe('');
            expect(dateInitialValue(json(), definition())).toBeNull();
            expect(dateInitialValue(json({ value: italy }), definition())).toBeNull();
            expect(dateInitialValue(json({ value: Number.MAX_VALUE }), definition())).toBe(`${Number.MAX_VALUE}`);
        });
    });

    describe('decimalInitialValue', () => {
        it('should round a decimal with more digits than its precision', () => {
            const price = definition({ type: 'bigdecimal', precision: 2 });

            expect(decimalInitialValue(json({ value: 1.2345 }), price)).toBe('1.23');
            expect(decimalInitialValue(json({ value: 1.2 }), price)).toBe(1.2);
            expect(decimalInitialValue(json({ value: '7' }), price)).toBe('7');
            expect(decimalInitialValue(json({ value: 1.2345 }), definition({ type: 'bigdecimal' }))).toBe(1.2345);
            expect(decimalInitialValue(json({ value: italy }), price)).toBeNull();
        });
    });

    describe('booleanInitialValue', () => {
        it('should read true and "true" as checked, anything else as unchecked', () => {
            expect(booleanInitialValue(json({ value: true }), definition())).toBeTrue();
            expect(booleanInitialValue(json({ value: 'true' }), definition())).toBeTrue();
            expect(booleanInitialValue(json({ value: 'false' }), definition())).toBeFalse();
            expect(booleanInitialValue(json(), definition())).toBeFalse();
        });
    });
});
