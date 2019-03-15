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

export class ProcessInstances {

    api: ApiService = new ApiService();

    constructor() {
    }

    async init(username, password) {
        await this.api.login(username, password);
    }

    async createProcessInstance(processDefKey, appName, options?) {
        const path = '/' + appName + '-rb/v1/process-instances';
        const method = 'POST';

        const queryParams = {}, postBody = {
            'processDefinitionKey': processDefKey,
            'payloadType': 'StartProcessPayload',
            ...options
        };

        const data = await this.api.performBpmOperation(path, method, queryParams, postBody);
        return data;
    }

    async suspendProcessInstance(processInstanceId, appName) {
        const path = '/' + appName + '-rb/v1/process-instances/' + processInstanceId + '/suspend';
        const method = 'POST';

        const queryParams = {}, postBody = {};

        const data = await this.api.performBpmOperation(path, method, queryParams, postBody);
        return data;
    }

    async deleteProcessInstance(processInstanceId, appName) {
        const path = '/' + appName + '-rb/v1/process-instances/' + processInstanceId;
        const method = 'DELETE';

        const queryParams = {}, postBody = {};

        const data = await this.api.performBpmOperation(path, method, queryParams, postBody);
        return data;
    }

    async completeProcessInstance(processInstanceId, appName) {
        const path = '/' + appName + '-rb/v1/process-instances/' + processInstanceId + '/complete';
        const method = 'POST';

        const queryParams = {}, postBody = {};

        const data = await this.api.performBpmOperation(path, method, queryParams, postBody);
        return data;
    }
}
