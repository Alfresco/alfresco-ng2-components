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

import { LoginPage, LocalStorageUtil, DatePickerPage, DateUtil } from '@alfresco/adf-testing';
import { SearchDialog } from '../../pages/adf/dialog/searchDialog';
import { DataTableComponentPage } from '@alfresco/adf-testing';
import { SearchResultsPage } from '../../pages/adf/searchResultsPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { SearchFiltersPage } from '../../pages/adf/searchFiltersPage';
import { SearchConfiguration } from '../search.config';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { browser } from 'protractor';

describe('Search Date Range Filter', () => {

    const loginPage = new LoginPage();
    const searchDialog = new SearchDialog();
    const searchFilters = new SearchFiltersPage();
    const dateRangeFilter = searchFilters.createdDateRangeFilterPage();
    const searchResults = new SearchResultsPage();
    const datePicker = new DatePickerPage();
    const navigationBar = new NavigationBarPage();
    const dataTable = new DataTableComponentPage();

    beforeAll(async () => {

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: browser.params.testConfig.adf_acs.host
        });

        await loginPage.loginToContentServices(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await searchDialog.checkSearchIconIsVisible();
        await searchDialog.clickOnSearchIcon();
        await searchDialog.enterTextAndPressEnter('*');

    });

    beforeEach(async () => {
        await searchFilters.checkCreatedRangeFilterIsDisplayed();
        await searchFilters.clickCreatedRangeFilterHeader();
        await searchFilters.checkCreatedRangeFilterIsExpanded();
    });

    afterEach(async () => {
        await browser.refresh();

    });

    it('[C277106] Should display default values for Date Range widget', async () => {
        await dateRangeFilter.checkFromFieldIsDisplayed();
        await dateRangeFilter.checkFromDateToggleIsDisplayed();
        await dateRangeFilter.checkToFieldIsDisplayed();
        await dateRangeFilter.checkToDateToggleIsDisplayed();
        await dateRangeFilter.checkApplyButtonIsDisplayed();
        await dateRangeFilter.checkApplyButtonIsDisabled();
        await dateRangeFilter.checkClearButtonIsDisplayed();
    });

    it('[C277104] Should be able to set dates using date pickers', async () => {
        await dateRangeFilter.checkFromDateToggleIsDisplayed();
        const fromDatePicker = await dateRangeFilter.openFromDatePicker();
        await fromDatePicker.selectTodayDate();
        await expect(await dateRangeFilter.getFromDate()).toEqual(await dateRangeFilter.getFromCalendarSelectedDate());
    });

    it('[C277105] Should be able to type a date', async () => {
        const date = '01-May-18';
        await dateRangeFilter.putFromDate(date);
        await expect(await dateRangeFilter.getFromCalendarSelectedDate()).toEqual(await dateRangeFilter.getFromDate());
    });

    it('[C277119] FROM and TO dates should depend on each other', async () => {
        await dateRangeFilter.checkFromDateToggleIsDisplayed();
        const fromDatePicker = await dateRangeFilter.openFromDatePicker();
        await fromDatePicker.checkDatesAfterDateAreDisabled(new Date());
        await fromDatePicker.closeDatePicker();

        await dateRangeFilter.checkToDateToggleIsDisplayed();
        let datePickerTo = await dateRangeFilter.openToDatePicker();

        await datePickerTo.checkDatesAfterDateAreDisabled(new Date());
        await datePickerTo.closeDatePicker();

        await dateRangeFilter.checkFromDateToggleIsDisplayed();
        const datePickerFrom = await dateRangeFilter.openFromDatePicker();
        await datePickerFrom.selectTodayDate();
        await datePickerFrom.checkDatePickerIsNotDisplayed();

        await dateRangeFilter.checkToDateToggleIsDisplayed();
        datePickerTo = await dateRangeFilter.openToDatePicker();
        await datePickerTo.checkDatesBeforeDateAreDisabled(new Date());
        await datePickerTo.checkDatesAfterDateAreDisabled(new Date());
    });

    it('[C277107] Should be able to apply a date range', async () => {
        await dateRangeFilter.checkFromDateToggleIsDisplayed();
        const datePickerToday = await dateRangeFilter.openFromDatePicker();
        await datePickerToday.selectTodayDate();
        await datePickerToday.checkDatePickerIsNotDisplayed();
        let fromDate = await dateRangeFilter.getFromDate();
        fromDate = DateUtil.formatDate('DD-MM-YY', DateUtil.parse(fromDate, 'DD-MMM-YY'));

        await dateRangeFilter.checkApplyButtonIsDisabled();

        await dateRangeFilter.checkToDateToggleIsDisplayed();
        const toDatePicker = await dateRangeFilter.openToDatePicker();

        await toDatePicker.selectTodayDate();
        await toDatePicker.checkDatePickerIsNotDisplayed();
        let toDate = await dateRangeFilter.getToDate();
        toDate = DateUtil.formatDate('DD-MM-YY', DateUtil.parse(toDate, 'DD-MMM-YY'), 1);

        await dateRangeFilter.checkApplyButtonIsEnabled();
        await dateRangeFilter.clickApplyButton();

        await searchResults.sortByCreated('ASC');

        const results: any = dataTable.geCellElementDetail('Created');
        for (const currentResult of results) {

            const currentDate = currentResult.getAttribute('title');
            const currentDateFormatted = DateUtil.parse(currentDate, 'MMM DD, YYYY, h:mm:ss a');

            await expect(currentDateFormatted <= DateUtil.parse(toDate, 'DD-MM-YY')).toBe(true);
            await expect(currentDateFormatted >= DateUtil.parse(fromDate, 'DD-MM-YY')).toBe(true);
        }
    });

    it('[C277108] Should display a warning message when user doesn\'t set the date range at all', async () => {
        await dateRangeFilter.checkFromFieldIsDisplayed();
        await dateRangeFilter.clickFromField();
        await dateRangeFilter.clickToField();
        await dateRangeFilter.checkFromErrorMessageIsDisplayed('Required value');
        await dateRangeFilter.clickFromField();
        await dateRangeFilter.checkToErrorMessageIsDisplayed('Required value');
    });

    it('[C277114] Should display warning message if user doesn\'t set the date range properly', async () => {
        const toDate = '01-May-18';
        const fromDate = '16-May-18';

        await dateRangeFilter.checkToFieldIsDisplayed();
        await dateRangeFilter.putToDate(toDate);
        await dateRangeFilter.checkFromFieldIsDisplayed();
        await dateRangeFilter.putFromDate(fromDate);
        await dateRangeFilter.clickFromField();
        await dateRangeFilter.checkToErrorMessageIsDisplayed('No days selected.');
    });

    it('[C277115] Should display warning message if user types a date later than today\'s date', async () => {
        await dateRangeFilter.checkFromFieldIsDisplayed();
        await dateRangeFilter.putFromDate(DateUtil.formatDate('DD-MMM-YY', new Date(), 1));
        await dateRangeFilter.checkFromErrorMessageIsDisplayed('The date is beyond the maximum date.');
    });

    it('[C277108] Should display a warning message when user doesn\'t set the date range at all', async () => {
        await dateRangeFilter.checkFromFieldIsDisplayed();
        await dateRangeFilter.putFromDate('Wrong Format');
        await dateRangeFilter.clickToField();
        await dateRangeFilter.checkFromErrorMessageIsDisplayed('Invalid date. The date must be in the format \'DD-MMM-YY\'');
        await dateRangeFilter.putFromDate('01-May-18');
        await dateRangeFilter.checkFromErrorMessageIsNotDisplayed();
    });

    describe('configuration change', () => {

        let jsonFile;

        beforeAll(async () => {
            jsonFile = SearchConfiguration.getConfiguration();
        });

        it('[C277117] Should be able to change date format', async () => {
            await navigationBar.clickContentServicesButton();

            jsonFile.categories[4].component.settings.dateFormat = 'MM-DD-YY';

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchDialog.clickOnSearchIcon();
            await searchDialog.enterTextAndPressEnter('*');
            await searchFilters.checkCreatedRangeFilterIsDisplayed();
            await searchFilters.clickCreatedRangeFilterHeader();
            await searchFilters.checkCreatedRangeFilterIsExpanded();
            await dateRangeFilter.checkFromFieldIsDisplayed();
            await dateRangeFilter.openFromDatePicker();

            const todayDate = DateUtil.formatDate('MM-DD-YY');
            await datePicker.selectTodayDate();

            await expect(await dateRangeFilter.getFromDate()).toEqual(todayDate);
        });
    });
});
