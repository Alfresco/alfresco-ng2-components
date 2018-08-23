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

import LoginPage = require('../pages/adf/loginPage');
import SearchDialog = require('../pages/adf/dialog/searchDialog');
import ContentServicesPage = require('../pages/adf/contentServicesPage');
import filePreviewPage = require('../pages/adf/filePreviewPage');
import SearchResultPage = require('../pages/adf/searchResultsPage');

import AcsUserModel = require('../models/ACS/acsUserModel');
import FileModel = require('../models/ACS/fileModel');
import FolderModel = require('../models/ACS/folderModel');

import TestConfig = require('../test.config');
import Util = require('../util/util');

import AlfrescoApi = require('alfresco-js-api-node');
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
    let searchResultPage = new SearchResultPage();

    let acsUser = new AcsUserModel();

    let filename = Util.generateRandomString(16);
    let firstFolderName = Util.generateRandomString(16);
    let secondFolderName = Util.generateRandomString(16);
    let thirdFolderName = Util.generateRandomString(16);

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

        await uploadActions.uploadFolder(this.alfrescoJsApi, firstFolderModel.name, '-my-');
        await uploadActions.uploadFolder(this.alfrescoJsApi, secondFolder.name, '-my-');
        await uploadActions.uploadFolder(this.alfrescoJsApi, thirdFolder.name, '-my-');

        await browser.driver.sleep(5000); // wait search index previous file/folder uploaded

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

    xit('[C272798] Search bar is visible', () => {
        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible();
        searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().checkSearchIconIsVisible();
        searchDialog.clickOnSearchIcon().checkSearchBarIsNotVisible().checkSearchIconIsVisible();
    });

    xit('[C272799] Add input and close', () => {
        searchDialog.checkSearchIconIsVisible().clickOnSearchIcon().enterText(firstFolderModel.shortName);
        searchDialog.clickOnSearchIcon().checkSearchBarIsNotVisible().checkSearchIconIsVisible();
        contentServicesPage.checkAcsContainer();
    });

    xit('[C260255] Search for content that does not exist', () => {
        searchDialog.checkSearchBarIsNotVisible().clickOnSearchIcon().checkNoResultMessageIsNotDisplayed()
            .enterText(search.inactive.name).checkNoResultMessageIsDisplayed();
        searchDialog.clearText();
        searchDialog.checkSearchBarIsNotVisible();
    });

    xit('[C260256] Existing folder and file are displayed in search suggestion when typing the first 4 letters', () => {
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

    xit('[C272800] Existing folder and file are displayed in search suggestion', () => {
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

    xit('[C260257] Folder content is displayed when clicking on existing folder', () => {
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

    xit('[C272801] Non-existent folder is not displayed in search page', () => {
        searchDialog.checkSearchIconIsVisible().clickOnSearchIcon();
        searchDialog.enterTextAndPressEnter(search.inactive.name);
        searchResultPage.checkNoResultMessageIsDisplayed();
        contentServicesPage.goToDocumentList();
    });

    xit('[C272802] Existing folder is displayed in search page', () => {
        searchDialog.clickOnSearchIcon();
        browser.driver.sleep(1000);
        searchDialog.enterTextAndPressEnter(firstFolderModel.name);
        searchResultPage.checkContentIsDisplayed(firstFolderModel.name);
    });

    xit('[C260258] Existing file is displayed in search page', () => {
        contentServicesPage.goToDocumentList();
        searchDialog.clickOnSearchIcon();
        searchDialog.enterTextAndPressEnter(firstFileModel.name);
        searchResultPage.checkContentIsDisplayed(firstFileModel.name);
    });

    xit('[C91321] Should be able to use down arrow key when navigating throw suggestions', () => {
        contentServicesPage.goToDocumentList();

        searchDialog
            .clickOnSearchIcon()
            .enterText(secondFolder.shortName)
            .pressDownArrowAndEnter();

        contentServicesPage.checkAcsContainer();
        expect(contentServicesPage.currentFolderName()).toEqual(secondFolder.name);
    });

    xit('[C260254] The search bar gets closed when clicking on another browser tab', () => {
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
