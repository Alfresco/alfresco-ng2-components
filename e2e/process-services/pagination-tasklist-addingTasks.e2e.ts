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
import { PaginationPage } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';

import CONSTANTS = require('../util/constants');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { AppsActions } from '../actions/APS/apps.actions';
import { UsersActions } from '../actions/users.actions';

import resources = require('../util/resources');
import { browser } from 'protractor';

describe('Items per page set to 15 and adding of tasks', () => {

    const loginPage = new LoginPage();
    const taskPage = new TasksPage();
    const paginationPage = new PaginationPage();

    let processUserModel;
    const app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let currentPage = 1;
    const nrOfTasks = 25;
    const totalPages = 2;
    let i;
    let resultApp;

    const apps = new AppsActions();

    const itemsPerPage = {
        fifteen: '15',
        fifteenValue: 15
    };

    beforeAll(async () => {
        const users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        processUserModel = await users.createTenantAndUser(this.alfrescoJsApi);

        await this.alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        resultApp = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

        for (i = 0; i < (nrOfTasks - 5); i++) {
            await apps.startProcess(this.alfrescoJsApi, resultApp);
        }

        await loginPage.loginToProcessServicesUsingUserModel(processUserModel);

    });

    it('[C260306] Items per page set to 15 and adding of tasks', async () => {
        await (await new NavigationBarPage().navigateToProcessServicesPage()).goToTaskApp();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await paginationPage.selectItemsPerPage(itemsPerPage.fifteen);
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        await expect(await paginationPage.getCurrentPage()).toEqual('Page ' + currentPage);
        await expect(await paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        await expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.fifteenValue + ' of ' + (nrOfTasks - 5));
        await expect(await taskPage.tasksListPage().getDataTable().numberOfRows()).toBe(itemsPerPage.fifteenValue);

        for (i; i < nrOfTasks; i++) {
            await apps.startProcess(this.alfrescoJsApi, resultApp);
        }

        currentPage++;
        await paginationPage.clickOnNextPage();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        await expect(await paginationPage.getCurrentPage()).toEqual('Page ' + currentPage);
        await expect(await paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        await expect(await paginationPage.getPaginationRange()).toEqual('Showing 16-' + nrOfTasks + ' of ' + nrOfTasks);
        await expect(await taskPage.tasksListPage().getDataTable().numberOfRows()).toBe(nrOfTasks - itemsPerPage.fifteenValue);
        await paginationPage.checkNextPageButtonIsDisabled();
        await paginationPage.checkPreviousPageButtonIsEnabled();
    });

});
