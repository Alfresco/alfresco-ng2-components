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

describe('Search Slider Filter', () => {

    const loginPage = new LoginPage();
    const searchBarPage = new SearchBarPage();
    const searchFilters = new SearchFiltersPage();
    const sizeSliderFilter = searchFilters.sizeSliderFilterPage();
    const searchResults = new SearchResultsPage();
    const navigationBarPage = new NavigationBarPage();
    const dataTable = new DataTableComponentPage();

    const acsUser = new UserModel();

    const file2BytesModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.UNSUPPORTED.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.UNSUPPORTED.file_path
    });

    let file2Bytes;
    const apiService = createApiService();

    const uploadActions = new UploadActions(apiService);
    const usersActions = new UsersActions(apiService);

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        await usersActions.createUser(acsUser);

        await apiService.login(acsUser.username, acsUser.password);

        file2Bytes = await uploadActions.uploadFile(file2BytesModel.location, file2BytesModel.name, '-my-');
        await browser.sleep(browser.params.testConfig.timeouts.index_search);

        await loginPage.login(acsUser.username, acsUser.password);

        await searchBarPage.checkSearchIconIsVisible();
        await searchBarPage.clickOnSearchIcon();
        await searchBarPage.enterTextAndPressEnter('*');
        await searchResults.dataTable.waitTillContentLoaded();

    });

    afterAll(async () => {
        try {
            await apiService.login(acsUser.username, acsUser.password);
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

        const results = await dataTable.geCellElementDetail('Size') as ElementFinder[];
        for (const currentResult of results) {
            const currentSize = await BrowserActions.getAttribute(currentResult, 'title');

            if (currentSize && currentSize.trim() !== '') {
                await expect(parseInt(currentSize, 10) <= 5000).toBe(true);
            }
        }

        await sizeSliderFilter.checkSliderIsDisplayed();
        await sizeSliderFilter.clickClearButton();

        await searchResults.sortBySize('DESC');

        const resultsSize = await dataTable.geCellElementDetail('Size') as ElementFinder[];
        for (const currentResult of resultsSize) {
            const currentSize = await BrowserActions.getAttribute(currentResult, 'title');

            if (currentSize && currentSize.trim() !== '') {
                await expect(parseInt(currentSize, 10) >= 5000).toBe(true);
            }
        }
    });

    describe('Configuration change', () => {
        let jsonFile;

        beforeEach(async () => {
            jsonFile = SearchConfiguration.getConfiguration();
            await navigationBarPage.navigateToContentServices();
        });

        it('[C276983] Should be able to disable thumb label in Search Size Slider', async () => {
            jsonFile.categories[2].component.settings.thumbLabel = false;

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchBarPage.checkSearchIconIsVisible();
            await searchBarPage.clickOnSearchIcon();
            await searchBarPage.enterTextAndPressEnter('*');
            await searchResults.dataTable.waitTillContentLoaded();

            await searchFilters.checkSizeSliderFilterIsDisplayed();
            await searchFilters.clickSizeSliderFilterHeader();
            await searchFilters.checkSizeSliderFilterIsExpanded();

            await sizeSliderFilter.checkSliderWithThumbLabelIsNotDisplayed();
        });

        it('[C276985] Should be able to set min value for Search Size Slider', async () => {
            const minSize = 3;
            jsonFile.categories[2].component.settings.min = minSize;

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchBarPage.checkSearchIconIsVisible();
            await searchBarPage.clickOnSearchIcon();
            await searchBarPage.enterTextAndPressEnter('*');
            await searchResults.dataTable.waitTillContentLoaded();

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

            await searchBarPage.checkSearchIconIsVisible();
            await searchBarPage.clickOnSearchIcon();
            await searchBarPage.enterTextAndPressEnter('*');
            await searchResults.dataTable.waitTillContentLoaded();

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

            await searchBarPage.checkSearchIconIsVisible();
            await searchBarPage.clickOnSearchIcon();
            await searchBarPage.enterTextAndPressEnter('*');
            await searchResults.dataTable.waitTillContentLoaded();

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
