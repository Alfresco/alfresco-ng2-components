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

import TestConfig = require('../../test.config');

import { LoginPage } from '@alfresco/adf-testing';
import { ViewerPage } from '../../pages/adf/viewerPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';

import CONSTANTS = require('../../util/constants');
import resources = require('../../util/resources');
import { StringUtil } from '@alfresco/adf-testing';

import { FileModel } from '../../models/ACS/fileModel';
import { FolderModel } from '../../models/ACS/folderModel';
import { AcsUserModel } from '../../models/ACS/acsUserModel';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '../../actions/ACS/upload.actions';

describe('Viewer', () => {

    const viewerPage = new ViewerPage();
    const navigationBarPage = new NavigationBarPage();
    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const uploadActions = new UploadActions();
    let site;
    const acsUser = new AcsUserModel();
    let pngFileUploaded;

    const pngFileInfo = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    const archiveFolderInfo = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.ARCHIVE_FOLDER.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.ARCHIVE_FOLDER.folder_location
    });

    const excelFolderInfo = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.EXCEL_FOLDER.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.EXCEL_FOLDER.folder_location
    });

    const otherFolderInfo = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.OTHER_FOLDER.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.OTHER_FOLDER.folder_location
    });

    const pptFolderInfo = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.PPT_FOLDER.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.PPT_FOLDER.folder_location
    });

    const textFolderInfo = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.TEXT_FOLDER.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.TEXT_FOLDER.folder_location
    });

    const wordFolderInfo = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.WORD_FOLDER.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.WORD_FOLDER.folder_location
    });

    const imgFolderInfo = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.IMG_FOLDER.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.IMG_FOLDER.folder_location
    });

    const imgRenditionFolderInfo = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.IMG_RENDITION_FOLDER.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.IMG_RENDITION_FOLDER.folder_location
    });

    beforeAll(async (done) => {

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        site = await this.alfrescoJsApi.core.sitesApi.createSite({
            title: StringUtil.generateRandomString(8),
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

    it('[C272813] Should be redirected to site when opening and closing a file in a site', () => {
        loginPage.loginToContentServicesUsingUserModel(acsUser);

        navigationBarPage.goToSite(site);
        contentServicesPage.checkAcsContainer();

        viewerPage.viewFile(pngFileUploaded.entry.name);

        viewerPage.checkImgViewerIsDisplayed();

        viewerPage.clickCloseButton();
    });

    describe('Archive Folder Uploaded', () => {
        let uploadedArchives;
        let archiveFolderUploaded;

        beforeAll(async (done) => {
            archiveFolderUploaded = await uploadActions.createFolder(this.alfrescoJsApi, archiveFolderInfo.name, '-my-');

            uploadedArchives = await uploadActions.uploadFolder(this.alfrescoJsApi, archiveFolderInfo.location, archiveFolderUploaded.entry.id);

            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            done();
        });

        afterAll(async (done) => {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, archiveFolderUploaded.entry.id);
            done();
        });

        it('[C260517] Should be possible to open any Archive file', () => {
            contentServicesPage.doubleClickRow('archive');

            uploadedArchives.forEach((currentFile) => {
                if (currentFile.entry.name !== '.DS_Store') {
                    contentServicesPage.doubleClickRow(currentFile.entry.name);
                    viewerPage.checkFileIsLoaded();
                    viewerPage.clickCloseButton();
                }
            });
        });

    });

    describe('Excel Folder Uploaded', () => {

        let uploadedExcels;
        let excelFolderUploaded;

        beforeAll(async (done) => {
            excelFolderUploaded = await uploadActions.createFolder(this.alfrescoJsApi, excelFolderInfo.name, '-my-');

            uploadedExcels = await uploadActions.uploadFolder(this.alfrescoJsApi, excelFolderInfo.location, excelFolderUploaded.entry.id);

            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            done();
        });

        afterAll(async (done) => {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, excelFolderUploaded.entry.id);
            done();
        });

        it('[C280008] Should be possible to open any Excel file', () => {
            contentServicesPage.doubleClickRow('excel');

            uploadedExcels.forEach((currentFile) => {
                if (currentFile.entry.name !== '.DS_Store') {
                    contentServicesPage.doubleClickRow(currentFile.entry.name);
                    viewerPage.checkFileIsLoaded();
                    viewerPage.clickCloseButton();
                }
            });
        });

    });

    describe('PowerPoint Folder Uploaded', () => {

        let uploadedPpt;
        let pptFolderUploaded;

        beforeAll(async (done) => {
            pptFolderUploaded = await uploadActions.createFolder(this.alfrescoJsApi, pptFolderInfo.name, '-my-');

            uploadedPpt = await uploadActions.uploadFolder(this.alfrescoJsApi, pptFolderInfo.location, pptFolderUploaded.entry.id);

            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            done();
        });

        afterAll(async (done) => {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, pptFolderUploaded.entry.id);
            done();
        });

        it('[C280009] Should be possible to open any PowerPoint file', () => {
            contentServicesPage.doubleClickRow('ppt');

            uploadedPpt.forEach((currentFile) => {
                if (currentFile.entry.name !== '.DS_Store') {
                    contentServicesPage.doubleClickRow(currentFile.entry.name);
                    viewerPage.checkFileIsLoaded();
                    viewerPage.clickCloseButton();
                }
            });
        });

    });

    describe('Text Folder Uploaded', () => {

        let uploadedTexts;
        let textFolderUploaded;

        beforeAll(async (done) => {
            textFolderUploaded = await uploadActions.createFolder(this.alfrescoJsApi, textFolderInfo.name, '-my-');

            uploadedTexts = await uploadActions.uploadFolder(this.alfrescoJsApi, textFolderInfo.location, textFolderUploaded.entry.id);

            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            done();
        });

        afterAll(async (done) => {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, textFolderUploaded.entry.id);
            done();
        });

        it('[C280010] Should be possible to open any Text file', () => {
            contentServicesPage.doubleClickRow('text');

            uploadedTexts.forEach((currentFile) => {
                if (currentFile.entry.name !== '.DS_Store') {
                    contentServicesPage.doubleClickRow(currentFile.entry.name);
                    viewerPage.checkFileIsLoaded();
                    viewerPage.clickCloseButton();
                }
            });
        });

    });

    describe('Word Folder Uploaded', () => {

        let uploadedWords;
        let wordFolderUploaded;

        beforeAll(async (done) => {
            wordFolderUploaded = await uploadActions.createFolder(this.alfrescoJsApi, wordFolderInfo.name, '-my-');

            uploadedWords = await uploadActions.uploadFolder(this.alfrescoJsApi, wordFolderInfo.location, wordFolderUploaded.entry.id);

            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            done();
        });

        afterAll(async (done) => {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, wordFolderUploaded.entry.id);
            done();
        });

        it('[C280011] Should be possible to open any Word file', () => {
            contentServicesPage.doubleClickRow('word');

            uploadedWords.forEach((currentFile) => {
                if (currentFile.entry.name !== '.DS_Store') {
                    contentServicesPage.doubleClickRow(currentFile.entry.name);
                    viewerPage.checkFileIsLoaded();
                    viewerPage.clickCloseButton();
                }
            });
        });

    });

    describe('Other Folder Uploaded', () => {

        let uploadedOthers;
        let otherFolderUploaded;

        beforeAll(async (done) => {
            otherFolderUploaded = await uploadActions.createFolder(this.alfrescoJsApi, otherFolderInfo.name, '-my-');

            uploadedOthers = await uploadActions.uploadFolder(this.alfrescoJsApi, otherFolderInfo.location, otherFolderUploaded.entry.id);

            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            done();
        });

        afterAll(async (done) => {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, otherFolderUploaded.entry.id);
            done();
        });

        it('[C280012] Should be possible to open any other Document supported extension', () => {
            contentServicesPage.doubleClickRow('other');

            uploadedOthers.forEach((currentFile) => {
                if (currentFile.entry.name !== '.DS_Store') {
                    contentServicesPage.doubleClickRow(currentFile.entry.name);
                    viewerPage.checkFileIsLoaded();
                    viewerPage.clickCloseButton();
                }
            });
        });

    });

    describe('Image Folder Uploaded', () => {

        let uploadedImages, uploadedImgRenditionFolderInfo;
        let imgFolderUploaded, imgFolderRenditionUploaded;

        beforeAll(async (done) => {
            imgFolderUploaded = await uploadActions.createFolder(this.alfrescoJsApi, imgFolderInfo.name, '-my-');

            uploadedImages = await uploadActions.uploadFolder(this.alfrescoJsApi, imgFolderInfo.location, imgFolderUploaded.entry.id);

            imgFolderRenditionUploaded = await uploadActions.createFolder(this.alfrescoJsApi, imgRenditionFolderInfo.name, imgFolderUploaded.entry.id);

            uploadedImgRenditionFolderInfo = await uploadActions.uploadFolder(this.alfrescoJsApi, imgRenditionFolderInfo.location, imgFolderRenditionUploaded.entry.id);

            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            done();
        });

        afterAll(async (done) => {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, imgFolderUploaded.entry.id);
            done();
        });

        it('[C279966] Should be possible to open any Image supported extension', () => {
            contentServicesPage.doubleClickRow('images');

            uploadedImages.forEach((currentFile) => {
                if (currentFile.entry.name !== '.DS_Store') {
                    contentServicesPage.doubleClickRow(currentFile.entry.name);
                    viewerPage.checkImgViewerIsDisplayed();
                    viewerPage.clickCloseButton();
                }
            });

            contentServicesPage.doubleClickRow('images-rendition');

            uploadedImgRenditionFolderInfo.forEach((currentFile) => {
                if (currentFile.entry.name !== '.DS_Store') {
                    contentServicesPage.doubleClickRow(currentFile.entry.name);
                    viewerPage.checkFileIsLoaded();
                    viewerPage.clickCloseButton();
                }
            });
        });

    });

});
