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

import { FormFieldOption } from '@alfresco/adf-core';
import { TaskVariableCloud } from '../models/task-variable-cloud.model';

export const mockConditionalEntries = [
    {
        key: 'GR',
        options: [
            {
                id: 'empty',
                name: 'Choose one...'
            },
            {
                id: 'ATH',
                name: 'Athens'
            },
            {
                id: 'SKG',
                name: 'Thessaloniki'
            }
        ]
    },
    {
        key: 'IT',
        options: [
            {
                id: 'empty',
                name: 'Choose one...'
            },
            {
                id: 'MI',
                name: 'MILAN'
            },
            {
                id: 'RM',
                name: 'ROME'
            }
        ]
    },
    {
        key: 'UK',
        options: [
            {
                id: 'empty',
                name: 'Choose one...'
            },
            {
                id: 'LDN',
                name: 'London'
            },
            {
                id: 'MAN',
                name: 'Manchester'
            },
            {
                id: 'SHE',
                name: 'Sheffield'
            },
            {
                id: 'LEE',
                name: 'Leeds'
            }
        ]
    }
];

export const mockRestDropdownOptions: FormFieldOption[] = [
    { id: 'LO', name: 'LONDON' },
    { id: 'MA', name: 'MANCHESTER' }
];

export const mockSecondRestDropdownOptions: FormFieldOption[] = [
    { id: 'MI', name: 'MILAN' },
    { id: 'RM', name: 'ROME' }
];

export const fakeOptionList: FormFieldOption[] = [
    { id: 'opt_1', name: 'option_1' },
    { id: 'opt_2', name: 'option_2' },
    { id: 'opt_3', name: 'option_3' }
];

export const filterOptionList = [
    { id: 'opt_1', name: 'option_1' },
    { id: 'opt_2', name: 'option_2' },
    { id: 'opt_3', name: 'option_3' },
    { id: 'opt_4', name: 'option_4' },
    { id: 'opt_5', name: 'option_5' },
    { id: 'opt_6', name: 'option_6' }
];

export const mockPlayersResponse = {
    response: {
        people: {
            players:
                [
                    {
                        playerId: 'player-1',
                        playerFullName: 'Lionel Messi',
                        totalGoals: 999,
                        shirtNumber: 10
                    },
                    {
                        playerId: 'player-2',
                        playerFullName: 'Cristiano Ronaldo',
                        totalGoals: 15,
                        shirtNumber: 7
                    },
                    {
                        playerId: 'player-3',
                        playerFullName: 'Robert Lewandowski',
                        totalGoals: 500,
                        shirtNumber: 9
                    }
                ]
        }
    }
};

export const mockDefaultResponse = {
    data:
    [
        {
            id: 'default-pet-1',
            name: 'Dog'
        },
        {
            id: 'default-pet-2',
            name: 'Cat'
        },
        {
            id: 'default-pet-3',
            name: 'Parrot'
        }
    ]
};

export const mockCountriesResponse = {
    countries: [
        {
            id: 'PL',
            name: 'Poland'
        },
        {
            id: 'UK',
            name: 'United Kingdom'
        },
        {
            id: 'GR',
            name: 'Greece'
        }
    ]
};

export const mockFormVariableWithJson = [
    new TaskVariableCloud({ name: 'json-form-variable', value: mockCountriesResponse, type: 'json', id: 'fake-id-1' })
];

export const mockProcessVariablesWithJson = [
    new TaskVariableCloud({ name: 'variables.json-variable', value: mockPlayersResponse, type: 'json', id: 'fake-id-1' }),
    new TaskVariableCloud({ name: 'variables.different-variable', value: 'fake-value', type: 'json', id: 'fake-id-2' })
];

export const mockVariablesWithDefaultJson = [
    new TaskVariableCloud({ name: 'variables.json-default-variable', value: mockDefaultResponse, type: 'json', id: 'fake-id-1' })
];
