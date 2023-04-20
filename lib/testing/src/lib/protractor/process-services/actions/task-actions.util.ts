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

import { Logger } from '../../core/utils/logger';
import { ApiService } from '../../../shared/api/api.service';
import { TaskActionsApi } from '@alfresco/js-api';

export class TaskActionsUtil {

    api: ApiService;
    taskActionsApi: TaskActionsApi;

    constructor(apiService: ApiService) {
        this.api = apiService;
        this.taskActionsApi = new TaskActionsApi(apiService.getInstance());
    }

    async claimTask(taskInstance: string): Promise<any> {
        try {
            return this.taskActionsApi.claimTask(taskInstance);
        } catch (error) {
            Logger.error('Claim a Task - Service error, Response: ', JSON.parse(JSON.stringify(error)));
        }
    }

    async unclaimTask(taskInstance: string): Promise<any> {
        try {
            return this.taskActionsApi.unclaimTask(taskInstance);
        } catch (error) {
            Logger.error('Unclaim a Task - Service error, Response: ', JSON.parse(JSON.stringify(error)));
        }
    }

    async completeTask(taskInstance: string): Promise<any> {
        try {
            return this.taskActionsApi.completeTask(taskInstance);
        } catch (error) {
            Logger.error('Complete Task - Service error, Response: ', JSON.parse(JSON.stringify(error)));
        }
    }
}
