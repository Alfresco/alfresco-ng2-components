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

import { LoginPage } from '../pages/adf/loginPage';

import { SearchDialog } from '../pages/adf/dialog/searchDialog';
import { ContentServicesPage } from '../pages/adf/contentServicesPage';
import { SearchResultsPage } from '../pages/adf/searchResultsPage';
import { FilePreviewPage } from '../pages/adf/filePreviewPage';

import { AcsUserModel } from '../models/ACS/acsUserModel';
import { FolderModel } from '../models/ACS/folderModel';
import { FileModel } from '../models/ACS/fileModel';

import TestConfig = require('../test.config');
import { Util } from '../util/util';
import resources = require('../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '../actions/ACS/upload.actions';

describe('Search component - Search Page', () => {
    let search = {
        active: {
            firstFile: null,
            secondFile: null,
            base: Util.generateRandomString(7),
            extension: '.txt'
        },
        no_permission: {
            noPermFile: 'Meetings',
            noPermFolder: 'Meeting Notes'
        }
    };

    let loginPage = new LoginPage();
    let contentServicesPage = new ContentServicesPage();
    let searchDialog = new SearchDialog();
    let searchResultPage = new SearchResultsPage();
    let filePreviewPage = new FilePreviewPage();

    let acsUser = new AcsUserModel();
    let emptyFolderModel = new FolderModel({ 'name': 'search' + Util.generateRandomString() });
    let firstFileModel;
    let newFolderModel = new FolderModel({ 'name': 'newFolder' });
    let fileNames = [], adminFileNames = [], nrOfFiles = 15, adminNrOfFiles = 5;

    beforeAll(async (done) => {
        fileNames = Util.generateSequenceFiles(1, nrOfFiles, search.active.base, search.active.extension);
        adminFileNames = Util.generateSequenceFiles(nrOfFiles + 1, nrOfFiles + adminNrOfFiles, search.active.base, search.active.extension);
        search.active.firstFile = fileNames[0];
        search.active.secondFile = fileNames[1];
        fileNames.splice(0, 1);

        firstFileModel = new FileModel({
            'name': search.active.firstFile,
            'location': resources.Files.ADF_DOCUMENTS.TXT.file_location
        });

        let uploadActions = new UploadActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        await uploadActions.createFolder(this.alfrescoJsApi, emptyFolderModel.name, '-my-');
        let newFolderModelUploaded = await uploadActions.createFolder(this.alfrescoJsApi, newFolderModel.name, '-my-');

        await uploadActions.createEmptyFiles(this.alfrescoJsApi, fileNames, newFolderModelUploaded.entry.id);

        await uploadActions.uploadFile(this.alfrescoJsApi, firstFileModel.location, firstFileModel.name, '-my-');

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await uploadActions.createEmptyFiles(this.alfrescoJsApi, adminFileNames, newFolderModelUploaded.entry.id);

        browser.driver.sleep(15000);

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        done();
    });

    it('[C260264] Should display message when no results are found', () => {
        let notExistentFileName = Util.generateRandomString();
        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible().clickOnSearchIcon()
            .enterTextAndPressEnter(notExistentFileName);
        searchResultPage.checkNoResultMessageIsDisplayed();
    });

    it('[C260265] Should display file previewer when opening a file from search results', () => {
        searchDialog
            .clickOnSearchIcon()
            .enterTextAndPressEnter(firstFileModel.name);

        searchResultPage.checkContentIsDisplayed(firstFileModel.name);
        searchResultPage.navigateToFolder(firstFileModel.name);

        browser.driver.sleep(200);

        filePreviewPage.closePreviewWithButton();
    });

    it('[C272810] Should display only files corresponding to search', () => {
        searchDialog
            .clickOnSearchIcon()
            .enterTextAndPressEnter(search.active.firstFile);

        searchResultPage.checkContentIsDisplayed(search.active.firstFile);
        expect(searchResultPage.numberOfResultsDisplayed()).toBe(1);
    });

    it('[C260267] Should display content when opening a folder from search results', () => {
        searchDialog
            .clickOnSearchIcon()
            .enterTextAndPressEnter(emptyFolderModel.name);

        searchResultPage.checkNoResultMessageIsNotDisplayed();
        searchResultPage.checkContentIsDisplayed(emptyFolderModel.name);
        searchResultPage.navigateToFolder(emptyFolderModel.name);
        contentServicesPage.currentFolderName().then((result) => {
            expect(result).toEqual(emptyFolderModel.name);
        });
    });

    it('[C260261] Should be able to delete a file from search results', () => {
        searchDialog
            .clickOnSearchIcon()
            .enterTextAndPressEnter(search.active.firstFile);

        searchResultPage.checkContentIsDisplayed(search.active.firstFile);

        searchResultPage.deleteContent(search.active.firstFile);

        searchResultPage.checkNoResultMessageIsDisplayed();
        searchResultPage.checkContentIsNotDisplayed(search.active.firstFile);

        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible().clickOnSearchIcon()
            .enterTextAndPressEnter(search.active.firstFile);
        searchResultPage.checkNoResultMessageIsDisplayed();
    });

    it('[C272809] Should be able to delete a folder from search results', () => {
        searchDialog
            .clickOnSearchIcon()
            .enterTextAndPressEnter(emptyFolderModel.name);

        searchResultPage.checkContentIsDisplayed(emptyFolderModel.name);
        searchResultPage.checkNoResultMessageIsNotDisplayed();
        searchResultPage.checkContentIsDisplayed(emptyFolderModel.name);
        searchResultPage.deleteContent(emptyFolderModel.name);
        searchResultPage.checkNoResultMessageIsDisplayed();

        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible().clickOnSearchIcon()
            .enterTextAndPressEnter(emptyFolderModel.name);
        searchResultPage.checkNoResultMessageIsDisplayed();
    });

    describe('Sorting', () => {

        beforeEach(() => {
            searchDialog
                .clickOnSearchIcon()
                .enterTextAndPressEnter(search.active.base);
        });

        afterEach(async (done) => {
            await browser.refresh();
            done();
        });

        it('[C272803] Should be able to sort results by name (Ascending)', () => {

            searchResultPage.checkContentIsDisplayed(search.active.secondFile);
            searchResultPage.sortAndCheckListIsOrderedByName(true).then((result) => {
                expect(result).toEqual(true);
            });
        });

        it('[C272804] Should be able to sort results by name (Descending)', () => {

            searchResultPage.checkContentIsDisplayed(search.active.secondFile);
            searchResultPage.sortAndCheckListIsOrderedByName(false).then((result) => {
                expect(result).toEqual(true);
            });
        });

        it('[C272805] Should be able to sort results by author (Ascending)', () => {

            searchResultPage.checkContentIsDisplayed(search.active.secondFile);

            searchResultPage.sortAndCheckListIsOrderedByAuthor(this.alfrescoJsApi, true).then((result) => {
                expect(result).toEqual(true);
            });
        });

        it('[C272806] Should be able to sort results by author (Descending)', () => {

            searchResultPage.checkContentIsDisplayed(search.active.secondFile);
            searchResultPage.sortAndCheckListIsOrderedByAuthor(this.alfrescoJsApi, false).then((result) => {
                expect(result).toEqual(true);
            });
        });

        it('[C272807] Should be able to sort results by date (Ascending)', () => {

            searchResultPage.checkContentIsDisplayed(search.active.secondFile);
            searchResultPage.sortAndCheckListIsOrderedByCreated(true).then((result) => {
                expect(result).toEqual(true);
            });
        });

        it('[C260260] Should be able to sort results by date (Descending)', () => {

            searchResultPage.checkContentIsDisplayed(search.active.secondFile);
            searchResultPage.sortAndCheckListIsOrderedByCreated(false).then((result) => {
                expect(result).toEqual(true);
            });
        });

    });

    it('[C260262] Should not be able to delete a file from search results without rights', () => {
        searchDialog
            .clickOnSearchIcon()
            .enterTextAndPressEnter(search.no_permission.noPermFile);

        searchResultPage.checkContentIsDisplayed(search.no_permission.noPermFile);
        searchResultPage.checkDeleteIsDisabled(search.no_permission.noPermFile);
        searchResultPage.checkContentIsDisplayed(search.no_permission.noPermFile);
        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible().clickOnSearchIcon()
            .enterTextAndPressEnter(search.no_permission.noPermFile);
        searchResultPage.checkNoResultMessageIsNotDisplayed();
        searchResultPage.checkContentIsDisplayed(search.no_permission.noPermFile);
    });

    it('[C272808] Should not be able to delete a folder from search results without rights', () => {
        searchDialog
            .clickOnSearchIcon()
            .enterTextAndPressEnter(search.no_permission.noPermFolder);

        searchResultPage.checkContentIsDisplayed(search.no_permission.noPermFolder);
        searchResultPage.checkDeleteIsDisabled(search.no_permission.noPermFolder);
        searchResultPage.checkContentIsDisplayed(search.no_permission.noPermFolder);

        searchDialog
            .clickOnSearchIcon()
            .enterTextAndPressEnter(search.no_permission.noPermFolder);

        searchResultPage.checkNoResultMessageIsNotDisplayed();
        searchResultPage.checkContentIsDisplayed(search.no_permission.noPermFolder);
    });

    it('[C286675] Should display results when searching for all elements', () => {
        searchDialog
            .clickOnSearchIcon()
            .enterTextAndPressEnter('*');

        searchResultPage.checkNoResultMessageIsNotDisplayed();
    });
});
