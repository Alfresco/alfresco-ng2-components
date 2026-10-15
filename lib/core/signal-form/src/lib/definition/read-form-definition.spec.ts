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
});
