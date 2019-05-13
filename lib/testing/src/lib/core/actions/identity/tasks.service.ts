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

import { ApiService } from '../api.service';

export class TasksService {

    api: ApiService;

    constructor(api: ApiService) {
        this.api = api;
    }

    async createStandaloneTask(taskName, appName, options?) {
        try {
            const path = '/' + appName + '/rb/v1/tasks';
            const method = 'POST';

            const queryParams = {}, postBody = {
                'name': taskName,
                'payloadType': 'CreateTaskPayload',
                ...options
            };

            return await this.api.performBpmOperation(path, method, queryParams, postBody);
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.log('Task Service error');
        }
    }

    async completeTask(taskId, appName) {
        try {
            const path = '/' + appName + '/rb/v1/tasks/' + taskId + '/complete';
            const method = 'POST';

            const queryParams = {}, postBody = { 'payloadType': 'CompleteTaskPayload' };

            return await this.api.performBpmOperation(path, method, queryParams, postBody);
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.log('Task Service error');
        }

    }

    async claimTask(taskId, appName, assignee: string = global['TestConfig'].adf.adminEmail) {
        try {
            const path = '/' + appName + '/rb/v1/tasks/' + taskId + `/claim?assignee=${assignee}`;
            const method = 'POST';

            const queryParams = {}, postBody = {};

            return await this.api.performBpmOperation(path, method, queryParams, postBody);
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.log('claim Task Service error');
        }
    }

    async deleteTask(taskId, appName) {
        try {
            const path = '/' + appName + '/rb/v1/tasks/' + taskId;
            const method = 'DELETE';

            const queryParams = {}, postBody = {};

            return await this.api.performBpmOperation(path, method, queryParams, postBody);
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.log('delete task Service error');
        }
    }

    async createAndCompleteTask(taskName, appName, assignee: string = global['TestConfig'].adf.adminEmail) {
        const task = await this.createStandaloneTask(taskName, appName);
        await this.claimTask(task.entry.id, appName, assignee);
        await this.completeTask(task.entry.id, appName);
        return task;
    }

    async getTask(taskId, appName) {
        try {
            const path = '/' + appName + '/query/v1/tasks/' + taskId;
            const method = 'GET';

            const queryParams = {}, postBody = {};

            return await this.api.performBpmOperation(path, method, queryParams, postBody);
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.log('get Task Service error');
        }
    }

    async getTaskId(taskName, appName) {
        try {
            const path = '/' + appName + '/query/v1/tasks';
            const method = 'GET';

            const queryParams = { name: taskName }, postBody = {};

            const data = await this.api.performBpmOperation(path, method, queryParams, postBody);
            return data.list.entries && data.list.entries.length > 0 ? data.list.entries[0].entry.id : null;
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.log('get Task Service error');
        }
    }

    async createStandaloneSubtask(parentTaskId, appName, name) {
        try {
            const path = '/' + appName + '/rb/v1/tasks';
            const method = 'POST';

            const queryParams = {},
                postBody = { 'name': name, 'parentTaskId': parentTaskId, 'payloadType': 'CreateTaskPayload' };

            return await this.api.performBpmOperation(path, method, queryParams, postBody);
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.log('create Task Service error');
        }
    }

}
