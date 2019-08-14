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

import { LoginPage, LocalStorageUtil, UploadActions, DataTableComponentPage } from '@alfresco/adf-testing';
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

describe('Search Slider Filter', () => {

    const loginPage = new LoginPage();
    const searchDialog = new SearchDialog();
    const searchFilters = new SearchFiltersPage();
    const sizeSliderFilter = searchFilters.sizeSliderFilterPage();
    const searchResults = new SearchResultsPage();
    const navigationBarPage = new NavigationBarPage();
    const dataTable = new DataTableComponentPage();

    const acsUser = new AcsUserModel();

    const file2BytesModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.UNSUPPORTED.file_name,
        'location': resources.Files.ADF_DOCUMENTS.UNSUPPORTED.file_location
    });

    let file2Bytes;
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
        await browser.sleep(15000);

        await loginPage.loginToContentServices(acsUser.id, acsUser.password);

        await searchDialog.checkSearchIconIsVisible();
        await searchDialog.clickOnSearchIcon();
        await searchDialog.enterTextAndPressEnter('*');

    });

    afterAll(async () => {
        try {
            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            await uploadActions.deleteFileOrFolder(file2Bytes.entry.id);
        } catch (error) {
        }

        await navigationBarPage.clickLogoutButton();

    });

    afterEach(async () => {
        await browser.refresh();
    });

    it('[C276970] Should be able to expand/collapse Search Size Slider', async () => {
        await searchFilters.checkSizeSliderFilterIsDisplayed();
        await searchFilters.clickSizeSliderFilterHeader();
        await sizeSliderFilter.checkSliderIsDisplayed();
        await sizeSliderFilter.checkClearButtonIsDisplayed();
        await sizeSliderFilter.checkClearButtonIsEnabled();
        await searchFilters.clickSizeSliderFilterHeader();
        await searchFilters.checkSizeSliderFilterIsCollapsed();
        await sizeSliderFilter.checkSliderIsNotDisplayed();
        await sizeSliderFilter.checkClearButtonIsNotDisplayed();
    });

    it('[C276972] Should be keep value when Search Size Slider is collapsed', async () => {
        const size = 5;

        await searchFilters.checkSizeSliderFilterIsDisplayed();
        await searchFilters.clickSizeSliderFilterHeader();
        await sizeSliderFilter.checkSliderIsDisplayed();
        await sizeSliderFilter.setValue(size);
        await searchFilters.clickSizeSliderFilterHeader();
        await searchFilters.checkSizeSliderFilterIsCollapsed();
        await searchFilters.clickSizeSliderFilterHeader();
        await searchFilters.checkSizeSliderFilterIsExpanded();
        await searchFilters.checkSizeSliderFilterIsDisplayed();

        await expect(await sizeSliderFilter.getValue()).toEqual(`${size}`);
    });

    it('[C276981] Should be able to clear value in Search Size Slider', async () => {
        const size = 5;

        await searchFilters.checkSizeSliderFilterIsDisplayed();
        await searchFilters.clickSizeSliderFilterHeader();
        await sizeSliderFilter.checkSliderIsDisplayed();
        await sizeSliderFilter.setValue(size);
        await searchResults.sortBySize('DESC');
        await searchResults.tableIsLoaded();

        const results: any = dataTable.geCellElementDetail('Size');
        for (const currentResult of results) {
            try {
                const currentSize = await currentResult.getAttribute('title');
                if (currentSize && currentSize.trim() !== '') {
                    await expect(parseInt(currentSize, 10) <= 5000).toBe(true);
                }
            } catch (e) {
            }
        }

        await sizeSliderFilter.checkSliderIsDisplayed();
        await sizeSliderFilter.clickClearButton();

        await searchResults.sortBySize('DESC');
        await searchResults.tableIsLoaded();

        const resultsSize: any = dataTable.geCellElementDetail('Size');
        for (const currentResult of resultsSize) {
            try {
                const currentSize = await currentResult.getAttribute('title');
                if (currentSize && currentSize.trim() !== '') {
                    await expect(parseInt(currentSize, 10) >= 5000).toBe(true);
                }
            } catch (e) {
            }
        }
    });

    describe('Configuration change', () => {
        let jsonFile;

        beforeEach(async () => {
            jsonFile = SearchConfiguration.getConfiguration();
            await navigationBarPage.clickContentServicesButton();
        });

        it('[C276983] Should be able to disable thumb label in Search Size Slider', async () => {
            jsonFile.categories[2].component.settings.thumbLabel = false;

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchDialog.checkSearchIconIsVisible();
            await searchDialog.clickOnSearchIcon();
            await searchDialog.enterTextAndPressEnter('*');

            await searchFilters.checkSizeSliderFilterIsDisplayed();
            await searchFilters.clickSizeSliderFilterHeader();
            await searchFilters.checkSizeSliderFilterIsExpanded();

            await sizeSliderFilter.checkSliderWithThumbLabelIsNotDisplayed();
        });

        it('[C276985] Should be able to set min value for Search Size Slider', async () => {
            const minSize = 3;
            jsonFile.categories[2].component.settings.min = minSize;

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchDialog.checkSearchIconIsVisible();
            await searchDialog.clickOnSearchIcon();
            await searchDialog.enterTextAndPressEnter('*');

            await searchFilters.checkSizeSliderFilterIsDisplayed();
            await searchFilters.clickSizeSliderFilterHeader();
            await searchFilters.checkSizeSliderFilterIsExpanded();

            await sizeSliderFilter.checkSliderIsDisplayed();

            await expect(await sizeSliderFilter.getMinValue()).toEqual(`${minSize}`);
        });

        it('[C276986] Should be able to set max value for Search Size Slider', async () => {
            const maxSize = 50;
            jsonFile.categories[2].component.settings.max = maxSize;

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchDialog.checkSearchIconIsVisible();
            await searchDialog.clickOnSearchIcon();
            await searchDialog.enterTextAndPressEnter('*');

            await searchFilters.checkSizeSliderFilterIsDisplayed();
            await searchFilters.clickSizeSliderFilterHeader();
            await searchFilters.checkSizeSliderFilterIsExpanded();

            await sizeSliderFilter.checkSliderIsDisplayed();

            await expect(await sizeSliderFilter.getMaxValue()).toEqual(`${maxSize}`);
        });

        it('[C276987] Should be able to set steps for Search Size Slider', async () => {
            const step = 10;
            jsonFile.categories[2].component.settings.step = step;

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchDialog.checkSearchIconIsVisible();
            await searchDialog.clickOnSearchIcon();
            await searchDialog.enterTextAndPressEnter('*');

            await searchFilters.checkSizeSliderFilterIsDisplayed();
            await searchFilters.clickSizeSliderFilterHeader();
            await searchFilters.checkSizeSliderFilterIsExpanded();

            const randomValue = 5;
            await sizeSliderFilter.checkSliderIsDisplayed();
            await sizeSliderFilter.setValue(randomValue);

            await expect(await sizeSliderFilter.getValue()).toEqual(`0`);
            await sizeSliderFilter.setValue(step);
            await expect(await sizeSliderFilter.getValue()).toEqual(`${step}`);
        });
    });
});
