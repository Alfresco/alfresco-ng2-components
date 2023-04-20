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

import { UserRepresentation } from '@alfresco/js-api';
import { TaskDetailsModel } from '../../task-list/models/task-details.model';

export const standaloneTaskWithForm = new TaskDetailsModel({
    id: '100',
    name: 'Standalone Task With Form',
    description: null,
    category: null,
    assignee: {
        id: 1001,
        firstName: 'Wilbur',
        lastName: 'Adams',
        email: 'wilbur@app.activiti.com'
    },
    created: '2016-11-03T15:25:42.749+0000',
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
    processDefinitionVersion: null,
    processDefinitionDeploymentId: null,
    formKey: '222',
    processInstanceStartUserId: null,
    initiatorCanCompleteTask: false,
    adhocTaskCanBeReassigned: false,
    taskDefinitionKey: 'sid-DDECD9E4-0299-433F-9193-C3D905C3EEBE',
    executionId: '86',
    involvedGroups: [],
    involvedPeople: [],
    memberOfCandidateUsers: false,
    managerOfCandidateGroup: false,
    memberOfCandidateGroup: false
});

export const standaloneTaskWithoutForm = new TaskDetailsModel({
    id: '200',
    name: 'Standalone Task Without Form',
    description: null,
    category: null,
    assignee: {
        id: 1001,
        firstName: 'Wilbur',
        lastName: 'Adams',
        email: 'wilbur@app.activiti.com'
    },
    created: '2016-11-03T15:25:42.749+0000',
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
    processDefinitionVersion: null,
    processDefinitionDeploymentId: null,
    formKey: null,
    processInstanceStartUserId: null,
    initiatorCanCompleteTask: false,
    adhocTaskCanBeReassigned: false,
    taskDefinitionKey: 'sid-DDECD9E4-0299-433F-9193-C3D905C3EEBE',
    executionId: '86',
    involvedGroups: [],
    involvedPeople: [],
    memberOfCandidateUsers: false,
    managerOfCandidateGroup: false,
    memberOfCandidateGroup: false
});

export const completedStandaloneTaskWithoutForm = new TaskDetailsModel({
    id: '200',
    name: 'Standalone Task Without Form',
    description: null,
    category: null,
    assignee: {
        id: 1001,
        firstName: 'Wilbur',
        lastName: 'Adams',
        email: 'wilbur@app.activiti.com'
    },
    created: '2016-11-03T15:25:42.749+0000',
    dueDate: null,
    endDate: new Date(),
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
    processDefinitionVersion: null,
    processDefinitionDeploymentId: null,
    formKey: null,
    processInstanceStartUserId: null,
    initiatorCanCompleteTask: false,
    adhocTaskCanBeReassigned: false,
    taskDefinitionKey: 'sid-DDECD9E4-0299-433F-9193-C3D905C3EEBE',
    executionId: '86',
    involvedGroups: [],
    involvedPeople: [],
    memberOfCandidateUsers: false,
    managerOfCandidateGroup: false,
    memberOfCandidateGroup: false
});

export const taskDetailsMock = new TaskDetailsModel({
    id: '91',
    name: 'Request translation',
    description: null,
    category: null,
    assignee: {
        id: 1001,
        firstName: 'Wilbur',
        lastName: 'Adams',
        email: 'wilbur@app.activiti.com'
    },
    created: '2016-11-03T15:25:42.749+0000',
    dueDate: null,
    endDate: null,
    duration: null,
    priority: 50,
    parentTaskId: null,
    parentTaskName: null,
    processInstanceId: '86',
    processInstanceName: null,
    processDefinitionId: 'TranslationProcess:2:8',
    processDefinitionName: 'Translation Process',
    processDefinitionDescription: null,
    processDefinitionKey: 'TranslationProcess',
    processDefinitionCategory: 'http://www.activiti.org/processdef',
    processDefinitionVersion: 2,
    processDefinitionDeploymentId: '5',
    formKey: '4',
    processInstanceStartUserId: '1001',
    initiatorCanCompleteTask: false,
    adhocTaskCanBeReassigned: false,
    taskDefinitionKey: 'sid-DDECD9E4-0299-433F-9193-C3D905C3EEBE',
    executionId: '86',
    involvedGroups: [],
    involvedPeople: [],
    memberOfCandidateUsers: false,
    managerOfCandidateGroup: false,
    memberOfCandidateGroup: false
});

