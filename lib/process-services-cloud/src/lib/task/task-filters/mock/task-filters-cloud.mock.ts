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

import { assignedTaskDetailsCloudMock } from '../../task-header/mocks/task-details-cloud.mock';
import { TaskFilterCloudModel, ServiceTaskFilterCloudModel, AssignmentType, TaskStatusFilter } from '../models/filter-cloud.model';

export const fakeGlobalFilter: any[] = [
    {
        name: 'FakeInvolvedTasks',
        key: 'fake-involved-tasks',
        icon: 'adjust',
        id: '10',
        status: 'ASSIGNED',
        assignee: 'AssignedTaskUser',
        showCounter: true
    },
    {
        name: 'FakeMyTasks1',
        key: 'fake-my-task1',
        icon: 'done',
        id: '11',
        status: 'open',
        assignee: 'fake-assignee',
        showCounter: false
    },
    {
        name: 'FakeMyTasks2',
        key: 'fake-my-task2',
        icon: 'inbox',
        id: '12',
        status: 'open',
        assignee: 'fake-assignee'
    }
];

export const fakeGlobalServiceFilters: ServiceTaskFilterCloudModel[] = [
    {
        name: 'FakeServiceTasks',
        key: 'fake-involved-tasks',
        icon: 'adjust',
        id: '10',
        status: 'open'
    } as ServiceTaskFilterCloudModel,
    {
        name: 'FakeMyServiceTasks1',
        key: 'fake-my-task1',
        icon: 'done',
        id: '11',
        status: 'open'
    } as ServiceTaskFilterCloudModel,
    {
        name: 'FakeMyServiceTasks2',
        key: 'fake-my-task2',
        icon: 'inbox',
        id: '12',
        status: 'open'
    } as ServiceTaskFilterCloudModel
];

export const fakeFilter = new TaskFilterCloudModel({
    name: 'FakeInvolvedTasks',
    icon: 'adjust',
    id: 'mock-task-filter-id',
    status: TaskStatusFilter.CREATED,
    appName: 'mock-app-name',
    processDefinitionId: 'process-def-id',
    assignee: 'fake-involved',
    assignment: AssignmentType.NONE,
    order: 'ASC',
    sort: 'id',
    completedBy: {
        id: 'mock-id',
        username: 'testCompletedByUser'
    }
});

export const fakeServiceFilter = {
    name: 'FakeInvolvedTasks',
    icon: 'adjust',
    id: 'mock-task-filter-id',
    status: 'COMPLETED',
    appName: 'mock-app-name',
    processDefinitionId: 'process-def-id',
    activityName: 'fake-activity',
    order: 'ASC',
    sort: 'id'
} as ServiceTaskFilterCloudModel;

export const fakeAllTaskFilter = new TaskFilterCloudModel({
    name: 'AllTasks',
    icon: 'adjust',
    id: 'mock-task-filter-id',
    status: TaskStatusFilter.ALL,
    appName: 'mock-app-name',
    processDefinitionId: 'process-def-id',
    assignee: 'fake-involved',
    order: 'ASC',
    sort: 'id'
});

export const fakeTaskCloudPreferenceList = {
    list: {
        entries: [
            {
                entry: {
                    key: 'task-filters-fakeAppName-mock-username',
                    value: JSON.stringify([
                        {
                            name: 'FAKE_TASK_1',
                            id: '1',
                            key: 'all-fake-task',
                            icon: 'adjust',
                            appName: 'fakeAppName',
                            sort: 'startDate',
                            status: 'ALL',
                            order: 'DESC'
                        },
                        {
                            name: 'FAKE_TASK_2',
                            id: '2',
                            key: 'run-fake-task',
                            icon: 'adjust',
                            appName: 'fakeAppName',
                            sort: 'startDate',
                            status: 'RUNNING',
                            order: 'DESC'
                        },
                        {
                            name: 'FAKE_TASK_3',
                            id: '3',
                            key: 'complete-fake-task',
                            icon: 'adjust',
                            appName: 'fakeAppName',
                            sort: 'startDate',
                            status: 'COMPLETED',
                            order: 'DESC'
                        }
                    ])
                }
            },
            {
                entry: {
                    key: 'mock-key-2',
                    value: {
                        name: 'FAKE_TASK_2',
                        id: '2',
                        key: 'run-fake-task',
                        icon: 'adjust',
                        appName: 'fakeAppName',
                        sort: 'startDate',
                        status: 'RUNNING',
                        order: 'DESC'
                    }
                }
            },
            {
                entry: {
                    key: 'mock-key-3',
                    value: {
                        name: 'FAKE_TASK_3',
                        id: '3',
                        key: 'complete-fake-task',
                        icon: 'adjust',
                        appName: 'fakeAppName',
                        sort: 'startDate',
                        status: 'COMPLETED`',
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

export const fakeEmptyTaskCloudPreferenceList = {
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

export const fakePreferenceWithNoTaskFilterPreference = {
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

export const fakeTaskFilter = new TaskFilterCloudModel({
    name: 'FAKE_TASK_1',
    id: '1',
    key: 'all-fake-task',
    icon: 'adjust',
    appName: 'fakeAppName',
    sort: 'startDate',
    order: 'DESC',
    status: 'ALL'
});

export const fakeTaskCloudFilters = [
    {
        name: 'FAKE_TASK_1',
        id: '1',
        key: 'all-fake-task',
        icon: 'adjust',
        appName: 'fakeAppName',
        sort: 'startDate',
        status: 'ALL',
        order: 'DESC'
    },
    {
        name: 'FAKE_TASK_2',
        id: '2',
        key: 'run-fake-task',
        icon: 'adjust',
        appName: 'fakeAppName',
        sort: 'startDate',
        status: 'RUNNING',
        order: 'DESC'
    },
    {
        name: 'FAKE_TASK_3',
        id: '3',
        key: 'complete-fake-task',
        icon: 'adjust',
        appName: 'fakeAppName',
        sort: 'startDate',
        status: 'COMPLETED',
        order: 'DESC'
    }
];

export const taskNotifications = [
    {
        eventType: 'TASK_ASSIGNED',
        entity: assignedTaskDetailsCloudMock
    }
];

export const taskCloudEngineEventsMock = {
    data: {
        engineEvents: taskNotifications
    }
};

export const defaultTaskFiltersMock = [
    {
        name: 'CREATED_TASK_FILTER',
        id: '1',
        key: 'created',
        icon: 'adjust',
        appName: 'fakeAppName',
        sort: 'startDate',
        status: TaskStatusFilter.CREATED,
        order: 'DESC'
    },
    {
        name: 'ASSIGNED_TASK_FILTER',
        id: '2',
        key: 'assigned',
        icon: 'adjust',
        appName: 'fakeAppName',
        sort: 'startDate',
        status: TaskStatusFilter.ASSIGNED,
        order: 'DESC'
    },
    {
        name: 'COMPLETED_TASK_FILTER',
        id: '3',
        key: 'complete-fake-task',
        icon: 'adjust',
        appName: 'fakeAppName',
        sort: 'startDate',
        status: TaskStatusFilter.COMPLETED,
        order: 'DESC'
    }
];
