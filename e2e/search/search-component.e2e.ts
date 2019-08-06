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

import { browser } from 'protractor';

import { LoginPage, UploadActions, StringUtil, LocalStorageUtil, BrowserActions } from '@alfresco/adf-testing';
import { SearchDialog } from '../pages/adf/dialog/searchDialog';
import { ContentServicesPage } from '../pages/adf/contentServicesPage';
import { ViewerPage } from '../pages/adf/viewerPage';
import { SearchResultsPage } from '../pages/adf/searchResultsPage';
import { AcsUserModel } from '../models/ACS/acsUserModel';
import { FileModel } from '../models/ACS/fileModel';
import { FolderModel } from '../models/ACS/folderModel';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { SearchConfiguration } from './search.config';

describe('Search component - Search Bar', () => {

    const search = {
        inactive: {
            firstChar: 'x',
            secondChar: 'y',
            thirdChar: 'z',
            name: 'impossible-name-folder' + StringUtil.generateRandomString(8)
        }
    };

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();

    const searchDialog = new SearchDialog();
    const searchResultPage = new SearchResultsPage();
    const viewerPage = new ViewerPage();

    const acsUser = new AcsUserModel();
    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);

    const filename = StringUtil.generateRandomString(16);
    const firstFolderName = StringUtil.generateRandomString(16);
    const secondFolderName = StringUtil.generateRandomString(16);
    const thirdFolderName = StringUtil.generateRandomString(16);
    const filesToDelete = [];

    const firstFileModel = new FileModel({
        'name': filename, 'shortName': filename.substring(0, 8)
    });

    const firstFolderModel = new FolderModel({
        'name': firstFolderName, 'shortName': firstFolderName.substring(0, 8)
    });
    const secondFolder = new FolderModel({
        'name': secondFolderName, 'shortName': secondFolderName.substring(0, 8)
    });
    const thirdFolder = new FolderModel({
        'name': thirdFolderName, 'shortName': thirdFolderName.substring(0, 8)
    });

    const term = 'Zoizo';

    let fileHighlightUploaded;

    beforeAll(async (done) => {

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        const firstFileUploaded = await uploadActions.uploadFile(firstFileModel.location, firstFileModel.name, '-my-');
        Object.assign(firstFileModel, firstFileUploaded.entry);

        fileHighlightUploaded = await this.alfrescoJsApi.nodes.addNode('-my-', {
            'name': StringUtil.generateRandomString(16),
            'nodeType': 'cm:content',
            'properties': {
                'cm:title': term,
                'cm:description': 'Jadore les ' + term
            }
        });

        filesToDelete.push(fileHighlightUploaded);
        filesToDelete.push(firstFileUploaded);
        filesToDelete.push(await uploadActions.createFolder(firstFolderModel.name, '-my-'));
        filesToDelete.push(await uploadActions.createFolder(secondFolder.name, '-my-'));
        filesToDelete.push(await uploadActions.createFolder(thirdFolder.name, '-my-'));

        await browser.driver.sleep(15000); // wait search index previous file/folder uploaded

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        done();
    });

    afterAll(async (done) => {

        filesToDelete.forEach(async (currentNode) => {
            await uploadActions.deleteFileOrFolder(currentNode.entry.id);

        });

        done();
    });

    afterEach(async (done) => {
        await BrowserActions.getUrl(browser.params.testConfig.adf.url);
        done();
    });

    it('[C272798] Search bar should be visible', () => {
        searchDialog
            .checkSearchBarIsNotVisible()
            .checkSearchIconIsVisible();

        searchDialog
            .clickOnSearchIcon()
            .checkSearchBarIsVisible()
            .checkSearchIconIsVisible();

        BrowserActions.closeMenuAndDialogs();

        searchDialog
            .checkSearchBarIsNotVisible()
            .checkSearchIconIsVisible();
    });

    it('[C272799] Should be possible to hide search bar after input', () => {
        searchDialog
            .checkSearchIconIsVisible()
            .clickOnSearchIcon()
            .enterText(firstFolderModel.shortName);
    });

    it('[C260255] Should display message when searching for an inexistent file', () => {
        searchDialog
            .checkSearchBarIsNotVisible()
            .clickOnSearchIcon()
            .checkNoResultMessageIsNotDisplayed()
            .enterText(search.inactive.name)
            .checkNoResultMessageIsDisplayed();
    });

    it('[C260256] Should display file/folder in search suggestion when typing first characters', () => {
        searchDialog
            .clickOnSearchIcon()
            .checkSearchBarIsVisible()
            .enterText(firstFolderModel.shortName);

        searchDialog.resultTableContainsRow(firstFolderModel.name);

        expect(searchDialog.getSpecificRowsHighlightName(firstFolderModel.name)).toEqual(firstFolderModel.shortName);
        expect(searchDialog.getSpecificRowsAuthor(firstFolderModel.name)).toEqual(acsUser.firstName + ' ' + acsUser.lastName);
        expect(searchDialog.getSpecificRowsCompleteName(firstFolderModel.name)).toEqual(firstFolderModel.name);

        searchDialog.clearText();

        searchDialog.clickOnSearchIcon().enterText(firstFileModel.shortName);
        searchDialog.resultTableContainsRow(firstFileModel.name);

        expect(searchDialog.getSpecificRowsHighlightName(firstFileModel.name)).toEqual(firstFileModel.shortName);
        expect(searchDialog.getSpecificRowsAuthor(firstFileModel.name)).toEqual(acsUser.firstName + ' ' + acsUser.lastName);

        expect(searchDialog.getSpecificRowsCompleteName(firstFileModel.name)).toEqual(firstFileModel.name);
    });

    it('[C272800] Should display file/folder in search suggestion when typing name', () => {
        searchDialog
            .clickOnSearchIcon()
            .checkSearchBarIsVisible()
            .enterText(firstFolderModel.name);

        searchDialog.resultTableContainsRow(firstFolderModel.name);

        expect(searchDialog.getSpecificRowsHighlightName(firstFolderModel.name)).toEqual(firstFolderModel.name);
        expect(searchDialog.getSpecificRowsAuthor(firstFolderModel.name)).toEqual(acsUser.firstName + ' ' + acsUser.lastName);
        expect(searchDialog.getSpecificRowsCompleteName(firstFolderModel.name)).toEqual(firstFolderModel.name);

        searchDialog.clearText();

        searchDialog.clickOnSearchIcon().enterText(firstFileModel.name);
        searchDialog.resultTableContainsRow(firstFileModel.name);

        expect(searchDialog.getSpecificRowsHighlightName(firstFileModel.name)).toEqual(firstFileModel.name);
        expect(searchDialog.getSpecificRowsAuthor(firstFileModel.name)).toEqual(acsUser.firstName + ' ' + acsUser.lastName);
        expect(searchDialog.getSpecificRowsCompleteName(firstFileModel.name)).toEqual(firstFileModel.name);
    });

    it('[C260257] Should display content when clicking on folder from search suggestions', async () => {
        searchDialog
            .clickOnSearchIcon()
            .checkSearchBarIsVisible()
            .enterText(firstFolderModel.shortName);

        searchDialog.resultTableContainsRow(firstFolderModel.name);
        searchDialog.clickOnSpecificRow(firstFolderModel.name);

        expect(contentServicesPage.currentFolderName()).toEqual(firstFolderModel.name);

        searchDialog
            .checkSearchIconIsVisible()
            .clickOnSearchIcon()
            .checkSearchBarIsVisible()
            .enterText(firstFileModel.name)
            .resultTableContainsRow(firstFileModel.name);

        searchDialog.clickOnSpecificRow(firstFileModel.name);
        expect(await viewerPage.getDisplayedFileName()).toEqual(firstFileModel.name);

        viewerPage.clickCloseButton();
    });

    it('[C272801] Should display message when searching for non-existent folder', () => {
        searchDialog
            .checkSearchIconIsVisible()
            .clickOnSearchIcon()
            .checkSearchBarIsVisible()
            .enterTextAndPressEnter(search.inactive.name);

        searchResultPage.checkNoResultMessageIsDisplayed();
    });

    it('[C272802] Should be able to find an existent folder in search results', () => {
        searchDialog
            .checkSearchIconIsVisible()
            .clickOnSearchIcon()
            .checkSearchBarIsVisible()
            .enterTextAndPressEnter(firstFolderModel.name);

        searchResultPage.checkContentIsDisplayed(firstFolderModel.name);
    });

    it('[C260258] Should be able to find an existent file in search results', () => {
        searchDialog
            .checkSearchIconIsVisible()
            .clickOnSearchIcon()
            .checkSearchBarIsVisible()
            .enterTextAndPressEnter(firstFileModel.name);

        searchResultPage.checkContentIsDisplayed(firstFileModel.name);
    });

    it('[C91321] Should be able to use down arrow key when navigating throw suggestions', () => {
        searchDialog
            .checkSearchIconIsVisible()
            .clickOnSearchIcon()
            .checkSearchBarIsVisible()
            .enterText(secondFolder.shortName)
            .pressDownArrowAndEnter();

        searchResultPage.tableIsLoaded();
        expect(contentServicesPage.currentFolderName()).toEqual(secondFolder.name);
    });

    it('[C290137] Should be able to search by \'%\'', () => {
        searchDialog
            .clickOnSearchIcon()
            .enterTextAndPressEnter('%');
        searchResultPage.tableIsLoaded();
    });

    describe('Highlight', () => {

        const navigationBarPage = new NavigationBarPage();

        const searchConfiguration = SearchConfiguration.getConfiguration();

        beforeAll(async () => {
            navigationBarPage.clickContentServicesButton();

            await LocalStorageUtil.setConfigField('search', JSON.stringify(searchConfiguration));

            searchDialog
                .checkSearchIconIsVisible()
                .clickOnSearchIcon()
                .checkSearchBarIsVisible()
                .enterTextAndPressEnter(term);
        });

        it('[C299212] Should be able to configure the highlight option for search results', () => {
            searchResultPage.getNodeHighlight(fileHighlightUploaded.entry.name).getText().then((text) => {
                expect(text.includes(`¿${term}?`)).toBe(true);
                expect(text.includes(`(${term})`)).toBe(true);
            });
        });
    });
});
