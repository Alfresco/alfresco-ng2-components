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
import NavigationBarPage = require('./pages/adf/navigationBarPage.js');

import CONSTANTS = require('./util/constants');
import BasicAuthorization = require('./restAPI/httpRequest/BasicAuthorization');

import users = require('./restAPI/APS/reusableActions/users');
import apps = require('./restAPI/APS/reusableActions/apps');

import TestConfig = require('./test.config.js');
import resources = require('./util/resources.js');

xdescribe('Task List Pagination', () => {

    let adfLoginPage = new AdfLoginPage();
    let processServicesPage = new ProcessServicesPage();
    let taskPage = new TasksPage();
    let paginationPage = new PaginationPage();
    let navigationBarPage = new NavigationBarPage();

    let basicAuthAdmin = new BasicAuthorization(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
    let basicAuth, processUserModel, processUserModel1;
    let app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let currentPage = 1, nrOfTasks = 20, appDetails, totalPages;

    let itemsPerPage = {
        five: '5',
        fiveValue: 5,
        ten: '10',
        tenValue: 10,
        fifteen: '15',
        fifteenValue: 15,
        twenty: '20',
        twentyValue: 20,
        default: '25'
    };

    beforeAll( (done) => {
        users.createTenantAndUser(basicAuthAdmin)
            .then(function (user) {
                users.createTenantAndUser(basicAuthAdmin)
                    .then(function (response) {
                        processUserModel1 = response;
                    });
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
                            done();
                        });
                    })
                    .catch(function (error) {
                        done.fail('Create test precondition failed: ' + error);
                    });
            });
    });

    it('Pagination at first 20 started tasks', () => {
        adfLoginPage.loginToProcessServicesUsingUserModel(processUserModel);
        processServicesPage.goToProcessServices().goToTaskApp();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.default);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + nrOfTasks + ' of ' + nrOfTasks);
        expect(taskPage.getAllDisplayedRows()).toBe(nrOfTasks);
        paginationPage.checkNextPageButtonIsDisabled();
        paginationPage.checkPreviousPageButtonIsDisabled();
        paginationPage.selectItemsPerPage(itemsPerPage.twenty);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.twenty);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + nrOfTasks + ' of ' + nrOfTasks);
        navigationBarPage.clickLogoutButton();
    });

    it('Items per page set to 5', () => {
        adfLoginPage.loginToProcessServicesUsingUserModel(processUserModel);
        processServicesPage.goToProcessServices().goToTaskApp();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.INV_TASKS);
        paginationPage.selectItemsPerPage(itemsPerPage.five);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.fiveValue + ' of ' + nrOfTasks);
        expect(taskPage.getAllDisplayedRows()).toBe(itemsPerPage.fiveValue);
        paginationPage.clickOnNextPage();
        currentPage++;
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 6-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfTasks);
        expect(taskPage.getAllDisplayedRows()).toBe(itemsPerPage.fiveValue);
        paginationPage.clickOnNextPage();
        currentPage++;
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 11-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfTasks);
        expect(taskPage.getAllDisplayedRows()).toBe(itemsPerPage.fiveValue);
        paginationPage.clickOnNextPage();
        currentPage++;
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 16-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfTasks);
        expect(taskPage.getAllDisplayedRows()).toBe(itemsPerPage.fiveValue);
        navigationBarPage.clickLogoutButton();
        adfLoginPage.loginToProcessServicesUsingUserModel(processUserModel);
        processServicesPage.goToProcessServices().goToTaskApp();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.INV_TASKS);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        navigationBarPage.clickLogoutButton();
    });

    it('Items per page set to 10', () => {
        adfLoginPage.loginToProcessServicesUsingUserModel(processUserModel);
        processServicesPage.goToProcessServices().goToTaskApp();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.INV_TASKS);
        paginationPage.selectItemsPerPage(itemsPerPage.ten);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.tenValue + ' of ' + nrOfTasks);
        expect(taskPage.getAllDisplayedRows()).toBe(itemsPerPage.tenValue);
        paginationPage.clickOnNextPage();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 11-' + itemsPerPage.twentyValue + ' of ' + nrOfTasks);
        expect(taskPage.getAllDisplayedRows()).toBe(itemsPerPage.tenValue);
        navigationBarPage.clickLogoutButton();
        adfLoginPage.loginToProcessServicesUsingUserModel(processUserModel);
        processServicesPage.goToProcessServices().goToTaskApp();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.INV_TASKS);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        navigationBarPage.clickLogoutButton();
    });

    it('Items per page set to 15', () => {
        adfLoginPage.loginToProcessServicesUsingUserModel(processUserModel);
        processServicesPage.goToProcessServices().goToTaskApp();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.INV_TASKS);
        paginationPage.selectItemsPerPage(itemsPerPage.fifteen);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.fifteenValue + ' of ' + nrOfTasks);
        expect(taskPage.getAllDisplayedRows()).toBe(itemsPerPage.fifteenValue);
        paginationPage.clickOnNextPage();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 16-' + itemsPerPage.twentyValue + ' of ' + nrOfTasks);
        expect(taskPage.getAllDisplayedRows()).toBe(itemsPerPage.fiveValue);
        navigationBarPage.clickLogoutButton();
        adfLoginPage.loginToProcessServicesUsingUserModel(processUserModel);
        processServicesPage.goToProcessServices().goToTaskApp();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.INV_TASKS);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
    });

    it('[C261006] Page number dropdown', () => {
        currentPage = 1;
        totalPages = 2;
        processServicesPage.goToProcessServices().goToTaskApp();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.INV_TASKS);
        taskPage.usingTasksListPage().waitForTableBody();
        paginationPage.selectItemsPerPage(itemsPerPage.ten);
        taskPage.usingTasksListPage().waitForTableBody();
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + currentPage);
        expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.tenValue * currentPage + ' of ' + nrOfTasks);
        expect(taskPage.getAllDisplayedRows()).toBe(itemsPerPage.tenValue);
        paginationPage.checkNextPageButtonIsEnabled();
        paginationPage.checkPreviousPageButtonIsDisabled();

        paginationPage.clickOnPageDropdown();
        expect(paginationPage.getPageDropdownOptions()).toEqual(['1', '2']);
        currentPage = 2;
        paginationPage.clickOnPageDropdownOption('2');
        taskPage.usingTasksListPage().waitForTableBody();
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + currentPage);
        expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 11-' + itemsPerPage.tenValue * currentPage + ' of ' + nrOfTasks);
        expect(taskPage.getAllDisplayedRows()).toBe(itemsPerPage.tenValue);
        paginationPage.checkNextPageButtonIsDisabled();
        paginationPage.checkPreviousPageButtonIsEnabled();

        paginationPage.clickOnPageDropdown();
        expect(paginationPage.getPageDropdownOptions()).toEqual(['1', '2']);
        currentPage = 1;
        paginationPage.clickOnPageDropdownOption('1');
        taskPage.usingTasksListPage().waitForTableBody();
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + currentPage);
        expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.tenValue * currentPage + ' of ' + nrOfTasks);
        expect(taskPage.getAllDisplayedRows()).toBe(itemsPerPage.tenValue);
        paginationPage.checkNextPageButtonIsEnabled();
        paginationPage.checkPreviousPageButtonIsDisabled();
    });

    it('Pagination in an empty task list', () => {
        adfLoginPage.loginToProcessServicesUsingUserModel(processUserModel1);
        processServicesPage.goToProcessServices().goToTaskApp();
        paginationPage.checkPaginationIsNotDisplayed();
    });

});
