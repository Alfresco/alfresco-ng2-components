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

import Util = require('./util/util');
import TestConfig = require('./test.config');

import LoginPage = require('./pages/adf/loginPage');
import ContentServicesPage = require('./pages/adf/contentServicesPage');
import ViewerPage = require('./pages/adf/viewerPage');

import resources = require('./util/resources');

import path = require('path');
import FileModel = require('./models/ACS/fileModel');
import AcsUserModel = require('./models/ACS/acsUserModel');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from './actions/ACS/upload.actions';

describe('Test Content Services Viewer', () => {

    let acsUser = new AcsUserModel();
    let viewerPage = new ViewerPage();
    let contentServicesPage = new ContentServicesPage();
    let loginPage = new LoginPage();

    let defaultHeight;
    let defaultWidth;
    let zoomedInHeight;
    let zoomedInWidth;
    let scaledHeight;
    let scaledWidth;
    let zoomedOutHeight;
    let zoomedOutWidth;

    let pdfFile = new FileModel({ 'name': resources.Files.ADF_DOCUMENTS.PDF.file_name });
    let jpgFile = new FileModel({
        'location': resources.Files.ADF_DOCUMENTS.JPG.file_location,
        'name': resources.Files.ADF_DOCUMENTS.JPG.file_name
    });
    let mp4File = new FileModel({
        'location': resources.Files.ADF_DOCUMENTS.MP4.file_location,
        'name': resources.Files.ADF_DOCUMENTS.MP4.file_name
    });
    let pagesFile = new FileModel({
        'location': resources.Files.ADF_DOCUMENTS.PAGES.file_location,
        'name': resources.Files.ADF_DOCUMENTS.PAGES.file_name
    });
    let pptFile = new FileModel({
        'location': resources.Files.ADF_DOCUMENTS.PPT.file_location,
        'name': resources.Files.ADF_DOCUMENTS.PPT.file_name,
        'firstPageText': resources.Files.ADF_DOCUMENTS.PPT.first_page_text
    });

    let downloadDir = path.join(__dirname, '/downloads');

    let downloadedPdfFile = path.join(downloadDir, pdfFile.name);
    let downloadedJpgFile = path.join(downloadDir, jpgFile.name);
    let downloadedMp4File = path.join(downloadDir, mp4File.name);
    let downloadedPagesFile = path.join(downloadDir, pagesFile.name);

    beforeAll(async (done) => {
        let uploadActions = new UploadActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        let pdfFileUploaded = await uploadActions.uploadFile(this.alfrescoJsApi, pdfFile.location, pdfFile.name, '-my-');
        Object.assign(pdfFile, pdfFileUploaded.entry);

        let jpgFileUploaded = await uploadActions.uploadFile(this.alfrescoJsApi, jpgFile.location, jpgFile.name, '-my-');
        Object.assign(jpgFile, jpgFileUploaded.entry);

        let mp4FileUploaded = await uploadActions.uploadFile(this.alfrescoJsApi, mp4File.location, mp4File.name, '-my-');
        Object.assign(mp4File, mp4FileUploaded.entry);

        let pptFileUploaded = await uploadActions.uploadFile(this.alfrescoJsApi, pptFile.location, pptFile.name, '-my-');
        Object.assign(pptFile, pptFileUploaded.entry);

        let pagesFileUploaded = await uploadActions.uploadFile(this.alfrescoJsApi, pagesFile.location, pagesFile.name, '-my-');
        Object.assign(pagesFile, pagesFileUploaded.entry);

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        contentServicesPage.goToDocumentList();

        done();
    });

    // afterAll((done) => {
    //     NodesAPI.deleteContent(acsUser, pdfFile.getId(), () => {
    //         done();
    //     });
    //
    //     NodesAPI.deleteContent(acsUser, jpgFile.getId(), () => {
    //         done();
    //     });
    //
    //     NodesAPI.deleteContent(acsUser, mp4File.getId(), () => {
    //         done();
    //     });
    //
    //     NodesAPI.deleteContent(acsUser, pagesFile.getId(), () => {
    //         done();
    //     });
    //
    //     NodesAPI.deleteContent(acsUser, pptFile.getId(), () => {
    //         done();
    //     });
    // });

    it('1. Open viewer for a .pdf file', () => {
        contentServicesPage.checkAcsContainer();
        viewerPage.viewFile(pdfFile.name);
        viewerPage.checkFileContent('1', pdfFile.firstPageText);
        viewerPage.checkCloseButtonIsDisplayed();
        viewerPage.checkFileThumbnailIsDisplayed();
        viewerPage.checkFileNameIsDisplayed(pdfFile.name);
        viewerPage.checkDownloadButtonIsDisplayed();
        viewerPage.checkInfoButtonIsDisplayed();
        viewerPage.checkPreviousPageButtonIsDisplayed();
        viewerPage.checkNextPageButtonIsDisplayed();
        viewerPage.checkPageSelectorInputIsDisplayed('1');
        viewerPage.checkZoomInButtonIsDisplayed();
        viewerPage.checkZoomOutButtonIsDisplayed();
        viewerPage.checkScalePageButtonIsDisplayed();
    });

    it('2. Use viewer pagination', () => {
        viewerPage.clickNextPageButton();
        viewerPage.checkFileContent('2', pdfFile.secondPageText);
        viewerPage.checkPageSelectorInputIsDisplayed('2');
        viewerPage.clickPreviousPageButton();
        viewerPage.checkFileContent('1', pdfFile.firstPageText);
        viewerPage.checkPageSelectorInputIsDisplayed('1');
        viewerPage.enterPage(pdfFile.lastPageNumber);
        viewerPage.checkFileContent(pdfFile.lastPageNumber, pdfFile.lastPageText);
        viewerPage.checkPageSelectorInputIsDisplayed(pdfFile.lastPageNumber);

        viewerPage.canvasHeight().then(function (value) {
            defaultHeight = parseInt(value, 10);
        });
        viewerPage.canvasWidth().then(function (value) {
            defaultWidth = parseInt(value, 10);
        });
        viewerPage.clickZoomInButton();
        viewerPage.canvasHeight().then(function (value) {
            zoomedInHeight = parseInt(value, 10);
            expect(zoomedInHeight).toBeGreaterThan(defaultHeight);
        });
        viewerPage.canvasWidth().then(function (value) {
            zoomedInWidth = parseInt(value, 10);
            expect(zoomedInWidth).toBeGreaterThan(defaultWidth);
        });
        viewerPage.clickScalePageButton();
        viewerPage.canvasHeight().then(function (value) {
            scaledHeight = parseInt(value, 10);
            expect(scaledHeight).toEqual(defaultHeight);
        });
        viewerPage.canvasWidth().then(function (value) {
            scaledWidth = parseInt(value, 10);
            expect(scaledWidth).toEqual(defaultWidth);
        });
        viewerPage.clickZoomOutButton();
        viewerPage.canvasHeight().then(function (value) {
            zoomedOutHeight = parseInt(value, 10);
            expect(zoomedOutHeight).toBeLessThan(defaultHeight);
        });
        viewerPage.canvasWidth().then(function (value) {
            zoomedOutWidth = parseInt(value, 10);
            expect(zoomedOutWidth).toBeLessThan(defaultWidth);
        });
    });

    it('3. Use viewer toolbar', () => {
        viewerPage.clickDownloadButton();
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsNotDisplayed();
        expect(Util.fileExists(downloadedPdfFile, 10)).toBe(true);
        viewerPage.clickCloseButton();
    });

    it('4. Open viewer for a .jpg file', () => {
        viewerPage.viewFile(jpgFile.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsNotDisplayed();
        viewerPage.checkDownloadButtonIsDisplayed();
        viewerPage.clickDownloadButton();
        viewerPage.checkFileThumbnailIsDisplayed();
        viewerPage.checkFileNameIsDisplayed(jpgFile.name);
        expect(Util.fileExists(downloadedJpgFile, 10)).toBe(true);
        viewerPage.clickCloseButton();
    });

    it('5. Open viewer for a .ppt file converted to .pdf', () => {
        viewerPage.viewFile(pptFile.name);
        viewerPage.checkFileContent('1', pptFile.firstPageText);
        viewerPage.checkCloseButtonIsDisplayed();
        viewerPage.checkFileThumbnailIsDisplayed();
        viewerPage.checkFileNameIsDisplayed(pptFile.name);
        viewerPage.checkDownloadButtonIsDisplayed();
        viewerPage.checkInfoButtonIsDisplayed();
        viewerPage.checkPreviousPageButtonIsDisplayed();
        viewerPage.checkNextPageButtonIsDisplayed();
        viewerPage.checkPageSelectorInputIsDisplayed('1');
        viewerPage.checkZoomInButtonIsDisplayed();
        viewerPage.checkZoomOutButtonIsDisplayed();
        viewerPage.checkScalePageButtonIsDisplayed();
        viewerPage.clickCloseButton();
    });

    it('6. Open viewer for an unsupported file', () => {
        viewerPage.viewFile(pagesFile.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsNotDisplayed();
        viewerPage.checkFileThumbnailIsDisplayed();
        viewerPage.checkDownloadButtonIsDisplayed();
        viewerPage.clickDownloadButton();
        expect(Util.fileExists(downloadedPagesFile, 10)).toBe(true);
        viewerPage.checkFileNameIsDisplayed(pagesFile.name);
        viewerPage.clickCloseButton();
    });

    it('7. Open viewer for a .mp4 file', () => {
        viewerPage.viewFile(mp4File.name);
        viewerPage.checkMediaPlayerContainerIsDisplayed();
        viewerPage.clickDownloadButton();
        expect(Util.fileExists(downloadedMp4File, 10)).toBe(true);
        viewerPage.checkFileThumbnailIsDisplayed();
        viewerPage.checkFileNameIsDisplayed(mp4File.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsNotDisplayed();
        viewerPage.checkDownloadButtonIsDisplayed();
        viewerPage.clickCloseButton();
    });
});
