/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { DataColumn } from '@alfresco/adf-core';
import { TaskVariableCloud } from '../models/task-variable-cloud.model';

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

export const mockJsonResponseEuropeCountriesData = {
    data: mockEuropeCountriesData
};

export const mockJsonNestedResponseEuropeCountriesData = {
    response: {
        empty: [],
        'my-data': mockEuropeCountriesData,
        data: [
            {
                id: 'HR',
                name: 'Croatia'
            }
        ],
        'no-array': {}
    }
};

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

export const mockCountriesIncorrectData = [
    {
        id: 'PL'
    },
    {
        id: 'IT'
    }
];

export const mockJsonFormVariableWithIncorrectData = [
    new TaskVariableCloud({ name: 'json-form-variable', value: mockCountriesIncorrectData, type: 'json', id: 'fake-id-1' })
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
