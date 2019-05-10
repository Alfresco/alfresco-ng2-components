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

import { LoginPage, LocalStorageUtil, BrowserActions } from '@alfresco/adf-testing';
import { SearchDialog } from '../../pages/adf/dialog/searchDialog';
import { SearchResultsPage } from '../../pages/adf/searchResultsPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { SearchFiltersPage } from '../../pages/adf/searchFiltersPage';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { NodeActions } from '../../actions/ACS/node.actions';

import TestConfig = require('../../test.config');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '../../actions/ACS/upload.actions';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { browser } from 'protractor';
import resources = require('../../util/resources');
import { SearchConfiguration } from '../search.config';
import { SearchSortingPickerPage } from '../../pages/adf/content-services/search/components/search-sortingPicker.page';

describe('Search Sorting Picker', () => {

    const loginPage = new LoginPage();
    const searchDialog = new SearchDialog();
    const searchFilters = new SearchFiltersPage();
    const searchResults = new SearchResultsPage();
    const navigationBar = new NavigationBarPage();
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
    const uploadActions = new UploadActions();
    const search = '_png_file.png';
    let jsonFile;

    beforeAll(async (done) => {

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        pngA = await uploadActions.uploadFile(this.alfrescoJsApi, pngAModel.location, pngAModel.name, '-my-');
        await browser.driver.sleep(3000);
        pngD = await uploadActions.uploadFile(this.alfrescoJsApi, pngDModel.location, pngDModel.name, '-my-');
        await browser.driver.sleep(12000);

        loginPage.loginToContentServices(acsUser.id, acsUser.password);

        done();
    });

    afterAll(async (done) => {
        await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, pngA.entry.id);
        await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, pngD.entry.id);
        done();
    });

    beforeEach(async (done) => {
        searchDialog.checkSearchIconIsVisible()
            .clickOnSearchIcon()
            .enterTextAndPressEnter(search);
        done();
    });

    afterEach(async (done) => {
        await BrowserActions.getUrl(TestConfig.adf.url);
        done();
    });

    it(`[C277269] Should see the "sort by" option when search results are displayed in search results page`, () => {
        searchSortingPicker.checkSortingSelectorIsDisplayed();
    });

    it(`[C277270] Should see the icon for ASC and DESC sort when search results are displayed in the search results page`, () => {
        searchSortingPicker.checkOrderArrowIsDisplayed();
    });

    it('[C277271] Should be able to add a custom search sorter in the "sort by" option', async () => {
        navigationBar.clickContentServicesButton();
        jsonFile = SearchConfiguration.getConfiguration();
        jsonFile.sorting.options.push({
            'key': 'Modifier',
            'label': 'Modifier',
            'type': 'FIELD',
            'field': 'cm:modifier',
            'ascending': true
        });
        await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

        searchDialog.checkSearchIconIsVisible()
            .clickOnSearchIcon()
            .enterTextAndPressEnter(search);

        searchSortingPicker.checkSortingSelectorIsDisplayed()
            .clickSortingSelector()
            .checkOptionsDropdownIsDisplayed()
            .checkOptionIsDisplayed('Modifier');
    });

    it('[C277272] Should be able to exclude a standard search sorter from the sorting option', async () => {
        navigationBar.clickContentServicesButton();
        jsonFile = SearchConfiguration.getConfiguration();
        const removedOption = jsonFile.sorting.options.splice(0, 1);
        await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

        searchDialog.checkSearchIconIsVisible()
            .clickOnSearchIcon()
            .enterTextAndPressEnter(search);

        searchSortingPicker.checkSortingSelectorIsDisplayed()
            .clickSortingSelector()
            .checkOptionsDropdownIsDisplayed()
            .checkOptionIsNotDisplayed(removedOption[0].label);
    });

    it('[C277273] Should be able to set a default order for a search sorting option', async () => {
        navigationBar.clickContentServicesButton();

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

        searchDialog.checkSearchIconIsVisible()
            .clickOnSearchIcon()
            .enterTextAndPressEnter(search);

        searchSortingPicker.checkSortingSelectorIsDisplayed()
            .clickSortingSelector()
            .checkOptionIsDisplayed('Name')
            .clickSortingOption('Name');
        expect(searchSortingPicker.checkOrderArrowIsDownward()).toBe(true);
    });

    it('[C277280] Should be able to sort the search results by "Name" ASC', () => {
        searchFilters.checkSearchFiltersIsDisplayed();
        searchFilters.creatorCheckListFiltersPage().filterBy(`${acsUser.firstName} ${acsUser.lastName}`);
        searchResults.sortByName(true);
        expect(searchResults.checkListIsOrderedByNameAsc()).toBe(true);
    });

    it('[C277281] Should be able to sort the search results by "Name" DESC', () => {
        searchFilters.checkSearchFiltersIsDisplayed();
        searchFilters.creatorCheckListFiltersPage().filterBy(`${acsUser.firstName} ${acsUser.lastName}`);
        searchResults.sortByName(false);
        expect(searchResults.checkListIsOrderedByNameDesc()).toBe(true);
    });

    it('[C277282] Should be able to sort the search results by "Author" ASC', () => {
        searchResults.sortByAuthor(true);
        expect(searchResults.checkListIsOrderedByAuthorAsc()).toBe(true);
    });

    it('[C277283] Should be able to sort the search results by "Author" DESC', () => {
        searchResults.sortByAuthor(false);
        expect(searchResults.checkListIsOrderedByAuthorDesc()).toBe(true);
    });

    it('[C277286] Should be able to sort the search results by "Created Date" ASC', () => {
        searchResults.sortByCreated(true);
        browser.controlFlow().execute(async () => {
            const results = await searchResults.dataTable.geCellElementDetail('Created');
            expect(contentServices.checkElementsDateSortedAsc(results)).toBe(true);
        });
    });

    it('[C277287] Should be able to sort the search results by "Created Date" DESC', () => {
        searchResults.sortByCreated(false);
        browser.controlFlow().execute(async () => {
            const results = await searchResults.dataTable.geCellElementDetail('Created');
            expect(contentServices.checkElementsDateSortedDesc(results)).toBe(true);
        });
    });

    it('[C277288] Should be able to sort the search results by "Modified Date" ASC', async () => {
        navigationBar.clickContentServicesButton();

        jsonFile = SearchConfiguration.getConfiguration();
        jsonFile.sorting.options.push({
            'key': 'Modified Date',
            'label': 'Modified Date',
            'type': 'FIELD',
            'field': 'cm:modified',
            'ascending': true
        });
        await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

        searchDialog.checkSearchIconIsVisible()
            .clickOnSearchIcon()
            .enterTextAndPressEnter(search);

        searchSortingPicker.checkSortingSelectorIsDisplayed()
            .sortBy(true, 'Modified Date');

        browser.controlFlow().execute(async () => {
            const idList = await contentServices.getElementsDisplayedId();
            const numberOfElements = await contentServices.numberOfResultsDisplayed();

            const nodeList = await nodeActions.getNodesDisplayed(this.alfrescoJsApi, idList, numberOfElements);
            const modifiedDateList = [];
            for (let i = 0; i < nodeList.length; i++) {
                modifiedDateList.push(new Date(nodeList[i].entry.modifiedAt));
            }
            expect(contentServices.checkElementsDateSortedAsc(modifiedDateList)).toBe(true);
        });
    });

    it('[C277301] Should be able to change default sorting option for the search results', async () => {
        navigationBar.clickContentServicesButton();

        jsonFile = SearchConfiguration.getConfiguration();
        jsonFile.sorting.options.push({
            'key': 'createdByUser',
            'label': 'Author',
            'type': 'FIELD',
            'field': 'cm:creator',
            'ascending': true
        });

        await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

        searchDialog.checkSearchIconIsVisible()
            .clickOnSearchIcon()
            .enterTextAndPressEnter(search);

        searchSortingPicker.checkSortingSelectorIsDisplayed();
        expect(searchResults.checkListIsOrderedByAuthorAsc()).toBe(true);
    });
});
