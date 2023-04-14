/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { createApiService,
    ArrayUtil,
    FileBrowserUtil,
    LocalStorageUtil,
    LoginPage,
    PaginationPage,
    StringUtil,
    UploadActions,
    UserModel,
    UsersActions
} from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../core/pages/content-services.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { FolderModel } from '../../models/ACS/folder.model';
import { browser } from 'protractor';
import { FileModel } from '../../models/ACS/file.model';
import { UploadDialogPage } from '../../core/pages/dialog/upload-dialog.page';

describe('Document List - Pagination', () => {
    const pagination = {
        base: 'newFile',
        secondSetBase: 'secondSet',
        extension: '.txt'
    };

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const paginationPage = new PaginationPage();
    const navigationBarPage = new NavigationBarPage();
    const uploadDialog = new UploadDialogPage();

    const newFolderModel = new FolderModel({ name: 'newFolder' });

    let acsUser: UserModel;
    let fileNames = [];

    let currentPage = 1;
    let secondSetOfFiles = [];

    const nrOfFiles = 20;
    const numberOfFilesAfterUpload = 21;
    const secondSetNumber = 25;
    const folderTwoModel = new FolderModel({ name: 'folderTwo' });
    const folderThreeModel = new FolderModel({ name: 'folderThree' });
    const numberOfSubFolders = 6;

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const uploadActions = new UploadActions(apiService);

    const docxFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.DOCX.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.DOCX.file_location
    });

    beforeAll(async () => {
        fileNames = StringUtil.generateFilesNames(10, nrOfFiles + 9, pagination.base, pagination.extension);
        secondSetOfFiles = StringUtil.generateFilesNames(10, secondSetNumber + 9, pagination.secondSetBase, pagination.extension);

        await apiService.loginWithProfile('admin');
        acsUser = await usersActions.createUser();
        await apiService.login(acsUser.username, acsUser.password);

        const folderThreeUploadedModel = await uploadActions.createFolder(folderThreeModel.name, '-my-');
        const newFolderUploadedModel = await uploadActions.createFolder(newFolderModel.name, '-my-');

        await uploadActions.createEmptyFiles(fileNames, newFolderUploadedModel.entry.id);
        await uploadActions.createEmptyFiles(secondSetOfFiles, folderThreeUploadedModel.entry.id);

        await loginPage.login(acsUser.username, acsUser.password);
    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    beforeEach(async () => {
        await contentServicesPage.goToDocumentList();
    });

    it('[C260062] Should use default pagination settings', async () => {
        await contentServicesPage.openFolder(newFolderModel.name);
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual('20');
        await expect(await paginationPage.getPaginationRange()).toEqual(`Showing 1-${nrOfFiles} of ${nrOfFiles}`);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(nrOfFiles);
        const list = await contentServicesPage.getAllRowsNameColumn();
        await expect(ArrayUtil.arrayContainsArray(list, fileNames)).toEqual(true);
        await paginationPage.checkNextPageButtonIsDisabled();
        await paginationPage.checkPreviousPageButtonIsDisabled();
    });

    it('[C274713] Should be able to set Items per page to 20', async () => {
        await contentServicesPage.openFolder(newFolderModel.name);
        await paginationPage.selectItemsPerPage('20');
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();

        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual('20');
        await expect(await paginationPage.getPaginationRange()).toEqual(`Showing 1-${nrOfFiles} of ${nrOfFiles}`);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(nrOfFiles);
        const list = await contentServicesPage.getAllRowsNameColumn();
        await expect(ArrayUtil.arrayContainsArray(list, fileNames)).toEqual(true);
        await paginationPage.checkNextPageButtonIsDisabled();
        await paginationPage.checkPreviousPageButtonIsDisabled();

        await navigationBarPage.clickLogoutButton();
        await loginPage.login(acsUser.username, acsUser.password);

        await contentServicesPage.goToDocumentList();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual('20');

        await navigationBarPage.clickLogoutButton();
        await loginPage.login(acsUser.username, acsUser.password);
    });

    it('[C260069] Should be able to set Items per page to 5', async () => {
        await contentServicesPage.openFolder(newFolderModel.name);
        await paginationPage.selectItemsPerPage('5');
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();

        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual('5');
        await expect(await paginationPage.getPaginationRange()).toEqual(`Showing 1-${5 * currentPage} of ${nrOfFiles}`);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(5);
        let list = await contentServicesPage.getAllRowsNameColumn();
        await expect(ArrayUtil.arrayContainsArray(list, fileNames.slice(0, 5))).toEqual(true);

        await paginationPage.clickOnNextPage();
        currentPage++;
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();

        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual('5');
        await expect(await paginationPage.getPaginationRange()).toEqual(`Showing 6-${5 * currentPage} of ${nrOfFiles}`);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(5);
        list = await contentServicesPage.getAllRowsNameColumn();
        await expect(ArrayUtil.arrayContainsArray(list, fileNames.slice(5, 10))).toEqual(true);

        await paginationPage.clickOnNextPage();
        currentPage++;
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();

        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual('5');
        await expect(await paginationPage.getPaginationRange()).toEqual(`Showing 11-${5 * currentPage} of ${nrOfFiles}`);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(5);
        list = await contentServicesPage.getAllRowsNameColumn();
        await expect(ArrayUtil.arrayContainsArray(list, fileNames.slice(10, 15))).toEqual(true);

        await paginationPage.clickOnNextPage();
        currentPage++;
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();

        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual('5');
        await expect(await paginationPage.getPaginationRange()).toEqual(`Showing 16-${5 * currentPage} of ${nrOfFiles}`);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(5);
        list = await contentServicesPage.getAllRowsNameColumn();
        await expect(ArrayUtil.arrayContainsArray(list, fileNames.slice(15, 20))).toEqual(true);

        await browser.refresh();
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual('5');
        await navigationBarPage.clickLogoutButton();
        await loginPage.login(acsUser.username, acsUser.password);
    });

    it('[C260067] Should be able to set Items per page to 10', async () => {
        currentPage = 1;
        await contentServicesPage.openFolder(newFolderModel.name);
        await paginationPage.selectItemsPerPage('10');
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();

        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual('10');
        await expect(await paginationPage.getPaginationRange()).toEqual(`Showing 1-${10 * currentPage} of ${nrOfFiles}`);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(10);
        let list = await contentServicesPage.getAllRowsNameColumn();
        await expect(ArrayUtil.arrayContainsArray(list, fileNames.slice(0, 10))).toEqual(true);
        await paginationPage.clickOnNextPage();
        currentPage++;
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual('10');
        await expect(await paginationPage.getPaginationRange()).toEqual(`Showing 11-${10 * currentPage} of ${nrOfFiles}`);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(10);
        list = await contentServicesPage.getAllRowsNameColumn();
        await expect(ArrayUtil.arrayContainsArray(list, fileNames.slice(10, 20))).toEqual(true);

        await browser.refresh();
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();

        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual('10');
        await navigationBarPage.clickLogoutButton();
        await loginPage.login(acsUser.username, acsUser.password);
        currentPage = 1;
    });

    it('[C260065] Should be able to set Items per page to 15', async () => {
        currentPage = 1;
        await contentServicesPage.openFolder(newFolderModel.name);
        await expect(await contentServicesPage.getActiveBreadcrumb()).toEqual(newFolderModel.name);
        await paginationPage.selectItemsPerPage('15');
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();

        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual('15');
        await expect(await paginationPage.getPaginationRange()).toEqual(`Showing 1-${15 * currentPage} of ${nrOfFiles}`);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(15);
        let list = await contentServicesPage.getAllRowsNameColumn();
        await expect(ArrayUtil.arrayContainsArray(list, fileNames.slice(0, 15))).toEqual(true);
        currentPage++;
        await paginationPage.clickOnNextPage();
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();

        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual('15');
        await expect(await paginationPage.getPaginationRange()).toEqual(`Showing 16-${nrOfFiles} of ${nrOfFiles}`);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(nrOfFiles - 15);
        list = await contentServicesPage.getAllRowsNameColumn();
        await expect(ArrayUtil.arrayContainsArray(list, fileNames.slice(15, 20))).toEqual(true);

        await browser.refresh();
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();

        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual('15');
    });

    it('[C91320] Pagination should preserve sorting', async () => {
        await contentServicesPage.openFolder(newFolderModel.name);
        await expect(await contentServicesPage.getActiveBreadcrumb()).toEqual(newFolderModel.name);

        await paginationPage.selectItemsPerPage('20');
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();

        await expect(await contentServicesPage.getDocumentList().dataTablePage().checkListIsSorted('ASC', 'Display name'));

        await contentServicesPage.sortByName('DESC');
        await expect(await contentServicesPage.getDocumentList().dataTablePage().checkListIsSorted('DESC', 'Display name'));

        await paginationPage.selectItemsPerPage('5');
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();

        await expect(await contentServicesPage.getDocumentList().dataTablePage().checkListIsSorted('DESC', 'Display name'));

        await paginationPage.clickOnNextPage();
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();

        await expect(await contentServicesPage.getDocumentList().dataTablePage().checkListIsSorted('DESC', 'Display name'));

        await paginationPage.selectItemsPerPage('10');
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();

        await expect(await contentServicesPage.getDocumentList().dataTablePage().checkListIsSorted('DESC', 'Display name'));
    });

    it('[C260107] Should not display pagination bar when a folder is empty', async () => {
        await paginationPage.selectItemsPerPage('5');
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();

        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual('5');
        await contentServicesPage.openFolder(newFolderModel.name);

        await expect(await contentServicesPage.getActiveBreadcrumb()).toEqual(newFolderModel.name);
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual('5');

        await contentServicesPage.createAndOpenNewFolder(folderTwoModel.name);

        await contentServicesPage.checkPaginationIsNotDisplayed();
        await contentServicesPage.deleteSubFolderUnderRoot(newFolderModel.name, folderTwoModel.name);

    });

    it('[C260071] Should be able to change pagination when having 25 files', async () => {
        currentPage = 1;
        await contentServicesPage.openFolder(folderThreeModel.name);
        await expect(await contentServicesPage.getActiveBreadcrumb()).toEqual(folderThreeModel.name);
        await paginationPage.selectItemsPerPage('15');
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();

        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual('15');
        await expect(await paginationPage.getPaginationRange()).toEqual(`Showing 1-${15 * currentPage} of ${secondSetNumber}`);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(15);
        let list = await contentServicesPage.getAllRowsNameColumn();
        await expect(ArrayUtil.arrayContainsArray(list, secondSetOfFiles.slice(0, 15))).toEqual(true);

        currentPage++;
        await paginationPage.clickOnNextPage();
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual('15');
        await expect(await paginationPage.getPaginationRange()).toEqual(`Showing 16-${secondSetNumber} of ${secondSetNumber}`);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(secondSetNumber - 15);
        list = await contentServicesPage.getAllRowsNameColumn();
        await expect(ArrayUtil.arrayContainsArray(list, secondSetOfFiles.slice(15, 25))).toEqual(true);

        currentPage = 1;
        await paginationPage.selectItemsPerPage('20');
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual('20');
        await expect(await paginationPage.getPaginationRange()).toEqual(`Showing 1-${20 * currentPage} of ${secondSetNumber}`);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(20);
        list = await contentServicesPage.getAllRowsNameColumn();
        await expect(ArrayUtil.arrayContainsArray(list, secondSetOfFiles.slice(0, 20))).toEqual(true);

        currentPage++;
        await paginationPage.clickOnNextPage();
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual('20');
        await expect(await paginationPage.getPaginationRange()).toEqual(`Showing 21-${secondSetNumber} of ${secondSetNumber}`);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(secondSetNumber - 20);
        list = await contentServicesPage.getAllRowsNameColumn();
        await expect(ArrayUtil.arrayContainsArray(list, secondSetOfFiles.slice(20, 25))).toEqual(true);
    });

    it('[C216321] Should be able to modify the supported page size value', async () => {
        await paginationPage.clickItemsPerPageDropdown();
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();

        await expect(await paginationPage.getItemsPerPageDropdownOptions()).toEqual(['5', '10', '15', '20']);

        await LocalStorageUtil.setUserPreference('supportedPageSizes', JSON.stringify([5, 10, 15, 21]));
        await contentServicesPage.goToDocumentList();
        await browser.refresh();
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();

        await contentServicesPage.openFolder(newFolderModel.name);
        await contentServicesPage.uploadFile(docxFileModel.location);
        await contentServicesPage.checkContentIsDisplayed(docxFileModel.name);
        await uploadDialog.clickOnCloseButton();
        await uploadDialog.dialogIsNotDisplayed();

        await paginationPage.clickItemsPerPageDropdown();
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();

        await expect(await paginationPage.getItemsPerPageDropdownOptions()).toEqual(['5', '10', '15', '21']);

        await paginationPage.clickItemsPerPageDropdown();
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();

        await paginationPage.selectItemsPerPage('21');
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();

        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual('21');
        await browser.refresh();

        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();
        await expect(await paginationPage.getPaginationRange()).toEqual(`Showing 1-21 of ${numberOfFilesAfterUpload}`);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(21);

        await LocalStorageUtil.setUserPreference('supportedPageSizes', JSON.stringify([5, 10, 15, 20]));
        await browser.refresh();

        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();
        await paginationPage.clickItemsPerPageDropdown();
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();

        await expect(await paginationPage.getItemsPerPageDropdownOptions()).toEqual(['5', '10', '15', '20']);
    });

    it('[C272767] Should propagate the option chosen regarding displaying items per page to files/folders inside a folder', async () => {
        await paginationPage.selectItemsPerPage('5');
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();

        await contentServicesPage.openFolder(newFolderModel.name);
        await expect(await contentServicesPage.getActiveBreadcrumb()).toEqual(newFolderModel.name);
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual('5');

        await apiService.login(acsUser.username, acsUser.password);
        await contentServicesPage.createNewFolder(folderTwoModel.name);
        const nodeIdSubFolderTwo = await contentServicesPage.getAttributeValueForElement(folderTwoModel.name, 'Node id');
        await contentServicesPage.openFolder(folderTwoModel.name);

        for (let i = 0; i < numberOfSubFolders; i++) {
            await uploadActions.createFolder('subfolder' + (i + 1), nodeIdSubFolderTwo);
        }
        await browser.refresh();
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();

        await expect(await paginationPage.getPaginationRange()).toEqual(`Showing 1-5 of ${numberOfSubFolders}`);

        await paginationPage.clickOnNextPage();
        await expect(await paginationPage.getPaginationRange()).toEqual(`Showing 6-${numberOfSubFolders} of ${numberOfSubFolders}`);
        const nodeIdSubFolder6 = await contentServicesPage.getAttributeValueForElement('subfolder6', 'Node id');

        for (let i = 0; i < numberOfSubFolders; i++) {
            await uploadActions.createFolder('subfolder' + (i + 1), nodeIdSubFolder6);
        }
        await browser.refresh();
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();

        await expect(await paginationPage.getPaginationRange()).toEqual(`Showing 1-5 of ${numberOfSubFolders}`);
        await expect(await paginationPage.getCurrentPage()).toEqual('Page 1');
        await expect(await paginationPage.getTotalPages()).toEqual('of 2');

        await contentServicesPage.deleteSubFolderUnderRoot(newFolderModel.name, folderTwoModel.name);
    });

    it('[C260064] Should download only the last selection when changing pages in Single mode', async () => {
        await paginationPage.selectItemsPerPage('5');
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();

        await contentServicesPage.openFolder(newFolderModel.name);
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual('5');

        await contentServicesPage.createNewFolder(folderTwoModel.name);
        const nodeIdSubFolderTwo = await contentServicesPage.getAttributeValueForElement(folderTwoModel.name, 'Node id');
        await contentServicesPage.openFolder(folderTwoModel.name);

        await apiService.login(acsUser.username, acsUser.password);
        for (let i = 0; i < numberOfSubFolders; i++) {
            await uploadActions.createFolder('subfolder' + (i + 1), nodeIdSubFolderTwo);
        }

        await browser.refresh();
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();

        await expect(await paginationPage.getPaginationRange()).toEqual(`Showing 1-5 of ${numberOfSubFolders}`);

        await contentServicesPage.chooseSelectionMode('Single');

        await contentServicesPage.selectFolder('subfolder1');
        await paginationPage.clickOnNextPage();
        await expect(await paginationPage.getPaginationRange()).toEqual(`Showing 6-${numberOfSubFolders} of ${numberOfSubFolders}`);
        await contentServicesPage.selectFolderWithCommandKey('subfolder6');
        await contentServicesPage.clickDownloadButton();

        await FileBrowserUtil.isFileDownloaded('subfolder6.zip');

        await contentServicesPage.deleteSubFolderUnderRoot(newFolderModel.name, folderTwoModel.name);
    });

});
