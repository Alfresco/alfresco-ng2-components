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

import { ApiService, LoginSSOPage } from '@alfresco/adf-testing';
import { ProcessFiltersPage } from '../pages/adf/process-services/process-filters.page';
import { ProcessServiceTabBarPage } from '../pages/adf/process-services/process-service-tab-bar.page';
import { AppSettingsTogglesPage } from '../pages/adf/process-services/dialog/app-settings-toggles.page';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';

import { UsersActions } from '../actions/users.actions';

describe('New Process Filters', () => {

    const loginPage = new LoginSSOPage();
    const processFiltersPage = new ProcessFiltersPage();
    const processServiceTabBarPage = new ProcessServiceTabBarPage();
    const appSettingsToggles = new AppSettingsTogglesPage();
    const navigationBarPage = new NavigationBarPage();
    const apiService = new ApiService();

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

    beforeAll(async () => {
        const users = new UsersActions(apiService);

        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

        user = await users.createTenantAndUser();

        tenantId = user.tenantId;

        await apiService.getInstance().login(user.email, user.password);

        await loginPage.login(user.email, user.password);
    });

    afterAll(async () => {
        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
        await apiService.getInstance().activiti.adminTenantsApi.deleteTenant(tenantId);
    });

    it('[C279965] Should be able to view default filters on ADF', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();

        await processFiltersPage.checkFilterIsDisplayed(processFilter.running);
        await processFiltersPage.checkFilterIsDisplayed(processFilter.all);
        await processFiltersPage.checkFilterIsDisplayed(processFilter.completed);
    });

    it('[C260473] Should be able to create a new filter on APS and display it on ADF', async () => {
        customProcessFilter = await apiService.getInstance().activiti.userFiltersApi.createUserProcessInstanceFilter({
            'appId': null,
            'name': processFilter.new_filter,
            'icon': 'glyphicon-random',
            'filter': { 'sort': 'created-desc', 'name': '', 'state': 'running' }
        });

        filterId = customProcessFilter.id;

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();

        await processFiltersPage.checkFilterIsDisplayed(processFilter.new_filter);
    });

    it('[C286450] Should display the process filter icon when a custom filter is added', async () => {
        customProcessFilter = await apiService.getInstance().activiti.userFiltersApi.createUserProcessInstanceFilter({
            'appId': null,
            'name': processFilter.new_icon,
            'icon': 'glyphicon-cloud',
            'filter': { 'sort': 'created-desc', 'name': '', 'state': 'running' }
        });

        filterId = customProcessFilter.id;

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();

        await processFiltersPage.checkFilterIsDisplayed(processFilter.new_icon);

        await processServiceTabBarPage.clickSettingsButton();
        await appSettingsToggles.enableProcessFiltersIcon();
        await processServiceTabBarPage.clickProcessButton();

        await processFiltersPage.checkFilterIsDisplayed(processFilter.new_icon);
        await expect(await processFiltersPage.getFilterIcon(processFilter.new_icon)).toEqual('cloud');
    });

    it('[C260474] Should be able to edit a filter on APS and check it on ADF', async () => {
        await apiService.getInstance().activiti.userFiltersApi.updateUserProcessInstanceFilter(filterId, {
            'appId': null,
            'name': processFilter.edited,
            'icon': 'glyphicon-random',
            'filter': { 'sort': 'created-desc', 'name': '', 'state': 'running' }
        });

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();

        await processFiltersPage.checkFilterIsDisplayed(processFilter.edited);
    });

    it('[C286451] Should display changes on a process filter when this filter icon is edited', async () => {
        customProcessFilter = await apiService.getInstance().activiti.userFiltersApi.createUserProcessInstanceFilter({
            'appId': null,
            'name': processFilter.edit_icon,
            'icon': 'glyphicon-random',
            'filter': { 'sort': 'created-desc', 'name': '', 'state': 'running' }
        });

        filterId = customProcessFilter.id;

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();

        await processFiltersPage.checkFilterIsDisplayed(processFilter.edit_icon);

        await apiService.getInstance().activiti.userFiltersApi.updateUserProcessInstanceFilter(filterId, {
            'appId': null,
            'name': processFilter.edit_icon,
            'icon': 'glyphicon-cloud',
            'filter': { 'sort': 'created-desc', 'name': '', 'state': 'running' }
        });

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();

        await processFiltersPage.checkFilterIsDisplayed(processFilter.edit_icon);

        await processServiceTabBarPage.clickSettingsButton();
        await appSettingsToggles.enableProcessFiltersIcon();
        await processServiceTabBarPage.clickProcessButton();

        await processFiltersPage.checkFilterIsDisplayed(processFilter.edit_icon);
        await expect(await processFiltersPage.getFilterIcon(processFilter.edit_icon)).toEqual('cloud');
    });

    it('[C286452] Should display process filter icons only when showIcon property is set on true', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();
        await processFiltersPage.checkFilterHasNoIcon(processFilter.all);

        await processServiceTabBarPage.clickSettingsButton();
        await appSettingsToggles.enableProcessFiltersIcon();
        await processServiceTabBarPage.clickProcessButton();

        await processFiltersPage.checkFilterIsDisplayed(processFilter.all);
        await expect(await processFiltersPage.getFilterIcon(processFilter.all)).toEqual('dashboard');
    });

    it('[C260475] Should be able to delete a filter on APS and check it on ADF', async () => {
        customProcessFilter = await apiService.getInstance().activiti.userFiltersApi.createUserProcessInstanceFilter({
            'appId': null,
            'name': processFilter.deleted,
            'icon': 'glyphicon-random',
            'filter': { 'sort': 'created-desc', 'name': '', 'state': 'running' }
        });

        filterId = customProcessFilter.id;

        await apiService.getInstance().activiti.userFiltersApi.deleteUserProcessInstanceFilter(filterId);

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();

        await processFiltersPage.checkFilterIsNotDisplayed(processFilter.deleted);
    });
});
