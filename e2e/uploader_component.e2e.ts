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

var AdfLoginPage = require('./pages/adf/loginPage.js');
var ContentServicesPage = require('./pages/adf/contentServicesPage.js');
var UploadDialog = require('./pages/adf/dialog/uploadDialog.js');
var UploadToggles = require('./pages/adf/dialog/uploadToggles.js');

var AcsUserModel = require('./models/ACS/acsUserModel.js');
var FileModel = require('./models/ACS/fileModel.js');
var FolderModel = require('./models/ACS/folderModel.js');

var PeopleAPI = require('./restAPI/ACS/PeopleAPI.js');
var NodesAPI = require('./restAPI/ACS/NodesAPI.js');

var TestConfig = require('./test.config.js');
var resources = require('./util/resources.js');

xdescribe('Test Uploader component', () => {

    var contentServicesPage = new ContentServicesPage();
    var uploadDialog = new UploadDialog();
    var uploadToggles = new UploadToggles();
    var adfLoginPage = new AdfLoginPage();
    var acsUser = new AcsUserModel();
    var adminUserModel = new AcsUserModel({
        'id': TestConfig.adf.adminUser,
        'password': TestConfig.adf.adminPassword
    });
    var firstPdfFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF_B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF_B.file_location
    });
    var docxFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.DOCX.file_name,
        'location': resources.Files.ADF_DOCUMENTS.DOCX.file_location
    });
    var pdfFileModel = new FileModel({'name': resources.Files.ADF_DOCUMENTS.PDF.file_name});
    var pngFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });
    var largeFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.LARGE_FILE.file_name,
        'location': resources.Files.ADF_DOCUMENTS.LARGE_FILE.file_location
    });
    var fileWithSpecificSize = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_400B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_400B.file_location
    });
    var emptyFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });
    var folderOne = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.FOLDER_ONE.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.FOLDER_ONE.folder_location
    });
    var uploadedFileInFolder = new FileModel({'name': resources.Files.ADF_DOCUMENTS.FILE_INSIDE_FOLDER_ONE.file_name});
    var filesLocation = [pdfFileModel.location, docxFileModel.location, pngFileModel.location, firstPdfFileModel.location];
    var filesName = [pdfFileModel.name, docxFileModel.name, pngFileModel.name, firstPdfFileModel.name];

    beforeAll(function (done) {
        PeopleAPI.createUserViaAPI(adminUserModel, acsUser)
            .then(() => {
                adfLoginPage.loginToContentServicesUsingUserModel(acsUser);
                return contentServicesPage.goToDocumentList();
            })
            .then(() => {
                return protractor.promise.all([
                    NodesAPI.uploadFileViaAPI(acsUser, firstPdfFileModel, '-my-', false),
                ]);
            });
        done();
    });

    it('1. Upload Button is visible on the page', () => {
        expect(contentServicesPage.getSingleFileButtonTooltip()).toEqual('Custom tooltip');
        contentServicesPage.checkUploadButton().checkContentIsDisplayed(firstPdfFileModel.name);
        contentServicesPage.deleteContent(firstPdfFileModel.name);
    });

    it('2. Upload a pdf file', () => {
        contentServicesPage.uploadFile(pdfFileModel.location).checkContentIsDisplayed(pdfFileModel.name);
        uploadDialog.fileIsUploaded(pdfFileModel.name);
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.deleteContent(pdfFileModel.name).checkContentIsNotDisplayed(pdfFileModel.name);
    });

    it('3. Upload a text file', () => {
        contentServicesPage.uploadFile(docxFileModel.location).checkContentIsDisplayed(docxFileModel.name);
        uploadDialog.fileIsUploaded(docxFileModel.name);
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.deleteContent(docxFileModel.name).checkContentIsNotDisplayed(docxFileModel.name);
    });

    it('4. Upload a png file', () => {
        contentServicesPage.uploadFile(pngFileModel.location).checkContentIsDisplayed(pngFileModel.name);
        uploadDialog.fileIsUploaded(pngFileModel.name);
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.deleteContent(pngFileModel.name).checkContentIsNotDisplayed(pngFileModel.name);
    });

    it('5. Minimize and maximize the upload dialog box', () => {
        contentServicesPage.uploadFile(docxFileModel.location).checkContentIsDisplayed(docxFileModel.name);
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

    it('6. Cancel the uploaded file through the upload dialog icon', () => {
        contentServicesPage.uploadFile(pdfFileModel.location).checkContentIsDisplayed(pdfFileModel.name);
        uploadDialog.removeUploadedFile(pdfFileModel.name).fileIsCancelled(pdfFileModel.name);
        expect(uploadDialog.getTitleText()).toEqual('Upload canceled');
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.checkContentIsNotDisplayed(pdfFileModel.name);
    });

    it('7. Cancel a big file through the upload dialog icon before the upload to be done', () => {
        contentServicesPage.uploadFile(largeFile.location);
        uploadDialog.removeFileWhileUploading(largeFile.name).fileIsCancelled(largeFile.name);
        expect(uploadDialog.getTitleText()).toEqual('Upload canceled');
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.checkContentIsNotDisplayed(largeFile.name);
    });

    it('8. Cancel a big file through the cancel uploads button', () => {
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

    it('9. Cancel uploading multiple files', () => {
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

    it('10. Tooltip of uploading multiple files button', () => {
        uploadToggles.enableMultipleFileUpload();
        expect(contentServicesPage.getMultipleFileButtonTooltip()).toEqual('Custom tooltip');
        uploadToggles.disableMultipleFileUpload();
    });

    it('11. Enable extension filter', () => {
        uploadToggles.enableExtensionFilter().addExtension('.docx');
        contentServicesPage.uploadFile(docxFileModel.location).checkContentIsDisplayed(docxFileModel.name);
        uploadDialog.removeUploadedFile(docxFileModel.name).fileIsCancelled(docxFileModel.name);
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.uploadFile(largeFile.location).checkContentIsNotDisplayed(largeFile.name);
        uploadDialog.dialogIsNotDisplayed();
        uploadToggles.disableExtensionFilter();
    });

    it('12. Upload same file twice', () => {
        contentServicesPage.uploadFile(pdfFileModel.location).checkContentIsDisplayed(pdfFileModel.name);
        pdfFileModel.setVersion('1');
        contentServicesPage.uploadFile(pdfFileModel.location).checkContentIsDisplayed(pdfFileModel.getVersionName());
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.deleteContent(pdfFileModel.name).checkContentIsNotDisplayed(pdfFileModel.name);
        contentServicesPage.deleteContent(pdfFileModel.getVersionName()).checkContentIsNotDisplayed(pdfFileModel.getVersionName());
        pdfFileModel.setVersion('');
    });

    it('13. Enable versioning', () => {
        uploadToggles.enableVersioning();
        contentServicesPage.uploadFile(pdfFileModel.location).checkContentIsDisplayed(pdfFileModel.name);
        pdfFileModel.setVersion('1');
        contentServicesPage.uploadFile(pdfFileModel.location).checkContentIsDisplayed(pdfFileModel.name);
        uploadDialog.fileIsUploaded(pdfFileModel.name)
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.checkContentIsNotDisplayed(pdfFileModel.getVersionName());
        contentServicesPage.deleteContent(pdfFileModel.name).checkContentIsNotDisplayed(pdfFileModel.name);
        pdfFileModel.setVersion('');
        uploadToggles.disableVersioning();
    });

    it('14. Enable folder upload', () => {
        uploadToggles.enableFolderUpload();
        contentServicesPage.uploadFolder(folderOne.location).checkContentIsDisplayed(folderOne.name);
        expect(contentServicesPage.getFolderButtonTooltip()).toEqual('Custom tooltip');
        uploadDialog.fileIsUploaded(uploadedFileInFolder.name);
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.doubleClickRow(folderOne.name).checkContentIsDisplayed(uploadedFileInFolder.name);
        contentServicesPage.goToDocumentList();
        uploadToggles.disableFolderUpload();
    });

    it('16. The files uploaded before closing the upload dialog box are not displayed anymore in the upload box', () => {
        contentServicesPage.uploadFile(docxFileModel.location).checkContentIsDisplayed(docxFileModel.name);
        uploadDialog.fileIsUploaded(docxFileModel.name);
        contentServicesPage.uploadFile(pngFileModel.location).checkContentIsDisplayed(pngFileModel.name);
        uploadDialog.fileIsUploaded(pngFileModel.name).fileIsUploaded(docxFileModel.name);
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.uploadFile(pdfFileModel.location).checkContentIsDisplayed(pdfFileModel.name);
        uploadDialog.fileIsUploaded(pdfFileModel.name).fileIsNotDisplayedInDialog(pngFileModel.name).fileIsNotDisplayedInDialog(docxFileModel.name);
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.deleteContents([docxFileModel.name, pngFileModel.name, pdfFileModel.name]).checkContentsAreNotDisplayed([docxFileModel.name, pngFileModel.name, pdfFileModel.name]);
    });

    it('18. Upload files on the same time', () => {
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

    it('19. Enable max size and set it to 400', () => {
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

    it('20. Enable max size and set it to 0', () => {
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

    it('21. Set max size to 1 and disable it', () => {
        uploadToggles.enableMaxSize().addMaxSize('1');
        uploadToggles.disableMaxSize();
        contentServicesPage.uploadFile(fileWithSpecificSize.location).checkContentIsDisplayed(fileWithSpecificSize.name);
        uploadDialog.fileIsUploaded(fileWithSpecificSize.name).clickOnCloseButton().dialogIsNotDisplayed();
    });
});
