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

import { ObjectDataColumn } from '@alfresco/adf-core';

export let fakeGlobalTask = {
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
};

export let fakeCustomSchema = [
    new ObjectDataColumn({
        key: 'fakeName',
        type: 'text',
        title: 'ADF_TASK_LIST.PROPERTIES.FAKE',
        sortable: true
    }),
    new ObjectDataColumn({
        key: 'fakeTaskName',
        type: 'text',
        title: 'ADF_TASK_LIST.PROPERTIES.TASK_FAKE',
        sortable: true
    })
];

export let fakeColumnSchema = {
    default: [
        {
            key: 'name',
            type: 'text',
            title: 'ADF_TASK_LIST.PROPERTIES.NAME',
            sortable: true
        }
    ],
    fakeCustomSchema
};
