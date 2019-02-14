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

import { LoginPage } from '../pages/adf/loginPage';
import { TasksPage } from '../pages/adf/process-services/tasksPage';
import { PaginationPage } from '../pages/adf/paginationPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';

import CONSTANTS = require('../util/constants');

import AlfrescoApi = require('alfresco-js-api-node');
import { AppsActions } from '../actions/APS/apps.actions';
import { UsersActions } from '../actions/users.actions';

import TestConfig = require('../test.config');
import resources = require('../util/resources');
import { browser } from 'protractor';

describe('Items per page set to 15 and adding of tasks', () => {

    let loginPage = new LoginPage();
    let taskPage = new TasksPage();
    let paginationPage = new PaginationPage();

    let processUserModel;
    let app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let currentPage = 1, nrOfTasks = 25, totalPages = 2, i, resultApp;

    let apps = new AppsActions();

    let itemsPerPage = {
        fifteen: '15',
        fifteenValue: 15
    };

    beforeAll(async (done) => {
        let users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        processUserModel = await users.createTenantAndUser(this.alfrescoJsApi);

        await this.alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        resultApp = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

        for (i = 0; i < (nrOfTasks - 5); i++) {
            await apps.startProcess(this.alfrescoJsApi, resultApp);
        }

        loginPage.loginToProcessServicesUsingUserModel(processUserModel);

        done();
    });

    it('[C260306] Items per page set to 15 and adding of tasks', () => {
        new NavigationBarPage().navigateToProcessServicesPage().goToTaskApp();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        paginationPage.selectItemsPerPage(itemsPerPage.fifteen);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + currentPage);
        expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.fifteenValue + ' of ' + (nrOfTasks - 5));
        expect(taskPage.tasksListPage().getDataTable().numberOfRows()).toBe(itemsPerPage.fifteenValue);

        browser.controlFlow().execute(async () => {
            for (i; i < nrOfTasks; i++) {
                await apps.startProcess(this.alfrescoJsApi, resultApp);
            }
        });

        currentPage++;
        paginationPage.clickOnNextPage();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + currentPage);
        expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 16-' + nrOfTasks + ' of ' + nrOfTasks);
        expect(taskPage.tasksListPage().getDataTable().numberOfRows()).toBe(nrOfTasks - itemsPerPage.fifteenValue);
        paginationPage.checkNextPageButtonIsDisabled();
        paginationPage.checkPreviousPageButtonIsEnabled();
    });

});
