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
import ContentServicesPage = require('./pages/adf/contentServicesPage.js');
import PaginationPage = require('./pages/adf/paginationPage.js');
import NavigationBarPage = require('./pages/adf/navigationBarPage.js');

import AcsUserModel = require('./models/ACS/acsUserModel.js');
import FolderModel = require('./models/ACS/folderModel.js');

import NodesAPI = require('./restAPI/ACS/NodesAPI.js');
import QueriesAPI = require('./restAPI/ACS/QueriesAPI.js');
import PeopleAPI = require('./restAPI/ACS/PeopleAPI.js');

import TestConfig = require('./test.config.js');
import Util = require('./util/util.js');
let retryNumber = 100;

describe('Test Document List - Pagination', function () {
    let pagination = {
        base: 'newFile',
        secondSetBase: 'secondSet',
        extension: '.txt'
    };

    let itemsPerPage = {
        five: '5',
        fiveValue: 5,
        ten: '10',
        tenValue: 10,
        fifteen: '15',
        fifteenValue: 15,
        twenty: '20',
        twentyValue: 20,
        default: '25'
    };

    let adfLoginPage = new AdfLoginPage();
    let contentServicesPage = new ContentServicesPage();
    let paginationPage = new PaginationPage();
    let navigationBarPage = new NavigationBarPage();

    let acsUser = new AcsUserModel();
    let adminUserModel = new AcsUserModel({
        'id': TestConfig.adf.adminEmail,
        'password': TestConfig.adf.adminPassword
    });
    let newFolderModel = new FolderModel({'name': 'newFolder'});
    let fileNames = [], nrOfFiles = 20, currentPage = 1, secondSetOfFiles, secondSetNumber = 25;
    let folderTwoModel = new FolderModel({'name': 'folderTwo'});
    let folderThreeModel = new FolderModel({'name': 'folderThree'});

    beforeAll( (done) => {
        fileNames = Util.generateSeqeunceFiles(10, nrOfFiles + 9, pagination.base, pagination.extension);
        secondSetOfFiles = Util.generateSeqeunceFiles(10, secondSetNumber + 9, pagination.secondSetBase, pagination.extension);

        PeopleAPI.createUserViaAPI(adminUserModel, acsUser)
            .then(function () {
                return adfLoginPage.loginToContentServicesUsingUserModel(acsUser);
            })
            .then(function () {
                NodesAPI.uploadFolderViaAPI(acsUser, folderThreeModel, '-my-');
                return NodesAPI.uploadFolderViaAPI(acsUser, newFolderModel, '-my-');
            })
            .then(function () {
                return NodesAPI.createEmptyFilesViaAPI(acsUser, fileNames, newFolderModel.id);
            })
            .then(function () {
                return NodesAPI.createEmptyFilesViaAPI(acsUser, secondSetOfFiles, folderThreeModel.id);
            })
            .then(function (data) {
                return QueriesAPI.getNodes(retryNumber, acsUser, 'term=newFile*&rootNodeId=-root-', nrOfFiles, function () {
                });
            })
            .then(function (res) {
                done();
            });
    });

    afterAll((done) => {
        NodesAPI.deleteContent(acsUser, newFolderModel.id, function () {
            done();
        });
    });

    it('[C260062] Default pagination settings', function () {
        contentServicesPage.goToDocumentList();
        contentServicesPage.navigateToFolder(newFolderModel.name);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.default);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + nrOfFiles + ' of ' + nrOfFiles);
        expect(contentServicesPage.numberOfResultsDisplayed()).toBe(nrOfFiles);
        contentServicesPage.getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, fileNames)).toEqual(true);
        });
        paginationPage.checkNextPageButtonIsDisabled();
        paginationPage.checkPreviousPageButtonIsDisabled();
    });

    it('[C274713] 20 Items per page', function () {
        contentServicesPage.goToDocumentList();
        contentServicesPage.navigateToFolder(newFolderModel.name);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        paginationPage.selectItemsPerPage(itemsPerPage.twenty);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.twenty);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + nrOfFiles + ' of ' + nrOfFiles);
        expect(contentServicesPage.numberOfResultsDisplayed()).toBe(nrOfFiles);
        contentServicesPage.getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, fileNames)).toEqual(true);
        });
        paginationPage.checkNextPageButtonIsDisabled();
        paginationPage.checkPreviousPageButtonIsDisabled();

        navigationBarPage.clickLogoutButton();
        adfLoginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.goToDocumentList();
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.twenty);
        navigationBarPage.clickLogoutButton();
        adfLoginPage.loginToContentServicesUsingUserModel(acsUser);
    });

    it('[C260069] 5 Items per page', function () {
        contentServicesPage.goToDocumentList();
        contentServicesPage.navigateToFolder(newFolderModel.name);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        paginationPage.selectItemsPerPage(itemsPerPage.five);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfFiles);
        expect(contentServicesPage.numberOfResultsDisplayed()).toBe(itemsPerPage.fiveValue);
        contentServicesPage.getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, fileNames.slice(0, 5))).toEqual(true);
        });
        paginationPage.clickOnNextPage();
        currentPage++;
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 6-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfFiles);
        expect(contentServicesPage.numberOfResultsDisplayed()).toBe(itemsPerPage.fiveValue);
        contentServicesPage.getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, fileNames.slice(5, 10))).toEqual(true);
        });
        paginationPage.clickOnNextPage();
        currentPage++;
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 11-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfFiles);
        expect(contentServicesPage.numberOfResultsDisplayed()).toBe(itemsPerPage.fiveValue);
        contentServicesPage.getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, fileNames.slice(10, 15))).toEqual(true);
        });
        paginationPage.clickOnNextPage();
        currentPage++;
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 16-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfFiles);
        expect(contentServicesPage.numberOfResultsDisplayed()).toBe(itemsPerPage.fiveValue);
        contentServicesPage.getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, fileNames.slice(15, 20))).toEqual(true);
        });

        navigationBarPage.clickLogoutButton();
        adfLoginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.goToDocumentList();
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        navigationBarPage.clickLogoutButton();
        adfLoginPage.loginToContentServicesUsingUserModel(acsUser);
    });

    it('[C260067] 10 Items per page', function () {
        currentPage = 1;
        contentServicesPage.goToDocumentList();
        contentServicesPage.navigateToFolder(newFolderModel.name);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        paginationPage.selectItemsPerPage(itemsPerPage.ten);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.tenValue * currentPage + ' of ' + nrOfFiles);
        expect(contentServicesPage.numberOfResultsDisplayed()).toBe(itemsPerPage.tenValue);
        contentServicesPage.getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, fileNames.slice(0, 10))).toEqual(true);
        });
        paginationPage.clickOnNextPage();
        currentPage++;
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 11-' + itemsPerPage.tenValue * currentPage + ' of ' + nrOfFiles);
        expect(contentServicesPage.numberOfResultsDisplayed()).toBe(itemsPerPage.tenValue);
        contentServicesPage.getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, fileNames.slice(10, 20))).toEqual(true);
        });

        navigationBarPage.clickLogoutButton();
        adfLoginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.goToDocumentList();
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        navigationBarPage.clickLogoutButton();
        adfLoginPage.loginToContentServicesUsingUserModel(acsUser);
        currentPage = 1;
    });

    it('[C260065] 15 Items per page', function () {
        currentPage = 1;
        contentServicesPage.goToDocumentList();
        contentServicesPage.navigateToFolder(newFolderModel.name);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(contentServicesPage.getActiveBreadcrumb()).toEqual(newFolderModel.name);
        paginationPage.selectItemsPerPage(itemsPerPage.fifteen);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.fifteenValue * currentPage + ' of ' + nrOfFiles);
        expect(contentServicesPage.numberOfResultsDisplayed()).toBe(itemsPerPage.fifteenValue);
        contentServicesPage.getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, fileNames.slice(0, 15))).toEqual(true);
        });
        currentPage++;
        paginationPage.clickOnNextPage();
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 16-' + nrOfFiles + ' of ' + nrOfFiles);
        expect(contentServicesPage.numberOfResultsDisplayed()).toBe(nrOfFiles - itemsPerPage.fifteenValue);
        contentServicesPage.getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, fileNames.slice(15, 20))).toEqual(true);
        });

        navigationBarPage.clickLogoutButton();
        adfLoginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.goToDocumentList();
        contentServicesPage.checkAcsContainer();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
    });

    it('[C91320] Pagination when the content is sorted', function () {
        contentServicesPage.goToDocumentList();
        contentServicesPage.navigateToFolder(newFolderModel.name);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(contentServicesPage.getActiveBreadcrumb()).toEqual(newFolderModel.name);
        paginationPage.selectItemsPerPage(itemsPerPage.twenty);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        contentServicesPage.getAllRowsNameColumn().then(function (list) {
            expect(JSON.stringify(list) === JSON.stringify(fileNames)).toEqual(true);
        });
        contentServicesPage.sortByName(false);
        contentServicesPage.getAllRowsNameColumn().then(function (list) {
            fileNames.reverse();
            expect(JSON.stringify(list) === JSON.stringify(fileNames)).toEqual(true);
        });

        paginationPage.selectItemsPerPage(itemsPerPage.five);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        contentServicesPage.getAllRowsNameColumn().then(function (list) {
            expect(JSON.stringify(list) === JSON.stringify(fileNames.slice(15, 20))).toEqual(true);
        });

        paginationPage.clickOnNextPage();
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        contentServicesPage.getAllRowsNameColumn().then(function (list) {
            expect(JSON.stringify(list) === JSON.stringify(fileNames.slice(10, 15))).toEqual(true);
        });

        paginationPage.selectItemsPerPage(itemsPerPage.ten);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        contentServicesPage.getAllRowsNameColumn().then(function (list) {
            expect(JSON.stringify(list) === JSON.stringify(fileNames.slice(10, 20))).toEqual(true);
        });
    });

    it('[C260107] Pagination in an empty folder', function () {
        contentServicesPage.goToDocumentList();
        paginationPage.selectItemsPerPage(itemsPerPage.five);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        contentServicesPage.navigateToFolder(newFolderModel.name);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(contentServicesPage.getActiveBreadcrumb()).toEqual(newFolderModel.name);
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        contentServicesPage.createNewFolder(folderTwoModel.name).checkContentIsDisplayed(folderTwoModel.name);
        contentServicesPage.navigateToFolder(folderTwoModel.name);
        contentServicesPage.checkPaginationIsNotDisplayed();
    });

    it('[C260071] Items per page when having 25 files', function () {
        currentPage = 1;
        contentServicesPage.goToDocumentList();
        contentServicesPage.navigateToFolder(folderThreeModel.name);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(contentServicesPage.getActiveBreadcrumb()).toEqual(folderThreeModel.name);
        paginationPage.selectItemsPerPage(itemsPerPage.fifteen);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.fifteenValue * currentPage + ' of ' + secondSetNumber);
        expect(contentServicesPage.numberOfResultsDisplayed()).toBe(itemsPerPage.fifteenValue);
        contentServicesPage.getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, secondSetOfFiles.slice(0, 15))).toEqual(true);
        });

        currentPage++;
        paginationPage.clickOnNextPage();
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 16-' + secondSetNumber + ' of ' + secondSetNumber);
        expect(contentServicesPage.numberOfResultsDisplayed()).toBe(secondSetNumber - itemsPerPage.fifteenValue);
        contentServicesPage.getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, secondSetOfFiles.slice(15, 25))).toEqual(true);
        });

        currentPage = 1;
        paginationPage.selectItemsPerPage(itemsPerPage.twenty);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.twenty);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.twentyValue * currentPage + ' of ' + secondSetNumber);
        expect(contentServicesPage.numberOfResultsDisplayed()).toBe(itemsPerPage.twentyValue);
        contentServicesPage.getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, secondSetOfFiles.slice(0, 20))).toEqual(true);
        });

        currentPage++;
        paginationPage.clickOnNextPage();
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.twenty);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 21-' + secondSetNumber + ' of ' + secondSetNumber);
        expect(contentServicesPage.numberOfResultsDisplayed()).toBe(secondSetNumber - itemsPerPage.twentyValue);
        contentServicesPage.getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, secondSetOfFiles.slice(20, 25))).toEqual(true);
        });
    });
});
