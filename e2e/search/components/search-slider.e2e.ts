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
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { SearchFiltersPage } from '../../pages/adf/searchFiltersPage';

import TestConfig = require('../../test.config');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '../../actions/ACS/upload.actions';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';
import { browser } from 'protractor';
import resources = require('../../util/resources');
import { SearchConfiguration } from '../search.config';

describe('Search Number Range Filter', () => {

    const loginPage = new LoginPage();
    const searchDialog = new SearchDialog();
    const searchFilters = new SearchFiltersPage();
    const sizeSliderFilter = searchFilters.sizeSliderFilterPage();
    const searchResults = new SearchResultsPage();
    const navigationBar = new NavigationBarPage();
    const dataTable = new DataTableComponentPage();

    const acsUser = new AcsUserModel();

    const file2BytesModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.UNSUPPORTED.file_name,
        'location': resources.Files.ADF_DOCUMENTS.UNSUPPORTED.file_location
    });

    let file2Bytes;
    const uploadActions = new UploadActions();

    beforeAll(async (done) => {

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        file2Bytes = await uploadActions.uploadFile(this.alfrescoJsApi, file2BytesModel.location, file2BytesModel.name, '-my-');
        await browser.driver.sleep(15000);

        loginPage.loginToContentServices(acsUser.id, acsUser.password);

        searchDialog.checkSearchIconIsVisible()
            .clickOnSearchIcon()
            .enterTextAndPressEnter('*');

        done();
    });

    afterAll(async (done) => {
        try {
            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, file2Bytes.entry.id);
        } catch (error) {
        }
        done();
    });

    beforeEach(() => {
        searchFilters.checkSizeSliderFilterIsDisplayed()
            .clickSizeSliderFilterHeader()
            .checkSizeSliderFilterIsExpanded();
    });

    afterEach(async (done) => {
        await browser.refresh();
        done();
    });

    it('[C276970] Should be able to expand/collapse Search Size Slider', () => {
        searchFilters.checkSizeSliderFilterIsExpanded()
            .clickSizeSliderFilterHeader();
        sizeSliderFilter.checkSliderIsDisplayed()
            .checkClearButtonIsDisplayed()
            .checkClearButtonIsEnabled();
        searchFilters.checkSizeSliderFilterIsCollapsed();
    });

    it('[C276972] Should be keep value when Search Size Slider is collapsed', () => {
        const size = 5;
        sizeSliderFilter.checkSliderIsDisplayed().setValue(size);
        searchFilters.clickSizeSliderFilterHeader()
            .checkSizeSliderFilterIsCollapsed()
            .clickSizeSliderFilterHeader()
            .checkSizeSliderFilterIsExpanded()
            .checkSizeSliderFilterIsDisplayed();
        expect(sizeSliderFilter.getValue()).toEqual(`${size}`);
    });

    it('[C276981] Should be able to clear value in Search Size Slider', () => {
        const size = 5;
        sizeSliderFilter.checkSliderIsDisplayed().setValue(size);
        searchResults.sortBySize(false)
            .tableIsLoaded();

        browser.controlFlow().execute(async () => {
            const results = await dataTable.geCellElementDetail('Size');
            for (const currentResult of results) {
                try {
                    const currentSize = await currentResult.getAttribute('title');
                    if (currentSize && currentSize.trim() !== '') {
                        await expect(parseInt(currentSize, 10) <= 5000).toBe(true);
                    }
                } catch (e) {
                }
            }
        });

        sizeSliderFilter.checkSliderIsDisplayed()
            .clickClearButton();

        searchResults.sortBySize(false)
            .tableIsLoaded();

        browser.controlFlow().execute(async () => {
            const results = await dataTable.geCellElementDetail('Size');
            for (const currentResult of results) {
                try {

                    const currentSize = await currentResult.getAttribute('title');
                    if (currentSize && currentSize.trim() !== '') {
                        await expect(parseInt(currentSize, 10) >= 5000).toBe(true);
                    }
                } catch (e) {
                }
            }
        });
    });

    describe('Configuration change', () => {
        let jsonFile;

        beforeEach(() => {
            jsonFile = SearchConfiguration.getConfiguration();
        });

        it('[C276983] Should be able to disable thumb label in Search Size Slider', async () => {
            navigationBar.clickContentServicesButton();

            jsonFile.categories[2].component.settings.thumbLabel = false;

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            searchDialog.checkSearchIconIsVisible()
                .clickOnSearchIcon()
                .enterTextAndPressEnter('*');

            searchFilters.checkSizeSliderFilterIsDisplayed()
                .clickSizeSliderFilterHeader()
                .checkSizeSliderFilterIsExpanded();

            sizeSliderFilter.checkSliderWithThumbLabelIsNotDisplayed();
        });

        it('[C276985] Should be able to set min value for Search Size Slider', async () => {
            navigationBar.clickContentServicesButton();

            const minSize = 3;
            jsonFile.categories[2].component.settings.min = minSize;

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            searchDialog.checkSearchIconIsVisible()
                .clickOnSearchIcon()
                .enterTextAndPressEnter('*');

            searchFilters.checkSizeSliderFilterIsDisplayed()
                .clickSizeSliderFilterHeader()
                .checkSizeSliderFilterIsExpanded();

            sizeSliderFilter.checkSliderIsDisplayed();

            expect(sizeSliderFilter.getMinValue()).toEqual(`${minSize}`);
        });

        it('[C276986] Should be able to set max value for Search Size Slider', async () => {
            navigationBar.clickContentServicesButton();

            const maxSize = 50;
            jsonFile.categories[2].component.settings.max = maxSize;

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            searchDialog.checkSearchIconIsVisible()
                .clickOnSearchIcon()
                .enterTextAndPressEnter('*');

            searchFilters.checkSizeSliderFilterIsDisplayed()
                .clickSizeSliderFilterHeader()
                .checkSizeSliderFilterIsExpanded();

            sizeSliderFilter.checkSliderIsDisplayed();

            expect(sizeSliderFilter.getMaxValue()).toEqual(`${maxSize}`);
        });

        it('[C276987] Should be able to set steps for Search Size Slider', async () => {
            navigationBar.clickContentServicesButton();

            const step = 10;
            jsonFile.categories[2].component.settings.step = step;

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            searchDialog.checkSearchIconIsVisible()
                .clickOnSearchIcon()
                .enterTextAndPressEnter('*');

            searchFilters.checkSizeSliderFilterIsDisplayed()
                .clickSizeSliderFilterHeader()
                .checkSizeSliderFilterIsExpanded();

            const randomValue = 5;
            sizeSliderFilter.checkSliderIsDisplayed()
                .setValue(randomValue);
            expect(sizeSliderFilter.getValue()).toEqual(`0`);
            sizeSliderFilter.setValue(step);
            expect(sizeSliderFilter.getValue()).toEqual(`${step}`);
        });
    });
});
