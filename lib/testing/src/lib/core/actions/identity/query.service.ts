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

export class QueryService {

    api: ApiService;

    constructor(api: ApiService) {
        this.api = api;
    }

    async getProcessInstanceTasks(processInstanceId, appName): Promise<any> {
        try {
            const path = '/' + appName + '/query/v1/process-instances/' + processInstanceId + '/tasks';
            const method = 'GET';

            const queryParams = {}, postBody = {};

            return this.api.performBpmOperation(path, method, queryParams, postBody);
        } catch (error) {
            Logger.error('get process-instances Service error');
        }
    }

    async getProcessInstance(processInstanceId, appName): Promise<any> {
        try {
            const path = '/' + appName + '/query/v1/process-instances/' + processInstanceId;
            const method = 'GET';

            const queryParams = {}, postBody = {};

            return this.api.performBpmOperation(path, method, queryParams, postBody);
        } catch (error) {
            Logger.error('get process-instance Service error');
        }
    }

    async getProcessInstanceSubProcesses(processInstanceId, appName): Promise<any> {
        try {
            const path = '/' + appName + '/query/v1/process-instances/' + processInstanceId + '/subprocesses';
            const method = 'GET';

            const queryParams = {};

            return this.api.performBpmOperation(path, method, queryParams, {});
        } catch (error) {
            Logger.error('get subprocesses process-instances Service error');
        }
    }

    async getTaskByName(taskName, processInstanceId, appName): Promise<any> {
        try {
            const path = '/' + appName + '/query/v1/process-instances/' + processInstanceId + '/tasks';
            const method = 'GET';

            const queryParams = {}, postBody = {};

            const data = await this.api.performBpmOperation(path, method, queryParams, postBody);
            for (let i = 0; i < data.list.entries.length; i++) {
                if (data.list.entries[i].entry.name === taskName) {
                    return data.list.entries[i];
                }
            }
        } catch (error) {
            Logger.error('Get Task By Name - Service error');
        }
    }

    async getProcessInstanceId(processName: string, appName: string): Promise<any> {
        try {
            const path = '/' + appName + '/query/v1/process-instances';
            const method = 'GET';

            const queryParams = { name: processName }, postBody = {};

            const data = await this.api.performBpmOperation(path, method, queryParams, postBody);
            return data.list.entries && data.list.entries.length > 0 ? data.list.entries[0].entry.id : null;
        } catch (error) {
            Logger.error('Get Process Instance Id - Service error, Response: ', JSON.parse(JSON.stringify(error)).response.text);
        }
    }

}
