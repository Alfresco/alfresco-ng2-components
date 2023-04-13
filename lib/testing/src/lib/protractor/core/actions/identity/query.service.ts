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

import { ApiService } from '../../../../shared/api/api.service';
import { Logger } from '../../utils/logger';
import { ApiUtil } from '../../../../shared/api/api.util';

export type TaskStatus = 'COMPLETED' | 'CREATED' | 'ASSIGNED' | 'SUSPENDED' | 'CANCELLED' | 'RUNNING';

export class QueryService {

    api: ApiService;

    constructor(api: ApiService) {
        this.api = api;
    }

    async getProcessInstanceTasks(processInstanceId, appName): Promise<any> {
        const predicate = (result: any) => result.list && result.list.entries.length > 0;

        const apiCall = async () => {
            try {
                const path = '/' + appName + '/query/v1/process-instances/' + processInstanceId + '/tasks';
                const method = 'GET';

                const queryParams = {};
                const postBody = {};

                return this.api.performBpmOperation(path, method, queryParams, postBody);
            } catch (error) {
                Logger.error('get process-instances tasks Service error');
            }
        };

        return ApiUtil.waitForApi(apiCall, predicate);
    }

    async getProcessInstance(processInstanceId, appName): Promise<any> {
        const predicate = (result: any) => !!result;

        const apiCall = async () => {
            try {
                const path = '/' + appName + '/query/v1/process-instances/' + processInstanceId;
                const method = 'GET';

                const queryParams = {};
                const postBody = {};

                return this.api.performBpmOperation(path, method, queryParams, postBody);
            } catch (error) {
                Logger.error('get process-instances Service error');
            }
        };

        return ApiUtil.waitForApi(apiCall, predicate);
    }

    async getProcessInstanceSubProcesses(processInstanceId, appName): Promise<any> {
        const predicate = (result: any) => result.list && result.list.entries.length > 0;

        const apiCall = async () => {
            try {
                const path = '/' + appName + '/query/v1/process-instances/' + processInstanceId + '/subprocesses';
                const method = 'GET';

                const queryParams = {};
                const postBody = {};

                return this.api.performBpmOperation(path, method, queryParams, postBody);
            } catch (error) {
                Logger.error('get subprocesses process-instances Service error');
            }
        };

        return ApiUtil.waitForApi(apiCall, predicate);
    }

    async getProcessInstanceTaskByStatus(processInstanceId, appName, taskName, status: TaskStatus): Promise<any> {
        const predicate = (result: any) => !!result;

        const apiCall = async () => {
            try {
                const path = '/' + appName + '/query/v1/process-instances/' + processInstanceId + '/tasks';
                const method = 'GET';

                const queryParams = {};
                const postBody = {};

                const data = await this.api.performBpmOperation(path, method, queryParams, postBody);
                return data.list && data.list.entries.length && data.list.entries.find(task => task.entry.name === taskName && task.entry.status === status);
            } catch (error) {
                Logger.error('get process-instances tasks by status - Service error');
            }
        };

        return ApiUtil.waitForApi(apiCall, predicate);
    }

    async getTaskByStatus(taskName, appName, status: TaskStatus, standalone = false): Promise<any> {
        const predicate = (result: any) => !!result;

        const apiCall = async () => {
            try {
                const path = `/${appName}/query/v1/tasks?standalone=${standalone}&status=${status}&maxItems=1000&skipCount=0&sort=createdDate`;
                const method = 'GET';

                const queryParams = {};
                const postBody = {};

                const data = await this.api.performBpmOperation(path, method, queryParams, postBody);
                // eslint-disable-next-line @typescript-eslint/prefer-for-of
                for (let i = 0; i < data.list.entries.length; i++) {
                    if (data.list.entries[i].entry.name === taskName) {
                        return data.list.entries[i];
                    }
                }

            } catch (error) {
                Logger.error('Get Task By Status - Service error');
            }
        };

        return ApiUtil.waitForApi(apiCall, predicate);
    }

    async getTaskByName(taskName, processInstanceId, appName): Promise<any> {
        const predicate = (result: any) => !!result;

        const apiCall = async () => {
            try {
                const path = '/' + appName + '/query/v1/process-instances/' + processInstanceId + '/tasks';
                const method = 'GET';

                const queryParams = {};
                const postBody = {};

                const data = await this.api.performBpmOperation(path, method, queryParams, postBody);
                // eslint-disable-next-line @typescript-eslint/prefer-for-of
                for (let i = 0; i < data.list.entries.length; i++) {
                    if (data.list.entries[i].entry.name === taskName) {
                        return data.list.entries[i];
                    }
                }

            } catch (error) {
                Logger.error('Get Task By Name - Service error');
            }
        };

        return ApiUtil.waitForApi(apiCall, predicate);
    }

    async getTask(taskName: string, processInstanceId: string, appName: string, status: string, retryCount = 15): Promise<any> {
        const path = '/' + appName + '/query/v1/process-instances/' + processInstanceId + '/tasks';
        const method = 'GET';

        const queryParams = {};
        const postBody = {};

        const data = await this.api.performBpmOperation(path, method, queryParams, postBody);
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < data.list.entries.length; i++) {
            if (data.list.entries[i].entry.name === taskName) {
                const task = data.list.entries[i];

                if (task.entry.status === status) {
                    return task;
                } else if (retryCount > 0) {
                    return this.getTask(taskName, processInstanceId, appName, status, retryCount--);
                } else {
                    return task;
                }
            }
        }
    }

    async getTaskByNameAndStatus(taskName, processInstanceId, appName, status: TaskStatus): Promise<any> {
        const predicate = (result: any) => !!result;

        const apiCall = async () => {
            try {
                return this.getTask(taskName, processInstanceId, appName, status);
            } catch (error) {
                Logger.error('Get Task By Name - Service error');
            }
        };

        return ApiUtil.waitForApi(apiCall, predicate);
    }

    async getProcessInstanceId(processName: string, appName: string): Promise<any> {
        const predicate = (result: any) => !!result;

        const apiCall = async () => {
            try {
                const path = '/' + appName + '/query/v1/process-instances';
                const method = 'GET';
                const queryParams = { name: processName };
                const postBody = {};
                const data = await this.api.performBpmOperation(path, method, queryParams, postBody);
                return data.list.entries && data.list.entries.length > 0 ? data.list.entries[0].entry.id : null;
            } catch (error) {
                Logger.error('Get Process Instance Id - Service error, Response: ', JSON.parse(JSON.stringify(error))?.response?.text);
            }
        };

        return ApiUtil.waitForApi(apiCall, predicate);
    }

    async getProcessInstances(processName: string, appName: string, status?: TaskStatus): Promise<any> {
        const predicate = (result: any) => !!result;

        const apiCall = async () => {
            try {
                const path = '/' + appName + '/query/v1/process-instances';
                const method = 'GET';
                let queryParams;
                if (status) {
                    queryParams = { name: processName, status };
                } else {
                    queryParams = { name: processName };
                }
                const postBody = {};
                const data = await this.api.performBpmOperation(path, method, queryParams, postBody);
                return data.list.entries ?? null;
            } catch (error) {
                Logger.error('Get Process Instances - Service error, Response: ', JSON.parse(JSON.stringify(error))?.response?.text);
            }
        };

        return ApiUtil.waitForApi(apiCall, predicate, 2, 1000);
    }
}
