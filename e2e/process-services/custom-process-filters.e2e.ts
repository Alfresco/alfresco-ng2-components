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

import { LoginPage } from '@alfresco/adf-testing';
import { ProcessFiltersPage } from '../pages/adf/process-services/processFiltersPage';
import { ProcessServiceTabBarPage } from '../pages/adf/process-services/processServiceTabBarPage';
import { AppSettingsToggles } from '../pages/adf/process-services/dialog/appSettingsToggles';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';

import TestConfig = require('../test.config');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../actions/users.actions';

describe('New Process Filters', () => {

    const loginPage = new LoginPage();
    const processFiltersPage = new ProcessFiltersPage();
    const processServiceTabBarPage = new ProcessServiceTabBarPage();
    const appSettingsToggles = new AppSettingsToggles();
    const navigationBarPage = new NavigationBarPage();

    let tenantId, user, filterId, customProcessFilter;

    const processFilter = {
        running: 'Running',
        all: 'All',
        completed: 'Completed',
        new_filter: 'New Filter',
        edited: 'Edited Filter',
        new_icon: 'New icon',
        edit_icon: 'Edit icon',
        deleted: 'To delete'
    };

    beforeAll(async (done) => {
        const users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        user = await users.createTenantAndUser(this.alfrescoJsApi);

        tenantId = user.tenantId;

        await this.alfrescoJsApi.login(user.email, user.password);

        await loginPage.loginToProcessServicesUsingUserModel(user);

        done();
    });

    afterAll(async (done) => {
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);
        done();
    });

    it('[C279965] Should be able to view default filters on ADF', async () => {
        navigationBarPage.navigateToProcessServicesPage()
            .goToTaskApp()
            .clickProcessButton();

        processFiltersPage.checkFilterIsDisplayed(processFilter.running);
        processFiltersPage.checkFilterIsDisplayed(processFilter.all);
        processFiltersPage.checkFilterIsDisplayed(processFilter.completed);
    });

    it('[C260473] Should be able to create a new filter on APS and display it on ADF', async () => {
        browser.controlFlow().execute(async () => {
            customProcessFilter = await this.alfrescoJsApi.activiti.userFiltersApi.createUserProcessInstanceFilter({
                'appId': null,
                'name': processFilter.new_filter,
                'icon': 'glyphicon-random',
                'filter': { 'sort': 'created-desc', 'name': '', 'state': 'running' }
            });

            filterId = customProcessFilter.id;

            return customProcessFilter;
        });

        navigationBarPage.navigateToProcessServicesPage()
            .goToTaskApp()
            .clickProcessButton();

        processFiltersPage.checkFilterIsDisplayed(processFilter.new_filter);
    });

    it('[C286450] Should display the process filter icon when a custom filter is added', async () => {
        browser.controlFlow().execute(async () => {
            customProcessFilter = await this.alfrescoJsApi.activiti.userFiltersApi.createUserProcessInstanceFilter({
                'appId': null,
                'name': processFilter.new_icon,
                'icon': 'glyphicon-cloud',
                'filter': { 'sort': 'created-desc', 'name': '', 'state': 'running' }
            });

            filterId = customProcessFilter.id;

            return customProcessFilter;
        });

        navigationBarPage.navigateToProcessServicesPage().goToTaskApp().clickProcessButton();

        processFiltersPage.checkFilterIsDisplayed(processFilter.new_icon);

        processServiceTabBarPage.clickSettingsButton();
        appSettingsToggles.enableProcessFiltersIcon();
        processServiceTabBarPage.clickProcessButton();

        processFiltersPage.checkFilterIsDisplayed(processFilter.new_icon);
        expect(processFiltersPage.getFilterIcon(processFilter.new_icon)).toEqual('cloud');
    });

    it('[C260474] Should be able to edit a filter on APS and check it on ADF', async () => {
        browser.controlFlow().execute(() => {
            return this.alfrescoJsApi.activiti.userFiltersApi.updateUserProcessInstanceFilter(filterId, {
                'appId': null,
                'name': processFilter.edited,
                'icon': 'glyphicon-random',
                'filter': { 'sort': 'created-desc', 'name': '', 'state': 'running' }
            });
        });

        navigationBarPage.navigateToProcessServicesPage()
            .goToTaskApp()
            .clickProcessButton();

        processFiltersPage.checkFilterIsDisplayed(processFilter.edited);
    });

    it('[C286451] Should display changes on a process filter when this filter icon is edited', async () => {
        browser.controlFlow().execute(async () => {
            customProcessFilter = await this.alfrescoJsApi.activiti.userFiltersApi.createUserProcessInstanceFilter({
                'appId': null,
                'name': processFilter.edit_icon,
                'icon': 'glyphicon-random',
                'filter': { 'sort': 'created-desc', 'name': '', 'state': 'running' }
            });

            filterId = customProcessFilter.id;

            return customProcessFilter;
        });

        navigationBarPage.navigateToProcessServicesPage().goToTaskApp().clickProcessButton();

        processFiltersPage.checkFilterIsDisplayed(processFilter.edit_icon);

        browser.controlFlow().execute(() => {
            return this.alfrescoJsApi.activiti.userFiltersApi.updateUserProcessInstanceFilter(filterId, {
                'appId': null,
                'name': processFilter.edit_icon,
                'icon': 'glyphicon-cloud',
                'filter': { 'sort': 'created-desc', 'name': '', 'state': 'running' }
            });
        });

        navigationBarPage.navigateToProcessServicesPage().goToTaskApp().clickProcessButton();

        processFiltersPage.checkFilterIsDisplayed(processFilter.edit_icon);

        processServiceTabBarPage.clickSettingsButton();
        appSettingsToggles.enableProcessFiltersIcon();
        processServiceTabBarPage.clickProcessButton();

        processFiltersPage.checkFilterIsDisplayed(processFilter.edit_icon);
        expect(processFiltersPage.getFilterIcon(processFilter.edit_icon)).toEqual('cloud');
    });

    it('[C286452] Should display process filter icons only when showIcon property is set on true', async () => {
        navigationBarPage.navigateToProcessServicesPage().goToTaskApp().clickProcessButton();
        processFiltersPage.checkFilterHasNoIcon(processFilter.all);

        processServiceTabBarPage.clickSettingsButton();
        appSettingsToggles.enableProcessFiltersIcon();
        processServiceTabBarPage.clickProcessButton();

        processFiltersPage.checkFilterIsDisplayed(processFilter.all);
        expect(processFiltersPage.getFilterIcon(processFilter.all)).toEqual('dashboard');
    });

    it('[C260475] Should be able to delete a filter on APS and check it on ADF', async () => {
        browser.controlFlow().execute(async () => {
            customProcessFilter = await this.alfrescoJsApi.activiti.userFiltersApi.createUserProcessInstanceFilter({
                'appId': null,
                'name': processFilter.deleted,
                'icon': 'glyphicon-random',
                'filter': { 'sort': 'created-desc', 'name': '', 'state': 'running' }
            });

            filterId = customProcessFilter.id;

            return customProcessFilter;
        });

        browser.controlFlow().execute(() => {
            return this.alfrescoJsApi.activiti.userFiltersApi.deleteUserProcessInstanceFilter(filterId);
        });

        navigationBarPage.navigateToProcessServicesPage().goToTaskApp().clickProcessButton();

        processFiltersPage.checkFilterIsNotDisplayed(processFilter.deleted);
    });

});
