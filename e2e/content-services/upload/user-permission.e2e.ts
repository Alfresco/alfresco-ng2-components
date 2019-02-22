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

import { browser } from 'protractor';

import { Util } from '../../util/util';

import { LoginPage } from '../../pages/adf/loginPage';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { UploadDialog } from '../../pages/adf/dialog/uploadDialog';
import { UploadToggles } from '../../pages/adf/dialog/uploadToggles';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { NotificationPage } from '../../pages/adf/notificationPage';

import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';
import { FolderModel } from '../../models/ACS/folderModel';

import TestConfig = require('../../test.config');
import resources = require('../../util/resources');

import AlfrescoApi = require('@alfresco/js-api');
import CONSTANTS = require('../../util/constants');

describe('Upload - User permission', () => {

    let contentServicesPage = new ContentServicesPage();
    let uploadDialog = new UploadDialog();
    let uploadToggles = new UploadToggles();
    let loginPage = new LoginPage();
    let acsUser;
    let acsUserTwo;
    let navigationBarPage = new NavigationBarPage();
    let notificationPage = new NotificationPage();

    let emptyFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });

    let pngFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    let pdfFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF.file_location
    });

    let folder = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.FOLDER_ONE.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.FOLDER_ONE.folder_location
    });

    beforeAll(() => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });
    });

    beforeEach(async (done) => {
        acsUser = new AcsUserModel();
        acsUserTwo = new AcsUserModel();

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUserTwo);

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        this.consumerSite = await this.alfrescoJsApi.core.sitesApi.createSite({
            title: Util.generateRandomString(),
            visibility: 'PUBLIC'
        });

        this.managerSite = await this.alfrescoJsApi.core.sitesApi.createSite({
            title: Util.generateRandomString(),
            visibility: 'PUBLIC'
        });

        await this.alfrescoJsApi.core.sitesApi.addSiteMember(this.consumerSite.entry.id, {
            id: acsUser.id,
            role: CONSTANTS.CS_USER_ROLES.CONSUMER
        });

        await this.alfrescoJsApi.core.sitesApi.addSiteMember(this.managerSite.entry.id, {
            id: acsUser.id,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });

        done();
    });

    describe('Consumer permissions', () => {

        beforeEach(async (done) => {
            contentServicesPage.goToDocumentList();

            done();
        });

        it('[C212861] Should not be allowed to Drag and drop a file/folder in a folder with consumer permissions', () => {
            contentServicesPage.checkDragAndDropDIsDisplayed();

            contentServicesPage.dragAndDropFile(emptyFile.location);
            contentServicesPage.dragAndDropFolder(folder.location);

            contentServicesPage.checkContentIsDisplayed(emptyFile.name);
            contentServicesPage.checkContentIsDisplayed(folder.name);

            navigationBarPage.openContentServicesFolder(this.consumerSite.entry.guid);

            browser.sleep(3000);

            contentServicesPage.dragAndDropFile(emptyFile.location);
            contentServicesPage.dragAndDropFolder(folder.location);

            let fileInTheUploadedFolder = 'share_profile_pic.png';

            uploadDialog.fileIsError(emptyFile.name);
            uploadDialog.fileIsError(fileInTheUploadedFolder);

            contentServicesPage.checkContentIsNotDisplayed(emptyFile.name);
            contentServicesPage.checkContentIsNotDisplayed(folder.name);
        });

        it('[C291921] Should display tooltip for uploading files without permissions', () => {
            navigationBarPage.openContentServicesFolder(this.consumerSite.entry.guid);

            contentServicesPage.checkDragAndDropDIsDisplayed();

            contentServicesPage.dragAndDropFile(emptyFile.location);

            uploadDialog.fileIsError(emptyFile.name);

            uploadDialog.displayTooltip();

            expect(uploadDialog.getTooltip()).toEqual('Insufficient permissions to upload in this location [403]');
        });

        it('[C279915] Should not be allowed to upload a file in folder with consumer permissions', () => {
            contentServicesPage.uploadFile(emptyFile.location).checkContentIsDisplayed(emptyFile.name);

            uploadDialog.fileIsUploaded(emptyFile.name);

            uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

            navigationBarPage.openContentServicesFolder(this.consumerSite.entry.guid);

            browser.sleep(3000);

            contentServicesPage.uploadFile(emptyFile.location);

            notificationPage.checkNotifyContains('You don\'t have the create permission to upload the content');
        });

        it('[C279916] Should not be allowed to upload a folder in folder with consumer permissions', () => {
            uploadToggles.enableFolderUpload();

            contentServicesPage.uploadFolder(folder.location)
                .checkContentIsDisplayed(folder.name);

            let fileInTheUploadedFolder = 'share_profile_pic.png';

            uploadDialog.fileIsUploaded(fileInTheUploadedFolder);

            uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

            navigationBarPage.openContentServicesFolder(this.consumerSite.entry.guid);

            browser.sleep(3000);

            uploadToggles.enableFolderUpload();

            contentServicesPage.uploadFolder(folder.location);

            notificationPage.checkNotifyContains('You don\'t have the create permission to upload the content');
        });
    });

    describe('full permissions', () => {

        beforeEach(async (done) => {
            navigationBarPage.openContentServicesFolder(this.managerSite.entry.guid);

            contentServicesPage.goToDocumentList();

            done();
        });

        it('[C260130] Should be allowed to Drag and drop a file/folder in a folder with manager permissions', () => {
            contentServicesPage.checkDragAndDropDIsDisplayed();

            contentServicesPage.dragAndDropFile(emptyFile.location);
            contentServicesPage.dragAndDropFolder(folder.location);

            let fileInTheUploadedFolder = 'share_profile_pic.png';

            uploadDialog.fileIsUploaded(emptyFile.name);
            uploadDialog.fileIsUploaded(fileInTheUploadedFolder);
        });

        it('[C279917] Should be allowed to upload a file in a folder with manager permissions', () => {
            contentServicesPage.uploadFile(emptyFile.location);

            uploadDialog.fileIsUploaded(emptyFile.name);
        });

        it('[C279918] Should be allowed to upload a folder in a folder with manager permissions', () => {
            uploadToggles.enableFolderUpload();

            contentServicesPage.uploadFolder(folder.location);
            uploadDialog.checkUploadCompleted().then(() => {
                contentServicesPage.checkContentIsDisplayed(folder.name);
            });

            let fileInTheUploadedFolder = 'share_profile_pic.png';

            uploadDialog.fileIsUploaded(fileInTheUploadedFolder);
        });
    });

    describe('multiple users', () => {

        beforeEach(async (done) => {
            contentServicesPage.goToDocumentList();

            done();
        });

        it('[C260175] Should two different user upload files in the proper User Home', () => {
            contentServicesPage.uploadFile(emptyFile.location);

            uploadDialog.fileIsUploaded(emptyFile.name);

            contentServicesPage.checkContentIsDisplayed(emptyFile.name);

            navigationBarPage.clickLoginButton();
            loginPage.loginToContentServicesUsingUserModel(acsUserTwo);
            contentServicesPage.goToDocumentList();

            contentServicesPage.checkContentIsNotDisplayed(emptyFile.name);

            contentServicesPage.uploadFile(pngFile.location);

            contentServicesPage.checkContentIsDisplayed(pngFile.name);

            navigationBarPage.clickLoginButton();
            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            contentServicesPage.checkContentIsNotDisplayed(pngFile.name);

            contentServicesPage.uploadFile(pdfFile.location);

            contentServicesPage.checkContentIsDisplayed(pdfFile.name);
        });
    });

});
