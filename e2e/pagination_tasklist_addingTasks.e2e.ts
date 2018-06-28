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

import TestConfig = require('./test.config.js');
import resources = require('./util/resources.js');

xdescribe('Items per page set to 15 and adding of tasks', () => {

    let adfLoginPage = new AdfLoginPage();
    let processServicesPage = new ProcessServicesPage();
    let taskPage = new TasksPage();
    let paginationPage = new PaginationPage();

    let basicAuthAdmin = new BasicAuthorization(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
    let basicAuth, processUserModel;
    let app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let currentPage = 1, nrOfTasks = 25, appDetails, totalPages = 2;

    let itemsPerPage = {
        fifteen: '15',
        fifteenValue: 15
    };

    afterAll((done) => {
        apps.cleanupApp(basicAuth, appDetails)
            .then(() => {
                return users.cleanupTenant(basicAuthAdmin, processUserModel.tenantId);
            })
            .then(() => {
                done();
            });
    });

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
                            arr.push(apps.startProcess(basicAuth, resultApp));
                        }

                        Promise.all(arr).then(() => {
                            adfLoginPage.loginToProcessServicesUsingUserModel(processUserModel);
                            done();
                        });
                    })
                    .catch(function (error) {
                        done.fail('Create test precondition failed: ' + error);
                    });
            });
    });

    it('Items per page set to 15 and adding of tasks', () => {
        processServicesPage.goToProcessServices().goToTaskApp();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.INV_TASKS);
        paginationPage.selectItemsPerPage(itemsPerPage.fifteen);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + currentPage);
        expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.fifteenValue + ' of ' + nrOfTasks);
        expect(taskPage.getAllDisplayedRows()).toBe(itemsPerPage.fifteenValue);
        currentPage++;
        paginationPage.clickOnNextPage();

        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + currentPage);
        expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 16-' + nrOfTasks + ' of ' + nrOfTasks);
        expect(taskPage.getAllDisplayedRows()).toBe(nrOfTasks - itemsPerPage.fifteenValue);
        paginationPage.checkNextPageButtonIsDisabled();
        paginationPage.checkPreviousPageButtonIsEnabled();
    });

});
