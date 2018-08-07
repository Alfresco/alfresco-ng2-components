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

import TestConfig = require('../test.config');
import LoginPage = require('../pages/adf/loginPage');
import NavigationBarPage = require('../pages/adf/navigationBarPage');
import ProcessServicesPage = require('../pages/adf/process_services/processServicesPage');
import ProcessFiltersPage = require('../pages/adf/process_services/processFiltersPage');
import AppNavigationBarPage = require('../pages/adf/process_services/appNavigationBarPage');

import AlfrescoApi = require('alfresco-js-api-node');

import { UsersActions } from '../actions/users.actions';
import { browser } from 'protractor';

describe('Process Filters URL Test', () => {

    let loginPage = new LoginPage();
    let navigationBarPage = new NavigationBarPage();
    let processServicesPage = new ProcessServicesPage();
    let processFiltersPage = new ProcessFiltersPage();
    let appNavigationBarPage = new AppNavigationBarPage();
    let user, taskAppFilters;

    beforeAll(async (done) => {
        let users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        user = await users.createTenantAndUser(this.alfrescoJsApi);

        await this.alfrescoJsApi.login(user.email, user.password);

        await loginPage.loginToProcessServicesUsingUserModel(user);

        navigationBarPage.clickProcessServicesButton();
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp('Task App');
        appNavigationBarPage.clickProcessButton();
        processServicesPage.checkProcessListIsDisplayed();

        done();
    });

    beforeEach(async(done) => {
        taskAppFilters = await this.alfrescoJsApi.activiti.userFiltersApi.getUserProcessInstanceFilters();

        done();
    });

    it('[C280407] Should be able to access the filters with URL', () => {
        let processFilterUrl = TestConfig.adf.url + '/activiti/apps/0/processes/';
        let defaultFiltersNumber = 3;

        expect(taskAppFilters.size).toBeGreaterThanOrEqual(defaultFiltersNumber);

        taskAppFilters.data.forEach((filter) => {
            browser.get(processFilterUrl + filter.id);
            processServicesPage.checkProcessListIsDisplayed();
            processFiltersPage.checkFilterIsHighlighted(filter.name);
        });
    });
});
