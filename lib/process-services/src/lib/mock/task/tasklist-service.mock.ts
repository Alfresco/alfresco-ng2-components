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

import { TaskListModel } from '../../task-list/models/task-list.model';
import { fakeAppFilter } from './task-filters.mock';

export const fakeApps = {
    size: 2, total: 2, start: 0,
    data: [
        {
            id: 1, defaultAppId: null, name: 'Sales-Fakes-App', description: 'desc-fake1', modelId: 22,
            theme: 'theme-1-fake', icon: 'glyphicon-asterisk', deploymentId: '111', tenantId: null
        },
        {
            id: 2, defaultAppId: null, name: 'health-care-Fake', description: 'desc-fake2', modelId: 33,
            theme: 'theme-2-fake', icon: 'glyphicon-asterisk', deploymentId: '444', tenantId: null
        }
    ]
};

export const fakeUser1 = { id: 1, email: 'fake-email@dom.com', firstName: 'firstName', lastName: 'lastName' };

export const fakeUser2 = { id: 1001, email: 'some-one@somegroup.com', firstName: 'some', lastName: 'one' };

export const fakeTaskList = new TaskListModel({
    size: 1, total: 1, start: 0,
    data: [
        {
            id: '1', name: 'FakeNameTask', description: null, category: null,
            assignee: fakeUser1,
            created: '2016-07-15T11:19:17.440+0000'
        }
    ]
});

export const fakeTaskListDifferentProcessDefinitionKey = {
    size: 2, total: 1, start: 0,
    data: [
        {
            id: '1', name: 'FakeNameTask', description: null, category: null,
            assignee: fakeUser1,
            processDefinitionKey: '1',
            created: '2016-07-15T11:19:17.440+0000'
        },
        {
            id: '2', name: 'FakeNameTask2', description: null, category: null,
            assignee: fakeUser1,
            processDefinitionKey: '2',
            created: '2016-07-15T11:19:17.440+0000'
        }
    ]
};

export const secondFakeTaskList = {
    size: 1, total: 1, start: 0,
    data: [
        {
            id: '200', name: 'FakeNameTask', description: null, category: null,
            assignee: fakeUser1,
            created: '2016-07-15T11:19:17.440+0000'
        }
    ]
};

export const mockErrorTaskList = {
    error: 'wrong request'
};

export const fakeTaskDetails = { id: '999', name: 'fake-task-name', formKey: '99', assignee: fakeUser1 };

export const fakeTasksComment = {
    size: 2, total: 2, start: 0,
    data: [
        {
            id: 1, message: 'fake-message-1', created: '', createdBy: fakeUser1
        },
        {
            id: 2, message: 'fake-message-2', created: '', createdBy: fakeUser1
        }
    ]
};

export const fakeTasksChecklist = {
    size: 1, total: 1, start: 0,
    data: [
        {
            id: 1, name: 'FakeCheckTask1', description: null, category: null,
            assignee: fakeUser1,
            created: '2016-07-15T11:19:17.440+0000'
        },
        {
            id: 2, name: 'FakeCheckTask2', description: null, category: null,
            assignee: fakeUser1,
            created: '2016-07-15T11:19:17.440+0000'
        }
    ]
};

export const fakeAppPromise = new Promise((resolve) => {
    resolve(fakeAppFilter);
});

export const fakeFormList = {
    size: 2,
    total: 2,
    start: 0,
    data: [{
        id: 1,
        name: 'form with all widgets',
        description: '',
        createdBy: 2,
        createdByFullName: 'Admin Admin',
        lastUpdatedBy: 2,
        lastUpdatedByFullName: 'Admin Admin',
        lastUpdated: 1491400951205,
        latestVersion: true,
        version: 4,
        comment: null,
        stencilSet: null,
        referenceId: null,
        modelType: 2,
        favorite: null,
        permission: 'write',
        tenantId: null
    }, {
        id: 2,
        name: 'uppy',
        description: '',
        createdBy: 2,
        createdByFullName: 'Admin Admin',
        lastUpdatedBy: 2,
        lastUpdatedByFullName: 'Admin Admin',
        lastUpdated: 1490951054477,
        latestVersion: true,
        version: 2,
        comment: null,
        stencilSet: null,
        referenceId: null,
        modelType: 2,
        favorite: null,
        permission: 'write',
        tenantId: null
    }]
};

export const fakeTaskOpen1 = {
        id: '1', name: 'FakeOpenTask1', description: null, category: null,
        assignee: fakeUser1,
        created: '2017-07-15T11:19:17.440+0000',
        dueDate: null,
        endDate: null
    };

export const fakeTaskOpen2 = {
        id: '1', name: 'FakeOpenTask2', description: null, category: null,
        assignee: { id: 1, email: 'fake-open-email@dom.com', firstName: 'firstName', lastName: 'lastName' },
        created: '2017-07-15T11:19:17.440+0000',
        dueDate: null,
        endDate: null
    };

export const fakeTaskCompleted1 = {
        id: '1', name: 'FakeCompletedTaskName1', description: null, category: null,
        assignee: { id: 1, email: 'fake-completed-email@dom.com', firstName: 'firstName', lastName: 'lastName' },
        created: '2016-07-15T11:19:17.440+0000',
        dueDate: null,
        endDate: '2016-11-03T15:25:42.749+0000'
    };

export const fakeTaskCompleted2 = {
        id: '1', name: 'FakeCompletedTaskName2', description: null, category: null,
        assignee: fakeUser1,
        created: null,
        dueDate: null,
        endDate: '2016-11-03T15:25:42.749+0000'
    };

export const fakeOpenTaskList = new TaskListModel({
    size: 2,
    total: 2,
    start: 0,
    data: [fakeTaskOpen1, fakeTaskOpen2]
});

export const fakeCompletedTaskList = new TaskListModel({
    size: 2,
    total: 2,
    start: 0,
    data: [fakeTaskCompleted1, fakeTaskCompleted2]
});
