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

var BasicAuthorization = require('./restAPI/httpRequest/BasicAuthorization');
var users = require('./restAPI/APS/reusableActions/users');
var taskAPI = require('./restAPI/APS/enterprise/TaskAPI');
var StandaloneTask = require('./models/APS/StandaloneTask');

var TestConfig = require('./test.config.js');
var resources = require('./util/resources.js');
var Util = require('./util/util.js');

xdescribe('Task List Pagination - Sorting', () =>{

    var adfLoginPage = new AdfLoginPage();
    var processServicesPage = new ProcessServicesPage();
    var taskPage = new TasksPage();
    var paginationPage = new PaginationPage();

    var basicAuthAdmin = new BasicAuthorization(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
    var basicAuth, processUserModel;
    var app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    var nrOfTasks = 20, appDetails;
    var taskNameBase = 'Task';
    var taskNames = Util.generateSeqeunceFiles(10, nrOfTasks + 9, taskNameBase, '');

    var itemsPerPage = {
        five: '5',
        fiveValue: 5,
        ten: '10',
        tenValue: 10,
        twenty: '20',
        twentyValue: 20
    };

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
                            arr.push(taskAPI.createStandaloneTask(basicAuth, new StandaloneTask({name: taskNames[i]})));
                        }

                        Promise.all(arr).then(() =>{
                            done();
                        });
                    })
                    .catch(function (error) {
                        done.fail('Create test precondition failed: ' + error);
                    });
            });
    });

    afterAll(function (done) {
        apps.cleanupApp(basicAuth, appDetails)
            .then(() =>{
                return users.cleanupTenant(basicAuthAdmin, processUserModel.tenantId)
            })
            .then(() =>{
                done();
            })
    });

    it('[C260308] Sorting by Name', () =>{
        adfLoginPage.loginToProcessServicesUsingUserModel(processUserModel);
        processServicesPage.goToProcessServices().goToTaskApp();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.INV_TASKS);
        taskPage.usingTasksListPage().waitForTableBody();
        paginationPage.selectItemsPerPage(itemsPerPage.twenty);
        taskPage.usingTasksListPage().waitForTableBody();
        taskPage.usingFiltersPage().sortByName(true);
        taskPage.usingTasksListPage().waitForTableBody();
        taskPage.usingFiltersPage().getAllRowsNameColumn().then(function (list) {
            expect(JSON.stringify(list) == JSON.stringify(taskNames)).toEqual(true);
        });
        taskPage.usingFiltersPage().sortByName(false);
        taskPage.usingFiltersPage().getAllRowsNameColumn().then(function (list) {
            taskNames.reverse();
            expect(JSON.stringify(list) == JSON.stringify(taskNames)).toEqual(true);
        });
    });

});


