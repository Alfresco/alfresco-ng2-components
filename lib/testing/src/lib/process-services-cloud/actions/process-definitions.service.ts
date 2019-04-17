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

import { ApiService } from '../../core/actions/api.service';

export class ProcessDefinitionsService {

    api: ApiService;

    constructor(api: ApiService) {
        this.api = api;
    }

    async getProcessDefinitions(appName) {
        const path = '/' + appName + '/rb/v1/process-definitions';
        const method = 'GET';

        const queryParams = {};

        try {
            const data = await this.api.performBpmOperation(path, method, queryParams, {});
            return data;
        } catch (error) {
            if (error.status === 404) {
                // tslint:disable-next-line:no-console
                console.log(`${appName} not present`);
            } else if (error.status === 403) {
                // tslint:disable-next-line:no-console
                console.log(`Access to the requested resource has been denied ${appName}`);
            }
        }
    }
}
