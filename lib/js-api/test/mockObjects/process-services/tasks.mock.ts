/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import nock from 'nock';
import { BaseMock } from '../base.mock';

const formValues = [
    { id: '1', name: 'Leanne Graham' },
    { id: '2', name: 'Ervin Howell' },
    {
        id: '3',
        name: 'Clementine Bauch'
    },
    { id: '4', name: 'Patricia Lebsack' },
    { id: '5', name: 'Chelsey Dietrich' },
    {
        id: '6',
        name: 'Mrs. Dennis Schulist'
    },
    { id: '7', name: 'Kurtis Weissnat' },
    { id: '8', name: 'Nicholas Runolfsdottir V' },
    {
        id: '9',
        name: 'Glenna Reichert'
    },
    { id: '10', name: 'Clementina DuBuque' }
];

export class TasksMock extends BaseMock {
    get200Response(): void {
        nock(this.host, { encodedQueryParams: true })
            .post('/activiti-app/api/enterprise/tasks/query', {})
            .reply(200, {
                size: 2,
                total: 2,
                start: 0,
                data: [
                    {
                        id: '38',
                        name: null,
                        description: null,
                        category: null,
                        assignee: {
                            id: 1,
                            firstName: null,
                            lastName: 'Administrator',
                            email: 'admin@app.activiti.com'
                        },
                        created: '2016-07-26T15:30:58.368+0000',
                        dueDate: null,
                        endDate: null,
                        duration: null,
                        priority: 50,
                        parentTaskId: null,
                        parentTaskName: null,
                        processInstanceId: '33',
                        processInstanceName: null,
                        processDefinitionId: 'ProcessTestApi:1:32',
                        processDefinitionName: 'Process Test Api',
                        processDefinitionDescription: null,
                        processDefinitionKey: 'ProcessTestApi',
                        processDefinitionCategory: 'https://www.activiti.org/processdef',
                        processDefinitionVersion: 1,
                        processDefinitionDeploymentId: '29',
                        formKey: null,
                        processInstanceStartUserId: null,
                        initiatorCanCompleteTask: false,
                        adhocTaskCanBeReassigned: false,
                        taskDefinitionKey: 'sid-E6C102D3-F101-47AE-8D39-B7FD17F38FE9',
                        executionId: '33',
                        memberOfCandidateGroup: false,
                        memberOfCandidateUsers: false,
                        managerOfCandidateGroup: false
                    },
                    {
                        id: '44',
                        name: null,
                        description: null,
                        category: null,
                        assignee: {
                            id: 1,
                            firstName: null,
                            lastName: 'Administrator',
                            email: 'admin@app.activiti.com'
                        },
                        created: '2016-07-26T15:31:00.415+0000',
                        dueDate: null,
                        endDate: null,
                        duration: null,
                        priority: 50,
                        parentTaskId: null,
                        parentTaskName: null,
                        processInstanceId: '39',
                        processInstanceName: null,
                        processDefinitionId: 'ProcessTestApi:1:32',
                        processDefinitionName: 'Process Test Api',
                        processDefinitionDescription: null,
                        processDefinitionKey: 'ProcessTestApi',
                        processDefinitionCategory: 'https://www.activiti.org/processdef',
                        processDefinitionVersion: 1,
                        processDefinitionDeploymentId: '29',
                        formKey: null,
                        processInstanceStartUserId: null,
                        initiatorCanCompleteTask: false,
                        adhocTaskCanBeReassigned: false,
                        taskDefinitionKey: 'sid-E6C102D3-F101-47AE-8D39-B7FD17F38FE9',
                        executionId: '39',
                        memberOfCandidateGroup: false,
                        memberOfCandidateUsers: false,
                        managerOfCandidateGroup: false
                    }
                ]
            });
    }

