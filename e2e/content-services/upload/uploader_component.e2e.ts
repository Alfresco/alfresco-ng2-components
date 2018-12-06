/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { LoginPage } from '../../pages/adf/loginPage';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { UploadDialog } from '../../pages/adf/dialog/uploadDialog';
import { UploadToggles } from '../../pages/adf/dialog/uploadToggles';

import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';
import { FolderModel } from '../../models/ACS/folderModel';

import TestConfig = require('../../test.config');
import resources = require('../../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../../actions/ACS/upload.actions';
import { DropActions } from '../../actions/drop.actions';

describe('Upload component', () => {

    let contentServicesPage = new ContentServicesPage();
    let uploadDialog = new UploadDialog();
    let uploadToggles = new UploadToggles();
    let loginPage = new LoginPage();
    let acsUser = new AcsUserModel();
    let uploadActions = new UploadActions();

    let firstPdfFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF_B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF_B.file_location
    });
    let docxFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.DOCX.file_name,
        'location': resources.Files.ADF_DOCUMENTS.DOCX.file_location
    });
    let pdfFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF.file_location
    });
    let pngFileModelTwo = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG_B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG_B.file_location
    });
    let pngFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });
    let largeFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.LARGE_FILE.file_name,
        'location': resources.Files.ADF_DOCUMENTS.LARGE_FILE.file_location
    });
    let fileWithSpecificSize = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_400B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_400B.file_location
    });
    let emptyFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });
    let folderOne = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.FOLDER_ONE.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.FOLDER_ONE.folder_location
    });
    let folderTwo = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.FOLDER_TWO.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.FOLDER_TWO.folder_location
    });
    let uploadedFileInFolder = new FileModel({ 'name': resources.Files.ADF_DOCUMENTS.FILE_INSIDE_FOLDER_ONE.file_name });
    let uploadedFileInFolderTwo = new FileModel({ 'name': resources.Files.ADF_DOCUMENTS.FILE_INSIDE_FOLDER_TWO.file_name });
    let filesLocation = [pdfFileModel.location, docxFileModel.location, pngFileModel.location, firstPdfFileModel.location];
    let filesName = [pdfFileModel.name, docxFileModel.name, pngFileModel.name, firstPdfFileModel.name];

    beforeAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        contentServicesPage.goToDocumentList();

        let pdfUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, firstPdfFileModel.location, firstPdfFileModel.name, '-my-');

        Object.assign(firstPdfFileModel, pdfUploadedFile.entry);

        done();
    });

    beforeEach(() => {
        contentServicesPage.goToDocumentList();
    });

    afterEach(async (done) => {
        let nodesPromise = await contentServicesPage.getContentList().getAllNodeIdInList();

        nodesPromise.forEach(async (currentNodePromise) => {
            await currentNodePromise.then(async (currentNode) => {
                if (currentNode && currentNode !== 'Node id') {
                    await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, currentNode);
                }
            });
        });

        done();
    });

    it('[C272788] Should display upload button', () => {
        expect(contentServicesPage.getSingleFileButtonTooltip()).toEqual('Custom tooltip');

        contentServicesPage
            .checkUploadButton()
            .checkContentIsDisplayed(firstPdfFileModel.name);
    });

    it('[C260173] Should be able to upload folder when enabled', () => {
        uploadToggles.enableFolderUpload();
        contentServicesPage.uploadFolder(folderOne.location);

        contentServicesPage.checkContentIsDisplayed(folderOne.name);
        expect(contentServicesPage.getFolderButtonTooltip()).toEqual('Custom tooltip');
        uploadDialog.fileIsUploaded(uploadedFileInFolder.name);
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.doubleClickRow(folderOne.name).checkContentIsDisplayed(uploadedFileInFolder.name);
        contentServicesPage.goToDocumentList();
        uploadToggles.disableFolderUpload();
    });

    it('[C272789] Should be able to upload PDF file', () => {
        contentServicesPage
            .uploadFile(pdfFileModel.location)
            .checkContentIsDisplayed(pdfFileModel.name);

        uploadDialog.fileIsUploaded(pdfFileModel.name);

        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
    });

    it('[C272790] Should be able to upload text file', () => {
        contentServicesPage
            .uploadFile(docxFileModel.location)
            .checkContentIsDisplayed(docxFileModel.name);

        uploadDialog.fileIsUploaded(docxFileModel.name);
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
    });

    it('[C260141] Should be possible to upload PNG file', () => {
        contentServicesPage
            .uploadFile(pngFileModel.location)
            .checkContentIsDisplayed(pngFileModel.name);

        uploadDialog.fileIsUploaded(pngFileModel.name);
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
    });

    it('[C260143] Should be possible to maximize/minimize the upload dialog', () => {
        contentServicesPage
            .uploadFile(docxFileModel.location)
            .checkContentIsDisplayed(docxFileModel.name);

        uploadDialog.fileIsUploaded(docxFileModel.name).checkCloseButtonIsDisplayed();
        expect(uploadDialog.getTitleText()).toEqual('Uploaded 1 / 1');
        expect(uploadDialog.numberOfCurrentFilesUploaded()).toEqual('1');
        expect(uploadDialog.numberOfInitialFilesUploaded()).toEqual('1');
        uploadDialog.minimizeUploadDialog().dialogIsMinimized();
        expect(uploadDialog.getTitleText()).toEqual('Uploaded 1 / 1');
        expect(uploadDialog.numberOfCurrentFilesUploaded()).toEqual('1');
        expect(uploadDialog.numberOfInitialFilesUploaded()).toEqual('1');
        uploadDialog.maximizeUploadDialog().dialogIsDisplayed().fileIsUploaded(docxFileModel.name);
        expect(uploadDialog.getTitleText()).toEqual('Uploaded 1 / 1');
        expect(uploadDialog.numberOfCurrentFilesUploaded()).toEqual('1');
        expect(uploadDialog.numberOfInitialFilesUploaded()).toEqual('1');
        uploadDialog.checkCloseButtonIsDisplayed().clickOnCloseButton().dialogIsNotDisplayed();
    });

    it('[C260168] Should be possible to cancel upload using dialog icon', () => {
        contentServicesPage.uploadFile(pdfFileModel.location)
            .checkContentIsDisplayed(pdfFileModel.name);
        uploadDialog.removeUploadedFile(pdfFileModel.name).fileIsCancelled(pdfFileModel.name);
        expect(uploadDialog.getTitleText()).toEqual('Upload canceled');
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.checkContentIsNotDisplayed(pdfFileModel.name);
    });

    it('[C272792] Should be possible to cancel upload of a big file using row cancel icon', () => {
        browser.executeScript(' setTimeout(() => {document.querySelector(\'mat-icon[class*="adf-file-uploading-row__action"]\').click();}, 3000)');

        contentServicesPage.uploadFile(largeFile.location);

        expect(uploadDialog.getTitleText()).toEqual('Upload canceled');
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.checkContentIsNotDisplayed(largeFile.name);
    });

    it('[C287790] Should be possible to cancel upload of a big file through the cancel uploads button', () => {
        browser.executeScript(' setTimeout(() => {document.querySelector("#adf-upload-dialog-cancel-all").click();' +
            'document.querySelector("#adf-upload-dialog-cancel").click();  }, 3000)');

        contentServicesPage.uploadFile(largeFile.location);

        expect(uploadDialog.getTitleText()).toEqual('Upload canceled');
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.checkContentIsNotDisplayed(largeFile.name);
    });

    it('[C272793] Should be able to cancel multiple files upload', () => {
        browser.executeScript(' setTimeout(() => {document.querySelector("#adf-upload-dialog-cancel-all").click();' +
            'document.querySelector("#adf-upload-dialog-cancel").click();  }, 3000)');

        uploadToggles.enableMultipleFileUpload();
        contentServicesPage.uploadMultipleFile([pngFileModel.location, largeFile.location]);
        expect(uploadDialog.getTitleText()).toEqual('Upload canceled');
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.checkContentIsNotDisplayed(pngFileModel.name).checkContentIsNotDisplayed(largeFile.name);
        uploadToggles.disableMultipleFileUpload();
    });

    it('[C272794] Should display tooltip for uploading files', () => {
        uploadToggles.enableMultipleFileUpload();
        browser.driver.sleep(1000);
        expect(contentServicesPage.getMultipleFileButtonTooltip()).toEqual('Custom tooltip');
        uploadToggles.disableMultipleFileUpload();
    });

    it('[C260171] Should upload only the extension filter allowed when Enable extension filter is enabled', () => {
        uploadToggles.enableExtensionFilter();
        browser.driver.sleep(1000);
        uploadToggles.addExtension('.docx');
        contentServicesPage.uploadFile(docxFileModel.location).checkContentIsDisplayed(docxFileModel.name);
        uploadDialog.removeUploadedFile(docxFileModel.name).fileIsCancelled(docxFileModel.name);
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.uploadFile(pngFileModel.location).checkContentIsNotDisplayed(pngFileModel.name);
        uploadDialog.dialogIsNotDisplayed();
        uploadToggles.disableExtensionFilter();
    });

    it('[C274687] Should upload with drag and drop only the extension filter allowed when Enable extension filter is enabled', () => {
        uploadToggles.enableExtensionFilter();
        browser.driver.sleep(1000);
        uploadToggles.addExtension('.docx');

        let dragAndDrop = new DropActions();
        let dragAndDropArea = element.all(by.css('adf-upload-drag-area div')).first();

        dragAndDrop.dropFile(dragAndDropArea, docxFileModel.location);
        contentServicesPage.checkContentIsDisplayed(docxFileModel.name);

        uploadDialog.removeUploadedFile(docxFileModel.name).fileIsCancelled(docxFileModel.name);
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

        dragAndDrop.dropFile(dragAndDropArea, pngFileModel.location);
        contentServicesPage.checkContentIsNotDisplayed(pngFileModel.name);
        uploadDialog.dialogIsNotDisplayed();
        uploadToggles.disableExtensionFilter();
    });

    it('[C279920] Should rename a file uploaded twice', () => {
        contentServicesPage
            .uploadFile(pdfFileModel.location)
            .checkContentIsDisplayed(pdfFileModel.name);

        pdfFileModel.setVersion('1');

        contentServicesPage
            .uploadFile(pdfFileModel.location)
            .checkContentIsDisplayed(pdfFileModel.getVersionName());

        uploadDialog
            .clickOnCloseButton()
            .dialogIsNotDisplayed();

        pdfFileModel.setVersion('');
    });

    it('[C260172] Should be possible to enable versioning', () => {
        uploadToggles.enableVersioning();

        contentServicesPage
            .uploadFile(pdfFileModel.location)
            .checkContentIsDisplayed(pdfFileModel.name);

        pdfFileModel.setVersion('1');

        contentServicesPage
            .uploadFile(pdfFileModel.location)
            .checkContentIsDisplayed(pdfFileModel.name);

        uploadDialog
            .fileIsUploaded(pdfFileModel.name);

        uploadDialog
            .clickOnCloseButton()
            .dialogIsNotDisplayed();

        contentServicesPage
            .checkContentIsNotDisplayed(pdfFileModel.getVersionName());

        pdfFileModel.setVersion('');
        uploadToggles.disableVersioning();
    });

    it('[C260176] Should remove files from upload dialog box when closed', () => {
        contentServicesPage.uploadFile(pngFileModelTwo.location).checkContentIsDisplayed(pngFileModelTwo.name);

        uploadDialog.fileIsUploaded(pngFileModelTwo.name);

        contentServicesPage.uploadFile(pngFileModel.location).checkContentIsDisplayed(pngFileModel.name);

        uploadDialog.fileIsUploaded(pngFileModel.name).fileIsUploaded(pngFileModelTwo.name);
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

        contentServicesPage.uploadFile(pdfFileModel.location).checkContentIsDisplayed(pdfFileModel.name);

        uploadDialog.fileIsUploaded(pdfFileModel.name).fileIsNotDisplayedInDialog(pngFileModel.name).fileIsNotDisplayedInDialog(pngFileModelTwo.name);
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
    });

    it('[C260170] Should be possible to upload multiple files', () => {
        contentServicesPage.goToDocumentList();
        contentServicesPage.checkAcsContainer();

        uploadToggles.enableMultipleFileUpload();

        contentServicesPage.uploadMultipleFile(filesLocation).checkContentsAreDisplayed(filesName);

        uploadDialog.filesAreUploaded(filesName);

        expect(uploadDialog.getTitleText()).toEqual('Uploaded 4 / 4');

        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

        uploadToggles.disableMultipleFileUpload();
    });

    it('[C260174] Should be possible to set a max size', () => {
        contentServicesPage.goToDocumentList();
        contentServicesPage.checkAcsContainer();
        uploadToggles.enableMaxSize();
        uploadToggles.addMaxSize('400');
        contentServicesPage.uploadFile(fileWithSpecificSize.location);
        uploadDialog.fileIsUploaded(fileWithSpecificSize.name).clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.deleteContent(fileWithSpecificSize.name).checkContentIsNotDisplayed(fileWithSpecificSize.name);
        uploadToggles.addMaxSize('399');
        contentServicesPage.uploadFile(fileWithSpecificSize.location);

      //  expect(contentServicesPage.getErrorMessage()).toEqual('File ' + fileWithSpecificSize.name + ' is larger than the allowed file size');

        contentServicesPage.checkContentIsNotDisplayed(fileWithSpecificSize.name);
        uploadDialog.fileIsNotDisplayedInDialog(fileWithSpecificSize.name);
        contentServicesPage.uploadFile(emptyFile.location).checkContentIsDisplayed(emptyFile.name);
        uploadDialog.fileIsUploaded(emptyFile.name).clickOnCloseButton().dialogIsNotDisplayed();

        uploadToggles.disableMaxSize();
    });

    it('[C272796] Should be possible to set max size to 0', () => {
        contentServicesPage.goToDocumentList();
        uploadToggles.enableMaxSize();
        uploadToggles.addMaxSize('0');
        contentServicesPage.uploadFile(fileWithSpecificSize.location);
        // expect(contentServicesPage.getErrorMessage()).toEqual('File ' + fileWithSpecificSize.name + ' is larger than the allowed file size');

        uploadDialog.fileIsNotDisplayedInDialog(fileWithSpecificSize.name);
        contentServicesPage.uploadFile(emptyFile.location).checkContentIsDisplayed(emptyFile.name);
        uploadDialog.fileIsUploaded(emptyFile.name).clickOnCloseButton().dialogIsNotDisplayed();

        uploadToggles.disableMaxSize();
    });

    it('[C272797] Should be possible to set max size to 1', () => {
        uploadToggles.enableMaxSize();
        browser.driver.sleep(1000);
        uploadToggles.addMaxSize('1');
        uploadToggles.disableMaxSize();
        contentServicesPage.uploadFile(fileWithSpecificSize.location);
        uploadDialog.fileIsUploaded(fileWithSpecificSize.name).clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.checkContentIsDisplayed(fileWithSpecificSize.name);
    });

    it('[C91318] Should Enable/Disable upload button when change the disable property', () => {
        uploadToggles.clickCheckboxDisableUpload();
        expect(contentServicesPage.uploadButtonIsEnabled()).toBeFalsy();

        uploadToggles.clickCheckboxDisableUpload();
        expect(contentServicesPage.uploadButtonIsEnabled()).toBeTruthy();
    });

    it('[C279882] Should be possible Upload a folder in a folder', () => {
        uploadToggles.enableFolderUpload();
        browser.driver.sleep(1000);
        contentServicesPage.uploadFolder(folderOne.location).checkContentIsDisplayed(folderOne.name);
        uploadDialog.fileIsUploaded(uploadedFileInFolder.name);

        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.doubleClickRow(folderOne.name).checkContentIsDisplayed(uploadedFileInFolder.name);

        uploadToggles.enableFolderUpload();
        browser.driver.sleep(1000);
        contentServicesPage.uploadFolder(folderTwo.location).checkContentIsDisplayed(folderTwo.name);
        uploadDialog.fileIsUploaded(uploadedFileInFolderTwo.name);

        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.doubleClickRow(folderTwo.name).checkContentIsDisplayed(uploadedFileInFolderTwo.name);

        uploadToggles.disableFolderUpload();
    });

});
