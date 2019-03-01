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
import { LoginPage } from '../pages/adf/loginPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';

import { ProcessServicesPage } from '../pages/adf/process-services/processServicesPage';
import { StartProcessPage } from '../pages/adf/process-services/startProcessPage';
import { ProcessFiltersPage } from '../pages/adf/process-services/processFiltersPage';
import { AppNavigationBarPage } from '../pages/adf/process-services/appNavigationBarPage';
import { ProcessDetailsPage } from '../pages/adf/process-services/processDetailsPage';
import { ProcessListPage } from '../pages/adf/process-services/processListPage';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';

import { AppsActions } from '../actions/APS/apps.actions';
import { UsersActions } from '../actions/users.actions';
import { browser } from 'protractor';

describe('Process Filters Test', () => {

    let loginPage = new LoginPage();
    let processListPage = new ProcessListPage();
    let navigationBarPage = new NavigationBarPage();
    let processServicesPage = new ProcessServicesPage();
    let startProcessPage = new StartProcessPage();
    let processFiltersPage = new ProcessFiltersPage();
    let appNavigationBarPage = new AppNavigationBarPage();
    let processDetailsPage = new ProcessDetailsPage();
    let appModel;

    let app = resources.Files.APP_WITH_DATE_FIELD_FORM;

    let processTitle = {
        running: 'Test_running',
        completed: 'Test_completed'
    };
    let processFilter = {
        running: 'Running',
        all: 'All',
        completed: 'Completed'
    };

    beforeAll(async (done) => {
        let apps = new AppsActions();
        let users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        let user = await users.createTenantAndUser(this.alfrescoJsApi);

        await this.alfrescoJsApi.login(user.email, user.password);

        appModel = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

        await loginPage.loginToProcessServicesUsingUserModel(user);

        done();
    });

    beforeEach(() => {
        navigationBarPage.navigateToProcessServicesPage();
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(app.title);
        appNavigationBarPage.clickProcessButton();
        processListPage.checkProcessListIsDisplayed();
    });

    it('[C260387] Should the running process be displayed when clicking on Running filter', () => {
        processFiltersPage.clickCreateProcessButton();
        processFiltersPage.clickNewProcessDropdown();

        startProcessPage.enterProcessName(processTitle.completed);
        startProcessPage.selectFromProcessDropdown(app.process_title);
        startProcessPage.clickFormStartProcessButton();

        processDetailsPage.clickCancelProcessButton();
        navigationBarPage.navigateToProcessServicesPage();

        processServicesPage.goToApp(app.title);

        appNavigationBarPage.clickProcessButton();

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
        processFiltersPage.clickAllFilterButton();
        processFiltersPage.checkFilterIsHighlighted(processFilter.all);
        processFiltersPage.selectFromProcessList(processTitle.running);
        processFiltersPage.selectFromProcessList(processTitle.completed);
        processDetailsPage.checkProcessDetailsCard();
    });

    it('[C280064] Should the completed process be displayed when clicking on Completed filter', () => {
        processFiltersPage.clickCompletedFilterButton();
        processFiltersPage.checkFilterIsHighlighted(processFilter.completed);
        processFiltersPage.selectFromProcessList(processTitle.completed);
        processDetailsPage.checkProcessDetailsCard();
    });

    it('[C280407] Should be able to access the filters with URL', async () => {

        let defaultFiltersNumber = 3;
        let deployedApp, processFilterUrl;

        let taskAppFilters = await browser.controlFlow().execute(async() => {

            let appDefinitions = await this.alfrescoJsApi.activiti.appsApi.getAppDefinitions();

            deployedApp = appDefinitions.data.find((currentApp) => {

                    return currentApp.modelId === appModel.id;
            });

            processFilterUrl = TestConfig.adf.url + '/activiti/apps/' + deployedApp.id + '/processes/';

            return this.alfrescoJsApi.activiti.userFiltersApi.getUserProcessInstanceFilters({appId: deployedApp.id});
        });

        expect(taskAppFilters.size).toBe(defaultFiltersNumber);

        taskAppFilters.data.forEach((filter) => {
            browser.get(processFilterUrl + filter.id);
            processListPage.checkProcessListIsDisplayed();
            processFiltersPage.checkFilterIsHighlighted(filter.name);
        });
    });
});
