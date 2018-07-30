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
/*tslint:disable*/

import TestConfig = require('../test.config');

import LoginPage = require('../pages/adf/loginPage');
import ViewerPage = require('../pages/adf/viewerPage');
import NavigationBarPage = require('../pages/adf/navigationBarPage');
import ContentServicesPage = require('../pages/adf/contentServicesPage');

import resources = require('../util/resources');
import Util = require('../util/util');
import CONSTANTS = require('../util/constants');

import FileModel = require('../models/ACS/fileModel');
import FolderModel = require('../models/ACS/folderModel');
import AcsUserModel = require('../models/ACS/acsUserModel');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../actions/ACS/upload.actions';

describe('Viewer', () => {

    let viewerPage = new ViewerPage();
    let navigationBarPage = new NavigationBarPage();
    let loginPage = new LoginPage();
    let contentServicesPage = new ContentServicesPage();
    let uploadActions = new UploadActions();
    let site, uploadedArchives, uploadedExcels, uploadedOthers, uploadedPpts, uploadedTexts, uploadedWords, uploadedImages;
    let acsUser = new AcsUserModel();

    let pngFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    let archiveFolder = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.ARCHIVE_FOLDER.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.ARCHIVE_FOLDER.folder_location
    });

    let excelFolder = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.EXCEL_FOLDER.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.EXCEL_FOLDER.folder_location
    });


    let otherFolder = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.OTHER_FOLDER.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.OTHER_FOLDER.folder_location
    });


    let pptFolder = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.PPT_FOLDER.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.PPT_FOLDER.folder_location
    });


    let textFolder = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.TEXT_FOLDER.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.TEXT_FOLDER.folder_location
    });


    let wordFolder = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.WORD_FOLDER.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.WORD_FOLDER.folder_location
    });


    let imgFolder = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.IMG_FOLDER.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.IMG_FOLDER.folder_location
    });

    beforeAll(async (done) => {

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        site = await this.alfrescoJsApi.core.sitesApi.createSite({
            title: Util.generateRandomString(8),
            visibility: 'PUBLIC'
        });

        await this.alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
            id: acsUser.id,
            role: CONSTANTS.SITEMEMBERROLES.SITEMANAGER
        });

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password)

        console.log(`\nUsername : ${acsUser.id}\tPassword : ${acsUser.password}`);

        let pngFileUploaded = await uploadActions.uploadFile(this.alfrescoJsApi, pngFile.location, pngFile.name, site.entry.guid);
        Object.assign(pngFile, pngFileUploaded.entry);

        done();
    });


    describe('Archive Folder Uploaded', () => {

        beforeAll(async (done) => {
            let archiveFolderUploaded = await uploadActions.uploadFolder(this.alfrescoJsApi, archiveFolder.name, "-my-");
            Object.assign(archiveFolder, archiveFolderUploaded.entry);

            uploadedArchives = await uploadActions.uploadFolderFiles(this.alfrescoJsApi, archiveFolder.location, archiveFolderUploaded.entry.id);

            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            done();
        });

        afterAll(async (done) => {
            uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, archiveFolder.id);
            done();
        });

        it('[C260517] Should be possible to open any Archive file', () => {
            uploadedArchives.forEach((currentFile) => {
                if (currentFile.entry.name != '.DS_Store') {
                    navigationBarPage.openViewer(currentFile.entry.id);
                    viewerPage.checkZoomInButtonIsDisplayed(150000);
                    viewerPage.clickCloseButton();
                    contentServicesPage.checkAcsContainer();
                }
            });
        });

    });

    describe('Excel Folder Uploaded', () => {

        beforeAll(async (done) => {
            let excelFolderUploaded = await uploadActions.uploadFolder(this.alfrescoJsApi, excelFolder.name, "-my-");
            Object.assign(excelFolder, excelFolderUploaded.entry);

            uploadedExcels = await uploadActions.uploadFolderFiles(this.alfrescoJsApi, excelFolder.location, excelFolderUploaded.entry.id);

            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            done();
        });

        afterAll(async (done) => {
            uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, excelFolder.id);
            done();
        });

        it('[C280008] Should be possible to open any Excel file', () => {
            uploadedExcels.forEach((currentFile) => {
                if (currentFile.entry.name != '.DS_Store') {
                    navigationBarPage.openViewer(currentFile.entry.id);
                    viewerPage.checkZoomInButtonIsDisplayed(150000);
                    viewerPage.clickCloseButton();
                    contentServicesPage.checkAcsContainer();
                }
            });
        });

    });

    describe('PowerPoint Folder Uploaded', () => {

        beforeAll(async (done) => {
            let pptFolderUploaded = await uploadActions.uploadFolder(this.alfrescoJsApi, pptFolder.name, "-my-");
            Object.assign(pptFolder, pptFolderUploaded.entry);

            uploadedPpts = await uploadActions.uploadFolderFiles(this.alfrescoJsApi, pptFolder.location, pptFolderUploaded.entry.id);

            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            done();
        });

        afterAll(async (done) => {
            uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, pptFolder.id);
            done();
        });

        it('[C280009] Should be possible to open any PowerPoint file', () => {
            uploadedPpts.forEach((currentFile) => {
                if (currentFile.entry.name != '.DS_Store') {
                    navigationBarPage.openViewer(currentFile.entry.id);
                    viewerPage.checkZoomInButtonIsDisplayed(150000);
                    viewerPage.clickCloseButton();
                    contentServicesPage.checkAcsContainer();
                }
            });
        });

    });

    describe('Text Folder Uploaded', () => {

        beforeAll(async (done) => {
            let textFolderUploaded = await uploadActions.uploadFolder(this.alfrescoJsApi, textFolder.name, "-my-");
            Object.assign(textFolder, textFolderUploaded.entry);

            uploadedTexts = await uploadActions.uploadFolderFiles(this.alfrescoJsApi, textFolder.location, textFolderUploaded.entry.id);

            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            done();
        });

        afterAll(async (done) => {
            uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, textFolder.id);
            done();
        });

        it('[C280010] Should be possible to open any Text file', () => {
            uploadedTexts.forEach((currentFile) => {
                if (currentFile.entry.name != '.DS_Store') {
                    navigationBarPage.openViewer(currentFile.entry.id);
                    viewerPage.checkZoomInButtonIsDisplayed(150000);
                    viewerPage.clickCloseButton();
                    contentServicesPage.checkAcsContainer();
                }
            });
        });

    });

    describe('Word Folder Uploaded', () => {

        beforeAll(async (done) => {
            let wordFolderUploaded = await uploadActions.uploadFolder(this.alfrescoJsApi, wordFolder.name, "-my-");
            Object.assign(wordFolder, wordFolderUploaded.entry);

            uploadedWords = await uploadActions.uploadFolderFiles(this.alfrescoJsApi, wordFolder.location, wordFolderUploaded.entry.id);

            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            done();
        });

        afterAll(async (done) => {
            uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, wordFolder.id);
            done();
        });

        it('[C280011] Should be possible to open any Word file', () => {
            uploadedWords.forEach((currentFile) => {
                if (currentFile.entry.name != '.DS_Store') {
                    navigationBarPage.openViewer(currentFile.entry.id);
                    viewerPage.checkZoomInButtonIsDisplayed(150000);
                    viewerPage.clickCloseButton();
                    contentServicesPage.checkAcsContainer();
                }
            });
        });

    });

    describe('Other Folder Uploaded', () => {

        beforeAll(async (done) => {
            let otherFolderUploaded = await uploadActions.uploadFolder(this.alfrescoJsApi, otherFolder.name, "-my-");
            Object.assign(otherFolder, otherFolderUploaded.entry);

            uploadedOthers = await uploadActions.uploadFolderFiles(this.alfrescoJsApi, otherFolder.location, otherFolderUploaded.entry.id);

            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            done();
        });

        afterAll(async (done) => {
            uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, otherFolder.id);
            done();
        });

        it('[C280012] Should be possible to open any other Document supported extension', () => {
            uploadedOthers.forEach((currentFile) => {
                if (currentFile.entry.name != '.DS_Store') {
                    navigationBarPage.openViewer(currentFile.entry.id);
                    viewerPage.checkZoomInButtonIsDisplayed(150000);
                    viewerPage.clickCloseButton();
                    contentServicesPage.checkAcsContainer();
                }
            });
        });

    });

    describe('Image Folder Uploaded', () => {

        beforeAll(async (done) => {
            let imgFolderUploaded = await uploadActions.uploadFolder(this.alfrescoJsApi, imgFolder.name, "-my-");
            Object.assign(imgFolder, imgFolderUploaded.entry);

            uploadedImages = await uploadActions.uploadFolderFiles(this.alfrescoJsApi, imgFolder.location, imgFolderUploaded.entry.id);

            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            done();
        });

        afterAll(async (done) => {
            uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, imgFolder.id);
            done();
        });

        it('[C279966] Should be possible to open any Image supported extension', () => {
            uploadedImages.forEach((currentFile) => {
                if (currentFile.entry.name != ".DS_Store") {
                    navigationBarPage.openViewer(currentFile.entry.id);
                    viewerPage.checkZoomInButtonIsDisplayed(150000);
                    viewerPage.clickCloseButton();
                    contentServicesPage.checkAcsContainer();
                }
            });
        });

    });

    it('[C272813] Should be able to close the viewer when clicking close button', () => {
        navigationBarPage.goToSite(site);
        viewerPage.checkDatatableHeaderIsDisplayed();

        viewerPage.viewFile(pngFile.name);

        viewerPage.checkImgViewerIsDisplayed();

        viewerPage.clickCloseButton();
    });
});
