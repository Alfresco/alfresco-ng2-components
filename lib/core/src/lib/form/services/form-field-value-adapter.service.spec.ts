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
import { FormFieldValueAdapterService } from './form-field-value-adapter.service';
import { FormFieldModel } from '../components/widgets/core/form-field.model';
import { FormFieldTypes } from '../components/widgets/core/form-field-types';
import { FormModel } from '../components/widgets/core';

/**
 * Test helper that creates a FormFieldModel attached to a fresh FormModel for unit tests.
 *
 * @param type form field type identifier (e.g., FormFieldTypes.PEOPLE)
 * @param value initial field value
 * @param config optional dropdown/radio options and multi-select flag
 * @param config.options dropdown/radio option list
 * @param config.multiple whether the field accepts multiple values
 * @returns a fully-wired FormFieldModel
 */
function makeField(type: string, value: any, config?: { options?: { id: string; name: string }[]; multiple?: boolean }): FormFieldModel {
    const form = new FormModel();
    const field = new FormFieldModel(form, {
        id: 'f1',
        type,
        value,
        selectionType: config?.multiple ? 'multiple' : 'single'
    });
    if (config?.options) {
        field.options = config.options;
    }
    return field;
}

describe('FormFieldValueAdapterService', () => {
    let service: FormFieldValueAdapterService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FormFieldValueAdapterService);
    });

    describe('hasAdapter', () => {
        it('should return true for registered types', () => {
            expect(service.hasAdapter(FormFieldTypes.PEOPLE)).toBeTrue();
            expect(service.hasAdapter(FormFieldTypes.FUNCTIONAL_GROUP)).toBeTrue();
            expect(service.hasAdapter(FormFieldTypes.DROPDOWN)).toBeTrue();
            expect(service.hasAdapter(FormFieldTypes.RADIO_BUTTONS)).toBeTrue();
        });

        it('should return false for unregistered types', () => {
            expect(service.hasAdapter('text')).toBeFalse();
            expect(service.hasAdapter('unknown-type')).toBeFalse();
        });
    });

    describe('default adapter', () => {
        it('should pass through values for unregistered types', () => {
            const field = makeField('text', 'hello');
            expect(service.adapt('hello', field)).toBe('hello');
        });

        it('should pass through value when field is null', () => {
            expect(service.adapt('anything', null as any)).toBe('anything');
        });
    });

    describe('People adapter', () => {
        it('should pass through null', () => {
            const field = makeField(FormFieldTypes.PEOPLE, null);
            expect(service.adapt(null, field)).toBeNull();
        });

        it('should pass through undefined', () => {
            const field = makeField(FormFieldTypes.PEOPLE, undefined);
            expect(service.adapt(undefined, field)).toBeUndefined();
        });

        it('single-select: should wrap a user object into a single-element array', () => {
            const field = makeField(FormFieldTypes.PEOPLE, null);
            const user = { firstName: 'Alyssa', lastName: 'Adcock' };
            expect(service.adapt(user, field)).toEqual([user]);
        });

        it('single-select: should parse a string into a single-element array of firstName/lastName', () => {
            const field = makeField(FormFieldTypes.PEOPLE, null);
            expect(service.adapt('Alyssa Adcock', field)).toEqual([{ firstName: 'Alyssa', lastName: 'Adcock' }]);
        });

        it('single-select: should parse a single-word string into a single-element array with firstName only', () => {
            const field = makeField(FormFieldTypes.PEOPLE, null);
            expect(service.adapt('Alyssa', field)).toEqual([{ firstName: 'Alyssa' }]);
        });

        it('single-select: should keep a single-element array', () => {
            const field = makeField(FormFieldTypes.PEOPLE, null);
            expect(service.adapt([{ firstName: 'Alyssa' }], field)).toEqual([{ firstName: 'Alyssa' }]);
        });

        it('single-select: should return null when given an empty array', () => {
            const field = makeField(FormFieldTypes.PEOPLE, null);
            expect(service.adapt([], field)).toBeNull();
        });

        it('multi-select: should wrap a single object into an array', () => {
            const field = makeField(FormFieldTypes.PEOPLE, null, { multiple: true });
            expect(service.adapt({ firstName: 'Alyssa' }, field)).toEqual([{ firstName: 'Alyssa' }]);
        });

        it('multi-select: should keep an array of users (idempotent)', () => {
            const field = makeField(FormFieldTypes.PEOPLE, null, { multiple: true });
            const users = [{ firstName: 'Alice' }, { firstName: 'Bob' }];
            expect(service.adapt(users, field)).toEqual(users);
        });

        it('multi-select: should parse an array of strings', () => {
            const field = makeField(FormFieldTypes.PEOPLE, null, { multiple: true });
            expect(service.adapt(['Alyssa Adcock'], field)).toEqual([{ firstName: 'Alyssa', lastName: 'Adcock' }]);
        });
    });

    describe('Group adapter', () => {
        it('should pass through null', () => {
            const field = makeField(FormFieldTypes.FUNCTIONAL_GROUP, null);
            expect(service.adapt(null, field)).toBeNull();
        });

        it('single-select: should wrap a group object into a single-element array', () => {
            const field = makeField(FormFieldTypes.FUNCTIONAL_GROUP, null);
            const group = { id: 'g1', name: 'Engineering' };
            expect(service.adapt(group, field)).toEqual([group]);
        });

        it('single-select: should wrap a string into a single-element array of { name }', () => {
            const field = makeField(FormFieldTypes.FUNCTIONAL_GROUP, null);
            expect(service.adapt('Engineering', field)).toEqual([{ name: 'Engineering' }]);
        });

        it('multi-select: should wrap a single group into an array', () => {
            const field = makeField(FormFieldTypes.FUNCTIONAL_GROUP, null, { multiple: true });
            expect(service.adapt({ name: 'Engineering' }, field)).toEqual([{ name: 'Engineering' }]);
        });

        it('multi-select: should parse an array of strings', () => {
            const field = makeField(FormFieldTypes.FUNCTIONAL_GROUP, null, { multiple: true });
            expect(service.adapt(['Eng', 'QA'], field)).toEqual([{ name: 'Eng' }, { name: 'QA' }]);
        });
    });

    describe('Dropdown adapter', () => {
        const options = [
            { id: 'a', name: 'Apple' },
            { id: 'b', name: 'Banana' }
        ];

        it('should pass through null', () => {
            const field = makeField(FormFieldTypes.DROPDOWN, null, { options });
            expect(service.adapt(null, field)).toBeNull();
        });

        it('single-select: should pass through a string id', () => {
            const field = makeField(FormFieldTypes.DROPDOWN, null, { options });
            expect(service.adapt('a', field)).toBe('a');
        });

        it('single-select: should extract id from an object', () => {
            const field = makeField(FormFieldTypes.DROPDOWN, null, { options });
            expect(service.adapt({ id: 'a', name: 'Apple' }, field)).toBe('a');
        });

        it('multi-select: should keep FormFieldOption array (idempotent)', () => {
            const field = makeField(FormFieldTypes.DROPDOWN, null, { options, multiple: true });
            const value = [
                { id: 'a', name: 'Apple' },
                { id: 'b', name: 'Banana' }
            ];
            expect(service.adapt(value, field)).toEqual(value);
        });

        it('multi-select: should resolve string ids against field options', () => {
            const field = makeField(FormFieldTypes.DROPDOWN, null, { options, multiple: true });
            expect(service.adapt(['a', 'b'], field)).toEqual([
                { id: 'a', name: 'Apple' },
                { id: 'b', name: 'Banana' }
            ]);
        });

        it('multi-select: should fall back to id/name when option not found', () => {
            const field = makeField(FormFieldTypes.DROPDOWN, null, { options, multiple: true });
            expect(service.adapt(['z'], field)).toEqual([{ id: 'z', name: 'z' }]);
        });
    });

    describe('Radio adapter', () => {
        const options = [
            { id: 'yes', name: 'Yes' },
            { id: 'no', name: 'No' }
        ];

        it('should pass through null', () => {
            const field = makeField(FormFieldTypes.RADIO_BUTTONS, null, { options });
            expect(service.adapt(null, field)).toBeNull();
        });

        it('should pass through a string id', () => {
            const field = makeField(FormFieldTypes.RADIO_BUTTONS, null, { options });
            expect(service.adapt('yes', field)).toBe('yes');
        });

        it('should extract id from an object', () => {
            const field = makeField(FormFieldTypes.RADIO_BUTTONS, null, { options });
            expect(service.adapt({ id: 'yes', name: 'Yes' }, field)).toBe('yes');
        });
    });

    describe('register', () => {
        it('should allow overriding a registered adapter', () => {
            service.register(FormFieldTypes.PEOPLE, () => 'custom-override');
            const field = makeField(FormFieldTypes.PEOPLE, null);
            expect(service.adapt('anything', field)).toBe('custom-override');
        });
    });
});
