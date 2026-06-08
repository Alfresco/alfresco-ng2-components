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

import { TestBed } from '@angular/core/testing';
import { FormFieldValueFormatterService } from './form-field-value-formatter.service';
import { FormFieldModel } from '../components/widgets/core/form-field.model';
import { FormFieldTypes } from '../components/widgets/core/form-field-types';
import { FormModel } from '../components/widgets/core';

/**
 * Test helper that creates a FormFieldModel attached to a fresh FormModel for unit tests.
 *
 * @param type form field type identifier (e.g., FormFieldTypes.PEOPLE)
 * @param value initial field value
 * @param options optional dropdown/radio option list
 * @returns a fully-wired FormFieldModel
 */
function makeField(type: string, value: any, options?: { id: string; name: string }[]): FormFieldModel {
    const form = new FormModel();
    const field = new FormFieldModel(form, { id: 'f1', type, value });
    if (options) {
        field.options = options;
    }
    return field;
}

describe('FormFieldValueFormatterService', () => {
    let service: FormFieldValueFormatterService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FormFieldValueFormatterService);
    });

    describe('hasFormatter', () => {
        it('should return true for registered types', () => {
            expect(service.hasFormatter(FormFieldTypes.PEOPLE)).toBeTrue();
            expect(service.hasFormatter(FormFieldTypes.FUNCTIONAL_GROUP)).toBeTrue();
            expect(service.hasFormatter(FormFieldTypes.DROPDOWN)).toBeTrue();
            expect(service.hasFormatter(FormFieldTypes.RADIO_BUTTONS)).toBeTrue();
        });

        it('should return false for unregistered types', () => {
            expect(service.hasFormatter('unknown-type')).toBeFalse();
            expect(service.hasFormatter('text')).toBeFalse();
        });
    });

    describe('formatValue - base cases', () => {
        it('should return empty string for null', () => {
            const field = makeField('text', null);
            expect(service.formatValue(null, field)).toBe('');
        });

        it('should return empty string for undefined', () => {
            const field = makeField('text', undefined);
            expect(service.formatValue(undefined, field)).toBe('');
        });

        it('should pass through string values unchanged', () => {
            const field = makeField('text', 'hello');
            expect(service.formatValue('hello', field)).toBe('hello');
        });

        it('should JSON.stringify unknown object types', () => {
            const field = makeField('text', { foo: 'bar' });
            expect(service.formatValue({ foo: 'bar' }, field)).toBe('{"foo":"bar"}');
        });

        it('should render Date values using native string instead of JSON', () => {
            const date = new Date('2026-06-02T14:30:00.000Z');
            const field = makeField('datetime', date);
            expect(service.formatValue(date, field)).toBe(String(date));
            expect(service.formatValue(date, field)).not.toContain('"');
        });

        it('should render numeric values without JSON quoting', () => {
            const field = makeField('integer', 42);
            expect(service.formatValue(42, field)).toBe('42');
        });

        it('should render boolean values without JSON quoting', () => {
            const field = makeField('boolean', true);
            expect(service.formatValue(true, field)).toBe('true');
        });
    });

    describe('stringifyValue', () => {
        it('should return empty string for null and undefined', () => {
            expect(service.stringifyValue(null)).toBe('');
            expect(service.stringifyValue(undefined)).toBe('');
        });

        it('should pass through strings unchanged', () => {
            expect(service.stringifyValue('hello')).toBe('hello');
        });

        it('should render Date using native string, not ISO JSON', () => {
            const date = new Date('2026-06-02T14:30:00.000Z');
            expect(service.stringifyValue(date)).toBe(String(date));
            expect(service.stringifyValue(date)).not.toBe(JSON.stringify(date));
        });

        it('should render primitives without JSON quoting', () => {
            expect(service.stringifyValue(42)).toBe('42');
            expect(service.stringifyValue(true)).toBe('true');
        });

        it('should JSON.stringify plain objects and arrays', () => {
            expect(service.stringifyValue({ foo: 'bar' })).toBe('{"foo":"bar"}');
            expect(service.stringifyValue([{ id: 'a' }])).toBe('[{"id":"a"}]');
            expect(service.stringifyValue({ foo: 'bar' })).not.toContain('[object Object]');
        });
    });

    describe('People formatter', () => {
        it('should return empty string for null', () => {
            const field = makeField(FormFieldTypes.PEOPLE, null);
            expect(service.format(field)).toBe('');
        });

        it('should return empty string for empty array', () => {
            const field = makeField(FormFieldTypes.PEOPLE, []);
            expect(service.format(field)).toBe('');
        });

        it('should format a single user object (single-select mode)', () => {
            const field = makeField(FormFieldTypes.PEOPLE, { firstName: 'Alyssa', lastName: 'Adcock' });
            expect(service.format(field)).toBe('Alyssa Adcock');
        });

        it('should format an array with one user', () => {
            const field = makeField(FormFieldTypes.PEOPLE, [{ firstName: 'Alyssa', lastName: 'Adcock' }]);
            expect(service.format(field)).toBe('Alyssa Adcock');
        });

        it('should format multiple users separated by comma', () => {
            const field = makeField(FormFieldTypes.PEOPLE, [
                { firstName: 'Alice', lastName: 'Brown' },
                { firstName: 'Bob', lastName: 'Smith' }
            ]);
            expect(service.format(field)).toBe('Alice Brown, Bob Smith');
        });

        it('should fall back to username when no first/last name', () => {
            const field = makeField(FormFieldTypes.PEOPLE, [{ username: 'jdoe' }]);
            expect(service.format(field)).toBe('jdoe');
        });

        it('should fall back to email when no first/last/username', () => {
            const field = makeField(FormFieldTypes.PEOPLE, [{ email: 'a@b.com' }]);
            expect(service.format(field)).toBe('a@b.com');
        });
    });

    describe('Group formatter', () => {
        it('should return empty string for null', () => {
            const field = makeField(FormFieldTypes.FUNCTIONAL_GROUP, null);
            expect(service.format(field)).toBe('');
        });

        it('should return empty string for empty array', () => {
            const field = makeField(FormFieldTypes.FUNCTIONAL_GROUP, []);
            expect(service.format(field)).toBe('');
        });

        it('should format a single group object', () => {
            const field = makeField(FormFieldTypes.FUNCTIONAL_GROUP, { id: 'g1', name: 'Engineering' });
            expect(service.format(field)).toBe('Engineering');
        });

        it('should format an array of groups', () => {
            const field = makeField(FormFieldTypes.FUNCTIONAL_GROUP, [{ name: 'Eng' }, { name: 'QA' }]);
            expect(service.format(field)).toBe('Eng, QA');
        });

        it('should skip groups with no name', () => {
            const field = makeField(FormFieldTypes.FUNCTIONAL_GROUP, [{ id: 'g1' }, { name: 'QA' }]);
            expect(service.format(field)).toBe('QA');
        });
    });

    describe('Dropdown formatter', () => {
        const options = [
            { id: 'a', name: 'Apple' },
            { id: 'b', name: 'Banana' }
        ];

        it('should return empty string for null', () => {
            const field = makeField(FormFieldTypes.DROPDOWN, null, options);
            expect(service.format(field)).toBe('');
        });

        it('should return empty string for empty string', () => {
            const field = makeField(FormFieldTypes.DROPDOWN, '', options);
            expect(service.formatValue('', field)).toBe('');
        });

        it('Shape A: should look up label for string id', () => {
            const field = makeField(FormFieldTypes.DROPDOWN, 'a', options);
            expect(service.format(field)).toBe('Apple');
        });

        it('Shape A fallback: should return the id when not found in options', () => {
            const field = makeField(FormFieldTypes.DROPDOWN, 'unknown', options);
            expect(service.format(field)).toBe('unknown');
        });

        it('Shape B: should use .name from object value', () => {
            const field = makeField(FormFieldTypes.DROPDOWN, { id: 'a', name: 'Apple' }, options);
            expect(service.format(field)).toBe('Apple');
        });

        it('Shape B no name: should JSON.stringify', () => {
            const field = makeField(FormFieldTypes.DROPDOWN, { id: 'a' }, options);
            expect(service.format(field)).toBe('{"id":"a"}');
        });

        it('Shape C: should format array of objects', () => {
            const field = makeField(
                FormFieldTypes.DROPDOWN,
                [
                    { id: 'a', name: 'Apple' },
                    { id: 'b', name: 'Banana' }
                ],
                options
            );
            expect(service.format(field)).toBe('Apple, Banana');
        });

        it('Shape C string array: should look up labels for each id', () => {
            const field = makeField(FormFieldTypes.DROPDOWN, ['a', 'b'], options);
            expect(service.format(field)).toBe('Apple, Banana');
        });

        it('Shape C empty array: should return empty string', () => {
            const field = makeField(FormFieldTypes.DROPDOWN, [], options);
            expect(service.format(field)).toBe('');
        });
    });

    describe('Radio formatter', () => {
        const options = [
            { id: 'yes', name: 'Yes' },
            { id: 'no', name: 'No' }
        ];

        it('should return empty string for null', () => {
            const field = makeField(FormFieldTypes.RADIO_BUTTONS, null, options);
            expect(service.format(field)).toBe('');
        });

        it('should return empty string for empty string', () => {
            const field = makeField(FormFieldTypes.RADIO_BUTTONS, '', options);
            expect(service.formatValue('', field)).toBe('');
        });

        it('Shape A: should look up label for string id', () => {
            const field = makeField(FormFieldTypes.RADIO_BUTTONS, 'yes', options);
            expect(service.format(field)).toBe('Yes');
        });

        it('Shape A fallback: should return the id when not found', () => {
            const field = makeField(FormFieldTypes.RADIO_BUTTONS, 'unknown', options);
            expect(service.format(field)).toBe('unknown');
        });

        it('Shape B: should use .name from FormFieldOption object (post-click value)', () => {
            const field = makeField(FormFieldTypes.RADIO_BUTTONS, { id: 'yes', name: 'Yes' }, options);
            expect(service.format(field)).toBe('Yes');
        });

        it('Shape B no name: should JSON.stringify', () => {
            const field = makeField(FormFieldTypes.RADIO_BUTTONS, { id: 'yes' }, options);
            expect(service.format(field)).toBe('{"id":"yes"}');
        });
    });

    describe('register', () => {
        it('should allow overriding a registered formatter', () => {
            service.register(FormFieldTypes.PEOPLE, () => 'custom-override');
            const field = makeField(FormFieldTypes.PEOPLE, [{ firstName: 'Alice' }]);
            expect(service.format(field)).toBe('custom-override');
        });
    });
});
