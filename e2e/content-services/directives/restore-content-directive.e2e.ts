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

import { ContentServicesPage } from '../../pages/adf/contentServicesPage';

import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { browser } from 'protractor';
import { FileModel } from '../../models/ACS/fileModel';
import resources = require('../../util/resources');
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { TrashcanPage } from '../../pages/adf/trashcanPage';
import { LoginPage, NotificationHistoryPage, StringUtil, UploadActions } from '@alfresco/adf-testing';
import { BreadCrumbPage } from '../../pages/adf/content-services/breadcrumb/breadCrumbPage';

describe('Restore content directive', function () {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const navigationBarPage = new NavigationBarPage();
    const acsUser = new AcsUserModel();
    const anotherAcsUser = new AcsUserModel();
    const trashcanPage = new TrashcanPage();
    const breadCrumbPage = new BreadCrumbPage();
    const contentListPage = contentServicesPage.getDocumentList();
    const notificationHistoryPage = new NotificationHistoryPage();

    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf.url
    });

    const pdfFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF.file_location
    });

    const testFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TEST.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
    });

    const pngFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    const folderName = StringUtil.generateRandomString(5);

    const uploadActions = new UploadActions(this.alfrescoJsApi);
    let folderWithContent, folderWithFolder, subFolder, subFile, testFile, restoreFile;

    beforeAll(async (done) => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.core.peopleApi.addPerson(anotherAcsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        await uploadActions.createFolder(folderName, '-my-');
        folderWithContent = await uploadActions.createFolder(StringUtil.generateRandomString(5), '-my-');
        subFile = await uploadActions.uploadFile(testFileModel.location, testFileModel.name, folderWithContent.entry.id);
        testFile = await uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, '-my-');
        folderWithFolder = await uploadActions.createFolder(StringUtil.generateRandomString(5), '-my-');
        subFolder = await uploadActions.createFolder(StringUtil.generateRandomString(5), folderWithFolder.entry.id);
        restoreFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, '-my-');

        await loginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.goToDocumentList();
        done();
    });

    afterAll(async (done) => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await uploadActions.deleteFileOrFolder(folderWithContent.entry.id);
        await uploadActions.deleteFileOrFolder(folderWithFolder.entry.id);
        done();
    });

    beforeEach(async (done) => {
        navigationBarPage.clickContentServicesButton();
        contentServicesPage.getContentList().dataTablePage().waitTillContentLoaded();
        done();
    });

    it('[C260227] Should restore empty folder', async () => {
        contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', folderName);
        contentServicesPage.getContentList().dataTablePage().selectRow('Display name', folderName);
        contentServicesPage.getContentList().dataTablePage().checkRowIsSelected('Display name', folderName);
        contentListPage.rightClickOnRow(folderName);
        contentServicesPage.pressContextMenuActionNamed('Delete');
        contentServicesPage.checkContentIsNotDisplayed(folderName);
        navigationBarPage.clickTrashcanButton();
        trashcanPage.waitForTableBody();
        expect(trashcanPage.numberOfResultsDisplayed()).toBe(1);
        trashcanPage.getDocumentList().dataTablePage().clickRowByContent(folderName);
        trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(folderName);
        trashcanPage.clickRestore();
        trashcanPage.checkTrashcanIsEmpty();

        navigationBarPage.clickContentServicesButton();
        contentServicesPage.getContentList().dataTablePage().waitTillContentLoaded();
        contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', folderName);
        contentListPage.rightClickOnRow(folderName);
        contentServicesPage.pressContextMenuActionNamed('Delete');
        contentServicesPage.checkContentIsNotDisplayed(folderName);
        navigationBarPage.clickTrashcanButton();
        trashcanPage.waitForTableBody();
        trashcanPage.getDocumentList().dataTablePage().checkRowContentIsDisplayed(folderName);
        notificationHistoryPage.checkNotifyContains(folderName + ' item restored');
    });

    it('[C260227] Should validate when restoring Folders with same name', async () => {
        await uploadActions.createFolder(folderName, '-my-');
        browser.refresh();
        contentServicesPage.getContentList().dataTablePage().waitTillContentLoaded();
        contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', folderName);
        contentListPage.rightClickOnRow(folderName);
        contentServicesPage.pressContextMenuActionNamed('Delete');
        contentServicesPage.checkContentIsNotDisplayed(folderName);
        navigationBarPage.clickTrashcanButton();
        trashcanPage.waitForTableBody();
        expect(trashcanPage.numberOfResultsDisplayed()).toBe(2);

        trashcanPage.getDocumentList().dataTablePage().checkAllRows();
        trashcanPage.clickRestore();
        expect(trashcanPage.numberOfResultsDisplayed()).toBe(1);
        trashcanPage.getDocumentList().dataTablePage().checkRowContentIsDisplayed(folderName);
        navigationBarPage.clickContentServicesButton();
        contentServicesPage.getContentList().dataTablePage().waitTillContentLoaded();
        contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', folderName);

        notificationHistoryPage.checkNotifyContains('Can\'t restore, ' + folderName + ' item already exists');

    });

    it('[C260238] Should restore a file', async () => {
        contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', testFile.entry.name);
        contentServicesPage.getContentList().dataTablePage().selectRow('Display name', testFile.entry.name);
        contentServicesPage.getContentList().dataTablePage().checkRowIsSelected('Display name', testFile.entry.name);
        contentListPage.rightClickOnRow(testFile.entry.name);
        contentServicesPage.pressContextMenuActionNamed('Delete');
        contentServicesPage.checkContentIsNotDisplayed(testFile.entry.name);
        navigationBarPage.clickTrashcanButton();
        trashcanPage.waitForTableBody();
        trashcanPage.getDocumentList().dataTablePage().clickRowByContent(testFile.entry.name);
        trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(testFile.entry.name);
        trashcanPage.clickRestore();
        trashcanPage.getDocumentList().dataTablePage().checkRowContentIsNotDisplayed(testFile.entry.name);

        navigationBarPage.clickContentServicesButton();
        contentServicesPage.getContentList().dataTablePage().waitTillContentLoaded();
        contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', testFile.entry.name);
        contentListPage.rightClickOnRow(testFile.entry.name);
        contentServicesPage.pressContextMenuActionNamed('Delete');
        contentServicesPage.checkContentIsNotDisplayed(testFile.entry.name);
        navigationBarPage.clickTrashcanButton();
        trashcanPage.waitForTableBody();
        trashcanPage.getDocumentList().dataTablePage().checkRowContentIsDisplayed(testFile.entry.name);
        notificationHistoryPage.checkNotifyContains(testFile.entry.name + ' item restored');
    });

    it('[C260239] Should restore folder with content', async () => {
        contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', folderWithContent.entry.name);
        contentServicesPage.getContentList().dataTablePage().selectRow('Display name', folderWithContent.entry.name);
        contentServicesPage.getContentList().dataTablePage().checkRowIsSelected('Display name', folderWithContent.entry.name);
        contentListPage.rightClickOnRow(folderWithContent.entry.name);
        contentServicesPage.pressContextMenuActionNamed('Delete');
        contentServicesPage.checkContentIsNotDisplayed(folderWithContent.entry.name);
        navigationBarPage.clickTrashcanButton();
        trashcanPage.waitForTableBody();
        trashcanPage.getDocumentList().dataTablePage().clickRowByContent(folderWithContent.entry.name);
        trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(folderWithContent.entry.name);
        trashcanPage.clickRestore();
        trashcanPage.getDocumentList().dataTablePage().checkRowContentIsNotDisplayed(folderWithContent.entry.name);

        navigationBarPage.clickContentServicesButton();
        contentServicesPage.getContentList().dataTablePage().waitTillContentLoaded();
        contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', folderWithContent.entry.name);
        contentServicesPage.getContentList().dataTablePage().doubleClickRow('Display name', folderWithContent.entry.name);
        contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', subFile.entry.name);
        notificationHistoryPage.checkNotifyContains(folderWithContent.entry.name + ' item restored');
    });

    it('[C260240] Should validate restore when the original location no longer exists', async () => {
        contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', folderWithFolder.entry.name);
        contentServicesPage.getContentList().dataTablePage().doubleClickRow('Display name', folderWithFolder.entry.name);
        contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', subFolder.entry.name);
        contentServicesPage.getContentList().dataTablePage().selectRow('Display name', subFolder.entry.name);
        contentServicesPage.getContentList().dataTablePage().checkRowIsSelected('Display name', subFolder.entry.name);
        contentListPage.rightClickOnRow(subFolder.entry.name);
        contentServicesPage.pressContextMenuActionNamed('Delete');
        contentServicesPage.checkContentIsNotDisplayed(subFolder.entry.name);
        breadCrumbPage.chooseBreadCrumb(acsUser.id);
        contentServicesPage.getContentList().dataTablePage().waitTillContentLoaded();
        contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', folderWithFolder.entry.name);
        contentServicesPage.getContentList().dataTablePage().selectRow('Display name', folderWithFolder.entry.name);
        contentServicesPage.getContentList().dataTablePage().checkRowIsSelected('Display name', folderWithFolder.entry.name);
        contentListPage.rightClickOnRow(folderWithFolder.entry.name);
        contentServicesPage.pressContextMenuActionNamed('Delete');
        contentServicesPage.checkContentIsNotDisplayed(folderWithFolder.entry.name);

        navigationBarPage.clickTrashcanButton();
        trashcanPage.waitForTableBody();
        trashcanPage.getDocumentList().dataTablePage().checkRowContentIsDisplayed(subFolder.entry.name);
        trashcanPage.getDocumentList().dataTablePage().checkRowContentIsDisplayed(folderWithFolder.entry.name);
        trashcanPage.getDocumentList().dataTablePage().clickRowByContent(subFolder.entry.name);
        trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(subFolder.entry.name);
        trashcanPage.clickRestore();
        trashcanPage.getDocumentList().dataTablePage().checkRowContentIsDisplayed(subFolder.entry.name);
        trashcanPage.getDocumentList().dataTablePage().checkRowContentIsDisplayed(folderWithFolder.entry.name);
        trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(subFolder.entry.name);
        trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(subFolder.entry.name);
        trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(folderWithFolder.entry.name);
        trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(folderWithFolder.entry.name);
        trashcanPage.clickRestore();

        navigationBarPage.clickContentServicesButton();
        contentServicesPage.getContentList().dataTablePage().waitTillContentLoaded();
        contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', folderWithFolder.entry.name);
        contentServicesPage.getContentList().dataTablePage().doubleClickRow('Display name', folderWithFolder.entry.name);
        contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', subFolder.entry.name);
        notificationHistoryPage.clickNotificationButton();
        notificationHistoryPage.checkNotificationIsPresent('Can\'t restore ' + subFolder.entry.name + ' item, the original location no longer exists');
        notificationHistoryPage.checkNotificationIsPresent('Restore successful');
        notificationHistoryPage.clickMarkAsRead();
    });

    it('[C260241] Should display and enable restore icon both for file and folder', async () => {
        contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', folderName);
        contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', restoreFile.entry.name);
        contentServicesPage.deleteContent(folderName);
        contentServicesPage.deleteContent(restoreFile.entry.name);
        contentServicesPage.getContentList().dataTablePage().checkContentIsNotDisplayed('Display name', folderName);
        contentServicesPage.getContentList().dataTablePage().checkContentIsNotDisplayed('Display name', restoreFile.entry.name);

        navigationBarPage.clickTrashcanButton();
        trashcanPage.waitForTableBody();
        trashcanPage.checkRestoreButtonIsNotDisplayed();
        trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(folderName);
        trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(folderName);
        trashcanPage.checkRestoreButtonIsEnabled();
        trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(folderName);
        trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsNotSelected(folderName);

        trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(restoreFile.entry.name);
        trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(restoreFile.entry.name);
        trashcanPage.checkRestoreButtonIsEnabled();

        trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(folderName);
        trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(folderName);
        trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(restoreFile.entry.name);
        trashcanPage.checkRestoreButtonIsEnabled();
    });

    describe('Restore with folder hierarchies', () => {

        let parentFolder,folderWithin, pdfFile, pngFile, mainFile, mainFolder;

        beforeAll(async (done) => {
            await this.alfrescoJsApi.login(anotherAcsUser.id, anotherAcsUser.password);
            await uploadActions.createFolder(folderName, '-my-');
            parentFolder = await uploadActions.createFolder(StringUtil.generateRandomString(5), '-my-');
            folderWithin = await uploadActions.createFolder(StringUtil.generateRandomString(5), parentFolder.entry.id);
            pdfFile = await uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, folderWithin.entry.id);
            pngFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, folderWithin.entry.id);
            mainFile = await uploadActions.uploadFile(testFileModel.location, testFileModel.name, '-my-');
            mainFolder = await uploadActions.createFolder(StringUtil.generateRandomString(5), '-my-');

            await loginPage.loginToContentServicesUsingUserModel(anotherAcsUser);
            contentServicesPage.goToDocumentList();
            contentServicesPage.getContentList().dataTablePage().waitTillContentLoaded();
            done();
        });

        afterAll(async (done) => {
            await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
            await uploadActions.deleteFileOrFolder(parentFolder.entry.id);
            await uploadActions.deleteFileOrFolder(mainFolder.entry.id);
            await uploadActions.deleteFileOrFolder(mainFile.entry.id);
            done();
        });

        it('[C216431] Should restore hierarchy of folders', async () => {
            contentServicesPage.deleteContent(parentFolder.entry.name);
            contentServicesPage.deleteContent(mainFolder.entry.name);
            contentServicesPage.deleteContent(mainFile.entry.name);

            navigationBarPage.clickTrashcanButton();
            trashcanPage.waitForTableBody();
            trashcanPage.checkRestoreButtonIsNotDisplayed();
            trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(parentFolder.entry.name);
            trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(parentFolder.entry.name);
            trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(mainFolder.entry.name);
            trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(mainFolder.entry.name);
            trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(mainFile.entry.name);
            trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(mainFile.entry.name);
            trashcanPage.clickRestore();

            navigationBarPage.clickContentServicesButton();
            contentServicesPage.getContentList().dataTablePage().waitTillContentLoaded();
            contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', parentFolder.entry.name);
            contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', mainFolder.entry.name);
            contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', mainFile.entry.name);
            contentServicesPage.getContentList().dataTablePage().doubleClickRow('Display name', parentFolder.entry.name);
            contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', folderWithin.entry.name);
            contentServicesPage.getContentList().dataTablePage().doubleClickRow('Display name', folderWithin.entry.name);
            contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', pdfFile.entry.name);
            contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', pngFile.entry.name);
        });
    });

});
