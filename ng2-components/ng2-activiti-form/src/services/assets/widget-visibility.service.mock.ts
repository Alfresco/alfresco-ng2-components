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

import { FormModel, FormValues } from '../../components/widgets/core/index';

export var formTest = new FormModel({});

export var fakeTaskProcessVariableModels = [
    {id: 'TEST_VAR_1', type: 'string', value: 'test_value_1'},
    {id: 'TEST_VAR_2', type: 'string', value: 'test_value_2'},
    {id: 'TEST_VAR_3', type: 'string', value: 'test_value_3'}
];

export var formValues: FormValues = {
    'test_1': 'value_1',
    'test_2': 'value_2',
    'test_3': 'value_1',
    'test_4': 'dropdown_id',
    'test_5': 'dropdown_label',
    'dropdown': {'id': 'dropdown_id', 'name': 'dropdown_label'}
};

export var fakeFormJson = {
    id: '9999',
    name: 'FORM_VISIBILITY',
    processDefinitionId: 'PROCESS_TEST:9:9999',
    processDefinitionName: 'PROCESS_TEST',
    processDefinitionKey: 'PROCESS_TEST',
    taskId: '999',
    taskName: 'TEST',
    fields: [
        {
            fieldType: 'ContainerRepresentation',
            id: '000000000000000000',
            name: 'Label',
            type: 'container',
            value: null,
            numberOfColumns: 2,
            fields: {
                1: [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'FIELD_WITH_CONDITION',
                        name: 'FIELD_WITH_CONDITION',
                        type: 'text',
                        value: 'field_with_condition_value',
                        visibilityCondition: null
                    },
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'LEFT_FORM_FIELD_ID',
                        name: 'LEFT_FORM_FIELD_NAME',
                        type: 'text',
                        value: 'LEFT_FORM_FIELD_VALUE',
                        visibilityCondition: null
                    }
                ],
                2: [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'RIGHT_FORM_FIELD_ID',
                        name: 'RIGHT_FORM_FIELD_NAME',
                        type: 'text',
                        value: 'RIGHT_FORM_FIELD_VALUE',
                        visibilityCondition: null
                    }
                ]
            }
        }
    ]
};
