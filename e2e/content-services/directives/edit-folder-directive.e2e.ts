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
    BrowserActions,
    LoginPage,
    NotificationHistoryPage,
    StringUtil,
    UploadActions,
    UserModel,
    UsersActions
} from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../core/pages/content-services.page';
import { FolderDialogPage } from '../../core/pages/dialog/folder-dialog.page';
import { browser, protractor } from 'protractor';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { FileModel } from '../../models/ACS/file.model';
import { NodesApi } from '@alfresco/js-api';

describe('Edit folder directive', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const editFolderDialog = new FolderDialogPage();
    const acsUser = new UserModel();
    const anotherAcsUser = new UserModel();
    const navigationBarPage = new NavigationBarPage();
    const notificationHistoryPage = new NotificationHistoryPage();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const nodesApi = new NodesApi(apiService.getInstance());

    const pdfFile = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_path
    });

    const uploadActions = new UploadActions(apiService);
    const updateFolderName = StringUtil.generateRandomString(5);
    let editFolder; let anotherFolder; let filePdfNode; let subFolder;

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');
        await usersActions.createUser(acsUser);
        await usersActions.createUser(anotherAcsUser);
        await apiService.login(acsUser.username, acsUser.password);

        editFolder = await uploadActions.createFolder(StringUtil.generateRandomString(5), '-my-');
        anotherFolder = await uploadActions.createFolder(StringUtil.generateRandomString(5), '-my-');
        subFolder = await uploadActions.createFolder(StringUtil.generateRandomString(5), editFolder.entry.id);
        filePdfNode = await uploadActions.uploadFile(pdfFile.location, pdfFile.name, '-my-');

        await nodesApi.updateNode(editFolder.entry.id,

            {
                permissions: {
                    locallySet: [{
                        authorityId: anotherAcsUser.username,
                        name: 'Consumer',
                        accessStatus: 'ALLOWED'
                    }]
                }
            });

        await loginPage.login(acsUser.username, acsUser.password);
   });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
        await apiService.loginWithProfile('admin');
        await uploadActions.deleteFileOrFolder(editFolder.entry.id);
        await uploadActions.deleteFileOrFolder(anotherFolder.entry.id);
        await uploadActions.deleteFileOrFolder(filePdfNode.entry.id);
   });

    beforeEach(async () => {
        await navigationBarPage.clickHomeButton();
        await navigationBarPage.navigateToContentServices();
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

        await browser.sleep(3000); // The error needs time to come back

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
        await expect(await editFolderDialog.checkCreateUpdateBtnIsEnabled()).toEqual(false);

        await editFolderDialog.addFolderName('a.a');
        await editFolderDialog.checkValidationMessageIsNotDisplayed();
        await editFolderDialog.checkCreateUpdateBtnIsEnabled();

        await editFolderDialog.addFolderName('a.');
        await expect(await editFolderDialog.getValidationMessage()).toBe('Folder name can\'t end with a period .');
        await expect(await editFolderDialog.checkCreateUpdateBtnIsEnabled()).toEqual(false);

        await BrowserActions.clearSendKeys(editFolderDialog.getFolderNameField(), protractor.Key.SPACE);
        await expect(await editFolderDialog.getValidationMessage()).toBe('Folder name can\'t contain only spaces');
        await expect(await editFolderDialog.checkCreateUpdateBtnIsEnabled()).toEqual(false);

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
            await navigationBarPage.clickLogoutButton();
            await loginPage.login(anotherAcsUser.username, anotherAcsUser.password);
            await BrowserActions.getUrl(browser.baseUrl + '/files/' + editFolder.entry.id);
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
