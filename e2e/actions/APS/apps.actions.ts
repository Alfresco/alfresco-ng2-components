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

import path = require('path');
import fs = require('fs');
import AppPublish = require('../../models/APS/AppPublish');
import remote = require('selenium-webdriver/remote');
import { browser } from 'protractor';
import { ApiService } from '@alfresco/adf-testing';
import { AppDefinitionUpdateResultRepresentation } from '@alfresco/js-api';

export class AppsActions {

    api: ApiService;

    constructor(alfrescoApi: ApiService) {
        this.api = alfrescoApi;
    }

    async getProcessTaskId(processId: string): Promise<string> {
        const taskList = await this.api.getInstance().activiti.taskApi.listTasks({});
        let taskId = '-1';

        taskList.data.forEach((task) => {
            if (task.processInstanceId === processId) {
                taskId = task.id;
            }
        });

        return taskId;
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

    async importNewVersionAppDefinitionPublishDeployApp(appFileLocation: string, modelId: number) {
        browser.setFileDetector(new remote.FileDetector());

        const pathFile = path.join(browser.params.testConfig.main.rootPath + appFileLocation);
        const file = fs.createReadStream(pathFile);

        const appCreated = await this.api.getInstance().activiti.appsApi.importNewAppDefinition(modelId, file);

        const publishApp = await this.api.getInstance().activiti.appsApi.publishAppDefinition(appCreated.id, new AppPublish());

        await this.api.getInstance().activiti.appsApi.deployAppDefinitions({ appDefinitions: [{ id: publishApp.appDefinition.id }] });

        return appCreated;
    }
}
