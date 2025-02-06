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

import { WidgetDataTableAdapter } from './data-table-adapter.widget';
import {
    mockEuropeCountriesData,
    mockCountriesIncorrectData,
    mockInvalidSchemaDefinition,
    mockSchemaDefinition
} from './mocks/data-table-widget.mock';
import { mockPersonDataFirstRow, mockPersonsData } from './mocks/data-table-adapter.mock';
import { DataColumn, ObjectDataColumn, ObjectDataRow } from '@alfresco/adf-core';

describe('WidgetDataTableAdapter', () => {
    let widgetDataTableAdapter: WidgetDataTableAdapter;

    beforeEach(() => {
        widgetDataTableAdapter = new WidgetDataTableAdapter(mockEuropeCountriesData, mockSchemaDefinition);
    });

    it('should return rows if all columns are linked to data', () => {
        const rows = widgetDataTableAdapter.getRows();

        expect(rows).toEqual([
            new ObjectDataRow({ id: 'IT', name: 'Italy' }),
            new ObjectDataRow({ id: 'PL', name: 'Poland' }),
            new ObjectDataRow({ id: 'UK', name: 'United Kingdom' })
        ]);
    });

    it('should return an empty array if not all columns are linked to data', () => {
        widgetDataTableAdapter = new WidgetDataTableAdapter(mockCountriesIncorrectData, mockSchemaDefinition);
        const rows = widgetDataTableAdapter.getRows();
        const isDataSourceValid = widgetDataTableAdapter.isDataSourceValid();

        expect(rows).toEqual([]);
        expect(isDataSourceValid).toBeFalse();
    });

    it('should return an empty array if columns have invalid structure', () => {
        widgetDataTableAdapter = new WidgetDataTableAdapter(mockEuropeCountriesData, mockInvalidSchemaDefinition);
        const rows = widgetDataTableAdapter.getRows();
        const isDataSourceValid = widgetDataTableAdapter.isDataSourceValid();

        expect(rows).toEqual([]);
        expect(isDataSourceValid).toBeFalse();
    });

    it('should return true for isDataSourceValid() if rows have data and valid columns schema', () => {
        const isValid = widgetDataTableAdapter.isDataSourceValid();

        expect(isValid).toBeTrue();
    });

    describe('should create proper rows and columns from schema and data with nested properties for', () => {
        it('one column', () => {
            const mockPersonSchema: DataColumn[] = [
                {
                    type: 'text',
                    key: 'person.name',
                    title: 'Name'
                }
            ];

            const adapter = new WidgetDataTableAdapter(mockPersonsData, mockPersonSchema);
            const rows = adapter.getRows();
            const columns = adapter.getColumns();

            const expectedFirstRow = new ObjectDataRow({
                'person.name': 'John Doe'
            });
            const expectedSecondRow = new ObjectDataRow({
                'person.name': 'Sam Smith'
            });
            const expectedColumns = [new ObjectDataColumn({ key: 'person.name', type: 'text', title: 'Name' })];

            expect(rows.length).toBe(2);
            expect(rows[0]).toEqual(expectedFirstRow);
            expect(rows[1]).toEqual(expectedSecondRow);

            expect(columns.length).toBe(1);
            expect(columns).toEqual(expectedColumns);
        });

        it('one row', () => {
            const mockPersonSchema: DataColumn[] = [
                {
                    type: 'text',
                    key: 'name',
                    title: 'Name'
                },
                {
                    type: 'text',
                    key: 'personData.[address.[data]test].city',
                    title: 'City'
                }
            ];

            const adapter = new WidgetDataTableAdapter([mockPersonDataFirstRow], mockPersonSchema);
            const rows = adapter.getRows();
            const columns = adapter.getColumns();

            const expectedFirstRow = new ObjectDataRow({
                name: 'John Doe',
                'personData.[address.[data]test].city': 'Springfield'
            });
            const expectedColumns = [
                new ObjectDataColumn({ key: 'name', type: 'text', title: 'Name' }),
                new ObjectDataColumn({ key: 'personData.[address.[data]test].city', type: 'text', title: 'City' })
            ];

            expect(rows.length).toBe(1);
            expect(rows[0]).toEqual(expectedFirstRow);

            expect(columns.length).toBe(2);
            expect(columns).toEqual(expectedColumns);
        });

        it('complex schema', () => {
            const mockPersonSchema: DataColumn[] = [
                {
                    type: 'text',
                    key: 'person.name',
                    title: 'Name'
                },
                {
                    type: 'text',
                    key: 'person.personData.[address.[data]test].city',
                    title: 'City'
                },
                {
                    type: 'text',
                    key: 'person.personData.[address.[data]test].street',
                    title: 'Street'
                },
                {
                    type: 'json',
                    key: 'person.phoneNumbers',
                    title: 'Phone numbers'
                },
                {
                    type: 'text',
                    key: 'person.phoneNumbers[0].phoneNumber',
                    title: 'Phone Home'
                },
                {
                    type: 'text',
                    key: 'person.phoneNumbers[1].phoneNumber',
                    title: 'Phone Work'
                },
                {
                    type: 'text',
                    key: 'person.cars[0].previousOwners[0].name',
                    title: 'Last Car Owner'
                }
            ];

            const adapter = new WidgetDataTableAdapter(mockPersonsData, mockPersonSchema);
            const rows = adapter.getRows();
            const columns = adapter.getColumns();

            const expectedFirstRow = new ObjectDataRow({
                'person.personData.[address.[data]test].city': 'Springfield',
                'person.personData.[address.[data]test].street': '1234 Main St',
                'person.name': 'John Doe',
                'person.phoneNumbers': [
                    { type: 'home', phoneNumber: '123-456-7890' },
                    { type: 'work', phoneNumber: '098-765-4321' }
                ],
                'person.phoneNumbers[0].phoneNumber': '123-456-7890',
                'person.phoneNumbers[1].phoneNumber': '098-765-4321',
                'person.cars[0].previousOwners[0].name': 'Jane Smith'
            });
            const expectedSecondRow = new ObjectDataRow({
                'person.personData.[address.[data]test].city': 'Westlake',
                'person.personData.[address.[data]test].street': '731 Second St',
                'person.name': 'Sam Smith',
                'person.phoneNumbers': [
                    { type: 'home', phoneNumber: '123-456-7891' },
                    { type: 'work', phoneNumber: '321-654-1987' }
                ],
                'person.phoneNumbers[0].phoneNumber': '123-456-7891',
                'person.phoneNumbers[1].phoneNumber': '321-654-1987',
                'person.cars[0].previousOwners[0].name': 'Bob Johnson'
            });
            const expectedColumns = [
                new ObjectDataColumn({ key: 'person.name', type: 'text', title: 'Name' }),
                new ObjectDataColumn({ key: 'person.personData.[address.[data]test].city', type: 'text', title: 'City' }),
                new ObjectDataColumn({ key: 'person.personData.[address.[data]test].street', type: 'text', title: 'Street' }),
                new ObjectDataColumn({ key: 'person.phoneNumbers', type: 'json', title: 'Phone numbers' }),
                new ObjectDataColumn({ key: 'person.phoneNumbers[0].phoneNumber', type: 'text', title: 'Phone Home' }),
                new ObjectDataColumn({ key: 'person.phoneNumbers[1].phoneNumber', type: 'text', title: 'Phone Work' }),
                new ObjectDataColumn({ key: 'person.cars[0].previousOwners[0].name', type: 'text', title: 'Last Car Owner' })
            ];

            expect(rows.length).toBe(2);
            expect(rows[0]).toEqual(expectedFirstRow);
            expect(rows[1]).toEqual(expectedSecondRow);

            expect(columns.length).toBe(7);
            expect(columns).toEqual(expectedColumns);
        });
    });
});
