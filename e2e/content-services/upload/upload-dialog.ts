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

import { BrowserActions, LoginPage, UploadActions } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { UploadDialog } from '../../pages/adf/dialog/uploadDialog';
import { UploadToggles } from '../../pages/adf/dialog/uploadToggles';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';
import { browser } from 'protractor';
import resources = require('../../util/resources');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { VersionManagePage } from '../../pages/adf/versionManagerPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

describe('Upload component', () => {

    const contentServicesPage = new ContentServicesPage();
    const uploadDialog = new UploadDialog();
    const uploadToggles = new UploadToggles();
    const loginPage = new LoginPage();
    const acsUser = new AcsUserModel();
    const versionManagePage = new VersionManagePage();
    const navigationBarPage = new NavigationBarPage();

    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);

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
    const pngFileModelTwo = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG_B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG_B.file_location
    });
    const pngFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });
    const filesLocation = [pdfFileModel.location, docxFileModel.location, pngFileModel.location, firstPdfFileModel.location];
    const filesName = [pdfFileModel.name, docxFileModel.name, pngFileModel.name, firstPdfFileModel.name];

    beforeAll(async () => {

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
        await loginPage.loginToContentServicesUsingUserModel(acsUser);
        await contentServicesPage.goToDocumentList();
        const pdfUploadedFile = await uploadActions.uploadFile(firstPdfFileModel.location, firstPdfFileModel.name, '-my-');
        Object.assign(firstPdfFileModel, pdfUploadedFile.entry);

    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();

    });

    beforeEach(async () => {
        await contentServicesPage.goToDocumentList();
    });

    afterEach(async () => {
        const nbResults = await contentServicesPage.numberOfResultsDisplayed();
        if (nbResults > 1) {
            const nodesPromise = await contentServicesPage.getElementsDisplayedId();

            nodesPromise.forEach(async (currentNodePromise) => {
                const nodeId = await currentNodePromise;
                await uploadActions.deleteFileOrFolder(nodeId);
            });
        }
    });

    it('[C260143] Should be possible to maximize/minimize the upload dialog', async () => {
        await contentServicesPage.uploadFile(docxFileModel.location);

        await contentServicesPage.checkContentIsDisplayed(docxFileModel.name);

        await uploadDialog.fileIsUploaded(docxFileModel.name);
        await uploadDialog.checkCloseButtonIsDisplayed();
        await expect(uploadDialog.numberOfCurrentFilesUploaded()).toEqual('1');
        await expect(uploadDialog.numberOfInitialFilesUploaded()).toEqual('1');
        await uploadDialog.minimizeUploadDialog();
        await uploadDialog.dialogIsMinimized();
        await expect(uploadDialog.numberOfCurrentFilesUploaded()).toEqual('1');
        await expect(uploadDialog.numberOfInitialFilesUploaded()).toEqual('1');
        await uploadDialog.maximizeUploadDialog();
        await uploadDialog.dialogIsDisplayed();
        await uploadDialog.fileIsUploaded(docxFileModel.name);
        await expect(uploadDialog.numberOfCurrentFilesUploaded()).toEqual('1');
        await expect(uploadDialog.numberOfInitialFilesUploaded()).toEqual('1');
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
        await expect(uploadDialog.getTitleText()).toEqual('Uploaded 1 / 1');
        await uploadDialog.checkCloseButtonIsDisplayed();
        await uploadDialog.clickOnCloseButton();
        await uploadDialog.dialogIsNotDisplayed();
    });

    it('[C260168] Should be possible to cancel upload using dialog icon', async () => {
        await contentServicesPage.uploadFile(pdfFileModel.location);
        await contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);
        await uploadDialog.removeUploadedFile(pdfFileModel.name);
        await uploadDialog.fileIsCancelled(pdfFileModel.name);
        await expect(uploadDialog.getTitleText()).toEqual('Upload canceled');
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
        await contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);
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
        await expect(uploadDialog.getTitleText()).toEqual('Uploaded 4 / 4');
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
        await versionManagePage.uploadNewVersionFile(
            pngFileModel.location
        );
        await versionManagePage.closeVersionDialog();
        await uploadDialog.removeUploadedFile(pngFileModel.name);
        await contentServicesPage.checkContentIsDisplayed(pngFileModel.name);
    });
});
