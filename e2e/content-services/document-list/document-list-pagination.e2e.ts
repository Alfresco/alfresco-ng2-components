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

import { LoginPage } from '../../pages/adf/loginPage';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { PaginationPage } from '../../pages/adf/paginationPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FolderModel } from '../../models/ACS/folderModel';

import TestConfig = require('../../test.config');
import { Util } from '../../util/util';

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../../actions/ACS/upload.actions';
import { browser } from 'protractor';

describe('Document List - Pagination', function () {
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

    let loginPage = new LoginPage();
    let contentServicesPage = new ContentServicesPage();
    let paginationPage = new PaginationPage();
    let navigationBarPage = new NavigationBarPage();

    let acsUser = new AcsUserModel();
    let newFolderModel = new FolderModel({'name': 'newFolder'});
    let fileNames = [], nrOfFiles = 20, currentPage = 1, secondSetOfFiles = [], secondSetNumber = 25;
    let folderTwoModel = new FolderModel({'name': 'folderTwo'});
    let folderThreeModel = new FolderModel({'name': 'folderThree'});

    beforeAll(async (done) => {
        let uploadActions = new UploadActions();

        fileNames = Util.generateSequenceFiles(10, nrOfFiles + 9, pagination.base, pagination.extension);
        secondSetOfFiles = Util.generateSequenceFiles(10, secondSetNumber + 9, pagination.secondSetBase, pagination.extension);

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        let folderThreeUploadedModel = await uploadActions.createFolder(this.alfrescoJsApi, folderThreeModel.name, '-my-');
        let newFolderUploadedModel = await uploadActions.createFolder(this.alfrescoJsApi, newFolderModel.name, '-my-');

        await uploadActions.createEmptyFiles(this.alfrescoJsApi, fileNames, newFolderUploadedModel.entry.id);

        await uploadActions.createEmptyFiles(this.alfrescoJsApi, secondSetOfFiles, folderThreeUploadedModel.entry.id);

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        done();
    });

    it('[C260062] Should use default pagination settings', function () {
        contentServicesPage.goToDocumentList();
        contentServicesPage.navigateToFolder(newFolderModel.name);
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
    });

    it('[C274713] Should be able to set Items per page to 20', function () {
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
        loginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.goToDocumentList();
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.twenty);
        navigationBarPage.clickLogoutButton();
        loginPage.loginToContentServicesUsingUserModel(acsUser);
    });

    it('[C260069] Should be able to set Items per page to 5', function () {
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
        loginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.goToDocumentList();
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        navigationBarPage.clickLogoutButton();
        loginPage.loginToContentServicesUsingUserModel(acsUser);
    });

    it('[C260067] Should be able to set Items per page to 10', function () {
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
        loginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.goToDocumentList();
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        navigationBarPage.clickLogoutButton();
        loginPage.loginToContentServicesUsingUserModel(acsUser);
        currentPage = 1;
    });

    it('[C260065] Should be able to set Items per page to 15', function () {
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
        loginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.goToDocumentList();
        contentServicesPage.checkAcsContainer();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
    });

    it('[C91320] Pagination should preserve sorting', function () {
        contentServicesPage.goToDocumentList();
        contentServicesPage.navigateToFolder(newFolderModel.name);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(contentServicesPage.getActiveBreadcrumb()).toEqual(newFolderModel.name);
        paginationPage.selectItemsPerPage(itemsPerPage.twenty);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        contentServicesPage.getElementsDisplayedName().then((elements) => {
            contentServicesPage.checkElementsSortedAsc(elements);
        });

        contentServicesPage.sortByName(false);
        contentServicesPage.getElementsDisplayedName().then(function (list) {
            contentServicesPage.checkElementsSortedDesc(list);
        });

        paginationPage.selectItemsPerPage(itemsPerPage.five);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        contentServicesPage.getElementsDisplayedName().then(function (list) {
            contentServicesPage.checkElementsSortedDesc(list);
        });

        paginationPage.clickOnNextPage();
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        contentServicesPage.getElementsDisplayedName().then(function (list) {
            contentServicesPage.checkElementsSortedDesc(list);
        });

        paginationPage.selectItemsPerPage(itemsPerPage.ten);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        contentServicesPage.getElementsDisplayedName().then(function (list) {
            contentServicesPage.checkElementsSortedDesc(list);
        });
    });

    it('[C260107] Should not display pagination bar when a folder is empty', function () {
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

    it('[C260071] Should be able to change pagination when having 25 files', function () {
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
