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

import LoginPage = require('../pages/adf/loginPage');
import ContentServicesPage = require('../pages/adf/contentServicesPage');
import UploadDialog = require('../pages/adf/dialog/uploadDialog');
import UploadToggles = require('../pages/adf/dialog/uploadToggles');

import AcsUserModel = require('../models/ACS/acsUserModel');
import FileModel = require('../models/ACS/fileModel');
import FolderModel = require('../models/ACS/folderModel');

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../actions/ACS/upload.actions';
import { DropActions } from '../actions/drop.actions';

describe('Upload component', () => {

    let contentServicesPage = new ContentServicesPage();
    let uploadDialog = new UploadDialog();
    let uploadToggles = new UploadToggles();
    let loginPage = new LoginPage();
    let acsUser = new AcsUserModel();

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
        let uploadActions = new UploadActions();

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

    it('[C272788] Upload Button is visible on the page', () => {
        expect(contentServicesPage.getSingleFileButtonTooltip()).toEqual('Custom tooltip');

        contentServicesPage
            .checkUploadButton()
            .checkContentIsDisplayed(firstPdfFileModel.name);

        contentServicesPage
            .deleteContent(firstPdfFileModel.name)
            .checkContentIsNotDisplayed(pdfFileModel.name);
    });

    it('[C272789] Upload a pdf file', () => {
        contentServicesPage
            .uploadFile(pdfFileModel.location)
            .checkContentIsDisplayed(pdfFileModel.name);

        uploadDialog.fileIsUploaded(pdfFileModel.name);

        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

        contentServicesPage
            .deleteContent(pdfFileModel.name)
            .checkContentIsNotDisplayed(pdfFileModel.name);
    });

    it('[C272790] Upload a text file', () => {
        contentServicesPage
            .uploadFile(docxFileModel.location)
            .checkContentIsDisplayed(docxFileModel.name);

        uploadDialog.fileIsUploaded(docxFileModel.name);
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

        contentServicesPage
            .deleteContent(docxFileModel.name)
            .checkContentIsNotDisplayed(docxFileModel.name);
    });

    it('[C260141] Upload a png file', () => {
        contentServicesPage
            .uploadFile(pngFileModel.location)
            .checkContentIsDisplayed(pngFileModel.name);

        uploadDialog.fileIsUploaded(pngFileModel.name);
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

        contentServicesPage
            .deleteContent(pngFileModel.name)
            .checkContentIsNotDisplayed(pngFileModel.name);
    });

    it('[C260143] Minimize and maximize the upload dialog box', () => {
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
        contentServicesPage.deleteContent(docxFileModel.name).checkContentIsNotDisplayed(docxFileModel.name);
    });

    it('[C260168] Cancel the uploaded file through the upload dialog icon', () => {
        contentServicesPage.uploadFile(pdfFileModel.location)
            .checkContentIsDisplayed(pdfFileModel.name);
        uploadDialog.removeUploadedFile(pdfFileModel.name).fileIsCancelled(pdfFileModel.name);
        expect(uploadDialog.getTitleText()).toEqual('Upload canceled');
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.checkContentIsNotDisplayed(pdfFileModel.name);
    });

    xit('[C272792] Cancel a big file through the upload dialog icon before the upload to be done', () => {
        contentServicesPage.uploadFile(largeFile.location);

        uploadDialog.removeFileWhileUploading(largeFile.name).fileIsCancelled(largeFile.name);

        expect(uploadDialog.getTitleText()).toEqual('Upload canceled');
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.checkContentIsNotDisplayed(largeFile.name);
    });

    xit('[C260169] Cancel a big file through the cancel uploads button', () => {
        contentServicesPage.uploadFile(largeFile.location);
        uploadDialog.cancelUploads();
        expect(uploadDialog.getTitleText()).toEqual('Uploading 0 / 1');
        expect(uploadDialog.getConfirmationDialogTitleText()).toEqual('Cancel Upload');
        expect(uploadDialog.getConfirmationDialogDescriptionText()).toEqual('Stop uploading and remove files already uploaded.');
        uploadDialog.clickOnConfirmationDialogYesButton().fileIsCancelled(largeFile.name);
        expect(uploadDialog.getTitleText()).toEqual('Upload canceled');
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.checkContentIsNotDisplayed(largeFile.name);
    });

    xit('[C272793] Cancel uploading multiple files', () => {
        uploadToggles.enableMultipleFileUpload();
        contentServicesPage.uploadMultipleFile([pngFileModel.location, largeFile.location]);
        uploadDialog.cancelUploads();
        expect(uploadDialog.getConfirmationDialogTitleText()).toEqual('Cancel Upload');
        expect(uploadDialog.getConfirmationDialogDescriptionText()).toEqual('Stop uploading and remove files already uploaded.');
        uploadDialog.clickOnConfirmationDialogYesButton().fileIsCancelled(pngFileModel.name).fileIsCancelled(largeFile.name);
        expect(uploadDialog.getTitleText()).toEqual('Upload canceled');
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.checkContentIsNotDisplayed(pngFileModel.name).checkContentIsNotDisplayed(largeFile.name);
        uploadToggles.disableMultipleFileUpload();
    });

    it('[C272794] Tooltip of uploading multiple files button', () => {
        uploadToggles.enableMultipleFileUpload();
        expect(contentServicesPage.getMultipleFileButtonTooltip()).toEqual('Custom tooltip');
        uploadToggles.disableMultipleFileUpload();
    });

    it('[C260171] Should upload only the extension filter allowed when Enable extension filter is enabled', () => {
        uploadToggles.enableExtensionFilter().addExtension('.docx');
        contentServicesPage.uploadFile(docxFileModel.location).checkContentIsDisplayed(docxFileModel.name);
        uploadDialog.removeUploadedFile(docxFileModel.name).fileIsCancelled(docxFileModel.name);
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.uploadFile(largeFile.location).checkContentIsNotDisplayed(largeFile.name);
        uploadDialog.dialogIsNotDisplayed();
        uploadToggles.disableExtensionFilter();
    });

    it('[C274687] Should upload with drag and drop only the extension filter allowed when Enable extension filter is enabled', () => {
        uploadToggles.enableExtensionFilter().addExtension('.docx');

        let dragAndDrop = new DropActions();
        let dragAndDropArea = element(by.css('adf-upload-drag-area div'));

        dragAndDrop.dropFile(dragAndDropArea, docxFileModel.location);
        contentServicesPage.checkContentIsDisplayed(docxFileModel.name);

        uploadDialog.removeUploadedFile(docxFileModel.name).fileIsCancelled(docxFileModel.name);
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

        dragAndDrop.dropFile(dragAndDropArea, largeFile.location);
        contentServicesPage.checkContentIsNotDisplayed(largeFile.name);
        uploadDialog.dialogIsNotDisplayed();
        uploadToggles.disableExtensionFilter();
    });

    it('[C279920] Upload same file twice', () => {
        contentServicesPage.uploadFile(pdfFileModel.location).checkContentIsDisplayed(pdfFileModel.name);
        pdfFileModel.setVersion('1');
        contentServicesPage.uploadFile(pdfFileModel.location).checkContentIsDisplayed(pdfFileModel.getVersionName());
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.deleteContent(pdfFileModel.name).checkContentIsNotDisplayed(pdfFileModel.name);
        contentServicesPage.deleteContent(pdfFileModel.getVersionName()).checkContentIsNotDisplayed(pdfFileModel.getVersionName());
        pdfFileModel.setVersion('');
    });

    it('[C260172] Enable versioning', () => {
        uploadToggles.enableVersioning();
        contentServicesPage.uploadFile(pdfFileModel.location).checkContentIsDisplayed(pdfFileModel.name);
        pdfFileModel.setVersion('1');
        contentServicesPage.uploadFile(pdfFileModel.location).checkContentIsDisplayed(pdfFileModel.name);
        uploadDialog.fileIsUploaded(pdfFileModel.name);
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.checkContentIsNotDisplayed(pdfFileModel.getVersionName());
        contentServicesPage.deleteContent(pdfFileModel.name).checkContentIsNotDisplayed(pdfFileModel.name);
        pdfFileModel.setVersion('');
        uploadToggles.disableVersioning();
    });

    xit('[C260173] Enable folder upload', () => {
        uploadToggles.enableFolderUpload();
        contentServicesPage.uploadFolder(folderOne.location).checkContentIsDisplayed(folderOne.name);
        expect(contentServicesPage.getFolderButtonTooltip()).toEqual('Custom tooltip');
        uploadDialog.fileIsUploaded(uploadedFileInFolder.name);
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.doubleClickRow(folderOne.name).checkContentIsDisplayed(uploadedFileInFolder.name);
        contentServicesPage.goToDocumentList();
        uploadToggles.disableFolderUpload();
    });

    xit('[C260176] The files uploaded before closing the upload dialog box are not displayed anymore in the upload box', () => {
        contentServicesPage.uploadFile(docxFileModel.location).checkContentIsDisplayed(docxFileModel.name);

        uploadDialog.fileIsUploaded(docxFileModel.name);

        contentServicesPage.uploadFile(pngFileModel.location).checkContentIsDisplayed(pngFileModel.name);

        uploadDialog.fileIsUploaded(pngFileModel.name).fileIsUploaded(docxFileModel.name);
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

        contentServicesPage.uploadFile(pdfFileModel.location).checkContentIsDisplayed(pdfFileModel.name);

        uploadDialog.fileIsUploaded(pdfFileModel.name).fileIsNotDisplayedInDialog(pngFileModel.name).fileIsNotDisplayedInDialog(docxFileModel.name);
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

        contentServicesPage.deleteContents([docxFileModel.name, pngFileModel.name, pdfFileModel.name])
            .checkContentsAreNotDisplayed([docxFileModel.name, pngFileModel.name, pdfFileModel.name]);
    });

    xit('[C260170] Upload files on the same time', () => {
        contentServicesPage.goToDocumentList();
        contentServicesPage.checkAcsContainer();

        uploadToggles.enableMultipleFileUpload();

        contentServicesPage.uploadMultipleFile(filesLocation).checkContentsAreDisplayed(filesName);

        uploadDialog.filesAreUploaded(filesName);

        expect(uploadDialog.getTitleText()).toEqual('Uploaded 4 / 4');

        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

        contentServicesPage.deleteContents(filesName).checkContentsAreNotDisplayed(filesName);

        uploadToggles.disableMultipleFileUpload();
    });

    xit('[C279919] Enable max size and set it to 400', () => {
        contentServicesPage.goToDocumentList();
        contentServicesPage.checkAcsContainer();
        uploadToggles.enableMaxSize().addMaxSize('400');
        contentServicesPage.uploadFile(fileWithSpecificSize.location).checkContentIsDisplayed(fileWithSpecificSize.name);
        uploadDialog.fileIsUploaded(fileWithSpecificSize.name).clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.deleteContent(fileWithSpecificSize.name).checkContentIsNotDisplayed(fileWithSpecificSize.name);
        uploadToggles.addMaxSize('399');
        contentServicesPage.uploadFile(fileWithSpecificSize.location).checkContentIsNotDisplayed(fileWithSpecificSize.name);
        uploadDialog.fileIsNotDisplayedInDialog(fileWithSpecificSize.name);
        expect(contentServicesPage.getErrorMessage()).toEqual('File ' + fileWithSpecificSize.name + ' is larger than the allowed file size');
        contentServicesPage.uploadFile(emptyFile.location).checkContentIsDisplayed(emptyFile.name);
        uploadDialog.fileIsUploaded(emptyFile.name).clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.deleteContent(emptyFile.name).checkContentIsNotDisplayed(emptyFile.name);
        uploadToggles.disableMaxSize();
    });

    xit('[C272796] Enable max size and set it to 0', () => {
        contentServicesPage.goToDocumentList();
        contentServicesPage.checkAcsContainer();
        uploadToggles.enableMaxSize().addMaxSize('0');
        contentServicesPage.uploadFile(fileWithSpecificSize.location).checkContentIsNotDisplayed(fileWithSpecificSize.name);
        uploadDialog.fileIsNotDisplayedInDialog(fileWithSpecificSize.name);
        expect(contentServicesPage.getErrorMessage()).toEqual('File ' + fileWithSpecificSize.name + ' is larger than the allowed file size');
        contentServicesPage.uploadFile(emptyFile.location).checkContentIsDisplayed(emptyFile.name);
        uploadDialog.fileIsUploaded(emptyFile.name).clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.deleteContent(emptyFile.name).checkContentIsNotDisplayed(emptyFile.name);
        uploadToggles.disableMaxSize();
    });

    xit('[C272797] Set max size to 1 and disable it', () => {
        uploadToggles.enableMaxSize().addMaxSize('1');
        uploadToggles.disableMaxSize();
        contentServicesPage.uploadFile(fileWithSpecificSize.location).checkContentIsDisplayed(fileWithSpecificSize.name);
        uploadDialog.fileIsUploaded(fileWithSpecificSize.name).clickOnCloseButton().dialogIsNotDisplayed();
    });

    it('[C91318] Should Enable/Disable upload button when change the disable property', () => {
        uploadToggles.clickCheckboxDisableUpload();
        expect(contentServicesPage.uploadButtonIsEnabled()).toBeFalsy();

        uploadToggles.clickCheckboxDisableUpload();
        expect(contentServicesPage.uploadButtonIsEnabled()).toBeTruthy();
    });

    it('[C279882] Should be possible Upload a folder in a folder', () => {
        uploadToggles.enableFolderUpload();
        contentServicesPage.uploadFolder(folderOne.location).checkContentIsDisplayed(folderOne.name);
        uploadDialog.fileIsUploaded(uploadedFileInFolder.name);

        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.doubleClickRow(folderOne.name).checkContentIsDisplayed(uploadedFileInFolder.name);

        uploadToggles.enableFolderUpload();
        contentServicesPage.uploadFolder(folderTwo.location).checkContentIsDisplayed(folderTwo.name);
        uploadDialog.fileIsUploaded(uploadedFileInFolderTwo.name);

        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.doubleClickRow(folderTwo.name).checkContentIsDisplayed(uploadedFileInFolderTwo.name);

        uploadToggles.disableFolderUpload();
    });

});
