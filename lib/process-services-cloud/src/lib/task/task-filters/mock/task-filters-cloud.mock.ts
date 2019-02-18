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

import { TaskFilterCloudModel } from '../models/filter-cloud.model';

export let fakeGlobalFilter = [
    new TaskFilterCloudModel({
        name: 'FakeInvolvedTasks',
        key: 'fake-involved-tasks',
        icon: 'adjust',
        id: 10,
        status: 'open',
        assignee: 'fake-involved'
    }),
    new TaskFilterCloudModel({
        name: 'FakeMyTasks1',
        key: 'fake-my-tast1',
        icon: 'done',
        id: 11,
        status: 'open',
        assignee: 'fake-assignee'
    }),
    new TaskFilterCloudModel({
        name: 'FakeMyTasks2',
        key: 'fake-my-tast2',
        icon: 'inbox',
        id: 12,
        status: 'open',
        assignee: 'fake-assignee'
    })
];

export let fakeFilter = new TaskFilterCloudModel({
    name: 'FakeInvolvedTasks',
    icon: 'adjust',
    id: 'mock-task-filter-id',
    status: 'CREATED',
    appName: 'mock-app-name',
    processDefinitionId: 'process-def-id',
    assignee: 'fake-involved',
    order: 'ASC',
    sort: 'id'
});
