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

import { LoginPage } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { UploadDialog } from '../../pages/adf/dialog/uploadDialog';
import { UploadToggles } from '../../pages/adf/dialog/uploadToggles';

import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';
import { FolderModel } from '../../models/ACS/folderModel';

import TestConfig = require('../../test.config');
import resources = require('../../util/resources');
import { StringUtil } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '../../actions/ACS/upload.actions';
import { DropActions } from '../../actions/drop.actions';

describe('Upload component', () => {

    const contentServicesPage = new ContentServicesPage();
    const uploadDialog = new UploadDialog();
    const uploadToggles = new UploadToggles();
    const loginPage = new LoginPage();
    const acsUser = new AcsUserModel();
    const uploadActions = new UploadActions();
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
    const folderOne = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.FOLDER_ONE.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.FOLDER_ONE.folder_location
    });
    const folderTwo = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.FOLDER_TWO.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.FOLDER_TWO.folder_location
    });
    const uploadedFileInFolder = new FileModel({ 'name': resources.Files.ADF_DOCUMENTS.FILE_INSIDE_FOLDER_ONE.file_name });
    const uploadedFileInFolderTwo = new FileModel({ 'name': resources.Files.ADF_DOCUMENTS.FILE_INSIDE_FOLDER_TWO.file_name });

    beforeAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        const pdfUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, firstPdfFileModel.location, firstPdfFileModel.name, '-my-');
        Object.assign(firstPdfFileModel, pdfUploadedFile.entry);

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        done();
    });

    beforeEach(() => {
        contentServicesPage.goToDocumentList();
    });

    describe('', () => {

        afterEach(async (done) => {
            contentServicesPage.getElementsDisplayedId().then(async (nodeList) => {
                for (let i = 0; i < nodeList.length; i++) {
                    try {
                        await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, nodeList[i]);
                    } catch (e) {
                    }
                }

                done();
            });
        });

        it('[C272788] Should display upload button', () => {
            expect(contentServicesPage.getSingleFileButtonTooltip()).toEqual('Custom tooltip');

            contentServicesPage
                .checkUploadButton()
                .checkContentIsDisplayed(firstPdfFileModel.name);
        });

        xit('[C260173] Should be able to upload folder when enabled', () => {
            uploadToggles.enableFolderUpload();
            uploadToggles.checkFolderUploadToggleIsEnabled();

            contentServicesPage.uploadFolder(folderOne.location);
            uploadDialog.checkUploadCompleted().then(() => {
                contentServicesPage.checkContentIsDisplayed(folderOne.name);
            });
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
            expect(uploadDialog.numberOfCurrentFilesUploaded()).toEqual('1');
            expect(uploadDialog.numberOfInitialFilesUploaded()).toEqual('1');
            uploadDialog.minimizeUploadDialog().dialogIsMinimized();
            expect(uploadDialog.numberOfCurrentFilesUploaded()).toEqual('1');
            expect(uploadDialog.numberOfInitialFilesUploaded()).toEqual('1');
            uploadDialog.maximizeUploadDialog().dialogIsDisplayed().fileIsUploaded(docxFileModel.name);
            expect(uploadDialog.numberOfCurrentFilesUploaded()).toEqual('1');
            expect(uploadDialog.numberOfInitialFilesUploaded()).toEqual('1');
            uploadDialog.checkCloseButtonIsDisplayed().clickOnCloseButton().dialogIsNotDisplayed();
        });

        it('[C272794] Should display tooltip for uploading files', () => {
            uploadToggles.enableMultipleFileUpload();
            uploadToggles.checkMultipleFileUploadToggleIsEnabled();

            browser.driver.sleep(1000);
            expect(contentServicesPage.getMultipleFileButtonTooltip()).toEqual('Custom tooltip');
            uploadToggles.disableMultipleFileUpload();
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
            uploadToggles.checkVersioningToggleIsEnabled();

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

        it('[C260174] Should be possible to set a max size', () => {
            contentServicesPage.goToDocumentList();
            contentServicesPage.checkAcsContainer();
            uploadToggles.enableMaxSize();
            uploadToggles.checkMaxSizeToggleIsEnabled();
            uploadToggles.addMaxSize('400');
            contentServicesPage.uploadFile(fileWithSpecificSize.location);
            uploadDialog.fileIsUploaded(fileWithSpecificSize.name).clickOnCloseButton().dialogIsNotDisplayed();
            contentServicesPage.deleteContent(fileWithSpecificSize.name);
            contentServicesPage.checkContentIsNotDisplayed(fileWithSpecificSize.name);
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
            uploadToggles.checkMaxSizeToggleIsEnabled();
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
            uploadToggles.checkMaxSizeToggleIsEnabled();
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

        xit('[C279882] Should be possible Upload a folder in a folder', () => {
            uploadToggles.enableFolderUpload();
            browser.driver.sleep(1000);
            contentServicesPage.uploadFolder(folderOne.location);
            uploadDialog.checkUploadCompleted().then(() => {
                contentServicesPage.checkContentIsDisplayed(folderOne.name);
            });
            uploadDialog.fileIsUploaded(uploadedFileInFolder.name);

            uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
            contentServicesPage.doubleClickRow(folderOne.name).checkContentIsDisplayed(uploadedFileInFolder.name);

            uploadToggles.enableFolderUpload();
            browser.driver.sleep(1000);
            contentServicesPage.uploadFolder(folderTwo.location);
            uploadDialog.checkUploadCompleted().then(() => {
                contentServicesPage.checkContentIsDisplayed(folderTwo.name);
            });
            uploadDialog.fileIsUploaded(uploadedFileInFolderTwo.name);

            uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
            contentServicesPage.doubleClickRow(folderTwo.name).checkContentIsDisplayed(uploadedFileInFolderTwo.name);

            uploadToggles.disableFolderUpload();
        });
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

        const dragAndDrop = new DropActions();
        const dragAndDropArea = element.all(by.css('adf-upload-drag-area div')).first();

        dragAndDrop.dropFile(dragAndDropArea, docxFileModel.location);
        contentServicesPage.checkContentIsDisplayed(docxFileModel.name);

        uploadDialog.removeUploadedFile(docxFileModel.name).fileIsCancelled(docxFileModel.name);
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

        dragAndDrop.dropFile(dragAndDropArea, pngFileModel.location);
        contentServicesPage.checkContentIsNotDisplayed(pngFileModel.name);
        uploadDialog.dialogIsNotDisplayed();
        uploadToggles.disableExtensionFilter();
    });

    it('[C291921] Should display tooltip for uploading files on a not found location', async () => {
        const folderName = StringUtil.generateRandomString(8);

        const folderUploadedModel = await browser.controlFlow().execute(async () => {
            return await uploadActions.createFolder(this.alfrescoJsApi, folderName, '-my-');
        });

        navigationBarPage.openContentServicesFolder(folderUploadedModel.entry.id);
        contentServicesPage.checkUploadButton();

        browser.controlFlow().execute(async () => {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, folderUploadedModel.entry.id);
        });

        contentServicesPage.uploadFile(pdfFileModel.location);

        uploadDialog.displayTooltip();
        expect(uploadDialog.getTooltip()).toEqual('Upload location no longer exists [404]');
    });

});
