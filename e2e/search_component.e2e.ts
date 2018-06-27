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

import AdfLoginPage = require('./pages/adf/loginPage.js');
import SearchDialog = require('./pages/adf/dialog/searchDialog.js');
import ContentServicesPage = require('./pages/adf/contentServicesPage.js');
import filePreviewPage = require('./pages/adf/filePreviewPage.js');
import SearchResultPage = require('./pages/adf/searchResultsPage.js');

import AcsUserModel = require('./models/ACS/acsUserModel.js');
import FileModel = require('./models/ACS/fileModel.js');
import FolderModel = require('./models/ACS/folderModel.js');

import NodesAPI = require('./restAPI/ACS/NodesAPI.js');
import PeopleAPI = require('./restAPI/ACS/PeopleAPI.js');
import SearchAPI = require('./restAPI/ACS/SearchAPI.js');

import TestConfig = require('./test.config.js');
import resources = require('./util/resources.js');
import Util = require('./util/util.js');

let retryNumber = 30;

xdescribe('Test Search component - Search Bar', function () {

    search = {
        inactive: {
            firstChar: 'x',
            secondChar: 'y',
            thirdChar: 'z',
            name: 'nonexistent'
        },
        active: {
            base: 'newFile',
            extension: '.txt'
        }
    };

    let adfLoginPage = new AdfLoginPage();
    let contentServicesPage = new ContentServicesPage();
    let searchDialog = new SearchDialog();
    let searchResultPage = new SearchResultPage();

    let acsUser = new AcsUserModel();
    let adminUserModel = new AcsUserModel({
        'id': TestConfig.adf.adminEmail,
        'password': TestConfig.adf.adminPassword
    });
    let firstFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
        'shortName': resources.Files.ADF_DOCUMENTS.PDF.short_file_name
    });
    let firstFolderModel = new FolderModel({ 'name': 'folderOne', 'shortName': 'folde' });
    let secondFolder = new FolderModel({ 'name': 'nameFolderOne', 'shortName': 'name' });
    let thirdFolder = new FolderModel({ 'name': 'nameFolderTwo' });

    beforeAll( (done) => {
        PeopleAPI.createUserViaAPI(adminUserModel, acsUser).then(function () {
            return protractor.promise.all([
                NodesAPI.uploadFileViaAPI(acsUser, firstFileModel, '-my-', false),
                NodesAPI.uploadFolderViaAPI(acsUser, firstFolderModel, '-my-', false),
                NodesAPI.uploadFolderViaAPI(acsUser, secondFolder, '-my-', false),
                NodesAPI.uploadFolderViaAPI(acsUser, thirdFolder, '-my-', false),
                NodesAPI.getNode(retryNumber, acsUser, firstFileModel.id, function () {
                })
            ]).then(function () {
                NodesAPI.getNode(retryNumber, acsUser, firstFolderModel.id, function () {
                }),
                    SearchAPI.search(100, acsUser, 4, SearchAPI.recentFiles(acsUser.getId()), function () {
                        adfLoginPage.loginToContentServicesUsingUserModel(acsUser);
                        contentServicesPage.goToDocumentList();
                        done();
                    });
            });
        });
    });

    afterAll((done) => {
        NodesAPI.deleteContent(acsUser, firstFileModel.id, function () {
            NodesAPI.deleteContent(acsUser, firstFolderModel.id, function () {
                done();
            });
        });
    });

    it('1. Search bar is visible', function () {
        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible();
        searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().checkSearchIconIsVisible();
        searchDialog.clickOnSearchIcon().checkSearchBarIsNotVisible().checkSearchIconIsVisible();
    });

    it('2. Add input and close', function () {
        searchDialog.checkSearchIconIsVisible().clickOnSearchIcon().enterText(firstFolderModel.shortName);
        searchDialog.clickOnSearchIcon().checkSearchBarIsNotVisible().checkSearchIconIsVisible();
        contentServicesPage.checkAcsContainer();
    });

    it('3. Search for content that doesn\'t exist', function () {
        searchDialog.checkSearchBarIsNotVisible().clickOnSearchIcon().checkNoResultMessageIsNotDisplayed()
            .enterText(search.inactive.name).checkNoResultMessageIsDisplayed();
        searchDialog.clearText();
        searchDialog.checkSearchBarIsNotVisible();
    });

    it('4. Existing folder and file are displayed in search suggestion when typing only the first 4 letters', function () {
        contentServicesPage.goToDocumentList();
        searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterText(firstFolderModel.shortName);

        searchDialog.resultTableContainsRow(firstFolderModel.name);

        searchDialog.getSpecificRowsHighlightName(firstFolderModel.name).then(function (text) {
            expect(text).toEqual(firstFolderModel.shortName);
        });
        searchDialog.getSpecificRowsAuthor(firstFolderModel.name).then(function (text) {
            expect(text).toEqual(acsUser.firstName + ' ' + acsUser.lastName);
        });
        searchDialog.getSpecificRowsCompleteName(firstFolderModel.name).then(function (text) {
            expect(text).toEqual(firstFolderModel.name);
        });
        searchDialog.clearText();
        searchDialog.checkSearchBarIsNotVisible();

        searchDialog.clickOnSearchIcon().enterText(firstFileModel.shortName);
        searchDialog.resultTableContainsRow(firstFileModel.name);
        searchDialog.getSpecificRowsHighlightName(firstFileModel.name).then(function (text) {
            expect(text).toEqual(firstFileModel.shortName);
        });
        searchDialog.getSpecificRowsAuthor(firstFileModel.name).then(function (text) {
            expect(text).toEqual(acsUser.firstName + ' ' + acsUser.lastName);
        });
        searchDialog.getSpecificRowsCompleteName(firstFileModel.name).then(function (text) {
            expect(text).toEqual(firstFileModel.name);
        });
        searchDialog.clearText();
        searchDialog.checkSearchBarIsNotVisible();
    });

    it('5. Existing folder and file are displayed in search suggestion', function () {
        contentServicesPage.goToDocumentList();
        searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterText(firstFolderModel.name);
        searchDialog.resultTableContainsRow(firstFolderModel.name);
        searchDialog.getSpecificRowsHighlightName(firstFolderModel.name).then(function (text) {
            expect(text).toEqual(firstFolderModel.name);
        });
        searchDialog.getSpecificRowsAuthor(firstFolderModel.name).then(function (text) {
            expect(text).toEqual(acsUser.firstName + ' ' + acsUser.lastName);
        });
        searchDialog.getSpecificRowsCompleteName(firstFolderModel.name).then(function (text) {
            expect(text).toEqual(firstFolderModel.name);
        });
        searchDialog.clearText();
        searchDialog.checkSearchBarIsNotVisible();

        searchDialog.clickOnSearchIcon().enterText(firstFileModel.name);
        searchDialog.resultTableContainsRow(firstFileModel.name);
        searchDialog.getSpecificRowsHighlightName(firstFileModel.name).then(function (text) {
            expect(text).toEqual(firstFileModel.name);
        });
        searchDialog.getSpecificRowsAuthor(firstFileModel.name).then(function (text) {
            expect(text).toEqual(acsUser.firstName + ' ' + acsUser.lastName);
        });
        searchDialog.getSpecificRowsCompleteName(firstFileModel.name).then(function (text) {
            expect(text).toEqual(firstFileModel.name);
        });

        searchDialog.clearText();
        searchDialog.checkSearchBarIsNotVisible();
    });

    it('6. Folder content is displayed when clicking on existing folder', function () {
        searchDialog.clickOnSearchIcon().enterText(firstFolderModel.shortName);
        searchDialog.resultTableContainsRow(firstFolderModel.name);
        searchDialog.clickOnSpecificRow(firstFolderModel.name);
        contentServicesPage.checkAcsContainer().waitForTableBody();
        contentServicesPage.currentFolderName().then(function (result) {
            expect(result).toEqual(firstFolderModel.name);
        });
        contentServicesPage.goToDocumentList();

        searchDialog.checkSearchIconIsVisible().clickOnSearchIcon().checkSearchBarIsVisible();
        searchDialog.enterText(firstFileModel.name).resultTableContainsRow(firstFileModel.name);
        searchDialog.clickOnSpecificRow(firstFileModel.name);
        filePreviewPage.getPDFTitleFromSearch().then(function (title) {
            expect(title).toEqual(firstFileModel.name);
        });
        filePreviewPage.closePreviewWithButton();
    });

    it('7. Non-existent folder is not displayed in search page', function () {
        searchDialog.checkSearchIconIsVisible().clickOnSearchIcon();
        searchDialog.enterTextAndPressEnter(search.inactive.name);
        searchResultPage.checkNoResultMessageIsDisplayed();
        contentServicesPage.goToDocumentList();
    });

    it('8. Existing folder is displayed in search page', function () {
        searchDialog.clickOnSearchIcon();
        searchDialog.enterTextAndPressEnter(firstFolderModel.name);
        searchResultPage.checkContentIsDisplayed(firstFolderModel.name);
    });

    it('9. Existing file is displayed in search page', function () {
        contentServicesPage.goToDocumentList();
        searchDialog.clickOnSearchIcon();
        searchDialog.enterTextAndPressEnter(firstFileModel.name);
        searchResultPage.checkContentIsDisplayed(firstFileModel.name);
    });

    it('10. A folder is selected from search bar using arrows', function () {
        contentServicesPage.goToDocumentList();
        searchDialog.clickOnSearchIcon().enterText(secondFolder.shortName);
        searchDialog.resultTableContainsRow(secondFolder.name).resultTableContainsRow(thirdFolder.name);
        let names = [];
        searchDialog.getAllRowsValues().then(function (array) {
            names = array;
        });
        Util.pressDownArrowAndEnter();
        contentServicesPage.checkAcsContainer();
        contentServicesPage.currentFolderName().then(function (result) {
            expect(result).toEqual(names[0]);
        });
    });

    it('11. The search bar gets closed when clicking on another browser tab', function () {
        contentServicesPage.goToDocumentList();
        searchDialog.clickOnSearchIcon().enterText(secondFolder.shortName);
        searchDialog.resultTableContainsRow(secondFolder.name).resultTableContainsRow(thirdFolder.name);
        Util.openNewTabInBrowser();
        Util.switchToWindowHandler(0);
        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible();
    });
});