    get200ResponseGetTask(taskId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/activiti-app/api/enterprise/tasks/' + taskId)
            .reply(200, {
                id: '10',
                name: 'Upload Document',
                description: null,
                category: null,
                assignee: { id: 1, firstName: null, lastName: 'Administrator', email: 'admin' },
                created: '2016-08-05T17:39:36.159+0000',
                dueDate: null,
                endDate: null,
                duration: null,
                priority: 50,
                parentTaskId: null,
                parentTaskName: null,
                processInstanceId: '5',
                processInstanceName: null,
                processDefinitionId: 'Sales:1:4',
                processDefinitionName: 'Sales',
                processDefinitionDescription: null,
                processDefinitionKey: 'Sales',
                processDefinitionCategory: 'https://www.activiti.org/processdef',
                processDefinitionVersion: 1,
                processDefinitionDeploymentId: '1',
                formKey: '1',
                processInstanceStartUserId: '1',
                initiatorCanCompleteTask: true,
                adhocTaskCanBeReassigned: false,
                taskDefinitionKey: 'sid-58C42FE9-EDAC-4F7B-B36B-F13DF0A8CE70',
                executionId: '5',
                involvedPeople: [],
                memberOfCandidateGroup: false,
                memberOfCandidateUsers: false,
                managerOfCandidateGroup: false
            });
    }

    get400TaskFilter(): void {
        nock(this.host, { encodedQueryParams: true }).post('/activiti-app/api/enterprise/tasks/filter', {}).reply(400, {
            message: 'A valid filterId or filter params must be provided',
            messageKey: 'GENERAL.ERROR.BAD-REQUEST'
        });
    }

    get200TaskFilter(): void {
        nock(this.host, { encodedQueryParams: true })
            .post('/activiti-app/api/enterprise/tasks/filter', { appDefinitionId: 1 })
            .reply(200, {
                size: 2,
                total: 2,
                start: 0,
                data: [
                    {
                        id: '7506',
                        name: 'Upload Document',
                        description: null,
                        category: null,
                        assignee: { id: 1, firstName: null, lastName: 'Administrator', email: 'admin' },
                        created: '2016-08-12T15:37:50.963+0000',
                        dueDate: null,
                        endDate: null,
                        duration: null,
                        priority: 50,
                        parentTaskId: null,
                        parentTaskName: null,
                        processInstanceId: '7501',
                        processInstanceName: null,
                        processDefinitionId: 'Sales:1:4',
                        processDefinitionName: 'Sales',
                        processDefinitionDescription: null,
                        processDefinitionKey: 'Sales',
                        processDefinitionCategory: 'https://www.activiti.org/processdef',
                        processDefinitionVersion: 1,
                        processDefinitionDeploymentId: '1',
                        formKey: '1',
                        processInstanceStartUserId: null,
                        initiatorCanCompleteTask: false,
                        adhocTaskCanBeReassigned: false,
                        taskDefinitionKey: 'sid-58C42FE9-EDAC-4F7B-B36B-F13DF0A8CE70',
                        executionId: '7501',
                        memberOfCandidateGroup: false,
                        memberOfCandidateUsers: false,
                        managerOfCandidateGroup: false
                    },
                    {
                        id: '5006',
                        name: 'Upload Document',
                        description: null,
                        category: null,
                        assignee: { id: 1, firstName: null, lastName: 'Administrator', email: 'admin' },
                        created: '2016-08-10T09:39:36.837+0000',
                        dueDate: null,
                        endDate: null,
                        duration: null,
                        priority: 50,
                        parentTaskId: null,
                        parentTaskName: null,
                        processInstanceId: '5001',
                        processInstanceName: null,
                        processDefinitionId: 'Sales:1:4',
                        processDefinitionName: 'Sales',
                        processDefinitionDescription: null,
                        processDefinitionKey: 'Sales',
                        processDefinitionCategory: 'https://www.activiti.org/processdef',
                        processDefinitionVersion: 1,
                        processDefinitionDeploymentId: '1',
                        formKey: '1',
                        processInstanceStartUserId: null,
                        initiatorCanCompleteTask: false,
                        adhocTaskCanBeReassigned: false,
                        taskDefinitionKey: 'sid-58C42FE9-EDAC-4F7B-B36B-F13DF0A8CE70',
                        executionId: '5001',
                        memberOfCandidateGroup: false,
                        memberOfCandidateUsers: false,
                        managerOfCandidateGroup: false
                    }
                ]
            });
    }

    get404CompleteTask(taskId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .put('/activiti-app/api/enterprise/tasks/' + taskId + '/action/complete')
            .reply(404, {
                message: 'Task with id: ' + taskId + ' does not exist',
                messageKey: 'GENERAL.ERROR.NOT-FOUND'
            });
    }

    get200CreateTask(name: string): void {
        nock(this.host, { encodedQueryParams: true }).post('/activiti-app/api/enterprise/tasks', { name }).reply(200, {
            id: '10001',
            name: 'test-name',
            description: null,
            category: null,
            assignee: null,
            created: '2016-08-22T09:31:40.492+0000',
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
        });
    }

