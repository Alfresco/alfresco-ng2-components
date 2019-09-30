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

import { LoginPage, UploadActions, PaginationPage } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FolderModel } from '../../models/ACS/folderModel';
import { Util } from '../../util/util';
import { browser } from 'protractor';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';

describe('Document List - Pagination', () => {
    const pagination = {
        base: 'newFile',
        secondSetBase: 'secondSet',
        extension: '.txt'
    };

    const itemsPerPage = {
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

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const paginationPage = new PaginationPage();
    const navigationBarPage = new NavigationBarPage();

    const acsUser = new AcsUserModel();
    const newFolderModel = new FolderModel({ name: 'newFolder' });
    let fileNames = [];
    const nrOfFiles = 20;
    let currentPage = 1;
    let secondSetOfFiles = [];
    const secondSetNumber = 25;
    const folderTwoModel = new FolderModel({ name: 'folderTwo' });
    const folderThreeModel = new FolderModel({ name: 'folderThree' });
    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);

    beforeAll(async () => {
        fileNames = Util.generateSequenceFiles(10, nrOfFiles + 9, pagination.base, pagination.extension);
        secondSetOfFiles = Util.generateSequenceFiles(10, secondSetNumber + 9, pagination.secondSetBase, pagination.extension);

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        const folderThreeUploadedModel = await uploadActions.createFolder(folderThreeModel.name, '-my-');
        const newFolderUploadedModel = await uploadActions.createFolder(newFolderModel.name, '-my-');

        await uploadActions.createEmptyFiles(fileNames, newFolderUploadedModel.entry.id);

        await uploadActions.createEmptyFiles(secondSetOfFiles, folderThreeUploadedModel.entry.id);

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    beforeEach(async () => {
        await contentServicesPage.goToDocumentList();
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();

    });

    it('[C260062] Should use default pagination settings', async () => {
        await contentServicesPage.doubleClickRow(newFolderModel.name);
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.twenty);
        await expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + nrOfFiles + ' of ' + nrOfFiles);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(nrOfFiles);
        const list = await contentServicesPage.getAllRowsNameColumn();
        await expect(Util.arrayContainsArray(list, fileNames)).toEqual(true);
        await paginationPage.checkNextPageButtonIsDisabled();
        await paginationPage.checkPreviousPageButtonIsDisabled();
    });

    it('[C274713] Should be able to set Items per page to 20', async () => {
        await contentServicesPage.doubleClickRow(newFolderModel.name);
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();
        await paginationPage.selectItemsPerPage(itemsPerPage.twenty);
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.twenty);
        await expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + nrOfFiles + ' of ' + nrOfFiles);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(nrOfFiles);
        const list = await contentServicesPage.getAllRowsNameColumn();
        await expect(Util.arrayContainsArray(list, fileNames)).toEqual(true);
        await paginationPage.checkNextPageButtonIsDisabled();
        await paginationPage.checkPreviousPageButtonIsDisabled();

        await navigationBarPage.clickLogoutButton();
        await loginPage.loginToContentServicesUsingUserModel(acsUser);
        await contentServicesPage.goToDocumentList();
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.twenty);
        await navigationBarPage.clickLogoutButton();
        await loginPage.loginToContentServicesUsingUserModel(acsUser);
    });

    it('[C260069] Should be able to set Items per page to 5', async () => {
        await contentServicesPage.doubleClickRow(newFolderModel.name);
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();
        await paginationPage.selectItemsPerPage(itemsPerPage.five);
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        await expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfFiles);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(itemsPerPage.fiveValue);
        let list = await contentServicesPage.getAllRowsNameColumn();
        await expect(Util.arrayContainsArray(list, fileNames.slice(0, 5))).toEqual(true);
        await paginationPage.clickOnNextPage();
        currentPage++;
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        await expect(await paginationPage.getPaginationRange()).toEqual('Showing 6-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfFiles);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(itemsPerPage.fiveValue);
        list = await contentServicesPage.getAllRowsNameColumn();
        await expect(Util.arrayContainsArray(list, fileNames.slice(5, 10))).toEqual(true);
        await paginationPage.clickOnNextPage();
        currentPage++;
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        await expect(await paginationPage.getPaginationRange()).toEqual('Showing 11-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfFiles);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(itemsPerPage.fiveValue);
        list = await contentServicesPage.getAllRowsNameColumn();
        await expect(Util.arrayContainsArray(list, fileNames.slice(10, 15))).toEqual(true);
        await paginationPage.clickOnNextPage();
        currentPage++;
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        await expect(await paginationPage.getPaginationRange()).toEqual('Showing 16-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfFiles);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(itemsPerPage.fiveValue);
        list = await contentServicesPage.getAllRowsNameColumn();
        await expect(Util.arrayContainsArray(list, fileNames.slice(15, 20))).toEqual(true);

        await browser.refresh();
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        await navigationBarPage.clickLogoutButton();
        await loginPage.loginToContentServicesUsingUserModel(acsUser);
    });

    it('[C260067] Should be able to set Items per page to 10', async () => {
        currentPage = 1;
        await contentServicesPage.doubleClickRow(newFolderModel.name);
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();
        await paginationPage.selectItemsPerPage(itemsPerPage.ten);
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        await expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.tenValue * currentPage + ' of ' + nrOfFiles);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(itemsPerPage.tenValue);
        let list = await contentServicesPage.getAllRowsNameColumn();
        await expect(Util.arrayContainsArray(list, fileNames.slice(0, 10))).toEqual(true);
        await paginationPage.clickOnNextPage();
        currentPage++;
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        await expect(await paginationPage.getPaginationRange()).toEqual('Showing 11-' + itemsPerPage.tenValue * currentPage + ' of ' + nrOfFiles);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(itemsPerPage.tenValue);
        list = await contentServicesPage.getAllRowsNameColumn();
        await expect(Util.arrayContainsArray(list, fileNames.slice(10, 20))).toEqual(true);

        await browser.refresh();
        await contentServicesPage.waitForTableBody();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        await navigationBarPage.clickLogoutButton();
        await loginPage.loginToContentServicesUsingUserModel(acsUser);
        currentPage = 1;
    });

    it('[C260065] Should be able to set Items per page to 15', async () => {
        currentPage = 1;
        await contentServicesPage.doubleClickRow(newFolderModel.name);
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();
        await expect(await contentServicesPage.getActiveBreadcrumb()).toEqual(newFolderModel.name);
        await paginationPage.selectItemsPerPage(itemsPerPage.fifteen);
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        await expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.fifteenValue * currentPage + ' of ' + nrOfFiles);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(itemsPerPage.fifteenValue);
        let list = await contentServicesPage.getAllRowsNameColumn();
        await expect(Util.arrayContainsArray(list, fileNames.slice(0, 15))).toEqual(true);
        currentPage++;
        await paginationPage.clickOnNextPage();
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        await expect(await paginationPage.getPaginationRange()).toEqual('Showing 16-' + nrOfFiles + ' of ' + nrOfFiles);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(nrOfFiles - itemsPerPage.fifteenValue);
        list = await contentServicesPage.getAllRowsNameColumn();
        await expect(Util.arrayContainsArray(list, fileNames.slice(15, 20))).toEqual(true);

        await browser.refresh();
        await contentServicesPage.waitForTableBody();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
    });

    it('[C91320] Pagination should preserve sorting', async () => {
        await contentServicesPage.doubleClickRow(newFolderModel.name);
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();
        await expect(await contentServicesPage.getActiveBreadcrumb()).toEqual(newFolderModel.name);
        await paginationPage.selectItemsPerPage(itemsPerPage.twenty);
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();

        await expect(await contentServicesPage.getDocumentList().dataTablePage().checkListIsSorted('ASC', 'Display name'));

        await contentServicesPage.sortByName('DESC');
        await expect(await contentServicesPage.getDocumentList().dataTablePage().checkListIsSorted('DESC', 'Display name'));

        await paginationPage.selectItemsPerPage(itemsPerPage.five);
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();
        await expect(await contentServicesPage.getDocumentList().dataTablePage().checkListIsSorted('DESC', 'Display name'));

        await paginationPage.clickOnNextPage();
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();
        await expect(await contentServicesPage.getDocumentList().dataTablePage().checkListIsSorted('DESC', 'Display name'));

        await paginationPage.selectItemsPerPage(itemsPerPage.ten);
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();
        await expect(await contentServicesPage.getDocumentList().dataTablePage().checkListIsSorted('DESC', 'Display name'));
    });

    it('[C260107] Should not display pagination bar when a folder is empty', async () => {
        await paginationPage.selectItemsPerPage(itemsPerPage.five);
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        await contentServicesPage.doubleClickRow(newFolderModel.name);
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();
        await expect(await contentServicesPage.getActiveBreadcrumb()).toEqual(newFolderModel.name);
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        await contentServicesPage.createNewFolder(folderTwoModel.name);
        await contentServicesPage.checkContentIsDisplayed(folderTwoModel.name);
        await contentServicesPage.doubleClickRow(folderTwoModel.name);
        await contentServicesPage.checkPaginationIsNotDisplayed();
    });

    it('[C260071] Should be able to change pagination when having 25 files', async () => {
        currentPage = 1;
        await contentServicesPage.doubleClickRow(folderThreeModel.name);
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();
        await expect(await contentServicesPage.getActiveBreadcrumb()).toEqual(folderThreeModel.name);
        await paginationPage.selectItemsPerPage(itemsPerPage.fifteen);
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        await expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.fifteenValue * currentPage + ' of ' + secondSetNumber);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(itemsPerPage.fifteenValue);
        let list = await contentServicesPage.getAllRowsNameColumn();
        await expect(Util.arrayContainsArray(list, secondSetOfFiles.slice(0, 15))).toEqual(true);

        currentPage++;
        await paginationPage.clickOnNextPage();
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        await expect(await paginationPage.getPaginationRange()).toEqual('Showing 16-' + secondSetNumber + ' of ' + secondSetNumber);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(secondSetNumber - itemsPerPage.fifteenValue);
        list = await contentServicesPage.getAllRowsNameColumn();
        await expect(Util.arrayContainsArray(list, secondSetOfFiles.slice(15, 25))).toEqual(true);

        currentPage = 1;
        await paginationPage.selectItemsPerPage(itemsPerPage.twenty);
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.twenty);
        await expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.twentyValue * currentPage + ' of ' + secondSetNumber);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(itemsPerPage.twentyValue);
        list = await contentServicesPage.getAllRowsNameColumn();
        await expect(Util.arrayContainsArray(list, secondSetOfFiles.slice(0, 20))).toEqual(true);

        currentPage++;
        await paginationPage.clickOnNextPage();
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.waitForTableBody();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.twenty);
        await expect(await paginationPage.getPaginationRange()).toEqual('Showing 21-' + secondSetNumber + ' of ' + secondSetNumber);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(secondSetNumber - itemsPerPage.twentyValue);
        list = await contentServicesPage.getAllRowsNameColumn();
        await expect(Util.arrayContainsArray(list, secondSetOfFiles.slice(20, 25))).toEqual(true);
    });
});
