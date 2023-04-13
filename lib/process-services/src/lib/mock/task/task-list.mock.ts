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

export const fakeGlobalTask = new TaskListModel({
    size: 2,
    start: 0,
    total: 2,
    data: [
        {
            id: 14,
            name: 'nameFake1',
            description: 'descriptionFake1',
            category: 'categoryFake1',
            assignee: {
                id: 2,
                firstName: 'firstNameFake1',
                lastName: 'lastNameFake1',
                email: 'emailFake1'
            },
            created: '2017-03-01T12:25:17.189+0000',
            dueDate: '2017-04-02T12:25:17.189+0000',
            endDate: '2017-05-03T12:25:31.129+0000',
            duration: 13940,
            priority: 50,
            parentTaskId: 1,
            parentTaskName: 'parentTaskNameFake',
            processInstanceId: 2511,
            processInstanceName: 'processInstanceNameFake',
            processDefinitionId: 'myprocess:1:4',
            processDefinitionName: 'processDefinitionNameFake',
            processDefinitionDescription: 'processDefinitionDescriptionFake',
            processDefinitionKey: 'myprocess',
            processDefinitionCategory: 'http://www.activiti.org/processdef',
            processDefinitionVersion: 1,
            processDefinitionDeploymentId: '1',
            formKey: 1,
            processInstanceStartUserId: null,
            initiatorCanCompleteTask: false,
            adhocTaskCanBeReassigned: false,
            taskDefinitionKey: 'sid-B6813AF5-8ACD-4481-A4D5-8BAAD1CB1416',
            executionId: 2511,
            memberOfCandidateGroup: false,
            memberOfCandidateUsers: false,
            managerOfCandidateGroup: false
        },

        {
            id: 2,
            name: '',
            description: 'descriptionFake2',
            category: null,
            assignee: {
                id: 1,
                firstName: 'fistNameFake2',
                lastName: 'Administrator2',
                email: 'admin'
            },
            created: '2017-03-01T12:25:17.189+0000',
            dueDate: '2017-04-02T12:25:17.189+0000',
            endDate: null
        }
    ]
});

export const fakeCustomSchema = [
    {
        key: 'fakeName',
        type: 'text',
        title: 'ADF_TASK_LIST.PROPERTIES.FAKE',
        sortable: true
    },
    {
        key: 'fakeTaskName',
        type: 'text',
        title: 'ADF_TASK_LIST.PROPERTIES.TASK_FAKE',
        sortable: true
    }
];

export const fakeColumnSchema = {
    default: [
        {
            key: 'default-name',
            type: 'text',
            title: 'ADF_TASK_LIST.PROPERTIES.NAME',
            sortable: true
        }
    ],
    fakeMyTasksSchema: [
        {
            key: 'task-id',
            type: 'text',
            title: 'ADF_TASK_LIST.PROPERTIES.FAKE',
            sortable: true
        },
        {
            key: 'task-name',
            type: 'text',
            title: 'ADF_TASK_LIST.PROPERTIES.PROCESS_FAKE',
            sortable: true
        }
    ],
    fakeCustomSchema
};

export const fakeEmptyTask = {
    size: 0,
    start: 0,
    total: 0,
    data: []
};

