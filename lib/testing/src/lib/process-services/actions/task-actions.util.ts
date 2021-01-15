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

import { Logger } from '../../core/utils/logger';
import { ApiService } from '../../core/actions/api.service';

export class TaskActionsUtil {

    api: ApiService;

    constructor(api: ApiService) {
        this.api = api;
    }

    async claimTask(taskInstance: string): Promise<any> {
        try {
            return this.api.apiService.activiti.taskActionsApi.claimTask(taskInstance);
        } catch (error) {
            Logger.error('Claim a Task - Service error, Response: ', JSON.parse(JSON.stringify(error)));
        }
    }

    async unclaimTask(taskInstance: string): Promise<any> {
        try {
            return this.api.apiService.activiti.taskActionsApi.unclaimTask(taskInstance);
        } catch (error) {
            Logger.error('Unclaim a Task - Service error, Response: ', JSON.parse(JSON.stringify(error)));
        }
    }

    async completeTask(taskInstance: string): Promise<any> {
        try {
            return this.api.apiService.activiti.taskActionsApi.completeTask(taskInstance);
        } catch (error) {
            Logger.error('Complete Task - Service error, Response: ', JSON.parse(JSON.stringify(error)));
        }
    }
}
