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

import AdfLoginPage = require('./pages/adf/loginPage.js');
import ProcessServicesPage = require('./pages/adf/process_services/processServicesPage.js');
import TasksPage = require('./pages/adf/process_services/tasksPage.js');
import PaginationPage = require('./pages/adf/paginationPage.js');

import apps = require('./restAPI/APS/reusableActions/apps');
import CONSTANTS = require('./util/constants');

import BasicAuthorization = require('./restAPI/httpRequest/BasicAuthorization');
import users = require('./restAPI/APS/reusableActions/users');
import taskAPI = require('./restAPI/APS/enterprise/TaskAPI');
import StandaloneTask = require('./models/APS/StandaloneTask');

import TestConfig = require('./test.config.js');
import resources = require('./util/resources.js');
import Util = require('./util/util.js');

xdescribe('Task List Pagination - Sorting', () => {

    let adfLoginPage = new AdfLoginPage();
    let processServicesPage = new ProcessServicesPage();
    let taskPage = new TasksPage();
    let paginationPage = new PaginationPage();

    let basicAuthAdmin = new BasicAuthorization(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
    let basicAuth, processUserModel;
    let app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let nrOfTasks = 20, appDetails;
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

    beforeAll( (done) => {
        users.createTenantAndUser(basicAuthAdmin)
            .then(function (user) {
                processUserModel = user;
                basicAuth = new BasicAuthorization(user.email, user.password);
                apps.importPublishDeployApp(basicAuth, app.file_location)
                    .then(function (resultApp) {
                        appDetails = resultApp;
                        let arr = [];
                        for (let i = 0; i < nrOfTasks; i++) {
                            arr.push(taskAPI.createStandaloneTask(basicAuth, new StandaloneTask({name: taskNames[i]})));
                        }

                        Promise.all(arr).then(() => {
                            done();
                        });
                    })
                    .catch(function (error) {
                        done.fail('Create test precondition failed: ' + error);
                    });
            });
    });

    afterAll((done) => {
        apps.cleanupApp(basicAuth, appDetails)
            .then(() => {
                return users.cleanupTenant(basicAuthAdmin, processUserModel.tenantId);
            })
            .then(() => {
                done();
            });
    });

    it('[C260308] Sorting by Name', () => {
        adfLoginPage.loginToProcessServicesUsingUserModel(processUserModel);
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
