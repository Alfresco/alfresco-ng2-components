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

import { TaskDetailsModel } from '../../task-list/models/task-details.model';

export let standaloneTaskWithForm = new TaskDetailsModel({
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

export let standaloneTaskWithoutForm = new TaskDetailsModel({
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

export let completedStandaloneTaskWithoutForm = new TaskDetailsModel({
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

export let taskDetailsMock = new TaskDetailsModel({
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

export let initiatorCanCompleteTaskDetailsMock = new TaskDetailsModel({
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
    memberOfCandidateUsers: false,
    managerOfCandidateGroup: false,
    memberOfCandidateGroup: false
});

export let taskDetailsWithOutAssigneeMock = new TaskDetailsModel({
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

export let claimableTaskDetailsMock = new TaskDetailsModel({
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

export let claimedTaskDetailsMock = new TaskDetailsModel({
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

export let claimedByGroupMemberMock = new TaskDetailsModel({
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

export let taskDetailsWithOutCandidateGroup = new TaskDetailsModel({
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

export let completedTaskWithFormMock = new TaskDetailsModel({
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

export let completedTaskDetailsMock = new TaskDetailsModel({
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

export let taskDetailsWithOutFormMock = new TaskDetailsModel({
    'id': '91',
    'name': 'Request translation',
    'description': 'fake description',
    'category': null,
    'assignee': {'id': 1001, 'firstName': 'Admin', 'lastName': 'Paul', 'email': 'fake-email' },
    'created': '2016-11-03T15:25:42.749+0000',
    'dueDate': '2016-11-03T15:25:42.749+0000',
    'endDate': null,
    'duration': null,
    'priority': 50,
    'parentTaskId': null,
    'parentTaskName': null,
    'processInstanceId': '86',
    'processInstanceName': null,
    'processDefinitionId': 'TranslationProcess:2:8',
    'processDefinitionName': 'Translation Process',
    'processDefinitionDescription': null,
    'processDefinitionKey': 'TranslationProcess',
    'processDefinitionCategory': 'http://www.activiti.org/processdef',
    'processDefinitionVersion': 2,
    'processDefinitionDeploymentId': '5',
    'formKey': null,
    'processInstanceStartUserId': '1001',
    'initiatorCanCompleteTask': false,
    'adhocTaskCanBeReassigned': false,
    'taskDefinitionKey': 'sid-DDECD9E4-0299-433F-9193-C3D905C3EEBE',
    'executionId': '86',
    'involvedPeople': [],
    'memberOfCandidateUsers': false,
    'managerOfCandidateGroup': false,
    'memberOfCandidateGroup': false
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
                       '1': [
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
                       '2': [
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
                       '1': [
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
                       '2': [
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

export let tasksMock = [new TaskDetailsModel(taskDetailsMock)];

export let noDataMock = [
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
