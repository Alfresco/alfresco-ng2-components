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

import LoginPage = require('./pages/adf/loginPage');
import SearchDialog = require('./pages/adf/dialog/searchDialog');
import ContentServicesPage = require('./pages/adf/contentServicesPage');
import filePreviewPage = require('./pages/adf/filePreviewPage');
import SearchResultPage = require('./pages/adf/searchResultsPage');

import AcsUserModel = require('./models/ACS/acsUserModel');
import FileModel = require('./models/ACS/fileModel');
import FolderModel = require('./models/ACS/folderModel');

import TestConfig = require('./test.config');
import resources = require('./util/resources');
import Util = require('./util/util');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from './actions/ACS/upload.actions';

describe('Test Search component - Search Bar', () => {

    let search = {
        inactive: {
            firstChar: 'x',
            secondChar: 'y',
            thirdChar: 'z',
            name: Util.generateRandomString()
        },
        active: {
            base: 'newFile',
            extension: '.txt'
        }
    };

    let loginPage = new LoginPage();
    let contentServicesPage = new ContentServicesPage();
    let searchDialog = new SearchDialog();
    let searchResultPage = new SearchResultPage();

    let acsUser = new AcsUserModel();
    let firstFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
        'shortName': resources.Files.ADF_DOCUMENTS.PDF.short_file_name
    });

    let randomPrefix = Util.generateRandomString();

    let firstFolderModel = new FolderModel({ 'name': randomPrefix + 'folderOne', 'shortName': randomPrefix });
    let secondFolder = new FolderModel({ 'name': 'nameFolderOne', 'shortName': 'name' });
    let thirdFolder = new FolderModel({ 'name': 'nameFolderTwo' });

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

        await uploadActions.uploadFolder(this.alfrescoJsApi, firstFolderModel.name, '-my-');
        await uploadActions.uploadFolder(this.alfrescoJsApi, secondFolder.name, '-my-');
        await uploadActions.uploadFolder(this.alfrescoJsApi, thirdFolder.name, '-my-');

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        contentServicesPage.goToDocumentList();

        done();
    });

    // afterAll((done) => {
    //     NodesAPI.deleteContent(acsUser, firstFileModel.id, () => {
    //         NodesAPI.deleteContent(acsUser, firstFolderModel.id, () => {
    //             done();
    //         });
    //     });
    // });

    it('1. Search bar is visible', () => {
        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible();
        searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().checkSearchIconIsVisible();
        searchDialog.clickOnSearchIcon().checkSearchBarIsNotVisible().checkSearchIconIsVisible();
    });

    it('2. Add input and close', () => {
        searchDialog.checkSearchIconIsVisible().clickOnSearchIcon().enterText(firstFolderModel.shortName);
        searchDialog.clickOnSearchIcon().checkSearchBarIsNotVisible().checkSearchIconIsVisible();
        contentServicesPage.checkAcsContainer();
    });

    it('3. Search for content that doesn\'t exist', () => {
        searchDialog.checkSearchBarIsNotVisible().clickOnSearchIcon().checkNoResultMessageIsNotDisplayed()
            .enterText(search.inactive.name).checkNoResultMessageIsDisplayed();
        searchDialog.clearText();
        searchDialog.checkSearchBarIsNotVisible();
    });

    it('4. Existing folder and file are displayed in search suggestion when typing only the first 4 letters', () => {
        contentServicesPage.goToDocumentList();
        searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterText(firstFolderModel.shortName);

        searchDialog.resultTableContainsRow(firstFolderModel.name);

        searchDialog.getSpecificRowsHighlightName(firstFolderModel.name).then((text) => {
            expect(text).toEqual(firstFolderModel.shortName);
        });
        searchDialog.getSpecificRowsAuthor(firstFolderModel.name).then((text) => {
            expect(text).toEqual(acsUser.firstName + ' ' + acsUser.lastName);
        });
        searchDialog.getSpecificRowsCompleteName(firstFolderModel.name).then((text) => {
            expect(text).toEqual(firstFolderModel.name);
        });
        searchDialog.clearText();
        searchDialog.checkSearchBarIsNotVisible();

        searchDialog.clickOnSearchIcon().enterText(firstFileModel.shortName);
        searchDialog.resultTableContainsRow(firstFileModel.name);
        searchDialog.getSpecificRowsHighlightName(firstFileModel.name).then((text) => {
            expect(text).toEqual(firstFileModel.shortName);
        });
        searchDialog.getSpecificRowsAuthor(firstFileModel.name).then((text) => {
            expect(text).toEqual(acsUser.firstName + ' ' + acsUser.lastName);
        });
        searchDialog.getSpecificRowsCompleteName(firstFileModel.name).then((text) => {
            expect(text).toEqual(firstFileModel.name);
        });
        searchDialog.clearText();
        searchDialog.checkSearchBarIsNotVisible();
    });

    it('5. Existing folder and file are displayed in search suggestion', () => {
        contentServicesPage.goToDocumentList();
        searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterText(firstFolderModel.name);
        searchDialog.resultTableContainsRow(firstFolderModel.name);
        searchDialog.getSpecificRowsHighlightName(firstFolderModel.name).then((text) => {
            expect(text).toEqual(firstFolderModel.name);
        });
        searchDialog.getSpecificRowsAuthor(firstFolderModel.name).then((text) => {
            expect(text).toEqual(acsUser.firstName + ' ' + acsUser.lastName);
        });
        searchDialog.getSpecificRowsCompleteName(firstFolderModel.name).then((text) => {
            expect(text).toEqual(firstFolderModel.name);
        });
        searchDialog.clearText();
        searchDialog.checkSearchBarIsNotVisible();

        searchDialog.clickOnSearchIcon().enterText(firstFileModel.name);
        searchDialog.resultTableContainsRow(firstFileModel.name);
        searchDialog.getSpecificRowsHighlightName(firstFileModel.name).then((text) => {
            expect(text).toEqual(firstFileModel.name);
        });
        searchDialog.getSpecificRowsAuthor(firstFileModel.name).then((text) => {
            expect(text).toEqual(acsUser.firstName + ' ' + acsUser.lastName);
        });
        searchDialog.getSpecificRowsCompleteName(firstFileModel.name).then((text) => {
            expect(text).toEqual(firstFileModel.name);
        });

        searchDialog.clearText();
        searchDialog.checkSearchBarIsNotVisible();
    });

    it('6. Folder content is displayed when clicking on existing folder', () => {
        searchDialog.clickOnSearchIcon().enterText(firstFolderModel.shortName);
        searchDialog.resultTableContainsRow(firstFolderModel.name);
        searchDialog.clickOnSpecificRow(firstFolderModel.name);
        contentServicesPage.checkAcsContainer().waitForTableBody();
        contentServicesPage.currentFolderName().then((result) => {
            expect(result).toEqual(firstFolderModel.name);
        });
        contentServicesPage.goToDocumentList();

        searchDialog.checkSearchIconIsVisible().clickOnSearchIcon().checkSearchBarIsVisible();
        searchDialog.enterText(firstFileModel.name).resultTableContainsRow(firstFileModel.name);
        searchDialog.clickOnSpecificRow(firstFileModel.name);
        filePreviewPage.getPDFTitleFromSearch().then((title) => {
            expect(title).toEqual(firstFileModel.name);
        });
        filePreviewPage.closePreviewWithButton();
    });

    it('7. Non-existent folder is not displayed in search page', () => {
        searchDialog.checkSearchIconIsVisible().clickOnSearchIcon();
        searchDialog.enterTextAndPressEnter(search.inactive.name);
        searchResultPage.checkNoResultMessageIsDisplayed();
        contentServicesPage.goToDocumentList();
    });

    it('8. Existing folder is displayed in search page', () => {
        searchDialog.clickOnSearchIcon();
        searchDialog.enterTextAndPressEnter(firstFolderModel.name);
        searchResultPage.checkContentIsDisplayed(firstFolderModel.name);
    });

    it('9. Existing file is displayed in search page', () => {
        contentServicesPage.goToDocumentList();
        searchDialog.clickOnSearchIcon();
        searchDialog.enterTextAndPressEnter(firstFileModel.name);
        searchResultPage.checkContentIsDisplayed(firstFileModel.name);
    });

    it('10. A folder is selected from search bar using arrows', () => {
        contentServicesPage.goToDocumentList();

        searchDialog.clickOnSearchIcon().enterText(secondFolder.shortName);
        searchDialog.resultTableContainsRow(secondFolder.name).resultTableContainsRow(thirdFolder.name);

        let names = [];
        searchDialog.getAllRowsValues().then((array) => {
            names = array;
        });
        Util.pressDownArrowAndEnter();

        contentServicesPage.checkAcsContainer();
        contentServicesPage.currentFolderName().then((result) => {
            expect(result).toEqual(names[0]);
        });
    });

    xit('11. The search bar gets closed when clicking on another browser tab', () => {
        contentServicesPage.goToDocumentList();

        searchDialog.clickOnSearchIcon().enterText(secondFolder.shortName);
        searchDialog.resultTableContainsRow(secondFolder.name).resultTableContainsRow(thirdFolder.name);

        Util.openNewTabInBrowser();
        Util.switchToWindowHandler(0);

        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible();
    });
});
