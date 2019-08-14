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
    const navigationBarPage = new NavigationBarPage();

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

    beforeAll(async () => {

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

        await browser.sleep(15000); // wait search index previous file/folder uploaded

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

    });

    afterAll(async () => {
        for (const currentNode of filesToDelete) {
            await uploadActions.deleteFileOrFolder(currentNode.entry.id);

        }
        await navigationBarPage.clickLogoutButton();
    });

    afterEach(async () => {
        await BrowserActions.getUrl(browser.params.testConfig.adf.url);

    });

    it('[C272798] Search bar should be visible', async () => {
        await searchDialog.checkSearchBarIsNotVisible();
        await searchDialog.checkSearchIconIsVisible();

        await searchDialog.clickOnSearchIcon();
        await searchDialog.checkSearchBarIsVisible();
        await searchDialog.checkSearchIconIsVisible();

        await BrowserActions.closeMenuAndDialogs();

        await searchDialog.checkSearchBarIsNotVisible();
        await searchDialog.checkSearchIconIsVisible();
    });

    it('[C272799] Should be possible to hide search bar after input', async () => {
        await searchDialog.checkSearchIconIsVisible();
        await searchDialog.clickOnSearchIcon();
        await searchDialog.enterText(firstFolderModel.shortName);
    });

    it('[C260255] Should display message when searching for an inexistent file', async () => {
        await searchDialog.checkSearchBarIsNotVisible();
        await searchDialog.clickOnSearchIcon();
        await searchDialog.checkNoResultMessageIsNotDisplayed();
        await searchDialog.enterText(search.inactive.name);
        await searchDialog.checkNoResultMessageIsDisplayed();
    });

    it('[C260256] Should display file/folder in search suggestion when typing first characters', async () => {
        await searchDialog.clickOnSearchIcon();
        await searchDialog.checkSearchBarIsVisible();
        await searchDialog.enterText(firstFolderModel.shortName);

        await searchDialog.resultTableContainsRow(firstFolderModel.name);

        await expect(await searchDialog.getSpecificRowsHighlightName(firstFolderModel.name)).toEqual(firstFolderModel.shortName);
        await expect(await searchDialog.getSpecificRowsAuthor(firstFolderModel.name)).toEqual(acsUser.firstName + ' ' + acsUser.lastName);
        await expect(await searchDialog.getSpecificRowsCompleteName(firstFolderModel.name)).toEqual(firstFolderModel.name);

        await searchDialog.clearText();

        await searchDialog.clickOnSearchIcon();
        await searchDialog.enterText(firstFileModel.shortName);
        await searchDialog.resultTableContainsRow(firstFileModel.name);

        await expect(await searchDialog.getSpecificRowsHighlightName(firstFileModel.name)).toEqual(firstFileModel.shortName);
        await expect(await searchDialog.getSpecificRowsAuthor(firstFileModel.name)).toEqual(acsUser.firstName + ' ' + acsUser.lastName);

        await expect(await searchDialog.getSpecificRowsCompleteName(firstFileModel.name)).toEqual(firstFileModel.name);
    });

    it('[C272800] Should display file/folder in search suggestion when typing name', async () => {
        await searchDialog.clickOnSearchIcon();
        await searchDialog.checkSearchBarIsVisible();
        await searchDialog.enterText(firstFolderModel.name);

        await searchDialog.resultTableContainsRow(firstFolderModel.name);

        await expect(await searchDialog.getSpecificRowsHighlightName(firstFolderModel.name)).toEqual(firstFolderModel.name);
        await expect(await searchDialog.getSpecificRowsAuthor(firstFolderModel.name)).toEqual(acsUser.firstName + ' ' + acsUser.lastName);
        await expect(await searchDialog.getSpecificRowsCompleteName(firstFolderModel.name)).toEqual(firstFolderModel.name);

        await searchDialog.clearText();

        await searchDialog.clickOnSearchIcon();
        await searchDialog.enterText(firstFileModel.name);
        await searchDialog.resultTableContainsRow(firstFileModel.name);

        await expect(await searchDialog.getSpecificRowsHighlightName(firstFileModel.name)).toEqual(firstFileModel.name);
        await expect(await searchDialog.getSpecificRowsAuthor(firstFileModel.name)).toEqual(acsUser.firstName + ' ' + acsUser.lastName);
        await expect(await searchDialog.getSpecificRowsCompleteName(firstFileModel.name)).toEqual(firstFileModel.name);
    });

    it('[C260257] Should display content when clicking on folder from search suggestions', async () => {
        await searchDialog.clickOnSearchIcon();
        await searchDialog.checkSearchBarIsVisible();
        await searchDialog.enterText(firstFolderModel.shortName);

        await searchDialog.resultTableContainsRow(firstFolderModel.name);
        await searchDialog.clickOnSpecificRow(firstFolderModel.name);

        await expect(await contentServicesPage.currentFolderName()).toEqual(firstFolderModel.name);

        await searchDialog.checkSearchIconIsVisible();
        await searchDialog.clickOnSearchIcon();
        await searchDialog.checkSearchBarIsVisible();
        await searchDialog.enterText(firstFileModel.name);
        await searchDialog.resultTableContainsRow(firstFileModel.name);

        await searchDialog.clickOnSpecificRow(firstFileModel.name);
        await expect(await viewerPage.getDisplayedFileName()).toEqual(firstFileModel.name);

        await viewerPage.clickCloseButton();
    });

    it('[C272801] Should display message when searching for non-existent folder', async () => {
        await searchDialog.checkSearchIconIsVisible();
        await searchDialog.clickOnSearchIcon();
        await searchDialog.checkSearchBarIsVisible();
        await searchDialog.enterTextAndPressEnter(search.inactive.name);

        await searchResultPage.checkNoResultMessageIsDisplayed();
    });

    it('[C272802] Should be able to find an existent folder in search results', async () => {
        await searchDialog.checkSearchIconIsVisible();
        await searchDialog.clickOnSearchIcon();
        await searchDialog.checkSearchBarIsVisible();
        await searchDialog.enterTextAndPressEnter(firstFolderModel.name);

        await searchResultPage.checkContentIsDisplayed(firstFolderModel.name);
    });

    it('[C260258] Should be able to find an existent file in search results', async () => {
        await searchDialog.checkSearchIconIsVisible();
        await searchDialog.clickOnSearchIcon();
        await searchDialog.checkSearchBarIsVisible();
        await searchDialog.enterTextAndPressEnter(firstFileModel.name);

        await searchResultPage.checkContentIsDisplayed(firstFileModel.name);
    });

    it('[C91321] Should be able to use down arrow key when navigating throw suggestions', async () => {
        await searchDialog.checkSearchIconIsVisible();
        await searchDialog.clickOnSearchIcon();
        await searchDialog.checkSearchBarIsVisible();
        await searchDialog.enterText(secondFolder.shortName);
        await searchDialog.pressDownArrowAndEnter();

        await expect(await contentServicesPage.currentFolderName()).toEqual(secondFolder.name);
    });

    it('[C290137] Should be able to search by \'%\'', async () => {
        await searchDialog.clickOnSearchIcon();
        await searchDialog.enterTextAndPressEnter('%');
        await searchResultPage.tableIsLoaded();
    });

    describe('Highlight', () => {

        const searchConfiguration = SearchConfiguration.getConfiguration();

        beforeAll(async () => {
            await navigationBarPage.clickContentServicesButton();

            await LocalStorageUtil.setConfigField('search', JSON.stringify(searchConfiguration));

            await searchDialog.checkSearchIconIsVisible();
            await searchDialog.clickOnSearchIcon();
            await searchDialog.checkSearchBarIsVisible();
            await searchDialog.enterTextAndPressEnter(term);
        });

        it('[C299212] Should be able to configure the highlight option for search results', async () => {
            const text = await searchResultPage.getNodeHighlight(fileHighlightUploaded.entry.name).getText();
            await expect(text.includes(`¿${term}?`)).toBe(true);
            await expect(text.includes(`(${term})`)).toBe(true);
        });
    });
});
