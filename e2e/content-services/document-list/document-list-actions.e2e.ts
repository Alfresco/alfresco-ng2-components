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

import { browser, by, element } from 'protractor';
import {
    LoginPage,
    PaginationPage,
    UploadActions,
    StringUtil,
    ContentNodeSelectorDialogPage
} from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import resources = require('../../util/resources');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { FileModel } from '../../models/ACS/fileModel';
import { Util } from '../../util/util';
import { BreadCrumbDropdownPage } from '../../pages/adf/content-services/breadcrumb/breadCrumbDropdownPage';
import { BreadCrumbPage } from '../../pages/adf/content-services/breadcrumb/breadCrumbPage';
import { InfinitePaginationPage } from '../../pages/adf/core/infinitePaginationPage';
import { FolderModel } from '../../models/ACS/folderModel';

describe('Document List Component - Actions', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const navigationBarPage = new NavigationBarPage();
    const contentListPage = contentServicesPage.getDocumentList();
    const contentNodeSelector = new ContentNodeSelectorDialogPage();
    const paginationPage = new PaginationPage();
    const breadCrumbDropdownPage = new BreadCrumbDropdownPage();
    const breadCrumbPage = new BreadCrumbPage();
    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);
    const infinitePaginationPage = new InfinitePaginationPage(element(by.css('adf-content-node-selector')));

    describe('Document List Component - Check Actions', () => {

        let uploadedFolder, secondUploadedFolder;
        let acsUser = null;
        let pdfUploadedNode;
        let folderName;
        let fileNames = [];
        const nrOfFiles = 5;

        const pdfFileModel = new FileModel({
            name: resources.Files.ADF_DOCUMENTS.PDF.file_name,
            location: resources.Files.ADF_DOCUMENTS.PDF.file_location
        });
        const testFileModel = new FileModel({
            name: resources.Files.ADF_DOCUMENTS.TEST.file_name,
            location: resources.Files.ADF_DOCUMENTS.TEST.file_location
        });

        const files = {
            base: 'newFile',
            extension: '.txt'
        };

        beforeAll(async () => {
            acsUser = new AcsUserModel();
            folderName = `TATSUMAKY_${StringUtil.generateRandomString(5)}_SENPOUKYAKU`;
            await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
            await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            pdfUploadedNode = await uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, '-my-');
            await uploadActions.uploadFile(testFileModel.location, testFileModel.name, '-my-');
            uploadedFolder = await uploadActions.createFolder(folderName, '-my-');
            secondUploadedFolder = await uploadActions.createFolder('secondFolder', '-my-');

            fileNames = Util.generateSequenceFiles(1, nrOfFiles, files.base, files.extension);
            await uploadActions.createEmptyFiles(fileNames, uploadedFolder.entry.id);

            await loginPage.loginToContentServicesUsingUserModel(acsUser);

            await browser.sleep(10000);

        });

        afterAll(async () => {
            await navigationBarPage.clickLogoutButton();
        });

        beforeEach(async () => {
            await navigationBarPage.clickContentServicesButton();

        });

        describe('File Actions', () => {

            it('[C213257] Should be able to copy a file', async () => {
                await contentServicesPage.checkContentIsDisplayed(pdfUploadedNode.entry.name);
                await contentServicesPage.getDocumentList().rightClickOnRow(pdfFileModel.name);
                await contentServicesPage.pressContextMenuActionNamed('Copy');
                await contentNodeSelector.checkDialogIsDisplayed();
                await contentNodeSelector.typeIntoNodeSelectorSearchField(folderName);
                await contentNodeSelector.clickContentNodeSelectorResult(folderName);
                await contentNodeSelector.clickMoveCopyButton();
                await contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);
                await contentServicesPage.doubleClickRow(uploadedFolder.entry.name);
                await contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);
            });

            it('[C260131] Copy - Destination picker search', async () => {
                await contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);
                await contentServicesPage.getDocumentList().rightClickOnRow(pdfFileModel.name);
                await contentServicesPage.pressContextMenuActionNamed('Copy');
                await contentNodeSelector.checkDialogIsDisplayed();
                await contentNodeSelector.typeIntoNodeSelectorSearchField(folderName);
                await contentNodeSelector.contentListPage().dataTablePage().checkCellByHighlightContent(folderName);
                await contentNodeSelector.clickCancelButton();
                await contentNodeSelector.checkDialogIsNotDisplayed();
            });

            it('[C297491] Should be able to move a file', async () => {
                await contentServicesPage.checkContentIsDisplayed(testFileModel.name);

                await contentServicesPage.getDocumentList().rightClickOnRow(testFileModel.name);
                await contentServicesPage.pressContextMenuActionNamed('Move');
                await contentNodeSelector.checkDialogIsDisplayed();
                await contentNodeSelector.typeIntoNodeSelectorSearchField(folderName);
                await contentNodeSelector.clickContentNodeSelectorResult(folderName);
                await contentNodeSelector.clickMoveCopyButton();
                await contentServicesPage.checkContentIsNotDisplayed(testFileModel.name);
                await contentServicesPage.doubleClickRow(uploadedFolder.entry.name);
                await contentServicesPage.checkContentIsDisplayed(testFileModel.name);
            });

            it('[C260127] Move - Destination picker search', async () => {
                await contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);
                await contentServicesPage.getDocumentList().rightClickOnRow(pdfFileModel.name);
                await contentServicesPage.pressContextMenuActionNamed('Move');
                await contentNodeSelector.checkDialogIsDisplayed();
                await contentNodeSelector.typeIntoNodeSelectorSearchField(folderName);
                await contentNodeSelector.contentListPage().dataTablePage().checkCellByHighlightContent(folderName);
                await contentNodeSelector.clickCancelButton();
                await contentNodeSelector.checkDialogIsNotDisplayed();
            });

            it('[C280561] Should be able to delete a file via dropdown menu', async () => {
                await contentServicesPage.doubleClickRow(uploadedFolder.entry.name);

                await contentServicesPage.checkContentIsDisplayed(fileNames[0]);
                await contentServicesPage.deleteContent(fileNames[0]);
                await contentServicesPage.checkContentIsNotDisplayed(fileNames[0]);
            });

            it('[C280562] Only one file is deleted when multiple files are selected using dropdown menu', async () => {
                await contentServicesPage.doubleClickRow(uploadedFolder.entry.name);

                await contentServicesPage.getDocumentList().selectRow(fileNames[1]);
                await contentServicesPage.getDocumentList().selectRow(fileNames[2]);
                await contentServicesPage.deleteContent(fileNames[1]);
                await contentServicesPage.checkContentIsNotDisplayed(fileNames[1]);
                await contentServicesPage.checkContentIsDisplayed(fileNames[2]);
            });

            it('[C280565] Should be able to delete a file using context menu', async () => {
                await contentServicesPage.doubleClickRow(uploadedFolder.entry.name);
                await contentServicesPage.checkContentIsDisplayed(fileNames[2]);
                await contentServicesPage.getDocumentList().rightClickOnRow(fileNames[2]);
                await contentServicesPage.pressContextMenuActionNamed('Delete');
                await contentServicesPage.checkContentIsNotDisplayed(fileNames[2]);
            });

            it('[C280567] Only one file is deleted when multiple files are selected using context menu', async () => {
                await contentServicesPage.doubleClickRow(uploadedFolder.entry.name);

                await contentServicesPage.getDocumentList().selectRow(fileNames[3]);
                await contentServicesPage.getDocumentList().selectRow(fileNames[4]);
                await contentServicesPage.getDocumentList().rightClickOnRow(fileNames[3]);
                await contentServicesPage.pressContextMenuActionNamed('Delete');
                await contentServicesPage.checkContentIsNotDisplayed(fileNames[3]);
                await contentServicesPage.checkContentIsDisplayed(fileNames[4]);
            });

            it('[C280566] Should be able to open context menu with right click', async () => {
                await contentServicesPage.getDocumentList().rightClickOnRow(pdfFileModel.name);
                await contentServicesPage.checkContextActionIsVisible('Download');
                await contentServicesPage.checkContextActionIsVisible('Copy');
                await contentServicesPage.checkContextActionIsVisible('Move');
                await contentServicesPage.checkContextActionIsVisible('Delete');
                await contentServicesPage.checkContextActionIsVisible('Info');
                await contentServicesPage.checkContextActionIsVisible('Manage versions');
                await contentServicesPage.checkContextActionIsVisible('Permission');
                await contentServicesPage.checkContextActionIsVisible('Lock');
                await contentServicesPage.closeActionContext();
            });

        });

        describe('Folder Actions', () => {

            it('[C260138] Should be able to copy a folder', async () => {
                await contentServicesPage.copyContent(folderName);
                await contentNodeSelector.checkDialogIsDisplayed();
                await contentNodeSelector.typeIntoNodeSelectorSearchField(secondUploadedFolder.entry.name);
                await contentNodeSelector.clickContentNodeSelectorResult(secondUploadedFolder.entry.name);
                await contentNodeSelector.clickMoveCopyButton();
                await contentServicesPage.checkContentIsDisplayed(folderName);
                await contentServicesPage.doubleClickRow(secondUploadedFolder.entry.name);
                await contentServicesPage.checkContentIsDisplayed(folderName);
            });

            it('[C260123] Should be able to delete a folder using context menu', async () => {
                await contentServicesPage.deleteContent(folderName);
                await contentServicesPage.checkContentIsNotDisplayed(folderName);
            });

            it('[C280568] Should be able to open context menu with right click', async () => {
                await contentServicesPage.checkContentIsDisplayed(secondUploadedFolder.entry.name);

                await contentServicesPage.getDocumentList().rightClickOnRow(secondUploadedFolder.entry.name);
                await contentServicesPage.checkContextActionIsVisible('Download');
                await contentServicesPage.checkContextActionIsVisible('Copy');
                await contentServicesPage.checkContextActionIsVisible('Move');
                await contentServicesPage.checkContextActionIsVisible('Delete');
                await contentServicesPage.checkContextActionIsVisible('Info');
                await contentServicesPage.checkContextActionIsVisible('Permission');
            });

        });
    });

    describe('Folder Actions - Copy and Move', () => {

        const folderModel1 = new FolderModel({ name: StringUtil.generateRandomString() });
        const folderModel2 = new FolderModel({ name: StringUtil.generateRandomString() });
        const folderModel3 = new FolderModel({ name: StringUtil.generateRandomString() });
        const folderModel4 = new FolderModel({ name: StringUtil.generateRandomString() });
        const folderModel5 = new FolderModel({ name: StringUtil.generateRandomString() });
        const folderModel6 = new FolderModel({ name: StringUtil.generateRandomString() });

        let folder1, folder2, folder3, folder4, folder5, folder6;

        let folders;
        const contentServicesUser = new AcsUserModel();

        beforeAll(async () => {

            await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
            await this.alfrescoJsApi.core.peopleApi.addPerson(contentServicesUser);
            await this.alfrescoJsApi.login(contentServicesUser.id, contentServicesUser.password);
            folder1 = await uploadActions.createFolder('A' + folderModel1.name, '-my-');
            folder2 = await uploadActions.createFolder('B' + folderModel2.name, '-my-');
            folder3 = await uploadActions.createFolder('C' + folderModel3.name, '-my-');
            folder4 = await uploadActions.createFolder('D' + folderModel4.name, '-my-');
            folder5 = await uploadActions.createFolder('E' + folderModel5.name, '-my-');
            folder6 = await uploadActions.createFolder('F' + folderModel6.name, '-my-');
            folders = [folder1, folder2, folder3, folder4, folder5, folder6];

        });

        beforeEach(async () => {
            await loginPage.loginToContentServicesUsingUserModel(contentServicesUser);
            await contentServicesPage.goToDocumentList();
            await contentServicesPage.waitForTableBody();
            await paginationPage.selectItemsPerPage('5');
            await contentServicesPage.checkAcsContainer();
            await contentListPage.waitForTableBody();

        });

        afterAll(async () => {
            await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
            for (const folder of folders) {
                await uploadActions.deleteFileOrFolder(folder.entry.id);
            }

        });

        it('[C260132] Move action on folder with - Load more', async () => {
            await expect(await paginationPage.getCurrentItemsPerPage()).toEqual('5');
            await expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + 5 + ' of ' + 6);
            await contentServicesPage.getDocumentList().rightClickOnRow('A' + folderModel1.name);
            await contentServicesPage.checkContextActionIsVisible('Move');
            await contentServicesPage.pressContextMenuActionNamed('Move');
            await contentNodeSelector.checkDialogIsDisplayed();
            await expect(await contentNodeSelector.getDialogHeaderText()).toBe('Move \'' + 'A' + folderModel1.name + '\' to...');
            await contentNodeSelector.checkSearchInputIsDisplayed();
            await expect(await contentNodeSelector.getSearchLabel()).toBe('Search');
            await contentNodeSelector.checkSelectedSiteIsDisplayed('My files');
            await contentNodeSelector.checkCancelButtonIsDisplayed();
            await contentNodeSelector.checkMoveCopyButtonIsDisplayed();
            await expect(await contentNodeSelector.getMoveCopyButtonText()).toBe('MOVE');
            await expect(await contentNodeSelector.numberOfResultsDisplayed()).toBe(5);
            await infinitePaginationPage.clickLoadMoreButton();
            await expect(await contentNodeSelector.numberOfResultsDisplayed()).toBe(6);
            await infinitePaginationPage.checkLoadMoreButtonIsNotDisplayed();
            await contentNodeSelector.contentListPage().dataTablePage().selectRowByContent('F' + folderModel6.name);
            await contentNodeSelector.contentListPage().dataTablePage().checkRowByContentIsSelected('F' + folderModel6.name);
            await contentNodeSelector.clickCancelButton();
            await contentNodeSelector.checkDialogIsNotDisplayed();
            await contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name);

            await contentServicesPage.getDocumentList().rightClickOnRow('A' + folderModel1.name);
            await contentServicesPage.checkContextActionIsVisible('Move');
            await contentServicesPage.pressContextMenuActionNamed('Move');
            await contentNodeSelector.checkDialogIsDisplayed();
            await infinitePaginationPage.clickLoadMoreButton();
            await contentNodeSelector.contentListPage().dataTablePage().selectRowByContent('F' + folderModel6.name);
            await contentNodeSelector.contentListPage().dataTablePage().checkRowByContentIsSelected('F' + folderModel6.name);
            await contentNodeSelector.clickMoveCopyButton();
            await contentServicesPage.checkContentIsNotDisplayed('A' + folderModel1.name);
            await contentServicesPage.doubleClickRow('F' + folderModel6.name);
            await contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name);

            await contentServicesPage.getDocumentList().rightClickOnRow('A' + folderModel1.name);
            await contentServicesPage.checkContextActionIsVisible('Move');
            await contentServicesPage.pressContextMenuActionNamed('Move');
            await contentNodeSelector.checkDialogIsDisplayed();
            await breadCrumbDropdownPage.clickParentFolder();
            await breadCrumbDropdownPage.checkBreadCrumbDropdownIsDisplayed();
            await breadCrumbDropdownPage.choosePath(contentServicesUser.id);
            await contentNodeSelector.clickMoveCopyButton();
            await contentServicesPage.checkContentIsNotDisplayed('A' + folderModel1.name);

            await breadCrumbPage.chooseBreadCrumb(contentServicesUser.id);
            await contentServicesPage.waitForTableBody();
            await contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name);

        });

        it('[C305051] Copy action on folder with - Load more', async () => {

            await expect(await paginationPage.getCurrentItemsPerPage()).toEqual('5');
            await expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + 5 + ' of ' + 6);
            await contentServicesPage.getDocumentList().rightClickOnRow('A' + folderModel1.name);
            await contentServicesPage.checkContextActionIsVisible('Copy');
            await contentServicesPage.pressContextMenuActionNamed('Copy');
            await contentNodeSelector.checkDialogIsDisplayed();
            await expect(await contentNodeSelector.getDialogHeaderText()).toBe('Copy \'' + 'A' + folderModel1.name + '\' to...');
            await contentNodeSelector.checkSearchInputIsDisplayed();
            await expect(await contentNodeSelector.getSearchLabel()).toBe('Search');
            await contentNodeSelector.checkSelectedSiteIsDisplayed('My files');
            await contentNodeSelector.checkCancelButtonIsDisplayed();
            await contentNodeSelector.checkMoveCopyButtonIsDisplayed();
            await expect(await contentNodeSelector.getMoveCopyButtonText()).toBe('COPY');
            await expect(await contentNodeSelector.numberOfResultsDisplayed()).toBe(5);
            await infinitePaginationPage.clickLoadMoreButton();
            await expect(await contentNodeSelector.numberOfResultsDisplayed()).toBe(6);
            await infinitePaginationPage.checkLoadMoreButtonIsNotDisplayed();
            await contentNodeSelector.contentListPage().dataTablePage().selectRowByContent('F' + folderModel6.name);
            await contentNodeSelector.contentListPage().dataTablePage().checkRowByContentIsSelected('F' + folderModel6.name);
            await contentNodeSelector.clickCancelButton();
            await contentNodeSelector.checkDialogIsNotDisplayed();
            await contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name);

            await contentServicesPage.getDocumentList().rightClickOnRow('A' + folderModel1.name);
            await contentServicesPage.checkContextActionIsVisible('Copy');
            await contentServicesPage.pressContextMenuActionNamed('Copy');
            await contentNodeSelector.checkDialogIsDisplayed();
            await infinitePaginationPage.clickLoadMoreButton();
            await contentNodeSelector.contentListPage().dataTablePage().selectRowByContent('F' + folderModel6.name);
            await contentNodeSelector.contentListPage().dataTablePage().checkRowByContentIsSelected('F' + folderModel6.name);
            await contentNodeSelector.clickMoveCopyButton();
            await contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name);
            await paginationPage.clickOnNextPage();
            await contentServicesPage.getDocumentList().waitForTableBody();
            await contentServicesPage.doubleClickRow('F' + folderModel6.name);
            await contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name);

        });

    });
});
