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

import { LoginPage, LocalStorageUtil } from '@alfresco/adf-testing';
import { SearchDialog } from '../../pages/adf/dialog/searchDialog';
import { DataTableComponentPage } from '@alfresco/adf-testing';
import { SearchResultsPage } from '../../pages/adf/searchResultsPage';
import { DatePickerPage } from '../../pages/adf/material/datePickerPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { SearchFiltersPage } from '../../pages/adf/searchFiltersPage';
import { SearchConfiguration } from '../search.config';

import TestConfig = require('../../test.config');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { browser } from 'protractor';
import { DateUtil } from '../../util/dateUtil';

describe('Search Date Range Filter', () => {

    const loginPage = new LoginPage();
    const searchDialog = new SearchDialog();
    const searchFilters = new SearchFiltersPage();
    const dateRangeFilter = searchFilters.createdDateRangeFilterPage();
    const searchResults = new SearchResultsPage();
    const datePicker = new DatePickerPage();
    const navigationBar = new NavigationBarPage();
    const dataTable = new DataTableComponentPage();

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
        const date = '01-May-18';
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
            fromDate = DateUtil.formatDate('DD-MM-YY', DateUtil.parse(date, 'DD-MMM-YY'));
        });

        dateRangeFilter.checkApplyButtonIsDisabled();

        dateRangeFilter.checkToDateToggleIsDisplayed().openToDatePicker()
            .selectTodayDate()
            .checkDatePickerIsNotDisplayed();
        dateRangeFilter.getToDate().then((date) => {
            toDate = DateUtil.formatDate('DD-MM-YY', DateUtil.parse(date, 'DD-MMM-YY'), 1);
        });

        dateRangeFilter.checkApplyButtonIsEnabled()
            .clickApplyButton();

        searchResults.sortByCreated(true);

        browser.controlFlow().execute(async () => {
            const results = await dataTable.geCellElementDetail('Created');
            for (const currentResult of results) {

                currentResult.getAttribute('title').then(async (currentDate) => {
                    const currentDateFormatted = DateUtil.parse(currentDate, 'MMM DD, YYYY, h:mm:ss a');

                    await expect(currentDateFormatted <= DateUtil.parse(toDate, 'DD-MM-YY')).toBe(true);
                    await expect(currentDateFormatted >= DateUtil.parse(fromDate, 'DD-MM-YY')).toBe(true);
                });

            }
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
        const toDate = '01-May-18';
        const fromDate = '16-May-18';

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
            jsonFile = SearchConfiguration.getConfiguration();
        });

        it('[C277117] Should be able to change date format', async () => {
            navigationBar.clickContentServicesButton();

            jsonFile.categories[4].component.settings.dateFormat = 'MM-DD-YY';

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            searchDialog.clickOnSearchIcon().enterTextAndPressEnter('*');
            searchFilters.checkCreatedRangeFilterIsDisplayed()
                .clickCreatedRangeFilterHeader()
                .checkCreatedRangeFilterIsExpanded();
            dateRangeFilter.checkFromFieldIsDisplayed()
                .openFromDatePicker();

            const todayDate = DateUtil.formatDate('MM-DD-YY');
            datePicker.selectTodayDate();

            browser.controlFlow().execute(async () => {
                await expect(dateRangeFilter.getFromDate()).toEqual(todayDate);
            });
        });
    });
});
