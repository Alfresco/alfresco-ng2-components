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

import { ApiService } from '@alfresco/adf-testing';
import { AppDefinitionRepresentation, ResultListDataRepresentationAppDefinitionRepresentation } from '@alfresco/js-api';

export class AppsRuntimeActions {

    api: ApiService;

    constructor(api: ApiService) {
        this.api = api;
    }

    async getRuntimeAppByName(appName: string): Promise<AppDefinitionRepresentation> {
        const runtimeApps = await this.getRuntimeAppDefinitions();
        let desiredApp;

        for (let i = 0; i < runtimeApps.data.length; i++) {
            if (runtimeApps.data[i].name === appName) {
                desiredApp = runtimeApps.data[i];
            }
        }

        return desiredApp;
    }

    async getRuntimeAppDefinitions(): Promise<ResultListDataRepresentationAppDefinitionRepresentation> {
        return this.api.getInstance().activiti.appsRuntimeApi.getAppDefinitions();
    }

}
