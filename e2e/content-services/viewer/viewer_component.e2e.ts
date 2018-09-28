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

import TestConfig = require('../../test.config');

import LoginPage = require('../../pages/adf/loginPage');
import ViewerPage = require('../../pages/adf/viewerPage');
import NavigationBarPage = require('../../pages/adf/navigationBarPage');
import ContentServicesPage = require('../../pages/adf/contentServicesPage');

import resources = require('../../util/resources');
import Util = require('../../util/util');
import CONSTANTS = require('../../util/constants');

import FileModel = require('../../models/ACS/fileModel');
import FolderModel = require('../../models/ACS/folderModel');
import AcsUserModel = require('../../models/ACS/acsUserModel');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../../actions/ACS/upload.actions';
import { browser } from 'protractor';

describe('Viewer', () => {

    let viewerPage = new ViewerPage();
    let navigationBarPage = new NavigationBarPage();
    let loginPage = new LoginPage();
    let contentServicesPage = new ContentServicesPage();
    let uploadActions = new UploadActions();
    let site;
    let acsUser = new AcsUserModel();
    let pngFileUploaded;

    let pngFileInfo = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    let archiveFolderInfo = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.ARCHIVE_FOLDER.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.ARCHIVE_FOLDER.folder_location
    });

    let excelFolderInfo = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.EXCEL_FOLDER.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.EXCEL_FOLDER.folder_location
    });

    let otherFolderInfo = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.OTHER_FOLDER.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.OTHER_FOLDER.folder_location
    });

    let pptFolderInfo = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.PPT_FOLDER.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.PPT_FOLDER.folder_location
    });

    let textFolderInfo = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.TEXT_FOLDER.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.TEXT_FOLDER.folder_location
    });

    let wordFolderInfo = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.WORD_FOLDER.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.WORD_FOLDER.folder_location
    });

    let imgFolderInfo = new FolderModel({
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
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        pngFileUploaded = await uploadActions.uploadFile(this.alfrescoJsApi, pngFileInfo.location, pngFileInfo.name, site.entry.guid);

        done();
    });

    describe('Archive Folder Uploaded', () => {

        let uploadedArchives;
        let archiveFolderUploaded;

        beforeAll(async (done) => {
            archiveFolderUploaded = await uploadActions.uploadFolder(this.alfrescoJsApi, archiveFolderInfo.name, '-my-');

            uploadedArchives = await uploadActions.uploadFolderFiles(this.alfrescoJsApi, archiveFolderInfo.location, archiveFolderUploaded.entry.id);

            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            done();
        });

        afterAll(async (done) => {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, archiveFolderUploaded.entry.id);
            done();
        });

        it('[C260517] Should be possible to open any Archive file', () => {
            uploadedArchives.forEach((currentFile) => {
                if (currentFile.entry.name !== '.DS_Store') {
                    navigationBarPage.openViewer(currentFile.entry.id);
                    viewerPage.checkZoomInButtonIsDisplayed(15000);
                    viewerPage.clickCloseButton();
                    contentServicesPage.checkAcsContainer();
                }
            });
        });

    });

    describe('Excel Folder Uploaded', () => {

        let uploadedExcels;
        let excelFolderUploaded;

        beforeAll(async (done) => {
            excelFolderUploaded = await uploadActions.uploadFolder(this.alfrescoJsApi, excelFolderInfo.name, '-my-');

            uploadedExcels = await uploadActions.uploadFolderFiles(this.alfrescoJsApi, excelFolderInfo.location, excelFolderUploaded.entry.id);

            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            done();
        });

        afterAll(async (done) => {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, excelFolderUploaded.entry.id);
            done();
        });

        it('[C280008] Should be possible to open any Excel file', () => {
            uploadedExcels.forEach((currentFile) => {
                if (currentFile.entry.name !== '.DS_Store') {
                    navigationBarPage.openViewer(currentFile.entry.id);
                    viewerPage.checkZoomInButtonIsDisplayed(15000);
                    viewerPage.clickCloseButton();
                    contentServicesPage.checkAcsContainer();
                }
            });
        });

    });

    describe('PowerPoint Folder Uploaded', () => {

        let uploadedPpts;
        let pptFolderUploaded;

        beforeAll(async (done) => {
            pptFolderUploaded = await uploadActions.uploadFolder(this.alfrescoJsApi, pptFolderInfo.name, '-my-');

            uploadedPpts = await uploadActions.uploadFolderFiles(this.alfrescoJsApi, pptFolderInfo.location, pptFolderUploaded.entry.id);

            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            done();
        });

        afterAll(async (done) => {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, pptFolderUploaded.entry.id);
            done();
        });

        it('[C280009] Should be possible to open any PowerPoint file', () => {
            uploadedPpts.forEach((currentFile) => {
                if (currentFile.entry.name !== '.DS_Store') {
                    navigationBarPage.openViewer(currentFile.entry.id);
                    viewerPage.checkZoomInButtonIsDisplayed(15000);
                    viewerPage.clickCloseButton();
                    contentServicesPage.checkAcsContainer();
                }
            });
        });

    });

    describe('Text Folder Uploaded', () => {

        let uploadedTexts;
        let textFolderUploaded;

        beforeAll(async (done) => {
            textFolderUploaded = await uploadActions.uploadFolder(this.alfrescoJsApi, textFolderInfo.name, '-my-');

            uploadedTexts = await uploadActions.uploadFolderFiles(this.alfrescoJsApi, textFolderInfo.location, textFolderUploaded.entry.id);

            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            done();
        });

        afterAll(async (done) => {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, textFolderUploaded.entry.id);
            done();
        });

        it('[C280010] Should be possible to open any Text file', () => {
            uploadedTexts.forEach((currentFile) => {
                if (currentFile.entry.name !== '.DS_Store') {
                    navigationBarPage.openViewer(currentFile.entry.id);
                    viewerPage.checkZoomInButtonIsDisplayed(15000);
                    viewerPage.clickCloseButton();
                    contentServicesPage.checkAcsContainer();
                }
            });
        });

    });

    describe('Word Folder Uploaded', () => {

        let uploadedWords;
        let wordFolderUploaded;

        beforeAll(async (done) => {
            wordFolderUploaded = await uploadActions.uploadFolder(this.alfrescoJsApi, wordFolderInfo.name, '-my-');

            uploadedWords = await uploadActions.uploadFolderFiles(this.alfrescoJsApi, wordFolderInfo.location, wordFolderUploaded.entry.id);

            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            done();
        });

        afterAll(async (done) => {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, wordFolderUploaded.entry.id);
            done();
        });

        it('[C280011] Should be possible to open any Word file', () => {
            uploadedWords.forEach((currentFile) => {
                if (currentFile.entry.name !== '.DS_Store') {
                    navigationBarPage.openViewer(currentFile.entry.id);
                    viewerPage.checkZoomInButtonIsDisplayed(15000);
                    viewerPage.clickCloseButton();
                    contentServicesPage.checkAcsContainer();
                }
            });
        });

    });

    describe('Other Folder Uploaded', () => {

        let uploadedOthers;
        let otherFolderUploaded;

        beforeAll(async (done) => {
            otherFolderUploaded = await uploadActions.uploadFolder(this.alfrescoJsApi, otherFolderInfo.name, '-my-');

            uploadedOthers = await uploadActions.uploadFolderFiles(this.alfrescoJsApi, otherFolderInfo.location, otherFolderUploaded.entry.id);

            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            done();
        });

        afterAll(async (done) => {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, otherFolderUploaded.entry.id);
            done();
        });

        it('[C280012] Should be possible to open any other Document supported extension', () => {
            uploadedOthers.forEach((currentFile) => {
                if (currentFile.entry.name !== '.DS_Store') {
                    navigationBarPage.openViewer(currentFile.entry.id);
                    viewerPage.checkZoomInButtonIsDisplayed(15000);
                    viewerPage.clickCloseButton();
                    contentServicesPage.checkAcsContainer();
                }
            });
        });

    });

    describe('Image Folder Uploaded', () => {

        let uploadedImages;
        let imgFolderUploaded;

        beforeAll(async (done) => {
            imgFolderUploaded = await uploadActions.uploadFolder(this.alfrescoJsApi, imgFolderInfo.name, '-my-');

            uploadedImages = await uploadActions.uploadFolderFiles(this.alfrescoJsApi, imgFolderInfo.location, imgFolderUploaded.entry.id);

            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            done();
        });

        afterAll(async (done) => {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, imgFolderUploaded.entry.id);
            done();
        });

        it('[C279966] Should be possible to open any Image supported extension', () => {
            uploadedImages.forEach((currentFile) => {
                if (currentFile.entry.name !== '.DS_Store') {
                    navigationBarPage.openViewer(currentFile.entry.id);
                    viewerPage.checkZoomInButtonIsDisplayed(15000);
                    viewerPage.clickCloseButton();
                    contentServicesPage.checkAcsContainer();
                }
            });
        });

    });

    it('[C272813] Should be redirected to site when opening and closing a file in a site', () => {
        navigationBarPage.goToSite(site);
        viewerPage.checkDatatableHeaderIsDisplayed();

        viewerPage.viewFile(pngFileUploaded.entry.name);

        viewerPage.checkImgViewerIsDisplayed();

        viewerPage.clickCloseButton();
    });
});