export const initiatorCanCompleteTaskDetailsMock = new TaskDetailsModel({
    id: '91',
    name: 'Request translation',
    description: null,
    category: null,
    assignee: { email: 'mock-user-email' },
    created: '2016-11-03T15:25:42.749+0000',
    dueDate: null,
    endDate: null,
    duration: null,
    priority: 50,
    parentTaskId: null,
    parentTaskName: null,
    processInstanceId: '86',
    processInstanceName: null,
    processDefinitionId: 'TranslationProcess:2:8',
    processDefinitionName: 'Translation Process',
    processDefinitionDescription: null,
    processDefinitionKey: 'TranslationProcess',
    processDefinitionCategory: 'http://www.activiti.org/processdef',
    processDefinitionVersion: 2,
    processDefinitionDeploymentId: '5',
    formKey: '4',
    processInstanceStartUserId: '1001',
    initiatorCanCompleteTask: true,
    adhocTaskCanBeReassigned: false,
    taskDefinitionKey: 'sid-DDECD9E4-0299-433F-9193-C3D905C3EEBE',
    executionId: '86',
    involvedGroups: [],
    involvedPeople: [],
    memberOfCandidateUsers: false,
    managerOfCandidateGroup: false,
    memberOfCandidateGroup: false
});

export const initiatorWithCandidatesTaskDetailsMock = new TaskDetailsModel({
    id: '91',
    name: 'Request translation',
    description: null,
    category: null,
    assignee: null,
    created: '2016-11-03T15:25:42.749+0000',
    dueDate: null,
    endDate: null,
    duration: null,
    priority: 50,
    parentTaskId: null,
    parentTaskName: null,
    processInstanceId: '86',
    processInstanceName: null,
    processDefinitionId: 'TranslationProcess:2:8',
    processDefinitionName: 'Translation Process',
    processDefinitionDescription: null,
    processDefinitionKey: 'TranslationProcess',
    processDefinitionCategory: 'http://www.activiti.org/processdef',
    processDefinitionVersion: 2,
    processDefinitionDeploymentId: '5',
    formKey: '4',
    processInstanceStartUserId: '1001',
    initiatorCanCompleteTask: true,
    adhocTaskCanBeReassigned: false,
    taskDefinitionKey: 'sid-DDECD9E4-0299-433F-9193-C3D905C3EEBE',
    executionId: '86',
    involvedGroups: [],
    involvedPeople: [
        {
            id: 1001,
            firstName: 'Wilbur',
            lastName: 'Adams',
            email: 'wilbur@app.activiti.com'
        },
        {
            id: 111,
            firstName: 'fake-first-name',
            lastName: 'fake-last-name',
            email: 'fake@app.activiti.com'
        }
    ],
    memberOfCandidateUsers: true,
    managerOfCandidateGroup: true,
    memberOfCandidateGroup: true
});

export const taskDetailsWithOutAssigneeMock = new TaskDetailsModel({
    id: '91',
    name: 'Request translation',
    description: null,
    category: null,
    assignee: undefined,
    created: '2016-11-03T15:25:42.749+0000',
    dueDate: null,
    endDate: null,
    duration: null,
    priority: 50,
    parentTaskId: null,
    parentTaskName: null,
    processInstanceId: '86',
    processInstanceName: null,
    processDefinitionId: 'TranslationProcess:2:8',
    processDefinitionName: 'Translation Process',
    processDefinitionDescription: null,
    processDefinitionKey: 'TranslationProcess',
    processDefinitionCategory: 'http://www.activiti.org/processdef',
    processDefinitionVersion: 2,
    processDefinitionDeploymentId: '5',
    formKey: '4',
    processInstanceStartUserId: '1001',
    initiatorCanCompleteTask: false,
    adhocTaskCanBeReassigned: false,
    taskDefinitionKey: 'sid-DDECD9E4-0299-433F-9193-C3D905C3EEBE',
    executionId: '86',
    involvedGroups: [],
    involvedPeople: [],
    memberOfCandidateUsers: false,
    managerOfCandidateGroup: false,
    memberOfCandidateGroup: false
});

export const claimableTaskDetailsMock = new TaskDetailsModel({
    id: '91',
    name: 'Request translation',
    description: null,
    category: null,
    assignee: null,
    created: '2016-11-03T15:25:42.749+0000',
    dueDate: null,
    endDate: null,
    duration: null,
    priority: 50,
    formKey: '4',
    parentTaskId: null,
    parentTaskName: null,
    processInstanceId: '86',
    processInstanceName: null,
    processDefinitionId: 'TranslationProcess:2:8',
    processDefinitionName: 'Translation Process',
    involvedGroups: [
        {
            id: 7007,
            name: 'group1',
            externalId: null,
            status: 'active',
            groups: null
        },
        {
            id: 8008,
            name: 'group2',
            externalId: null,
            status: 'active',
            groups: null
        }
    ],
    involvedPeople: [],
    managerOfCandidateGroup: true,
    memberOfCandidateGroup: true,
    memberOfCandidateUsers: false
});

