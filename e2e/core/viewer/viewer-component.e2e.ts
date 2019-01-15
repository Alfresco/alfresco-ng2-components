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

import { LoginPage } from '../../pages/adf/loginPage';
import { ViewerPage } from '../../pages/adf/viewerPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { DocumentListPage } from '../../pages/adf/content-services/documentListPage';
import { ShareDialog } from '../../pages/adf/dialog/shareDialog';
import { AboutPage } from '../../pages/adf/demo-shell/aboutPage';

import CONSTANTS = require('../../util/constants');
import resources = require('../../util/resources');
import { Util } from '../../util/util';

import { FileModel } from '../../models/ACS/fileModel';
import { FolderModel } from '../../models/ACS/folderModel';
import { AcsUserModel } from '../../models/ACS/acsUserModel';

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../../actions/ACS/upload.actions';
import { browser } from 'protractor';
import { viewWrappedDebugError } from '@angular/core/src/view/errors';

xdescribe('Viewer', () => {

    let viewerPage = new ViewerPage();
    let navigationBarPage = new NavigationBarPage();
    let loginPage = new LoginPage();
    let contentServicesPage = new ContentServicesPage();
    let uploadActions = new UploadActions();
    let site;
    let acsUser = new AcsUserModel();
    let pngFileUploaded;
    const contentList = new DocumentListPage();
    const shareDialog = new ShareDialog();
    const about = new AboutPage();

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

    let imgRenditionFolderInfo = new FolderModel({
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
            contentServicesPage.navigateToFolder('archive');

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
            contentServicesPage.navigateToFolder('excel');

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
            contentServicesPage.navigateToFolder('ppt');

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
            contentServicesPage.navigateToFolder('text');

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
            contentServicesPage.navigateToFolder('word');

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
            contentServicesPage.navigateToFolder('other');

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
            contentServicesPage.navigateToFolder('images');

            uploadedImages.forEach((currentFile) => {
                if (currentFile.entry.name !== '.DS_Store') {
                    contentServicesPage.doubleClickRow(currentFile.entry.name);
                    viewerPage.checkImgViewerIsDisplayed();
                    viewerPage.clickCloseButton();
                }
            });

            contentServicesPage.navigateToFolder('images-rendition');

            uploadedImgRenditionFolderInfo.forEach((currentFile) => {
                if (currentFile.entry.name !== '.DS_Store') {
                    contentServicesPage.doubleClickRow(currentFile.entry.name);
                    viewerPage.checkFileIsLoaded();
                    viewerPage.clickCloseButton();
                }
            });
        });

    });

    describe('Display files via API', () => {

        let wordFileInfo = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.DOCX_SUPPORTED.file_name,
            'location': resources.Files.ADF_DOCUMENTS.DOCX_SUPPORTED.file_location
        });

        let pngFileShared, wordFileUploaded;

        beforeAll(async (done) => {
            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

            wordFileUploaded = await uploadActions.uploadFile(this.alfrescoJsApi, wordFileInfo.location, wordFileInfo.name, '-my-');

            pngFileShared = await this.alfrescoJsApi.core.sharedlinksApi.addSharedLink({ 'nodeId': pngFileUploaded.entry.id });

            done();
        });

        afterAll(async (done) => {
            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, wordFileUploaded.entry.id);
            done();
        });

        beforeEach(() => {
            loginPage.loginToContentServicesUsingUserModel(acsUser);
        });

        it('[C260105] Should be able to open an image file shared via API', () => {
            browser.get(TestConfig.adf.url + '/preview/s/' + pngFileShared.entry.id);
            viewerPage.checkImgContainerIsDisplayed();
            browser.get(TestConfig.adf.url);
            navigationBarPage.clickLogoutButton();
            browser.get(TestConfig.adf.url + '/preview/s/' + pngFileShared.entry.id);
            viewerPage.checkImgContainerIsDisplayed();
        });

        it('[C260106] Should be able to open a Word file shared via API', () => {
            contentServicesPage.navigateToDocumentList();

            contentList.dataTablePage().clickRowToSelect(wordFileInfo.name);
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.clickShareLinkButton();
            browser.controlFlow().execute(async () => {
                let sharedLink = await shareDialog.getShareLink();

                await browser.get(sharedLink);
                viewerPage.checkFileIsLoaded();
                viewerPage.checkFileNameIsDisplayed(wordFileInfo.name);

                await browser.get(TestConfig.adf.url);
                navigationBarPage.clickLogoutButton();
                await browser.get(sharedLink);
                viewerPage.checkFileIsLoaded();
                viewerPage.checkFileNameIsDisplayed(wordFileInfo.name);
            });
        });
    });

    describe('Viewer - Code editor extension', () => {

        let jsFileInfo = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.JS.file_name,
            'location': resources.Files.ADF_DOCUMENTS.JS.file_location
        });

        let jsFileUploaded;

        beforeAll(async (done) => {
            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

            jsFileUploaded = await uploadActions.uploadFile(this.alfrescoJsApi, jsFileInfo.location, jsFileInfo.name, '-my-');

            loginPage.loginToContentServicesUsingUserModel(acsUser);

            done();
        });

        afterAll(async (done) => {
            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, jsFileUploaded.entry.id);
            done();
        });

        it('[C297698] Should be able to add an extension for code editor viewer', () => {
            navigationBarPage.checkAboutButtonIsDisplayed();
            navigationBarPage.clickAboutButton();

            about.checkMonacoPluginIsDisplayed();

            navigationBarPage.clickContentServicesButton();

            contentServicesPage.waitForTableBody();
            contentServicesPage.checkContentIsDisplayed(jsFileInfo.name);
            contentServicesPage.doubleClickRow(jsFileInfo.name);

            viewerPage.checkCodeViewerIsDisplayed();
        });
    });
});
