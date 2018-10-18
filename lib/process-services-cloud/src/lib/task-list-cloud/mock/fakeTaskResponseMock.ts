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

export const fakeTaskCloudList = {
    list: {
        entries: [
            {
                entry: {
                    serviceName: 'maurizio-test-rb',
                    serviceFullName: 'maurizio-test-rb',
                    serviceVersion:  '',
                    appName: 'save-the-cheerleader',
                    appVersion: '',
                    serviceType: null,
                    id: '890b0e1c-c252-11e8-b5c5-0a58646004c7',
                    assignee: null,
                    name: 'SimpleStandaloneTask',
                    description: 'Task description',
                    createdDate: 1538052037711,
                    dueDate: null,
                    claimedDate: null,
                    priority: 0,
                    category: null,
                    processDefinitionId: null,
                    processInstanceId: null,
                    status: 'CREATED',
                    owner: 'superadminuser',
                    parentTaskId: null,
                    lastModified: 1538052037711,
                    lastModifiedTo: null,
                    lastModifiedFrom: null,
                    standAlone: true
                }
            },
            {
                entry: {
                    serviceName: 'maurizio-test-rb',
                    serviceFullName: 'maurizio-test-rb',
                    serviceVersion:  '',
                    appName: 'save-the-cheerleader',
                    appVersion: '',
                    serviceType: null,
                    id: '8962cb0e-c252-11e8-b5c5-0a58646004c7',
                    assignee: null,
                    name: 'SimpleStandaloneTask',
                    description: 'Task description',
                    createdDate: 1538052038286,
                    dueDate: null,
                    claimedDate: null,
                    priority: 0,
                    category: null,
                    processDefinitionId: null,
                    processInstanceId: null,
                    status: 'CREATED',
                    owner: 'superadminuser',
                    parentTaskId: null,
                    lastModified: 1538052038286,
                    lastModifiedTo: null,
                    lastModifiedFrom: null,
                    standAlone: true
                }
            }
        ],
        pagination: {
            skipCount: 0,
            maxItems: 100,
            count: 2,
            hasMoreItems: false,
            totalItems: 2
        }
    }
};

export let fakeGlobalTask = {
    list: {
        entries: [
            {
                entry: {
                    serviceName: 'test-ciprian2-rb',
                    serviceFullName: 'test-ciprian2-rb',
                    serviceVersion: '',
                    appName: 'test-ciprian2',
                    appVersion: '',
                    serviceType: null,
                    id: '11fe013d-c263-11e8-b75b-0a5864600540',
                    assignee: null,
                    name: 'standalone-subtask',
                    description: null,
                    createdDate: 1538059139420,
                    dueDate: null,
                    claimedDate: null,
                    priority: 0,
                    category: null,
                    processDefinitionId: null,
                    processInstanceId: null,
                    status: 'CREATED',
                    owner: 'devopsuser',
                    parentTaskId: '71fda20b-c25b-11e8-b75b-0a5864600540',
                    lastModified: 1538059139420,
                    lastModifiedTo: null,
                    lastModifiedFrom: null,
                    standAlone: true
                }
            }
        ],
        pagination: {
            skipCount: 0,
            maxItems: 100,
            count: 1,
            hasMoreItems: false,
            totalItems: 1
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
