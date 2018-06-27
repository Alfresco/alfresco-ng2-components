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

var Util = require('./util/util.js');
var TestConfig = require('./test.config.js');
var AdfLoginPage = require('./pages/adf/loginPage');
var AdfContentServicesPage = require('./pages/adf/contentServicesPage');
var AdfViewerPage = require('./pages/adf/viewerPage.js');
var AcsUserModel = require('./models/ACS/acsUserModel.js');

var resources = require('./util/resources.js');
var NodesAPI = require('./restAPI/ACS/NodesAPI.js');
var PeopleAPI = require('./restAPI/ACS/PeopleAPI.js');

var path = require('path');
var FileModel = require('./models/ACS/fileModel.js');
var AcsUserModel = require('./models/ACS/acsUserModel.js');

xdescribe('Test Content Services Viewer', () => {

    var acsUser = new AcsUserModel();
    var adfViewerPage = new AdfViewerPage();
    var adfContentServicesPage = new AdfContentServicesPage();
    var adfLoginPage = new AdfLoginPage();
    var adminUserModel = new AcsUserModel({
        'id': TestConfig.adf.adminUser,
        'password': TestConfig.adf.adminPassword
    });

    var defaultHeight;
    var defaultWidth;
    var zoomedInHeight;
    var zoomedInWidth;
    var scaledHeight;
    var scaledWidth;
    var zoomedOutHeight;
    var zoomedOutWidth;

    var pdfFile = new FileModel({ 'name': resources.Files.ADF_DOCUMENTS.PDF.file_name });
    var jpgFile = new FileModel({
        'location': resources.Files.ADF_DOCUMENTS.JPG.file_location,
        'name': resources.Files.ADF_DOCUMENTS.JPG.file_name
    });
    var mp4File = new FileModel({
        'location': resources.Files.ADF_DOCUMENTS.MP4.file_location,
        'name': resources.Files.ADF_DOCUMENTS.MP4.file_name
    });
    var pagesFile = new FileModel({
        'location': resources.Files.ADF_DOCUMENTS.PAGES.file_location,
        'name': resources.Files.ADF_DOCUMENTS.PAGES.file_name
    });
    var pptFile = new FileModel({
        'location': resources.Files.ADF_DOCUMENTS.PPT.file_location,
        'name': resources.Files.ADF_DOCUMENTS.PPT.file_name,
        'firstPageText': resources.Files.ADF_DOCUMENTS.PPT.first_page_text
    });

    var downloadDir = browser.downloadDir ? browser.downloadDir : '';

    var downloadedPdfFile = path.join(downloadDir, pdfFile.name);
    var downloadedJpgFile = path.join(downloadDir, jpgFile.name);
    var downloadedMp4File = path.join(downloadDir, mp4File.name);
    var downloadedPagesFile = path.join(downloadDir, pagesFile.name);

    beforeAll(function (done) {
        PeopleAPI.createUserViaAPI(adminUserModel, acsUser)
            .then(() => {
                console.log('User name: ' + acsUser.getId() + 'pass: ' + acsUser.getPassword());
                adfLoginPage.loginToContentServicesUsingUserModel(acsUser);
                adfContentServicesPage.goToDocumentList();
            })
            .then(() => {
                return protractor.promise.all([
                    NodesAPI.uploadFileViaAPI(acsUser, pdfFile, '-my-', false),

                    NodesAPI.uploadFileViaAPI(acsUser, jpgFile, '-my-', false),

                    NodesAPI.uploadFileViaAPI(acsUser, mp4File, '-my-', false),

                    NodesAPI.uploadFileViaAPI(acsUser, pagesFile, '-my-', false),

                    NodesAPI.uploadFileViaAPI(acsUser, pptFile, '-my-', false)])
            })
            .then(() => {
                done();
            });
    });

    afterAll(function (done) {
        NodesAPI.deleteContent(acsUser, pdfFile.getId(), () => {
            done();
        });

        NodesAPI.deleteContent(acsUser, jpgFile.getId(), () => {
            done();
        });

        NodesAPI.deleteContent(acsUser, mp4File.getId(), () => {
            done();
        });

        NodesAPI.deleteContent(acsUser, pagesFile.getId(), () => {
            done();
        });

        NodesAPI.deleteContent(acsUser, pptFile.getId(), () => {
            done();
        });
    });

    it('1. Open viewer for a .pdf file', () => {
        adfContentServicesPage.checkAcsContainer();
        adfViewerPage.viewFile(pdfFile.name);
        adfViewerPage.checkFileContent('1', pdfFile.firstPageText);
        adfViewerPage.checkCloseButtonIsDisplayed();
        adfViewerPage.checkFileThumbnailIsDisplayed();
        adfViewerPage.checkFileNameIsDisplayed(pdfFile.name);
        adfViewerPage.checkDownloadButtonIsDisplayed();
        adfViewerPage.checkInfoButtonIsDisplayed();
        adfViewerPage.checkPreviousPageButtonIsDisplayed();
        adfViewerPage.checkNextPageButtonIsDisplayed();
        adfViewerPage.checkPageSelectorInputIsDisplayed('1');
        adfViewerPage.checkZoomInButtonIsDisplayed();
        adfViewerPage.checkZoomOutButtonIsDisplayed();
        adfViewerPage.checkScalePageButtonIsDisplayed();
    });

    it('2. Use viewer pagination', () => {
        adfViewerPage.clickNextPageButton();
        adfViewerPage.checkFileContent('2', pdfFile.secondPageText);
        adfViewerPage.checkPageSelectorInputIsDisplayed('2');
        adfViewerPage.clickPreviousPageButton();
        adfViewerPage.checkFileContent('1', pdfFile.firstPageText);
        adfViewerPage.checkPageSelectorInputIsDisplayed('1');
        adfViewerPage.enterPage(pdfFile.lastPageNumber);
        adfViewerPage.checkFileContent(pdfFile.lastPageNumber, pdfFile.lastPageText);
        adfViewerPage.checkPageSelectorInputIsDisplayed(pdfFile.lastPageNumber);
        adfViewerPage.canvasHeight().then(function (value) {
            defaultHeight = parseInt(value);
        });
        adfViewerPage.canvasWidth().then(function (value) {
            defaultWidth = parseInt(value);
        });
        adfViewerPage.clickZoomInButton();
        adfViewerPage.canvasHeight().then(function (value) {
            zoomedInHeight = parseInt(value);
            expect(zoomedInHeight).toBeGreaterThan(defaultHeight);
        });
        adfViewerPage.canvasWidth().then(function (value) {
            zoomedInWidth = parseInt(value);
            expect(zoomedInWidth).toBeGreaterThan(defaultWidth);
        });
        adfViewerPage.clickScalePageButton();
        adfViewerPage.canvasHeight().then(function (value) {
            scaledHeight = parseInt(value);
            expect(scaledHeight).toEqual(defaultHeight);
        });
        adfViewerPage.canvasWidth().then(function (value) {
            scaledWidth = parseInt(value);
            expect(scaledWidth).toEqual(defaultWidth);
        });
        adfViewerPage.clickZoomOutButton();
        adfViewerPage.canvasHeight().then(function (value) {
            zoomedOutHeight = parseInt(value);
            expect(zoomedOutHeight).toBeLessThan(defaultHeight);
        });
        adfViewerPage.canvasWidth().then(function (value) {
            zoomedOutWidth = parseInt(value);
            expect(zoomedOutWidth).toBeLessThan(defaultWidth);
        })
    });

    it('3. Use viewer toolbar', () => {
        adfViewerPage.clickDownloadButton();
        adfViewerPage.clickInfoButton();
        adfViewerPage.checkInfoSideBarIsDisplayed();
        adfViewerPage.clickInfoButton();
        adfViewerPage.checkInfoSideBarIsNotDisplayed();
        expect(Util.fileExists(downloadedPdfFile, 10)).toBe(true);
        adfViewerPage.clickCloseButton();
    });

    it('4. Open viewer for a .jpg file', () => {
        adfViewerPage.viewFile(jpgFile.name);
        adfViewerPage.clickInfoButton();
        adfViewerPage.checkInfoSideBarIsDisplayed();
        adfViewerPage.clickInfoButton();
        adfViewerPage.checkInfoSideBarIsNotDisplayed();
        adfViewerPage.checkDownloadButtonIsDisplayed();
        adfViewerPage.clickDownloadButton();
        adfViewerPage.checkFileThumbnailIsDisplayed();
        adfViewerPage.checkFileNameIsDisplayed(jpgFile.name);
        expect(Util.fileExists(downloadedJpgFile, 10)).toBe(true);
        adfViewerPage.clickCloseButton();
    });

    it('5. Open viewer for a .ppt file converted to .pdf', () => {
        adfViewerPage.viewFile(pptFile.name);
        adfViewerPage.checkFileContent('1', pptFile.firstPageText);
        adfViewerPage.checkCloseButtonIsDisplayed();
        adfViewerPage.checkFileThumbnailIsDisplayed();
        adfViewerPage.checkFileNameIsDisplayed(pptFile.name);
        adfViewerPage.checkDownloadButtonIsDisplayed();
        adfViewerPage.checkInfoButtonIsDisplayed();
        adfViewerPage.checkPreviousPageButtonIsDisplayed();
        adfViewerPage.checkNextPageButtonIsDisplayed();
        adfViewerPage.checkPageSelectorInputIsDisplayed('1');
        adfViewerPage.checkZoomInButtonIsDisplayed();
        adfViewerPage.checkZoomOutButtonIsDisplayed();
        adfViewerPage.checkScalePageButtonIsDisplayed();
        adfViewerPage.clickCloseButton();
    });


    it('6. Open viewer fot an unsupported file', () => {
        adfViewerPage.viewFile(pagesFile.name);
        adfViewerPage.clickInfoButton();
        adfViewerPage.checkInfoSideBarIsDisplayed();
        adfViewerPage.clickInfoButton();
        adfViewerPage.checkInfoSideBarIsNotDisplayed();
        adfViewerPage.checkFileThumbnailIsDisplayed();
        adfViewerPage.checkDownloadButtonIsDisplayed();
        adfViewerPage.clickDownloadButton();
        expect(Util.fileExists(downloadedPagesFile, 10)).toBe(true);
        adfViewerPage.checkFileNameIsDisplayed(pagesFile.name);
        adfViewerPage.clickCloseButton();
    });

    it('7. Open viewer for a .mp4 file', () => {
        adfViewerPage.viewFile(mp4File.name);
        adfViewerPage.checkMediaPlayerContainerIsDisplayed();
        adfViewerPage.clickDownloadButton();
        expect(Util.fileExists(downloadedMp4File, 10)).toBe(true);
        adfViewerPage.checkFileThumbnailIsDisplayed();
        adfViewerPage.checkFileNameIsDisplayed(mp4File.name);
        adfViewerPage.clickInfoButton();
        adfViewerPage.checkInfoSideBarIsDisplayed();
        adfViewerPage.clickInfoButton();
        adfViewerPage.checkInfoSideBarIsNotDisplayed();
        adfViewerPage.checkDownloadButtonIsDisplayed();
        adfViewerPage.clickCloseButton();
    });
});
