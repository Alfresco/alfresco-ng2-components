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

import { ApiService } from './apiservice';

export class Tasks {

    api: ApiService = new ApiService();

    constructor() {
    }

    async init(username, password) {
        await this.api.login(username, password);
    }

    async createStandaloneTask(taskName, appName, options?) {
        const path = '/' + appName + '-rb/v1/tasks';
        const method = 'POST';

        const queryParams = {}, postBody = {
            'name': taskName,
            'payloadType': 'CreateTaskPayload',
            ...options
        };

        const data = await this.api.performBpmOperation(path, method, queryParams, postBody);
        return data;
    }

    async completeTask(taskId, appName) {
        const path = '/' + appName + '-rb/v1/tasks/' + taskId + '/complete';
        const method = 'POST';

        const queryParams = {}, postBody = {'payloadType': 'CompleteTaskPayload'};

        const data = await this.api.performBpmOperation(path, method, queryParams, postBody);
        return data;
    }

    async claimTask(taskId, appName) {
        const path = '/' + appName + '-rb/v1/tasks/' + taskId + '/claim';
        const method = 'POST';

        const queryParams = {}, postBody = {};

        const data = await this.api.performBpmOperation(path, method, queryParams, postBody);
        return data;
    }

    async deleteTask(taskId, appName) {
        const path = '/' + appName + '-rb/v1/tasks/' + taskId;
        const method = 'DELETE';

        const queryParams = {}, postBody = {};

        const data = await this.api.performBpmOperation(path, method, queryParams, postBody);
        return data;
    }

    async createAndCompleteTask (taskName, appName) {
        let task = await this.createStandaloneTask(taskName, appName);
        await this.claimTask(task.entry.id, appName);
        await this.completeTask(task.entry.id, appName);
        return task;
    }

    async getTask(taskId, appName) {
        const path = '/' + appName + '-query/v1/tasks/' + taskId;
        const method = 'GET';

        const queryParams = {}, postBody = {};

        const data = await this.api.performBpmOperation(path, method, queryParams, postBody);
        return data;
    }

    async createStandaloneSubtask(parentTaskId, appName, name) {
        const path = '/' + appName + '-rb/v1/tasks';
        const method = 'POST';

        const queryParams = {}, postBody = {'name': name, 'parentTaskId': parentTaskId, 'payloadType': 'CreateTaskPayload'};

        const data = await this.api.performBpmOperation(path, method, queryParams, postBody);
        return data;
    }

}
