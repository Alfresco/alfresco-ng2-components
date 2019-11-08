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
import { Logger } from '../../utils/logger';

export class TasksService {

    api: ApiService;

    constructor(api: ApiService) {
        this.api = api;
    }

    async createStandaloneTask(taskName: string, appName: string, options?: Object): Promise<any> {
        try {
            const path = '/' + appName + '/rb/v1/tasks';
            const method = 'POST';

            const queryParams = {}, postBody = {
                name: taskName,
                payloadType: 'CreateTaskPayload',
                ...options
            };

            return this.api.performBpmOperation(path, method, queryParams, postBody);
        } catch (error) {
            Logger.error('Create Task - Service error, Response: ', JSON.parse(JSON.stringify(error)));
        }
    }

    async createStandaloneTaskWithForm(taskName: string, appName: string, formKey: string, options?: Object): Promise<any> {
        try {
            const path = '/' + appName + '/rb/v1/tasks';
            const method = 'POST';

            const queryParams = {};
            const postBody = {
                name: taskName,
                payloadType: 'CreateTaskPayload',
                formKey: formKey,
                ...options
            };

            return this.api.performBpmOperation(path, method, queryParams, postBody);
        } catch (error) {
            Logger.error('Create FormTask - Service error, Response: ', JSON.parse(JSON.stringify(error)));
        }
    }

    async completeTask(taskId: string, appName: string): Promise<any> {
        try {
            const path = '/' + appName + '/rb/v1/tasks/' + taskId + '/complete';
            const method = 'POST';

            const queryParams = {}, postBody = { payloadType: 'CompleteTaskPayload' };

            return this.api.performBpmOperation(path, method, queryParams, postBody);
        } catch (error) {
            Logger.error('Complete Task - Service error, Response: ', JSON.parse(JSON.stringify(error)).response.text);
        }

    }

    async claimTask(taskId: string, appName: string): Promise<any> {
        try {
            const path = '/' + appName + '/rb/v1/tasks/' + taskId + `/claim`;
            const method = 'POST';

            const queryParams = {};
            const postBody = {};

            return this.api.performBpmOperation(path, method, queryParams, postBody);
        } catch (error) {
            Logger.error('Claim Task - Service error, Response: ', JSON.parse(JSON.stringify(error)).response.text);
        }
    }

    async deleteTask(taskId: string, appName: string): Promise<any> {
        try {
            const path = '/' + appName + '/rb/v1/tasks/' + taskId;
            const method = 'DELETE';

            const queryParams = {};
            const postBody = {};

            return this.api.performBpmOperation(path, method, queryParams, postBody);
        } catch (error) {
            Logger.error('Delete Task - Service error, Response: ', JSON.parse(JSON.stringify(error)).response.text);
        }
    }

    async createAndCompleteTask(taskName: string, appName: string): Promise<any> {
        const task = await this.createStandaloneTask(taskName, appName);
        await this.claimTask(task.entry.id, appName);
        await this.completeTask(task.entry.id, appName);
        return task;
    }

    async getTask(taskId: string, appName: string): Promise<any> {
        try {
            const path = '/' + appName + '/query/v1/tasks/' + taskId;
            const method = 'GET';

            const queryParams = {};
            const postBody = {};

            return this.api.performBpmOperation(path, method, queryParams, postBody);
        } catch (error) {
            Logger.error('Get Task - Service error, Response: ', JSON.parse(JSON.stringify(error)).response.text);
        }
    }

    async getTaskId(taskName: string, appName: string): Promise<any> {
        try {
            const path = '/' + appName + '/query/v1/tasks';
            const method = 'GET';

            const queryParams = { name: taskName }, postBody = {};

            const data = await this.api.performBpmOperation(path, method, queryParams, postBody);
            return data.list.entries && data.list.entries.length > 0 ? data.list.entries[0].entry.id : null;
        } catch (error) {
            Logger.error('Get Task Id - Service error, Response: ', JSON.parse(JSON.stringify(error)).response.text);
        }
    }

    async createStandaloneSubtask(parentTaskId: string, appName: string, name: string): Promise<any> {
        try {
            const path = '/' + appName + '/rb/v1/tasks';
            const method = 'POST';

            const queryParams = {},
                postBody = { name: name, parentTaskId: parentTaskId, payloadType: 'CreateTaskPayload' };

            return this.api.performBpmOperation(path, method, queryParams, postBody);
        } catch (error) {
            Logger.error('Create Task - Service error, Response: ', JSON.parse(JSON.stringify(error)).response.text);
        }
    }

}
