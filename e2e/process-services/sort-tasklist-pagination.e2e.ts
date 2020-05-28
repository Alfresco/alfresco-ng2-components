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

import { StringUtil, LoginSSOPage, PaginationPage, ApplicationsUtil, ApiService } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { UsersActions } from '../actions/users.actions';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';
import { TasksPage } from '../pages/adf/process-services/tasks.page';
import CONSTANTS = require('../util/constants');
import { TaskRepresentation } from '@alfresco/js-api/src/api/activiti-rest-api/model/taskRepresentation';

describe('Task List Pagination - Sorting', () => {

    const loginPage = new LoginSSOPage();
    const taskPage = new TasksPage();
    const paginationPage = new PaginationPage();
    const alfrescoJsApi = new ApiService().apiService;

    const app = browser.params.resources.Files.SIMPLE_APP_WITH_USER_FORM;
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
        const users = new UsersActions();

        await alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        processUserModel = await users.createTenantAndUser(alfrescoJsApi);

        await alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        const applicationsService = new ApplicationsUtil(alfrescoJsApi);

        await applicationsService.importPublishDeployApp(app.file_path);

        for (let i = 0; i < nrOfTasks; i++) {
            await alfrescoJsApi.activiti.taskApi.createNewTask(new TaskRepresentation({ name: taskNames[i] }));
        }

        await loginPage.login(processUserModel.email, processUserModel.password);
   });

    it('[C260308] Should be possible to sort tasks by name', async () => {
        await (await new NavigationBarPage().navigateToProcessServicesPage()).goToTaskApp();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await taskPage.tasksListPage().getDataTable().waitForTableBody();
        await paginationPage.selectItemsPerPage(itemsPerPage.twenty);
        await taskPage.tasksListPage().getDataTable().waitForTableBody();
        await taskPage.filtersPage().sortByName('ASC');
        await taskPage.tasksListPage().getDataTable().waitForTableBody();
        await taskPage.filtersPage().getAllRowsNameColumn().then(async (list) => {
            await expect(JSON.stringify(list) === JSON.stringify(taskNames)).toEqual(true);
        });
        await taskPage.filtersPage().sortByName('DESC');
        await taskPage.filtersPage().getAllRowsNameColumn().then(async (list) => {
            taskNames.reverse();
            await expect(JSON.stringify(list) === JSON.stringify(taskNames)).toEqual(true);
        });
    });
});
