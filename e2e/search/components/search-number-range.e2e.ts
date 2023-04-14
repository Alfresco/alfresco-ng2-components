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

import { createApiService, BrowserActions,
    DataTableComponentPage,
    DateUtil,
    LocalStorageUtil,
    LoginPage,
    UploadActions,
    UserModel,
    UsersActions
} from '@alfresco/adf-testing';
import { SearchBarPage } from '../pages/search-bar.page';
import { SearchResultsPage } from '../pages/search-results.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { SearchFiltersPage } from '../pages/search-filters.page';
import { FileModel } from '../../models/ACS/file.model';
import { browser, ElementFinder } from 'protractor';
import { SearchConfiguration } from '../search.config';

describe('Search Number Range Filter', () => {

    const loginPage = new LoginPage();
    const searchBarPage = new SearchBarPage();
    const searchFilters = new SearchFiltersPage();
    const sizeRangeFilter = searchFilters.sizeRangeFilterPage();
    const searchResults = new SearchResultsPage();
    const navigationBarPage = new NavigationBarPage();
    const dataTable = new DataTableComponentPage();

    const acsUser = new UserModel();

    const file2BytesModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.UNSUPPORTED.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.UNSUPPORTED.file_path
    });

    const file0BytesModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.TXT_0B.file_path
    });

    let file2Bytes; let file0Bytes;
    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);

    const uploadActions = new UploadActions(apiService);

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        await usersActions.createUser(acsUser);

        await apiService.login(acsUser.username, acsUser.password);

        file2Bytes = await uploadActions.uploadFile(file2BytesModel.location, file2BytesModel.name, '-my-');
        file0Bytes = await uploadActions.uploadFile(file0BytesModel.location, file0BytesModel.name, '-my-');
        await browser.sleep(browser.params.testConfig.timeouts.index_search);

        await loginPage.login(acsUser.username, acsUser.password);

        await searchBarPage.checkSearchIconIsVisible();
        await searchBarPage.clickOnSearchIcon();
        await searchBarPage.enterTextAndPressEnter('*');
        await searchResults.dataTable.waitTillContentLoaded();
    });

    afterAll(async () => {
        await apiService.login(acsUser.username, acsUser.password);
        await uploadActions.deleteFileOrFolder(file2Bytes.entry.id);
        await uploadActions.deleteFileOrFolder(file0Bytes.entry.id);

        await navigationBarPage.clickLogoutButton();
   });

    beforeEach(async () => {
        await searchFilters.checkSizeRangeFilterIsDisplayed();
        await searchFilters.clickSizeRangeFilterHeader();
        await searchFilters.checkSizeRangeFilterIsExpanded();
    });

    afterEach(async () => {
        await browser.refresh();
   });

    it('[C276921] Should display default values for Number Range widget', async () => {
        await sizeRangeFilter.checkFromFieldIsDisplayed();
        await sizeRangeFilter.checkToFieldIsDisplayed();
        await sizeRangeFilter.checkApplyButtonIsDisplayed();
        await sizeRangeFilter.checkClearButtonIsDisplayed();

        await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(false);
    });

    it('[C276922] Should be keep value when Number Range widget is collapsed', async () => {
        const size = 5;
        await sizeRangeFilter.putFromNumber(size);
        await sizeRangeFilter.putToNumber(size);
        await searchFilters.clickSizeRangeFilterHeader();
        await searchFilters.checkSizeRangeFilterIsCollapsed();
        await searchFilters.clickSizeRangeFilterHeader();
        await searchFilters.checkSizeRangeFilterIsExpanded();
        await expect(await sizeRangeFilter.getFromNumber()).toEqual(`${size}`);
        await expect(await sizeRangeFilter.getToNumber()).toEqual(`${size}`);
    });

    it('[C276924] Should display error message when input had an invalid format', async () => {
        await sizeRangeFilter.checkFromFieldIsDisplayed();
        await sizeRangeFilter.putFromNumber('a');
        await sizeRangeFilter.putToNumber('A');
        await sizeRangeFilter.checkFromErrorInvalidIsDisplayed();
        await sizeRangeFilter.checkToErrorInvalidIsDisplayed();

        await expect(await sizeRangeFilter.getFromErrorInvalid()).toEqual('Invalid Format');
        await expect(await sizeRangeFilter.getToErrorInvalid()).toEqual('Invalid Format');
        await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(false);

        await sizeRangeFilter.putFromNumber('@');
        await sizeRangeFilter.putToNumber('£');
        await sizeRangeFilter.checkFromErrorInvalidIsDisplayed();
        await sizeRangeFilter.checkToErrorInvalidIsDisplayed();
        await expect(await sizeRangeFilter.getFromErrorInvalid()).toEqual('Invalid Format');
        await expect(await sizeRangeFilter.getToErrorInvalid()).toEqual('Invalid Format');
        await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(false);

        await sizeRangeFilter.putFromNumber('4.5');
        await sizeRangeFilter.putToNumber('4,5');
        await sizeRangeFilter.checkFromErrorInvalidIsDisplayed();
        await sizeRangeFilter.checkToErrorInvalidIsDisplayed();
        await expect(await sizeRangeFilter.getFromErrorInvalid()).toEqual('Invalid Format');
        await expect(await sizeRangeFilter.getToErrorInvalid()).toEqual('Invalid Format');
        await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(false);

        await sizeRangeFilter.putFromNumber('01');
        await sizeRangeFilter.putToNumber('-1');
        await expect(await sizeRangeFilter.getFromErrorInvalid()).toEqual('Invalid Format');
        await expect(await sizeRangeFilter.getToErrorInvalid()).toEqual('Invalid Format');
        await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(false);

        await sizeRangeFilter.clearFromField();
        await sizeRangeFilter.clearToField();
        await sizeRangeFilter.checkFromErrorRequiredIsDisplayed();
        await sizeRangeFilter.checkToErrorRequiredIsDisplayed();
        await expect(await sizeRangeFilter.getFromErrorRequired()).toEqual('Required value');
        await expect(await sizeRangeFilter.getToErrorRequired()).toEqual('Required value');
        await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(false);
    });

    it('[C276943] Should be able to put a big value in To field', async () => {
        const toSize = 999999999;
        const fromSize = 0;
        await sizeRangeFilter.checkToFieldIsDisplayed();
        await sizeRangeFilter.putToNumber(toSize);
        await sizeRangeFilter.putFromNumber(fromSize);

        await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

        await sizeRangeFilter.clickApplyButton();
        await searchResults.dataTable.waitTillContentLoaded();
        await searchResults.sortBySize('DESC');

        const results = await dataTable.geCellElementDetail('Size') as ElementFinder[];
        for (const currentResult of results) {
            const currentSize = await BrowserActions.getAttribute(currentResult, 'title');

            if (currentSize && currentSize.trim() !== '') {
                await expect(parseInt(currentSize, 10) <= toSize).toBe(true);
            }
        }
    });

    it('[C276944] Should be able to filter by name when size range filter is applied', async () => {
        const nameFilter = searchFilters.textFiltersPage();
        const toSize = 40;
        const fromSize = 0;
        await searchFilters.checkNameFilterIsDisplayed();
        await searchFilters.checkNameFilterIsExpanded();
        await nameFilter.searchByName('*');
        await searchResults.dataTable.waitTillContentLoaded();

        await sizeRangeFilter.checkFromFieldIsDisplayed();
        await sizeRangeFilter.putFromNumber(fromSize);
        await sizeRangeFilter.putToNumber(toSize);

        await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

        await sizeRangeFilter.clickApplyButton();
        await searchResults.dataTable.waitTillContentLoaded();

        await searchResults.sortBySize('DESC');

        const results = await dataTable.geCellElementDetail('Size') as ElementFinder[];
        for (const currentResult of results) {
            const currentSize = await BrowserActions.getAttribute(currentResult, 'title');
            if (currentSize && currentSize.trim() !== '') {
                await expect(parseInt(currentSize, 10) <= toSize).toBe(true);
            }
        }

        await searchFilters.checkNameFilterIsDisplayed();
        await searchFilters.checkNameFilterIsExpanded();
        await nameFilter.searchByName('z*');
        await searchResults.dataTable.waitTillContentLoaded();
        await searchResults.sortBySize('DESC');

        const resultsSize = await dataTable.geCellElementDetail('Size') as ElementFinder[];
        for (const currentResult of resultsSize) {
            const currentSize = await BrowserActions.getAttribute(currentResult, 'title');
            if (currentSize && currentSize.trim() !== '') {
                await expect(parseInt(currentSize, 10) <= toSize).toBe(true);
            }
        }

        const resultsDisplay = await dataTable.geCellElementDetail('Display name') as ElementFinder[];
        for (const currentResult of resultsDisplay) {
            const name = await BrowserActions.getAttribute(currentResult, 'title');
            if (name && name.trim() !== '') {
                await expect(/z*/i.test(name)).toBe(true);
            }
        }
    });

    it('[C276951] Should not display folders when Size range is applied', async () => {
        await sizeRangeFilter.checkToFieldIsDisplayed();
        await sizeRangeFilter.putToNumber(99999999);
        await sizeRangeFilter.putFromNumber(0);
        await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

        await sizeRangeFilter.clickApplyButton();
        await searchResults.dataTable.waitTillContentLoaded();
        await searchFilters.checkCheckListFilterIsDisplayed();
        await searchFilters.clickCheckListFilter();
        await searchFilters.checkCheckListFilterIsExpanded();

        await searchFilters.checkListFiltersPage().clickCheckListOption('Folder');

        await searchResults.dataTable.waitTillContentLoaded();
        await searchResults.checkNoResultMessageIsDisplayed();
    });

    it('[C276952] Should only display empty files when size range is set from 0 to 1', async () => {
        await sizeRangeFilter.checkToFieldIsDisplayed();
        await sizeRangeFilter.putToNumber(1);
        await sizeRangeFilter.putFromNumber(0);
        await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

        await sizeRangeFilter.clickApplyButton();
        await searchResults.dataTable.waitTillContentLoaded();

        await searchResults.sortBySize('DESC');

        const results = await dataTable.geCellElementDetail('Size') as ElementFinder[];
        for (const currentResult of results) {
            const currentSize = await BrowserActions.getAttribute(currentResult, 'title');
            if (currentSize && currentSize.trim() !== '') {
                await expect(currentSize === '0').toBe(true);
            }
        }
    });

    it('[C277092] Should disable apply button when from field value equal/is bigger than to field value', async () => {
        await sizeRangeFilter.checkFromFieldIsDisplayed();
        await sizeRangeFilter.putFromNumber(10);
        await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(false);

        await sizeRangeFilter.putToNumber('5');
        await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(false);

        await sizeRangeFilter.putToNumber('10');
        await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(false);
    });

    it('[C289930] Should be able to clear values in number range fields', async () => {
        await sizeRangeFilter.checkFromFieldIsDisplayed();
        await sizeRangeFilter.checkClearButtonIsDisplayed();
        await sizeRangeFilter.checkNoErrorMessageIsDisplayed();
        await sizeRangeFilter.clickClearButton();
        await sizeRangeFilter.checkNoErrorMessageIsDisplayed();
        await sizeRangeFilter.putFromNumber(0);
        await sizeRangeFilter.putToNumber(1);
        await sizeRangeFilter.clickClearButton();

        await expect(await sizeRangeFilter.getFromNumber()).toEqual('');
        await expect(await sizeRangeFilter.getToNumber()).toEqual('');

        await sizeRangeFilter.putFromNumber(0);
        await sizeRangeFilter.putToNumber(1);
        await sizeRangeFilter.clickApplyButton();
        await searchResults.sortBySize('DESC');

        const results = await dataTable.geCellElementDetail('Size') as ElementFinder[];
        for (const currentResult of results) {
            const currentSize = await BrowserActions.getAttribute(currentResult, 'title');
            if (currentSize && currentSize.trim() !== '') {
                await expect(parseInt(currentSize, 10) <= 1000).toBe(true);
            }
        }

        await sizeRangeFilter.clickClearButton();

        await expect(await sizeRangeFilter.getFromNumber()).toEqual('');
        await expect(await sizeRangeFilter.getToNumber()).toEqual('');

        const resultsSize = await dataTable.geCellElementDetail('Size') as ElementFinder[];
        for (const currentResult of resultsSize) {
            const currentSize = await BrowserActions.getAttribute(currentResult, 'title');
            if (currentSize && currentSize.trim() !== '') {
                await expect(parseInt(currentSize, 10) >= 1000).toBe(true);
            }
        }
    });

    it('[C277137] Number Range should be inclusive', async () => {
        await sizeRangeFilter.checkToFieldIsDisplayed();
        await sizeRangeFilter.putToNumber(2);
        await sizeRangeFilter.putFromNumber(1);
        await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

        await sizeRangeFilter.clickApplyButton();

        await searchResults.dataTable.waitTillContentLoaded();

        await searchResults.checkContentIsDisplayed(file2BytesModel.name);

        await sizeRangeFilter.checkToFieldIsDisplayed();
        await sizeRangeFilter.putToNumber(1);
        await sizeRangeFilter.putFromNumber(0);
        await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

        await sizeRangeFilter.clickApplyButton();

        await searchResults.dataTable.waitTillContentLoaded();

        await searchResults.checkContentIsNotDisplayed(file2BytesModel.name);

        await sizeRangeFilter.checkToFieldIsDisplayed();
        await sizeRangeFilter.putToNumber(3);
        await sizeRangeFilter.putFromNumber(2);
        await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

        await sizeRangeFilter.clickApplyButton();

        await searchResults.dataTable.waitTillContentLoaded();

        await searchResults.checkContentIsDisplayed(file2BytesModel.name);

        await sizeRangeFilter.checkToFieldIsDisplayed();
        await sizeRangeFilter.putToNumber(4);
        await sizeRangeFilter.putFromNumber(3);
        await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

        await sizeRangeFilter.clickApplyButton();

        await searchResults.dataTable.waitTillContentLoaded();

        await searchResults.checkContentIsNotDisplayed(file2BytesModel.name);
    });

    describe('Configuration change', () => {
        let jsonFile;

        beforeEach(() => {
            jsonFile = SearchConfiguration.getConfiguration();
        });

        it('[C276928] Should be able to change the field property for number range', async () => {
            await navigationBarPage.navigateToContentServices();

            jsonFile.categories[3].component.settings.field = 'cm:created';

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchBarPage.checkSearchIconIsVisible();
            await searchBarPage.clickOnSearchIcon();
            await searchBarPage.enterTextAndPressEnter('*');
            await searchResults.dataTable.waitTillContentLoaded();

            await searchFilters.checkSizeRangeFilterIsDisplayed();
            await searchFilters.clickSizeRangeFilterHeader();
            await searchFilters.checkSizeRangeFilterIsExpanded();

            const fromYear = (new Date()).getFullYear();
            const toYear = fromYear + 1;

            await sizeRangeFilter.checkToFieldIsDisplayed();
            await sizeRangeFilter.putToNumber(toYear);
            await sizeRangeFilter.putFromNumber(fromYear);
            await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

            await sizeRangeFilter.clickApplyButton();
            await searchResults.dataTable.waitTillContentLoaded();

            await searchResults.sortByCreated('DESC');

            const results = await dataTable.geCellElementDetail('Created') as ElementFinder[];
            for (const currentResult of results) {
                const currentDate = await BrowserActions.getAttribute(currentResult, 'title');
                const currentDateFormatted = DateUtil.parse(currentDate, 'MMM DD, YYYY, h:mm:ss a');

                await expect(currentDateFormatted.getFullYear() <= toYear).toBe(true);
                await expect(currentDateFormatted.getFullYear() >= fromYear).toBe(true);
            }
    });

        it('[C277139] Should be able to set To field to be exclusive', async () => {
            await navigationBarPage.navigateToContentServices();

            jsonFile.categories[3].component.settings.format = '[{FROM} TO {TO}>';

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchBarPage.checkSearchIconIsVisible();
            await searchBarPage.clickOnSearchIcon();
            await searchBarPage.enterTextAndPressEnter('*');
            await searchResults.dataTable.waitTillContentLoaded();

            await searchFilters.checkSizeRangeFilterIsDisplayed();
            await searchFilters.clickSizeRangeFilterHeader();
            await searchFilters.checkSizeRangeFilterIsExpanded();

            await sizeRangeFilter.checkToFieldIsDisplayed();
            await sizeRangeFilter.putToNumber(2);
            await sizeRangeFilter.putFromNumber(1);
            await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

            await sizeRangeFilter.clickApplyButton();

            await searchResults.dataTable.waitTillContentLoaded();

            await searchResults.checkContentIsNotDisplayed(file2BytesModel.name);

            await sizeRangeFilter.checkToFieldIsDisplayed();
            await sizeRangeFilter.putToNumber(3);
            await sizeRangeFilter.putFromNumber(1);
            await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

            await sizeRangeFilter.clickApplyButton();

            await searchResults.dataTable.waitTillContentLoaded();

            await searchResults.checkContentIsDisplayed(file2BytesModel.name);
        });

        it('[C277140] Should be able to set From field to be exclusive', async () => {
            await navigationBarPage.navigateToContentServices();

            jsonFile.categories[3].component.settings.format = '<{FROM} TO {TO}]';

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchBarPage.checkSearchIconIsVisible();
            await searchBarPage.clickOnSearchIcon();
            await searchBarPage.enterTextAndPressEnter('*');
            await searchResults.dataTable.waitTillContentLoaded();

            await searchFilters.checkSizeRangeFilterIsDisplayed();
            await searchFilters.clickSizeRangeFilterHeader();
            await searchFilters.checkSizeRangeFilterIsExpanded();

            await sizeRangeFilter.checkToFieldIsDisplayed();
            await sizeRangeFilter.putToNumber(3);
            await sizeRangeFilter.putFromNumber(1);
            await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

            await sizeRangeFilter.clickApplyButton();

            await searchResults.dataTable.waitTillContentLoaded();

            await searchResults.checkContentIsDisplayed(file2BytesModel.name);

            await sizeRangeFilter.checkToFieldIsDisplayed();
            await sizeRangeFilter.putToNumber(3);
            await sizeRangeFilter.putFromNumber(2);
            await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

            await sizeRangeFilter.clickApplyButton();

            await searchResults.dataTable.waitTillContentLoaded();

            await searchResults.checkContentIsNotDisplayed(file2BytesModel.name);
        });
    });
});
