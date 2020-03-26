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
import * as remote from 'selenium-webdriver/remote';
import { browser } from 'protractor';
import * as fs from 'fs';

export class AppPublish {
    comment: string = '';
    force: boolean = true;
}

export class ApplicationService {

    api: ApiService;

    constructor(api: ApiService) {
        this.api = api;
    }

    async importPublishDeployApp(appFileLocation, option = {}) {
        try{
            const appCreated = await this.importApplication(appFileLocation, option);
            const publishApp = await this.api.apiService.activiti.appsApi.publishAppDefinition(appCreated.id, new AppPublish());
            await this.api.apiService.activiti.appsApi.deployAppDefinitions({ appDefinitions: [{ id: publishApp.appDefinition.id }] });
            return appCreated;
        } catch (error) {
            Logger.error('Import Publish Deploy Application - Service error, Response: ', JSON.parse(JSON.stringify(error)).response.text);
        }
    }

    async importApplication(appFileLocation, options = {}): Promise<any> {
        try {
            browser.setFileDetector(new remote.FileDetector());
            const file = fs.createReadStream(appFileLocation);
            return await this.api.apiService.activiti.appsDefinitionApi.importAppDefinition(file, options);
        } catch (error) {
            Logger.error('Import Application - Service error, Response: ', JSON.parse(JSON.stringify(error)).response.text);
        }
    }
}
