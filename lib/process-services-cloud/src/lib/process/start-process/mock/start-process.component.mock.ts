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

import { ProcessInstanceCloud } from '../models/process-instance-cloud.model';
import { ProcessPayloadCloud } from '../models/process-payload-cloud.model';
import { ProcessDefinitionCloud } from '../models/process-definition-cloud.model';

export let fakeProcessInstance = new ProcessInstanceCloud({
    appName: 'simple-app',
    appVersion: '',
    id: 'd0b30377-dc5a-11e8-ae24-0a58646001fa',
    name: 'My Process Name',
    startDate: '2018-10-30T15:45:24.136+0000',
    initiator: 'usermock',
    status: 'RUNNING',
    processDefinitionId: 'BasicProcess:1:d05062f1-c6fb-11e8-ae24-0a58646001fa',
    processDefinitionKey: 'BasicProcess'
});

export let fakeCreatedProcessInstance = new ProcessInstanceCloud({
    appName: 'simple-app',
    appVersion: '',
    id: 'd0b30377-dc5a-11e8-ae24-0a58646001fa',
    name: 'My Process Name',
    startDate: null,
    initiator: 'usermock',
    status: 'CREATED',
    processDefinitionId: 'BasicProcess:1:d05062f1-c6fb-11e8-ae24-0a58646001fa',
    processDefinitionKey: 'BasicProcess'
});

export let fakeProcessDefinitions: ProcessDefinitionCloud[] = [
    new ProcessDefinitionCloud({
        appName: 'myApp',
        appVersion: 0,
        id: 'NewProcess:1',
        name: 'processwithoutform1',
        key: 'process-12345-f992-4ee6-9742-3a04617469fe',
        formKey: ''
    }),
    new ProcessDefinitionCloud({
        appName: 'myApp',
        appVersion: 0,
        id: 'NewProcess:2',
        name: 'processwithoutform2',
        key: 'process-5151ad1d-f992-4ee6-9742-3a04617469fe',
        formKey: ''
    }),
    new ProcessDefinitionCloud({
        appName: 'startformwithoutupload',
        formKey: 'form-a5d50817-5183-4850-802d-17af54b2632f',
        id: 'd00c0237-8772-11e9-859a-428f83d5904f',
        key: 'process-5151ad1d-f992-4ee6-9742-3a04617469fe',
        name: 'processwithform'
    }),
    new ProcessDefinitionCloud({
        appName: 'startformwithoutupload',
        formKey: 'form-a5d50817-5183-4850-802d-17af54b2632f',
        id: 'd00c0237-8772-11e9-859a-428f83d5904f',
        key: 'process-51251ad1d-f992-4ee6-9742-3a04617469f1',
        name: 'process'
    })
];

export function fakeSingleProcessDefinition(name: string): ProcessDefinitionCloud[] {
    return [
        new ProcessDefinitionCloud({
            appName: 'startformwithoutupload',
            formKey: 'form-a5d50817-5183-4850-802d-17af54b2632f',
            id: 'd00c0237-8772-11e9-859a-428f83d5904f',
            key: 'process-5151ad1d-f992-4ee6-9742-3a04617469fe',
            name: name
        })
    ];
}

export let fakeNoNameProcessDefinitions: ProcessDefinitionCloud[] = [
    new ProcessDefinitionCloud({
        appName: 'myApp',
        appVersion: 0,
        id: 'NewProcess:1',
        key: 'NewProcess 1',
        name: ''
    }),
    new ProcessDefinitionCloud({
        appName: 'myApp',
        appVersion: 0,
        id: 'NewProcess:2',
        key: 'NewProcess 2',
        name: null
    })
];

export let fakeProcessPayload = new ProcessPayloadCloud({
    processDefinitionKey: 'NewProcess:1',
    name: 'NewProcess 1',
    payloadType: 'string'
});

export let fakeStartForm = {
    'formRepresentation': {
        'id': 'form-de8895be-d0d7-4434-beef-559b15305d72',
        'name': 'StartEventForm',
        'description': '',
        'version': 0,
        'formDefinition': {
            'tabs': [],
            'fields': [
                {
                    'type': 'container',
                    'id': '5a6b24c1-db2b-45e9-9aff-142395433d23',
                    'name': 'Label',
                    'tab': null,
                    'fields': {
                        '1': [
                            {
                                'type': 'text',
                                'id': 'firstName',
                                'name': 'firstName',
                                'colspan': 1,
                                'params': {
                                    'existingColspan': 1,
                                    'maxColspan': 2
                                },
                                'visibilityCondition': null,
                                'placeholder': null,
                                'value': null,
                                'required': false,
                                'minLength': 0,
                                'maxLength': 0,
                                'regexPattern': null
                            }
                        ],
                        '2': [
                            {
                                'type': 'text',
                                'id': 'lastName',
                                'name': 'lastName',
                                'colspan': 1,
                                'params': {
                                    'existingColspan': 1,
                                    'maxColspan': 2
                                },
                                'visibilityCondition': null,
                                'placeholder': null,
                                'value': null,
                                'required': false,
                                'minLength': 0,
                                'maxLength': 0,
                                'regexPattern': null
                            }
                        ]
                    },
                    'numberOfColumns': 2
                }
            ],
            'outcomes': [],
            'metadata': {},
            'variables': []
        }
    }
};

export let fakeStartFormNotValid = {
    'formRepresentation': {
        'id': 'form-a5d50817-5183-4850-802d-17af54b2632f',
        'name': 'simpleform',
        'description': '',
        'version': 0,
        'formDefinition': {
            'tabs': [],
            'fields': [
                {
                    'type': 'container',
                    'id': '5a6b24c1-db2b-45e9-9aff-142395433d23',
                    'name': 'Label',
                    'tab': null,
                    'fields': {
                        '1': [
                            {
                                'type': 'text',
                                'id': 'firstName',
                                'name': 'firstName',
                                'colspan': 1,
                                'params': {
                                    'existingColspan': 1,
                                    'maxColspan': 2
                                },
                                'visibilityCondition': null,
                                'placeholder': null,
                                'value': null,
                                'required': true,
                                'minLength': 15,
                                'maxLength': 0,
                                'regexPattern': null
                            }
                        ],
                        '2': [
                            {
                                'type': 'text',
                                'id': 'lastName',
                                'name': 'lastName',
                                'colspan': 1,
                                'params': {
                                    'existingColspan': 1,
                                    'maxColspan': 2
                                },
                                'visibilityCondition': null,
                                'placeholder': null,
                                'value': null,
                                'required': false,
                                'minLength': 0,
                                'maxLength': 0,
                                'regexPattern': null
                            }
                        ]
                    },
                    'numberOfColumns': 2
                }
            ],
            'outcomes': [],
            'metadata': {},
            'variables': []
        }
    }
};
