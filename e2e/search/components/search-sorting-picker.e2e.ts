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

import { LoginPage } from '../../pages/adf/loginPage';
import { SearchDialog } from '../../pages/adf/dialog/searchDialog';
import { SearchResultsPage } from '../../pages/adf/searchResultsPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { ConfigEditorPage } from '../../pages/adf/configEditorPage';
import { SearchFiltersPage } from '../../pages/adf/searchFiltersPage';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { NodeActions } from '../../actions/ACS/node.actions';

import TestConfig = require('../../test.config');

import AlfrescoApi = require('alfresco-js-api-node');
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
    const configEditor = new ConfigEditorPage();
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
        await browser.get(TestConfig.adf.url);
        done();
    });

    it(`[C277269] Should see the "sort by" option when search results are displayed in search results page`, () => {
        searchSortingPicker.checkSortingSelectorIsDisplayed();
    });

    it(`[C277270] Should see the icon for ASC and DESC sort when search results are displayed in the search results page`, () => {
        searchSortingPicker.checkOrderArrowIsDisplayed();
    });

    it('[C277271] Should be able to add a custom search sorter in the "sort by" option', () => {
        let searchConfiguration = new SearchConfiguration();
        jsonFile = searchConfiguration.getConfiguration();
        navigationBar.clickConfigEditorButton();
        configEditor.clickSearchConfiguration();
        configEditor.clickClearButton();
        jsonFile.sorting.options.push({ 'key': 'Modifier', 'label': 'Modifier', 'type': 'FIELD', 'field': 'cm:modifier', 'ascending': true });
        configEditor.enterBigConfigurationText(JSON.stringify(jsonFile));
        configEditor.clickSaveButton();

        searchDialog.checkSearchIconIsVisible()
            .clickOnSearchIcon()
            .enterTextAndPressEnter(search);

        searchSortingPicker.checkSortingSelectorIsDisplayed()
            .clickSortingSelector()
            .checkOptionsDropdownIsDisplayed()
            .checkOptionIsDisplayed('Modifier');
    });

    it('[C277272] Should be able to exclude a standard search sorter from the sorting option', () => {
        let searchConfiguration = new SearchConfiguration();
        jsonFile = searchConfiguration.getConfiguration();
        navigationBar.clickConfigEditorButton();
        configEditor.clickSearchConfiguration();
        configEditor.clickClearButton();
        let removedOption = jsonFile.sorting.options.splice(0, 1);
        configEditor.enterBigConfigurationText(JSON.stringify(jsonFile));
        configEditor.clickSaveButton();

        searchDialog.checkSearchIconIsVisible()
            .clickOnSearchIcon()
            .enterTextAndPressEnter(search);

        searchSortingPicker.checkSortingSelectorIsDisplayed()
            .clickSortingSelector()
            .checkOptionsDropdownIsDisplayed()
            .checkOptionIsNotDisplayed(removedOption[0].label);
    });

    it('[C277273] Should be able to set a default order for a search sorting option', () => {
        let searchConfiguration = new SearchConfiguration();
        jsonFile = searchConfiguration.getConfiguration();
        navigationBar.clickConfigEditorButton();
        configEditor.clickSearchConfiguration();
        configEditor.clickClearButton();
        jsonFile.sorting.options[0].ascending = false;
        configEditor.enterBigConfigurationText(JSON.stringify(jsonFile));
        configEditor.clickSaveButton();

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
        expect(searchResults.sortAndCheckListIsOrderedByName(true)).toBe(true);
    });

    it('[C277281] Should be able to sort the search results by "Name" DESC', () => {
        searchFilters.checkSearchFiltersIsDisplayed();
        searchFilters.creatorCheckListFiltersPage().filterBy(`${acsUser.firstName} ${acsUser.lastName}`);
        expect(searchResults.sortAndCheckListIsOrderedByName(false)).toBe(true);
    });

    it('[C277282] Should be able to sort the search results by "Author" ASC', () => {
        expect(searchResults.sortAndCheckListIsOrderedByAuthor(this.alfrescoJsApi, true)).toBe(true);
    });

    it('[C277283] Should be able to sort the search results by "Author" DESC', () => {
        expect(searchResults.sortAndCheckListIsOrderedByAuthor(this.alfrescoJsApi, false)).toBe(true);
    });

    it('[C277284] Should be able to sort the search results by "Modifier" ASC', () => {
        let searchConfiguration = new SearchConfiguration();
        jsonFile = searchConfiguration.getConfiguration();
        navigationBar.clickConfigEditorButton();
        configEditor.clickSearchConfiguration();
        configEditor.clickClearButton();
        jsonFile.sorting.options.push({ 'key': 'Modifier', 'label': 'Modifier', 'type': 'FIELD', 'field': 'cm:modifier', 'ascending': true });
        configEditor.enterBigConfigurationText(JSON.stringify(jsonFile));
        configEditor.clickSaveButton();

        searchDialog.checkSearchIconIsVisible()
            .clickOnSearchIcon()
            .enterTextAndPressEnter(search);

        searchSortingPicker.checkSortingSelectorIsDisplayed()
            .sortBy(true, 'Modifier');

        browser.controlFlow().execute(async () => {
            let idList = await contentServices.getElementsDisplayedId();
            let numberOfElements = await contentServices.numberOfResultsDisplayed();

            let nodeList = await nodeActions.getNodesDisplayed(this.alfrescoJsApi, idList, numberOfElements);
            let modifierList = [];
            for (let i = 0; i < nodeList.length; i++) {
                modifierList.push(nodeList[i].entry.modifiedByUser.id);
            }
            expect(contentServices.checkElementsSortedAsc(modifierList)).toBe(true);
        });
    });

    it('[C277285] Should be able to sort the search results by "Modifier" DESC', () => {
        let searchConfiguration = new SearchConfiguration();
        jsonFile = searchConfiguration.getConfiguration();
        navigationBar.clickConfigEditorButton();
        configEditor.clickSearchConfiguration();
        configEditor.clickClearButton();
        jsonFile.sorting.options.push({ 'key': 'Modifier', 'label': 'Modifier', 'type': 'FIELD', 'field': 'cm:modifier', 'ascending': true });
        configEditor.enterBigConfigurationText(JSON.stringify(jsonFile));
        configEditor.clickSaveButton();

        searchDialog.checkSearchIconIsVisible()
            .clickOnSearchIcon()
            .enterTextAndPressEnter(search);

        searchSortingPicker.checkSortingSelectorIsDisplayed()
            .sortBy(false, 'Modifier');

        browser.controlFlow().execute(async () => {
            let idList = await contentServices.getElementsDisplayedId();
            let numberOfElements = await contentServices.numberOfResultsDisplayed();

            let nodeList = await nodeActions.getNodesDisplayed(this.alfrescoJsApi, idList, numberOfElements);
            let modifierList = [];
            for (let i = 0; i < nodeList.length; i++) {
                modifierList.push(nodeList[i].entry.modifiedByUser.id);
            }
            expect(contentServices.checkElementsSortedDesc(modifierList)).toBe(true);
        });
    });

    it('[C277286] Should be able to sort the search results by "Created Date" ASC', () => {
        searchResults.sortByCreated(true);
        browser.controlFlow().execute(async () => {
            let idList = await contentServices.getElementsDisplayedId();
            let numberOfElements = await contentServices.numberOfResultsDisplayed();

            let nodeList = await nodeActions.getNodesDisplayed(this.alfrescoJsApi, idList, numberOfElements);
            let dateList = [];
            for (let i = 0; i < nodeList.length; i++) {
                dateList.push(new Date(nodeList[i].entry.createdAt));
            }
            expect(contentServices.checkElementsSortedAsc(dateList)).toBe(true);
        });
    });

    it('[C277287] Should be able to sort the search results by "Created Date" DESC', () => {
        searchResults.sortByCreated(false);
        browser.controlFlow().execute(async () => {
            let idList = await contentServices.getElementsDisplayedId();
            let numberOfElements = await contentServices.numberOfResultsDisplayed();

            let nodeList = await nodeActions.getNodesDisplayed(this.alfrescoJsApi, idList, numberOfElements);
            let dateList = [];
            for (let i = 0; i < nodeList.length; i++) {
                dateList.push(new Date(nodeList[i].entry.createdAt));
            }
            expect(contentServices.checkElementsSortedDesc(dateList)).toBe(true);
        });
    });

    it('[C277288] Should be able to sort the search results by "Modified Date" ASC', () => {
        let searchConfiguration = new SearchConfiguration();
        jsonFile = searchConfiguration.getConfiguration();
        navigationBar.clickConfigEditorButton();
        configEditor.clickSearchConfiguration();
        configEditor.clickClearButton();
        jsonFile.sorting.options.push({ 'key': 'Modified Date', 'label': 'Modified Date', 'type': 'FIELD', 'field': 'cm:modified', 'ascending': true });
        configEditor.enterBigConfigurationText(JSON.stringify(jsonFile));
        configEditor.clickSaveButton();

        searchDialog.checkSearchIconIsVisible()
            .clickOnSearchIcon()
            .enterTextAndPressEnter(search);

        searchSortingPicker.checkSortingSelectorIsDisplayed()
            .sortBy(true, 'Modified Date');

        browser.controlFlow().execute(async () => {
            let idList = await contentServices.getElementsDisplayedId();
            let numberOfElements = await contentServices.numberOfResultsDisplayed();

            let nodeList = await nodeActions.getNodesDisplayed(this.alfrescoJsApi, idList, numberOfElements);
            let modifiedDateList = [];
            for (let i = 0; i < nodeList.length; i++) {
                modifiedDateList.push(new Date(nodeList[i].entry.modifiedAt));
            }
            expect(contentServices.checkElementsSortedAsc(modifiedDateList)).toBe(true);
        });
    });

    it('[C277289] Should be able to sort the search results by "Modified Date" DESC', () => {
        let searchConfiguration = new SearchConfiguration();
        jsonFile = searchConfiguration.getConfiguration();
        navigationBar.clickConfigEditorButton();
        configEditor.clickSearchConfiguration();
        configEditor.clickClearButton();
        jsonFile.sorting.options.push({ 'key': 'Modified Date', 'label': 'Modified Date', 'type': 'FIELD', 'field': 'cm:modified', 'ascending': true });
        configEditor.enterBigConfigurationText(JSON.stringify(jsonFile));
        configEditor.clickSaveButton();

        searchDialog.checkSearchIconIsVisible()
            .clickOnSearchIcon()
            .enterTextAndPressEnter(search);

        searchSortingPicker.checkSortingSelectorIsDisplayed()
            .sortBy(false, 'Modified Date');

        browser.controlFlow().execute(async () => {
            let idList = await contentServices.getElementsDisplayedId();
            let numberOfElements = await contentServices.numberOfResultsDisplayed();

            let nodeList = await nodeActions.getNodesDisplayed(this.alfrescoJsApi, idList, numberOfElements);
            let modifiedDateList = [];
            for (let i = 0; i < nodeList.length; i++) {
                modifiedDateList.push(new Date(nodeList[i].entry.modifiedAt));
            }
            expect(contentServices.checkElementsSortedAsc(modifiedDateList)).toBe(false);
        });
    });

    it('[C277290] Should be able to sort the search results by "Size" ASC', () => {
        searchResults.sortBySize(true);
        expect(searchResults.checkListIsOrderedBySizeAsc()).toBe(true);
    });

    it('[C277291] Should be able to sort the search results by "Size" DESC', () => {
        searchResults.sortBySize(false);
        expect(searchResults.checkListIsOrderedBySizeDesc()).toBe(true);
    });

    it('[C277301] Should be able to change default sorting option for the search results', () => {
        let searchConfiguration = new SearchConfiguration();
        jsonFile = searchConfiguration.getConfiguration();
        navigationBar.clickConfigEditorButton();
        configEditor.clickSearchConfiguration();
        configEditor.clickClearButton();
        jsonFile.sorting.defaults[0] = { 'key': 'Size', 'label': 'Size', 'type': 'FIELD', 'field': 'content.size', 'ascending': true };
        configEditor.enterBigConfigurationText(JSON.stringify(jsonFile));
        configEditor.clickSaveButton();

        searchDialog.checkSearchIconIsVisible()
            .clickOnSearchIcon()
            .enterTextAndPressEnter(search);

        searchSortingPicker.checkSortingSelectorIsDisplayed();
        expect(searchResults.checkListIsOrderedBySizeAsc()).toBe(true);
    });
});
