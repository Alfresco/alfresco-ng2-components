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

import { FilterRepresentationModel, TaskQueryRequestRepresentationModel } from '../../task-list/models/filter.model';

export const fakeFiltersResponse: any = {
    size: 2, total: 2, start: 0,
    data: [
        {
            id: 1, name: 'FakeInvolvedTasks', recent: false, icon: 'glyphicon-align-left',
            filter: { sort: 'created-desc', name: '', state: 'open', assignment: 'fake-involved' }
        },
        {
            id: 2, name: 'FakeMyTasks', recent: false, icon: 'glyphicon-align-left',
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
    size: 1, total: 1, start: 0,
    data: [
        {
            id: 1, name: 'FakeInvolvedTasks', recent: false, icon: 'glyphicon-align-left',
            filter: { sort: 'created-desc', name: '', state: 'open', assignment: 'fake-involved' }
        }
    ]
};

export const fakeFilter: TaskQueryRequestRepresentationModel = {
    sort: 'created-desc',
    text: '',
    state: 'open',
    assignment: 'fake-assignee'
};

export const fakeRepresentationFilter1: FilterRepresentationModel = new FilterRepresentationModel({
    appId: 1,
    name: 'CONTAIN FILTER',
    recent: true,
    icon: 'glyphicon-align-left',
    filter: {
        processDefinitionId: null,
        processDefinitionKey: null,
        name: null,
        state: 'open',
        sort: 'created-desc',
        assignment: 'involved',
        dueAfter: null,
        dueBefore: null
    }
});

export const fakeRepresentationFilter2: FilterRepresentationModel = new FilterRepresentationModel({
    appId: 2,
    name: 'NO TASK FILTER',
    recent: false,
    icon: 'glyphicon-inbox',
    filter: {
        processDefinitionId: null,
        processDefinitionKey: null,
        name: null,
        state: 'open',
        sort: 'created-desc',
        assignment: 'assignee',
        dueAfter: null,
        dueBefore: null
    }
});
