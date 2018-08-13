/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import TestConfig = require('../../test.config');
import AppPublish = require('../../models/APS/AppPublish');
import remote = require('selenium-webdriver/remote');

export class AppsActions {

    async importPublishDeployApp(alfrescoJsApi, appFileLocation) {
        browser.setFileDetector(new remote.FileDetector());

        let pathFile = path.join(TestConfig.main.rootPath + appFileLocation);
        let file = fs.createReadStream(pathFile);

        let appCreated = await alfrescoJsApi.activiti.appsApi.importAppDefinition(file);

        let publishApp = await alfrescoJsApi.activiti.appsApi.publishAppDefinition(appCreated.id, new AppPublish());

        await alfrescoJsApi.activiti.appsApi.deployAppDefinitions({ appDefinitions: [{ id: publishApp.appDefinition.id }] });

        return appCreated;
    }

    async publishDeployApp(alfrescoJsApi, appId) {
        browser.setFileDetector(new remote.FileDetector());

        let publishApp = await alfrescoJsApi.activiti.appsApi.publishAppDefinition(appId, new AppPublish());

        await alfrescoJsApi.activiti.appsApi.deployAppDefinitions({ appDefinitions: [{ id: publishApp.appDefinition.id }] });

        return publishApp;
    }

    async importNewVersionAppDefinitionPublishDeployApp(alfrescoJsApi, appFileLocation, modelId) {
        browser.setFileDetector(new remote.FileDetector());

        let pathFile = path.join(TestConfig.main.rootPath + appFileLocation);
        let file = fs.createReadStream(pathFile);

        let appCreated = await alfrescoJsApi.activiti.appsApi.importNewAppDefinition(modelId, file);

        let publishApp = await alfrescoJsApi.activiti.appsApi.publishAppDefinition(appCreated.id, new AppPublish());

        await alfrescoJsApi.activiti.appsApi.deployAppDefinitions({ appDefinitions: [{ id: publishApp.appDefinition.id }] });

        return appCreated;
    }

    async startProcess(alfrescoJsApi, app, processName?: string) {
        browser.setFileDetector(new remote.FileDetector());

        let appDefinitionsList = await alfrescoJsApi.activiti.appsApi.getAppDefinitions();

        let appDefinition = appDefinitionsList.data.filter((currentApp) => {
            return currentApp.name === app.name;
        });

        let processDefinitionList = await alfrescoJsApi.activiti.processApi.getProcessDefinitions({ deploymentId: appDefinition.deploymentId });

        let startProcessOptions: any = { processDefinitionId: processDefinitionList.data[0].id };

        if (typeof processName !== 'undefined') {
            startProcessOptions.name = processName;
        }

        return await alfrescoJsApi.activiti.processApi.startNewProcessInstance(startProcessOptions);

    }

}
