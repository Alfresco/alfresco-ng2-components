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

import { createApiService,
    ApplicationsUtil,
    LoginPage,
    PaginationPage,
    ProcessUtil,
    UsersActions
} from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { TasksPage } from './../pages/tasks.page';
import CONSTANTS = require('../../util/constants');

describe('Items per page set to 15 and adding of tasks', () => {

    const app = browser.params.resources.Files.SIMPLE_APP_WITH_USER_FORM;

    const loginPage = new LoginPage();
    const taskPage = new TasksPage();
    const paginationPage = new PaginationPage();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const applicationsService = new ApplicationsUtil(apiService);

    let processUserModel;
    let currentPage = 1;
    const nrOfTasks = 25;
    const totalPages = 2;
    let i;
    let resultApp;

    const itemsPerPage = {
        fifteen: '15',
        fifteenValue: 15
    };

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        processUserModel = await usersActions.createUser();

        await apiService.login(processUserModel.username, processUserModel.password);

        resultApp = await applicationsService.importPublishDeployApp(app.file_path);

        const processUtil = new ProcessUtil(apiService);
        for (i = 0; i < (nrOfTasks - 5); i++) {
            await processUtil.startProcessOfApp(resultApp.name);
        }

        await loginPage.login(processUserModel.username, processUserModel.password);
   });

    it('[C260306] Items per page set to 15 and adding of tasks', async () => {
        await (await new NavigationBarPage().navigateToProcessServicesPage()).goToTaskApp();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await paginationPage.selectItemsPerPage(itemsPerPage.fifteen);
        await taskPage.tasksListPage().getDataTable().waitTillContentLoaded();

        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        await expect(await paginationPage.getCurrentPage()).toEqual('Page ' + currentPage);
        await expect(await paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        await expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.fifteenValue + ' of ' + (nrOfTasks - 5));
        await expect(await taskPage.tasksListPage().getDataTable().numberOfRows()).toBe(itemsPerPage.fifteenValue);

        const processUtil = new ProcessUtil(apiService);
        for (i; i < nrOfTasks; i++) {
            await processUtil.startProcessOfApp(resultApp.name);
        }

        currentPage++;
        await paginationPage.clickOnNextPage();
        await taskPage.tasksListPage().getDataTable().waitTillContentLoaded();

        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        await expect(await paginationPage.getCurrentPage()).toEqual('Page ' + currentPage);
        await expect(await paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        await expect(await paginationPage.getPaginationRange()).toEqual('Showing 16-' + nrOfTasks + ' of ' + nrOfTasks);
        await expect(await taskPage.tasksListPage().getDataTable().numberOfRows()).toBe(nrOfTasks - itemsPerPage.fifteenValue);
        await paginationPage.checkNextPageButtonIsDisabled();
        await paginationPage.checkPreviousPageButtonIsEnabled();
    });
});
