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

import { BrowserActions, LoginPage, NotificationHistoryPage, StringUtil, UploadActions } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { FolderDialog } from '../../pages/adf/dialog/folderDialog';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { browser, protractor } from 'protractor';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { FileModel } from '../../models/ACS/fileModel';
import resources = require('../../util/resources');

describe('Edit folder directive', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const editFolderDialog = new FolderDialog();
    const acsUser = new AcsUserModel();
    const anotherAcsUser = new AcsUserModel();
    const navigationBarPage = new NavigationBarPage();
    const notificationHistoryPage = new NotificationHistoryPage();

    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });

    const pdfFile = new FileModel({
        name: resources.Files.ADF_DOCUMENTS.PDF.file_name,
        location: resources.Files.ADF_DOCUMENTS.PDF.file_location
    });

    const uploadActions = new UploadActions(this.alfrescoJsApi);
    const updateFolderName = StringUtil.generateRandomString(5);
    let editFolder, anotherFolder, filePdfNode, subFolder;

    beforeAll(async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.core.peopleApi.addPerson(anotherAcsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        editFolder = await uploadActions.createFolder(StringUtil.generateRandomString(5), '-my-');
        anotherFolder = await uploadActions.createFolder(StringUtil.generateRandomString(5), '-my-');
        subFolder = await uploadActions.createFolder(StringUtil.generateRandomString(5), editFolder.entry.id);
        filePdfNode = await uploadActions.uploadFile(pdfFile.location, pdfFile.name, '-my-');

        await this.alfrescoJsApi.core.nodesApi.updateNode(editFolder.entry.id,

            {
                permissions: {
                    locallySet: [{
                        authorityId: anotherAcsUser.getId(),
                        name: 'Consumer',
                        accessStatus: 'ALLOWED'
                    }]
                }
            });

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await uploadActions.deleteFileOrFolder(editFolder.entry.id);
        await uploadActions.deleteFileOrFolder(anotherFolder.entry.id);
        await uploadActions.deleteFileOrFolder(filePdfNode.entry.id);

    });

    beforeEach(async () => {
        await navigationBarPage.clickHomeButton();
        await navigationBarPage.clickContentServicesButton();
        await contentServicesPage.getDocumentList().dataTablePage().waitTillContentLoaded();
    });

    afterEach(async () => {
        await BrowserActions.closeMenuAndDialogs();
    });

    it('[C260161] Update folder - Cancel button', async () => {
        await contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', editFolder.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', editFolder.entry.name);
        await contentServicesPage.clickOnEditFolder();
        await editFolderDialog.checkFolderDialogIsDisplayed();
        await expect(await editFolderDialog.getDialogTitle()).toBe('Edit folder');
        await expect(await editFolderDialog.getFolderName()).toBe(editFolder.entry.name);
        await editFolderDialog.checkCreateUpdateBtnIsEnabled();
        await editFolderDialog.checkCancelBtnIsEnabled();
        await editFolderDialog.clickOnCancelButton();
        await editFolderDialog.checkFolderDialogIsNotDisplayed();
    });

    it('[C260162] Update folder - Introducing letters', async () => {
        await contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', editFolder.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', editFolder.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', editFolder.entry.name);
        await expect(await contentServicesPage.isEditFolderButtonEnabled()).toBe(true);
        await contentServicesPage.clickOnEditFolder();
        await editFolderDialog.checkFolderDialogIsDisplayed();
        await editFolderDialog.checkCreateUpdateBtnIsEnabled();
        await editFolderDialog.addFolderName(editFolder.entry.name + 'a');
        await editFolderDialog.checkCreateUpdateBtnIsEnabled();
        await editFolderDialog.clickOnCancelButton();
        await editFolderDialog.checkFolderDialogIsNotDisplayed();
        await contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', editFolder.entry.name);
    });

    it('[C260163] Update folder name with an existing one', async () => {
        await contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', editFolder.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', editFolder.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', editFolder.entry.name);
        await expect(await contentServicesPage.isEditFolderButtonEnabled()).toBe(true);
        await contentServicesPage.clickOnEditFolder();
        await editFolderDialog.checkFolderDialogIsDisplayed();
        await editFolderDialog.checkCreateUpdateBtnIsEnabled();
        await editFolderDialog.addFolderName(anotherFolder.entry.name);
        await editFolderDialog.checkCreateUpdateBtnIsEnabled();
        await editFolderDialog.clickOnCreateUpdateButton();
        await editFolderDialog.checkFolderDialogIsDisplayed();
        await notificationHistoryPage.checkNotifyContains('There\'s already a folder with this name. Try a different name.');
    });

    it('[C260164] Edit Folder - Unsupported characters', async () => {
        await contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', editFolder.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', editFolder.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', editFolder.entry.name);
        await contentServicesPage.clickOnEditFolder();
        await editFolderDialog.checkFolderDialogIsDisplayed();

        await editFolderDialog.addFolderName('a*"<>\\/?:|');
        await expect(await editFolderDialog.getValidationMessage()).toBe('Folder name can\'t contain these characters * " < > \\ / ? : |');
        await editFolderDialog.checkCreateUpdateBtnIsDisabled();

        await editFolderDialog.addFolderName('a.a');
        await editFolderDialog.checkValidationMessageIsNotDisplayed();
        await editFolderDialog.checkCreateUpdateBtnIsEnabled();

        await editFolderDialog.addFolderName('a.');
        await expect(await editFolderDialog.getValidationMessage()).toBe('Folder name can\'t end with a period .');
        await editFolderDialog.checkCreateUpdateBtnIsDisabled();

        await BrowserActions.clearSendKeys(editFolderDialog.getFolderNameField(), protractor.Key.SPACE);
        await expect(await editFolderDialog.getValidationMessage()).toBe('Folder name can\'t contain only spaces');
        await editFolderDialog.checkCreateUpdateBtnIsDisabled();

        await editFolderDialog.addFolderName(editFolder.entry.name);
        await editFolderDialog.addFolderDescription('a*"<>\\/?:|');
        await editFolderDialog.checkValidationMessageIsNotDisplayed();
        await editFolderDialog.checkCreateUpdateBtnIsEnabled();

        await editFolderDialog.addFolderDescription('a.');
        await editFolderDialog.checkValidationMessageIsNotDisplayed();
        await editFolderDialog.checkCreateUpdateBtnIsEnabled();

        await editFolderDialog.addFolderDescription('a.a');
        await editFolderDialog.checkValidationMessageIsNotDisplayed();
        await editFolderDialog.checkCreateUpdateBtnIsEnabled();

        await editFolderDialog.getFolderDescriptionField().sendKeys(protractor.Key.SPACE);
        await editFolderDialog.checkValidationMessageIsNotDisplayed();
        await editFolderDialog.checkCreateUpdateBtnIsEnabled();
        await editFolderDialog.clickOnCancelButton();
        await editFolderDialog.checkFolderDialogIsNotDisplayed();

    });

    it('[C260166] Enable/Disable edit folder icon - when file selected', async () => {
        await expect(await contentServicesPage.getDocumentList().dataTablePage().getNumberOfSelectedRows()).toBe(0);
        await expect(await contentServicesPage.isEditFolderButtonEnabled()).toBe(false);
        await contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', filePdfNode.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', filePdfNode.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', filePdfNode.entry.name);
        await expect(await contentServicesPage.isEditFolderButtonEnabled()).toBe(false);

    });

    it('[C260166] Enable/Disable edit folder icon - when multiple folders selected', async () => {
        await contentServicesPage.clickMultiSelectToggle();
        await contentServicesPage.getDocumentList().dataTablePage().waitTillContentLoaded();
        await contentServicesPage.getDocumentList().dataTablePage().checkAllRowsButtonIsDisplayed();
        await contentServicesPage.getDocumentList().dataTablePage().checkAllRows();
        await contentServicesPage.getDocumentList().dataTablePage().waitTillContentLoaded();
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsChecked('Display name', editFolder.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsChecked('Display name', anotherFolder.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().clickCheckbox('Display name', filePdfNode.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsNotChecked('Display name', filePdfNode.entry.name);
        await expect(await contentServicesPage.getDocumentList().dataTablePage().getNumberOfSelectedRows()).toBe(2);
        await expect(await contentServicesPage.isEditFolderButtonEnabled()).toBe(false);
    });

    it('[C260166] Enable/Disable edit folder icon - when single folder selected', async () => {
        await expect(await contentServicesPage.getDocumentList().dataTablePage().getNumberOfSelectedRows()).toBe(0);
        await contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', editFolder.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', editFolder.entry.name);
        await expect(await contentServicesPage.getDocumentList().dataTablePage().getNumberOfSelectedRows()).toBe(1);
        await expect(await contentServicesPage.isEditFolderButtonEnabled()).toBe(true);
    });

    it('[C260165] Update folder name with non-existing one', async () => {
        await contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', editFolder.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', editFolder.entry.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', editFolder.entry.name);
        await contentServicesPage.clickOnEditFolder();
        await editFolderDialog.checkFolderDialogIsDisplayed();
        await editFolderDialog.addFolderName(updateFolderName);
        await editFolderDialog.checkCreateUpdateBtnIsEnabled();
        await editFolderDialog.clickOnCreateUpdateButton();
        await editFolderDialog.checkFolderDialogIsNotDisplayed();
        await contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', updateFolderName);
    });

    describe('Edit Folder - no permission', () => {

        beforeEach(async () => {
            await loginPage.loginToContentServicesUsingUserModel(anotherAcsUser);
            await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/files/' + editFolder.entry.id);
            await contentServicesPage.getDocumentList().dataTablePage().waitTillContentLoaded();

        });

        it('[C260167] Edit folder without permission', async () => {
            await contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', subFolder.entry.name);
            await contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', subFolder.entry.name);
            await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', subFolder.entry.name);
            await expect(await contentServicesPage.isEditFolderButtonEnabled()).toBe(false);
        });

    });

});
