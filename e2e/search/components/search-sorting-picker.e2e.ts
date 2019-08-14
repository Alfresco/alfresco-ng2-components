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

import {
    LoginPage,
    LocalStorageUtil,
    SearchSortingPickerPage,
    UploadActions
} from '@alfresco/adf-testing';
import { SearchDialog } from '../../pages/adf/dialog/searchDialog';
import { SearchResultsPage } from '../../pages/adf/searchResultsPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { SearchFiltersPage } from '../../pages/adf/searchFiltersPage';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { NodeActions } from '../../actions/ACS/node.actions';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { browser } from 'protractor';
import resources = require('../../util/resources');
import { SearchConfiguration } from '../search.config';

describe('Search Sorting Picker', () => {

    const loginPage = new LoginPage();
    const searchDialog = new SearchDialog();
    const searchFilters = new SearchFiltersPage();
    const searchResults = new SearchResultsPage();
    const navigationBarPage = new NavigationBarPage();
    const searchSortingPicker = new SearchSortingPickerPage();
    const contentServices = new ContentServicesPage();
    const nodeActions = new NodeActions();
    const acsUser = new AcsUserModel();

    const pngAModel = {
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    };

    const pngDModel = {
        'name': resources.Files.ADF_DOCUMENTS.PNG_D.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG_D.file_location
    };

    let pngA, pngD;
    this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: browser.params.testConfig.adf_acs.host
        });
    const uploadActions = new UploadActions(this.alfrescoJsApi);
    const search = '_png_file.png';
    let jsonFile;

    beforeAll(async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        pngA = await uploadActions.uploadFile(pngAModel.location, pngAModel.name, '-my-');
        pngD = await uploadActions.uploadFile(pngDModel.location, pngDModel.name, '-my-');
        await browser.sleep(12000);

        await loginPage.loginToContentServices(acsUser.id, acsUser.password);

    });

    afterAll(async () => {
        await uploadActions.deleteFileOrFolder(pngA.entry.id);
        await uploadActions.deleteFileOrFolder(pngD.entry.id);

        await navigationBarPage.clickLogoutButton();

    });

    beforeEach(async () => {
        await searchDialog.clickOnSearchIcon();
        await searchDialog.enterTextAndPressEnter(search);
    });

    afterEach(async () => {
        await navigationBarPage.clickHomeButton();
    });

    it(`[C277269] Should see the "sort by" option when search results are displayed in search results page`, async () => {
        await searchSortingPicker.checkSortingSelectorIsDisplayed();
    });

    it(`[C277270] Should see the icon for ASC and DESC sort when search results are displayed in the search results page`, async () => {
        await searchSortingPicker.checkOrderArrowIsDisplayed();
    });

    it('[C277271] Should be able to add a custom search sorter in the "sort by" option', async () => {
        await navigationBarPage.clickContentServicesButton();
        jsonFile = SearchConfiguration.getConfiguration();
        jsonFile.sorting.options.push({
            'key': 'Modifier',
            'label': 'Modifier',
            'type': 'FIELD',
            'field': 'cm:modifier',
            'ascending': true
        });
        await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

        await searchDialog.checkSearchIconIsVisible();
        await searchDialog.clickOnSearchIcon();
        await searchDialog.enterTextAndPressEnter(search);

        await searchSortingPicker.checkSortingSelectorIsDisplayed();
        await searchSortingPicker.clickSortingSelector();
        await searchSortingPicker.checkOptionsDropdownIsDisplayed();
        await searchSortingPicker.checkOptionIsDisplayed('Modifier');
    });

    it('[C277272] Should be able to exclude a standard search sorter from the sorting option', async () => {
        await navigationBarPage.clickContentServicesButton();
        jsonFile = SearchConfiguration.getConfiguration();
        const removedOption = jsonFile.sorting.options.splice(0, 1);
        await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

        await searchDialog.checkSearchIconIsVisible();
        await searchDialog.clickOnSearchIcon();
        await searchDialog.enterTextAndPressEnter(search);

        await searchSortingPicker.checkSortingSelectorIsDisplayed();
        await searchSortingPicker.clickSortingSelector();
        await searchSortingPicker.checkOptionsDropdownIsDisplayed();
        await searchSortingPicker.checkOptionIsNotDisplayed(removedOption[0].label);
    });

    it('[C277273] Should be able to set a default order for a search sorting option', async () => {
        await navigationBarPage.clickContentServicesButton();

        jsonFile = SearchConfiguration.getConfiguration();
        jsonFile.sorting.options[0].ascending = false;
        jsonFile.sorting.defaults[0] = {
            'key': 'Size',
            'label': 'Size',
            'type': 'FIELD',
            'field': 'content.size',
            'ascending': true
        };

        await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

        await searchDialog.checkSearchIconIsVisible();
        await searchDialog.clickOnSearchIcon();
        await searchDialog.enterTextAndPressEnter(search);

        await searchSortingPicker.checkSortingSelectorIsDisplayed();
        await searchSortingPicker.clickSortingSelector();
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
        const results: any = searchResults.dataTable.geCellElementDetail('Created');
        await expect(contentServices.checkElementsDateSortedAsc(results)).toBe(true);
    });

    it('[C277287] Should be able to sort the search results by "Created Date" DESC', async () => {
        await searchResults.sortByCreated('DESC');
        const results = searchResults.dataTable.geCellElementDetail('Created');
        await expect(contentServices.checkElementsDateSortedDesc(results)).toBe(true);
    });

    it('[C277288] Should be able to sort the search results by "Modified Date" ASC', async () => {
        await navigationBarPage.clickContentServicesButton();

        jsonFile = SearchConfiguration.getConfiguration();
        jsonFile.sorting.options.push({
            'key': 'Modified Date',
            'label': 'Modified Date',
            'type': 'FIELD',
            'field': 'cm:modified',
            'ascending': true
        });
        await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

        await searchDialog.checkSearchIconIsVisible();
        await searchDialog.clickOnSearchIcon();
        await searchDialog.enterTextAndPressEnter(search);

        await searchSortingPicker.checkSortingSelectorIsDisplayed();
        await searchSortingPicker.sortBy('ASC', 'Modified Date');

        const idList = await contentServices.getElementsDisplayedId();
        const numberOfElements = await contentServices.numberOfResultsDisplayed();

        const nodeList = await nodeActions.getNodesDisplayed(this.alfrescoJsApi, idList, numberOfElements);
        const modifiedDateList = [];
        for (let i = 0; i < nodeList.length; i++) {
            modifiedDateList.push(new Date(nodeList[i].entry.modifiedAt));
        }
        await expect(contentServices.checkElementsDateSortedAsc(modifiedDateList)).toBe(true);
    });

});
