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

var AdfLoginPage = require('./pages/adf/loginPage.js');
var ProcessServicesPage = require('./pages/adf/process_services/processServicesPage.js');
var TasksPage = require('./pages/adf/process_services/tasksPage.js');
var PaginationPage = require('./pages/adf/paginationPage.js');

var apps = require('./restAPI/APS/reusableActions/apps');
var CONSTANTS = require('./util/constants');

var TestConfig = require('./test.config.js');
var resources = require('./util/resources.js');

xdescribe('Items per page set to 15 and adding of tasks', () => {

    var adfLoginPage = new AdfLoginPage();
    var processServicesPage = new ProcessServicesPage();
    var taskPage = new TasksPage();
    var paginationPage = new PaginationPage();

    var basicAuthAdmin = new BasicAuthorization(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
    var basicAuth, processUserModel;
    var app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    var currentPage = 1, nrOfTasks = 25, appDetails, totalPages = 2;

    var itemsPerPage = {
        fifteen: '15',
        fifteenValue: 15
    };

    afterAll(function (done) {
        apps.cleanupApp(basicAuth, appDetails)
            .then(() => {
                return users.cleanupTenant(basicAuthAdmin, processUserModel.tenantId)
            })
            .then(() => {
                done();
            })
    });

    beforeAll(function (done) {
        users.createTenantAndUser(basicAuthAdmin)
            .then(function (user) {
                processUserModel = user;
                basicAuth = new BasicAuthorization(user.email, user.password);
                apps.importPublishDeployApp(basicAuth, app.file_location)
                    .then(function (resultApp) {
                        appDetails = resultApp;
                        var arr = [];
                        for (var i = 0; i < nrOfTasks; i++) {
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
