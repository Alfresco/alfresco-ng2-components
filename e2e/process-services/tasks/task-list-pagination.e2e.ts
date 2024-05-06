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

import { createApiService, ApplicationsUtil, LoginPage, PaginationPage, ProcessUtil, UserModel, UsersActions } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { TasksPage } from '../pages/tasks.page';
import CONSTANTS = require('../../util/constants');

describe('Task List Pagination', () => {
    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const taskPage = new TasksPage();
    const paginationPage = new PaginationPage();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);

    let processUserModel: UserModel;
    const app = browser.params.resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let currentPage = 1;
    const nrOfTasks = 20;
    let totalPages: number;

    const itemsPerPage = {
        five: '5',
        fiveValue: 5,
        ten: '10',
        tenValue: 10,
        fifteen: '15',
        fifteenValue: 15,
        twenty: '20',
        twentyValue: 20,
        default: '20'
    };

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');
        processUserModel = await usersActions.createUser();

        await apiService.login(processUserModel.username, processUserModel.password);
        const applicationsService = new ApplicationsUtil(apiService);
        const resultApp = await applicationsService.importPublishDeployApp(app.file_path);

        for (let i = 0; i < nrOfTasks; i++) {
            await new ProcessUtil(apiService).startProcessOfApp(resultApp.name);
        }

        await loginPage.login(processUserModel.username, processUserModel.password);
    });

    afterAll(async () => {
        await apiService.loginWithProfile('admin');
        await usersActions.deleteTenant(processUserModel.tenantId);
    });

    it('[C260301] Should display default pagination', async () => {
        await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp();
        expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.default);
        expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + nrOfTasks + ' of ' + nrOfTasks);
        expect(await taskPage.tasksListPage().getDataTable().numberOfRows()).toBe(nrOfTasks);
        await paginationPage.checkNextPageButtonIsDisabled();
        await paginationPage.checkPreviousPageButtonIsDisabled();
        await paginationPage.selectItemsPerPage(itemsPerPage.twenty);
        expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.twenty);
        expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + nrOfTasks + ' of ' + nrOfTasks);
    });

    it('[C260304] Should be possible to set Items per page to 5', async () => {
        await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await paginationPage.selectItemsPerPage(itemsPerPage.five);
        expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.fiveValue + ' of ' + nrOfTasks);
        expect(await taskPage.tasksListPage().getDataTable().numberOfRows()).toBe(itemsPerPage.fiveValue);

        await paginationPage.clickOnNextPage();
        currentPage++;

        expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(await paginationPage.getPaginationRange()).toEqual('Showing 6-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfTasks);
        expect(await taskPage.tasksListPage().getDataTable().numberOfRows()).toBe(itemsPerPage.fiveValue);
        await paginationPage.clickOnNextPage();
        currentPage++;

        expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(await paginationPage.getPaginationRange()).toEqual('Showing 11-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfTasks);
        expect(await taskPage.tasksListPage().getDataTable().numberOfRows()).toBe(itemsPerPage.fiveValue);
        await paginationPage.clickOnNextPage();
        currentPage++;
        expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(await paginationPage.getPaginationRange()).toEqual('Showing 16-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfTasks);
        expect(await taskPage.tasksListPage().getDataTable().numberOfRows()).toBe(itemsPerPage.fiveValue);

        await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
    });

    it('[C260303] Should be possible to set Items per page to 10', async () => {
        await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await paginationPage.selectItemsPerPage(itemsPerPage.ten);
        expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.tenValue + ' of ' + nrOfTasks);
        expect(await taskPage.tasksListPage().getDataTable().numberOfRows()).toBe(itemsPerPage.tenValue);
        await paginationPage.clickOnNextPage();
        expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        expect(await paginationPage.getPaginationRange()).toEqual('Showing 11-' + itemsPerPage.twentyValue + ' of ' + nrOfTasks);
        expect(await taskPage.tasksListPage().getDataTable().numberOfRows()).toBe(itemsPerPage.tenValue);

        await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
    });

    it('[C260302] Should be possible to set Items per page to 15', async () => {
        await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await paginationPage.selectItemsPerPage(itemsPerPage.fifteen);
        expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.fifteenValue + ' of ' + nrOfTasks);
        expect(await taskPage.tasksListPage().getDataTable().numberOfRows()).toBe(itemsPerPage.fifteenValue);
        await paginationPage.clickOnNextPage();
        expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        expect(await paginationPage.getPaginationRange()).toEqual('Showing 16-' + itemsPerPage.twentyValue + ' of ' + nrOfTasks);
        expect(await taskPage.tasksListPage().getDataTable().numberOfRows()).toBe(itemsPerPage.fiveValue);

        await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
    });

    it('[C261006] Should be possible to navigate to a page with page number dropdown', async () => {
        currentPage = 1;
        totalPages = 2;
        await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await taskPage.tasksListPage().getDataTable().waitForTableBody();
        await paginationPage.selectItemsPerPage(itemsPerPage.ten);
        await taskPage.tasksListPage().getDataTable().waitForTableBody();
        expect(await paginationPage.getCurrentPage()).toEqual('Page ' + currentPage);
        expect(await paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.tenValue * currentPage + ' of ' + nrOfTasks);
        expect(await taskPage.tasksListPage().getDataTable().numberOfRows()).toBe(itemsPerPage.tenValue);
        await paginationPage.checkNextPageButtonIsEnabled();
        await paginationPage.checkPreviousPageButtonIsDisabled();

        await paginationPage.clickOnPageDropdown();
        expect(await paginationPage.getPageDropdownOptions()).toEqual(['1', '2']);
        currentPage = 2;
        await paginationPage.clickOnPageDropdownOption('2');
        await taskPage.tasksListPage().getDataTable().waitForTableBody();
        expect(await paginationPage.getCurrentPage()).toEqual('Page ' + currentPage);
        expect(await paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        expect(await paginationPage.getPaginationRange()).toEqual('Showing 11-' + itemsPerPage.tenValue * currentPage + ' of ' + nrOfTasks);
        expect(await taskPage.tasksListPage().getDataTable().numberOfRows()).toBe(itemsPerPage.tenValue);
        await paginationPage.checkNextPageButtonIsDisabled();
        await paginationPage.checkPreviousPageButtonIsEnabled();

        await paginationPage.clickOnPageDropdown();
        expect(await paginationPage.getPageDropdownOptions()).toEqual(['1', '2']);
        currentPage = 1;
        await paginationPage.clickOnPageDropdownOption('1');
        await taskPage.tasksListPage().getDataTable().waitForTableBody();
        expect(await paginationPage.getCurrentPage()).toEqual('Page ' + currentPage);
        expect(await paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.tenValue * currentPage + ' of ' + nrOfTasks);
        expect(await taskPage.tasksListPage().getDataTable().numberOfRows()).toBe(itemsPerPage.tenValue);
        await paginationPage.checkNextPageButtonIsEnabled();
        await paginationPage.checkPreviousPageButtonIsDisabled();
    });
});