export const claimedTaskDetailsMock = new TaskDetailsModel({
    id: '91',
    name: 'Request translation',
    description: null,
    category: null,
    assignee: {
        id: 1001,
        firstName: 'Wilbur',
        lastName: 'Adams',
        email: 'wilbur@app.activiti.com'
    },
    created: '2016-11-03T15:25:42.749+0000',
    dueDate: null,
    endDate: null,
    duration: null,
    priority: 50,
    formKey: '4',
    parentTaskId: null,
    parentTaskName: null,
    processInstanceId: '86',
    processInstanceName: null,
    processInstanceStartUserId: '1002',
    initiatorCanCompleteTask: false,
    processDefinitionId: 'TranslationProcess:2:8',
    processDefinitionName: 'Translation Process',
    involvedGroups: [
        {
            id: 7007,
            name: 'group1',
            externalId: null,
            status: 'active',
            groups: null
        }
    ],
    involvedPeople: [
        {
            id: 1001,
            firstName: 'Wilbur',
            lastName: 'Adams',
            email: 'wilbur@app.activiti.com'
        },
        {
            id: 111,
            firstName: 'fake-first-name',
            lastName: 'fake-last-name',
            email: 'fake@app.activiti.com'
        }
    ],
    managerOfCandidateGroup: true,
    memberOfCandidateGroup: true,
    memberOfCandidateUsers: true
});

export const claimedByGroupMemberMock = new TaskDetailsModel({
    id: '91',
    name: 'Request translation',
    description: null,
    category: null,
    assignee: {
        id: 111,
        firstName: 'fake-first-name',
        lastName: 'fake-last-name',
        email: 'fake@app.activiti.com'
    },
    created: '2016-11-03T15:25:42.749+0000',
    dueDate: null,
    endDate: null,
    duration: null,
    priority: 50,
    parentTaskId: null,
    parentTaskName: null,
    processInstanceId: '86',
    processInstanceName: null,
    processDefinitionId: 'TranslationProcess:2:8',
    processDefinitionName: 'Translation Process',
    involvedGroups: [
        {
            id: 7007,
            name: 'group1',
            externalId: null,
            status: 'active',
            groups: null
        }
    ],
    involvedPeople: [
        {
            id: 1001,
            firstName: 'Wilbur',
            lastName: 'Adams',
            email: 'wilbur@app.activiti.com'
        },
        {
            id: 111,
            firstName: 'fake-first-name',
            lastName: 'fake-last-name',
            email: 'fake@app.activiti.com'
        }
    ],
    managerOfCandidateGroup: true,
    memberOfCandidateGroup: true,
    memberOfCandidateUsers: true
});

export const taskDetailsWithOutCandidateGroup = new TaskDetailsModel({
    id: '91',
    name: 'Request translation',
    description: null,
    category: null,
    assignee: {
        id: 1001,
        firstName: 'Wilbur',
        lastName: 'Adams',
        email: 'wilbur@app.activiti.com'
    },
    created: '2016-11-03T15:25:42.749+0000',
    dueDate: null,
    endDate: null,
    duration: null,
    priority: 50,
    parentTaskId: null,
    parentTaskName: null,
    processInstanceId: null,
    processInstanceName: null,
    processDefinitionId: 'TranslationProcess:2:8',
    processDefinitionName: 'Translation Process',
    managerOfCandidateGroup: false,
    memberOfCandidateGroup: false,
    memberOfCandidateUsers: false,
    involvedGroups: [],
    involvedPeople: [
        {
            id: 1001,
            firstName: 'Wilbur',
            lastName: 'Adams',
            email: 'wilbur@app.activiti.com'
        },
        {
            id: 111,
            firstName: 'fake-first-name',
            lastName: 'fake-last-name',
            email: 'fake@app.activiti.com'
        }
    ]
});

export const completedTaskWithFormMock = new TaskDetailsModel({
    id: '91',
    name: 'Request translation',
    description: null,
    category: null,
    assignee: {
        id: 1001,
        firstName: 'Wilbur',
        lastName: 'Adams',
        email: 'wilbur@app.activiti.com'
    },
    created: '2016-11-03T15:25:42.749+0000',
    dueDate: null,
    endDate: new Date(),
    duration: null,
    priority: 50,
    formKey: '91',
    parentTaskId: null,
    parentTaskName: null,
    processInstanceId: '86',
    processInstanceName: null,
    processDefinitionId: 'TranslationProcess:2:8',
    processDefinitionName: 'Translation Process',
    involvedGroups: [],
    involvedPeople: [],
    managerOfCandidateGroup: true,
    memberOfCandidateGroup: true,
    memberOfCandidateUsers: false
});

