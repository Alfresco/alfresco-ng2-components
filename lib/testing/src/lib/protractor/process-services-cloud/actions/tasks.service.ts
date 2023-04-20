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

import { ApiService } from '../../../shared/api/api.service';
import { Logger } from '../../core/utils/logger';

export class TasksService {

    api: ApiService;

    constructor(api: ApiService) {
        this.api = api;
    }

    async createStandaloneTask(taskName: string, appName: string, options?: any): Promise<any> {
        const path = '/' + appName + '/rb/v1/tasks';
        const method = 'POST';

        const queryParams = {};
        const postBody = {
            name: taskName,
            payloadType: 'CreateTaskPayload',
            ...options
        };

        return this.api.performBpmOperation(path, method, queryParams, postBody)
            .catch((error) => {
                Logger.error('Create Task - Service error, Response: ', JSON.stringify(error?.response?.text));
            });
    }

    async createStandaloneTaskWithForm(taskName: string, appName: string, formKey: string, options?: any): Promise<any> {
        const path = '/' + appName + '/rb/v1/tasks';
        const method = 'POST';

        const queryParams = {};
        const postBody = {
            name: taskName,
            payloadType: 'CreateTaskPayload',
            formKey,
            ...options
        };

        return this.api.performBpmOperation(path, method, queryParams, postBody)
            .catch((error) => {
                Logger.error('Create standalone Task - Service error, Response: ', JSON.stringify(error?.response?.text));
            });
    }

    async completeTask(taskId: string, appName: string): Promise<any> {
        const path = '/' + appName + '/rb/v1/tasks/' + taskId + '/complete';
        const method = 'POST';

        const queryParams = {};
        const postBody = { payloadType: 'CompleteTaskPayload' };

        return this.api.performBpmOperation(path, method, queryParams, postBody)
            .catch((error) => {
                Logger.error('Complete Task - Service error, Response: ', JSON.stringify(error?.response?.text));
            });
    }

    async claimTask(taskId: string, appName: string): Promise<any> {
        const path = '/' + appName + '/rb/v1/tasks/' + taskId + `/claim`;
        const method = 'POST';

        const queryParams = {};
        const postBody = {};

        return this.api.performBpmOperation(path, method, queryParams, postBody)
            .catch((error) => {
                Logger.error('claim Task - Service error, Response: ', JSON.stringify(error?.response?.text));
            });
    }

    async deleteTask(taskId: string, appName: string): Promise<any> {
        const path = '/' + appName + '/rb/v1/tasks/' + taskId;
        const method = 'DELETE';

        const queryParams = {};
        const postBody = {};

        return this.api.performBpmOperation(path, method, queryParams, postBody)
            .catch((error) => {
                Logger.error('delete Task - Service error, Response: ', JSON.stringify(error?.response?.text));
            });
    }

    async createAndCompleteTask(taskName: string, appName: string): Promise<any> {
        const task = await this.createStandaloneTask(taskName, appName);
        await this.claimTask(task.entry.id, appName);
        await this.completeTask(task.entry.id, appName);
        return task;
    }

    async getTask(taskId: string, appName: string): Promise<any> {
        const path = '/' + appName + '/query/v1/tasks/' + taskId;
        const method = 'GET';

        const queryParams = {};
        const postBody = {};

        return this.api.performBpmOperation(path, method, queryParams, postBody)
            .catch((error) => {
                Logger.error('Get Task - Service error, Response: ', JSON.stringify(error?.response?.text));
            });
    }

    async getTaskId(taskName: string, appName: string): Promise<any> {
        const path = '/' + appName + '/query/v1/tasks';
        const method = 'GET';

        const queryParams = { name: taskName };
        const postBody = {};

        const data = await this.api.performBpmOperation(path, method, queryParams, postBody)
            .catch((error) => {
                Logger.error('Get Task Id Service error, Response: ', JSON.stringify(error?.response?.text));
            });
        return data.list.entries && data.list.entries.length > 0 ? data.list.entries[0].entry.id : null;
    }

    async createStandaloneSubtask(parentTaskId: string, appName: string, name: string): Promise<any> {
        const path = '/' + appName + '/rb/v1/tasks';
        const method = 'POST';

        const queryParams = {};
        const postBody = { name, parentTaskId, payloadType: 'CreateTaskPayload' };

        return this.api.performBpmOperation(path, method, queryParams, postBody)
            .catch((error) => {
                Logger.error('Create sub Task - Service error, Response: ', JSON.stringify(error?.response?.text));
            });
    }

}