    get200getTaskForm(): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/activiti-app/api/enterprise/task-forms/2518')
            .reply(200, {
                id: 1,
                name: 'Metadata',
                processDefinitionId: 'Sales:1:4',
                processDefinitionName: 'Sales',
                processDefinitionKey: 'Sales',
                taskId: '2518',
                taskName: 'Upload Document',
                taskDefinitionKey: 'sid-58C42FE9-EDAC-4F7B-B36B-F13DF0A8CE70',
                tabs: [],
                fields: [
                    {
                        fieldType: 'ContainerRepresentation',
                        id: '1470229884327',
                        name: 'Label',
                        type: 'container',
                        value: null,
                        required: false,
                        readOnly: false,
                        overrideId: false,
                        colspan: 1,
                        placeholder: null,
                        minLength: 0,
                        maxLength: 0,
                        minValue: null,
                        maxValue: null,
                        regexPattern: null,
                        optionType: null,
                        hasEmptyValue: null,
                        options: null,
                        restUrl: null,
                        restResponsePath: null,
                        restIdProperty: null,
                        restLabelProperty: null,
                        tab: null,
                        className: null,
                        layout: null,
                        sizeX: 2,
                        sizeY: 1,
                        row: -1,
                        col: -1,
                        visibilityCondition: null,
                        numberOfColumns: 2,
                        fields: {
                            1: [
                                {
                                    fieldType: 'RestFieldRepresentation',
                                    id: 'contenttype',
                                    name: 'Content Type',
                                    type: 'dropdown',
                                    value: 'Choose one...',
                                    required: false,
                                    readOnly: false,
                                    overrideId: false,
                                    colspan: 1,
                                    placeholder: null,
                                    minLength: 0,
                                    maxLength: 0,
                                    minValue: null,
                                    maxValue: null,
                                    regexPattern: null,
                                    optionType: null,
                                    hasEmptyValue: true,
                                    options: [
                                        { id: 'empty', name: 'Choose one...' },
                                        {
                                            id: '@Other',
                                            name: '@Other'
                                        },
                                        { id: 'Blog Post', name: 'Blog Post' },
                                        {
                                            id: 'Customer case study',
                                            name: 'Customer case study'
                                        },
                                        { id: 'Event materials', name: 'Event materials' }
                                    ],
                                    restUrl: null,
                                    restResponsePath: null,
                                    restIdProperty: null,
                                    restLabelProperty: null,
                                    tab: null,
                                    className: null,
                                    params: { existingColspan: 1, maxColspan: 2 },
                                    layout: { row: -1, column: -1, colspan: 1 },
                                    sizeX: 1,
                                    sizeY: 1,
                                    row: -1,
                                    col: -1,
                                    visibilityCondition: null,
                                    endpoint: null,
                                    dataSource: null,
                                    requestHeaders: null
                                }
                            ],
                            2: [
                                {
                                    fieldType: 'RestFieldRepresentation',
                                    id: 'usageinternalorexternal',
                                    name: 'Usage ( Internal or External)',
                                    type: 'dropdown',
                                    value: 'Internal Use Only',
                                    required: false,
                                    readOnly: false,
                                    overrideId: false,
                                    colspan: 1,
                                    placeholder: null,
                                    minLength: 0,
                                    maxLength: 0,
                                    minValue: null,
                                    maxValue: null,
                                    regexPattern: null,
                                    optionType: null,
                                    hasEmptyValue: true,
                                    options: [
                                        { id: 'empty', name: 'Choose one...' },
                                        {
                                            id: 'Internal Use Only',
                                            name: 'Internal Use Only'
                                        },
                                        { id: 'External use permitted', name: 'External use permitted' }
                                    ],
                                    restUrl: null,
                                    restResponsePath: null,
                                    restIdProperty: null,
                                    restLabelProperty: null,
                                    tab: null,
                                    className: null,
                                    params: { existingColspan: 1, maxColspan: 1 },
                                    layout: { row: -1, column: -1, colspan: 1 },
                                    sizeX: 1,
                                    sizeY: 1,
                                    row: -1,
                                    col: -1,
                                    visibilityCondition: null,
                                    endpoint: null,
                                    dataSource: null,
                                    requestHeaders: null
                                }
                            ]
                        }
                    },
                    {
                        fieldType: 'ContainerRepresentation',
                        id: '1470229890873',
                        name: 'Label',
                        type: 'container',
                        value: null,
                        required: false,
                        readOnly: false,
                        overrideId: false,
                        colspan: 1,
                        placeholder: null,
                        minLength: 0,
                        maxLength: 0,
                        minValue: null,
                        maxValue: null,
                        regexPattern: null,
                        optionType: null,
                        hasEmptyValue: null,
                        options: null,
                        restUrl: null,
                        restResponsePath: null,
                        restIdProperty: null,
                        restLabelProperty: null,
                        tab: null,
                        className: null,
                        layout: null,
                        sizeX: 2,
                        sizeY: 1,
                        row: -1,
                        col: -1,
                        visibilityCondition: null,
                        numberOfColumns: 2,
                        fields: {
                            1: [
                                {
                                    fieldType: 'RestFieldRepresentation',
                                    id: 'productname',
                                    name: 'Product Name',
                                    type: 'dropdown',
                                    value: 'Choose one...',
                                    required: false,
                                    readOnly: false,
                                    overrideId: false,
                                    colspan: 1,
                                    placeholder: null,
                                    minLength: 0,
                                    maxLength: 0,
                                    minValue: null,
                                    maxValue: null,
                                    regexPattern: null,
                                    optionType: null,
                                    hasEmptyValue: true,
                                    options: [
                                        { id: 'empty', name: 'Choose one...' },
                                        {
                                            id: 'ECM- Alfresco One',
                                            name: 'ECM- Alfresco One'
                                        },
                                        {
                                            id: 'ECM- Alfresco in the Cloud',
                                            name: 'ECM- Alfresco in the Cloud'
                                        },
                                        {
                                            id: 'ECM- Alfresco Community Edition',
                                            name: 'ECM- Alfresco Community Edition'
                                        },
                                        { id: 'ECM- Modules- Alfresco Mobile', name: 'ECM- Modules- Alfresco Mobile' }
                                    ],
                                    restUrl: null,
                                    restResponsePath: null,
                                    restIdProperty: null,
                                    restLabelProperty: null,
                                    tab: null,
                                    className: null,
                                    params: { existingColspan: 1, maxColspan: 2 },
                                    layout: { row: -1, column: -1, colspan: 1 },
                                    sizeX: 1,
                                    sizeY: 1,
                                    row: -1,
                                    col: -1,
                                    visibilityCondition: null,
                                    endpoint: null,
                                    dataSource: null,
                                    requestHeaders: null
                                }
                            ],
                            2: []
                        }
                    },
                    {
                        fieldType: 'ContainerRepresentation',
                        id: '1470229895618',
                        name: 'Label',
                        type: 'container',
                        value: null,
                        required: false,
                        readOnly: false,
                        overrideId: false,
                        colspan: 1,
                        placeholder: null,
                        minLength: 0,
                        maxLength: 0,
                        minValue: null,
                        maxValue: null,
                        regexPattern: null,
                        optionType: null,
                        hasEmptyValue: null,
                        options: null,
                        restUrl: null,
                        restResponsePath: null,
                        restIdProperty: null,
                        restLabelProperty: null,
                        tab: null,
                        className: null,
                        layout: null,
                        sizeX: 2,
                        sizeY: 1,
                        row: -1,
                        col: -1,
                        visibilityCondition: null,
                        numberOfColumns: 3,
                        fields: {
                            1: [
                                {
                                    fieldType: 'RestFieldRepresentation',
                                    id: 'language',
                                    name: 'Language',
                                    type: 'dropdown',
                                    value: 'English',
                                    required: false,
                                    readOnly: false,
                                    overrideId: false,
                                    colspan: 1,
                                    placeholder: null,
                                    minLength: 0,
                                    maxLength: 0,
                                    minValue: null,
                                    maxValue: null,
                                    regexPattern: null,
                                    optionType: null,
                                    hasEmptyValue: true,
                                    options: [
                                        { id: 'empty', name: 'Choose one...' },
                                        {
                                            id: 'English',
                                            name: 'English'
                                        },
                                        { id: 'French', name: 'French' },
                                        {
                                            id: 'Italian',
                                            name: 'Italian'
                                        },
                                        { id: 'German', name: 'German' },
                                        { id: 'Spanish', name: 'Spanish' }
                                    ],
                                    restUrl: null,
                                    restResponsePath: null,
                                    restIdProperty: null,
                                    restLabelProperty: null,
                                    tab: null,
                                    className: null,
                                    params: { existingColspan: 1, maxColspan: 3 },
                                    layout: { row: -1, column: -1, colspan: 1 },
                                    sizeX: 1,
                                    sizeY: 1,
                                    row: -1,
                                    col: -1,
                                    visibilityCondition: null,
                                    endpoint: null,
                                    dataSource: null,
                                    requestHeaders: null
                                }
                            ],
                            2: [
                                {
                                    fieldType: 'RestFieldRepresentation',
                                    id: 'region',
                                    name: 'Region',
                                    type: 'dropdown',
                                    value: 'ALL',
                                    required: false,
                                    readOnly: false,
                                    overrideId: false,
                                    colspan: 1,
                                    placeholder: null,
                                    minLength: 0,
                                    maxLength: 0,
                                    minValue: null,
                                    maxValue: null,
                                    regexPattern: null,
                                    optionType: null,
                                    hasEmptyValue: true,
                                    options: [
                                        { id: 'empty', name: 'Choose one...' },
                                        {
                                            id: 'ALL',
                                            name: 'ALL'
                                        },
                                        { id: 'AMER', name: 'AMER' },
                                        { id: 'EMEA', name: 'EMEA' },
                                        {
                                            id: 'APAC',
                                            name: 'APAC'
                                        }
                                    ],
                                    restUrl: null,
                                    restResponsePath: null,
                                    restIdProperty: null,
                                    restLabelProperty: null,
                                    tab: null,
                                    className: null,
                                    params: { existingColspan: 1, maxColspan: 2 },
                                    layout: { row: -1, column: -1, colspan: 1 },
                                    sizeX: 1,
                                    sizeY: 1,
                                    row: -1,
                                    col: -1,
                                    visibilityCondition: null,
                                    endpoint: null,
                                    dataSource: null,
                                    requestHeaders: null
                                }
                            ],
                            3: [
                                {
                                    fieldType: 'RestFieldRepresentation',
                                    id: 'country',
                                    name: 'Country',
                                    type: 'dropdown',
                                    value: 'Choose one...',
                                    required: false,
                                    readOnly: false,
                                    overrideId: false,
                                    colspan: 1,
                                    placeholder: null,
                                    minLength: 0,
                                    maxLength: 0,
                                    minValue: null,
                                    maxValue: null,
                                    regexPattern: null,
                                    optionType: null,
                                    hasEmptyValue: true,
                                    options: [
                                        { id: 'empty', name: 'Choose one...' },
                                        {
                                            id: 'ALL',
                                            name: 'ALL'
                                        },
                                        { id: 'United Kingdom', name: 'United Kingdom' },
                                        {
                                            id: 'France',
                                            name: 'France'
                                        },
                                        { id: 'Spain', name: 'Spain' },
                                        { id: 'Germany', name: 'Germany' }
                                    ],
                                    restUrl: null,
                                    restResponsePath: null,
                                    restIdProperty: null,
                                    restLabelProperty: null,
                                    tab: null,
                                    className: null,
                                    params: { existingColspan: 1, maxColspan: 1 },
                                    layout: { row: -1, column: -1, colspan: 1 },
                                    sizeX: 1,
                                    sizeY: 1,
                                    row: -1,
                                    col: -1,
                                    visibilityCondition: null,
                                    endpoint: null,
                                    dataSource: null,
                                    requestHeaders: null
                                }
                            ]
                        }
                    },
                    {
                        fieldType: 'ContainerRepresentation',
                        id: '1470229910390',
                        name: 'Label',
                        type: 'container',
                        value: null,
                        required: false,
                        readOnly: false,
                        overrideId: false,
                        colspan: 1,
                        placeholder: null,
                        minLength: 0,
                        maxLength: 0,
                        minValue: null,
                        maxValue: null,
                        regexPattern: null,
                        optionType: null,
                        hasEmptyValue: null,
                        options: null,
                        restUrl: null,
                        restResponsePath: null,
                        restIdProperty: null,
                        restLabelProperty: null,
                        tab: null,
                        className: null,
                        layout: null,
                        sizeX: 2,
                        sizeY: 1,
                        row: -1,
                        col: -1,
                        visibilityCondition: null,
                        numberOfColumns: 2,
                        fields: {
                            1: [
                                {
                                    fieldType: 'FormFieldRepresentation',
                                    id: 'customername',
                                    name: 'Customer Name',
                                    type: 'text',
                                    value: null,
                                    required: false,
                                    readOnly: false,
                                    overrideId: false,
                                    colspan: 1,
                                    placeholder: null,
                                    minLength: 0,
                                    maxLength: 0,
                                    minValue: null,
                                    maxValue: null,
                                    regexPattern: null,
                                    optionType: null,
                                    hasEmptyValue: null,
                                    options: null,
                                    restUrl: null,
                                    restResponsePath: null,
                                    restIdProperty: null,
                                    restLabelProperty: null,
                                    tab: null,
                                    className: null,
                                    params: { existingColspan: 1, maxColspan: 2 },
                                    layout: { row: -1, column: -1, colspan: 1 },
                                    sizeX: 1,
                                    sizeY: 1,
                                    row: -1,
                                    col: -1,
                                    visibilityCondition: null
                                },
                                {
                                    fieldType: 'RestFieldRepresentation',
                                    id: 'industry',
                                    name: 'Industry',
                                    type: 'dropdown',
                                    value: 'Choose one...',
                                    required: false,
                                    readOnly: false,
                                    overrideId: false,
                                    colspan: 1,
                                    placeholder: null,
                                    minLength: 0,
                                    maxLength: 0,
                                    minValue: null,
                                    maxValue: null,
                                    regexPattern: null,
                                    optionType: null,
                                    hasEmptyValue: true,
                                    options: [
                                        { id: 'empty', name: 'Choose one...' },
                                        {
                                            id: '@Other',
                                            name: '@Other'
                                        },
                                        { id: 'Construction', name: 'Construction' },
                                        {
                                            id: 'Education',
                                            name: 'Education'
                                        },
                                        {
                                            id: 'Financial Services',
                                            name: 'Financial Services'
                                        },
                                        {
                                            id: 'Public Administration &amp; Government',
                                            name: 'Public Administration &amp; Government'
                                        },
                                        { id: 'Healthcare', name: 'Healthcare' },
                                        {
                                            id: 'Life Sciences',
                                            name: 'Life Sciences'
                                        },
                                        { id: 'Manufacturing', name: 'Manufacturing' }
                                    ],
                                    restUrl: null,
                                    restResponsePath: null,
                                    restIdProperty: null,
                                    restLabelProperty: null,
                                    tab: null,
                                    className: null,
                                    params: { existingColspan: 1, maxColspan: 2 },
                                    layout: { row: -1, column: -1, colspan: 1 },
                                    sizeX: 1,
                                    sizeY: 1,
                                    row: -1,
                                    col: -1,
                                    visibilityCondition: null,
                                    endpoint: null,
                                    dataSource: null,
                                    requestHeaders: null
                                },
                                {
                                    fieldType: 'RestFieldRepresentation',
                                    id: 'solution',
                                    name: 'Solution',
                                    type: 'dropdown',
                                    value: 'Choose one...',
                                    required: false,
                                    readOnly: false,
                                    overrideId: false,
                                    colspan: 1,
                                    placeholder: null,
                                    minLength: 0,
                                    maxLength: 0,
                                    minValue: null,
                                    maxValue: null,
                                    regexPattern: null,
                                    optionType: null,
                                    hasEmptyValue: true,
                                    options: [
                                        { id: 'empty', name: 'Choose one...' },
                                        {
                                            id: 'Content Management',
                                            name: 'Content Management'
                                        },
                                        {
                                            id: 'External Collaboration',
                                            name: 'External Collaboration'
                                        },
                                        {
                                            id: 'Information Governance',
                                            name: 'Information Governance'
                                        },
                                        { id: 'Case Management', name: 'Case Management' },
                                        {
                                            id: 'Process Management',
                                            name: 'Process Management'
                                        }
                                    ],
                                    restUrl: null,
                                    restResponsePath: null,
                                    restIdProperty: null,
                                    restLabelProperty: null,
                                    tab: null,
                                    className: null,
                                    params: { existingColspan: 1, maxColspan: 2 },
                                    layout: { row: -1, column: -1, colspan: 1 },
                                    sizeX: 1,
                                    sizeY: 1,
                                    row: -1,
                                    col: -1,
                                    visibilityCondition: null,
                                    endpoint: null,
                                    dataSource: null,
                                    requestHeaders: null
                                }
                            ],
                            2: [
                                {
                                    fieldType: 'FormFieldRepresentation',
                                    id: 'partnername',
                                    name: 'Partner Name',
                                    type: 'text',
                                    value: null,
                                    required: false,
                                    readOnly: false,
                                    overrideId: false,
                                    colspan: 1,
                                    placeholder: null,
                                    minLength: 0,
                                    maxLength: 0,
                                    minValue: null,
                                    maxValue: null,
                                    regexPattern: null,
                                    optionType: null,
                                    hasEmptyValue: null,
                                    options: null,
                                    restUrl: null,
                                    restResponsePath: null,
                                    restIdProperty: null,
                                    restLabelProperty: null,
                                    tab: null,
                                    className: null,
                                    params: { existingColspan: 1, maxColspan: 1 },
                                    layout: { row: -1, column: -1, colspan: 1 },
                                    sizeX: 1,
                                    sizeY: 1,
                                    row: -1,
                                    col: -1,
                                    visibilityCondition: null
                                },
                                {
                                    fieldType: 'RestFieldRepresentation',
                                    id: 'usecase',
                                    name: 'Use case',
                                    type: 'dropdown',
                                    value: '@ None selected',
                                    required: false,
                                    readOnly: false,
                                    overrideId: false,
                                    colspan: 1,
                                    placeholder: null,
                                    minLength: 0,
                                    maxLength: 0,
                                    minValue: null,
                                    maxValue: null,
                                    regexPattern: null,
                                    optionType: null,
                                    hasEmptyValue: true,
                                    options: [
                                        { id: 'empty', name: 'Choose one...' },
                                        {
                                            id: '@ None selected',
                                            name: '@ None selected'
                                        },
                                        {
                                            id: 'HR- Employee Records',
                                            name: 'HR- Employee Records'
                                        },
                                        {
                                            id: 'HR- Employee On-Boarding',
                                            name: 'HR- Employee On-Boarding'
                                        },
                                        {
                                            id: 'HR- Disciplinary Process Management',
                                            name: 'HR- Disciplinary Process Management'
                                        }
                                    ],
                                    restUrl: null,
                                    restResponsePath: null,
                                    restIdProperty: null,
                                    restLabelProperty: null,
                                    tab: null,
                                    className: null,
                                    params: { existingColspan: 1, maxColspan: 1 },
                                    layout: { row: -1, column: -1, colspan: 1 },
                                    sizeX: 1,
                                    sizeY: 1,
                                    row: -1,
                                    col: -1,
                                    visibilityCondition: null,
                                    endpoint: null,
                                    dataSource: null,
                                    requestHeaders: null
                                },
                                {
                                    fieldType: 'FormFieldRepresentation',
                                    id: 'competitor',
                                    name: 'Competitor',
                                    type: 'text',
                                    value: null,
                                    required: false,
                                    readOnly: false,
                                    overrideId: false,
                                    colspan: 1,
                                    placeholder: null,
                                    minLength: 0,
                                    maxLength: 0,
                                    minValue: null,
                                    maxValue: null,
                                    regexPattern: null,
                                    optionType: null,
                                    hasEmptyValue: null,
                                    options: null,
                                    restUrl: null,
                                    restResponsePath: null,
                                    restIdProperty: null,
                                    restLabelProperty: null,
                                    tab: null,
                                    className: null,
                                    params: { existingColspan: 1, maxColspan: 1 },
                                    layout: { row: -1, column: -1, colspan: 1 },
                                    sizeX: 1,
                                    sizeY: 1,
                                    row: -1,
                                    col: -1,
                                    visibilityCondition: null
                                }
                            ]
                        }
                    }
                ],
                outcomes: [],
                javascriptEvents: [],
                className: '',
                style: '',
                customFieldTemplates: {},
                metadata: {},
                variables: [],
                gridsterForm: false
            });
    }

    get200getRestFieldValuesColumn(): void {
        nock(this.host, { encodedQueryParams: true }).get('/activiti-app/api/enterprise/task-forms/1/form-values/label/user').reply(200, formValues);
    }

    get200getRestFieldValues(): void {
        nock(this.host, { encodedQueryParams: true }).get('/activiti-app/api/enterprise/task-forms/2/form-values/label').reply(200, formValues);
    }
}
