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
import SearchResultPage = require('./pages/adf/searchResultsPage.js');
import filePreviewPage = require('./pages/adf/filePreviewPage.js');

import AcsUserModel = require('./models/ACS/acsUserModel.js');
import FolderModel = require('./models/ACS/folderModel.js');
import FileModel = require('./models/ACS/fileModel.js');

import NodesAPI = require('./restAPI/ACS/NodesAPI.js');
import QueriesAPI = require('./restAPI/ACS/QueriesAPI.js');
import PeopleAPI = require('./restAPI/ACS/PeopleAPI.js');

import TestConfig = require('./test.config.js');
import Util = require('./util/util.js');
import resources = require('./util/resources.js');

let retryNumber = 100;

xdescribe('Test Search component - Search Page', () => {
    let search = {
        active: {
            base: 'newFile',
            firstFile: 'newFile14.txt',
            secondFile: 'newFile15.txt',
            extension: '.txt'
        },
        no_permission: {
            noPermFile: 'Meetings',
            noPermFolder: 'Meeting Notes'
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
    let emptyFolderModel = new FolderModel({ 'name': 'emptyFolder' });
    let firstFileModel = new FileModel({ 'name': resources.Files.ADF_DOCUMENTS.PDF.file_name });
    let newFolderModel = new FolderModel({ 'name': 'newFolder' });
    let fileNames = [], adminFileNames = [], nrOfFiles = 15, adminNrOfFiles = 5;

    beforeAll( (done) => {
        fileNames = Util.generateSeqeunceFiles(1, nrOfFiles, search.active.base, search.active.extension);
        adminFileNames = Util.generateSeqeunceFiles(nrOfFiles + 1, nrOfFiles + adminNrOfFiles, search.active.base, search.active.extension);

        PeopleAPI.createUserViaAPI(adminUserModel, acsUser)
            .then(() => {
                return adfLoginPage.loginToContentServicesUsingUserModel(acsUser);
            })
            .then(() => {
                return protractor.promise.all([
                    NodesAPI.uploadFolderViaAPI(acsUser, emptyFolderModel, '-my-'),
                    NodesAPI.uploadFolderViaAPI(acsUser, newFolderModel, '-my-')
                ]);
            })
            .then(() => {
                return protractor.promise.all([
                    NodesAPI.createEmptyFilesViaAPI(acsUser, fileNames, newFolderModel.id),
                    NodesAPI.createEmptyFilesViaAPI(adminUserModel, adminFileNames, newFolderModel.id),
                    NodesAPI.uploadFileViaAPI(acsUser, firstFileModel, '-my-', false)
                ]);
            })
            .then(function (data) {
                QueriesAPI.getNodes(retryNumber, acsUser, 'term=nothing*&rootNodeId=-root-', nrOfFiles + adminNrOfFiles, () => {
                    done();
                });
            });

    });

    afterAll((done) => {
        NodesAPI.deleteContent(acsUser, newFolderModel.id, () => {
            NodesAPI.deleteContent(acsUser, emptyFolderModel.id, () => {
                done();
            });
        });
    });

    it('1. \'No results found searching for\' message is displayed on Search Page', () => {
        contentServicesPage.goToDocumentList();
        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible().clickOnSearchIcon()
            .enterTextAndPressEnter('nonexistent');
        searchResultPage.checkNoResultMessageIsDisplayed();
    });

    it('2. File previewer is displayed', () => {
        contentServicesPage.goToDocumentList();
        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible().clickOnSearchIcon()
            .enterTextAndPressEnter(firstFileModel.name);
        searchResultPage.checkContentIsDisplayed(firstFileModel.name);
        searchResultPage.navigateToFolder(firstFileModel.name);
        filePreviewPage.getPDFTitleFromSearch().then(function (title) {
            expect(title).toEqual(firstFileModel.name);
        });
        filePreviewPage.closePreviewWithButton();
    });

    it('3. Only the searched file is displayed', () => {
        contentServicesPage.goToDocumentList();
        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible().clickOnSearchIcon()
            .enterTextAndPressEnter(search.active.firstFile);
        searchResultPage.checkContentIsDisplayed(search.active.firstFile);
        expect(searchResultPage.numberOfResultsDisplayed()).toBe(1);
    });

    it('4. Folder content is displayed', () => {
        contentServicesPage.goToDocumentList();
        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible().clickOnSearchIcon()
            .enterTextAndPressEnter(emptyFolderModel.name);
        searchResultPage.checkNoResultMessageIsNotDisplayed();
        searchResultPage.checkContentIsDisplayed(emptyFolderModel.name);
        searchResultPage.navigateToFolder(emptyFolderModel.name);
        contentServicesPage.currentFolderName().then(function (result) {
            expect(result).toEqual(emptyFolderModel.name);
        });
    });

    it('5. Delete a file from the Search Results Page', () => {
        contentServicesPage.goToDocumentList();
        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible().clickOnSearchIcon()
            .enterTextAndPressEnter(search.active.firstFile);
        searchResultPage.checkContentIsDisplayed(search.active.firstFile);
        searchResultPage.deleteContent(search.active.firstFile);
        searchResultPage.checkNoResultMessageIsDisplayed();
        searchResultPage.checkContentIsNotDisplayed(search.active.firstFile);
        contentServicesPage.goToDocumentList();
        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible().clickOnSearchIcon()
            .enterTextAndPressEnter(search.active.firstFile);
        searchResultPage.checkNoResultMessageIsDisplayed();
    });

    it('6. Delete a folder from the Search Results Page', () => {
        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible().clickOnSearchIcon()
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

    it('8. Sort content ascending by name.', () => {
        contentServicesPage.goToDocumentList();
        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible().clickOnSearchIcon()
            .enterTextAndPressEnter(search.active.base);
        searchResultPage.checkContentIsDisplayed(search.active.secondFile);
        searchResultPage.sortAndCheckListIsOrderedByName(true).then(function (result) {
            expect(result).toEqual(true);
        });
    });

    it('9. Sort content descending by name.', () => {
        contentServicesPage.goToDocumentList();
        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible().clickOnSearchIcon()
            .enterTextAndPressEnter(search.active.base);
        searchResultPage.checkContentIsDisplayed(search.active.secondFile);
        searchResultPage.sortAndCheckListIsOrderedByName(false).then(function (result) {
            expect(result).toEqual(true);
        });
    });

    xit('10. Sort content ascending by author.', () => {
        contentServicesPage.goToDocumentList();
        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible().clickOnSearchIcon()
            .enterTextAndPressEnter(search.active.base);
        searchResultPage.checkContentIsDisplayed(search.active.secondFile);
        searchResultPage.sortAndCheckListIsOrderedByAuthor(true).then(function (result) {
            expect(result).toEqual(true);
        });
    });

    xit('11. Sort content descending by author.', () => {
        contentServicesPage.goToDocumentList();
        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible().clickOnSearchIcon()
            .enterTextAndPressEnter(search.active.base);
        searchResultPage.checkContentIsDisplayed(search.active.secondFile);
        searchResultPage.sortAndCheckListIsOrderedByAuthor(false).then(function (result) {
            expect(result).toEqual(true);
        });
    });

    xit('12. Sort content ascending by created date.', () => {
        contentServicesPage.goToDocumentList();
        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible().clickOnSearchIcon()
            .enterTextAndPressEnter(search.active.base);
        searchResultPage.checkContentIsDisplayed(search.active.secondFile);
        searchResultPage.sortAndCheckListIsOrderedByCreated(true).then(function (result) {
            expect(result).toEqual(true);
        });
    });

    xit('13. Sort content descending by created date.', () => {
        contentServicesPage.goToDocumentList();
        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible().clickOnSearchIcon()
            .enterTextAndPressEnter(search.active.base);
        searchResultPage.checkContentIsDisplayed(search.active.secondFile);
        searchResultPage.sortAndCheckListIsOrderedByCreated(false).then(function (result) {
            expect(result).toEqual(true);
        });
    });

    it('14. Try to delete a file without rights from the Search Results Page', () => {
        contentServicesPage.goToDocumentList();
        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible().clickOnSearchIcon()
            .enterTextAndPressEnter(search.no_permission.noPermFile);
        searchResultPage.checkContentIsDisplayed(search.no_permission.noPermFile);
        searchResultPage.deleteContent(search.no_permission.noPermFile);
        searchResultPage.checkContentIsDisplayed(search.no_permission.noPermFile);
        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible().clickOnSearchIcon()
            .enterTextAndPressEnter(search.no_permission.noPermFile);
        searchResultPage.checkNoResultMessageIsNotDisplayed();
        searchResultPage.checkContentIsDisplayed(search.no_permission.noPermFile);
    });

    it('15. Try to delete a folder without rights from the Search Results Page', () => {
        contentServicesPage.goToDocumentList();
        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible().clickOnSearchIcon()
            .enterTextAndPressEnter(search.no_permission.noPermFolder);
        searchResultPage.checkContentIsDisplayed(search.no_permission.noPermFolder);
        searchResultPage.deleteContent(search.no_permission.noPermFolder);
        searchResultPage.checkContentIsDisplayed(search.no_permission.noPermFolder);
        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible().clickOnSearchIcon()
            .enterTextAndPressEnter(search.no_permission.noPermFolder);
        searchResultPage.checkNoResultMessageIsNotDisplayed();
        searchResultPage.checkContentIsDisplayed(search.no_permission.noPermFolder);
    });
});
