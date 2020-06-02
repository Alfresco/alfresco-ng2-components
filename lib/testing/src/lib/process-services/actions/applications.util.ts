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
import * as remote from 'selenium-webdriver/remote';
import { browser } from 'protractor';
import { ApiService } from '../../core/actions/api.service';
import { AppDefinitionUpdateResultRepresentation } from '@alfresco/js-api';
import path = require('path');
import fs = require('fs');

export class AppPublish {
    comment: string = '';
    force: boolean = true;
}

export class ApplicationsUtil {

    api: ApiService;

    constructor(api: ApiService) {
        this.api = api;
    }

    async getAppDefinitionId(appModelId: number): Promise<number> {
        const appDefinitions = await this.api.getInstance().activiti.appsApi.getAppDefinitions();
        let appDefinitionId = -1;

        appDefinitions.data.forEach((appDefinition) => {
            if (appDefinition.modelId === appModelId) {
                appDefinitionId = appDefinition.id;
            }
        });

        return appDefinitionId;
    }

    async publishDeployApp(appId: number): Promise<AppDefinitionUpdateResultRepresentation> {
        browser.setFileDetector(new remote.FileDetector());

        const publishApp = await this.api.getInstance().activiti.appsApi.publishAppDefinition(appId, new AppPublish());

        await this.api.getInstance().activiti.appsApi.deployAppDefinitions({ appDefinitions: [{ id: publishApp.appDefinition.id }] });

        return publishApp;
    }

    async importPublishDeployApp(appFileLocation: string, option = {}) {
        try {
            const appCreated = await this.importApplication(appFileLocation, option);
            const publishApp = await this.publishDeployApp(appCreated.id);

            await this.api.getInstance().activiti.appsApi.deployAppDefinitions({ appDefinitions: [{ id: publishApp.appDefinition.id }] });
            return appCreated;
        } catch (error) {
            Logger.error('Import Publish Deploy Application - Service error, Response: ', JSON.parse(JSON.stringify(error)).response.text);
        }
    }

    async importNewVersionAppDefinitionPublishDeployApp(appFileLocation: string, modelId: number) {
        browser.setFileDetector(new remote.FileDetector());

        const pathFile = path.join(browser.params.testConfig.main.rootPath + appFileLocation);
        const file = fs.createReadStream(pathFile);

        const appCreated = await this.api.getInstance().activiti.appsApi.importNewAppDefinition(modelId, file);

        const publishApp = await this.api.getInstance().activiti.appsApi.publishAppDefinition(appCreated.id, new AppPublish());

        await this.api.getInstance().activiti.appsApi.deployAppDefinitions({ appDefinitions: [{ id: publishApp.appDefinition.id }] });

        return appCreated;
    }

    async importApplication(appFileLocation: string, options = {}): Promise<any> {
        try {
            browser.setFileDetector(new remote.FileDetector());
            const file = fs.createReadStream(appFileLocation);
            return await this.api.getInstance().activiti.appsDefinitionApi.importAppDefinition(file, options);
        } catch (error) {
            Logger.error('Import Application - Service error, Response: ', JSON.parse(JSON.stringify(error)).response.text);
        }
    }

    async getAppDefinitionByName(appName: string): Promise<any> {
        try {
            const appDefinitionsList = await this.api.getInstance().activiti.appsApi.getAppDefinitions();
            const appDefinition = appDefinitionsList.data.filter((currentApp) => {
                return currentApp.name === appName;
            });
            return appDefinition;
        } catch (error) {
            Logger.error('Get AppDefinitions - Service error, Response: ', JSON.parse(JSON.stringify(error)).response.text);
        }
    }

}
