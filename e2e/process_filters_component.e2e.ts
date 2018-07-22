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

import TestConfig = require('./test.config');
import resources = require('./util/resources');
import LoginPage = require('./pages/adf/loginPage');
import NavigationBarPage = require('./pages/adf/navigationBarPage');
import ProcessServicesPage = require('./pages/adf/process_services/processServicesPage');
import StartProcessPage = require('./pages/adf/process_services/startProcessPage');
import ProcessFiltersPage = require('./pages/adf/process_services/processFiltersPage');
import AppNavigationBarPage = require('./pages/adf/process_services/appNavigationBarPage');
import ProcessDetailsPage = require('./pages/adf/process_services/processDetailsPage');

import AlfrescoApi = require('alfresco-js-api-node');
import { AppsActions } from './actions/APS/apps.actions';
import { UsersActions } from './actions/users.actions';

describe('Process Filters Test', () => {

    let loginPage = new LoginPage();
    let navigationBarPage = new NavigationBarPage();
    let processServicesPage = new ProcessServicesPage();
    let startProcessPage = new StartProcessPage();
    let processFiltersPage = new ProcessFiltersPage();
    let appNavigationBarPage = new AppNavigationBarPage();
    let processDetailsPage = new ProcessDetailsPage();

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

        await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

        await loginPage.loginToProcessServicesUsingUserModel(user);

        done();
    });

    xit('Navigate to Running filter', () => {
        navigationBarPage.clickProcessServicesButton();

        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(app.title);

        appNavigationBarPage.clickProcessButton();

        processFiltersPage.clickCreateProcessButton();
        processFiltersPage.clickNewProcessDropdown();

        startProcessPage.enterProcessName(processTitle.completed);
        startProcessPage.selectFromProcessDropdown(app.process_title);
        startProcessPage.clickFormStartProcessButton();

        processDetailsPage.clickCancelProcessButton();
        navigationBarPage.clickProcessServicesButton();

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

    it('Navigate to All filter', () => {
        processFiltersPage.clickAllFilterButton();
        processFiltersPage.checkFilterIsHighlighted(processFilter.all);
        processFiltersPage.selectFromProcessList(processTitle.running);
        processFiltersPage.selectFromProcessList(processTitle.completed);
        processDetailsPage.checkProcessDetailsCard();
    });

    it('Navigate to Completed filter', () => {
        processFiltersPage.clickCompletedFilterButton();
        processFiltersPage.checkFilterIsHighlighted(processFilter.completed);
        processFiltersPage.selectFromProcessList(processTitle.completed);
        processDetailsPage.checkProcessDetailsCard();
    });
});