export const completedTaskDetailsMock = new TaskDetailsModel({
    id: '91',
    name: 'Request translation',
    description: null,
    category: null,
    assignee: {
        id: 1001,
        firstName: 'Wilbur',
        lastName: 'Adams',
        email: 'wilbur@app.activiti.com'
    },
    created: '2016-11-03T15:25:42.749+0000',
    dueDate: null,
    endDate: new Date(),
    duration: null,
    priority: 50,
    formKey: null,
    parentTaskId: null,
    parentTaskName: null,
    processInstanceId: '86',
    processInstanceName: null,
    processDefinitionId: 'TranslationProcess:2:8',
    processDefinitionName: 'Translation Process',
    involvedGroups: [],
    involvedPeople: [],
    managerOfCandidateGroup: true,
    memberOfCandidateGroup: true,
    memberOfCandidateUsers: false
});

export const taskDetailsWithOutFormMock = new TaskDetailsModel({
    id: '91',
    name: 'Request translation',
    description: 'fake description',
    category: null,
    assignee: {id: 1001, firstName: 'Admin', lastName: 'Paul', email: 'fake-email@gmail.com' },
    created: '2016-11-03T15:25:42.749+0000',
    dueDate: '2016-11-03T15:25:42.749+0000',
    endDate: null,
    duration: null,
    priority: 50,
    parentTaskId: null,
    parentTaskName: null,
    processInstanceId: '86',
    processInstanceName: null,
    processDefinitionId: 'TranslationProcess:2:8',
    processDefinitionName: 'Translation Process',
    processDefinitionDescription: null,
    processDefinitionKey: 'TranslationProcess',
    processDefinitionCategory: 'http://www.activiti.org/processdef',
    processDefinitionVersion: 2,
    processDefinitionDeploymentId: '5',
    formKey: null,
    processInstanceStartUserId: '1001',
    initiatorCanCompleteTask: false,
    adhocTaskCanBeReassigned: false,
    taskDefinitionKey: 'sid-DDECD9E4-0299-433F-9193-C3D905C3EEBE',
    executionId: '86',
    involvedPeople: [],
    memberOfCandidateUsers: false,
    managerOfCandidateGroup: false,
    memberOfCandidateGroup: false
});

