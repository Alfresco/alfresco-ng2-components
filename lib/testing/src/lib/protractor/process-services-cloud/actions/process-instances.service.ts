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

export class ProcessInstancesService {

    api: ApiService;

    constructor(api: ApiService) {
        this.api = api;
    }

    async createProcessInstance(processDefKey, appName, options?: any) {
        try {
            const path = '/' + appName + '/rb/v1/process-instances';
            const method = 'POST';

            const queryParams = {};
            const postBody = {
                processDefinitionKey: processDefKey,
                payloadType: 'StartProcessPayload',
                ...options
            };

            return this.api.performBpmOperation(path, method, queryParams, postBody);

        } catch (error) {
            // eslint-disable-next-line no-console
            Logger.error('create process-instances Service not working', error.message);
        }

    }

    async suspendProcessInstance(processInstanceId, appName) {
        try {
            const path = '/' + appName + '/rb/v1/process-instances/' + processInstanceId + '/suspend';
            const method = 'POST';

            const queryParams = {};
            const postBody = {};

            return this.api.performBpmOperation(path, method, queryParams, postBody);

        } catch (error) {
            // eslint-disable-next-line no-console
            Logger.error('suspend process-instances Service not working', error.message);
        }
    }

    async deleteProcessInstance(processInstanceId, appName) {
        try {
            const path = '/' + appName + '/rb/v1/process-instances/' + processInstanceId;
            const method = 'DELETE';
            const queryParams = {};
            const postBody = {};

            return this.api.performBpmOperation(path, method, queryParams, postBody);

        } catch (error) {
            // eslint-disable-next-line no-console
            Logger.error('delete process-instances Service not working', error.message);
        }
    }

    async completeProcessInstance(processInstanceId, appName) {
        try {
            const path = '/' + appName + '/rb/v1/process-instances/' + processInstanceId + '/complete';
            const method = 'POST';
            const queryParams = {};
            const postBody = {};

            return this.api.performBpmOperation(path, method, queryParams, postBody);

        } catch (error) {
            // eslint-disable-next-line no-console
            Logger.error('complete process-instances Service not working', error.message);
        }
    }
}
