/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { BrowserActions, DataTableComponentPage, DateUtil, LoginPage } from '@alfresco/adf-testing';
import { browser, ElementFinder } from 'protractor';
import { SearchBarPage } from '../pages/search-bar.page';
import { SearchFiltersPage } from '../pages/search-filters.page';
import { SearchResultsPage } from '../pages/search-results.page';

describe('Search Date Range Filter', () => {
    const loginPage = new LoginPage();
    const searchBarPage = new SearchBarPage();
    const searchFilters = new SearchFiltersPage();
    const dateRangeFilter = searchFilters.createdDateRangeFilterPage();
    const searchResults = new SearchResultsPage();
    const dataTable = new DataTableComponentPage();

    beforeAll(async () => {
        await loginPage.loginWithProfile('admin');

        await searchBarPage.checkSearchIconIsVisible();
        await searchBarPage.clickOnSearchIcon();
        await searchBarPage.enterTextAndPressEnter('*');
        await searchResults.dataTable.waitTillContentLoaded();
    });

    beforeEach(async () => {
        await searchFilters.checkCreatedRangeFilterIsDisplayed();
        await searchFilters.clickCreatedRangeFilterHeader();
        await searchFilters.checkCreatedRangeFilterIsExpanded();
    });

    afterEach(async () => {
        await browser.refresh();
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

        const results = (await dataTable.geCellElementDetail('Created')) as ElementFinder[];
        for (const currentResult of results) {
            const currentDate = await BrowserActions.getAttribute(currentResult, 'title');
            const currentDateFormatted = DateUtil.parse(currentDate, 'MMM DD, YYYY, h:mm:ss a');

            await expect(currentDateFormatted <= DateUtil.parse(toDate, 'DD-MM-YY')).toBe(true);
            await expect(currentDateFormatted >= DateUtil.parse(fromDate, 'DD-MM-YY')).toBe(true);
        }
    });
});
