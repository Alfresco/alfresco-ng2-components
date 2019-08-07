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

import { StringUtil, LoginPage, NotificationHistoryPage } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { UploadDialog } from '../../pages/adf/dialog/uploadDialog';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';

import resources = require('../../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';

import CONSTANTS = require('../../util/constants');

describe('Upload - User permission', () => {

    const contentServicesPage = new ContentServicesPage();
    const uploadDialog = new UploadDialog();
    const loginPage = new LoginPage();
    let acsUser;
    let acsUserTwo;
    const navigationBarPage = new NavigationBarPage();
    const notificationHistoryPage = new NotificationHistoryPage();

    const emptyFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });

    const pngFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    const pdfFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF.file_location
    });

    beforeAll(() => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: browser.params.testConfig.adf_acs.host
        });
    });

    beforeEach(async (done) => {
        acsUser = new AcsUserModel();
        acsUserTwo = new AcsUserModel();

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUserTwo);

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        this.consumerSite = await this.alfrescoJsApi.core.sitesApi.createSite({
            title: StringUtil.generateRandomString(),
            visibility: 'PUBLIC'
        });

        this.managerSite = await this.alfrescoJsApi.core.sitesApi.createSite({
            title: StringUtil.generateRandomString(),
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

            notificationHistoryPage.checkNotifyContains('You don\'t have the create permission to upload the content');
        });

    });

    describe('full permissions', () => {

        beforeEach(async (done) => {
            navigationBarPage.openContentServicesFolder(this.managerSite.entry.guid);

            contentServicesPage.goToDocumentList();

            done();
        });

        it('[C279917] Should be allowed to upload a file in a folder with manager permissions', () => {
            contentServicesPage.uploadFile(emptyFile.location);

            uploadDialog.fileIsUploaded(emptyFile.name);
        });

    });

    describe('multiple users', () => {

        beforeEach(async (done) => {
            contentServicesPage.goToDocumentList();

            done();
        });

        it('[C260175] Should two different user upload files in the proper User Home', async () => {
            contentServicesPage.uploadFile(emptyFile.location);

            uploadDialog.fileIsUploaded(emptyFile.name);

            contentServicesPage.checkContentIsDisplayed(emptyFile.name);

            navigationBarPage.clickLoginButton();
            await loginPage.loginToContentServicesUsingUserModel(acsUserTwo);
            contentServicesPage.goToDocumentList();

            contentServicesPage.checkContentIsNotDisplayed(emptyFile.name);

            contentServicesPage.uploadFile(pngFile.location);

            contentServicesPage.checkContentIsDisplayed(pngFile.name);

            navigationBarPage.clickLoginButton();
            await loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            contentServicesPage.checkContentIsNotDisplayed(pngFile.name);

            contentServicesPage.uploadFile(pdfFile.location);

            contentServicesPage.checkContentIsDisplayed(pdfFile.name);
        });
    });

});
