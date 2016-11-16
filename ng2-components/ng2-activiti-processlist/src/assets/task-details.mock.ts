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

export var taskDetailsMock = {
    'id': '91',
    'name': 'Request translation',
    'description': null,
    'category': null,
    'assignee': {'id': 1001, 'firstName': 'Wilbur', 'lastName': 'Adams', 'email': 'wilbur@app.activiti.com'},
    'created': '2016-11-03T15:25:42.749+0000',
    'dueDate': null,
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
    'formKey': '4',
    'processInstanceStartUserId': '1001',
    'initiatorCanCompleteTask': false,
    'adhocTaskCanBeReassigned': false,
    'taskDefinitionKey': 'sid-DDECD9E4-0299-433F-9193-C3D905C3EEBE',
    'executionId': '86',
    'involvedPeople': [],
    'memberOfCandidateUsers': false,
    'managerOfCandidateGroup': false,
    'memberOfCandidateGroup': false
};

export var taskFormMock = {
    'id': 4,
    'name': 'Translation request',
    'processDefinitionId': 'TranslationProcess:2:8',
    'processDefinitionName': 'Translation Process',
    'processDefinitionKey': 'TranslationProcess',
    'taskId': '91',
    'taskName': 'Request translation',
    'taskDefinitionKey': 'sid-DDECD9E4-0299-433F-9193-C3D905C3EEBE',
    'tabs': [],
    'fields': [{
        'fieldType': 'ContainerRepresentation',
        'id': '1478093984155',
        'name': 'Label',
        'type': 'container',
        'value': null,
        'required': false,
        'readOnly': false,
        'overrideId': false,
        'colspan': 1,
        'placeholder': null,
        'minLength': 0,
        'maxLength': 0,
        'minValue': null,
        'maxValue': null,
        'regexPattern': null,
        'optionType': null,
        'hasEmptyValue': null,
        'options': null,
        'restUrl': null,
        'restResponsePath': null,
        'restIdProperty': null,
        'restLabelProperty': null,
        'tab': null,
        'className': null,
        'dateDisplayFormat': null,
        'layout': null,
        'sizeX': 2,
        'sizeY': 1,
        'row': -1,
        'col': -1,
        'visibilityCondition': null,
        'numberOfColumns': 2,
        'fields': {
            '1': [{
                'fieldType': 'AttachFileFieldRepresentation',
                'id': 'originalcontent',
                'name': 'Original content',
                'type': 'upload',
                'value': [],
                'required': true,
                'readOnly': false,
                'overrideId': false,
                'colspan': 1,
                'placeholder': null,
                'minLength': 0,
                'maxLength': 0,
                'minValue': null,
                'maxValue': null,
                'regexPattern': null,
                'optionType': null,
                'hasEmptyValue': null,
                'options': null,
                'restUrl': null,
                'restResponsePath': null,
                'restIdProperty': null,
                'restLabelProperty': null,
                'tab': null,
                'className': null,
                'params': {
                },
                'dateDisplayFormat': null,
                'layout': {'row': -1, 'column': -1, 'colspan': 1},
                'sizeX': 1,
                'sizeY': 1,
                'row': -1,
                'col': -1,
                'visibilityCondition': null,
                'metaDataColumnDefinitions': []
            }],
            '2': [{
                'fieldType': 'RestFieldRepresentation',
                'id': 'language',
                'name': 'Language',
                'type': 'dropdown',
                'value': 'Choose one...',
                'required': true,
                'readOnly': false,
                'overrideId': false,
                'colspan': 1,
                'placeholder': null,
                'minLength': 0,
                'maxLength': 0,
                'minValue': null,
                'maxValue': null,
                'regexPattern': null,
                'optionType': null,
                'hasEmptyValue': true,
                'options': [{'id': 'empty', 'name': 'Choose one...'}, {'id': 'fr', 'name': 'French'}, {
                    'id': 'de',
                    'name': 'German'
                }, {'id': 'es', 'name': 'Spanish'}],
                'restUrl': null,
                'restResponsePath': null,
                'restIdProperty': null,
                'restLabelProperty': null,
                'tab': null,
                'className': null,
                'params': {'existingColspan': 1, 'maxColspan': 1},
                'dateDisplayFormat': null,
                'layout': {'row': -1, 'column': -1, 'colspan': 1},
                'sizeX': 1,
                'sizeY': 1,
                'row': -1,
                'col': -1,
                'visibilityCondition': null,
                'endpoint': null,
                'requestHeaders': null
            }]
        }
    }],
    'outcomes': [],
    'javascriptEvents': [],
    'className': '',
    'style': '',
    'customFieldTemplates': {},
    'metadata': {},
    'variables': [],
    'gridsterForm': false,
    'globalDateFormat': 'D-M-YYYY'
};

export var tasksMock = {
    data: [
        taskDetailsMock
    ]
};

export var noDataMock = {
    data: []
};
