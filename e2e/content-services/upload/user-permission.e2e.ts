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
import { ApiService, LoginPage, NotificationHistoryPage, StringUtil, UsersActions } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../core/pages/content-services.page';
import { UploadDialogPage } from '../../core/pages/dialog/upload-dialog.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { FileModel } from '../../models/ACS/file.model';
import CONSTANTS = require('../../util/constants');

describe('Upload - User permission', () => {

    const contentServicesPage = new ContentServicesPage();
    const uploadDialog = new UploadDialogPage();
    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const notificationHistoryPage = new NotificationHistoryPage();
    const apiService = new ApiService();
    const usersActions = new UsersActions(apiService);

    const emptyFile = new FileModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });

    const pngFile = new FileModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    const pdfFile = new FileModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_location
    });

    let acsUser, acsUserTwo, consumerSite, managerSite;

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        acsUser = await usersActions.createUser(acsUser);
        acsUserTwo = await usersActions.createUser(acsUserTwo);
    });

    beforeEach(async () => {
        await loginPage.login(acsUser.email, acsUser.password);

        consumerSite = await apiService.getInstance().core.sitesApi.createSite({
            title: StringUtil.generateRandomString(),
            visibility: 'PUBLIC'
        });

        managerSite = await apiService.getInstance().core.sitesApi.createSite({
            title: StringUtil.generateRandomString(),
            visibility: 'PUBLIC'
        });

        await apiService.getInstance().core.sitesApi.addSiteMember(consumerSite.entry.id, {
            id: acsUser.email,
            role: CONSTANTS.CS_USER_ROLES.CONSUMER
        });

        await apiService.getInstance().core.sitesApi.addSiteMember(managerSite.entry.id, {
            id: acsUser.email,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });
    });

    afterEach(async () => {
        await apiService.getInstance().core.sitesApi.deleteSite(managerSite.entry.id, { permanent: true });
        await apiService.getInstance().core.sitesApi.deleteSite(consumerSite.entry.id, { permanent: true });
    });

    describe('Consumer permissions', () => {

        beforeEach(async () => {
            await contentServicesPage.goToDocumentList();
        });

        it('[C291921] Should display tooltip for uploading files without permissions', async () => {
            await navigationBarPage.openContentServicesFolder(consumerSite.entry.guid);

            await contentServicesPage.checkDragAndDropDIsDisplayed();

            await contentServicesPage.dragAndDropFile(emptyFile.location);

            await uploadDialog.fileIsError(emptyFile.name);
            await uploadDialog.displayTooltip();

            await expect(await uploadDialog.getTooltip()).toEqual('Insufficient permissions to upload in this location [403]');
        });

        it('[C279915] Should not be allowed to upload a file in folder with consumer permissions', async () => {
            await contentServicesPage.uploadFile(emptyFile.location);
            await contentServicesPage.checkContentIsDisplayed(emptyFile.name);

            await uploadDialog.fileIsUploaded(emptyFile.name);

            await uploadDialog.clickOnCloseButton();
            await uploadDialog.dialogIsNotDisplayed();

            await navigationBarPage.openContentServicesFolder(consumerSite.entry.guid);

            await browser.sleep(3000);

            await contentServicesPage.uploadFile(emptyFile.location);

            await notificationHistoryPage.checkNotifyContains('You don\'t have the create permission to upload the content');
        });
    });

    describe('full permissions', () => {
        beforeEach(async () => {
            await navigationBarPage.openContentServicesFolder(managerSite.entry.guid);

            await contentServicesPage.goToDocumentList();
        });

        it('[C279917] Should be allowed to upload a file in a folder with manager permissions', async () => {
            await contentServicesPage.uploadFile(emptyFile.location);

            await uploadDialog.fileIsUploaded(emptyFile.name);
        });
    });

    describe('multiple users', () => {
        beforeEach(async () => {
            await contentServicesPage.goToDocumentList();
        });

        it('[C260175] Should two different user upload files in the proper User Home', async () => {
            await contentServicesPage.uploadFile(emptyFile.location);

            await uploadDialog.fileIsUploaded(emptyFile.name);

            await contentServicesPage.checkContentIsDisplayed(emptyFile.name);

            await navigationBarPage.clickLogoutButton();
            await loginPage.login(acsUserTwo.email, acsUserTwo.password);
            await contentServicesPage.goToDocumentList();

            await contentServicesPage.checkContentIsNotDisplayed(emptyFile.name);

            await contentServicesPage.uploadFile(pngFile.location);

            await contentServicesPage.checkContentIsDisplayed(pngFile.name);

            await navigationBarPage.clickLogoutButton();
            await loginPage.login(acsUser.email, acsUser.password);
            await contentServicesPage.goToDocumentList();

            await contentServicesPage.checkContentIsNotDisplayed(pngFile.name);

            await contentServicesPage.uploadFile(pdfFile.location);

            await contentServicesPage.checkContentIsDisplayed(pdfFile.name);
        });
    });
});
