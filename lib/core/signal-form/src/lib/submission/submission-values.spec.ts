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

import { parseFormJson } from '../definition/form-json-parser';
import { BUILT_IN_FIELD_TYPE_RESOLVER } from '../field-types/built-in-field-types';
import type { FieldDefinition } from '../definition/form-definition.interface';
import {
    booleanSubmittedValue,
    dateSubmittedValue,
    dateTimeSubmittedValue,
    decimalSubmittedValue,
    dropdownSubmittedValue,
    noSubmittedValue,
    numberSubmittedValue,
    peopleSubmittedValue,
    radioSubmittedValue,
    toSubmittedValues,
    uploadSubmittedValue
} from './submission-values';

describe('toSubmittedValues', () => {
    const definition = parseFormJson({
        formDefinition: {
            fields: [
                {
                    id: 'root',
                    type: 'container',
                    numberOfColumns: 1,
                    fields: {
                        1: [
                            { id: 'name', type: 'text' },
                            { id: 'age', type: 'integer' },
                            { id: 'price', type: 'bigdecimal' },
                            { id: 'data', type: 'json' },
                            { id: 'site', type: 'hyperlink', hyperlinkUrl: 'hyland.com' },
                            { id: 'shown', type: 'readonly', params: { field: { id: 'name', name: 'name', type: 'text' } } }
                        ]
                    }
                },
                {
                    id: 'lines',
                    type: 'repeatable-section',
                    numberOfColumns: 1,
                    fields: {
                        1: [
                            { id: 'item', type: 'text' },
                            { id: 'note', type: 'readonly-text', value: 'Read me' }
                        ]
                    }
                },
                { id: 'empty', type: 'repeatable-section', numberOfColumns: 1, fields: { 1: [{ id: 'other', type: 'text' }] } }
            ],
            outcomes: [],
            variables: []
        }
    });
    const fields = new Map(definition.fields.map((field) => [field.id, field]));
    const sections = new Map(definition.sections.map((section) => [section.id, section]));

    const submit = () =>
        toSubmittedValues(
            fields,
            sections,
            {
                fields: { name: 'Ada', age: null, price: '', site: 'hyland.com', shown: 'Ada' },
                sections: { lines: [{ item: 'first', note: 'Read me' }], empty: [] }
            },
            BUILT_IN_FIELD_TYPE_RESOLVER
        );

    it('should leave out the fields that submit nothing, keeping an empty value', () => {
        const submitted = submit();

        expect(submitted).toEqual({ name: 'Ada', age: null, price: null, lines: [{ item: 'first' }] });
        expect(Object.keys(submitted)).not.toContain('site');
        expect(Object.keys(submitted)).not.toContain('shown');
    });

    it('should leave out the fields of a repeatable row that submit nothing', () => {
        expect(Object.keys((submit()['lines'] as object[])[0])).toEqual(['item']);
    });

    it('should submit no value for an empty number field, as today it reaches the backend', () => {
        const submitted = submit();

        expect(submitted['age']).toBeNull();
        expect(submitted['price']).toBeNull();
    });

    it('should leave out a repeatable section without rows', () => {
        expect(Object.keys(submit())).not.toContain('empty');
    });

    it('should strip the symbol keys Signal Forms adds to tracked items', () => {
        const tracked = { id: 'a', [Symbol('tracking')]: 1 };
        const model = { fields: { data: { items: [tracked] } }, sections: {} };
        const submitted = toSubmittedValues(fields, sections, model, BUILT_IN_FIELD_TYPE_RESOLVER);
        const [item] = (submitted['data'] as { items: object[] }).items;

        expect(item).toEqual({ id: 'a' });
        expect(Object.getOwnPropertySymbols(item)).toEqual([]);
    });
});

