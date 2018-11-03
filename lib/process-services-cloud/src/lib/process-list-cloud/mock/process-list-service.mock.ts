/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ObjectDataColumn } from '@alfresco/adf-core';

export const fakeProcessCloudList = {
    list: {
        entries: [
            {
                entry: {
                    serviceName: 'simple-app-rb',
                    serviceFullName: 'simple-app-rb',
                    serviceVersion: '',
                    appName: 'easy-peasy-japanesey',
                    appVersion: '',
                    serviceType: null,
                    id: '69eddfa7-d781-11e8-ae24-0a58646001fa',
                    name: 'starring',
                    description: null,
                    processDefinitionId: 'BasicProcess:1:d05062f1-c6fb-11e8-ae24-0a58646001fa',
                    processDefinitionKey: 'BasicProcess',
                    initiator: 'devopsuser',
                    startDate: 1540381146275,
                    businessKey: 'MyBusinessKey',
                    status: 'RUNNING',
                    lastModified: 1540381146276,
                    lastModifiedTo: null,
                    lastModifiedFrom: null
                }
            },
            {
                entry: {
                    serviceName: 'simple-app-rb',
                    serviceFullName: 'simple-app-rb',
                    serviceVersion: '',
                    appName: 'easy-peasy-japanesey',
                    appVersion: '',
                    serviceType: null,
                    id: '8b3f625f-d781-11e8-ae24-0a58646001fa',
                    name: null,
                    description: null,
                    processDefinitionId: 'BasicProcess:1:d05062f1-c6fb-11e8-ae24-0a58646001fa',
                    processDefinitionKey: 'BasicProcess',
                    initiator: 'devopsuser',
                    startDate: 1540381202174,
                    businessKey: 'MyBusinessKey',
                    status: 'RUNNING',
                    lastModified: 1540381202174,
                    lastModifiedTo: null,
                    lastModifiedFrom: null
                }
            },
            {
                entry: {
                    serviceName: 'simple-app-rb',
                    serviceFullName: 'simple-app-rb',
                    serviceVersion: '',
                    appName: 'easy-peasy-japanesey',
                    appVersion: '',
                    serviceType: null,
                    id: '87c12637-d783-11e8-ae24-0a58646001fa',
                    name: null,
                    description: null,
                    processDefinitionId: 'BasicProcess:1:d05062f1-c6fb-11e8-ae24-0a58646001fa',
                    processDefinitionKey: 'BasicProcess',
                    initiator: 'superadminuser',
                    startDate: 1540382055307,
                    businessKey: 'MyBusinessKey',
                    status: 'RUNNING',
                    lastModified: 1540382055308,
                    lastModifiedTo: null,
                    lastModifiedFrom: null
                }
            }
        ],
        pagination: {
            skipCount: 0,
            maxItems: 100,
            count: 3,
            hasMoreItems: false,
            totalItems: 3
        }
    }
};

export let fakeCustomSchema =
    [
        new ObjectDataColumn({
            'key': 'fakeName',
            'type': 'text',
            'title': 'ADF_TASK_LIST.PROPERTIES.FAKE',
            'sortable': true
        }),
        new ObjectDataColumn({
            'key': 'fakeTaskName',
            'type': 'text',
            'title': 'ADF_TASK_LIST.PROPERTIES.TASK_FAKE',
            'sortable': true
        })
    ];
