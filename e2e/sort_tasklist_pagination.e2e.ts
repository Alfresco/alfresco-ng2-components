/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import LoginPage = require('./pages/adf/loginPage');
import ProcessServicesPage = require('./pages/adf/process_services/processServicesPage');
import TasksPage = require('./pages/adf/process_services/tasksPage');
import PaginationPage = require('./pages/adf/paginationPage');

import CONSTANTS = require('./util/constants');

import TestConfig = require('./test.config');
import resources = require('./util/resources');
import Util = require('./util/util');

import AlfrescoApi = require('alfresco-js-api-node');
import { AppsActions } from './actions/APS/apps.actions';
import { UsersActions } from './actions/users.actions';

describe('Task List Pagination - Sorting', () => {

    let loginPage = new LoginPage();
    let processServicesPage = new ProcessServicesPage();
    let taskPage = new TasksPage();
    let paginationPage = new PaginationPage();

    let app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let nrOfTasks = 20, processUserModel;
    let taskNameBase = 'Task';
    let taskNames = Util.generateSeqeunceFiles(10, nrOfTasks + 9, taskNameBase, '');

    let itemsPerPage = {
        five: '5',
        fiveValue: 5,
        ten: '10',
        tenValue: 10,
        twenty: '20',
        twentyValue: 20
    };

    beforeAll(async (done) => {
        let apps = new AppsActions();
        let users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        processUserModel = await users.createTenantAndUser(this.alfrescoJsApi);

        await this.alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        let resultApp = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

        for (let i = 0; i < nrOfTasks; i++) {
            this.alfrescoJsApi.activiti.taskApi.createNewTask({name: taskNames[i]});
        }

        loginPage.loginToProcessServicesUsingUserModel(processUserModel);

        done();
    });

    it('[C260308] Sorting by Name', () => {
        processServicesPage.goToProcessServices().goToTaskApp();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.INV_TASKS);
        taskPage.usingTasksListPage().waitForTableBody();
        paginationPage.selectItemsPerPage(itemsPerPage.twenty);
        taskPage.usingTasksListPage().waitForTableBody();
        taskPage.usingFiltersPage().sortByName(true);
        taskPage.usingTasksListPage().waitForTableBody();
        taskPage.usingFiltersPage().getAllRowsNameColumn().then(function (list) {
            expect(JSON.stringify(list) === JSON.stringify(taskNames)).toEqual(true);
        });
        taskPage.usingFiltersPage().sortByName(false);
        taskPage.usingFiltersPage().getAllRowsNameColumn().then(function (list) {
            taskNames.reverse();
            expect(JSON.stringify(list) === JSON.stringify(taskNames)).toEqual(true);
        });
    });

});