describe('submitted value writers', () => {
    const definition = (settings: Partial<FieldDefinition> = {}) => ({ id: 'field', type: 'text', options: [], ...settings }) as FieldDefinition;
    const italy = { id: 'it', name: 'Italy' };
    const sizes = [{ id: 's', name: 'Small' }];

    it('should submit an integer or amount as a number, with fractions when the field allows them', () => {
        expect(numberSubmittedValue({ definition: definition(), value: '42' })).toBe(42);
        expect(numberSubmittedValue({ definition: definition(), value: '4.5' })).toBe(4);
        expect(numberSubmittedValue({ definition: definition({ enableFractions: true }), value: '4.5' })).toBe(4.5);
        expect(numberSubmittedValue({ definition: definition(), value: '' })).toBeNull();
        expect(numberSubmittedValue({ definition: definition(), value: 'abc' })).toBeNaN();
    });

    it('should submit a decimal as a number', () => {
        expect(decimalSubmittedValue({ definition: definition(), value: '1.25' })).toBe(1.25);
        expect(decimalSubmittedValue({ definition: definition(), value: null })).toBeNull();
    });

    it('should submit a checkbox without a value as unchecked', () => {
        expect(booleanSubmittedValue({ definition: definition(), value: true })).toBeTrue();
        expect(booleanSubmittedValue({ definition: definition(), value: null })).toBeFalse();
    });

    it('should submit the people or groups picked, or no value', () => {
        expect(peopleSubmittedValue({ definition: definition(), value: [{ id: 'ada' }] })).toEqual([{ id: 'ada' }]);
        expect(peopleSubmittedValue({ definition: definition(), value: null })).toBeNull();
    });

    it('should submit a dropdown choice as its option, and no value for the empty option', () => {
        const countries = definition({ options: [italy] });

        expect(dropdownSubmittedValue({ definition: countries, value: 'it' })).toEqual(italy);
        expect(dropdownSubmittedValue({ definition: countries, value: { ...italy } })).toEqual(italy);
        expect(dropdownSubmittedValue({ definition: countries, value: [italy] })).toEqual([italy]);
        expect(dropdownSubmittedValue({ definition: countries, value: 'empty' })).toBeNull();
        expect(dropdownSubmittedValue({ definition: countries, value: 'unlisted' })).toBeNull();
        expect(dropdownSubmittedValue({ definition: countries, value: null })).toBeNull();
    });

    it('should submit a radio choice as a copy of its option, with the options when they come from a REST service', () => {
        expect(radioSubmittedValue({ definition: definition({ options: sizes }), value: 's' })).toEqual(sizes[0]);
        expect(radioSubmittedValue({ definition: definition({ options: sizes }), value: 'x' })).toBeNull();
        const restSizes = definition({ options: sizes, optionType: 'rest' });

        expect(radioSubmittedValue({ definition: restSizes, value: 's' })).toEqual({ ...sizes[0], options: sizes });
        expect(radioSubmittedValue({ definition: restSizes, value: 'x' })).toEqual({ id: null, name: null, options: sizes });
    });

    it('should submit uploaded files as their ids joined by commas', () => {
        expect(uploadSubmittedValue({ definition: definition(), value: [{ id: 1 }, { id: 2 }] })).toBe('1,2');
        expect(uploadSubmittedValue({ definition: definition(), value: '7' })).toEqual(['7']);
        expect(uploadSubmittedValue({ definition: definition(), value: [] })).toBeNull();
    });

    it('should submit a date as midnight UTC of its day, and no value for one that is no date', () => {
        const due = definition({ dateDisplayFormat: 'D-M-YYYY' });

        expect(dateSubmittedValue({ definition: due, value: new Date(2024, 2, 15) })).toBe('2024-03-15T00:00:00.000Z');
        expect(dateSubmittedValue({ definition: due, value: '2024-03-15' })).toBe('2024-03-15T00:00:00.000Z');
        expect(dateSubmittedValue({ definition: due, value: 'not a date' })).toBeNull();
        expect(dateSubmittedValue({ definition: due, value: null })).toBeNull();
    });

    it('should submit a datetime as its ISO text', () => {
        expect(dateTimeSubmittedValue({ definition: definition(), value: new Date('2024-03-15T10:30:00.000Z') })).toBe('2024-03-15T10:30:00.000Z');
        expect(dateTimeSubmittedValue({ definition: definition(), value: null })).toBeNull();
    });

    it('should submit nothing for the types that submit no value', () => {
        expect(noSubmittedValue({ definition: definition(), value: 'shown' })).toBeUndefined();
    });
});
