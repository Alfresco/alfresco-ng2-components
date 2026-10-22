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
import {
    dateValidator,
    decimalValidator,
    dropdownValidator,
    firstValidationError,
    maxLengthOf,
    maxLengthValidator,
    maxValueValidator,
    minLengthValidator,
    minValueValidator,
    numberValidator,
    patternValidator,
    requiredValidator
} from './field-validators';

describe('field validators', () => {
    const defaults: Partial<FieldDefinition> = { required: false, options: [], minLength: 0, maxLength: 0, multiple: false, hasEmptyValue: false };
    const field = (type: string, settings: Partial<FieldDefinition> = {}) => ({ id: type, type, ...defaults, ...settings }) as FieldDefinition;
    const required = (type: string, settings: Partial<FieldDefinition> = {}) => field(type, { required: true, ...settings });

    describe('requiredValidator', () => {
        it('should require a non-blank text', () => {
            expect(requiredValidator(required('text'), '')).toBe('required');
            expect(requiredValidator(required('text'), '   ')).toBe('required');
            expect(requiredValidator(required('text'), null)).toBe('required');
            expect(requiredValidator(required('text'), 'Ada')).toBeNull();
            expect(requiredValidator(required('integer'), 0)).toBeNull();
        });

        it('should require one of the options of a radio', () => {
            const sizes = required('radio-buttons', { options: [{ id: 's', name: 'Small' }] });

            expect(requiredValidator(sizes, 'x')).toBe('required');
            expect(requiredValidator(sizes, 's')).toBeNull();
        });

        it('should require a file, a checked checkbox, and a person or group', () => {
            expect(requiredValidator(required('upload'), [])).toBe('required');
            expect(requiredValidator(required('upload'), [{ id: 1 }])).toBeNull();
            expect(requiredValidator(required('boolean'), false)).toBe('required');
            expect(requiredValidator(required('boolean'), true)).toBeNull();
            expect(requiredValidator(required('people'), [])).toBe('required');
            expect(requiredValidator(required('functional-group'), [{ id: 'hr' }])).toBeNull();
        });

        it('should leave optional fields and the types it does not check alone', () => {
            expect(requiredValidator(field('text'), '')).toBeNull();
            expect(requiredValidator(required('dropdown'), '')).toBeNull();
        });
    });

    describe('numberValidator', () => {
        it('should accept whole numbers, and numbers with cents when the field allows fractions', () => {
            expect(numberValidator(field('integer'), '12')).toBeNull();
            expect(numberValidator(field('integer'), '-3')).toBeNull();
            expect(numberValidator(field('integer'), '1.5')).toBe('number');
            expect(numberValidator(field('integer'), 'abc')).toBe('number');
            expect(numberValidator(field('amount', { enableFractions: true }), '1.25')).toBeNull();
            expect(numberValidator(field('amount', { enableFractions: true }), '1.255')).toBe('number');
        });

        it('should leave empty values and other types alone', () => {
            expect(numberValidator(field('integer'), '')).toBeNull();
            expect(numberValidator(field('integer'), null)).toBeNull();
            expect(numberValidator(field('text'), 'abc')).toBeNull();
        });
    });

    describe('length validators', () => {
        it('should check the minimum length of a text', () => {
            expect(minLengthValidator(field('text', { minLength: 3 }), 'ab')).toBe('minLength');
            expect(minLengthValidator(field('text', { minLength: 3 }), 'abc')).toBeNull();
            expect(minLengthValidator(field('text', { minLength: 3 }), '')).toBeNull();
            expect(minLengthValidator(field('integer', { minLength: 3 }), '1')).toBeNull();
        });

        it('should check the maximum length of a text or an integer', () => {
            expect(maxLengthValidator(field('text', { maxLength: 3 }), 'abcd')).toBe('maxLength');
            expect(maxLengthValidator(field('text', { maxLength: 3 }), 'abc')).toBeNull();
            expect(maxLengthValidator(field('integer'), 12345678901)).toBe('maxLength');
            expect(maxLengthValidator(field('integer'), 1234567890)).toBeNull();
            expect(maxLengthValidator(field('multi-line-text'), 'any length')).toBeNull();
            expect(maxLengthValidator(field('text', { maxLength: 3 }), { id: 'long object' })).toBeNull();
        });

        it('should check a text against its own maximum length, or the default one', () => {
            expect(maxLengthOf(field('text', { maxLength: 5 }))).toBe(5);
            expect(maxLengthOf(field('text'))).toBe(1024);
            expect(maxLengthOf(field('integer', { maxLength: 3 }))).toBe(10);
            expect(maxLengthOf(field('multi-line-text', { maxLength: 7 }))).toBe(7);
            expect(maxLengthOf(field('date'))).toBe(0);
        });

        it('should check a text against its pattern', () => {
            const lowercase = field('text', { regexPattern: '[a-z]+' });

            expect(patternValidator(lowercase, 'abc')).toBeNull();
            expect(patternValidator(lowercase, 'ab1')).toBe('pattern');
            expect(patternValidator(lowercase, '')).toBeNull();
            expect(patternValidator(field('text'), 'ab1')).toBeNull();
        });
    });

    describe('range validators', () => {
        it('should check a number against its minimum and maximum', () => {
            expect(minValueValidator(field('integer', { minValue: 5 }), 3)).toBe('minValue');
            expect(minValueValidator(field('integer', { minValue: 5 }), 5)).toBeNull();
            expect(maxValueValidator(field('integer', { maxValue: 10 }), 11)).toBe('maxValue');
            expect(maxValueValidator(field('integer', { maxValue: 10 }), '10')).toBeNull();
        });

        it('should report a value that is no number as out of range, as today', () => {
            expect(minValueValidator(field('bigdecimal', { minValue: 5 }), 'abc')).toBe('minValue');
            expect(maxValueValidator(field('bigdecimal', { maxValue: 10 }), 'abc')).toBe('maxValue');
        });

        it('should leave empty values, fields without limits and other types alone', () => {
            expect(minValueValidator(field('integer', { minValue: 5 }), 0)).toBeNull();
            expect(minValueValidator(field('integer'), 3)).toBeNull();
            expect(maxValueValidator(field('text', { maxValue: 1 }), 5)).toBeNull();
        });
    });

    describe('decimalValidator', () => {
        it('should check that a decimal is a number with no more digits than its precision', () => {
            const price = field('bigdecimal', { precision: 2 });

            expect(decimalValidator(price, '1.23')).toBeNull();
            expect(decimalValidator(price, '5')).toBeNull();
            expect(decimalValidator(price, '1.234')).toBe('precision');
            expect(decimalValidator(price, 'abc')).toBe('decimal');
            expect(decimalValidator(price, '')).toBeNull();
            expect(decimalValidator(field('integer', { precision: 2 }), '1.234')).toBeNull();
        });
    });

    describe('dateValidator', () => {
        it('should report a value that is no date', () => {
            expect(dateValidator(field('date'), 'not a date')).toBe('dateFormat');
            expect(dateValidator(field('date'), new Date(NaN))).toBe('dateFormat');
            expect(dateValidator(field('date'), 5)).toBe('dateFormat');
        });

        it('should require a value when the date is required', () => {
            expect(dateValidator(required('date'), null)).toBe('required');
            expect(dateValidator(required('date'), '')).toBe('required');
            expect(dateValidator(field('date'), null)).toBeNull();
        });

        it('should check a date against its fixed range', () => {
            const march = field('date', { minValue: '2024-03-10', maxValue: '2024-03-20' });

            expect(dateValidator(march, '2024-03-05')).toBe('dateMin');
            expect(dateValidator(march, '2024-03-25')).toBe('dateMax');
            expect(dateValidator(march, '2024-03-15')).toBeNull();
            expect(dateValidator(march, new Date(2024, 2, 20, 23, 59))).toBeNull();
        });

        it('should check a date against a range relative to the day the form opened', () => {
            const nextDays = field('date', {
                dynamicDateRangeSelection: true,
                dateRangeReference: new Date(2024, 2, 15),
                minDateRangeValue: 0,
                maxDateRangeValue: 1
            });

            expect(dateValidator(nextDays, new Date(2024, 2, 14))).toBe('dateMin');
            expect(dateValidator(nextDays, new Date(2024, 2, 17))).toBe('dateMax');
            expect(dateValidator(nextDays, new Date(2024, 2, 16))).toBeNull();
            const openRange = field('date', { dynamicDateRangeSelection: true, minDateRangeValue: null, maxDateRangeValue: null });

            expect(dateValidator(openRange, new Date())).toBeNull();
        });

        it('should check a datetime against its range to the minute', () => {
            const morning = field('datetime', { minValue: '2024-03-15T09:00:00.000Z', maxValue: '2024-03-15T12:00:00.000Z' });

            expect(dateValidator(morning, new Date('2024-03-15T08:59:00.000Z'))).toBe('dateMin');
            expect(dateValidator(morning, new Date('2024-03-15T12:01:00.000Z'))).toBe('dateMax');
            expect(dateValidator(morning, new Date('2024-03-15T10:30:00.000Z'))).toBeNull();
        });

        it('should leave other types alone', () => {
            expect(dateValidator(field('text'), 'not a date')).toBeNull();
        });
    });

    describe('dropdownValidator', () => {
        const emptyOption = { id: 'empty', name: 'Choose one...' };

        it('should require a choice that is not the empty option', () => {
            const countries = required('dropdown', { hasEmptyValue: true, emptyOption });

            expect(dropdownValidator(countries, null)).toBe('dropdown');
            expect(dropdownValidator(countries, '')).toBe('dropdown');
            expect(dropdownValidator(countries, 'empty')).toBe('dropdown');
            expect(dropdownValidator(countries, 'Choose one...')).toBe('dropdown');
            expect(dropdownValidator(countries, { ...emptyOption })).toBe('dropdown');
            expect(dropdownValidator(countries, 'it')).toBeNull();
            expect(dropdownValidator(countries, { id: 'it', name: 'Italy' })).toBeNull();
        });

        it('should accept any choice when the dropdown has no empty option', () => {
            expect(dropdownValidator(required('dropdown'), 'empty')).toBeNull();
        });

        it('should require at least one option of a multiple selection', () => {
            const countries = required('dropdown', { multiple: true });

            expect(dropdownValidator(countries, [])).toBe('dropdown');
            expect(dropdownValidator(countries, 'it')).toBe('dropdown');
            expect(dropdownValidator(countries, [{ id: 'it', name: 'Italy' }])).toBeNull();
        });

        it('should leave optional dropdowns and other types alone', () => {
            expect(dropdownValidator(field('dropdown'), null)).toBeNull();
            expect(dropdownValidator(required('text'), null)).toBeNull();
        });
    });

    describe('firstValidationError', () => {
        it('should give the first error of the validators, in order', () => {
            const name = required('text', { minLength: 3 });
            const validators = [requiredValidator, minLengthValidator];

            expect(firstValidationError(name, '', validators)).toBe('required');
            expect(firstValidationError(name, 'ab', validators)).toBe('minLength');
            expect(firstValidationError(name, 'Ada', validators)).toBeNull();
            expect(firstValidationError(name, '', [])).toBeNull();
        });
    });
});
