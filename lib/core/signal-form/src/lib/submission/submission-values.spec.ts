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
import { toSubmissionValues } from './submission-values';

describe('toSubmissionValues', () => {
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
                            { id: 'site', type: 'hyperlink', hyperlinkUrl: 'hyland.com' },
                            { id: 'shown', type: 'readonly', params: { field: { id: 'name', name: 'name', type: 'text' } } }
                        ]
                    }
                },
                {
                    id: 'lines',
                    type: 'repeatable-section',
                    numberOfColumns: 1,
                    fields: { 1: [{ id: 'item', type: 'text' }, { id: 'note', type: 'readonly-text', value: 'Read me' }] }
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
        toSubmissionValues(
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
});
