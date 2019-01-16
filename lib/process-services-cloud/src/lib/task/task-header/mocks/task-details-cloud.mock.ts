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

import { TaskDetailsCloudModel } from '../../start-task/models/task-details-cloud.model';

export const taskDetailsCloudMock = new TaskDetailsCloudModel(
    {
        'serviceName': 'task-app-rb',
        'serviceFullName': 'task-app-rb',
        'serviceVersion': '',
        'appName': 'task-app',
        'appVersion': '',
        'serviceType': null,
        'id': '68d54a8f-01f3-11e9-8e36-0a58646002ad',
        'assignee': 'Wilbur Adams',
        'name': 'This is a new task ',
        'description': 'This is the description ',
        'createdDate': 1545048055900,
        'dueDate': 1545091200000,
        'claimedDate': null,
        'priority': 5,
        'category': null,
        'processDefinitionId': null,
        'processInstanceId': null,
        'status': 'ASSIGNED',
        'owner': 'superadminuser',
        'parentTaskId': null,
        'formKey': null,
        'lastModified': 1545048055900,
        'lastModifiedTo': null,
        'lastModifiedFrom': null,
        'standAlone': true
    }
);
