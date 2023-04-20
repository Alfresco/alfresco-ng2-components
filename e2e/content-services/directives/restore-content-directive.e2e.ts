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

import { ContentServicesPage } from '../../core/pages/content-services.page';
import { browser } from 'protractor';
import { NodeEntry } from '@alfresco/js-api';
import { FileModel } from '../../models/ACS/file.model';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { TrashcanPage } from '../../core/pages/trashcan.page';
import { createApiService,
    BreadcrumbPage,
    LoginPage,
    NotificationHistoryPage,
    StringUtil,
    UploadActions,
    UserModel,
    UsersActions,
    WaitActions
} from '@alfresco/adf-testing';

describe('Restore content directive', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const navigationBarPage = new NavigationBarPage();
    const acsUser = new UserModel();
    const anotherAcsUser = new UserModel();
    const trashcanPage = new TrashcanPage();
    const breadCrumbPage = new BreadcrumbPage();
    const notificationHistoryPage = new NotificationHistoryPage();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const waitActions = new WaitActions(apiService);

    const pdfFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_path
    });

    const testFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.TEST.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.TEST.file_path
    });

    const pngFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_path
    });

    let testFolder: NodeEntry;

    const uploadActions = new UploadActions(apiService);
    let folderWithContent; let folderWithFolder; let subFolder; let subFile; let testFile;

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');
        await usersActions.createUser(acsUser);
        await usersActions.createUser(anotherAcsUser);
        await apiService.login(acsUser.username, acsUser.password);

        testFolder = await uploadActions.createFolder(StringUtil.generateRandomString(5), '-my-');
        folderWithContent = await uploadActions.createFolder(StringUtil.generateRandomString(5), '-my-');
        subFile = await uploadActions.uploadFile(testFileModel.location, testFileModel.name, folderWithContent.entry.id);
        testFile = await uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, '-my-');
        folderWithFolder = await uploadActions.createFolder(StringUtil.generateRandomString(5), '-my-');
        subFolder = await uploadActions.createFolder(StringUtil.generateRandomString(5), folderWithFolder.entry.id);
    });

    afterAll(async () => {
        await apiService.loginWithProfile('admin');
        await uploadActions.deleteFileOrFolder(folderWithContent.entry.id);
        await uploadActions.deleteFileOrFolder(folderWithFolder.entry.id);
    });

    describe('Restore same name folders', () => {

        beforeAll(async () => {
            await loginPage.login(acsUser.username, acsUser.password);
            await navigationBarPage.navigateToContentServices();
            await contentServicesPage.waitForTableBody();
            await contentServicesPage.checkContentIsDisplayed(testFolder.entry.name);
            await contentServicesPage.deleteContent(testFolder.entry.name);
            await contentServicesPage.checkContentIsNotDisplayed(testFolder.entry.name);
            await navigationBarPage.clickTrashcanButton();
            await trashcanPage.waitForTableBody();
            await trashcanPage.getDocumentList().dataTablePage().checkRowContentIsDisplayed(testFolder.entry.name);
        });

        afterEach(async () => {
            await navigationBarPage.clickLogoutButton();
        });

        it('[C260227] Should validate when restoring Folders with same name', async () => {
            await uploadActions.createFolder(testFolder.entry.name, '-my-');
            await navigationBarPage.navigateToContentServices();
            await contentServicesPage.waitForTableBody();
            await contentServicesPage.checkContentIsDisplayed(testFolder.entry.name);
            await contentServicesPage.deleteContent(testFolder.entry.name);
            await contentServicesPage.checkContentIsNotDisplayed(testFolder.entry.name);
            await navigationBarPage.clickTrashcanButton();
            await trashcanPage.waitForTableBody();
            await trashcanPage.getDocumentList().dataTablePage().checkRowContentIsDisplayed(testFolder.entry.name);

            await trashcanPage.getDocumentList().dataTablePage().checkAllRows();

            await trashcanPage.clickRestore();
            await waitActions.nodeIsPresent(testFolder.entry.id);

            await navigationBarPage.navigateToContentServices();
            await contentServicesPage.getDocumentList().dataTablePage().waitTillContentLoaded();
            await contentServicesPage.checkContentIsDisplayed(testFolder.entry.name);

            await notificationHistoryPage.checkNotifyContains('Can\'t restore, ' + testFolder.entry.name + ' item already exists');
        });
    });

    describe('Validate', () => {

        beforeAll(async () => {
            await loginPage.login(acsUser.username, acsUser.password);
        });

        afterAll(async () => {
            await navigationBarPage.clickLogoutButton();
        });

        beforeEach(async () => {
            await navigationBarPage.navigateToContentServices();
            await contentServicesPage.waitForTableBody();
        });

        it('[C260238] Should restore a file', async () => {
            await contentServicesPage.checkContentIsDisplayed(testFile.entry.name);
            await contentServicesPage.deleteContent(testFile.entry.name);
            await contentServicesPage.checkContentIsNotDisplayed(testFile.entry.name);
            await navigationBarPage.clickTrashcanButton();
            await trashcanPage.waitForTableBody();
            await trashcanPage.getDocumentList().dataTablePage().clickRowByContent(testFile.entry.name);
            await trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(testFile.entry.name);
            await trashcanPage.clickRestore();
            await trashcanPage.getDocumentList().dataTablePage().checkRowContentIsNotDisplayed(testFile.entry.name);

            await notificationHistoryPage.checkNotifyContains(testFile.entry.name + ' item restored');

            await navigationBarPage.navigateToContentServices();
            await contentServicesPage.waitForTableBody();
            await contentServicesPage.checkContentIsDisplayed(testFile.entry.name);
            await contentServicesPage.deleteContent(testFile.entry.name);
            await contentServicesPage.checkContentIsNotDisplayed(testFile.entry.name);
            await navigationBarPage.clickTrashcanButton();
            await trashcanPage.waitForTableBody();
            await trashcanPage.getDocumentList().dataTablePage().checkRowContentIsDisplayed(testFile.entry.name);
        });

        it('[C260239] Should restore folder with content', async () => {
            await contentServicesPage.checkContentIsDisplayed(folderWithContent.entry.name);
            await contentServicesPage.deleteContent(folderWithContent.entry.name);
            await contentServicesPage.checkContentIsNotDisplayed(folderWithContent.entry.name);
            await navigationBarPage.clickTrashcanButton();
            await trashcanPage.waitForTableBody();
            await trashcanPage.getDocumentList().dataTablePage().clickRowByContent(folderWithContent.entry.name);
            await trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(folderWithContent.entry.name);
            await trashcanPage.clickRestore();
            await trashcanPage.getDocumentList().dataTablePage().checkRowContentIsNotDisplayed(folderWithContent.entry.name);

            await navigationBarPage.navigateToContentServices();
            await contentServicesPage.waitForTableBody();
            await contentServicesPage.checkContentIsDisplayed(folderWithContent.entry.name);
            await contentServicesPage.getDocumentList().dataTablePage().doubleClickRow('Display name', folderWithContent.entry.name);
            await contentServicesPage.checkContentIsDisplayed(subFile.entry.name);
            await notificationHistoryPage.checkNotifyContains(folderWithContent.entry.name + ' item restored');
        });

        it('[C260240] Should validate restore when the original location no longer exists', async () => {
            await contentServicesPage.checkContentIsDisplayed(folderWithFolder.entry.name);
            await contentServicesPage.openFolder(folderWithFolder.entry.name);
            await contentServicesPage.checkContentIsDisplayed(subFolder.entry.name);
            await contentServicesPage.deleteContent(subFolder.entry.name);
            await contentServicesPage.checkContentIsNotDisplayed(subFolder.entry.name);
            await breadCrumbPage.chooseBreadCrumb(acsUser.username);
            await contentServicesPage.waitForTableBody();
            await contentServicesPage.checkContentIsDisplayed(folderWithFolder.entry.name);
            await contentServicesPage.deleteContent(folderWithFolder.entry.name);
            await contentServicesPage.checkContentIsNotDisplayed(folderWithFolder.entry.name);

            await navigationBarPage.clickTrashcanButton();
            await trashcanPage.waitForTableBody();
            await trashcanPage.getDocumentList().dataTablePage().checkRowContentIsDisplayed(subFolder.entry.name);
            await trashcanPage.getDocumentList().dataTablePage().checkRowContentIsDisplayed(folderWithFolder.entry.name);
            await trashcanPage.getDocumentList().dataTablePage().clickRowByContent(subFolder.entry.name);
            await trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(subFolder.entry.name);
            await trashcanPage.clickRestore();
            await notificationHistoryPage.checkNotifyContains(`Can't restore ${subFolder.entry.name} item, the original location no longer exists`);
            await trashcanPage.getDocumentList().dataTablePage().checkRowContentIsDisplayed(subFolder.entry.name);
            await trashcanPage.getDocumentList().dataTablePage().checkRowContentIsDisplayed(folderWithFolder.entry.name);
            await trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(subFolder.entry.name);
            await trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(subFolder.entry.name);
            await trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(folderWithFolder.entry.name);
            await trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(folderWithFolder.entry.name);
            await trashcanPage.clickRestore();
            await notificationHistoryPage.checkNotifyContains('Restore successful');
            await navigationBarPage.navigateToContentServices();
            await contentServicesPage.waitForTableBody();
            await contentServicesPage.checkContentIsDisplayed(folderWithFolder.entry.name);
            await contentServicesPage.openFolder(folderWithFolder.entry.name);
            await contentServicesPage.checkContentIsDisplayed(subFolder.entry.name);
        });
    });

    describe('Restore with folder hierarchies', () => {
        let parentFolder; let folderWithin; let pdfFile; let pngFile; let mainFile; let mainFolder;

        beforeAll(async () => {
            await apiService.login(anotherAcsUser.username, anotherAcsUser.password);
            await uploadActions.createFolder(testFolder.entry.name, '-my-');
            parentFolder = await uploadActions.createFolder(StringUtil.generateRandomString(5), '-my-');
            folderWithin = await uploadActions.createFolder(StringUtil.generateRandomString(5), parentFolder.entry.id);
            pdfFile = await uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, folderWithin.entry.id);
            pngFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, folderWithin.entry.id);
            mainFile = await uploadActions.uploadFile(testFileModel.location, testFileModel.name, '-my-');
            mainFolder = await uploadActions.createFolder(StringUtil.generateRandomString(5), '-my-');

            await loginPage.login(anotherAcsUser.username, anotherAcsUser.password);
        });

        beforeEach(async () => {
            await navigationBarPage.navigateToContentServices();
            await contentServicesPage.waitForTableBody();
        });

        afterEach(async () => {
            await navigationBarPage.clickLogoutButton();
        });

        afterAll(async () => {
            await apiService.loginWithProfile('admin');
            await uploadActions.deleteFileOrFolder(parentFolder.entry.id);
            await uploadActions.deleteFileOrFolder(mainFolder.entry.id);
            await uploadActions.deleteFileOrFolder(mainFile.entry.id);
        });

        it('[C216431] Should restore hierarchy of folders', async () => {
            await contentServicesPage.deleteContent(parentFolder.entry.name);
            await contentServicesPage.deleteContent(mainFolder.entry.name);
            await contentServicesPage.deleteContent(mainFile.entry.name);

            await navigationBarPage.clickTrashcanButton();
            await trashcanPage.waitForTableBody();
            await trashcanPage.checkRestoreButtonIsNotDisplayed();
            await trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(parentFolder.entry.name);
            await trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(parentFolder.entry.name);
            await trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(mainFolder.entry.name);
            await trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(mainFolder.entry.name);
            await trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(mainFile.entry.name);
            await trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(mainFile.entry.name);
            await trashcanPage.clickRestore();

            await navigationBarPage.navigateToContentServices();
            await contentServicesPage.waitForTableBody();
            await contentServicesPage.checkContentIsDisplayed(parentFolder.entry.name);
            await contentServicesPage.checkContentIsDisplayed(mainFolder.entry.name);
            await contentServicesPage.checkContentIsDisplayed(mainFile.entry.name);
            await contentServicesPage.openFolder(parentFolder.entry.name);
            await contentServicesPage.checkContentIsDisplayed(folderWithin.entry.name);
            await contentServicesPage.openFolder(folderWithin.entry.name);
            await contentServicesPage.checkContentIsDisplayed(pdfFile.entry.name);
            await contentServicesPage.checkContentIsDisplayed(pngFile.entry.name);
        });
    });

});
