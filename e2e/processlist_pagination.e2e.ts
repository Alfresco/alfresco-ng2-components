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
import PaginationPage = require('./pages/adf/paginationPage');
import ProcessFiltersPage = require('./pages/adf/process_services/processFiltersPage');
import ProcessDetailsPage = require('./pages/adf/process_services/processDetailsPage');

import TestConfig = require('./test.config');
import resources = require('./util/resources');

import Util = require('./util/util');

import AlfrescoApi = require('alfresco-js-api-node');
import { AppsActions } from './actions/APS/apps.actions';
import { UsersActions } from './actions/users.actions';

describe('Process List - Pagination', function () {

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

    let processFilterRunning = 'Running';

    let loginPage = new LoginPage();
    let processServicesPage = new ProcessServicesPage();
    let paginationPage = new PaginationPage();
    let processFiltersPage = new ProcessFiltersPage();
    let processDetailsPage = new ProcessDetailsPage();

    let processUserModel;
    let app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let nrOfProcesses = 20;
    let page, totalPages, processNameBase = 'process';
    let processNames = Util.generateSeqeunceFiles(10, nrOfProcesses + 9, processNameBase, '');

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

        for (let i = 0; i < nrOfProcesses; i++) {
            await apps.startProcess(this.alfrescoJsApi, resultApp);
        }

        loginPage.loginToProcessServicesUsingUserModel(processUserModel);

        done();
    });

    xit('[C261042] Default pagination', function () {
        processServicesPage.goToProcessServices().goToTaskApp().clickProcessButton();
        processFiltersPage.checkNoContentMessage();
        paginationPage.checkPaginationIsNotDisplayed();

        page = 1;
        totalPages = 1;
        processServicesPage.goToProcessServices().goToTaskApp().clickProcessButton();
        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.checkFilterIsHighlighted(processFilterRunning);
        processDetailsPage.checkProcessTitleIsDisplayed();
        processFiltersPage.waitForTableBody();
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + page);
        expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);

        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.twenty);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + nrOfProcesses + ' of ' + nrOfProcesses);
        expect(processFiltersPage.numberOfProcessRows()).toBe(nrOfProcesses);
        paginationPage.checkNextPageButtonIsDisabled();
        paginationPage.checkPreviousPageButtonIsDisabled();
    });

    xit('[C261043] Items per page set to 15', function () {
        page = 1;
        totalPages = 2;
        processServicesPage.goToProcessServices().goToTaskApp().clickProcessButton();
        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.checkFilterIsHighlighted(processFilterRunning);
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

        page = 1;
        processServicesPage.goToProcessServices().goToTaskApp().clickProcessButton();
        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.checkFilterIsHighlighted(processFilterRunning);
        processDetailsPage.checkProcessTitleIsDisplayed();
        processFiltersPage.waitForTableBody();
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + page);
        expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
    });

    xit('[C261044] Items per page set to 10', function () {
        page = 1;
        totalPages = 2;
        processServicesPage.goToProcessServices().goToTaskApp().clickProcessButton();
        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.checkFilterIsHighlighted(processFilterRunning);
        processDetailsPage.checkProcessTitleIsDisplayed();
        processFiltersPage.waitForTableBody();
        paginationPage.selectItemsPerPage(itemsPerPage.ten);
        processDetailsPage.checkProcessTitleIsDisplayed();
        processFiltersPage.waitForTableBody();
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + page);
        expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.tenValue * page + ' of ' + nrOfProcesses);
        expect(processFiltersPage.numberOfProcessRows()).toBe(itemsPerPage.tenValue);
        paginationPage.checkNextPageButtonIsEnabled();
        paginationPage.checkPreviousPageButtonIsDisabled();

        page++;
        paginationPage.clickOnNextPage();
        processDetailsPage.checkProcessTitleIsDisplayed();
        processFiltersPage.waitForTableBody();
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + page);
        expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 11-' + nrOfProcesses + ' of ' + nrOfProcesses);
        expect(processFiltersPage.numberOfProcessRows()).toBe(itemsPerPage.tenValue);
        paginationPage.checkNextPageButtonIsDisabled();
        paginationPage.checkPreviousPageButtonIsEnabled();

        page = 1;
        processServicesPage.goToProcessServices().goToTaskApp().clickProcessButton();
        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.checkFilterIsHighlighted(processFilterRunning);
        processDetailsPage.checkProcessTitleIsDisplayed();
        processFiltersPage.waitForTableBody();
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + page);
        expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
    });

    it('[C261047] Items per page set to 20', function () {
        page = 1;
        totalPages = 1;
        processServicesPage.goToProcessServices().goToTaskApp().clickProcessButton();
        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.checkFilterIsHighlighted(processFilterRunning);
        processDetailsPage.checkProcessTitleIsDisplayed();
        processFiltersPage.waitForTableBody();
        paginationPage.selectItemsPerPage(itemsPerPage.twenty);
        processDetailsPage.checkProcessTitleIsDisplayed();
        processFiltersPage.waitForTableBody();
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + page);
        expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.twenty);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + nrOfProcesses + ' of ' + nrOfProcesses);
        expect(processFiltersPage.numberOfProcessRows()).toBe(nrOfProcesses);
        paginationPage.checkNextPageButtonIsDisabled();
        paginationPage.checkPreviousPageButtonIsDisabled();

        processServicesPage.goToProcessServices().goToTaskApp().clickProcessButton();
        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.checkFilterIsHighlighted(processFilterRunning);
        processDetailsPage.checkProcessTitleIsDisplayed();
        processFiltersPage.waitForTableBody();
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + page);
        expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.twenty);
    });

    it('[C261045] 5 Items per page', function () {
        page = 1;
        totalPages = 4;
        processServicesPage.goToProcessServices().goToTaskApp().clickProcessButton();
        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.checkFilterIsHighlighted(processFilterRunning);
        processDetailsPage.checkProcessTitleIsDisplayed();
        processFiltersPage.waitForTableBody();
        paginationPage.selectItemsPerPage(itemsPerPage.five);
        processDetailsPage.checkProcessTitleIsDisplayed();
        processFiltersPage.waitForTableBody();
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + page);
        expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.five * page + ' of ' + nrOfProcesses);
        expect(processFiltersPage.numberOfProcessRows()).toBe(itemsPerPage.fiveValue);
        paginationPage.checkNextPageButtonIsEnabled();
        paginationPage.checkPreviousPageButtonIsDisabled();

        page++;
        paginationPage.clickOnNextPage();
        processDetailsPage.checkProcessTitleIsDisplayed();
        processFiltersPage.waitForTableBody();
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + page);
        expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 6-' + itemsPerPage.five * page + ' of ' + nrOfProcesses);
        expect(processFiltersPage.numberOfProcessRows()).toBe(itemsPerPage.fiveValue);
        paginationPage.checkNextPageButtonIsEnabled();
        paginationPage.checkPreviousPageButtonIsEnabled();

        page++;
        paginationPage.clickOnNextPage();
        processDetailsPage.checkProcessTitleIsDisplayed();
        processFiltersPage.waitForTableBody();
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + page);
        expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 11-' + itemsPerPage.five * page + ' of ' + nrOfProcesses);
        expect(processFiltersPage.numberOfProcessRows()).toBe(itemsPerPage.fiveValue);
        paginationPage.checkNextPageButtonIsEnabled();
        paginationPage.checkPreviousPageButtonIsEnabled();

        page++;
        paginationPage.clickOnNextPage();
        processDetailsPage.checkProcessTitleIsDisplayed();
        processFiltersPage.waitForTableBody();
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + page);
        expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 16-' + itemsPerPage.five * page + ' of ' + nrOfProcesses);
        expect(processFiltersPage.numberOfProcessRows()).toBe(itemsPerPage.fiveValue);
        paginationPage.checkNextPageButtonIsDisabled();
        paginationPage.checkPreviousPageButtonIsEnabled();

        page = 1;
        processServicesPage.goToProcessServices().goToTaskApp().clickProcessButton();
        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.checkFilterIsHighlighted(processFilterRunning);
        processDetailsPage.checkProcessTitleIsDisplayed();
        processFiltersPage.waitForTableBody();
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + page);
        expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
    });

    it('[C261049] Page number dropdown', function () {
        page = 1;
        totalPages = 2;
        processServicesPage.goToProcessServices().goToTaskApp().clickProcessButton();
        processFiltersPage.clickRunningFilterButton();
        processDetailsPage.checkProcessTitleIsDisplayed();
        processFiltersPage.waitForTableBody();
        paginationPage.selectItemsPerPage(itemsPerPage.ten);
        processDetailsPage.checkProcessTitleIsDisplayed();
        processFiltersPage.waitForTableBody();
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + page);
        expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.tenValue * page + ' of ' + nrOfProcesses);
        expect(processFiltersPage.numberOfProcessRows()).toBe(itemsPerPage.tenValue);
        paginationPage.checkNextPageButtonIsEnabled();
        paginationPage.checkPreviousPageButtonIsDisabled();

        paginationPage.clickOnPageDropdown();
        expect(paginationPage.getPageDropdownOptions()).toEqual(['1', '2']);
        page = 2;
        paginationPage.clickOnPageDropdownOption('2');
        processDetailsPage.checkProcessTitleIsDisplayed();
        processFiltersPage.waitForTableBody();
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + page);
        expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 11-' + itemsPerPage.tenValue * page + ' of ' + nrOfProcesses);
        expect(processFiltersPage.numberOfProcessRows()).toBe(itemsPerPage.tenValue);
        paginationPage.checkNextPageButtonIsDisabled();
        paginationPage.checkPreviousPageButtonIsEnabled();

        paginationPage.clickOnPageDropdown();
        expect(paginationPage.getPageDropdownOptions()).toEqual(['1', '2']);
        page = 1;
        paginationPage.clickOnPageDropdownOption('1');
        processDetailsPage.checkProcessTitleIsDisplayed();
        processFiltersPage.waitForTableBody();
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + page);
        expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.tenValue * page + ' of ' + nrOfProcesses);
        expect(processFiltersPage.numberOfProcessRows()).toBe(itemsPerPage.tenValue);
        paginationPage.checkNextPageButtonIsEnabled();
        paginationPage.checkPreviousPageButtonIsDisabled();
    });

    xit('[C261048] Sorting by Name', function () {
        processServicesPage.goToProcessServices().goToTaskApp().clickProcessButton();
        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.checkFilterIsHighlighted(processFilterRunning);
        processDetailsPage.checkProcessTitleIsDisplayed();
        processFiltersPage.waitForTableBody();
        paginationPage.selectItemsPerPage(itemsPerPage.twenty);
        processDetailsPage.checkProcessTitleIsDisplayed();
        processFiltersPage.waitForTableBody();
        processFiltersPage.sortByName(true);
        processFiltersPage.waitForTableBody();
        processFiltersPage.getAllRowsNameColumn().then(function (list) {
            expect(JSON.stringify(list) === JSON.stringify(processNames)).toEqual(true);
        });
        processFiltersPage.sortByName(false);
        processFiltersPage.getAllRowsNameColumn().then(function (list) {
            processNames.reverse();
            expect(JSON.stringify(list) === JSON.stringify(processNames)).toEqual(true);
        });
    });
});
