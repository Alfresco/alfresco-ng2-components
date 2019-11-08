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
import { Logger } from '../../core/utils/logger';

export class ProcessDefinitionsService {

    api: ApiService;

    constructor(api: ApiService) {
        this.api = api;
    }

    async getProcessDefinitions(appName: string): Promise<any> {
        const path = '/' + appName + '/rb/v1/process-definitions';
        const method = 'GET';

        const queryParams = {};

        try {
            return this.api.performBpmOperation(path, method, queryParams, {});
        } catch (error) {
            if (error.status === 404) {
                Logger.error(`${appName} not present`);
            } else if (error.status === 403) {
                Logger.error(`Access to the requested resource has been denied ${appName}`);
            }
        }
    }

    async getProcessDefinitionByName(processDefinitionName: string, appName: string) {
        const processDefinitions = await this.getProcessDefinitions(appName);
        return processDefinitions.list.entries.find((el) => {
            if (el.entry.name === processDefinitionName) {
                return el;
            }
        });
    }
}
