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

import { Logger } from '../../core/utils/logger';
import { browser } from 'protractor';
import { ApiService } from '../../../shared/api/api.service';
import {
    AppDefinitionRepresentation,
    AppDefinitionsApi,
    RuntimeAppDefinitionsApi,
    AppDefinitionUpdateResultRepresentation
} from '@alfresco/js-api';
import * as path from 'path';
import * as fs from 'fs';

export class AppPublish {
    comment: string = '';
    force: boolean = true;
}

export class ApplicationsUtil {

    api: ApiService;
    appsApi: RuntimeAppDefinitionsApi;
    appDefinitionsApi: AppDefinitionsApi;

    constructor(apiService: ApiService) {
        this.api = apiService;
        this.appsApi = new RuntimeAppDefinitionsApi(apiService.getInstance());
        this.appDefinitionsApi = new AppDefinitionsApi(apiService.getInstance());
    }

    async getAppDefinitionId(appModelId: number): Promise<number> {
        const appDefinitions = await this.appsApi.getAppDefinitions();
        let appDefinitionId = -1;

        appDefinitions.data.forEach((appDefinition) => {
            if (appDefinition.modelId === appModelId) {
                appDefinitionId = appDefinition.id;
            }
        });

        return appDefinitionId;
    }

    async publishDeployApp(appId: number): Promise<AppDefinitionUpdateResultRepresentation> {
        const publishApp = await this.appDefinitionsApi.publishAppDefinition(appId, new AppPublish());

        await this.appsApi.deployAppDefinitions({ appDefinitions: [{ id: publishApp.appDefinition.id }] });

        return publishApp;
    }

    async importPublishDeployApp(appFileLocation: string, option = {}): Promise<any> {
        try {
            const appCreated = await this.importApplication(appFileLocation, option);
            const publishApp = await this.publishDeployApp(appCreated.id);
            await this.appsApi.deployAppDefinitions({ appDefinitions: [{ id: publishApp.appDefinition.id }] });

            return appCreated;
        } catch (error) {
            Logger.error('Import Publish Deploy Application - Service error, Response: ', JSON.stringify(error));
            return {};
        }
    }

    async importNewVersionAppDefinitionPublishDeployApp(appFileLocation: string, modelId: number): Promise<any> {
        const pathFile = path.join(browser.params.testConfig.main.rootPath + appFileLocation);
        const file = fs.createReadStream(pathFile);

        const appCreated = await this.appDefinitionsApi.updateAppDefinition(modelId, file);

        const publishApp = await this.appDefinitionsApi.publishAppDefinition(appCreated.id, new AppPublish());

        await this.appsApi.deployAppDefinitions({ appDefinitions: [{ id: publishApp.appDefinition.id }] });

        return appCreated;
    }

    async importApplication(appFileLocation: string, options = {}): Promise<AppDefinitionRepresentation> {
        try {
            const file = fs.createReadStream(appFileLocation);
            return await this.appDefinitionsApi.importAppDefinition(file, options);
        } catch (error) {
            Logger.error('Import Application - Service error, Response: ', JSON.parse(JSON.stringify(error))?.response?.text);
            return {};
        }
    }

    async getAppDefinitionByName(appName: string): Promise<AppDefinitionRepresentation> {
        try {
            const appDefinitionsList = await this.appsApi.getAppDefinitions();
            return appDefinitionsList.data.find((currentApp) => currentApp.name === appName);
        } catch (error) {
            Logger.error('Get AppDefinitions - Service error, Response: ', JSON.parse(JSON.stringify(error))?.response?.text);
            return {};
        }
    }

}
