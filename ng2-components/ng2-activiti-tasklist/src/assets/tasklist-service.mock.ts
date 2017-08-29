/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import {
    AppDefinitionRepresentationModel,
    FilterRepresentationModel
} from '../models/filter.model';

export let fakeFilters = {
    size: 2, total: 2, start: 0,
    data: [
        new AppDefinitionRepresentationModel(
            {
                id: 1, name: 'FakeInvolvedTasks', recent: false, icon: 'glyphicon-align-left',
                filter: { sort: 'created-desc', name: '', state: 'open', assignment: 'fake-involved' }
            }
        ),
        {
            id: 2, name: 'FakeMyTasks', recent: false, icon: 'glyphicon-align-left',
            filter: { sort: 'created-desc', name: '', state: 'open', assignment: 'fake-assignee' }
        }
    ]
};

export let fakeAppFilter = {
    size: 1, total: 1, start: 0,
    data: [
        {
            id: 1, name: 'FakeInvolvedTasks', recent: false, icon: 'glyphicon-align-left',
            filter: { sort: 'created-desc', name: '', state: 'open', assignment: 'fake-involved' }
        }
    ]
};

export let fakeApps = {
    size: 2, total: 2, start: 0,
    data: [
        {
            id: 1, defaultAppId: null, name: 'Sales-Fakes-App', description: 'desc-fake1', modelId: 22,
            theme: 'theme-1-fake', icon: 'glyphicon-asterisk', 'deploymentId': '111', 'tenantId': null
        },
        {
            id: 2, defaultAppId: null, name: 'health-care-Fake', description: 'desc-fake2', modelId: 33,
            theme: 'theme-2-fake', icon: 'glyphicon-asterisk', 'deploymentId': '444', 'tenantId': null
        }
    ]
};

export let fakeFilter = {
    sort: 'created-desc', text: '', state: 'open', assignment: 'fake-assignee'
};

export let fakeFilterWithProcessDefinitionKey = {
    sort: 'created-desc', text: '', state: 'open', assignment: 'fake-assignee', processDefinitionKey: '1'
};

export let fakeUser1 = { id: 1, email: 'fake-email@dom.com', firstName: 'firstName', lastName: 'lastName' };

export let fakeUser2 = { id: 1001, email: 'some-one@somegroup.com', firstName: 'some', lastName: 'one' };

export let fakeTaskList = {
    size: 1, total: 1, start: 0,
    data: [
        {
            id: '1', name: 'FakeNameTask', description: null, category: null,
            assignee: fakeUser1,
            created: '2016-07-15T11:19:17.440+0000'
        }
    ]
};

export let fakeTaskListDifferentProcessDefinitionKey = {
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

export let secondFakeTaskList = {
    size: 1, total: 1, start: 0,
    data: [
        {
            id: '200', name: 'FakeNameTask', description: null, category: null,
            assignee: fakeUser1,
            created: '2016-07-15T11:19:17.440+0000'
        }
    ]
};

export let fakeErrorTaskList = {
    error: 'wrong request'
};

export let fakeTaskDetails = { id: '999', name: 'fake-task-name', formKey: '99', assignee: fakeUser1 };

export let fakeTasksComment = {
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

export let fakeTasksChecklist = {
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

export let fakeRepresentationFilter1: FilterRepresentationModel = new FilterRepresentationModel({
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

export let fakeRepresentationFilter2: FilterRepresentationModel = new FilterRepresentationModel({
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

export let fakeAppPromise = new Promise(function (resolve, reject) {
    resolve(fakeAppFilter);
});

export let fakeFormList = {
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
