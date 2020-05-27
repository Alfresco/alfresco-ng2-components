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

import { BrowserActions, LoginSSOPage, UploadActions } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/content-services.page';
import { UploadDialogPage } from '../../pages/adf/dialog/upload-dialog.page';
import { UploadTogglesPage } from '../../pages/adf/dialog/upload-toggles.page';
import { AcsUserModel } from '../../models/ACS/acs-user.model';
import { FileModel } from '../../models/ACS/file.model';
import { browser } from 'protractor';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { VersionManagePage } from '../../pages/adf/version-manager.page';
import { FolderModel } from '../../models/ACS/folder.model';

describe('Upload component', () => {

    const contentServicesPage = new ContentServicesPage();
    const uploadDialog = new UploadDialogPage();
    const uploadToggles = new UploadTogglesPage();
    const loginPage = new LoginSSOPage();
    const acsUser = new AcsUserModel();
    const versionManagePage = new VersionManagePage();
    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);

    const firstPdfFileModel = new FileModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.PDF_B.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.PDF_B.file_location
    });
    const docxFileModel = new FileModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.DOCX.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.DOCX.file_location
    });
    const pdfFileModel = new FileModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_location
    });
    const pngFileModelTwo = new FileModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.PNG_B.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.PNG_B.file_location
    });
    const pngFileModel = new FileModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_location
    });
    const filesLocation = [pdfFileModel.location, docxFileModel.location, pngFileModel.location, firstPdfFileModel.location];
    const filesName = [pdfFileModel.name, docxFileModel.name, pngFileModel.name, firstPdfFileModel.name];

    const parentFolder = new FolderModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.FOLDER_ONE.folder_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.FOLDER_ONE.folder_location
    });

    const fileInsideParentFolder = new FolderModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.FILE_INSIDE_FOLDER_ONE.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.FILE_INSIDE_FOLDER_ONE.file_location
    });
    const subFolder = new FolderModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.FOLDER_TWO.folder_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.FOLDER_TWO.folder_location
    });

    const fileInsideSubFolder = new FolderModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.FILE_INSIDE_FOLDER_TWO.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.FILE_INSIDE_FOLDER_TWO.file_location
    });

    const adfBigFolder = new FolderModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.ADF_FOLDER.folder_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.ADF_FOLDER.folder_location
    });

    beforeAll(async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
        await loginPage.login(acsUser.email, acsUser.password);
        await contentServicesPage.goToDocumentList();
   });

    beforeEach(async () => {
        await contentServicesPage.goToDocumentList();
    });

    afterEach(async () => {
        const nbResults = await contentServicesPage.numberOfResultsDisplayed();
        if (nbResults > 1) {
            const nodesPromise = await contentServicesPage.getElementsDisplayedId();
            for (const node of nodesPromise) {
                const nodeId = await node;
                await uploadActions.deleteFileOrFolder(nodeId);
            }
        }
    });

    it('[C260143] Should be possible to maximize/minimize the upload dialog', async () => {
        await contentServicesPage
            .uploadFile(docxFileModel.location);
        await contentServicesPage.checkContentIsDisplayed(docxFileModel.name);

        await uploadDialog.fileIsUploaded(docxFileModel.name);
        await uploadDialog.checkCloseButtonIsDisplayed();
        await expect(await uploadDialog.numberOfCurrentFilesUploaded()).toEqual('1');
        await expect(await uploadDialog.numberOfInitialFilesUploaded()).toEqual('1');
        await uploadDialog.minimizeUploadDialog();
        await uploadDialog.dialogIsMinimized();
        await expect(await uploadDialog.numberOfCurrentFilesUploaded()).toEqual('1');
        await expect(await uploadDialog.numberOfInitialFilesUploaded()).toEqual('1');
        await uploadDialog.maximizeUploadDialog();
        await uploadDialog.dialogIsDisplayed();
        await uploadDialog.fileIsUploaded(docxFileModel.name);
        await expect(await uploadDialog.numberOfCurrentFilesUploaded()).toEqual('1');
        await expect(await uploadDialog.numberOfInitialFilesUploaded()).toEqual('1');
        await uploadDialog.checkCloseButtonIsDisplayed();
        await uploadDialog.clickOnCloseButton();
        await uploadDialog.dialogIsNotDisplayed();
    });

    it('[C291902] Should be shown upload counter display in dialog box', async () => {
        await contentServicesPage
            .uploadFile(docxFileModel.location);
        await contentServicesPage.checkContentIsDisplayed(docxFileModel.name);

        await uploadDialog.fileIsUploaded(docxFileModel.name);
        await uploadDialog.checkCloseButtonIsDisplayed();
        await expect(await uploadDialog.getTitleText()).toEqual('Uploaded 1 / 1');
        await uploadDialog.checkCloseButtonIsDisplayed();
        await uploadDialog.clickOnCloseButton();
        await uploadDialog.dialogIsNotDisplayed();
    });

    it('[C260168] Should be possible to cancel upload using dialog icon', async () => {
        await contentServicesPage.uploadFile(pdfFileModel.location);
        await contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);
        await uploadDialog.removeUploadedFile(pdfFileModel.name);
        await uploadDialog.fileIsCancelled(pdfFileModel.name);
        await expect(await uploadDialog.getTitleText()).toEqual('Upload canceled');
        await uploadDialog.clickOnCloseButton();
        await uploadDialog.dialogIsNotDisplayed();
        await contentServicesPage.checkContentIsNotDisplayed(pdfFileModel.name);
    });

    it('[C260176] Should remove files from upload dialog box when closed', async () => {
        await contentServicesPage.uploadFile(pngFileModelTwo.location);
        await contentServicesPage.checkContentIsDisplayed(pngFileModelTwo.name);

        await uploadDialog.fileIsUploaded(pngFileModelTwo.name);
        await contentServicesPage.uploadFile(pngFileModel.location);
        await contentServicesPage.checkContentIsDisplayed(pngFileModel.name);
        await uploadDialog.fileIsUploaded(pngFileModel.name);
        await uploadDialog.fileIsUploaded(pngFileModelTwo.name);
        await uploadDialog.clickOnCloseButton();
        await uploadDialog.dialogIsNotDisplayed();
        await contentServicesPage.uploadFile(pdfFileModel.location);
        await contentServicesPage .checkContentIsDisplayed(pdfFileModel.name);
        await uploadDialog.fileIsUploaded(pdfFileModel.name);
        await uploadDialog.fileIsNotDisplayedInDialog(pngFileModel.name);
        await uploadDialog.fileIsNotDisplayedInDialog(pngFileModelTwo.name);
        await uploadDialog.clickOnCloseButton();
        await uploadDialog.dialogIsNotDisplayed();
    });

    it('[C260170] Should be possible to upload multiple files', async () => {
        await contentServicesPage.checkAcsContainer();
        await uploadToggles.enableMultipleFileUpload();
        await contentServicesPage.uploadMultipleFile(filesLocation);
        await contentServicesPage.checkContentsAreDisplayed(filesName);
        await uploadDialog.filesAreUploaded(filesName);
        await expect(await uploadDialog.getTitleText()).toEqual('Uploaded 4 / 4');
        await uploadDialog.clickOnCloseButton();
        await uploadDialog.dialogIsNotDisplayed();
        await uploadToggles.disableMultipleFileUpload();
    });

    it('[C311305] Should NOT be able to remove uploaded version', async () => {
        await contentServicesPage.uploadFile(docxFileModel.location);
        await uploadDialog.fileIsUploaded(docxFileModel.name);
        await contentServicesPage.checkContentIsDisplayed(docxFileModel.name);

        await contentServicesPage.versionManagerContent(docxFileModel.name);
        await BrowserActions.click(versionManagePage.showNewVersionButton);
        await versionManagePage.uploadNewVersionFile(pngFileModel.location);
        await versionManagePage.closeVersionDialog();
        await uploadDialog.removeUploadedFile(pngFileModel.name);
        await contentServicesPage.checkContentIsDisplayed(pngFileModel.name);
        await uploadDialog.clickOnCloseButton();
        await uploadDialog.dialogIsNotDisplayed();
    });

    it('[C291893] Should enable folder upload in selected node', async () => {
        await contentServicesPage.checkUploadButton();
        await expect(await uploadToggles.checkFolderUploadToggleIsNotEnabled()).toBe(true);

        await uploadToggles.enableFolderUpload();
        await expect(await uploadToggles.checkFolderUploadToggleIsEnabled()).toBe(true);
        await contentServicesPage.uploadFolder(parentFolder.location);
        await uploadDialog.fileIsUploaded(fileInsideParentFolder.name);
        await expect(await uploadDialog.numberOfCurrentFilesUploaded()).toEqual('1');
        await expect(await uploadDialog.numberOfInitialFilesUploaded()).toEqual('1');
        await uploadDialog.clickOnCloseButton();
        await uploadDialog.dialogIsNotDisplayed();

        await contentServicesPage.openFolder(parentFolder.name);
        await expect(await uploadToggles.checkFolderUploadToggleIsNotEnabled()).toBe(true);
        await uploadToggles.enableFolderUpload();
        await expect(await uploadToggles.checkFolderUploadToggleIsEnabled()).toBe(true);
        await contentServicesPage.uploadFolder(subFolder.location);
        await uploadDialog.fileIsUploaded(fileInsideSubFolder.name);
        await uploadDialog.clickOnCloseButton();
        await uploadDialog.dialogIsNotDisplayed();

        await uploadToggles.enableFolderUpload();
        await browser.executeScript(` setInterval(() => {
               if(document.querySelector('[data-automation-id="adf"]')){
                    document.querySelector("#adf-upload-dialog-cancel-all").click();
                    document.querySelector("#adf-upload-dialog-cancel").click();
                }
              }, 2000)`);
        await contentServicesPage.uploadFolder(adfBigFolder.location);

        await expect(await uploadDialog.getTitleText()).toEqual('Upload canceled');
        await uploadDialog.clickOnCloseButton();
        await uploadDialog.dialogIsNotDisplayed();
        await contentServicesPage.openFolder(adfBigFolder.name);
        await expect(contentServicesPage.numberOfResultsDisplayed()).toBe(0);
    });
});
