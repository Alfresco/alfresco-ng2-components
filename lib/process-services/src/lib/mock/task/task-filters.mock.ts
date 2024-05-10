/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { FilterRepresentationModel } from '../../task-list/models/filter.model';
import { TaskQueryRepresentation } from '@alfresco/js-api';

export const fakeFiltersResponse: any = {
    size: 2,
    total: 2,
    start: 0,
    data: [
        {
            id: 1,
            name: 'FakeInvolvedTasks',
            recent: false,
            icon: 'glyphicon-align-left',
            filter: { sort: 'created-desc', name: '', state: 'open', assignment: 'fake-involved' }
        },
        {
            id: 2,
            name: 'FakeMyTasks',
            recent: false,
            icon: 'glyphicon-align-left',
            filter: { sort: 'created-desc', name: '', state: 'open', assignment: 'fake-assignee' }
        }
    ]
};

export const fakeTaskFilters = [
    new FilterRepresentationModel({
        name: 'FakeInvolvedTasks',
        icon: 'glyphicon-align-left',
        id: 10,
        filter: { state: 'open', assignment: 'fake-involved' }
    }),
    new FilterRepresentationModel({
        name: 'FakeMyTasks1',
        icon: 'glyphicon-ok-sign',
        id: 11,
        filter: { state: 'open', assignment: 'fake-assignee' }
    }),
    new FilterRepresentationModel({
        name: 'FakeMyTasks2',
        icon: 'glyphicon-inbox',
        id: 12,
        filter: { state: 'open', assignment: 'fake-assignee' }
    })
];

export const fakeAppFilter = {
    size: 1,
    total: 1,
    start: 0,
    data: [
        {
            id: 1,
            name: 'FakeInvolvedTasks',
            recent: false,
            icon: 'glyphicon-align-left',
            filter: { sort: 'created-desc', name: '', state: 'open', assignment: 'fake-involved' }
        }
    ]
};

export const fakeFilter: TaskQueryRepresentation = {
    sort: 'created-desc',
    text: '',
    state: 'open',
    assignment: 'fake-assignee'
};

export const mockFilterNoState: TaskQueryRepresentation = {
    sort: 'created-desc',
    text: '',
    assignment: 'fake-assignee'
};

export const dummyMyTasksFilter = {
    appId: 101,
    name: 'My Tasks',
    filter: { sort: 'created-desc', name: '', state: 'open', assignment: 'fake-mytasks' },
    icon: 'fa-random',
    id: 81,
    index: 21,
    recent: false,
    hasFilter: () => true
};

export const dummyInvolvedTasksFilter = {
    appId: 101,
    name: 'Involved Tasks',
    filter: { sort: 'created-desc', name: '', state: 'open', assignment: 'fake-involved' },
    icon: 'fa-random',
    id: 82,
    index: 22,
    recent: false,
    hasFilter: () => true
};

export const dummyQueuedTasksFilter = {
    appId: 101,
    name: 'Queued Tasks',
    filter: { sort: 'created-desc', name: '', state: 'open', assignment: 'fake-queued' },
    icon: 'fa-random',
    id: 83,
    index: 23,
    recent: false,
    hasFilter: () => true
};

export const dummyCompletedTasksFilter = {
    appId: 101,
    name: 'Completed',
    filter: { sort: 'created-desc', name: '', state: 'open', assignment: 'fake-completed' },
    icon: 'fa-random',
    id: 84,
    index: 24,
    recent: false,
    hasFilter: () => true
};

export const dummyDuplicateMyTasksFilter = {
    appId: 101,
    name: 'My Tasks',
    filter: { sort: 'created-desc', name: '', state: 'open', assignment: 'fake-mytasks' },
    icon: 'fa-random',
    id: 85,
    index: 25,
    recent: false,
    hasFilter: () => true
};
