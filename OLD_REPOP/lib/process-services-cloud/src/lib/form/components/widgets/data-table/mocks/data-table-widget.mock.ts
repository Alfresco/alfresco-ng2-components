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

import { DataColumn, DataRow, ObjectDataColumn, ObjectDataRow } from '@alfresco/adf-core';
import { TaskVariableCloud } from '../../../../models/task-variable-cloud.model';

export const mockSchemaDefinition: DataColumn[] = [
    {
        type: 'text',
        key: 'id',
        title: 'Country ID',
        sortable: true,
        draggable: true
    },
    {
        type: 'text',
        key: 'name',
        title: 'Country Name',
        sortable: true,
        draggable: true
    }
];

export const mockSchemaDefinitionWithNestedKeys: DataColumn[] = [
    {
        type: 'text',
        key: 'countries.europeCountry.id',
        title: 'Country ID',
        sortable: true,
        draggable: true
    },
    {
        type: 'text',
        key: 'countries.europeCountry.name',
        title: 'Country Name',
        sortable: true,
        draggable: true
    }
];

export const mockCountryColumns: DataColumn[] = [
    new ObjectDataColumn({ key: 'id', type: 'text', title: 'Country ID', sortable: true, draggable: true }),
    new ObjectDataColumn({ key: 'name', type: 'text', title: 'Country Name', sortable: true, draggable: true })
];

export const mockNestedCountryColumns: DataColumn[] = [
    new ObjectDataColumn({ key: 'countries.europeCountry.id', type: 'text', title: 'Country ID', sortable: true, draggable: true }),
    new ObjectDataColumn({ key: 'countries.europeCountry.name', type: 'text', title: 'Country Name', sortable: true, draggable: true })
];

export const mockInvalidSchemaDefinition: DataColumn[] = [
    {
        type: 'text',
        key: '',
        title: 'Country ID',
        sortable: true,
        draggable: true
    },
    {
        type: 'text',
        key: undefined,
        title: 'Country Name',
        sortable: true,
        draggable: true
    }
];

export const mockEuropeCountriesData = [
    {
        id: 'PL',
        name: 'Poland'
    },
    {
        id: 'IT',
        name: 'Italy'
    },
    {
        id: 'UK',
        name: 'United Kingdom'
    }
];

export const mockEuropeCountriesRows: DataRow[] = [
    new ObjectDataRow({ id: 'IT', name: 'Italy' }),
    new ObjectDataRow({ id: 'PL', name: 'Poland' }),
    new ObjectDataRow({ id: 'UK', name: 'United Kingdom' })
];

export const mockNestedEuropeCountriesRows: DataRow[] = [
    new ObjectDataRow({ 'countries.europeCountry.id': 'IT', 'countries.europeCountry.name': 'Italy' }),
    new ObjectDataRow({ 'countries.europeCountry.id': 'PL', 'countries.europeCountry.name': 'Poland' }),
    new ObjectDataRow({ 'countries.europeCountry.id': 'UK', 'countries.europeCountry.name': 'United Kingdom' })
];

export const mockJsonResponseEuropeCountriesData = {
    data: mockEuropeCountriesData
};

export const mockJsonNestedResponseEuropeCountriesData = {
    response: {
        empty: [],
        'my-data': mockEuropeCountriesData,
        'single-object': mockEuropeCountriesData[0],
        'no-array-or-object': 'string-value',
        data: [
            {
                id: 'HR',
                name: 'Croatia'
            }
        ]
    }
};

export const mockNestedEuropeCountriesData = [
    {
        countries: {
            europeCountry: {
                id: 'PL',
                name: 'Poland'
            }
        }
    },
    {
        countries: {
            europeCountry: {
                id: 'IT',
                name: 'Italy'
            }
        }
    },
    {
        countries: {
            europeCountry: {
                id: 'UK',
                name: 'United Kingdom'
            }
        }
    }
];

export const mockAmericaCountriesData = [
    {
        id: 'CA',
        name: 'Canada'
    },
    {
        id: 'US',
        name: 'United States'
    },
    {
        id: 'MX',
        name: 'Mexico'
    }
];

export const mockAmericaCountriesRows: DataRow[] = [
    new ObjectDataRow({ id: 'CA', name: 'Canada' }),
    new ObjectDataRow({ id: 'MX', name: 'Mexico' }),
    new ObjectDataRow({ id: 'US', name: 'United States' })
];

export const mockIncompleteCountriesData = [
    {
        id: 'PL'
    },
    {
        id: 'IT'
    }
];

export const mockJsonFormVariableWithEmptyData = [new TaskVariableCloud({ name: 'json-form-variable', value: [], type: 'json', id: 'fake-id-1' })];

export const mockJsonFormVariableWithIncompleteData = [
    new TaskVariableCloud({ name: 'json-form-variable', value: mockIncompleteCountriesData, type: 'json', id: 'fake-id-1' })
];

export const mockJsonFormVariable = [
    new TaskVariableCloud({ name: 'json-form-variable', value: mockEuropeCountriesData, type: 'json', id: 'fake-id-1' })
];

export const mockJsonResponseFormVariable = [
    new TaskVariableCloud({ name: 'json-form-variable', value: mockJsonResponseEuropeCountriesData, type: 'json', id: 'fake-id-1' })
];

export const mockJsonNestedResponseFormVariable = [
    new TaskVariableCloud({ name: 'json-form-variable', value: mockJsonNestedResponseEuropeCountriesData, type: 'json', id: 'fake-id-1' })
];

export const mockJsonProcessVariables = [
    new TaskVariableCloud({ name: 'variables.json-variable', value: mockEuropeCountriesData, type: 'json', id: 'fake-id-1' }),
    new TaskVariableCloud({ name: 'variables.different-variable', value: 'fake-value', type: 'json', id: 'fake-id-2' })
];
