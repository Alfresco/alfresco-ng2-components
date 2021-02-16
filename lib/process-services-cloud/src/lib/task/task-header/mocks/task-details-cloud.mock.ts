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

import { TaskDetailsCloudModel } from '../../start-task/models/task-details-cloud.model';

export const taskDetailsWithParentTaskIdMock: TaskDetailsCloudModel = {
    'appName': 'task-app',
    'appVersion': 1,
    'id': '68d54a8f-01f3-11e9-8e36-0a58646002ad',
    'assignee': 'AssignedTaskUser',
    'name': 'This is a parent task name ',
    'description': 'This is the description ',
    'createdDate': new Date(1545048055900),
    'dueDate': new Date(),
    'claimedDate': null,
    'priority': 5,
    'category': null,
    'processDefinitionId': null,
    'processInstanceId': null,
    'status': 'ASSIGNED',
    'owner': 'ownerUser',
    'parentTaskId': 'mock-parent-task-id',
    'formKey': null,
    'lastModified': new Date(1545048055900),
    'lastModifiedTo': null,
    'lastModifiedFrom': null,
    'standalone': true
};

export const assignedTaskDetailsCloudMock: TaskDetailsCloudModel = {
    'appName': 'task-app',
    'appVersion': 1,
    'id': '68d54a8f-01f3-11e9-8e36-0a58646002ad',
    'assignee': 'AssignedTaskUser',
    'name': 'This is a new task',
    'description': 'This is the description ',
    'createdDate': new Date(1545048055900),
    'dueDate': new Date(),
    'claimedDate': null,
    'priority': 1,
    'category': null,
    'processDefinitionId': null,
    'processInstanceId': null,
    'status': 'ASSIGNED',
    'owner': 'ownerUser',
    'parentTaskId': null,
    'formKey': null,
    'lastModified': new Date(1545048055900),
    'lastModifiedTo': null,
    'lastModifiedFrom': null,
    'standalone': true
};

export const createdTaskDetailsCloudMock: TaskDetailsCloudModel = {
    'appName': 'task-app',
    'appVersion': 1,
    'id': '68d54a8f-01f3-11e9-8e36-0a58646002ad',
    'assignee': 'CreatedTaskUser',
    'name': 'This is a new task',
    'description': 'This is the description ',
    'createdDate': new Date(1545048055900),
    'dueDate': new Date(1545091200000),
    'claimedDate': null,
    'priority': 5,
    'category': null,
    'processDefinitionId': null,
    'processInstanceId': null,
    'status': 'CREATED',
    'owner': 'ownerUser',
    'parentTaskId': null,
    'formKey': null,
    'lastModified': new Date(1545048055900),
    'lastModifiedTo': null,
    'lastModifiedFrom': null,
    'standalone': true
};

export const emptyOwnerTaskDetailsCloudMock: TaskDetailsCloudModel = {
    'appName': 'task-app',
    'appVersion': 1,
    'id': '68d54a8f-01f3-11e9-8e36-0a58646002ad',
    'assignee': 'AssignedTaskUser',
    'name': 'This is a new task',
    'description': 'This is the description ',
    'createdDate': new Date(1545048055900),
    'dueDate': new Date(1545091200000),
    'claimedDate': null,
    'priority': 5,
    'category': null,
    'processDefinitionId': null,
    'processInstanceId': null,
    'status': 'ASSIGNED',
    'owner': null,
    'parentTaskId': null,
    'formKey': null,
    'lastModified': new Date(1545048055900),
    'lastModifiedTo': null,
    'lastModifiedFrom': null,
    'standalone': true
};

export const createdStateTaskDetailsCloudMock: TaskDetailsCloudModel = {
    'appName': 'mock-app-name',
    'appVersion': 1,
    'id': 'mock-task-id',
    'assignee': '',
    'name': 'This is a new task',
    'description': 'This is the description ',
    'createdDate': new Date(1545048055900),
    'dueDate': new Date(1545091200000),
    'claimedDate': null,
    'priority': 5,
    'category': null,
    'processDefinitionId': null,
    'processInstanceId': null,
    'status': 'CREATED',
    'owner': 'ownerUser',
    'parentTaskId': null,
    'formKey': null,
    'lastModified': new Date(1545048055900),
    'lastModifiedTo': null,
    'lastModifiedFrom': null,
    'standalone': false
};

export const completedTaskDetailsCloudMock: TaskDetailsCloudModel = {
    'appName': 'mock-app-name',
    'appVersion': 1,
    'id': 'mock-task-id',
    'assignee': 'CompletedTaskAssignee',
    'name': 'This is a new task',
    'description': 'This is the description ',
    'createdDate': new Date(1545048055900),
    'dueDate': new Date(1545091200000),
    'claimedDate': null,
    'priority': 5,
    'category': null,
    'processDefinitionId': null,
    'processInstanceId': null,
    'status': 'COMPLETED',
    'owner': 'ownerUser',
    'parentTaskId': null,
    'formKey': null,
    'lastModified': new Date(1545048055900),
    'lastModifiedTo': null,
    'lastModifiedFrom': null,
    'standalone': false
};

export const cancelledTaskDetailsCloudMock: TaskDetailsCloudModel = {
    'appName': 'mock-app-name',
    'appVersion': 1,
    'id': 'mock-task-id',
    'assignee': 'CancelledTaskAssignee',
    'name': 'This is a new task',
    'description': 'This is the description ',
    'createdDate': new Date(1545048055900),
    'dueDate': new Date(1545091200000),
    'claimedDate': null,
    'priority': 5,
    'category': null,
    'processDefinitionId': null,
    'processInstanceId': null,
    'status': 'CANCELLED',
    'owner': 'ownerUser',
    'parentTaskId': null,
    'formKey': null,
    'lastModified': new Date(1545048055900),
    'lastModifiedTo': null,
    'lastModifiedFrom': null,
    'standalone': true
};

export const suspendedTaskDetailsCloudMock: TaskDetailsCloudModel = {
    'appName': 'mock-app-name',
    'appVersion': 1,
    'id': 'mock-task-id',
    'assignee': 'SuspendedTaskAssignee',
    'name': 'This is a new task',
    'description': 'This is the description ',
    'createdDate': new Date(1545048055900),
    'dueDate': new Date(1545091200000),
    'claimedDate': null,
    'priority': 5,
    'category': null,
    'processDefinitionId': null,
    'processInstanceId': null,
    'status': 'SUSPENDED',
    'owner': 'ownerUser',
    'parentTaskId': null,
    'formKey': null,
    'lastModified': new Date(1545048055900),
    'lastModifiedTo': null,
    'lastModifiedFrom': null,
    'standalone': true
};
