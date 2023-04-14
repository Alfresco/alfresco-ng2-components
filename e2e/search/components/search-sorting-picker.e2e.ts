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

import { createApiService,
    LocalStorageUtil,
    LoginPage,
    SearchSortingPickerPage,
    UploadActions,
    UserModel,
    UsersActions
} from '@alfresco/adf-testing';
import { SearchBarPage } from '../pages/search-bar.page';
import { SearchResultsPage } from '../pages/search-results.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { SearchFiltersPage } from '../pages/search-filters.page';
import { ContentServicesPage } from '../../core/pages/content-services.page';
import { browser } from 'protractor';
import { SearchConfiguration } from '../search.config';
import { NodesApi } from '@alfresco/js-api';

describe('Search Sorting Picker', () => {

    const loginPage = new LoginPage();
    const searchBarPage = new SearchBarPage();
    const searchFilters = new SearchFiltersPage();
    const searchResults = new SearchResultsPage();
    const navigationBarPage = new NavigationBarPage();
    const searchSortingPicker = new SearchSortingPickerPage();
    const contentServices = new ContentServicesPage();
    const acsUser = new UserModel();

    const pngAModel = {
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_path
    };

    const pngDModel = {
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG_D.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG_D.file_path
    };

    let pngA; let pngD;
    const apiService = createApiService();

    const uploadActions = new UploadActions(apiService);
    const usersActions = new UsersActions(apiService);
    const nodesApi = new NodesApi(apiService.getInstance());

    const search = '_png_file.png';
    let jsonFile;

    const checkSortingDropdownIsDisplayed = async (key = 'Modifier', label = 'Modifier') => {
        await navigationBarPage.navigateToContentServices();
        jsonFile = SearchConfiguration.getConfiguration();
        jsonFile.sorting.options.push({
            key,
            label,
            type: 'FIELD',
            field: 'cm:modifier',
            ascending: true
        });
        await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

        await searchBarPage.checkSearchIconIsVisible();
        await searchBarPage.clickOnSearchIcon();
        await searchBarPage.enterTextAndPressEnter(search);
        await searchResults.dataTable.waitTillContentLoaded();

        await searchSortingPicker.checkSortingDropdownIsDisplayed();
    };

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');
        await usersActions.createUser(acsUser);

        await apiService.login(acsUser.username, acsUser.password);

        pngA = await uploadActions.uploadFile(pngAModel.location, pngAModel.name, '-my-');
        pngD = await uploadActions.uploadFile(pngDModel.location, pngDModel.name, '-my-');
        await browser.sleep(browser.params.testConfig.timeouts.index_search);

        await loginPage.login(acsUser.username, acsUser.password);
    });

    afterAll(async () => {
        await uploadActions.deleteFileOrFolder(pngA.entry.id);
        await uploadActions.deleteFileOrFolder(pngD.entry.id);

        await navigationBarPage.clickLogoutButton();
    });

    beforeEach(async () => {
        await searchBarPage.clickOnSearchIcon();
        await searchBarPage.enterTextAndPressEnter(search);
        await searchResults.dataTable.waitTillContentLoaded();
    });

    afterEach(async () => {
        await navigationBarPage.clickHomeButton();
    });

    it(`[C277269] Should see the "sort by" option when search results are displayed in search results page`, async () => {
        await searchSortingPicker.checkSortingDropdownIsDisplayed();
    });

    it(`[C277270] Should see the icon for ASC and DESC sort when search results are displayed in the search results page`, async () => {
        await searchSortingPicker.checkOrderArrowIsDisplayed();
    });

    it('[C277271] Should be able to add a custom search sorter in the "sort by" option', async () => {
        await checkSortingDropdownIsDisplayed();
        await searchSortingPicker.clickSortingDropdown();
        await searchSortingPicker.checkOptionsDropdownIsDisplayed();
        await searchSortingPicker.checkOptionIsDisplayed('Modifier');
    });

    it('[C277272] Should be able to exclude a standard search sorter from the sorting option', async () => {
        await navigationBarPage.navigateToContentServices();
        jsonFile = SearchConfiguration.getConfiguration();
        const removedOption = jsonFile.sorting.options.splice(0, 1);
        await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

        await searchBarPage.checkSearchIconIsVisible();
        await searchBarPage.clickOnSearchIcon();
        await searchBarPage.enterTextAndPressEnter(search);
        await searchResults.dataTable.waitTillContentLoaded();

        await searchSortingPicker.checkSortingDropdownIsDisplayed();
        await searchSortingPicker.clickSortingDropdown();
        await searchSortingPicker.checkOptionsDropdownIsDisplayed();
        await searchSortingPicker.checkOptionIsNotDisplayed(removedOption[0].label);
    });

    it('[C277273] Should be able to set a default order for a search sorting option', async () => {
        await navigationBarPage.navigateToContentServices();

        jsonFile = SearchConfiguration.getConfiguration();
        jsonFile.sorting.options[0].ascending = false;
        jsonFile.sorting.defaults[0] = {
            key: 'Size',
            label: 'Size',
            type: 'FIELD',
            field: 'content.size',
            ascending: true
        };

        await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

        await searchBarPage.checkSearchIconIsVisible();
        await searchBarPage.clickOnSearchIcon();
        await searchBarPage.enterTextAndPressEnter(search);
        await searchResults.dataTable.waitTillContentLoaded();

        await searchSortingPicker.checkSortingDropdownIsDisplayed();
        await searchSortingPicker.clickSortingDropdown();
        await searchSortingPicker.checkOptionIsDisplayed('Name');
        await searchSortingPicker.clickSortingOption('Name');
        await expect(await searchSortingPicker.checkOrderArrowIsDownward()).toBe(true);
    });

    it('[C277280] Should be able to sort the search results by "Name" ASC', async () => {
        await searchFilters.checkSearchFiltersIsDisplayed();
        await searchFilters.creatorCheckListFiltersPage().filterBy(`${acsUser.firstName} ${acsUser.lastName}`);
        await searchResults.sortByName('ASC');

        await expect(await searchResults.checkListIsOrderedByNameAsc()).toBe(true);
    });

    it('[C277281] Should be able to sort the search results by "Name" DESC', async () => {
        await searchFilters.checkSearchFiltersIsDisplayed();
        await searchFilters.creatorCheckListFiltersPage().filterBy(`${acsUser.firstName} ${acsUser.lastName}`);
        await searchResults.sortByName('DESC');
        await expect(await searchResults.checkListIsOrderedByNameDesc()).toBe(true);
    });

    it('[C277286] Should be able to sort the search results by "Created Date" ASC', async () => {
        await searchResults.sortByCreated('ASC');
        const results = await searchResults.dataTable.geCellElementDetail('Created');
        await expect(contentServices.checkElementsDateSortedAsc(results)).toBe(true);
    });

    it('[C277287] Should be able to sort the search results by "Created Date" DESC', async () => {
        await searchResults.sortByCreated('DESC');
        const results = await searchResults.dataTable.geCellElementDetail('Created');
        await expect(contentServices.checkElementsDateSortedDesc(results)).toBe(true);
    });

    it('[C277288] Should be able to sort the search results by "Modified Date" ASC', async () => {
        await checkSortingDropdownIsDisplayed('Modified Date', 'Modified Date');
        await searchSortingPicker.sortBy('ASC', 'Modified Date');

        const idList = await contentServices.getElementsDisplayedId();
        const numberOfElements = await contentServices.numberOfResultsDisplayed();

        const nodeList = await getNodesDisplayed(numberOfElements, idList);

        const modifiedDateList = [];
        for (let i = 0; i < nodeList.length; i++) {
            modifiedDateList.push(new Date(nodeList[i].entry.modifiedAt));
        }

        await expect(contentServices.checkElementsDateSortedAsc(modifiedDateList)).toBe(true);
    });

    const getNodesDisplayed = async function(numberOfElements: number, idList: string[]) {
        const promises = [];
        let nodeList;

        for (let i = 0; i < (numberOfElements - 1); i++) {
            if (idList[i] && idList[i].trim() !== '') {
                promises.push(nodesApi.getNode(idList[i]));
            }
        }
        nodeList = await Promise.all(promises);
        return nodeList;
    };
});
