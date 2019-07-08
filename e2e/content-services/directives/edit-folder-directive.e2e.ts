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

import {BrowserActions, LoginPage, NotificationHistoryPage, StringUtil, UploadActions} from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { FolderDialog } from '../../pages/adf/dialog/folderDialog';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import {browser, protractor} from 'protractor';
import { NavigationBarPage } from "../../pages/adf/navigationBarPage";
import {FileModel} from "../../models/ACS/fileModel";
import resources = require('../../util/resources');

describe('Edit folder directive', function () {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const editFolderDialog = new FolderDialog();
    const acsUser = new AcsUserModel();
    const anotherAcsUser = new AcsUserModel();
    const navigationBarPage = new NavigationBarPage();
    const notificationHistoryPage = new NotificationHistoryPage();
    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf.url
    });

    const pdfFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF.file_location
    });

    const uploadActions = new UploadActions(this.alfrescoJsApi);
    const updateFolderName = StringUtil.generateRandomString(5);
    let editFolder, anotherFolder, filePdfNode, subFolder;


    beforeAll(async (done) => {
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

        done();
    });

    afterAll(async (done) => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await uploadActions.deleteFileOrFolder(editFolder.entry.id);
        await uploadActions.deleteFileOrFolder(anotherFolder.entry.id);
        await uploadActions.deleteFileOrFolder(filePdfNode.entry.id);
        done();
    });

    beforeEach(async (done) => {
        navigationBarPage.clickHomeButton();
        navigationBarPage.clickContentServicesButton();
        contentServicesPage.getContentList().dataTablePage().waitTillContentLoaded();
        done();
    });

    it('[C260161] Update folder - Cancel button', async () => {
        contentServicesPage.getContentList().dataTablePage().selectRow('Display name', editFolder.entry.name);
        contentServicesPage.getContentList().dataTablePage().checkRowIsSelected('Display name', editFolder.entry.name);
        contentServicesPage.clickOnEditFolder();
        editFolderDialog.checkFolderDialogIsDisplayed();
        expect(editFolderDialog.getDialogTitle()).toBe('Edit folder');
        expect(editFolderDialog.getFolderName()).toBe(editFolder.entry.name);
        editFolderDialog.checkCreateUpdateBtnIsEnabled();
        editFolderDialog.checkCancelBtnIsEnabled();
        editFolderDialog.clickOnCancelButton();
        editFolderDialog.checkFolderDialogIsNotDisplayed();
    });

    it('[C260162] Update folder - Introducing letters', async () => {
        contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', editFolder.entry.name);
        contentServicesPage.getContentList().dataTablePage().selectRow('Display name', editFolder.entry.name);
        contentServicesPage.getContentList().dataTablePage().checkRowIsSelected('Display name', editFolder.entry.name);
        expect(contentServicesPage.checkEditFolderButtonIsEnabled()).toBe(true);
        contentServicesPage.clickOnEditFolder();
        editFolderDialog.checkFolderDialogIsDisplayed();
        editFolderDialog.checkCreateUpdateBtnIsEnabled();
        editFolderDialog.addFolderName(editFolder.entry.name + 'a');
        editFolderDialog.checkCreateUpdateBtnIsEnabled();
        editFolderDialog.clickOnCancelButton();
        editFolderDialog.checkFolderDialogIsNotDisplayed();
        contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', editFolder.entry.name);
    });

    it('[C260163] Update folder name with an existing one', async () => {
        contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', editFolder.entry.name);
        contentServicesPage.getContentList().dataTablePage().selectRow('Display name', editFolder.entry.name);
        contentServicesPage.getContentList().dataTablePage().checkRowIsSelected('Display name', editFolder.entry.name);
        expect(contentServicesPage.checkEditFolderButtonIsEnabled()).toBe(true);
        contentServicesPage.clickOnEditFolder();
        editFolderDialog.checkFolderDialogIsDisplayed();
        editFolderDialog.checkCreateUpdateBtnIsEnabled();
        editFolderDialog.addFolderName(anotherFolder.entry.name);
        editFolderDialog.checkCreateUpdateBtnIsEnabled();
        editFolderDialog.clickOnCreateUpdateButton();
        editFolderDialog.checkFolderDialogIsDisplayed();
        notificationHistoryPage.checkNotifyContains('There\'s already a folder with this name. Try a different name.');
    });

    it('[C260164] Edit Folder - Unsupported characters', async () => {
        contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', editFolder.entry.name);
        contentServicesPage.getContentList().dataTablePage().selectRow('Display name', editFolder.entry.name);
        contentServicesPage.getContentList().dataTablePage().checkRowIsSelected('Display name', editFolder.entry.name);
        contentServicesPage.clickOnEditFolder();
        editFolderDialog.checkFolderDialogIsDisplayed();

        editFolderDialog.addFolderName('a*"<>\\/?:|');
        expect(editFolderDialog.getValidationMessage()).toBe('Folder name can\'t contain these characters * " < > \\ / ? : |');
        editFolderDialog.checkCreateUpdateBtnIsDisabled();

        editFolderDialog.addFolderName('a.a');
        editFolderDialog.checkValidationMessageIsNotDisplayed();
        editFolderDialog.checkCreateUpdateBtnIsEnabled();

        editFolderDialog.addFolderName('a.');
        expect(editFolderDialog.getValidationMessage()).toBe('Folder name can\'t end with a period .');
        editFolderDialog.checkCreateUpdateBtnIsDisabled();

        editFolderDialog.getFolderNameField().clear();
        editFolderDialog.getFolderNameField().sendKeys(protractor.Key.SPACE);
        expect(editFolderDialog.getValidationMessage()).toBe('Folder name can\'t contain only spaces');
        editFolderDialog.checkCreateUpdateBtnIsDisabled();

        editFolderDialog.addFolderName(editFolder.entry.name);
        editFolderDialog.addFolderDescription('a*"<>\\/?:|');
        editFolderDialog.checkValidationMessageIsNotDisplayed();
        editFolderDialog.checkCreateUpdateBtnIsEnabled();

        editFolderDialog.addFolderDescription('a.');
        editFolderDialog.checkValidationMessageIsNotDisplayed();
        editFolderDialog.checkCreateUpdateBtnIsEnabled();

        editFolderDialog.addFolderDescription('a.a');
        editFolderDialog.checkValidationMessageIsNotDisplayed();
        editFolderDialog.checkCreateUpdateBtnIsEnabled();

        editFolderDialog.getFolderDescriptionField().sendKeys(protractor.Key.SPACE);
        editFolderDialog.checkValidationMessageIsNotDisplayed();
        editFolderDialog.checkCreateUpdateBtnIsEnabled();
        editFolderDialog.clickOnCancelButton();
        editFolderDialog.checkFolderDialogIsNotDisplayed();

    });

    it('[C260166] Enable/Disable edit folder icon - when file selected', async () => {
        expect(contentServicesPage.getDocumentList().dataTablePage().getNumberOfSelectedRows()).toBe(0);
        expect(contentServicesPage.checkEditFolderButtonIsEnabled()).toBe(false);
        contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', filePdfNode.entry.name);
        contentServicesPage.getContentList().dataTablePage().selectRow('Display name', filePdfNode.entry.name);
        contentServicesPage.getContentList().dataTablePage().checkRowIsSelected('Display name', filePdfNode.entry.name);
        expect(contentServicesPage.checkEditFolderButtonIsEnabled()).toBe(false);

    });

    it('[C260166] Enable/Disable edit folder icon - when multiple folders selected', async () => {
        contentServicesPage.clickMultiSelectToggle();
        contentServicesPage.getContentList().dataTablePage().waitTillContentLoaded();
        contentServicesPage.getContentList().dataTablePage().checkAllRowsButtonIsDisplayed().checkAllRows();
        contentServicesPage.getContentList().dataTablePage().waitTillContentLoaded();
        contentServicesPage.getContentList().dataTablePage().checkRowIsChecked('Display name', editFolder.entry.name);
        contentServicesPage.getContentList().dataTablePage().checkRowIsChecked('Display name', anotherFolder.entry.name);
        contentServicesPage.getContentList().dataTablePage().clickCheckbox('Display name', filePdfNode.entry.name);
        contentServicesPage.getContentList().dataTablePage().checkRowIsNotChecked('Display name', filePdfNode.entry.name);
        expect(contentServicesPage.getContentList().dataTablePage().getNumberOfSelectedRows()).toBe(2);
        expect(contentServicesPage.checkEditFolderButtonIsEnabled()).toBe(false);
    });

    it('[C260166] Enable/Disable edit folder icon - when single folder selected', async () => {
        expect(contentServicesPage.getDocumentList().dataTablePage().getNumberOfSelectedRows()).toBe(0);
        contentServicesPage.getContentList().dataTablePage().selectRow('Display name', editFolder.entry.name);
        contentServicesPage.getContentList().dataTablePage().checkRowIsSelected('Display name', editFolder.entry.name);
        expect(contentServicesPage.getContentList().dataTablePage().getNumberOfSelectedRows()).toBe(1);
        expect(contentServicesPage.checkEditFolderButtonIsEnabled()).toBe(true);
    });

    it('[C260165] Update folder name with non-existing one', async () => {
        contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', editFolder.entry.name);
        contentServicesPage.getContentList().dataTablePage().selectRow('Display name', editFolder.entry.name);
        contentServicesPage.getContentList().dataTablePage().checkRowIsSelected('Display name', editFolder.entry.name);
        contentServicesPage.clickOnEditFolder();
        editFolderDialog.checkFolderDialogIsDisplayed();
        editFolderDialog.addFolderName(updateFolderName);
        editFolderDialog.checkCreateUpdateBtnIsEnabled();
        editFolderDialog.clickOnCreateUpdateButton();
        editFolderDialog.checkFolderDialogIsNotDisplayed();
        contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', updateFolderName);
    });

    describe('Edit Folder - no permission', () => {

        beforeEach(async (done) => {
            loginPage.loginToContentServicesUsingUserModel(anotherAcsUser);
            BrowserActions.getUrl(browser.params.testConfig.adf.url + '/files/' + editFolder.entry.id);
            contentServicesPage.getContentList().dataTablePage().waitTillContentLoaded();
            done();
        });

        it('[C260167] Edit folder without permission', async () => {
            contentServicesPage.getContentList().dataTablePage().checkContentIsDisplayed('Display name', subFolder.entry.name);
            contentServicesPage.getContentList().dataTablePage().selectRow('Display name', subFolder.entry.name);
            contentServicesPage.getContentList().dataTablePage().checkRowIsSelected('Display name', subFolder.entry.name);
            expect(contentServicesPage.checkEditFolderButtonIsEnabled()).toBe(false);
        });

    });

});
