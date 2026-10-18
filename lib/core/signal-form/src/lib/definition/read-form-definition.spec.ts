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

import { FormDefinitionJson } from './form-definition.json';
import { dateFieldRange } from '../validation/field-validation';
import { readFormDefinition } from './read-form-definition';

describe('readFormDefinition', () => {
    const formWith = (fields: object[], processVariables: object[] = [], variables: object[] = []): FormDefinitionJson =>
        ({
            formDefinition: { fields: [{ id: 'root', type: 'container', numberOfColumns: 1, fields: { 1: fields } }], outcomes: [], variables },
            processVariables
        }) as FormDefinitionJson;
    const field = (definition: ReturnType<typeof readFormDefinition>, fieldId: string) => definition.fields.find(({ id }) => id === fieldId);

    it('should give a read-only field the value of the process field it shows', () => {
        const definition = readFormDefinition(
            formWith(
                [
                    { id: 'shownName', type: 'readonly', params: { field: { id: 'name', name: 'name', type: 'text' } } },
                    { id: 'shownLink', type: 'hyperlink', params: { field: { id: 'site', name: 'site', type: 'text' } } },
                    { id: 'shownCity', type: 'readonly-text', params: { field: { id: 'city', name: 'city', type: 'typeahead' } } },
                    { id: 'notShown', type: 'readonly', value: 'kept', params: { field: { id: 'missing', name: 'missing', type: 'text' } } }
                ],
                [
                    { name: 'name', type: 'string', value: 'Vito' },
                    { name: 'site', type: 'string', value: 'hyland.com' },
                    { name: 'city_LABEL', type: 'string', value: 'Rome' }
                ]
            )
        );

        expect(field(definition, 'shownName').initialValue).toBe('Vito');
        expect(field(definition, 'shownLink').initialValue).toBe('hyland.com');
        expect(field(definition, 'shownCity').initialValue).withContext('a typeahead is shown through its label').toBe('Rome');
        expect(field(definition, 'notShown').initialValue).withContext('no variable keeps the own value').toBe('kept');
    });

    it('should not take a process value for a field that is not read-only', () => {
        const definition = readFormDefinition(
            formWith(
                [{ id: 'editable', type: 'text', params: { field: { id: 'name', name: 'name', type: 'text' } } }],
                [{ name: 'name', value: 'Vito' }]
            )
        );

        expect(field(definition, 'editable').initialValue).toBeNull();
    });

    it('should format a read-only field showing a datetime as a datetime', () => {
        const definition = readFormDefinition(
            formWith([{ id: 'shownWhen', type: 'readonly', params: { field: { id: 'when', name: 'when', type: 'datetime' } } }])
        );

        expect(field(definition, 'shownWhen').dateDisplayFormat).toBe('D-M-YYYY hh:mm A');
    });

    it('should read a datetime set to now, or saved as an ISO string, as a date', () => {
        const before = Date.now();
        const definition = readFormDefinition(
            formWith([
                { id: 'started', type: 'datetime', value: 'now' },
                { id: 'meeting', type: 'datetime', value: '2024-03-15T10:30:00.000Z' }
            ])
        );

        const started = field(definition, 'started').initialValue as Date;
        expect(started instanceof Date && started.getTime() >= before).toBeTrue();
        expect((field(definition, 'meeting').initialValue as Date).toISOString()).toBe('2024-03-15T10:30:00.000Z');
    });

    it('should round a decimal to its precision only when it has more digits', () => {
        const definition = readFormDefinition(
            formWith([
                { id: 'rounded', type: 'bigdecimal', precision: 3, value: 10.1035 },
                { id: 'kept', type: 'bigdecimal', precision: 3, value: 10.1 },
                { id: 'free', type: 'bigdecimal', value: 10.123456 }
            ])
        );

        expect(field(definition, 'rounded').initialValue).toBe('10.104');
        expect(field(definition, 'kept').initialValue).toBe(10.1);
        expect(field(definition, 'free').initialValue).toBe(10.123456);
    });

    it('should take saved values by field id or variable name, read like JSON values, except for constant types', () => {
        const definition = readFormDefinition(
            formWith([
                { id: 'title', type: 'text', value: 'default' },
                { id: 'owner', name: 'ownerName', type: 'text' },
                { id: 'due', type: 'date' },
                { id: 'external', type: 'display-external-property', value: 'from the API' },
                { id: 'untouched', type: 'text', value: 'kept' }
            ]),
            undefined,
            { title: 'saved', 'variables.ownerName': 'Vito', due: '2024-03-15', external: 'saved' }
        );

        expect(field(definition, 'title').initialValue).toBe('saved');
        expect(field(definition, 'owner').initialValue).toBe('Vito');
        expect(field(definition, 'due').initialValue instanceof Date)
            .withContext('read like a JSON date')
            .toBeTrue();
        expect(field(definition, 'external').initialValue).toBe('from the API');
        expect(field(definition, 'untouched').initialValue).toBe('kept');
    });

    it('should take the saved rows of a repeatable section from the saved values', () => {
        const definition = readFormDefinition(
            {
                formDefinition: {
                    fields: [
                        {
                            id: 'lines',
                            type: 'repeatable-section',
                            numberOfColumns: 1,
                            params: { initialNumberOfRows: 1 },
                            fields: { 1: [{ id: 'due', type: 'date' }] }
                        }
                    ],
                    outcomes: [],
                    variables: []
                }
            } as FormDefinitionJson,
            undefined,
            { lines: [{ due: '2024-03-15' }, { due: null }] }
        );

        const [first, second] = definition.sections[0].savedRows;
        expect(first['due'] instanceof Date).toBeTrue();
        expect(second).toEqual({});
    });

    it('should give no outcomes to a definition without fields, as today', () => {
        expect(readFormDefinition({ formDefinition: { outcomes: [], variables: [] } } as FormDefinitionJson).outcomes).toEqual([]);
        expect(readFormDefinition(formWith([])).outcomes.map(({ id }) => id)).toEqual(['$save', '$complete', '$startProcess']);
    });

    it('should count a dynamic date range from the day the form was read, so it does not move while the form is open', () => {
        const definition = readFormDefinition(
            formWith([{ id: 'due', type: 'date', dynamicDateRangeSelection: true, minDateRangeValue: 1, maxDateRangeValue: 3 }])
        );
        const due = field(definition, 'due');
        expect(due.dateRangeReference instanceof Date).toBeTrue();

        const { min, max } = dateFieldRange({ ...due, dateRangeReference: new Date(2024, 0, 31) });

        expect(min).toEqual(new Date(2024, 1, 1));
        expect(max).toEqual(new Date(2024, 1, 3));
    });
});
