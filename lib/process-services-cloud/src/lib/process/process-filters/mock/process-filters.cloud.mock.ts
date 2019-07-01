/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { ProcessFilterCloudModel } from '../models/process-filter-cloud.model';

export const fakeProcessCloudFilterEntries = {
    list: {
        entries: [
            {
                entry: {
                    key: 'process-filters-mock-appName-mock-username',
                    value: JSON.stringify([
                        {
                            name: 'MOCK_PROCESS_NAME_1',
                            id: '1',
                            key: 'all-mock-process',
                            icon: 'adjust',
                            appName: 'mock-appName',
                            sort: 'startDate',
                            status: 'MOCK_ALL',
                            order: 'DESC'
                        },
                        {
                            name: 'MOCK_PROCESS_NAME_2',
                            id: '2',
                            key: 'run-mock-process',
                            icon: 'adjust',
                            appName: 'mock-appName',
                            sort: 'startDate',
                            status: 'MOCK-RUNNING',
                            order: 'DESC'
                        },
                        {
                            name: 'MOCK_PROCESS_NAME_3',
                            id: '3',
                            key: 'complete-mock-process',
                            icon: 'adjust',
                            appName: 'mock-appName',
                            sort: 'startDate',
                            status: 'MOCK-COMPLETED',
                            order: 'DESC'
                        }
                    ])
                }
            },
            {
                entry: {
                    key: 'mock-key-2',
                    value: {
                        name: 'MOCK_PROCESS_NAME_2',
                        id: '2',
                        key: 'run-mock-process',
                        icon: 'adjust',
                        appName: 'mock-appName',
                        sort: 'startDate',
                        status: 'MOCK-RUNNING',
                        order: 'DESC'
                    }
                }
            },
            {
                entry: {
                    key: 'mock-key-3',
                    value: {
                        name: 'MOCK_PROCESS_NAME_3',
                        id: '3',
                        key: 'complete-mock-process',
                        icon: 'adjust',
                        appName: 'mock-appName',
                        sort: 'startDate',
                        status: 'MOCK-COMPLETED',
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

export const fakeEmptyProcessCloudFilterEntries = {
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

export const fakeProcessCloudFilterWithDifferentEntries = {
    list: {
        entries: [
            {
                entry: {
                    key: 'my-mock-key-1',
                    value: 'my-mock-value-2'
                }
            },
            {
                entry: {
                    key: 'my-mock-key-2',
                    value: 'my-mock-key-2'
                }
            }
        ],
        pagination: {
            skipCount: 0,
            maxItems: 100,
            count: 4,
            hasMoreItems: false,
            totalItems: 2
        }
    }
};

export const fakeProcessFilter: ProcessFilterCloudModel = {
    name: 'MOCK_PROCESS_NAME_1',
    id: '1',
    key: 'all-mock-process',
    icon: 'adjust',
    appName: 'mock-appName',
    sort: 'startDate',
    status: 'MOCK_ALL',
    order: 'DESC',
    index: 2,
    processName: 'process-name',
    processInstanceId: 'processinstanceid',
    initiator: 'mockuser',
    processDefinitionId: 'processDefid',
    processDefinitionKey: 'processDefKey',
    lastModified: null,
    lastModifiedTo: null,
    lastModifiedFrom: null
};

export const fakeProcessCloudFilters = [
    {
        name: 'MOCK_PROCESS_NAME_1',
        id: '1',
        key: 'all-mock-process',
        icon: 'adjust',
        appName: 'mock-appName',
        sort: 'startDate',
        status: 'MOCK_ALL',
        order: 'DESC'
    },
    {
        name: 'MOCK_PROCESS_NAME_2',
        id: '2',
        key: 'run-mock-process',
        icon: 'adjust',
        appName: 'mock-appName',
        sort: 'startDate',
        status: 'MOCK-RUNNING',
        order: 'DESC'
    },
    {
        name: 'MOCK_PROCESS_NAME_3',
        id: '3',
        key: 'complete-mock-process',
        icon: 'adjust',
        appName: 'mock-appName',
        sort: 'startDate',
        status: 'MOCK-COMPLETED',
        order: 'DESC'
    }
];
