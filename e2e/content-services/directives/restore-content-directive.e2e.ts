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
import { LoginPage, NotificationHistoryPage, StringUtil, UploadActions, BrowserActions } from '@alfresco/adf-testing';
import { BreadCrumbPage } from '../../pages/adf/content-services/breadcrumb/breadCrumbPage';

describe('Restore content directive', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const navigationBarPage = new NavigationBarPage();
    const acsUser = new AcsUserModel();
    const anotherAcsUser = new AcsUserModel();
    const trashcanPage = new TrashcanPage();
    const breadCrumbPage = new BreadCrumbPage();
    const notificationHistoryPage = new NotificationHistoryPage();

    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });

    const pdfFileModel = new FileModel({
        name: resources.Files.ADF_DOCUMENTS.PDF.file_name,
        location: resources.Files.ADF_DOCUMENTS.PDF.file_location
    });

    const testFileModel = new FileModel({
        name: resources.Files.ADF_DOCUMENTS.TEST.file_name,
        location: resources.Files.ADF_DOCUMENTS.TEST.file_location
    });

    const pngFileModel = new FileModel({
        name: resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    const folderName = StringUtil.generateRandomString(5);

    const uploadActions = new UploadActions(this.alfrescoJsApi);
    let folderWithContent, folderWithFolder, subFolder, subFile, testFile, restoreFile, publicSite, siteFolder,
        siteFile;

    beforeAll(async () => {
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
    });

    afterAll(async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await uploadActions.deleteFileOrFolder(folderWithContent.entry.id);
        await uploadActions.deleteFileOrFolder(folderWithFolder.entry.id);
    });

    beforeEach(async () => {
        await BrowserActions.closeMenuAndDialogs();
        await navigationBarPage.clickContentServicesButton();
        await contentServicesPage.waitForTableBody();
    });

    describe('Restore same name folders', () => {

        beforeAll(async () => {
            await navigationBarPage.clickContentServicesButton();
            await contentServicesPage.waitForTableBody();
            await contentServicesPage.checkContentIsDisplayed(folderName);
            await contentServicesPage.deleteContent(folderName);
            await contentServicesPage.checkContentIsNotDisplayed(folderName);
            await navigationBarPage.clickTrashcanButton();
            await trashcanPage.waitForTableBody();
            await trashcanPage.getDocumentList().dataTablePage().checkRowContentIsDisplayed(folderName);
        });

        it('[C260227] Should validate when restoring Folders with same name', async () => {
            await uploadActions.createFolder(folderName, '-my-');
            await navigationBarPage.clickContentServicesButton();
            await browser.refresh();
            await contentServicesPage.waitForTableBody();
            await contentServicesPage.checkContentIsDisplayed(folderName);
            await contentServicesPage.deleteContent(folderName);
            await contentServicesPage.checkContentIsNotDisplayed(folderName);
            await navigationBarPage.clickTrashcanButton();
            await trashcanPage.waitForTableBody();
            await trashcanPage.getDocumentList().dataTablePage().checkRowContentIsDisplayed(folderName);

            await trashcanPage.getDocumentList().dataTablePage().checkAllRows();
            await trashcanPage.clickRestore();
            await trashcanPage.getDocumentList().dataTablePage().checkRowContentIsDisplayed(folderName);
            await navigationBarPage.clickContentServicesButton();
            await contentServicesPage.getDocumentList().dataTablePage().waitTillContentLoaded();
            await contentServicesPage.checkContentIsDisplayed(folderName);

            await notificationHistoryPage.checkNotifyContains('Can\'t restore, ' + folderName + ' item already exists');

        });
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

        await navigationBarPage.clickContentServicesButton();
        await contentServicesPage.waitForTableBody();
        await contentServicesPage.checkContentIsDisplayed(testFile.entry.name);
        await contentServicesPage.deleteContent(testFile.entry.name);
        await contentServicesPage.checkContentIsNotDisplayed(testFile.entry.name);
        await navigationBarPage.clickTrashcanButton();
        await trashcanPage.waitForTableBody();
        await trashcanPage.getDocumentList().dataTablePage().checkRowContentIsDisplayed(testFile.entry.name);
        await notificationHistoryPage.checkNotifyContains(testFile.entry.name + ' item restored');
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

        await navigationBarPage.clickContentServicesButton();
        await contentServicesPage.waitForTableBody();
        await contentServicesPage.checkContentIsDisplayed(folderWithContent.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().doubleClickRow('Display name', folderWithContent.entry.name);
        await contentServicesPage.checkContentIsDisplayed(subFile.entry.name);
        await notificationHistoryPage.checkNotifyContains(folderWithContent.entry.name + ' item restored');
    });

    it('[C260240] Should validate restore when the original location no longer exists', async () => {
        await contentServicesPage.checkContentIsDisplayed(folderWithFolder.entry.name);
        await contentServicesPage.doubleClickRow(folderWithFolder.entry.name);
        await contentServicesPage.checkContentIsDisplayed(subFolder.entry.name);
        await contentServicesPage.deleteContent(subFolder.entry.name);
        await contentServicesPage.checkContentIsNotDisplayed(subFolder.entry.name);
        await breadCrumbPage.chooseBreadCrumb(acsUser.id);
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
        await navigationBarPage.clickContentServicesButton();
        await contentServicesPage.waitForTableBody();
        await contentServicesPage.checkContentIsDisplayed(folderWithFolder.entry.name);
        await contentServicesPage.doubleClickRow(folderWithFolder.entry.name);
        await contentServicesPage.checkContentIsDisplayed(subFolder.entry.name);
    });

    it('[C260241] Should display restore icon both for file and folder', async () => {
        await contentServicesPage.checkContentIsDisplayed(folderName);
        await contentServicesPage.checkContentIsDisplayed(restoreFile.entry.name);
        await contentServicesPage.deleteContent(folderName);
        await contentServicesPage.deleteContent(restoreFile.entry.name);
        await contentServicesPage.checkContentIsNotDisplayed(folderName);
        await contentServicesPage.checkContentIsNotDisplayed(restoreFile.entry.name);

        await navigationBarPage.clickTrashcanButton();
        await trashcanPage.waitForTableBody();
        await trashcanPage.checkRestoreButtonIsNotDisplayed();
        await trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(folderName);
        await trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(folderName);
        await trashcanPage.checkRestoreButtonIsDisplayed();
        await trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(folderName);
        await trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsNotSelected(folderName);

        await trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(restoreFile.entry.name);
        await trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(restoreFile.entry.name);
        await trashcanPage.checkRestoreButtonIsDisplayed();

        await trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(folderName);
        await trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(folderName);
        await trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(restoreFile.entry.name);
        await trashcanPage.checkRestoreButtonIsDisplayed();
    });

    describe('Restore deleted library', () => {

        beforeAll(async () => {
            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            const publicSiteName = `00${StringUtil.generateRandomString(5)}`;
            const publicSiteBody = { visibility: 'PUBLIC', title: publicSiteName };
            publicSite = await this.alfrescoJsApi.core.sitesApi.createSite(publicSiteBody);
            siteFolder = await uploadActions.createFolder(StringUtil.generateRandomString(5), publicSite.entry.guid);
            siteFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, siteFolder.entry.id);
            await this.alfrescoJsApi.core.sitesApi.deleteSite(publicSite.entry.id);
        });

        afterAll(async () => {
            try {
                await this.alfrescoJsApi.core.sitesApi.deleteSite(publicSite.entry.id);
            } catch (error) {
            }
        });

        it('[C260241] Should restore the deleted library along with contents inside', async () => {
            await navigationBarPage.clickTrashcanButton();
            await trashcanPage.waitForTableBody();
            await trashcanPage.getDocumentList().dataTablePage().checkRowContentIsDisplayed(publicSite.entry.id);
            await trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(publicSite.entry.id);
            await trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(publicSite.entry.id);
            await trashcanPage.clickRestore();

            await navigationBarPage.clickContentServicesButton();
            await contentServicesPage.waitForTableBody();
            await contentServicesPage.selectSite(publicSite.entry.title);
            await contentServicesPage.waitForTableBody();
            await contentServicesPage.checkContentIsDisplayed(siteFolder.entry.name);
            await contentServicesPage.doubleClickRow(siteFolder.entry.name);
            await contentServicesPage.checkContentIsDisplayed(siteFile.entry.name);
            await notificationHistoryPage.checkNotifyContains(publicSite.entry.id + ' item restored');

        });
    });

    describe('Restore with folder hierarchies', () => {

        let parentFolder, folderWithin, pdfFile, pngFile, mainFile, mainFolder;

        beforeAll(async () => {
            await this.alfrescoJsApi.login(anotherAcsUser.id, anotherAcsUser.password);
            await uploadActions.createFolder(folderName, '-my-');
            parentFolder = await uploadActions.createFolder(StringUtil.generateRandomString(5), '-my-');
            folderWithin = await uploadActions.createFolder(StringUtil.generateRandomString(5), parentFolder.entry.id);
            pdfFile = await uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, folderWithin.entry.id);
            pngFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, folderWithin.entry.id);
            mainFile = await uploadActions.uploadFile(testFileModel.location, testFileModel.name, '-my-');
            mainFolder = await uploadActions.createFolder(StringUtil.generateRandomString(5), '-my-');

            await loginPage.loginToContentServicesUsingUserModel(anotherAcsUser);
            await contentServicesPage.goToDocumentList();
            await contentServicesPage.waitForTableBody();
        });

        afterAll(async () => {
            await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
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

            await navigationBarPage.clickContentServicesButton();
            await contentServicesPage.waitForTableBody();
            await contentServicesPage.checkContentIsDisplayed(parentFolder.entry.name);
            await contentServicesPage.checkContentIsDisplayed(mainFolder.entry.name);
            await contentServicesPage.checkContentIsDisplayed(mainFile.entry.name);
            await contentServicesPage.doubleClickRow(parentFolder.entry.name);
            await contentServicesPage.checkContentIsDisplayed(folderWithin.entry.name);
            await contentServicesPage.doubleClickRow(folderWithin.entry.name);
            await contentServicesPage.checkContentIsDisplayed(pdfFile.entry.name);
            await contentServicesPage.checkContentIsDisplayed(pngFile.entry.name);
        });
    });

});
