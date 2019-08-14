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

import { LoginPage } from '@alfresco/adf-testing';
import { TasksPage } from '../pages/adf/process-services/tasksPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { PaginationPage } from '@alfresco/adf-testing';

import CONSTANTS = require('../util/constants');

import { browser } from 'protractor';
import resources = require('../util/resources');
import { Util } from '../util/util';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { AppsActions } from '../actions/APS/apps.actions';
import { UsersActions } from '../actions/users.actions';

describe('Task List Pagination - Sorting', () => {

    const loginPage = new LoginPage();
    const taskPage = new TasksPage();
    const paginationPage = new PaginationPage();

    const app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    const nrOfTasks = 20;
    let processUserModel;
    const taskNameBase = 'Task';
    const taskNames = Util.generateSequenceFiles(10, nrOfTasks + 9, taskNameBase, '');

    const itemsPerPage = {
        five: '5',
        fiveValue: 5,
        ten: '10',
        tenValue: 10,
        twenty: '20',
        twentyValue: 20
    };

    beforeAll(async () => {
        const apps = new AppsActions();
        const users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        processUserModel = await users.createTenantAndUser(this.alfrescoJsApi);

        await this.alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

        for (let i = 0; i < nrOfTasks; i++) {
            await this.alfrescoJsApi.activiti.taskApi.createNewTask({ name: taskNames[i] });
        }

        await loginPage.loginToProcessServicesUsingUserModel(processUserModel);

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
