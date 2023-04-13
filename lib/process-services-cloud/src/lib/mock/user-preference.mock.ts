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

export const mockPreferences = {
    list: {
        entries: [
            {
                entry: {
                    key: 'mock-preference-key-1',
                    value: [
                        { username: 'mock-username-1', firstName: 'mock-firstname-1' },
                        { username: 'mock-username-2', firstName: 'mock-firstname-2' }
                    ]
                }
            },
            {
                entry: {
                    key: 'mock-preference-key-2',
                    value: 'my mock preference value'
                }
            },
            {
                entry: {
                    key: 'mock-preference-key-3',
                    value: {
                        name: 'my-filter',
                        id: '3',
                        key: 'my-filter',
                        icon: 'adjust',
                        appName: 'mock-appName',
                        sort: 'startDate',
                        state: 'MOCK-COMPLETED',
                        order: 'DESC'
                    }
                }
            }
        ],
        pagination: {
            skipCount: 0,
            maxItems: 100,
            count: 3,
            hasMoreItems: false,
            totalItems: 3
        }
    }
};

export const fakeEmptyPreferences = {
    list: {
        entries: [],
        pagination: {
            skipCount: 0,
            maxItems: 100,
            count: 0,
            hasMoreItems: false,
            totalItems: 0
        }
    }
};

export const createMockPreference = {
    name: 'create-preference',
    id: '1',
    key: 'my-preference',
    icon: 'adjust',
    appName: 'mock-appName'
};

export const updateMockPreference = {
    name: 'update-preference',
    id: '1',
    key: 'update-preference',
    icon: 'adjust',
    appName: 'mock-appName'
};

export const getMockPreference =
    [
        { username: 'mock-username-1', firstName: 'mock-firstname-1', appName: 'mock-appName' },
        { username: 'mock-username-2', firstName: 'mock-firstname-2', appName: 'mock-appName' }
    ];
