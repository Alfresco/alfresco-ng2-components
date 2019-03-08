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

import { LoginPage } from '../../pages/adf/loginPage';
import { SearchDialog } from '../../pages/adf/dialog/searchDialog';
import { DataTableComponentPage } from '../../pages/adf/dataTableComponentPage';
import { SearchResultsPage } from '../../pages/adf/searchResultsPage';
import { DatePickerPage } from '../../pages/adf/material/datePickerPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { ConfigEditorPage } from '../../pages/adf/configEditorPage';
import { SearchFiltersPage } from '../../pages/adf/searchFiltersPage';
import { SearchConfiguration } from '../search.config';

import TestConfig = require('../../test.config');

import AlfrescoApi = require('alfresco-js-api-node');
import { browser } from 'protractor';
import { DateUtil } from '../../util/dateUtil';

describe('Search Date Range Filter', () => {

    let loginPage = new LoginPage();
    let searchDialog = new SearchDialog();
    let searchFilters = new SearchFiltersPage();
    let dateRangeFilter = searchFilters.createdDateRangeFilterPage();
    let searchResults = new SearchResultsPage();
    let datePicker = new DatePickerPage();
    let navigationBar = new NavigationBarPage();
    let configEditor = new ConfigEditorPage();
    let dataTable = new DataTableComponentPage();

    beforeAll(async (done) => {

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        loginPage.loginToContentServices(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        searchDialog.checkSearchIconIsVisible()
            .clickOnSearchIcon()
            .enterTextAndPressEnter('*');

        done();
    });

    beforeEach(() => {
        searchFilters.checkCreatedRangeFilterIsDisplayed()
            .clickCreatedRangeFilterHeader()
            .checkCreatedRangeFilterIsExpanded();
    });

    afterEach(async (done) => {
        await browser.refresh();
        done();
    });

    it('[C277106] Should display default values for Date Range widget', () => {
        dateRangeFilter.checkFromFieldIsDisplayed()
            .checkFromDateToggleIsDisplayed()
            .checkToFieldIsDisplayed()
            .checkToDateToggleIsDisplayed()
            .checkApplyButtonIsDisplayed()
            .checkApplyButtonIsDisabled()
            .checkClearButtonIsDisplayed();
    });

    it('[C277104] Should be able to set dates using date pickers', () => {
        dateRangeFilter.checkFromDateToggleIsDisplayed().openFromDatePicker()
            .selectTodayDate();
        browser.controlFlow().execute(async () => {
            await expect(dateRangeFilter.getFromDate()).toEqual(dateRangeFilter.getFromCalendarSelectedDate());
        });
    });

    it('[C277105] Should be able to type a date', () => {
        let date = '01-May-18';
        dateRangeFilter.putFromDate(date);
        browser.controlFlow().execute(async () => {
            await expect(dateRangeFilter.getFromCalendarSelectedDate()).toEqual(dateRangeFilter.getFromDate());
        });
    });

    it('[C277119] FROM and TO dates should depend on each other', () => {
        dateRangeFilter.checkFromDateToggleIsDisplayed().openFromDatePicker()
            .checkDatesAfterDateAreDisabled(new Date())
            .closeDatePicker();

        dateRangeFilter.checkToDateToggleIsDisplayed().openToDatePicker()
            .checkDatesAfterDateAreDisabled(new Date())
            .closeDatePicker();

        dateRangeFilter.checkFromDateToggleIsDisplayed().openFromDatePicker()
            .selectTodayDate()
            .checkDatePickerIsNotDisplayed();

        dateRangeFilter.checkToDateToggleIsDisplayed().openToDatePicker()
            .checkDatesBeforeDateAreDisabled(new Date())
            .checkDatesAfterDateAreDisabled(new Date());
    });

    it('[C277107] Should be able to apply a date range', () => {
        let fromDate, toDate;
        dateRangeFilter.checkFromDateToggleIsDisplayed().openFromDatePicker()
            .selectTodayDate()
            .checkDatePickerIsNotDisplayed();
        dateRangeFilter.getFromDate().then((date) => {
            fromDate = DateUtil.formatDate('DD-MM-YY', date);
        });

        dateRangeFilter.checkApplyButtonIsDisabled();

        dateRangeFilter.checkToDateToggleIsDisplayed().openToDatePicker()
            .selectTodayDate()
            .checkDatePickerIsNotDisplayed();
        dateRangeFilter.getToDate().then((date) => {
            toDate = DateUtil.formatDate('DD-MM-YY', date);
        });

        dateRangeFilter.checkApplyButtonIsEnabled()
            .clickApplyButton();

        searchResults.sortByCreated(true);
        browser.controlFlow().execute(async () => {
            let firstResult = await dataTable.getFirstElementDetail('Node id');
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            await this.alfrescoJsApi.core.nodesApi.getNode(firstResult).then(async (node) => {
                let nodeCreation = new Date(node.entry.createdAt);
                nodeCreation.setHours(0, 0, 0, 0);
                await expect(nodeCreation.getTime() >= DateUtil.parse(fromDate).getTime()).toBe(true);
                await expect(nodeCreation.getTime() <= DateUtil.parse(toDate).getTime()).toBe(true);
            });
        });

        searchResults.sortByCreated(false);
        browser.controlFlow().execute(async () => {
            let firstResult = await dataTable.getFirstElementDetail('Node id');
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            await this.alfrescoJsApi.core.nodesApi.getNode(firstResult).then(async (node) => {
                let nodeCreation = new Date(node.entry.createdAt);
                nodeCreation.setHours(0, 0, 0, 0);
                await expect(nodeCreation.getTime() >= DateUtil.parse(fromDate).getTime()).toBe(true);
                await expect(nodeCreation.getTime() <= DateUtil.parse(toDate).getTime()).toBe(true);
            });
        });
    });

    it('[C277108] Should display a warning message when user doesn\'t set the date range at all', () => {
        dateRangeFilter.checkFromFieldIsDisplayed()
            .clickFromField()
            .clickToField()
            .checkFromErrorMessageIsDisplayed('Required value')
            .clickFromField()
            .checkToErrorMessageIsDisplayed('Required value');
    });

    it('[C277114] Should display warning message if user doesn\'t set the date range properly', () => {
        let toDate = '01-May-18';
        let fromDate = '16-May-18';

        dateRangeFilter.checkToFieldIsDisplayed()
            .putToDate(toDate)
            .checkFromFieldIsDisplayed()
            .putFromDate(fromDate)
            .clickFromField()
            .checkToErrorMessageIsDisplayed('No days selected.');
    });

    it('[C277115] Should display warning message if user types a date later than today\'s date', () => {
        dateRangeFilter.checkFromFieldIsDisplayed()
            .putFromDate(DateUtil.formatDate('DD-MMM-YY', new Date(), 1))
            .checkFromErrorMessageIsDisplayed('The date is beyond the maximum date.');
    });

    it('[C277108] Should display a warning message when user doesn\'t set the date range at all', () => {
        dateRangeFilter.checkFromFieldIsDisplayed()
            .putFromDate('Wrong Format')
            .clickToField()
            .checkFromErrorMessageIsDisplayed('Invalid date. The date must be in the format \'DD-MMM-YY\'')
            .putFromDate('01-May-18')
            .checkFromErrorMessageIsNotDisplayed();
    });

    describe('configuration change', () => {

        let jsonFile;

        beforeAll(() => {
            let searchConfiguration = new SearchConfiguration();
            jsonFile = searchConfiguration.getConfiguration();
        });

        it('[C277117] Should be able to change date format', () => {
            jsonFile.categories[4].component.settings.dateFormat = 'MM-DD-YY';

            navigationBar.clickConfigEditorButton();
            configEditor.clickSearchConfiguration();
            configEditor.clickClearButton();
            configEditor.enterBigConfigurationText(JSON.stringify(jsonFile));
            configEditor.clickSaveButton();

            searchDialog.clickOnSearchIcon().enterTextAndPressEnter('*');
            searchFilters.checkCreatedRangeFilterIsDisplayed()
                .clickCreatedRangeFilterHeader()
                .checkCreatedRangeFilterIsExpanded();
            dateRangeFilter.checkFromFieldIsDisplayed()
                .openFromDatePicker();

            let todayDate = DateUtil.formatDate('MM-DD-YY');
            datePicker.selectTodayDate();

            browser.controlFlow().execute(async () => {
                await expect(dateRangeFilter.getFromDate()).toEqual(todayDate);
            });
        });
    });
});
