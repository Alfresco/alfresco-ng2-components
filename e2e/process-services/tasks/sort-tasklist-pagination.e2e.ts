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
    StringUtil, TaskUtil,
    UsersActions
} from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { TasksPage } from './../pages/tasks.page';
import CONSTANTS = require('../../util/constants');

describe('Task List Pagination - Sorting', () => {

    const app = browser.params.resources.Files.SIMPLE_APP_WITH_USER_FORM;

    const loginPage = new LoginPage();
    const taskPage = new TasksPage();
    const paginationPage = new PaginationPage();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const applicationsService = new ApplicationsUtil(apiService);
    const taskUtil = new TaskUtil(apiService);

    const nrOfTasks = 20;
    let processUserModel;
    const taskNameBase = 'Task';
    const taskNames = StringUtil.generateFilesNames(10, nrOfTasks + 9, taskNameBase, '');

    const itemsPerPage = {
        five: '5',
        fiveValue: 5,
        ten: '10',
        tenValue: 10,
        twenty: '20',
        twentyValue: 20
    };

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        processUserModel = await usersActions.createUser();

        await apiService.login(processUserModel.username, processUserModel.password);

        await applicationsService.importPublishDeployApp(app.file_path);

        for (let i = 0; i < nrOfTasks; i++) {
            await taskUtil.createStandaloneTask(taskNames[i]);
        }

        await loginPage.login(processUserModel.username, processUserModel.password);
    });

    it('[C260308] Should be possible to sort tasks by name', async () => {
        await (await new NavigationBarPage().navigateToProcessServicesPage()).goToTaskApp();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await taskPage.tasksListPage().getDataTable().waitForTableBody();
        await paginationPage.selectItemsPerPage(itemsPerPage.twenty);
        await taskPage.tasksListPage().getDataTable().waitForTableBody();
        await taskPage.filtersPage().sortByName('ASC');
        await taskPage.tasksListPage().getDataTable().waitForTableBody();
        const listAsc = await taskPage.filtersPage().getAllRowsNameColumn();
        await expect(JSON.stringify(listAsc) === JSON.stringify(taskNames)).toEqual(true);
        await taskPage.filtersPage().sortByName('DESC');
        const listDesc = await taskPage.filtersPage().getAllRowsNameColumn();

        taskNames.reverse();
        await expect(JSON.stringify(listDesc) === JSON.stringify(taskNames)).toEqual(true);
    });
});
