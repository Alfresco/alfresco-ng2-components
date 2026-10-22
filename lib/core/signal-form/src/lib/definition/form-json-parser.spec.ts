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

import { FormDefinitionJson } from './form-definition-json.interface';
import { dateFieldRange } from '../validation/field-validators';
import { parseFormJson } from './form-json-parser';

describe('parseFormJson', () => {
    const formWith = (fields: object[], processVariables: object[] = [], variables: object[] = []): FormDefinitionJson =>
        ({
            formDefinition: { fields: [{ id: 'root', type: 'container', numberOfColumns: 1, fields: { 1: fields } }], outcomes: [], variables },
            processVariables
        }) as FormDefinitionJson;
    const field = (definition: ReturnType<typeof parseFormJson>, fieldId: string) => definition.fields.find(({ id }) => id === fieldId);

    it('should give a read-only field the value of the process field it shows', () => {
        const definition = parseFormJson(
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

    it('should give a read-only field a falsy process value instead of its own value', () => {
        const shown = (id: string, name: string) => ({ id, type: 'readonly', value: 'own', params: { field: { id: name, name, type: 'text' } } });
        const definition = parseFormJson(
            formWith(
                [shown('shownCount', 'count'), shown('shownFlag', 'flag'), shown('shownNote', 'note'), shown('shownUnset', 'unset')],
                [
                    { name: 'count', type: 'integer', value: 0 },
                    { name: 'flag', type: 'boolean', value: false },
                    { name: 'note', type: 'string', value: '' },
                    { name: 'unset', type: 'string', value: null }
                ]
            )
        );

        expect(field(definition, 'shownCount').initialValue).toBe(0);
        expect(field(definition, 'shownFlag').initialValue).toBeFalse();
        expect(field(definition, 'shownNote').initialValue).toBe('');
        expect(field(definition, 'shownUnset').initialValue).withContext('a null value keeps the own value').toBe('own');
    });

    it('should not take a process value for a field that is not read-only', () => {
        const definition = parseFormJson(
            formWith(
                [{ id: 'editable', type: 'text', params: { field: { id: 'name', name: 'name', type: 'text' } } }],
                [{ name: 'name', value: 'Vito' }]
            )
        );

        expect(field(definition, 'editable').initialValue).toBeNull();
    });

    it('should format a read-only field showing a datetime as a datetime', () => {
        const definition = parseFormJson(
            formWith([{ id: 'shownWhen', type: 'readonly', params: { field: { id: 'when', name: 'when', type: 'datetime' } } }])
        );

        expect(field(definition, 'shownWhen').dateDisplayFormat).toBe('D-M-YYYY hh:mm A');
    });

    it('should read a datetime set to now, or saved as an ISO string, as a date', () => {
        const before = Date.now();
        const definition = parseFormJson(
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
        const definition = parseFormJson(
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
        const definition = parseFormJson(
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

    it('should keep a falsy saved value instead of the authored one or the one saved by field id', () => {
        const definition = parseFormJson(
            formWith([
                { id: 'agree', name: 'agreeName', type: 'boolean', value: true },
                { id: 'count', type: 'integer', value: 7 },
                { id: 'note', name: 'noteName', type: 'text', value: 'authored' },
                { id: 'missing', name: 'missingName', type: 'text', value: 'authored' }
            ]),
            undefined,
            { 'variables.agreeName': false, count: 0, 'variables.noteName': '', note: 'by id', 'variables.missingName': null }
        );

        expect(field(definition, 'agree').initialValue).toBeFalse();
        expect(field(definition, 'count').initialValue).toBe(0);
        expect(field(definition, 'note').initialValue).withContext('the variable value comes first, even empty').toBe('');
        expect(field(definition, 'missing').initialValue).withContext('a null value counts as not saved').toBe('authored');
    });

    it('should take the saved rows of a repeatable section from the saved values', () => {
        const definition = parseFormJson(
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

    it("should keep a field's authored JSON for widgets that read settings of their own", () => {
        const definition = parseFormJson(
            formWith([{ id: 'external', type: 'display-external-property', params: { externalPropertyLabel: 'Account' } }])
        );

        expect(field(definition, 'external').json.params?.['externalPropertyLabel']).toBe('Account');
    });

    it('should read whether the tab bar stays in view, from the form representation', () => {
        expect(parseFormJson(formWith([])).stickyTabs).toBeFalse();
        expect(parseFormJson({ formRepresentation: { stickyTabs: true, formDefinition: formWith([]).formDefinition } }).stickyTabs).toBeTrue();
    });

    it('should complete the choice options before reading the value, with the empty option and the saved one', () => {
        const definition = parseFormJson(
            formWith([
                {
                    id: 'country',
                    type: 'dropdown',
                    hasEmptyValue: true,
                    options: [{ id: 'it', name: 'Italy' }],
                    value: { id: 'fr', name: 'France' }
                },
                { id: 'size', type: 'radio-buttons', options: [{ id: 's', name: 'Small' }], value: { id: 'l', name: 'Large' } }
            ])
        );

        expect(field(definition, 'country').options.map(({ id }) => id)).toEqual(['empty', 'it', 'fr']);
        expect(field(definition, 'country').emptyOption?.id).toBe('empty');
        expect(field(definition, 'country').initialValue).toEqual({ id: 'fr', name: 'France' });
        expect(field(definition, 'size').options.map(({ id }) => id)).toEqual(['s', 'l']);
        expect(field(definition, 'size').initialValue).toBe('l');
    });

    it('should give no outcomes to a definition without fields, as today', () => {
        expect(parseFormJson({ formDefinition: { outcomes: [], variables: [] } } as FormDefinitionJson).outcomes).toEqual([]);
        expect(parseFormJson(formWith([])).outcomes.map(({ id }) => id)).toEqual(['$save', '$complete', '$startProcess']);
    });

    it('should count a dynamic date range from the day the form was read, so it does not move while the form is open', () => {
        const definition = parseFormJson(
            formWith([{ id: 'due', type: 'date', dynamicDateRangeSelection: true, minDateRangeValue: 1, maxDateRangeValue: 3 }])
        );
        const due = field(definition, 'due');
        expect(due.dateRangeReference instanceof Date).toBeTrue();

        const { min, max } = dateFieldRange({ ...due, dateRangeReference: new Date(2024, 0, 31) });

        expect(min).toEqual(new Date(2024, 1, 1));
        expect(max).toEqual(new Date(2024, 1, 3));
    });
});
