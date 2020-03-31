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

import { ObjectDataColumn } from '@alfresco/adf-core';

export const fakeProcessCloudList = {
    list: {
        entries: [
            {
                entry: {
                    appName: 'easy-peasy-japanesey',
                    appVersion: 1,
                    id: '69eddfa7-d781-11e8-ae24-0a58646001fa',
                    name: 'starring',
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
                    appName: 'easy-peasy-japanesey',
                    appVersion: 1,
                    id: '8b3f625f-d781-11e8-ae24-0a58646001fa',
                    name: null,
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
                    appName: 'easy-peasy-japanesey',
                    appVersion: 2,
                    id: '87c12637-d783-11e8-ae24-0a58646001fa',
                    name: null,
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
            'title': 'ADF_CLOUD_TASK_LIST.PROPERTIES.FAKE',
            'sortable': true
        }),
        new ObjectDataColumn({
            'key': 'fakeTaskName',
            'type': 'text',
            'title': 'ADF_CLOUD_TASK_LIST.PROPERTIES.TASK_FAKE',
            'sortable': true
        })
    ];

export const processListSchemaMock = {
    'presets': {
        'default': [
            {
                'key': 'entry.id',
                'type': 'text',
                'title': 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.ID',
                'sortable': true
            },
            {
                'key': 'entry.name',
                'type': 'text',
                'title': 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.NAME',
                'sortable': true
            },
            {
                'key': 'entry.status',
                'type': 'text',
                'title': 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.STATUS',
                'sortable': true
            },
            {
                'key': 'entry.startDate',
                'type': 'date',
                'title': 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.START_DATE',
                'sortable': true,
                'format': 'timeAgo'
            },
            {
                'key': 'entry.appName',
                'type': 'text',
                'title': 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.APP_NAME',
                'sortable': true
            },
            {
                'key': 'entry.businessKey',
                'type': 'text',
                'title': 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.BUSINESS_KEY',
                'sortable': true
            },
            {
                'key': 'entry.initiator',
                'type': 'text',
                'title': 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.INITIATOR',
                'sortable': true
            },
            {
                'key': 'entry.lastModified',
                'type': 'date',
                'title': 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.LAST_MODIFIED',
                'sortable': true
            },
            {
                'key': 'entry.processDefinitionId',
                'type': 'text',
                'title': 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.PROCESS_DEF_ID',
                'sortable': true
            },
            {
                'key': 'entry.processDefinitionKey',
                'type': 'text',
                'title': 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.PROCESS_DEF_KEY',
                'sortable': true
            }
        ]
    }
};
