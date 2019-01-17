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
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { PaginationPage } from '../pages/adf/paginationPage';
import { ProcessFiltersPage } from '../pages/adf/process-services/processFiltersPage';
import { ProcessDetailsPage } from '../pages/adf/process-services/processDetailsPage';

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { AppsActions } from '../actions/APS/apps.actions';
import { UsersActions } from '../actions/users.actions';

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
    let navigationBarPage = new NavigationBarPage();
    let paginationPage = new PaginationPage();
    let processFiltersPage = new ProcessFiltersPage();
    let processDetailsPage = new ProcessDetailsPage();
    let deployedTestApp;
    let processUserModel;
    let app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let nrOfProcesses = 20;
    let page, totalPages, processNameBase = 'process';

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

        deployedTestApp = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

        loginPage.loginToProcessServicesUsingUserModel(processUserModel);

        done();
    });

    describe('Empty processes', function () {

        it('[C280015] Should show empty content message an no pagination when no process are present', function () {
            navigationBarPage.navigateToProcessServicesPage().goToTaskApp().clickProcessButton();
            processFiltersPage.checkNoContentMessage();
            paginationPage.checkPaginationIsNotDisplayed();
        });
    });

    describe('With processes Pagination', function () {

        beforeAll(async (done) => {
            let apps = new AppsActions();

            this.alfrescoJsApi = new AlfrescoApi({
                provider: 'BPM',
                hostBpm: TestConfig.adf.url
            });

            await this.alfrescoJsApi.login(processUserModel.email, processUserModel.password);

            for (let i = 0; i < nrOfProcesses; i++) {
                await apps.startProcess(this.alfrescoJsApi, deployedTestApp, processNameBase + (i < 10 ? `0${i}` : i));
            }

            done();
        });

        beforeEach(async (done) => {
            await navigationBarPage.navigateToProcessServicesPage().goToTaskApp().clickProcessButton();
            done();
        });

        it('[C261042] Should display default pagination', function () {
            page = 1;
            totalPages = 1;
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

        it('[C261043] Should be possible to Items per page to 15', function () {
            page = 1;
            totalPages = 2;
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
            navigationBarPage.navigateToProcessServicesPage().goToTaskApp().clickProcessButton();
            processFiltersPage.clickRunningFilterButton();
            processFiltersPage.checkFilterIsHighlighted(processFilterRunning);
            processDetailsPage.checkProcessTitleIsDisplayed();
            processFiltersPage.waitForTableBody();
            expect(paginationPage.getCurrentPage()).toEqual('Page ' + page);
            expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);
            expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        });

        it('[C261044] Should be possible to Items per page to 10', function () {
            page = 1;
            totalPages = 2;
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
            navigationBarPage.navigateToProcessServicesPage().goToTaskApp().clickProcessButton();
            processFiltersPage.clickRunningFilterButton();
            processFiltersPage.checkFilterIsHighlighted(processFilterRunning);
            processDetailsPage.checkProcessTitleIsDisplayed();
            processFiltersPage.waitForTableBody();
            expect(paginationPage.getCurrentPage()).toEqual('Page ' + page);
            expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);
            expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        });

        it('[C261047] Should be possible to Items per page to 20', function () {
            page = 1;
            totalPages = 1;
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

            navigationBarPage.navigateToProcessServicesPage().goToTaskApp().clickProcessButton();
            processFiltersPage.clickRunningFilterButton();
            processFiltersPage.checkFilterIsHighlighted(processFilterRunning);
            processDetailsPage.checkProcessTitleIsDisplayed();
            processFiltersPage.waitForTableBody();
            expect(paginationPage.getCurrentPage()).toEqual('Page ' + page);
            expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);
            expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.twenty);
        });

        it('[C261045] Should be possible to Items per page to 5', function () {
            let showing;
            page = 1;
            totalPages = 4;
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

            showing = (itemsPerPage.fiveValue * page);
            expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + showing + ' of ' + nrOfProcesses);
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

            showing = (itemsPerPage.fiveValue * page);
            expect(paginationPage.getPaginationRange()).toEqual('Showing 6-' + showing + ' of ' + nrOfProcesses);
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

            showing = (itemsPerPage.fiveValue * page);
            expect(paginationPage.getPaginationRange()).toEqual('Showing 11-' + showing + ' of ' + nrOfProcesses);
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

            showing = (itemsPerPage.fiveValue * page);
            expect(paginationPage.getPaginationRange()).toEqual('Showing 16-' + showing + ' of ' + nrOfProcesses);
            expect(processFiltersPage.numberOfProcessRows()).toBe(itemsPerPage.fiveValue);
            paginationPage.checkNextPageButtonIsDisabled();
            paginationPage.checkPreviousPageButtonIsEnabled();

            page = 1;
            navigationBarPage.navigateToProcessServicesPage().goToTaskApp().clickProcessButton();
            processFiltersPage.clickRunningFilterButton();
            processFiltersPage.checkFilterIsHighlighted(processFilterRunning);
            processDetailsPage.checkProcessTitleIsDisplayed();
            processFiltersPage.waitForTableBody();
            expect(paginationPage.getCurrentPage()).toEqual('Page ' + page);
            expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);
            expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        });

        it('[C261049] Should be possible to open page number dropdown', function () {
            let showing;
            page = 1;
            totalPages = 2;
            processFiltersPage.clickRunningFilterButton();
            processDetailsPage.checkProcessTitleIsDisplayed();
            processFiltersPage.waitForTableBody();
            paginationPage.selectItemsPerPage(itemsPerPage.ten);
            processDetailsPage.checkProcessTitleIsDisplayed();
            processFiltersPage.waitForTableBody();
            expect(paginationPage.getCurrentPage()).toEqual('Page ' + page);
            expect(paginationPage.getTotalPages()).toEqual('of ' + totalPages);
            expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);

            showing = (itemsPerPage.tenValue * page);
            expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + showing + ' of ' + nrOfProcesses);
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

            showing = (itemsPerPage.tenValue * page);
            expect(paginationPage.getPaginationRange()).toEqual('Showing 11-' + showing + ' of ' + nrOfProcesses);
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

            showing = (itemsPerPage.tenValue * page);
            expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + showing + ' of ' + nrOfProcesses);
            expect(processFiltersPage.numberOfProcessRows()).toBe(itemsPerPage.tenValue);
            paginationPage.checkNextPageButtonIsEnabled();
            paginationPage.checkPreviousPageButtonIsDisabled();
        });

        it('[C261048] Should be possible to sort processes by name', function () {
            processFiltersPage.clickRunningFilterButton();
            processFiltersPage.checkFilterIsHighlighted(processFilterRunning);
            processDetailsPage.checkProcessTitleIsDisplayed();
            processFiltersPage.waitForTableBody();

            paginationPage.selectItemsPerPage(itemsPerPage.twenty);
            processDetailsPage.checkProcessTitleIsDisplayed();
            processFiltersPage.waitForTableBody();

            processFiltersPage.sortByName(true);
            processFiltersPage.waitForTableBody();
            processFiltersPage.checkProcessesSortedByNameAsc();

            processFiltersPage.sortByName(false);
            processFiltersPage.waitForTableBody();
            processFiltersPage.checkProcessesSortedByNameDesc();
        });

        it('[C286260] Should keep sorting when changing \'Items per page\'', function () {
            processFiltersPage.clickRunningFilterButton();
            processFiltersPage.checkFilterIsHighlighted(processFilterRunning);
            processDetailsPage.checkProcessTitleIsDisplayed();
            processFiltersPage.waitForTableBody();

            paginationPage.selectItemsPerPage(itemsPerPage.twenty);
            processDetailsPage.checkProcessTitleIsDisplayed();
            processFiltersPage.waitForTableBody();

            processFiltersPage.sortByName(true);
            processFiltersPage.waitForTableBody();
            processFiltersPage.checkProcessesSortedByNameAsc();

            paginationPage.selectItemsPerPage(itemsPerPage.five);
            processFiltersPage.waitForTableBody();
            processFiltersPage.checkProcessesSortedByNameAsc();
        });
    });
});
