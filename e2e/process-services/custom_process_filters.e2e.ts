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

import LoginPage = require('../pages/adf/loginPage');
import ProcessServicesPage = require('../pages/adf/process_services/processServicesPage');
import ProcessFiltersPage = require('../pages/adf/process_services/processFiltersPage.js');
import FiltersPage = require('../pages/adf/process_services/filtersPage.js')

import TestConfig = require('../test.config');
import resources = require('../util/resources');
import Util = require('../util/util.js');

import AlfrescoApi = require('alfresco-js-api-node');
import { UsersActions } from '../actions/users.actions';

describe('New Process Filters', () => {

    let loginPage = new LoginPage();
    let processServicesPage = new ProcessServicesPage();
    let processFiltersPage = new ProcessFiltersPage();

    let tenantId, user, filterId, customProcessFilter;

    let processFilter = {
        running: 'Running',
        all: 'All',
        completed: 'Completed',
        new_filter: 'New Filter',
        edited: 'Edited Filter'
    };

    beforeAll(async(done) => {
        let users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        user = await users.createTenantAndUser(this.alfrescoJsApi);

        tenantId = user.tenantId;

        await this.alfrescoJsApi.login(user.email, user.password);

        done();
    });

    afterAll(async(done) => {
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);
        done();
    });

    it('[C279965] Should be able to view default filters on ADF', () => {
        loginPage.loginToProcessServicesUsingUserModel(user);

        processServicesPage
            .goToProcessServices()
            .goToTaskApp()
            .clickProcessButton();

        processFiltersPage.checkFilterIsDisplayed(processFilter.running);
        processFiltersPage.checkFilterIsDisplayed(processFilter.all);
        processFiltersPage.checkFilterIsDisplayed(processFilter.completed);
    });

    it('[C260473] Should be able to create a new filter on APS and display it on ADF', () => {
        browser.controlFlow().execute(async () => {
            customProcessFilter = await this.alfrescoJsApi.activiti.userFiltersApi.createUserProcessInstanceFilter({
                'appId': null,
                'name': processFilter.new_filter,
                'icon': 'glyphicon-random',
                'filter': {'sort': 'created-desc', 'name': '', 'state': 'running'}
            });

            filterId = customProcessFilter.id;

            return customProcessFilter;
        });

        loginPage.loginToProcessServicesUsingUserModel(user);

        processServicesPage
            .goToProcessServices()
            .goToTaskApp()
            .clickProcessButton();

        processFiltersPage.checkFilterIsDisplayed(processFilter.new_filter);
    });

    it('[C260474] Should be able to edit a filter on APS and check it on ADF', () => {
        browser.controlFlow().execute(() => {
            return this.alfrescoJsApi.activiti.userFiltersApi.updateUserProcessInstanceFilter(filterId, {
                'appId': null,
                'name': processFilter.edited,
                'icon': 'glyphicon-random',
                'filter': {'sort': 'created-desc', 'name': '', 'state': 'running'}
            });
        });

        loginPage.loginToProcessServicesUsingUserModel(user);

        processServicesPage
            .goToProcessServices()
            .goToTaskApp()
            .clickProcessButton();

        processFiltersPage.checkFilterIsDisplayed(processFilter.edited);
    });

    it('[C260475] Should be able to delete a filter on APS and check it on ADF', () => {
        browser.controlFlow().execute(() => {
            return this.alfrescoJsApi.activiti.userFiltersApi.deleteUserProcessInstanceFilter(filterId);
        });

        loginPage.loginToProcessServicesUsingUserModel(user);

        processServicesPage
            .goToProcessServices()
            .goToTaskApp()
            .clickProcessButton();

        processFiltersPage.checkFilterIsNotDisplayed(processFilter.edited);
    });

});