export const taskFormMock = {
           id: 4,
           name: 'Translation request',
           processDefinitionId: 'TranslationProcess:2:8',
           processDefinitionName: 'Translation Process',
           processDefinitionKey: 'TranslationProcess',
           taskId: '91',
           taskDefinitionKey: 'sid-DDECD9E4-0299-433F-9193-C3D905C3EEBE',
           tabs: [],
           fields: [
               {
                   fieldType: 'ContainerRepresentation',
                   id: '1582747048995',
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
                   dateDisplayFormat: null,
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
                               id: 'text1',
                               name: 'Text1',
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
                               dateDisplayFormat: null,
                               layout: { row: -1, column: -1, colspan: 1 },
                               sizeX: 1,
                               sizeY: 1,
                               row: -1,
                               col: -1,
                               visibilityCondition: null
                           }
                       ],
                       2: [
                           {
                               fieldType: 'FormFieldRepresentation',
                               id: 'text2',
                               name: 'Text2',
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
                               dateDisplayFormat: null,
                               layout: { row: -1, column: -1, colspan: 1 },
                               sizeX: 1,
                               sizeY: 1,
                               row: -1,
                               col: -1,
                               visibilityCondition: null
                           }
                       ]
                   }
               },
               {
                   fieldType: 'ContainerRepresentation',
                   id: '1582747052793',
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
                   dateDisplayFormat: null,
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
                               id: 'text3',
                               name: 'Text3',
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
                               dateDisplayFormat: null,
                               layout: { row: -1, column: -1, colspan: 1 },
                               sizeX: 1,
                               sizeY: 1,
                               row: -1,
                               col: -1,
                               visibilityCondition: {
                                   leftFormFieldId: 'text1',
                                   leftRestResponseId: null,
                                   operator: '==',
                                   rightValue: '',
                                   rightType: null,
                                   rightFormFieldId: 'text2',
                                   rightRestResponseId: '',
                                   nextConditionOperator: '',
                                   nextCondition: null
                               }
                           }
                       ],
                       2: [
                           {
                               fieldType: 'FormFieldRepresentation',
                               id: 'numberField',
                               name: 'numberField',
                               type: 'integer',
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
                               params: {
                                   existingColspan: 1,
                                   maxColspan: 1
                               },
                               dateDisplayFormat: null,
                               layout: {
                                   row: -1,
                                   column: -1,
                                   colspan: 1
                               },
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
           customFieldsValueInfo: {},
           gridsterForm: false,
           globalDateFormat: 'D-M-YYYY'
       };

export const tasksMock = [new TaskDetailsModel(taskDetailsMock)];

export const noDataMock = [
    new TaskDetailsModel({
        id: 1005,
        message: 'example-message',
        created: '2017-10-06T11:54:53.443+0000',
        createdBy: {
            id: 4004,
            firstName: 'gadget',
            lastName: 'inspector',
            email: 'gadget@inspector.com'
        }
    })
];

export const involvedUserTaskForm = {
    id: '20259',
    name: 'Shared task',
    description: '',
    category: null,
    assignee: {
        id: 347,
        firstName: 'Fake',
        lastName: 'assignee',
        email: 'fake-assignee@test.com'
    },
    created: '2020-08-14T11:02:44.992+0000',
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
    formKey: '3896',
    processInstanceStartUserId: null,
    initiatorCanCompleteTask: false,
    adhocTaskCanBeReassigned: true,
    taskDefinitionKey: null,
    executionId: null,
    involvedPeople: [
        {
            id: 1001,
            email: 'fake-email@gmail.com',
            firstName: 'fake',
            lastName: 'user'
        }
    ],
    involvedGroups: [],
    memberOfCandidateGroup: false,
    memberOfCandidateUsers: false,
    managerOfCandidateGroup: false
};

export const involvedGroupTaskForm = {
    id: '20259',
    name: 'Shared task',
    description: '',
    category: null,
    assignee: {
        id: 347,
        firstName: 'Fake',
        lastName: 'assignee',
        email: 'fake-assignee@test.com'
    },
    created: '2020-08-14T11:02:44.992+0000',
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
    formKey: '3896',
    processInstanceStartUserId: null,
    initiatorCanCompleteTask: false,
    adhocTaskCanBeReassigned: true,
    taskDefinitionKey: null,
    executionId: null,
    involvedPeople: [],
    involvedGroups: [
        {
            id: 637,
            name: 'one-group'
        }
    ],
    memberOfCandidateGroup: false,
    memberOfCandidateUsers: false,
    managerOfCandidateGroup: false
};

export const fakeUser = new UserRepresentation({
    id: 1001,
    email: 'fake-email@gmail.com',
    firstName: 'fake',
    lastName: 'user',
    externalId: null,
    company: null,
    pictureId: null,
    fullname: 'One Alfrsco',
    password: null,
    type: 'enterprise',
    status: 'active',
    created: '2020-08-14T09:21:52.306Z',
    lastUpdate: '2020-08-14T09:22:48.147Z',
    tenantId: 310,
    groups: [
        {
            id: 637,
            name: 'one-group',
            externalId: null,
            status: 'active',
            parentGroupId: null,
            tenantId: 310,
            type: 1,
            userCount: null,
            users: null,
            capabilities: null,
            groups: null
        }
    ],
    capabilities: null,
    apps: [],
    tenantPictureId: null,
    tenantName: 'abc'
});

export const completedProcessTaskWithoutForm = new TaskDetailsModel({
    id: '49',
    name: 'process task without form',
    description: null,
    category: null,
    assignee: {
        id: 3,
        firstName: 'HR',
        lastName: 'User',
        email: 'hruser@example.com'
    },
    created: '2021-07-08T07:39:27.046+0000',
    dueDate: null,
    endDate: '2021-07-08T07:39:35.817+0000',
    duration: 8771,
    priority: 0,
    parentTaskId: null,
    parentTaskName: null,
    processInstanceId: '37',
    processInstanceName: null,
    processDefinitionId: 'process:1:36',
    processDefinitionName: 'process',
    processDefinitionDescription: null,
    processDefinitionKey: 'process',
    processDefinitionCategory: 'http://www.activiti.org/processdef',
    processDefinitionVersion: 1,
    processDefinitionDeploymentId: '34',
    formKey: null,
    processInstanceStartUserId: '3',
    initiatorCanCompleteTask: false,
    adhocTaskCanBeReassigned: false,
    taskDefinitionKey: 'sid-1E90524A-8270-4031-89B6-5D18F414BFB8',
    executionId: '41',
    involvedPeople: [],
    involvedGroups: [],
    memberOfCandidateGroup: false,
    memberOfCandidateUsers: false,
    managerOfCandidateGroup: false
});
