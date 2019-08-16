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

import { browser } from 'protractor';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../actions/users.actions';
import { ProcessServicesPage } from '../pages/adf/process-services/processServicesPage';
import resources = require('../util/resources');
import { AppsActions } from '../actions/APS/apps.actions';
import { LoginPage } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ProcessServiceTabBarPage } from '../pages/adf/process-services/processServiceTabBarPage';
import { ProcessListPage } from '../pages/adf/process-services/processListPage';
import { ProcessDetailsPage } from '../pages/adf/process-services/processDetailsPage';
import dateFormat = require('dateformat');

describe('Process Instance Details', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const processServicesPage = new ProcessServicesPage();
    const processServiceTabBarPage = new ProcessServiceTabBarPage();
    const processListPage = new ProcessListPage();
    const processDetailsPage = new ProcessDetailsPage();

    let appModel, process, user;
    const app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    const PROCESS_DATE_FORMAT = 'mmm d, yyyy';

    beforeAll(async () => {
        const apps = new AppsActions();
        const users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        user = await users.createTenantAndUser(this.alfrescoJsApi);

        await this.alfrescoJsApi.login(user.email, user.password);

        appModel = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);
        const processModel = await apps.startProcess(this.alfrescoJsApi, appModel, 'process');

        await loginPage.loginToProcessServicesUsingUserModel(user);

        await navigationBarPage.navigateToProcessServicesPage();
        await processServicesPage.checkApsContainer();
        await processServicesPage.goToApp(app.title);
        await processServiceTabBarPage.clickProcessButton();
        await processListPage.checkProcessListIsDisplayed();

        process = await this.alfrescoJsApi.activiti.processApi.getProcessInstance(processModel.id);

    });

    afterAll(async () => {
        await this.alfrescoJsApi.activiti.modelsApi.deleteModel(appModel.id);
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(user.tenantId);

    });

    it('[C307031] Should display the created date in the default format', async () => {
        await processDetailsPage.checkDetailsAreDisplayed();
        await expect(await processDetailsPage.getCreated()).toEqual(dateFormat(process.started, PROCESS_DATE_FORMAT));
    });

});
