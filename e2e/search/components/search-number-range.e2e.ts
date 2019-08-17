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

import { LoginPage, LocalStorageUtil, UploadActions, DataTableComponentPage, DateUtil } from '@alfresco/adf-testing';
import { SearchDialog } from '../../pages/adf/dialog/searchDialog';
import { SearchResultsPage } from '../../pages/adf/searchResultsPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { SearchFiltersPage } from '../../pages/adf/searchFiltersPage';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';
import { browser } from 'protractor';
import resources = require('../../util/resources');
import { SearchConfiguration } from '../search.config';

describe('Search Number Range Filter', () => {

    const loginPage = new LoginPage();
    const searchDialog = new SearchDialog();
    const searchFilters = new SearchFiltersPage();
    const sizeRangeFilter = searchFilters.sizeRangeFilterPage();
    const searchResults = new SearchResultsPage();
    const navigationBarPage = new NavigationBarPage();
    const dataTable = new DataTableComponentPage();

    const acsUser = new AcsUserModel();

    const file2BytesModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.UNSUPPORTED.file_name,
        'location': resources.Files.ADF_DOCUMENTS.UNSUPPORTED.file_location
    });

    const file0BytesModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });

    let file2Bytes, file0Bytes;
    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);

    beforeAll(async () => {

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        file2Bytes = await uploadActions.uploadFile(file2BytesModel.location, file2BytesModel.name, '-my-');
        file0Bytes = await uploadActions.uploadFile(file0BytesModel.location, file0BytesModel.name, '-my-');
        await browser.sleep(15000);

        await loginPage.loginToContentServices(acsUser.id, acsUser.password);

        await searchDialog.checkSearchIconIsVisible();
        await searchDialog.clickOnSearchIcon();
        await searchDialog.enterTextAndPressEnter('*');

    });

    afterAll(async () => {
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
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
        await searchResults.tableIsLoaded();
        await searchResults.sortBySize('DESC');

        const results: any = dataTable.geCellElementDetail('Size');
        for (const currentResult of results) {
            try {
                const currentSize = await currentResult.getAttribute('title');
                if (currentSize && currentSize.trim() !== '') {
                    await expect(parseInt(currentSize, 10) <= toSize).toBe(true);
                }
            } catch (e) {
            }
        }
    });

    it('[C276944] Should be able to filter by name when size range filter is applied', async () => {
        const nameFilter = await searchFilters.textFiltersPage();
        const toSize = 40;
        const fromSize = 0;
        await searchFilters.checkNameFilterIsDisplayed();
        await searchFilters.checkNameFilterIsExpanded();
        await nameFilter.searchByName('*');

        await sizeRangeFilter.checkFromFieldIsDisplayed();
        await sizeRangeFilter.putFromNumber(fromSize);
        await sizeRangeFilter.putToNumber(toSize);

        await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

        await sizeRangeFilter.clickApplyButton();
        await searchResults.sortBySize('DESC');

        const results: any = dataTable.geCellElementDetail('Size');
        for (const currentResult of results) {
            try {
                const currentSize = await currentResult.getAttribute('title');
                if (currentSize && currentSize.trim() !== '') {
                    await expect(parseInt(currentSize, 10) <= toSize).toBe(true);
                }
            } catch (e) {
            }
        }

        await searchFilters.checkNameFilterIsDisplayed();
        await searchFilters.checkNameFilterIsExpanded();
        await nameFilter.searchByName('z*');
        await searchResults.sortBySize('DESC');

        const resultsSize: any = dataTable.geCellElementDetail('Size');
        for (const currentResult of resultsSize) {
            try {
                const currentSize = await currentResult.getAttribute('title');
                if (currentSize && currentSize.trim() !== '') {
                    await expect(parseInt(currentSize, 10) <= toSize).toBe(true);
                }
            } catch (e) {
            }
        }

        const resultsDisplay: any = dataTable.geCellElementDetail('Display name');
        for (const currentResult of resultsDisplay) {
            try {
                const name = await currentResult.getAttribute('title');
                if (name && name.trim() !== '') {
                    await expect(/z*/i.test(name)).toBe(true);
                }
            } catch (e) {
            }
        }
    });

    it('[C276951] Should not display folders when Size range is applied', async () => {
        await sizeRangeFilter.checkToFieldIsDisplayed();
        await sizeRangeFilter.putToNumber(99999999);
        await sizeRangeFilter.putFromNumber(0);
        await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

        await sizeRangeFilter.clickApplyButton();
        await searchResults.tableIsLoaded();
        await searchFilters.checkCheckListFilterIsDisplayed();
        await searchFilters.clickCheckListFilter();
        await searchFilters.checkCheckListFilterIsExpanded();

        await searchFilters.checkListFiltersPage().clickCheckListOption('Folder');

        await searchResults.tableIsLoaded();
        await searchResults.checkNoResultMessageIsDisplayed();
    });

    it('[C276952] Should only display empty files when size range is set from 0 to 1', async () => {
        await sizeRangeFilter.checkToFieldIsDisplayed();
        await sizeRangeFilter.putToNumber(1);
        await sizeRangeFilter.putFromNumber(0);
        await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

        await sizeRangeFilter.clickApplyButton();
        await searchResults.tableIsLoaded();
        await searchResults.sortBySize('DESC');

        const results: any = dataTable.geCellElementDetail('Size');
        for (const currentResult of results) {
            try {
                const currentSize = await currentResult.getAttribute('title');
                if (currentSize && currentSize.trim() !== '') {
                    await expect(currentSize === '0').toBe(true);
                }
            } catch (e) {
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

        const results: any = dataTable.geCellElementDetail('Size');
        for (const currentResult of results) {
            try {
                const currentSize = await currentResult.getAttribute('title');
                if (currentSize && currentSize.trim() !== '') {
                    await expect(parseInt(currentSize, 10) <= 1000).toBe(true);
                }
            } catch (e) {
            }
        }

        await sizeRangeFilter.clickClearButton();

        await expect(await sizeRangeFilter.getFromNumber()).toEqual('');
        await expect(await sizeRangeFilter.getToNumber()).toEqual('');

        const resultsSize: any = dataTable.geCellElementDetail('Size');
        for (const currentResult of resultsSize) {
            try {
                const currentSize = await currentResult.getAttribute('title');
                if (currentSize && currentSize.trim() !== '') {
                    await expect(parseInt(currentSize, 10) >= 1000).toBe(true);
                }
            } catch (e) {
            }
        }
    });

    it('[C277137] Number Range should be inclusive', async () => {
        await sizeRangeFilter.checkToFieldIsDisplayed();
        await sizeRangeFilter.putToNumber(2);
        await sizeRangeFilter.putFromNumber(1);
        await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

        await sizeRangeFilter.clickApplyButton();

        await searchResults.tableIsLoaded();
        await searchResults.checkContentIsDisplayed(file2BytesModel.name);

        await sizeRangeFilter.checkToFieldIsDisplayed();
        await sizeRangeFilter.putToNumber(1);
        await sizeRangeFilter.putFromNumber(0);
        await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

        await sizeRangeFilter.clickApplyButton();

        await searchResults.tableIsLoaded();
        await searchResults.checkContentIsNotDisplayed(file2BytesModel.name);

        await sizeRangeFilter.checkToFieldIsDisplayed();
        await sizeRangeFilter.putToNumber(3);
        await sizeRangeFilter.putFromNumber(2);
        await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

        await sizeRangeFilter.clickApplyButton();

        await searchResults.tableIsLoaded();
        await searchResults.checkContentIsDisplayed(file2BytesModel.name);

        await sizeRangeFilter.checkToFieldIsDisplayed();
        await sizeRangeFilter.putToNumber(4);
        await sizeRangeFilter.putFromNumber(3);
        await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

        await sizeRangeFilter.clickApplyButton();

        await searchResults.tableIsLoaded();
        await searchResults.checkContentIsNotDisplayed(file2BytesModel.name);
    });

    describe('Configuration change', () => {
        let jsonFile;

        beforeEach(() => {
            jsonFile = SearchConfiguration.getConfiguration();
        });

        it('[C276928] Should be able to change the field property for number range', async () => {
            await navigationBarPage.clickContentServicesButton();

            jsonFile.categories[3].component.settings.field = 'cm:created';

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchDialog.checkSearchIconIsVisible();
            await searchDialog.clickOnSearchIcon();
            await searchDialog.enterTextAndPressEnter('*');

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
            await searchResults.tableIsLoaded();
            await searchResults.sortByCreated('DESC');

            const results: any = dataTable.geCellElementDetail('Created');
            for (const currentResult of results) {
                const currentDate = await currentResult.getAttribute('title');
                const currentDateFormatted = DateUtil.parse(currentDate, 'MMM DD, YYYY, h:mm:ss a');

                await expect(currentDateFormatted.getFullYear() <= toYear).toBe(true);
                await expect(currentDateFormatted.getFullYear() >= fromYear).toBe(true);
            }

        });

        it('[C277139] Should be able to set To field to be exclusive', async () => {
            await navigationBarPage.clickContentServicesButton();

            jsonFile.categories[3].component.settings.format = '[{FROM} TO {TO}>';

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchDialog.checkSearchIconIsVisible();
            await searchDialog.clickOnSearchIcon();
            await searchDialog.enterTextAndPressEnter('*');

            await searchFilters.checkSizeRangeFilterIsDisplayed();
            await searchFilters.clickSizeRangeFilterHeader();
            await searchFilters.checkSizeRangeFilterIsExpanded();

            await sizeRangeFilter.checkToFieldIsDisplayed();
            await sizeRangeFilter.putToNumber(2);
            await sizeRangeFilter.putFromNumber(1);
            await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

            await sizeRangeFilter.clickApplyButton();

            await searchResults.tableIsLoaded();
            await searchResults.checkContentIsNotDisplayed(file2BytesModel.name);

            await sizeRangeFilter.checkToFieldIsDisplayed();
            await sizeRangeFilter.putToNumber(3);
            await sizeRangeFilter.putFromNumber(1);
            await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

            await sizeRangeFilter.clickApplyButton();

            await searchResults.tableIsLoaded();
            await searchResults.checkContentIsDisplayed(file2BytesModel.name);
        });

        it('[C277140] Should be able to set From field to be exclusive', async () => {
            await navigationBarPage.clickContentServicesButton();

            jsonFile.categories[3].component.settings.format = '<{FROM} TO {TO}]';

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchDialog.checkSearchIconIsVisible();
            await searchDialog.clickOnSearchIcon();
            await searchDialog.enterTextAndPressEnter('*');

            await searchFilters.checkSizeRangeFilterIsDisplayed();
            await searchFilters.clickSizeRangeFilterHeader();
            await searchFilters.checkSizeRangeFilterIsExpanded();

            await sizeRangeFilter.checkToFieldIsDisplayed();
            await sizeRangeFilter.putToNumber(3);
            await sizeRangeFilter.putFromNumber(1);
            await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

            await sizeRangeFilter.clickApplyButton();

            await searchResults.tableIsLoaded();
            await searchResults.checkContentIsDisplayed(file2BytesModel.name);

            await sizeRangeFilter.checkToFieldIsDisplayed();
            await sizeRangeFilter.putToNumber(3);
            await sizeRangeFilter.putFromNumber(2);
            await expect(await sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

            await sizeRangeFilter.clickApplyButton();

            await searchResults.tableIsLoaded();
            await searchResults.checkContentIsNotDisplayed(file2BytesModel.name);
        });
    });
});
