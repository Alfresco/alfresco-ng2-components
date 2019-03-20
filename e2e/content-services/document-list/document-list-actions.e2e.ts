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
import { LoginPage } from '../../pages/adf/loginPage';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import TestConfig = require('../../test.config');
import resources = require('../../util/resources');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '../../actions/ACS/upload.actions';
import { FileModel } from '../../models/ACS/fileModel';
import { Util } from '../../util/util';
import { FolderModel } from '../../models/ACS/folderModel';
import { PaginationPage } from '../../pages/adf/paginationPage';
import { CopyMoveDialog } from '../../pages/adf/dialog/copyMoveDialog';
import { NotificationPage } from '../../pages/adf/notificationPage';
import { BreadCrumbPage } from '../../pages/adf/content-services/breadcrumb/breadCrumbPage';
import { BreadCrumbDropdownPage } from '../../pages/adf/content-services/breadcrumb/breadCrumbDropdownPage';

describe('Document List Component - Actions', () => {

    let loginPage = new LoginPage();
    let contentServicesPage = new ContentServicesPage();
    let contentListPage = contentServicesPage.getDocumentList();
    let uploadedFolder, secondUploadedFolder;
    let uploadActions = new UploadActions();
    let paginationPage = new PaginationPage();
    let copyMoveDialog = new CopyMoveDialog();
    let notificationPage = new NotificationPage();
    let breadCrumbDropdownPage = new BreadCrumbDropdownPage();
    let breadCrumbPage = new BreadCrumbPage();
    let acsUser;
    let testFileNode;

    let pdfFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF.file_location
    });
    let testFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TEST.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
    });

    let alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: TestConfig.adf.url

    });

    describe('File Actions', () => {

        let pdfUploadedNode;
        let folderName;

        beforeEach(async (done) => {
            acsUser = new AcsUserModel();
            folderName = `TATSUMAKY_${Util.generateRandomString(5)}_SENPOUKYAKU`;
            await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            await alfrescoJsApi.core.peopleApi.addPerson(acsUser);
            await alfrescoJsApi.login(acsUser.id, acsUser.password);
            pdfUploadedNode = await uploadActions.uploadFile(alfrescoJsApi, pdfFileModel.location, pdfFileModel.name, '-my-');
            testFileNode = await uploadActions.uploadFile(alfrescoJsApi, testFileModel.location, testFileModel.name, '-my-');
            uploadedFolder = await uploadActions.createFolder(alfrescoJsApi, folderName, '-my-');

            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            done();
        });

        afterEach(async (done) => {
            try {
                await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
                await uploadActions.deleteFilesOrFolder(alfrescoJsApi, pdfUploadedNode.entry.id);
                await uploadActions.deleteFilesOrFolder(alfrescoJsApi, testFileNode.entry.id);
                await uploadActions.deleteFilesOrFolder(alfrescoJsApi, uploadedFolder.entry.id);
            } catch (error) {
            }
            done();
        });

        it('[C213257] Should be able to copy a file', () => {
            browser.driver.sleep(15000);

            contentListPage.rightClickOnRow(pdfUploadedNode.entry.name);
            contentServicesPage.pressContextMenuActionNamed('Copy');
            contentServicesPage.typeIntoNodeSelectorSearchField(folderName);
            contentServicesPage.clickContentNodeSelectorResult(folderName);
            contentServicesPage.clickCopyButton();
            contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);
            contentServicesPage.doubleClickRow(uploadedFolder.entry.name);
            contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);
        });

        it('[C280561] Should be able to delete a file via dropdown menu', () => {
            contentServicesPage.deleteContent(pdfFileModel.name);
            contentServicesPage.checkContentIsNotDisplayed(pdfFileModel.name);
            pdfUploadedNode = null;
        });

        it('[C280562] Should be able to delete multiple files via dropdown menu', () => {
            contentListPage.selectRow(pdfFileModel.name);
            contentListPage.selectRow(testFileModel.name);
            contentServicesPage.deleteContent(pdfFileModel.name);
            contentServicesPage.checkContentIsNotDisplayed(pdfFileModel.name);
            contentServicesPage.checkContentIsDisplayed(testFileModel.name);
        });

        it('[C280565] Should be able to delete a file using context menu', () => {
            contentListPage.rightClickOnRow(pdfFileModel.name);
            contentServicesPage.pressContextMenuActionNamed('Delete');
            contentServicesPage.checkContentIsNotDisplayed(pdfFileModel.name);
            pdfUploadedNode = null;
        });

        it('[C280566] Should be able to open context menu with right click', () => {
            contentListPage.rightClickOnRow(pdfFileModel.name);
            contentServicesPage.checkContextActionIsVisible('Download');
            contentServicesPage.checkContextActionIsVisible('Copy');
            contentServicesPage.checkContextActionIsVisible('Move');
            contentServicesPage.checkContextActionIsVisible('Delete');
            contentServicesPage.checkContextActionIsVisible('Info');
            contentServicesPage.checkContextActionIsVisible('Manage versions');
            contentServicesPage.checkContextActionIsVisible('Permission');
            contentServicesPage.checkContextActionIsVisible('Lock');
        });

        it('[C280567] Should be able to delete multiple files using context menu', () => {
            contentListPage.selectRow(pdfFileModel.name);
            contentListPage.selectRow(testFileModel.name);
            contentListPage.rightClickOnRow(pdfFileModel.name);
            contentServicesPage.pressContextMenuActionNamed('Delete');
            contentServicesPage.checkContentIsNotDisplayed(pdfFileModel.name);
            contentServicesPage.checkContentIsDisplayed(testFileModel.name);
        });

    });

    describe('Folder Actions', () => {

        let folderName, secondFolderName;

        beforeEach(async (done) => {
            acsUser = new AcsUserModel();
            folderName = `TATSUMAKY_${Util.generateRandomString(5)}_SENPOUKYAKU`;
            secondFolderName = `TATSUMAKY_${Util.generateRandomString(5)}_SENPOUKYAKU`;
            await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            await alfrescoJsApi.core.peopleApi.addPerson(acsUser);
            await alfrescoJsApi.login(acsUser.id, acsUser.password);
            uploadedFolder = await uploadActions.createFolder(alfrescoJsApi, folderName, '-my-');
            secondUploadedFolder = await uploadActions.createFolder(alfrescoJsApi, secondFolderName, '-my-');

            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            done();
        });

        afterEach(async (done) => {
            try {
                await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
                await uploadActions.deleteFilesOrFolder(alfrescoJsApi, uploadedFolder.entry.id);
                await uploadActions.deleteFilesOrFolder(alfrescoJsApi, secondUploadedFolder.entry.id);
            } catch (error) {
            }
            done();
        });

        it('[C260123] Should be able to delete a folder using context menu', () => {
            contentServicesPage.deleteContent(folderName);
            contentServicesPage.checkContentIsNotDisplayed(folderName);
            uploadedFolder = null;
        });

        it('[C280568] Should be able to open context menu with right click', () => {
            contentListPage.rightClickOnRow(folderName);
            contentServicesPage.checkContextActionIsVisible('Download');
            contentServicesPage.checkContextActionIsVisible('Copy');
            contentServicesPage.checkContextActionIsVisible('Move');
            contentServicesPage.checkContextActionIsVisible('Delete');
            contentServicesPage.checkContextActionIsVisible('Info');
            contentServicesPage.checkContextActionIsVisible('Permission');
        });

        it('[C260138] Should be able to copy a folder', () => {
            browser.driver.sleep(15000);

            contentServicesPage.copyContent(folderName);
            contentServicesPage.typeIntoNodeSelectorSearchField(secondFolderName);
            contentServicesPage.clickContentNodeSelectorResult(secondFolderName);
            contentServicesPage.clickCopyButton();
            contentServicesPage.checkContentIsDisplayed(folderName);
            contentServicesPage.doubleClickRow(secondUploadedFolder.entry.name);
            contentServicesPage.checkContentIsDisplayed(folderName);
        });

    });

    describe('Folder Actions - Copy and Move', () => {

        let folderModel1 = new FolderModel({'name': Util.generateRandomString()});
        let folderModel2 = new FolderModel({'name': Util.generateRandomString()});
        let folderModel3 = new FolderModel({'name': Util.generateRandomString()});
        let folderModel4 = new FolderModel({'name': Util.generateRandomString()});
        let folderModel5 = new FolderModel({'name': Util.generateRandomString()});
        let folderModel6 = new FolderModel({'name': Util.generateRandomString()});

        let folder1, folder2, folder3, folder4, folder5, folder6;

        let folders;
        let contentServicesUser = new AcsUserModel();

        beforeAll(async (done) => {

            await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            await alfrescoJsApi.core.peopleApi.addPerson(contentServicesUser);
            await alfrescoJsApi.login(contentServicesUser.id, contentServicesUser.password);
            folder1 = await uploadActions.createFolder(alfrescoJsApi, 'A' + folderModel1.name, '-my-');
            folder2 = await uploadActions.createFolder(alfrescoJsApi, 'B' + folderModel2.name, '-my-');
            folder3 = await uploadActions.createFolder(alfrescoJsApi, 'C' + folderModel3.name, '-my-');
            folder4 = await uploadActions.createFolder(alfrescoJsApi, 'D' + folderModel4.name, '-my-');
            folder5 = await uploadActions.createFolder(alfrescoJsApi, 'E' + folderModel5.name, '-my-');
            folder6 = await uploadActions.createFolder(alfrescoJsApi, 'F' + folderModel6.name, '-my-');
            folders = [folder1, folder2, folder3, folder4, folder5, folder6];
            done();
        });

        beforeEach(async (done) => {
            loginPage.loginToContentServicesUsingUserModel(contentServicesUser);
            contentServicesPage.goToDocumentList();
            contentServicesPage.waitForTableBody();
            paginationPage.selectItemsPerPage('5');
            contentServicesPage.checkAcsContainer();
            contentListPage.waitForTableBody();
            expect(paginationPage.getCurrentItemsPerPage()).toEqual('5');
            expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + 5 + ' of ' + 6);
            done();
        });

        afterAll(async (done) => {
            await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            await folders.forEach(function (folder) {
                uploadActions.deleteFilesOrFolder(alfrescoJsApi, folder.entry.id);
            });
            done();
        });

        it('[C260132] Move action on folder with - Load more', () => {

            contentListPage.rightClickOnRow('A' + folderModel1.name);
            contentServicesPage.checkContextActionIsVisible('Move');
            contentServicesPage.pressContextMenuActionNamed('Move');
            copyMoveDialog.checkDialogIsDisplayed();
            expect(copyMoveDialog.getDialogHeaderText()).toBe('Move \'' + 'A' + folderModel1.name + '\' to...');
            copyMoveDialog.checkSearchInputIsDisplayed();
            expect(copyMoveDialog.getSearchLabel()).toBe('Search');
            copyMoveDialog.checkSelectedSiteIsDisplayed('My files');
            copyMoveDialog.checkCancelButtonIsDisplayed();
            copyMoveDialog.checkMoveCopyButtonIsDisplayed();
            expect(copyMoveDialog.getMoveCopyButtonText()).toBe('MOVE');
            expect(copyMoveDialog.numberOfResultsDisplayed()).toBe(5);
            copyMoveDialog.clickLoadMoreButton();
            expect(copyMoveDialog.numberOfResultsDisplayed()).toBe(6);
            copyMoveDialog.checkLoadMoreButtonIsNotDisplayed();
            copyMoveDialog.selectRow('F' + folderModel6.name);
            copyMoveDialog.checkRowIsSelected('F' + folderModel6.name);
            copyMoveDialog.clickCancelButton();
            copyMoveDialog.checkDialogIsNotDisplayed();
            contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name);

            contentListPage.rightClickOnRow('A' + folderModel1.name);
            contentServicesPage.checkContextActionIsVisible('Move');
            contentServicesPage.pressContextMenuActionNamed('Move');
            copyMoveDialog.checkDialogIsDisplayed();
            copyMoveDialog.clickLoadMoreButton();
            copyMoveDialog.selectRow('F' + folderModel6.name);
            copyMoveDialog.checkRowIsSelected('F' + folderModel6.name);
            copyMoveDialog.clickMoveCopyButton();
            notificationPage.checkNotifyContains('Move successful');
            contentServicesPage.checkContentIsNotDisplayed('A' + folderModel1.name);
            contentServicesPage.doubleClickRow('F' + folderModel6.name);
            contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name);

            contentListPage.rightClickOnRow('A' + folderModel1.name);
            contentServicesPage.checkContextActionIsVisible('Move');
            contentServicesPage.pressContextMenuActionNamed('Move');
            copyMoveDialog.checkDialogIsDisplayed();
            breadCrumbDropdownPage.clickParentFolder();
            breadCrumbDropdownPage.checkBreadCrumbDropdownIsDisplayed();
            breadCrumbDropdownPage.choosePath(contentServicesUser.id);
            contentListPage.waitForTableBody();
            copyMoveDialog.clickMoveCopyButton();
            notificationPage.checkNotifyContains('Move successful');
            contentServicesPage.checkContentIsNotDisplayed('A' + folderModel1.name);

            breadCrumbPage.chooseBreadCrumb(contentServicesUser.id);
            contentListPage.waitForTableBody();
            contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name);

        });

        it('[C305051] Copy action on folder with - Load more', () => {

            contentListPage.rightClickOnRow('A' + folderModel1.name);
            contentServicesPage.checkContextActionIsVisible('Copy');
            contentServicesPage.pressContextMenuActionNamed('Copy');
            copyMoveDialog.checkDialogIsDisplayed();
            expect(copyMoveDialog.getDialogHeaderText()).toBe('Copy \'' + 'A' + folderModel1.name + '\' to...');
            copyMoveDialog.checkSearchInputIsDisplayed();
            expect(copyMoveDialog.getSearchLabel()).toBe('Search');
            copyMoveDialog.checkSelectedSiteIsDisplayed('My files');
            copyMoveDialog.checkCancelButtonIsDisplayed();
            copyMoveDialog.checkMoveCopyButtonIsDisplayed();
            expect(copyMoveDialog.getMoveCopyButtonText()).toBe('COPY');
            expect(copyMoveDialog.numberOfResultsDisplayed()).toBe(5);
            copyMoveDialog.clickLoadMoreButton();
            expect(copyMoveDialog.numberOfResultsDisplayed()).toBe(6);
            copyMoveDialog.checkLoadMoreButtonIsNotDisplayed();
            copyMoveDialog.selectRow('F' + folderModel6.name);
            copyMoveDialog.checkRowIsSelected('F' + folderModel6.name);
            copyMoveDialog.clickCancelButton();
            copyMoveDialog.checkDialogIsNotDisplayed();
            contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name);

            contentListPage.rightClickOnRow('A' + folderModel1.name);
            contentServicesPage.checkContextActionIsVisible('Copy');
            contentServicesPage.pressContextMenuActionNamed('Copy');
            copyMoveDialog.checkDialogIsDisplayed();
            copyMoveDialog.clickLoadMoreButton();
            copyMoveDialog.selectRow('F' + folderModel6.name);
            copyMoveDialog.checkRowIsSelected('F' + folderModel6.name);
            copyMoveDialog.clickMoveCopyButton();
            notificationPage.checkNotifyContains('Copy successful');
            contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name);
            paginationPage.clickOnNextPage();
            contentListPage.waitForTableBody();
            contentServicesPage.doubleClickRow('F' + folderModel6.name);
            contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name);

        });

    });

});
