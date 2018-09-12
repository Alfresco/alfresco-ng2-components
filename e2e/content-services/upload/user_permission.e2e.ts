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

import { element, by } from 'protractor';

import LoginPage = require('../../pages/adf/loginPage');
import ContentServicesPage = require('../../pages/adf/contentServicesPage');
import UploadDialog = require('../../pages/adf/dialog/uploadDialog');
import UploadToggles = require('../../pages/adf/dialog/uploadToggles');
import NavigationBarPage = require('../../pages/adf/navigationBarPage');
import NotificationPage = require('../../pages/adf/notificationPage');

import AcsUserModel = require('../../models/ACS/acsUserModel');
import FileModel = require('../../models/ACS/fileModel');
import FolderModel = require('../../models/ACS/folderModel');

import TestConfig = require('../../test.config');
import resources = require('../../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { DropActions } from '../../actions/drop.actions';

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

        done();
    });

    describe('limited permissions', () => {

        beforeEach(async (done) => {
            contentServicesPage.goToDocumentList();

            done();
        });

        it('[C212861] Should not be allowed to Drag and drop a file/folder in a restricted user folder with limited permissions', () => {
            contentServicesPage.checkDandDIsDisplayed();

            let dragAndDrop = new DropActions();
            let dragAndDropArea = element(by.css('adf-upload-drag-area div'));

            dragAndDrop.dropFile(dragAndDropArea, emptyFile.location);
            dragAndDrop.dropFolder(dragAndDropArea, folder.location);

            contentServicesPage.checkContentIsDisplayed(emptyFile.name);
            contentServicesPage.checkContentIsDisplayed(folder.name);

            contentServicesPage.navigateToFolderViaBreadcrumbs('User Homes');

            dragAndDrop.dropFile(dragAndDropArea, emptyFile.location);
            dragAndDrop.dropFolder(dragAndDropArea, folder.location);

            let fileInTheUploadedFolder = 'share_profile_pic.png';

            uploadDialog.fileIsError(emptyFile.name);
            uploadDialog.fileIsError(fileInTheUploadedFolder);

            contentServicesPage.checkContentIsNotDisplayed(emptyFile.name);
            contentServicesPage.checkContentIsNotDisplayed(folder.name);
        });

        it('[C279915] Should not be allowed to upload a file in a restricted user folder with limited permissions', () => {
            navigationBarPage.clickLoginButton();

            loginPage.loginToContentServicesUsingUserModel(acsUser);

            contentServicesPage.goToDocumentList();

            contentServicesPage.uploadFile(emptyFile.location).checkContentIsDisplayed(emptyFile.name);

            uploadDialog.fileIsUploaded(emptyFile.name);

            uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

            contentServicesPage.navigateToFolderViaBreadcrumbs('User Homes');

            contentServicesPage.uploadFile(emptyFile.location);

            notificationPage.checkNotifyContains('You don\'t have the create permission to upload the content');
        });

        it('[C279916] Should not be allowed to upload a folder in a restricted user folder with limited permissions', () => {
            uploadToggles.enableFolderUpload();

            contentServicesPage.uploadFolder(folder.location).checkContentIsDisplayed(folder.name);

            let fileInTheUploadedFolder = 'share_profile_pic.png';

            uploadDialog.fileIsUploaded(fileInTheUploadedFolder);

            uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

            contentServicesPage.navigateToFolderViaBreadcrumbs('User Homes');

            uploadToggles.enableFolderUpload();

            contentServicesPage.uploadFolder(folder.location);

            notificationPage.checkNotifyContains('You don\'t have the create permission to upload the content');
        });
    });

    describe('full permissions', () => {

        beforeEach(async (done) => {
            contentServicesPage.goToDocumentList();

            done();
        });

        it('[C260130] Should be allowed to Drag and drop a file/folder in a restricted user folder with full permissions', () => {
            contentServicesPage.checkDandDIsDisplayed();

            let dragAndDrop = new DropActions();

            let dragAndDropArea = element(by.css('adf-upload-drag-area div'));

            dragAndDrop.dropFile(dragAndDropArea, emptyFile.location);
            dragAndDrop.dropFolder(dragAndDropArea, folder.location);

            let fileInTheUploadedFolder = 'share_profile_pic.png';

            uploadDialog.fileIsUploaded(emptyFile.name);
            uploadDialog.fileIsUploaded(fileInTheUploadedFolder);
        });

        it('[C279917] Should be allowed to upload a file in a restricted user folder with full permissions', () => {
            contentServicesPage.uploadFile(emptyFile.location);

            uploadDialog.fileIsUploaded(emptyFile.name);
        });

        it('[C279918] Should be allowed to upload a folder in a restricted user folder with full permissions', () => {
            uploadToggles.enableFolderUpload();

            contentServicesPage.uploadFolder(folder.location);

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
