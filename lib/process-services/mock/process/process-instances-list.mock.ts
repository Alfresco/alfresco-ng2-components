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

export let fakeProcessInstance = {
    size: 2,
    total: 2,
    start: 0,
    data: [
        {
            id: '1',
            name: 'Process 773443333',
            businessKey: null,
            processDefinitionId: 'fakeprocess:5:7507',
            tenantId: 'tenant_1',
            started: '2015-11-09T12:36:14.184+0000',
            ended: null,
            startedBy: {
                id: 3,
                firstName: 'tenant2',
                lastName: 'tenantLastName',
                email: 'tenant2@tenant'
            },
            processDefinitionName: 'Fake Process Name',
            processDefinitionDescription: null,
            processDefinitionKey: 'fakeprocess',
            processDefinitionCategory: 'http://www.activiti.org/processdef',
            processDefinitionVersion: 1,
            processDefinitionDeploymentId: '2540',
            graphicalNotationDefined: true,
            startFormDefined: false,
            suspended: false,
            variables: []
        },
        {
            id: '2',
            name: 'Process 382927392',
            businessKey: null,
            processDefinitionId: 'fakeprocess:5:7507',
            tenantId: 'tenant_1',
            started: '2018-01-10T17:02:22.597+0000',
            ended: null,
            startedBy: {
                id: 3,
                firstName: 'tenant2',
                lastName: 'tenantLastName',
                email: 'tenant2@tenant'
            },
            processDefinitionName: 'Fake Process Name',
            processDefinitionDescription: null,
            processDefinitionKey: 'fakeprocess',
            processDefinitionCategory: 'http://www.activiti.org/processdef',
            processDefinitionVersion: 1,
            processDefinitionDeploymentId: '2540',
            graphicalNotationDefined: true,
            startFormDefined: false,
            suspended: false,
            variables: []
        }
    ]
};

export let fakeProcessInstancesWithNoName = {
    size: 2,
    total: 2,
    start: 0,
    data: [
        {
            id: '1',
            name: null,
            processDefinitionId: 'fakeprocess:5:7507',
            processDefinitionKey: 'fakeprocess',
            processDefinitionName: 'Fake Process Name',
            description: null,
            category: null,
            started: '2017-11-09T12:36:14.184+0000',
            startedBy: {
                id: 3,
                firstName: 'tenant2',
                lastName: 'tenantLastName',
                email: 'tenant2@tenant'
            }
        },
        {
            id: 2,
            name: '',
            processDefinitionId: 'fakeprocess:5:7507',
            processDefinitionKey: 'fakeprocess',
            processDefinitionName: 'Fake Process Name',
            description: null,
            category: null,
            started: '2017-11-09T12:37:25.184+0000',
            startedBy: {
                id: 3,
                firstName: 'tenant2',
                lastName: 'tenantLastName',
                email: 'tenant2@tenant'
            }
        }
    ]
};

export let fakeProcessCustomSchema = [
    new ObjectDataColumn({
        key: 'fakeName',
        type: 'text',
        title: 'ADF_PROCESS_LIST.PROPERTIES.FAKE',
        sortable: true
    }),
    new ObjectDataColumn({
        key: 'fakeProcessName',
        type: 'text',
        title: 'ADF_PROCESS_LIST.PROPERTIES.PROCESS_FAKE',
        sortable: true
    })
];

export let fakeProcessColumnSchema = {
    default: [
        {
            key: 'name',
            type: 'text',
            title: 'ADF_PROCESS_LIST.PROPERTIES.NAME',
            sortable: true
        }
    ],
    fakeProcessCustomSchema
};
