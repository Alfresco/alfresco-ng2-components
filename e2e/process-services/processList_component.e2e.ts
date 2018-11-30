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

import { LoginPage } from '../pages/adf/loginPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ProcessListDemoPage } from '../pages/adf/process_services/processListDemoPage';

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { AppsActions } from '../actions/APS/apps.actions';
import { UsersActions } from '../actions/users.actions';
import { browser } from 'protractor';

describe('Process List Test', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const processListDemoPage = new ProcessListDemoPage();

    let appWithDateField = resources.Files.APP_WITH_DATE_FIELD_FORM;
    let appWithUserWidget = resources.Files.APP_WITH_USER_WIDGET;
    let appDateModel, appUserWidgetModel, user;

    let processName = {
        procWithDate: 'Process With Date',
        secondProcWithDate: 'Process With Date 2',
        procWithUserWidget: 'Process With User Widget',
        secondProcWithUserWidget: 'Process With User Widget 2'
    };

    let errorMessages = {
        appIdNumber: 'App ID must be a number',
        insertAppId: 'Insert App ID'
    };

    beforeAll(async (done) => {
        let apps = new AppsActions();
        let users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        user = await users.createTenantAndUser(this.alfrescoJsApi);

        await this.alfrescoJsApi.login(user.email, user.password);

        appDateModel = await apps.importPublishDeployApp(this.alfrescoJsApi, appWithDateField.file_location);

        await apps.startProcess(this.alfrescoJsApi, appDateModel, processName.procWithDate);
        await apps.startProcess(this.alfrescoJsApi, appDateModel, processName.secondProcWithDate);

        appUserWidgetModel = await apps.importPublishDeployApp(this.alfrescoJsApi, appWithUserWidget.file_location);

        await apps.startProcess(this.alfrescoJsApi, appUserWidgetModel, processName.procWithUserWidget);
        await apps.startProcess(this.alfrescoJsApi, appUserWidgetModel, processName.secondProcWithUserWidget);

        await loginPage.loginToProcessServicesUsingUserModel(user);

        done();
    });

    afterEach(async (done) => {
        processListDemoPage.clickResetButton();

        done();
    });

    afterAll(async (done) => {
        await this.alfrescoJsApi.activiti.modelsApi.deleteModel(appDateModel.id);
        await this.alfrescoJsApi.activiti.modelsApi.deleteModel(appUserWidgetModel.id);

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(user.tenantId);

        done();
    });

    xit('[C282006] Should be able to filter processes with App ID', () => {
        navigationBarPage.clickProcessListButton();

        processListDemoPage.clickResetButton();
        processListDemoPage.addAppId('a');

        processListDemoPage.checkErrorMessageIsDisplayed(errorMessages.appIdNumber);
        processListDemoPage.clickResetButton();

        processListDemoPage.checkErrorMessageIsDisplayed(errorMessages.insertAppId);

        processListDemoPage.clickResetButton();
        processListDemoPage.addAppId('12345');

        processListDemoPage.checkNoProcessFoundIsDisplayed();

        // valid appId is needed
        processListDemoPage.addAppId();

        processListDemoPage.checkProcessIsDisplayed(processName.procWithDate);
        processListDemoPage.checkProcessIsDisplayed(processName.secondProcWithDate);
    });

    xit('[C282015] Should be able to filter by Process Definition ID', () => {
        navigationBarPage.clickProcessListButton();

        // valid appId is needed
        processListDemoPage.addAppId();

        processListDemoPage.addProcessDefinitionId();

        browser.sleep(30000);
    });
});
