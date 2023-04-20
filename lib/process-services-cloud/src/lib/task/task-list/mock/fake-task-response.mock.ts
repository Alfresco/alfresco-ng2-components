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
import { getTaskCloudModelMock } from '../../../mock/task-cloud-model.mock';

export const fakeGlobalTask = getTaskCloudModelMock({
    appName: 'test-ciprian2',
    appVersion: '',
    id: '11fe013d-c263-11e8-b75b-0a5864600540',
    assignee: null,
    name: 'standalone-subtask',
    createdDate: '1538059139420',
    priority: 0,
    processDefinitionId: null,
    processInstanceId: null,
    status: 'CREATED',
    lastModified: '1538059139420',
    standalone: true
});

export const fakeGlobalTasks = {
    list: {
        entries: [fakeGlobalTask],
        pagination: {
            skipCount: 0,
            maxItems: 100,
            count: 1,
            hasMoreItems: false,
            totalItems: 1
        }
    }
};

export const fakeServiceTask = {
    list: {
        entries: [
            {
                activityType: 'serviceTask',
                activityName: 'serviceTaskName',
                appName: 'simpleapp',
                completedDate: '2020-09-22T16:03:37.482+0000',
                elementId: 'ServiceTask_0lszm0x',
                executionId: '2023b099-fced-11ea-b116-62141048995a',
                id: '04fdf69f-4ddd-48ab-9563-da776c9b163c',
                processDefinitionId: 'Process_24rkVVSR:1:0db78dcd-fc14-11ea-bce0-62141048995a',
                processDefinitionKey: 'Process_24rkVVSR',
                processDefinitionVersion: 1,
                processInstanceId: '2023b097-fced-11ea-b116-62141048995a',
                serviceFullName: 'simpleapp-rb',
                serviceName: 'simpleapp-rb',
                serviceVersion: '',
                startedDate: '2020-09-22T16:03:37.444+0000',
                status: 'COMPLETED'
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
