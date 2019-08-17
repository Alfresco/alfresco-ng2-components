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
import {
    LoginPage,
    UploadActions,
    StringUtil,
    ContentNodeSelectorDialogPage,
    NotificationHistoryPage, BrowserActions
} from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import resources = require('../../util/resources');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { FileModel } from '../../models/ACS/fileModel';

describe('Document List Component', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const navigationBarPage = new NavigationBarPage();
    const contentNodeSelector = new ContentNodeSelectorDialogPage();
    const notificationHistoryPage = new NotificationHistoryPage();

    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);

    let uploadedFolder, uploadedFile, sourceFolder, destinationFolder, subFolder, subFolder2, copyFolder, subFile,
        duplicateFolderName;
    let acsUser = null, anotherAcsUser: AcsUserModel;
    let folderName, sameNameFolder;

    const pdfFileModel = new FileModel({
        name: resources.Files.ADF_DOCUMENTS.PDF.file_name,
        location: resources.Files.ADF_DOCUMENTS.PDF.file_location
    });

    const testFileModel = new FileModel({
        name: resources.Files.ADF_DOCUMENTS.TEST.file_name,
        location: resources.Files.ADF_DOCUMENTS.TEST.file_location
    });

    beforeAll(async () => {
        acsUser = new AcsUserModel();
        anotherAcsUser = new AcsUserModel();
        folderName = StringUtil.generateRandomString(5);
        sameNameFolder = StringUtil.generateRandomString(5);
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.core.peopleApi.addPerson(anotherAcsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
        uploadedFolder = await uploadActions.createFolder(folderName, '-my-');
        destinationFolder = await uploadActions.createFolder(StringUtil.generateRandomString(5), '-my-');
        sourceFolder = await uploadActions.createFolder(StringUtil.generateRandomString(5), '-my-');
        subFolder = await uploadActions.createFolder(sameNameFolder, sourceFolder.entry.id);
        subFolder2 = await uploadActions.createFolder(StringUtil.generateRandomString(5), subFolder.entry.id);
        copyFolder = await uploadActions.createFolder(StringUtil.generateRandomString(5), sourceFolder.entry.id);
        duplicateFolderName = await uploadActions.createFolder(sameNameFolder, '-my-');
        subFile = await uploadActions.uploadFile(testFileModel.location, testFileModel.name, subFolder.entry.id);
        await uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, uploadedFolder.entry.id);
        uploadedFile = await uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, '-my-');
        await this.alfrescoJsApi.core.nodesApi.updateNode(sourceFolder.entry.id,

            {
                permissions: {
                    locallySet: [{
                        authorityId: anotherAcsUser.getId(),
                        name: 'Consumer',
                        accessStatus: 'ALLOWED'
                    }]
                }
            });

        await browser.driver.sleep(12000);

    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await uploadActions.deleteFileOrFolder(uploadedFolder.entry.id);
        await uploadActions.deleteFileOrFolder(uploadedFile.entry.id);
        await uploadActions.deleteFileOrFolder(sourceFolder.entry.id);
        await uploadActions.deleteFileOrFolder(destinationFolder.entry.id);

    });

    describe('Document List Component - Actions Move and Copy', () => {

        beforeAll(async () => {
            await loginPage.loginToContentServicesUsingUserModel(acsUser);
        });

        beforeEach(async () => {
            await BrowserActions.closeMenuAndDialogs();
            await navigationBarPage.clickContentServicesButton();

        });

        it('[C260128] Move - Same name file', async () => {
            await contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);
            await contentServicesPage.getDocumentList().rightClickOnRow(pdfFileModel.name);
            await contentServicesPage.pressContextMenuActionNamed('Move');
            await contentNodeSelector.checkDialogIsDisplayed();
            await contentNodeSelector.typeIntoNodeSelectorSearchField(folderName);
            await contentNodeSelector.clickContentNodeSelectorResult(folderName);
            await contentNodeSelector.clickMoveCopyButton();
            await notificationHistoryPage.checkNotifyContains('This name is already in use, try a different name.');
        });

        it('[C260134] Move - folder with subfolder and file within it', async () => {
            await contentServicesPage.checkContentIsDisplayed(destinationFolder.entry.name);
            await contentServicesPage.checkContentIsDisplayed(sourceFolder.entry.name);
            await contentServicesPage.getDocumentList().rightClickOnRow(sourceFolder.entry.name);
            await contentServicesPage.pressContextMenuActionNamed('Move');
            await contentNodeSelector.checkDialogIsDisplayed();
            await contentNodeSelector.typeIntoNodeSelectorSearchField(destinationFolder.entry.name);
            await contentNodeSelector.clickContentNodeSelectorResult(destinationFolder.entry.name);
            await contentNodeSelector.clickMoveCopyButton();
            await contentServicesPage.checkContentIsNotDisplayed(sourceFolder.entry.name);
            await contentServicesPage.doubleClickRow(destinationFolder.entry.name);
            await contentServicesPage.checkContentIsDisplayed(sourceFolder.entry.name);
            await contentServicesPage.doubleClickRow(sourceFolder.entry.name);
            await contentServicesPage.checkContentIsDisplayed(subFolder.entry.name);
            await contentServicesPage.doubleClickRow(subFolder.entry.name);
            await contentServicesPage.checkContentIsDisplayed(subFile.entry.name);
        });

        it('[C260135] Move - Same name folder', async () => {
            await contentServicesPage.checkContentIsDisplayed(duplicateFolderName.entry.name);
            await contentServicesPage.getDocumentList().rightClickOnRow(duplicateFolderName.entry.name);
            await contentServicesPage.pressContextMenuActionNamed('Move');
            await contentNodeSelector.checkDialogIsDisplayed();
            await contentNodeSelector.typeIntoNodeSelectorSearchField(sourceFolder.entry.name);
            await contentNodeSelector.clickContentNodeSelectorResult(sourceFolder.entry.name);
            await contentNodeSelector.clickMoveCopyButton();
            await notificationHistoryPage.checkNotifyContains('This name is already in use, try a different name.');
        });

        it('[C260129] Copy - Same name file', async () => {
            await contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);
            await contentServicesPage.getDocumentList().rightClickOnRow(pdfFileModel.name);
            await contentServicesPage.pressContextMenuActionNamed('Copy');
            await contentNodeSelector.checkDialogIsDisplayed();
            await contentNodeSelector.typeIntoNodeSelectorSearchField(folderName);
            await contentNodeSelector.clickContentNodeSelectorResult(folderName);
            await contentNodeSelector.clickMoveCopyButton();
            await notificationHistoryPage.checkNotifyContains('This name is already in use, try a different name.');
        });

        it('[C260136] Copy - Same name folder', async () => {
            await contentServicesPage.checkContentIsDisplayed(duplicateFolderName.entry.name);
            await contentServicesPage.getDocumentList().rightClickOnRow(duplicateFolderName.entry.name);
            await contentServicesPage.pressContextMenuActionNamed('Copy');
            await contentNodeSelector.checkDialogIsDisplayed();
            await contentNodeSelector.typeIntoNodeSelectorSearchField(sourceFolder.entry.name);
            await contentNodeSelector.clickContentNodeSelectorResult(sourceFolder.entry.name);
            await contentNodeSelector.clickMoveCopyButton();
            await notificationHistoryPage.checkNotifyContains('This name is already in use, try a different name.');
        });

    });

    describe('Document List actionns - Move, Copy on no permission folder', () => {

        beforeAll(async () => {
            await loginPage.loginToContentServicesUsingUserModel(anotherAcsUser);
            await BrowserActions.getUrl(`${browser.params.testConfig.adf.url}/files/${sourceFolder.entry.id}`);
            await contentServicesPage.getDocumentList().dataTablePage().waitTillContentLoaded();
        });

        it('[C260133] Move - no permission folder', async () => {
            await contentServicesPage.checkContentIsDisplayed(subFolder.entry.name);
            await contentServicesPage.getDocumentList().rightClickOnRow(subFolder.entry.name);
            await contentServicesPage.checkContextActionIsVisible('Move');
            await expect(await contentServicesPage.isContextActionEnabled('Move')).toBe(false);
            await contentServicesPage.closeActionContext();
        });

        it('[C260140] Copy - No permission folder', async () => {
            await contentServicesPage.checkContentIsDisplayed(subFolder.entry.name);
            await contentServicesPage.checkContentIsDisplayed(copyFolder.entry.name);
            await contentServicesPage.getDocumentList().rightClickOnRow(copyFolder.entry.name);
            await contentServicesPage.checkContextActionIsVisible('Copy');
            await expect(await contentServicesPage.isContextActionEnabled('Copy')).toBe(true);
            await contentServicesPage.pressContextMenuActionNamed('Copy');
            await contentNodeSelector.checkDialogIsDisplayed();
            await contentNodeSelector.contentListPage().dataTablePage().checkRowContentIsDisplayed(subFolder.entry.name);
            await contentNodeSelector.contentListPage().dataTablePage().checkRowContentIsDisabled(subFolder.entry.name);
            await contentNodeSelector.clickContentNodeSelectorResult(subFolder.entry.name);
            await contentNodeSelector.contentListPage().dataTablePage().checkRowByContentIsSelected(subFolder.entry.name);
            await expect(await contentNodeSelector.checkCopyMoveButtonIsEnabled()).toBe(false);
            await contentNodeSelector.contentListPage().dataTablePage().doubleClickRowByContent(subFolder.entry.name);
            await contentNodeSelector.contentListPage().dataTablePage().waitTillContentLoaded();
            await contentNodeSelector.contentListPage().dataTablePage().checkRowContentIsDisplayed(subFolder2.entry.name);
        });

    });

});
