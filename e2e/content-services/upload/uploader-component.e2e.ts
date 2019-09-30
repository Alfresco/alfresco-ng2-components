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

import { element, by, browser } from 'protractor';

import { LoginPage, UploadActions, StringUtil } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { UploadDialog } from '../../pages/adf/dialog/uploadDialog';
import { UploadToggles } from '../../pages/adf/dialog/uploadToggles';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';
import resources = require('../../util/resources');
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { DropActions } from '../../actions/drop.actions';

describe('Upload component', () => {

    const contentServicesPage = new ContentServicesPage();
    const uploadDialog = new UploadDialog();
    const uploadToggles = new UploadToggles();
    const loginPage = new LoginPage();
    const acsUser = new AcsUserModel();
    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);
    const navigationBarPage = new NavigationBarPage();

    const firstPdfFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF_B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF_B.file_location
    });
    const docxFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.DOCX.file_name,
        'location': resources.Files.ADF_DOCUMENTS.DOCX.file_location
    });
    const pdfFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF.file_location
    });
    const pngFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });
    const fileWithSpecificSize = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_400B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_400B.file_location
    });
    const emptyFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });

    beforeAll(async () => {

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        const pdfUploadedFile = await uploadActions.uploadFile(firstPdfFileModel.location, firstPdfFileModel.name, '-my-');

        Object.assign(firstPdfFileModel, pdfUploadedFile.entry);

    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    beforeEach(async () => {
        await contentServicesPage.goToDocumentList();
    });

    describe('', () => {

        afterEach(async () => {
            const nodeList = await contentServicesPage.getElementsDisplayedId();
            for (const node of nodeList) {
                try {
                    await uploadActions.deleteFileOrFolder(node);
                } catch (error) {
                }
            }
        });

        it('[C272788] Should display upload button', async () => {
            await expect(await contentServicesPage.getSingleFileButtonTooltip()).toEqual('Custom tooltip');

            await contentServicesPage.checkUploadButton();
            await contentServicesPage.checkContentIsDisplayed(firstPdfFileModel.name);
        });

        it('[C272789] Should be able to upload PDF file', async () => {
            await contentServicesPage.uploadFile(pdfFileModel.location);
            await contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);

            await uploadDialog.fileIsUploaded(pdfFileModel.name);

            await uploadDialog.clickOnCloseButton();
            await uploadDialog.dialogIsNotDisplayed();
        });

        it('[C272790] Should be able to upload text file', async () => {
            await contentServicesPage.uploadFile(docxFileModel.location);
            await contentServicesPage.checkContentIsDisplayed(docxFileModel.name);

            await uploadDialog.fileIsUploaded(docxFileModel.name);
            await uploadDialog.clickOnCloseButton();
            await uploadDialog.dialogIsNotDisplayed();
        });

        it('[C260141] Should be possible to upload PNG file', async () => {
            await contentServicesPage.uploadFile(pngFileModel.location);
            await contentServicesPage.checkContentIsDisplayed(pngFileModel.name);

            await uploadDialog.fileIsUploaded(pngFileModel.name);
            await uploadDialog.clickOnCloseButton();
            await uploadDialog.dialogIsNotDisplayed();
        });

        it('[C260143] Should be possible to maximize/minimize the upload dialog', async () => {
            await contentServicesPage.uploadFile(docxFileModel.location);
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

        it('[C272794] Should display tooltip for uploading files', async () => {
            await uploadToggles.enableMultipleFileUpload();
            await uploadToggles.checkMultipleFileUploadToggleIsEnabled();
            await expect(await contentServicesPage.getMultipleFileButtonTooltip()).toEqual('Custom tooltip');
            await uploadToggles.disableMultipleFileUpload();
        });

        it('[C279920] Should rename a file uploaded twice', async () => {
            await contentServicesPage.uploadFile(pdfFileModel.location);
            await contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);

            pdfFileModel.setVersion('1');

            await contentServicesPage.uploadFile(pdfFileModel.location);
            await contentServicesPage.checkContentIsDisplayed(pdfFileModel.getVersionName());

            await uploadDialog.clickOnCloseButton();
            await uploadDialog.dialogIsNotDisplayed();

            pdfFileModel.setVersion('');
        });

        it('[C260172] Should be possible to enable versioning', async () => {
            await uploadToggles.enableVersioning();
            await uploadToggles.checkVersioningToggleIsEnabled();

            await contentServicesPage.uploadFile(pdfFileModel.location);
            await contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);

            pdfFileModel.setVersion('1');

            await contentServicesPage.uploadFile(pdfFileModel.location);
            await contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);

            await uploadDialog.fileIsUploaded(pdfFileModel.name);

            await uploadDialog.clickOnCloseButton();
            await uploadDialog.dialogIsNotDisplayed();

            await contentServicesPage.checkContentIsNotDisplayed(pdfFileModel.getVersionName());

            pdfFileModel.setVersion('');
            await uploadToggles.disableVersioning();
        });

        it('[C260174] Should be possible to set a max size', async () => {
            await contentServicesPage.goToDocumentList();
            await contentServicesPage.checkAcsContainer();
            await uploadToggles.enableMaxSize();
            await uploadToggles.checkMaxSizeToggleIsEnabled();
            await uploadToggles.addMaxSize('400');
            await contentServicesPage.uploadFile(fileWithSpecificSize.location);
            await uploadDialog.fileIsUploaded(fileWithSpecificSize.name);
            await uploadDialog.clickOnCloseButton();
            await uploadDialog.dialogIsNotDisplayed();
            await contentServicesPage.deleteContent(fileWithSpecificSize.name);
            await contentServicesPage.checkContentIsNotDisplayed(fileWithSpecificSize.name);
            await uploadToggles.addMaxSize('399');
            await contentServicesPage.uploadFile(fileWithSpecificSize.location);

            //  await expect(await contentServicesPage.getErrorMessage()).toEqual('File ' + fileWithSpecificSize.name + ' is larger than the allowed file size');

            await contentServicesPage.checkContentIsNotDisplayed(fileWithSpecificSize.name);
            await uploadDialog.fileIsNotDisplayedInDialog(fileWithSpecificSize.name);
            await contentServicesPage.uploadFile(emptyFile.location);
            await contentServicesPage.checkContentIsDisplayed(emptyFile.name);
            await uploadDialog.fileIsUploaded(emptyFile.name);
            await uploadDialog.clickOnCloseButton();
            await uploadDialog.dialogIsNotDisplayed();

            await uploadToggles.disableMaxSize();
        });

        it('[C272796] Should be possible to set max size to 0', async () => {
            await contentServicesPage.goToDocumentList();
            await uploadToggles.enableMaxSize();
            await uploadToggles.checkMaxSizeToggleIsEnabled();
            await uploadToggles.addMaxSize('0');
            await contentServicesPage.uploadFile(fileWithSpecificSize.location);
            // await expect(await contentServicesPage.getErrorMessage()).toEqual('File ' + fileWithSpecificSize.name + ' is larger than the allowed file size');

            await uploadDialog.fileIsNotDisplayedInDialog(fileWithSpecificSize.name);
            await contentServicesPage.uploadFile(emptyFile.location);
            await contentServicesPage.checkContentIsDisplayed(emptyFile.name);
            await uploadDialog.fileIsUploaded(emptyFile.name);
            await uploadDialog.clickOnCloseButton();
            await uploadDialog.dialogIsNotDisplayed();

            await uploadToggles.disableMaxSize();
        });

        it('[C272797] Should be possible to set max size to 1', async () => {
            await uploadToggles.enableMaxSize();
            await uploadToggles.checkMaxSizeToggleIsEnabled();
            await browser.sleep(1000);
            await uploadToggles.addMaxSize('1');
            await uploadToggles.disableMaxSize();
            await contentServicesPage.uploadFile(fileWithSpecificSize.location);
            await uploadDialog.fileIsUploaded(fileWithSpecificSize.name);
            await uploadDialog.clickOnCloseButton();
            await uploadDialog.dialogIsNotDisplayed();
            await contentServicesPage.checkContentIsDisplayed(fileWithSpecificSize.name);
        });

        it('[C91318] Should Enable/Disable upload button when change the disable property', async () => {
            await uploadToggles.clickCheckboxDisableUpload();
            await expect(await contentServicesPage.uploadButtonIsEnabled()).toBe(false, 'Upload button is enabled');

            await uploadToggles.clickCheckboxDisableUpload();
            await expect(await contentServicesPage.uploadButtonIsEnabled()).toBe(true, 'Upload button not enabled');
        });
    });

    it('[C260171] Should upload only the extension filter allowed when Enable extension filter is enabled', async () => {
        await uploadToggles.enableExtensionFilter();
        await browser.sleep(1000);
        await uploadToggles.addExtension('.docx');
        await contentServicesPage.uploadFile(docxFileModel.location);
        await contentServicesPage.checkContentIsDisplayed(docxFileModel.name);
        await uploadDialog.removeUploadedFile(docxFileModel.name);
        await uploadDialog.fileIsCancelled(docxFileModel.name);
        await uploadDialog.clickOnCloseButton();
        await uploadDialog.dialogIsNotDisplayed();
        await contentServicesPage.uploadFile(pngFileModel.location);
        await contentServicesPage.checkContentIsNotDisplayed(pngFileModel.name);
        await uploadDialog.dialogIsNotDisplayed();
        await uploadToggles.disableExtensionFilter();
    });

    it('[C274687] Should upload with drag and drop only the extension filter allowed when Enable extension filter is enabled', async () => {
        await uploadToggles.enableExtensionFilter();
        await browser.sleep(1000);
        await uploadToggles.addExtension('.docx');

        const dragAndDrop = new DropActions();
        const dragAndDropArea = element.all(by.css('adf-upload-drag-area div')).first();

        await dragAndDrop.dropFile(dragAndDropArea, docxFileModel.location);
        await contentServicesPage.checkContentIsDisplayed(docxFileModel.name);

        await uploadDialog.removeUploadedFile(docxFileModel.name);
        await uploadDialog.fileIsCancelled(docxFileModel.name);
        await uploadDialog.clickOnCloseButton();
        await uploadDialog.dialogIsNotDisplayed();

        await dragAndDrop.dropFile(dragAndDropArea, pngFileModel.location);
        await contentServicesPage.checkContentIsNotDisplayed(pngFileModel.name);
        await uploadDialog.dialogIsNotDisplayed();
        await uploadToggles.disableExtensionFilter();
    });

    it('[C291921] Should display tooltip for uploading files on a not found location', async () => {
        const folderName = StringUtil.generateRandomString(8);

        const folderUploadedModel = await uploadActions.createFolder(folderName, '-my-');
        await navigationBarPage.openContentServicesFolder(folderUploadedModel.entry.id);
        await contentServicesPage.checkUploadButton();

        await uploadActions.deleteFileOrFolder(folderUploadedModel.entry.id);

        await contentServicesPage.uploadFile(pdfFileModel.location);

        await uploadDialog.displayTooltip();
        await expect(await uploadDialog.getTooltip()).toEqual('Upload location no longer exists [404]');
    });

});
