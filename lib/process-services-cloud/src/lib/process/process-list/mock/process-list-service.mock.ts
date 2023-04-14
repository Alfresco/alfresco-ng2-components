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

import { ObjectDataColumn } from '@alfresco/adf-core';
import { ProcessListDataColumnCustomData } from '../../../models/data-column-custom-data';

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
                    lastModifiedFrom: null,
                    variables: [{ id: 'variableId', value: 'variableValue'}]
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

export const fakeCustomSchema =
    [
        new ObjectDataColumn<ProcessListDataColumnCustomData>({
            key: 'fakeName',
            type: 'text',
            title: 'ADF_CLOUD_TASK_LIST.PROPERTIES.FAKE',
            sortable: true
        }),
        new ObjectDataColumn<ProcessListDataColumnCustomData>({
            key: 'fakeTaskName',
            type: 'text',
            title: 'ADF_CLOUD_TASK_LIST.PROPERTIES.TASK_FAKE',
            sortable: true
        })
    ];

export const processListSchemaMock = {
    presets: {
        default: [
            {
                key: 'id',
                title: 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.ID'
            },
            {
                key: 'name',
                title: 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.NAME'
            },
            {
                key: 'status',
                title: 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.STATUS'
            },
            {
                key: 'startDate',
                type: 'date',
                title: 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.START_DATE',
                format: 'timeAgo'
            },
            {
                key: 'appName',
                title: 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.APP_NAME'
            },
            {
                key: 'businessKey',
                title: 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.BUSINESS_KEY'
            },
            {
                key: 'initiator',
                title: 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.INITIATOR'
            },
            {
                key: 'lastModified',
                type: 'date',
                title: 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.LAST_MODIFIED'
            },
            {
                key: 'processDefinitionId',
                title: 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.PROCESS_DEF_ID'
            },
            {
                key: 'processDefinitionKey',
                title: 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.PROCESS_DEF_KEY'
            }
        ].map((column: {
            key: string;
            type: string;
            title: string;
            sortable: boolean;
            format: string;
        }) => {
            column.sortable = true;
            if (!column.type) {
                column.type = 'text';
            }
            return column;
        })
    }
};
