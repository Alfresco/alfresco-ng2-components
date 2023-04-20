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

import { ProcessFilterCloudModel } from '../models/process-filter-cloud.model';
import { DateCloudFilterType } from '../../../../..';
import { ApplicationVersionModel } from '../../../models/application-version.model';

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

export const mockProcessFilters: any[] = [
    {
        name: 'FakeAllProcesses',
        key: 'FakeAllProcesses',
        icon: 'adjust',
        id: '10',
        status: ''
    },
    {
        name: 'FakeRunningProcesses',
        key: 'FakeRunningProcesses',
        icon: 'inbox',
        id: '11',
        status: 'RUNNING'
    },
    {
        name: 'FakeCompletedProcesses',
        key: 'completed-processes',
        icon: 'done',
        id: '12',
        status: 'COMPLETED'
    }
];

export const fakeProcessFilter: ProcessFilterCloudModel = new ProcessFilterCloudModel({
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
    processDefinitionName: 'process-def-name',
    processInstanceId: 'processinstanceid',
    initiator: 'mockuser',
    processDefinitionId: 'processDefid',
    processDefinitionKey: 'processDefKey',
    lastModified: null,
    lastModifiedTo: null,
    lastModifiedFrom: null,
    completedDateType: DateCloudFilterType.NO_DATE,
    startedDateType: DateCloudFilterType.NO_DATE,
    _completedFrom: null,
    _completedTo: null,
    startedDate: null,
    _startFrom: null,
    _startTo: null
});

export const fakeProcessCloudFilterEntries = {
    list: {
        entries: [
            {
                entry: {
                    key: 'process-filters-mock-appName-mock-username',
                    value: JSON.stringify(fakeProcessCloudFilters)
                }
            },
            {
                entry: fakeProcessCloudFilters[1]
            },
            {
                entry: fakeProcessCloudFilters[2]
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

const mockAppVersion1: ApplicationVersionModel = {
    entry: {
        id: 'mock-version-1-id',
        name: 'mock-version-1-name',
        version: '1'
    }
};

const mockAppVersion2: ApplicationVersionModel = {
    entry: {
        id: 'mock-version-2-id',
        name: 'mock-version-2-name',
        version: '2'
    }
};

export const mockAppVersions = [mockAppVersion1, mockAppVersion2];
