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

import { createApiService, LoginPage, UserModel, UsersActions } from '@alfresco/adf-testing';
import { ProcessFiltersPage } from '../pages/process-filters.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { UserFiltersApi, UserProcessInstanceFilterRepresentation } from '@alfresco/js-api';

describe('New Process Filters', () => {
    const loginPage = new LoginPage();
    const processFiltersPage = new ProcessFiltersPage();
    const navigationBarPage = new NavigationBarPage();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const userFiltersApi = new UserFiltersApi(apiService.getInstance());

    let tenantId: number;
    let user: UserModel;
    let filterId: number;
    let customProcessFilter: UserProcessInstanceFilterRepresentation;

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
        await apiService.loginWithProfile('admin');

        user = await usersActions.createUser();

        tenantId = user.tenantId;

        await apiService.login(user.username, user.password);

        await loginPage.login(user.username, user.password);
    });

    afterAll(async () => {
        await apiService.loginWithProfile('admin');
        await usersActions.deleteTenant(tenantId);
    });

    it('[C279965] Should be able to view default filters on ADF', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();

        await processFiltersPage.checkFilterIsDisplayed(processFilter.running);
        await processFiltersPage.checkFilterIsDisplayed(processFilter.all);
        await processFiltersPage.checkFilterIsDisplayed(processFilter.completed);
    });

    it('[C260473] Should be able to create a new filter on APS and display it on ADF', async () => {
        customProcessFilter = await userFiltersApi.createUserProcessInstanceFilter({
            appId: null,
            name: processFilter.new_filter,
            icon: 'glyphicon-random',
            filter: { sort: 'created-desc', name: '', state: 'running' }
        });

        filterId = customProcessFilter.id;

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();

        await processFiltersPage.checkFilterIsDisplayed(processFilter.new_filter);
    });

    it('[C260474] Should be able to edit a filter on APS and check it on ADF', async () => {
        customProcessFilter = await userFiltersApi.createUserProcessInstanceFilter({
            appId: null,
            name: processFilter.new_icon,
            icon: 'glyphicon-cloud',
            filter: { sort: 'created-desc', name: '', state: 'running' }
        });

        filterId = customProcessFilter.id;

        await userFiltersApi.updateUserProcessInstanceFilter(filterId, {
            appId: null,
            name: processFilter.edited,
            icon: 'glyphicon-random',
            filter: { sort: 'created-desc', name: '', state: 'running' }
        });

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();

        await processFiltersPage.checkFilterIsDisplayed(processFilter.edited);
    });

    it('[C260475] Should be able to delete a filter on APS and check it on ADF', async () => {
        customProcessFilter = await userFiltersApi.createUserProcessInstanceFilter({
            appId: null,
            name: processFilter.deleted,
            icon: 'glyphicon-random',
            filter: { sort: 'created-desc', name: '', state: 'running' }
        });

        filterId = customProcessFilter.id;

        await userFiltersApi.deleteUserProcessInstanceFilter(filterId);

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();

        await processFiltersPage.checkFilterIsNotDisplayed(processFilter.deleted);
    });
});
