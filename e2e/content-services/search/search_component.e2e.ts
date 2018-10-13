/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { LoginPage } from '../../pages/adf/loginPage';
import SearchDialog = require('../../pages/adf/dialog/searchDialog');
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import filePreviewPage = require('../../pages/adf/filePreviewPage');
import SearchResultPage = require('../../pages/adf/searchResultsPage');

import AcsUserModel = require('../../models/ACS/acsUserModel');
import FileModel = require('../../models/ACS/fileModel');
import FolderModel = require('../../models/ACS/folderModel');

import TestConfig = require('../../test.config');
import Util = require('../../util/util');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../../actions/ACS/upload.actions';

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
    let searchResultPage = new SearchResultPage();

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

        filesToDelete.push(await uploadActions.uploadFolder(this.alfrescoJsApi, firstFolderModel.name, '-my-'));
        filesToDelete.push(await uploadActions.uploadFolder(this.alfrescoJsApi, secondFolder.name, '-my-'));
        filesToDelete.push(await uploadActions.uploadFolder(this.alfrescoJsApi, thirdFolder.name, '-my-'));

        await browser.driver.sleep(15000); // wait search index previous file/folder uploaded

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        contentServicesPage.goToDocumentList();

        done();
    });

    afterAll(async (done) => {
        let uploadActions = new UploadActions();

        filesToDelete.forEach(async (currentNode) => {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, currentNode.entry.id);

        });

        done();
    });

    it('[C272798] Search bar should be visible', () => {
        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible();
        searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().checkSearchIconIsVisible();
        searchDialog.clickOnSearchIcon().checkSearchBarIsNotVisible().checkSearchIconIsVisible();
    });

    it('[C272799] Should be possible to hide search bar after input', () => {
        searchDialog.checkSearchIconIsVisible().clickOnSearchIcon().enterText(firstFolderModel.shortName);
        searchDialog.clickOnSearchIcon().checkSearchBarIsNotVisible().checkSearchIconIsVisible();
        contentServicesPage.checkAcsContainer();
    });

    it('[C260255] Should display message when searching for an inexistent file', () => {
        searchDialog.checkSearchBarIsNotVisible().clickOnSearchIcon().checkNoResultMessageIsNotDisplayed()
            .enterText(search.inactive.name).checkNoResultMessageIsDisplayed();
        searchDialog.clearText();
        searchDialog.checkSearchBarIsNotVisible();
    });

    it('[C260256] Should display file/folder in search suggestion when typing first characters', () => {
        contentServicesPage.goToDocumentList();
        searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterText(firstFolderModel.shortName);

        searchDialog.resultTableContainsRow(firstFolderModel.name);

        expect(searchDialog.getSpecificRowsHighlightName(firstFolderModel.name)).toEqual(firstFolderModel.shortName);
        expect(searchDialog.getSpecificRowsAuthor(firstFolderModel.name)).toEqual(acsUser.firstName + ' ' + acsUser.lastName);
        expect(searchDialog.getSpecificRowsCompleteName(firstFolderModel.name)).toEqual(firstFolderModel.name);

        searchDialog.clearText();
        searchDialog.checkSearchBarIsNotVisible();

        searchDialog.clickOnSearchIcon().enterText(firstFileModel.shortName);
        searchDialog.resultTableContainsRow(firstFileModel.name);

        expect(searchDialog.getSpecificRowsHighlightName(firstFileModel.name)).toEqual(firstFileModel.shortName);
        expect(searchDialog.getSpecificRowsAuthor(firstFileModel.name)).toEqual(acsUser.firstName + ' ' + acsUser.lastName);

        expect(searchDialog.getSpecificRowsCompleteName(firstFileModel.name)).toEqual(firstFileModel.name);

        searchDialog.clearText();
        searchDialog.checkSearchBarIsNotVisible();
    });

    it('[C272800] Should display file/folder in search suggestion when typing name', () => {
        contentServicesPage.goToDocumentList();
        searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterText(firstFolderModel.name);
        searchDialog.resultTableContainsRow(firstFolderModel.name);

        expect(searchDialog.getSpecificRowsHighlightName(firstFolderModel.name)).toEqual(firstFolderModel.name);
        expect(searchDialog.getSpecificRowsAuthor(firstFolderModel.name)).toEqual(acsUser.firstName + ' ' + acsUser.lastName);
        expect(searchDialog.getSpecificRowsCompleteName(firstFolderModel.name)).toEqual(firstFolderModel.name);

        searchDialog.clearText();
        searchDialog.checkSearchBarIsNotVisible();

        searchDialog.clickOnSearchIcon().enterText(firstFileModel.name);
        searchDialog.resultTableContainsRow(firstFileModel.name);

        expect(searchDialog.getSpecificRowsHighlightName(firstFileModel.name)).toEqual(firstFileModel.name);
        expect(searchDialog.getSpecificRowsAuthor(firstFileModel.name)).toEqual(acsUser.firstName + ' ' + acsUser.lastName);
        expect(searchDialog.getSpecificRowsCompleteName(firstFileModel.name)).toEqual(firstFileModel.name);

        searchDialog.clearText();
        searchDialog.checkSearchBarIsNotVisible();
    });

    it('[C260257] Should display content when clicking on folder from search suggestions', () => {
        searchDialog.clickOnSearchIcon().enterText(firstFolderModel.shortName);
        searchDialog.resultTableContainsRow(firstFolderModel.name);
        searchDialog.clickOnSpecificRow(firstFolderModel.name);
        contentServicesPage.checkAcsContainer().waitForTableBody();

        expect(contentServicesPage.currentFolderName()).toEqual(firstFolderModel.name);

        contentServicesPage.goToDocumentList();

        searchDialog.checkSearchIconIsVisible().clickOnSearchIcon().checkSearchBarIsVisible();
        searchDialog.enterText(firstFileModel.name).resultTableContainsRow(firstFileModel.name);
        searchDialog.clickOnSpecificRow(firstFileModel.name);
        expect(filePreviewPage.getPDFTitleFromSearch()).toEqual(firstFileModel.name);

        filePreviewPage.closePreviewWithButton();
    });

    it('[C272801] Should display message when searching for non-existent folder', () => {
        searchDialog.checkSearchIconIsVisible().clickOnSearchIcon();
        searchDialog.enterTextAndPressEnter(search.inactive.name);
        searchResultPage.checkNoResultMessageIsDisplayed();
        contentServicesPage.goToDocumentList();
    });

    it('[C272802] Should be able to find an existent folder in search results', () => {
        searchDialog.clickOnSearchIcon();
        browser.driver.sleep(1000);
        searchDialog.enterTextAndPressEnter(firstFolderModel.name);
        searchResultPage.checkContentIsDisplayed(firstFolderModel.name);
    });

    it('[C260258] Should be able to find an existent file in search results', () => {
        contentServicesPage.goToDocumentList();
        searchDialog.clickOnSearchIcon();
        searchDialog.enterTextAndPressEnter(firstFileModel.name);
        searchResultPage.checkContentIsDisplayed(firstFileModel.name);
    });

    it('[C91321] Should be able to use down arrow key when navigating throw suggestions', () => {
        contentServicesPage.goToDocumentList();

        searchDialog
            .clickOnSearchIcon()
            .enterText(secondFolder.shortName)
            .pressDownArrowAndEnter();

        contentServicesPage.checkAcsContainer();
        expect(contentServicesPage.currentFolderName()).toEqual(secondFolder.name);
    });

    it('[C260254] Search bar should get closed when changing browser tab', () => {
        contentServicesPage.goToDocumentList();

        searchDialog
            .clickOnSearchIcon()
            .enterText(secondFolder.shortName);

        searchDialog.resultTableContainsRow(secondFolder.name);

        Util.openNewTabInBrowser();
        Util.switchToWindowHandler(0);

        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible();
    });
});
