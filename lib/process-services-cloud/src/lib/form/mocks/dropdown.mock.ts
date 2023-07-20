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

import { DropdownFormFieldOption } from '../components/widgets/dropdown/dropdown-cloud.widget';
import { TaskVariableCloud } from '../models/task-variable-cloud.model';

export const mockConditionalEntries = [
    {
        key: 'GR',
        options: [
            {
                id: 'empty',
                name: 'Choose one...',
                isDefault: true
            },
            {
                id: 'ATH',
                name: 'Athens',
                isDefault: false
            },
            {
                id: 'SKG',
                name: 'Thessaloniki',
                isDefault: false
            }
        ]
    },
    {
        key: 'IT',
        options: [
            {
                id: 'empty',
                name: 'Choose one...',
                isDefault: true
            },
            {
                id: 'MI',
                name: 'MILAN',
                isDefault: false
            },
            {
                id: 'RM',
                name: 'ROME',
                isDefault: false
            }
        ]
    },
    {
        key: 'UK',
        options: [
            {
                id: 'empty',
                name: 'Choose one...',
                isDefault: true
            },
            {
                id: 'LDN',
                name: 'London',
                isDefault: false
            },
            {
                id: 'MAN',
                name: 'Manchester',
                isDefault: false
            },
            {
                id: 'SHE',
                name: 'Sheffield',
                isDefault: false
            },
            {
                id: 'LEE',
                name: 'Leeds',
                isDefault: false
            }
        ]
    }
];

export const mockRestDropdownOptions: DropdownFormFieldOption[] = [
    { id: 'LO', name: 'LONDON', isDefault: false },
    { id: 'MA', name: 'MANCHESTER', isDefault: false }
];

export const mockSecondRestDropdownOptions: DropdownFormFieldOption[] = [
    { id: 'MI', name: 'MILAN', isDefault: false },
    { id: 'RM', name: 'ROME', isDefault: false }
];

export const fakeOptionList: DropdownFormFieldOption[] = [
    { id: 'opt_1', name: 'option_1', isDefault: false },
    { id: 'opt_2', name: 'option_2', isDefault: false },
    { id: 'opt_3', name: 'option_3', isDefault: false }
];

export const filterOptionList: DropdownFormFieldOption[] = [
    { id: 'opt_1', name: 'option_1', isDefault: false },
    { id: 'opt_2', name: 'option_2', isDefault: false },
    { id: 'opt_3', name: 'option_3', isDefault: false },
    { id: 'opt_4', name: 'option_4', isDefault: false },
    { id: 'opt_5', name: 'option_5', isDefault: false },
    { id: 'opt_6', name: 'option_6', isDefault: false }
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
            name: 'Dog',
            isDefault: false
        },
        {
            id: 'default-pet-2',
            name: 'Cat',
            isDefault: false
        },
        {
            id: 'default-pet-3',
            name: 'Parrot',
            isDefault: false
        }
    ]
};

export const mockCountriesResponse = {
    countries: [
        {
            id: 'PL',
            name: 'Poland',
            isDefault: false
        },
        {
            id: 'UK',
            name: 'United Kingdom',
            isDefault: false
        },
        {
            id: 'GR',
            name: 'Greece',
            isDefault: false
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
