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

import TestConfig = require('../test.config');
import resources = require('../util/resources');
import { LoginPage, BrowserActions } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';

import { ProcessServicesPage } from '../pages/adf/process-services/processServicesPage';
import { StartProcessPage } from '../pages/adf/process-services/startProcessPage';
import { ProcessFiltersPage } from '../pages/adf/process-services/processFiltersPage';
import { ProcessServiceTabBarPage } from '../pages/adf/process-services/processServiceTabBarPage';
import { ProcessDetailsPage } from '../pages/adf/process-services/processDetailsPage';
import { ProcessListPage } from '../pages/adf/process-services/processListPage';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';

import { AppsActions } from '../actions/APS/apps.actions';
import { UsersActions } from '../actions/users.actions';
import { browser } from 'protractor';

describe('Process Filters Test', () => {

    const loginPage = new LoginPage();
    const processListPage = new ProcessListPage();
    const navigationBarPage = new NavigationBarPage();
    const processServicesPage = new ProcessServicesPage();
    const startProcessPage = new StartProcessPage();
    const processFiltersPage = new ProcessFiltersPage();
    const processServiceTabBarPage = new ProcessServiceTabBarPage();
    const processDetailsPage = new ProcessDetailsPage();
    let appModel;

    const app = resources.Files.APP_WITH_DATE_FIELD_FORM;

    const processTitle = {
        running: 'Test_running',
        completed: 'Test_completed'
    };
    const processFilter = {
        running: 'Running',
        all: 'All',
        completed: 'Completed'
    };

    beforeAll(async (done) => {
        const apps = new AppsActions();
        const users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        const user = await users.createTenantAndUser(this.alfrescoJsApi);

        await this.alfrescoJsApi.login(user.email, user.password);

        appModel = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

        await loginPage.loginToProcessServicesUsingUserModel(user);

        done();
    });

    beforeEach(async () => {
        navigationBarPage.navigateToProcessServicesPage();
        processServicesPage.checkApsContainer();
    });

    it('[C260387] Should the running process be displayed when clicking on Running filter', () => {
        processServicesPage.goToApp(app.title);
        processServiceTabBarPage.clickProcessButton();
        processListPage.checkProcessListIsDisplayed();

        processFiltersPage.clickCreateProcessButton();
        processFiltersPage.clickNewProcessDropdown();

        startProcessPage.enterProcessName(processTitle.completed);
        startProcessPage.selectFromProcessDropdown(app.process_title);
        startProcessPage.clickFormStartProcessButton();

        processDetailsPage.clickCancelProcessButton();
        navigationBarPage.navigateToProcessServicesPage();

        processServicesPage.goToApp(app.title);

        processServiceTabBarPage.clickProcessButton();

        processFiltersPage.clickCreateProcessButton();
        processFiltersPage.clickNewProcessDropdown();

        startProcessPage.enterProcessName(processTitle.running);
        startProcessPage.selectFromProcessDropdown(app.process_title);
        startProcessPage.clickFormStartProcessButton();

        processFiltersPage.checkFilterIsHighlighted(processFilter.running);
        processFiltersPage.selectFromProcessList(processTitle.running);

        processDetailsPage.checkProcessDetailsCard();
    });

    it('[C280063] Should both the new created process and a completed one to be displayed when clicking on All filter', () => {
        processServicesPage.goToApp(app.title);
        processServiceTabBarPage.clickProcessButton();
        processListPage.checkProcessListIsDisplayed();

        processFiltersPage.clickAllFilterButton();
        processFiltersPage.checkFilterIsHighlighted(processFilter.all);
        processFiltersPage.selectFromProcessList(processTitle.running);
        processFiltersPage.selectFromProcessList(processTitle.completed);
        processDetailsPage.checkProcessDetailsCard();
    });

    it('[C280064] Should the completed process be displayed when clicking on Completed filter', () => {
        processServicesPage.goToApp(app.title);
        processServiceTabBarPage.clickProcessButton();
        processListPage.checkProcessListIsDisplayed();

        processFiltersPage.clickCompletedFilterButton();
        processFiltersPage.checkFilterIsHighlighted(processFilter.completed);
        processFiltersPage.selectFromProcessList(processTitle.completed);
        processDetailsPage.checkProcessDetailsCard();
    });

    it('[C280407] Should be able to access the filters with URL', async () => {

        const defaultFiltersNumber = 3;
        let deployedApp, processFilterUrl;

        const taskAppFilters = await browser.controlFlow().execute(async() => {

            const appDefinitions = await this.alfrescoJsApi.activiti.appsApi.getAppDefinitions();

            deployedApp = appDefinitions.data.find((currentApp) => {

                    return currentApp.modelId === appModel.id;
            });

            processFilterUrl = TestConfig.adf.url + '/activiti/apps/' + deployedApp.id + '/processes/';

            return this.alfrescoJsApi.activiti.userFiltersApi.getUserProcessInstanceFilters({appId: deployedApp.id});
        });

        processServicesPage.goToApp(app.title);
        processServiceTabBarPage.clickProcessButton();
        processListPage.checkProcessListIsDisplayed();

        expect(taskAppFilters.size).toBe(defaultFiltersNumber);

        taskAppFilters.data.forEach((filter) => {
            BrowserActions.getUrl(processFilterUrl + filter.id);
            processListPage.checkProcessListIsDisplayed();
            processFiltersPage.checkFilterIsHighlighted(filter.name);
        });
    });
});