export const paginatedTask = new TaskListModel({
    size: 5,
    total: 9,
    start: 0,
    data: [{
        id: '69211',
        name: 'My Task Name',
        description: '',
        category: null,
        assignee: {id: 1493, firstName: 'fake name', lastName: 'fake', email: 'abc@test.com'},
        created: '2020-02-06T18:41:21.587+0000',
        dueDate: null,
        endDate: null,
        duration: null,
        priority: 50,
        parentTaskId: null,
        parentTaskName: null,
        processInstanceId: null,
        processInstanceName: null,
        processDefinitionId: null,
        processDefinitionName: null,
        processDefinitionDescription: null,
        processDefinitionKey: null,
        processDefinitionCategory: null,
        processDefinitionVersion: 0,
        processDefinitionDeploymentId: null,
        formKey: null,
        processInstanceStartUserId: null,
        initiatorCanCompleteTask: false,
        adhocTaskCanBeReassigned: false,
        taskDefinitionKey: null,
        executionId: null,
        memberOfCandidateGroup: false,
        memberOfCandidateUsers: false,
        managerOfCandidateGroup: false
    }, {
        id: '61054',
        name: null,
        description: null,
        category: null,
        assignee: {id: 19, firstName: 'Mm9ntWGB', lastName: 'jfQOzSDL', email: 'c4jly@activiti.test.com'},
        created: '2020-02-06T15:26:32.488+0000',
        dueDate: null,
        endDate: null,
        duration: null,
        priority: 50,
        parentTaskId: null,
        parentTaskName: null,
        processInstanceId: '61049',
        processInstanceName: null,
        processDefinitionId: 'upload:1:50118',
        processDefinitionName: 'upload',
        processDefinitionDescription: null,
        processDefinitionKey: 'upload',
        processDefinitionCategory: 'http://www.activiti.org/processdef',
        processDefinitionVersion: 1,
        processDefinitionDeploymentId: '50115',
        formKey: '8474',
        processInstanceStartUserId: null,
        initiatorCanCompleteTask: false,
        adhocTaskCanBeReassigned: false,
        taskDefinitionKey: 'sid-7A12380E-28F8-4B15-9326-C5CFB8DD5BBC',
        executionId: '61049',
        memberOfCandidateGroup: false,
        memberOfCandidateUsers: false,
        managerOfCandidateGroup: false
    }, {
        id: '61048',
        name: 'My Task Name',
        description: null,
        category: null,
        assignee: {id: 1493, firstName: 'fake name', lastName: 'fake', email: 'abc@test.com'},
        created: '2020-02-06T15:26:03.012+0000',
        dueDate: null,
        endDate: null,
        duration: null,
        priority: 50,
        parentTaskId: null,
        parentTaskName: null,
        processInstanceId: null,
        processInstanceName: null,
        processDefinitionId: null,
        processDefinitionName: null,
        processDefinitionDescription: null,
        processDefinitionKey: null,
        processDefinitionCategory: null,
        processDefinitionVersion: 0,
        processDefinitionDeploymentId: null,
        formKey: null,
        processInstanceStartUserId: null,
        initiatorCanCompleteTask: false,
        adhocTaskCanBeReassigned: false,
        taskDefinitionKey: null,
        executionId: null,
        memberOfCandidateGroup: false,
        memberOfCandidateUsers: false,
        managerOfCandidateGroup: false
    }, {
        id: '54705',
        name: 'My Task Name',
        description: '',
        category: '1349',
        assignee: {id: 1493, firstName: 'fake name', lastName: 'fake', email: 'abc@test.com'},
        created: '2020-02-06T13:01:23.403+0000',
        dueDate: null,
        endDate: null,
        duration: null,
        priority: 50,
        parentTaskId: null,
        parentTaskName: null,
        processInstanceId: null,
        processInstanceName: null,
        processDefinitionId: null,
        processDefinitionName: null,
        processDefinitionDescription: null,
        processDefinitionKey: null,
        processDefinitionCategory: null,
        processDefinitionVersion: 0,
        processDefinitionDeploymentId: null,
        formKey: null,
        processInstanceStartUserId: null,
        initiatorCanCompleteTask: false,
        adhocTaskCanBeReassigned: false,
        taskDefinitionKey: null,
        executionId: null,
        memberOfCandidateGroup: false,
        memberOfCandidateUsers: false,
        managerOfCandidateGroup: false
    }, {
        id: '50158',
        name: 'My Task Name',
        description: '',
        category: '1349',
        assignee: {id: 1493, firstName: 'fake name', lastName: 'fake', email: 'abc@test.com'},
        created: '2020-02-06T09:13:55.532+0000',
        dueDate: '2019-01-09T11:53:00.000+0000',
        endDate: null,
        duration: null,
        priority: 0,
        parentTaskId: null,
        parentTaskName: null,
        processInstanceId: null,
        processInstanceName: null,
        processDefinitionId: null,
        processDefinitionName: null,
        processDefinitionDescription: null,
        processDefinitionKey: null,
        processDefinitionCategory: null,
        processDefinitionVersion: 0,
        processDefinitionDeploymentId: null,
        formKey: '8484',
        processInstanceStartUserId: null,
        initiatorCanCompleteTask: false,
        adhocTaskCanBeReassigned: false,
        taskDefinitionKey: null,
        executionId: null,
        memberOfCandidateGroup: false,
        memberOfCandidateUsers: false,
        managerOfCandidateGroup: false
    }]
});
