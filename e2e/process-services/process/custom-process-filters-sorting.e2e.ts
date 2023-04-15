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

import { browser } from 'protractor';

import { createApiService,
    ApplicationsUtil,
    LoginPage,
    ModelsActions,
    ProcessUtil,
    UsersActions
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { ProcessFiltersPage } from './../pages/process-filters.page';
import { FiltersPage } from './../pages/filters.page';
import { ProcessInstancesApi, UserFiltersApi } from '@alfresco/js-api';

describe('Sorting for process filters', () => {

    const app = browser.params.resources.Files.SIMPLE_APP_WITH_USER_FORM;

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const processFiltersPage = new ProcessFiltersPage();
    const filtersPage = new FiltersPage();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const modelsActions = new ModelsActions(apiService);
    const userFiltersApi = new UserFiltersApi(apiService.getInstance());
    const processInstancesApi = new ProcessInstancesApi(apiService.getInstance());

    let tenantId, appId, user, processesQuery;
    let importedApp;

    const processFilter = {
        running_old_first: 'Running - Oldest first',
        completed_old_first: 'Completed - Oldest first',
        all_old_first: 'All - Oldest first',
        running_new_first: 'Running - Newest first',
        completed_new_first: 'Completed - Newest first',
        all_new_first: 'All - Newest first',
        completed_most_recently: 'Completed - Most recently',
        completed_least_recently: 'Completed - Least recently'
    };

    beforeEach(async () => {
        await apiService.loginWithProfile('admin');

        const applicationsService = new ApplicationsUtil(apiService);

        user = await usersActions.createUser();
        tenantId = user.tenantId;

        await apiService.login(user.username, user.password);

        importedApp = await applicationsService.importPublishDeployApp(app.file_path);
        appId = importedApp.id;

        await loginPage.login(user.username, user.password);
    });

    afterEach(async () => {
        try {
            await modelsActions.deleteModel(appId);
            await apiService.loginWithProfile('admin');
            await usersActions.deleteTenant(tenantId);
        } catch (e) {
        }

        await navigationBarPage.clickLogoutButton();
    });

    it('[C260476] Should be able to create a filter on APS for running processes - Oldest first and check on ADF', async () => {
        await userFiltersApi.createUserProcessInstanceFilter({
            'appId': null, 'name': processFilter.running_old_first, 'icon': 'glyphicon-random',
            'filter': { 'sort': 'created-asc', 'name': '', 'state': 'running' }
        });
        const processUtil = new ProcessUtil(apiService);
        const firstProc = await processUtil.startProcessOfApp(importedApp.name);
        const secondProc = await processUtil.startProcessOfApp(importedApp.name);
        const thirdProc = await processUtil.startProcessOfApp(importedApp.name);

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();

        await processFiltersPage.checkFilterIsDisplayed(processFilter.running_old_first);
        await filtersPage.goToFilter(processFilter.running_old_first);
        processesQuery = await processInstancesApi.getProcessInstances({
            'processDefinitionId': null, 'appDefinitionId': null, 'state': 'running', 'sort': 'created-asc'
        });
        await expect(processesQuery.data[0].name).toEqual(firstProc.name);
        await expect(processesQuery.data[1].name).toEqual(secondProc.name);
        await expect(processesQuery.data[2].name).toEqual(thirdProc.name);
    });

    it('[C260477] Should be able to create a filter on APS for completed processes - Oldest first and check on ADF', async () => {
        await userFiltersApi.createUserProcessInstanceFilter({
            'appId': null, 'name': processFilter.completed_old_first, 'icon': 'glyphicon-random',
            'filter': { 'sort': 'created-asc', 'name': '', 'state': 'completed' }
        });

        const processUtil = new ProcessUtil(apiService);
        const firstProc = await processUtil.startProcessOfApp(importedApp.name);
        const secondProc = await processUtil.startProcessOfApp(importedApp.name);
        const thirdProc = await processUtil.startProcessOfApp(importedApp.name);

        await processUtil.cancelProcessInstance(firstProc.id);
        await processUtil.cancelProcessInstance(secondProc.id);
        await processUtil.cancelProcessInstance(thirdProc.id);

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();

        await processFiltersPage.checkFilterIsDisplayed(processFilter.completed_old_first);

        await filtersPage.goToFilter(processFilter.completed_old_first);

        processesQuery = await processInstancesApi.getProcessInstances({
            'processDefinitionId': null, 'appDefinitionId': null, 'state': 'completed', 'sort': 'created-asc'
        });
        await expect(processesQuery.data[0].name).toEqual(firstProc.name);
        await expect(processesQuery.data[1].name).toEqual(secondProc.name);
        await expect(processesQuery.data[2].name).toEqual(thirdProc.name);
    });

    it('[C260478] Should be able to create a filter on APS for all processes - Oldest first and check on ADF', async () => {
        await userFiltersApi.createUserProcessInstanceFilter({
            'appId': null, 'name': processFilter.all_old_first, 'icon': 'glyphicon-random',
            'filter': { 'sort': 'created-asc', 'name': '', 'state': 'all' }
        });

        const processUtil = new ProcessUtil(apiService);
        const firstProc = await processUtil.startProcessOfApp(importedApp.name);
        const secondProc = await processUtil.startProcessOfApp(importedApp.name);
        const thirdProc = await processUtil.startProcessOfApp(importedApp.name);

        const deleteFirstProc = await processUtil.startProcessOfApp(importedApp.name);
        const deleteSecondProc = await processUtil.startProcessOfApp(importedApp.name);
        const deleteThirdProc = await processUtil.startProcessOfApp(importedApp.name);

        await processUtil.cancelProcessInstance(deleteFirstProc.id);
        await processUtil.cancelProcessInstance(deleteSecondProc.id);
        await processUtil.cancelProcessInstance(deleteThirdProc.id);

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();

        await processFiltersPage.checkFilterIsDisplayed(processFilter.all_old_first);

        await filtersPage.goToFilter(processFilter.all_old_first);

        processesQuery = await processInstancesApi.getProcessInstances({
            'processDefinitionId': null, 'appDefinitionId': null, 'state': 'all', 'sort': 'created-asc'
        });
        await expect(processesQuery.data[0].name).toEqual(firstProc.name);
        await expect(processesQuery.data[1].name).toEqual(secondProc.name);
        await expect(processesQuery.data[2].name).toEqual(thirdProc.name);
        await expect(processesQuery.data[3].name).toEqual(deleteFirstProc.name);
        await expect(processesQuery.data[4].name).toEqual(deleteSecondProc.name);
        await expect(processesQuery.data[5].name).toEqual(deleteThirdProc.name);
    });

    it('[C260479] Should be able to create a filter on APS for running processes - Newest first and check on ADF', async () => {
        await userFiltersApi.createUserProcessInstanceFilter({
            'appId': null, 'name': processFilter.running_new_first, 'icon': 'glyphicon-random',
            'filter': { 'sort': 'created-desc', 'name': '', 'state': 'running' }
        });

        const processUtil = new ProcessUtil(apiService);
        const firstProc = await processUtil.startProcessOfApp(importedApp.name);
        const secondProc = await processUtil.startProcessOfApp(importedApp.name);
        const thirdProc = await processUtil.startProcessOfApp(importedApp.name);

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();

        await processFiltersPage.checkFilterIsDisplayed(processFilter.running_new_first);

        await filtersPage.goToFilter(processFilter.running_new_first);

        processesQuery = await processInstancesApi.getProcessInstances({
            'processDefinitionId': null, 'appDefinitionId': null, 'state': 'running', 'sort': 'created-desc'
        });
        await expect(processesQuery.data[0].name).toEqual(thirdProc.name);
        await expect(processesQuery.data[1].name).toEqual(secondProc.name);
        await expect(processesQuery.data[2].name).toEqual(firstProc.name);
    });

    it('[C260480] Should be able to create a filter on APS for completed processes - Newest first and check on ADF', async () => {
        await userFiltersApi.createUserProcessInstanceFilter({
            'appId': null, 'name': processFilter.completed_new_first, 'icon': 'glyphicon-random',
            'filter': { 'sort': 'created-desc', 'name': '', 'state': 'completed' }
        });

        const processUtil = new ProcessUtil(apiService);
        const firstProc = await processUtil.startProcessOfApp(importedApp.name);
        const secondProc = await processUtil.startProcessOfApp(importedApp.name);
        const thirdProc = await processUtil.startProcessOfApp(importedApp.name);

        await processUtil.cancelProcessInstance(firstProc.id);
        await processUtil.cancelProcessInstance(secondProc.id);
        await processUtil.cancelProcessInstance(thirdProc.id);

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();

        await processFiltersPage.checkFilterIsDisplayed(processFilter.completed_new_first);

        await filtersPage.goToFilter(processFilter.completed_new_first);
        processesQuery = await processInstancesApi.getProcessInstances({
            'processDefinitionId': null, 'appDefinitionId': null, 'state': 'completed', 'sort': 'created-desc'
        });
        await expect(processesQuery.data[0].name).toEqual(thirdProc.name);
        await expect(processesQuery.data[1].name).toEqual(secondProc.name);
        await expect(processesQuery.data[2].name).toEqual(firstProc.name);
    });

    it('[C260481] Should be able to create a filter on APS for all processes - Newest first and check on ADF', async () => {
        await userFiltersApi.createUserProcessInstanceFilter({
            'appId': null, 'name': processFilter.all_new_first, 'icon': 'glyphicon-random',
            'filter': { 'sort': 'created-desc', 'name': '', 'state': 'all' }
        });

        const processUtil = new ProcessUtil(apiService);
        const firstProc = await processUtil.startProcessOfApp(importedApp.name);
        const secondProc = await processUtil.startProcessOfApp(importedApp.name);
        const thirdProc = await processUtil.startProcessOfApp(importedApp.name);

        const deleteFirstProc = await processUtil.startProcessOfApp(importedApp.name);
        const deleteSecondProc = await processUtil.startProcessOfApp(importedApp.name);
        const deleteThirdProc = await processUtil.startProcessOfApp(importedApp.name);

        await processUtil.cancelProcessInstance(deleteFirstProc.id);
        await processUtil.cancelProcessInstance(deleteSecondProc.id);
        await processUtil.cancelProcessInstance(deleteThirdProc.id);

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();

        await processFiltersPage.checkFilterIsDisplayed(processFilter.all_new_first);

        await filtersPage.goToFilter(processFilter.all_new_first);

        processesQuery = await processInstancesApi.getProcessInstances({
            'processDefinitionId': null, 'appDefinitionId': null, 'state': 'all', 'sort': 'created-desc'
        });
        await expect(processesQuery.data[0].name).toEqual(deleteThirdProc.name);
        await expect(processesQuery.data[1].name).toEqual(deleteSecondProc.name);
        await expect(processesQuery.data[2].name).toEqual(deleteFirstProc.name);
        await expect(processesQuery.data[3].name).toEqual(thirdProc.name);
        await expect(processesQuery.data[4].name).toEqual(secondProc.name);
        await expect(processesQuery.data[5].name).toEqual(firstProc.name);
    });

    it('[C272815] Should be able to create a filter on APS for completed processes - Completed most recently and check on ADF', async () => {
        await userFiltersApi.createUserProcessInstanceFilter({
            'appId': null, 'name': processFilter.completed_most_recently, 'icon': 'glyphicon-random',
            'filter': { 'sort': 'ended-asc', 'name': '', 'state': 'completed' }
        });

        const processUtil = new ProcessUtil(apiService);
        const firstProc = await processUtil.startProcessOfApp(importedApp.name);
        const secondProc = await processUtil.startProcessOfApp(importedApp.name);
        const thirdProc = await processUtil.startProcessOfApp(importedApp.name);

        await processUtil.cancelProcessInstance(secondProc.id);
        await processUtil.cancelProcessInstance(firstProc.id);
        await processUtil.cancelProcessInstance(thirdProc.id);

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();

        await processFiltersPage.checkFilterIsDisplayed(processFilter.completed_most_recently);

        await filtersPage.goToFilter(processFilter.completed_most_recently);

        processesQuery = await processInstancesApi.getProcessInstances({
            'processDefinitionId': null, 'appDefinitionId': null, 'state': 'completed', 'sort': 'ended-asc'
        });
        await expect(processesQuery.data[0].name).toEqual(secondProc.name);
        await expect(processesQuery.data[1].name).toEqual(firstProc.name);
        await expect(processesQuery.data[2].name).toEqual(thirdProc.name);
    });

    it('[C272816] Should be able to create a filter on APS for completed processes - Completed least recently and check on ADF', async () => {
        await userFiltersApi.createUserProcessInstanceFilter({
            'appId': null, 'name': processFilter.completed_least_recently, 'icon': 'glyphicon-random',
            'filter': { 'sort': 'ended-desc', 'name': '', 'state': 'completed' }
        });

        const processUtil = new ProcessUtil(apiService);
        const firstProc = await processUtil.startProcessOfApp(importedApp.name);
        const secondProc = await processUtil.startProcessOfApp(importedApp.name);
        const thirdProc = await processUtil.startProcessOfApp(importedApp.name);

        await processUtil.cancelProcessInstance(secondProc.id);
        await processUtil.cancelProcessInstance(firstProc.id);
        await processUtil.cancelProcessInstance(thirdProc.id);

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();

        await processFiltersPage.checkFilterIsDisplayed(processFilter.completed_least_recently);

        await filtersPage.goToFilter(processFilter.completed_least_recently);

        processesQuery = await processInstancesApi.getProcessInstances({
            'processDefinitionId': null, 'appDefinitionId': null, 'state': 'completed', 'sort': 'ended-desc'
        });
        await expect(processesQuery.data[0].name).toEqual(thirdProc.name);
        await expect(processesQuery.data[1].name).toEqual(firstProc.name);
        await expect(processesQuery.data[2].name).toEqual(secondProc.name);
    });
});
