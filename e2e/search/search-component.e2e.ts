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

import { browser, protractor } from 'protractor';

import { LoginPage } from '../pages/adf/loginPage';
import { SearchDialog } from '../pages/adf/dialog/searchDialog';
import { ContentServicesPage } from '../pages/adf/contentServicesPage';
import { FilePreviewPage } from '../pages/adf/filePreviewPage';
import { SearchResultsPage } from '../pages/adf/searchResultsPage';

import { AcsUserModel } from '../models/ACS/acsUserModel';
import { FileModel } from '../models/ACS/fileModel';
import { FolderModel } from '../models/ACS/folderModel';

import TestConfig = require('../test.config');
import { Util } from '../util/util';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '../actions/ACS/upload.actions';

describe('Search component - Search Bar', () => {

    let search = {
        inactive: {
            firstChar: 'x',
            secondChar: 'y',
            thirdChar: 'z',
            name: 'impossible-name-folder' + Util.generateRandomString(8)
        }
    };

    let loginPage = new LoginPage();
    let contentServicesPage = new ContentServicesPage();
    let searchDialog = new SearchDialog();
    let searchResultPage = new SearchResultsPage();
    let filePreviewPage = new FilePreviewPage();

    let acsUser = new AcsUserModel();

    let filename = Util.generateRandomString(16);
    let firstFolderName = Util.generateRandomString(16);
    let secondFolderName = Util.generateRandomString(16);
    let thirdFolderName = Util.generateRandomString(16);
    let filesToDelete = [];

    let firstFileModel = new FileModel({
        'name': filename, 'shortName': filename.substring(0, 8)
    });

    let firstFolderModel = new FolderModel({
        'name': firstFolderName, 'shortName': firstFolderName.substring(0, 8)
    });
    let secondFolder = new FolderModel({
        'name': secondFolderName, 'shortName': secondFolderName.substring(0, 8)
    });
    let thirdFolder = new FolderModel({
        'name': thirdFolderName, 'shortName': thirdFolderName.substring(0, 8)
    });

    beforeAll(async (done) => {
        let uploadActions = new UploadActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        let firstFileUploaded = await uploadActions.uploadFile(this.alfrescoJsApi, firstFileModel.location, firstFileModel.name, '-my-');
        Object.assign(firstFileModel, firstFileUploaded.entry);

        filesToDelete.push(await uploadActions.createFolder(this.alfrescoJsApi, firstFolderModel.name, '-my-'));
        filesToDelete.push(await uploadActions.createFolder(this.alfrescoJsApi, secondFolder.name, '-my-'));
        filesToDelete.push(await uploadActions.createFolder(this.alfrescoJsApi, thirdFolder.name, '-my-'));

        await browser.driver.sleep(15000); // wait search index previous file/folder uploaded

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        done();
    });

    afterAll(async (done) => {
        let uploadActions = new UploadActions();

        filesToDelete.forEach(async (currentNode) => {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, currentNode.entry.id);

        });

        done();
    });

    afterEach(async (done) => {
        await browser.get(TestConfig.adf.url);
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

        browser.actions().sendKeys(protractor.Key.ESCAPE).perform();

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

    it('[C260257] Should display content when clicking on folder from search suggestions', () => {
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
        expect(filePreviewPage.getPDFTitleFromSearch()).toEqual(firstFileModel.name);

        filePreviewPage.closePreviewWithButton();
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

    xit('[C260254] Search bar should get closed when changing browser tab', () => {
        searchDialog
            .checkSearchIconIsVisible()
            .clickOnSearchIcon()
            .checkSearchBarIsVisible()
            .enterText(secondFolder.shortName);

        searchDialog.resultTableContainsRow(secondFolder.name);

        Util.openNewTabInBrowser();
        Util.switchToWindowHandler(0);

        browser.sleep(500);
        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible();
    });

    it('[C290137] Should be able to search by \'%\'', () => {
        searchDialog
            .clickOnSearchIcon()
            .enterTextAndPressEnter('%');
        searchResultPage.tableIsLoaded();
    });
});
