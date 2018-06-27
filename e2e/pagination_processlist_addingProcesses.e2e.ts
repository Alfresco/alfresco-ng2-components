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
var PaginationPage = require('./pages/adf/paginationPage.js');
var ProcessFiltersPage = require('./pages/adf/process_services/processFiltersPage.js');
var ProcessDetailsPage = require('./pages/adf/process_services/processDetailsPage.js');

var BasicAuthorization = require('./restAPI/httpRequest/BasicAuthorization');

var TestConfig = require('./test.config.js');
var resources = require('./util/resources.js');
var apps = require('./restAPI/APS/reusableActions/apps');
var users = require('./restAPI/APS/reusableActions/users');

xdescribe('Test Process List - Pagination when adding processes', () => {

    var itemsPerPage = {
        fifteen: '15',
        fifteenValue: 15
    };

    var adfLoginPage = new AdfLoginPage();
    var processServicesPage = new ProcessServicesPage();
    var paginationPage = new PaginationPage();
    var processFiltersPage = new ProcessFiltersPage();
    var processDetailsPage = new ProcessDetailsPage();

    var basicAuthAdmin = new BasicAuthorization(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
    var basicAuth;
    var processUserModel;
    var app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    var nrOfProcesses = 25;
    var page, totalPages, appDetails;

    beforeAll(function (done) {
        users.createTenantAndUser(basicAuthAdmin)
            .then(function (user) {
                processUserModel = user;
                basicAuth = new BasicAuthorization(user.email, user.password);
                apps.importPublishDeployApp(basicAuth, app.file_location)
                    .then(function (resultApp) {
                        appDetails = resultApp;
                        var arr = [];
                        for (var i = 0; i < nrOfProcesses; i++) {
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


    afterAll(function (done) {
        apps.cleanupApp(basicAuth, appDetails)
            .then(() => {
                return users.cleanupTenant(basicAuthAdmin, processUserModel.tenantId)
            })
            .then(() => {
                done();
            })
    });

    it('[C261046] Items per page set to 15 and adding of processes', () => {
        totalPages = 2;
        page = 1;
        processServicesPage.goToProcessServices().goToTaskApp().clickProcessButton();
        processDetailsPage.checkProcessTitleIsDisplayed();
        processFiltersPage.waitForTableBody();
        paginationPage.selectItemsPerPage(itemsPerPage.fifteen);
        processDetailsPage.checkProcessTitleIsDisplayed();
        processFiltersPage.waitForTableBody();
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + page);
        expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.fifteenValue * page + ' of ' + nrOfProcesses);
        expect(processFiltersPage.numberOfProcessRows()).toBe(itemsPerPage.fifteenValue);
        paginationPage.checkNextPageButtonIsEnabled();
        paginationPage.checkPreviousPageButtonIsDisabled();

        page++;
        paginationPage.clickOnNextPage();
        processDetailsPage.checkProcessTitleIsDisplayed();
        processFiltersPage.waitForTableBody();
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + page);
        expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 16-' + nrOfProcesses + ' of ' + nrOfProcesses);
        expect(processFiltersPage.numberOfProcessRows()).toBe(nrOfProcesses - itemsPerPage.fifteenValue);
        paginationPage.checkNextPageButtonIsDisabled();
        paginationPage.checkPreviousPageButtonIsEnabled();
    });
});






