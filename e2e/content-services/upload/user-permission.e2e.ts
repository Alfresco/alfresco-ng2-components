/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { createApiService, LoginPage, SnackbarPage, StringUtil, UserModel, UsersActions } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../core/pages/content-services.page';
import { UploadDialogPage } from '../../core/pages/dialog/upload-dialog.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { FileModel } from '../../models/ACS/file.model';
import CONSTANTS = require('../../util/constants');
import { SiteEntry, SitesApi } from '@alfresco/js-api';

describe('Upload - User permission', () => {

    const contentServicesPage = new ContentServicesPage();
    const uploadDialog = new UploadDialogPage();
    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);

    const emptyFile = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });

    let acsUser: UserModel;
    let acsUserTwo: UserModel;
    let consumerSite: SiteEntry;
    let managerSite: SiteEntry;

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        acsUser = await usersActions.createUser(acsUser);
        acsUserTwo = await usersActions.createUser(acsUserTwo);
        await loginPage.login(acsUser.username, acsUser.password);
    });

    beforeEach(async () => {
        await apiService.loginWithProfile('admin');
        const sitesApi = new SitesApi(apiService.getInstance());

        consumerSite = await sitesApi.createSite({
            title: StringUtil.generateRandomString(),
            visibility: 'PUBLIC'
        });

        managerSite = await sitesApi.createSite({
            title: StringUtil.generateRandomString(),
            visibility: 'PUBLIC'
        });

        await sitesApi.createSiteMembership(consumerSite.entry.id, {
            id: acsUser.username,
            role: CONSTANTS.CS_USER_ROLES.CONSUMER
        });

        await sitesApi.createSiteMembership(managerSite.entry.id, {
            id: acsUser.username,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });
    });

    afterEach(async () => {
        const sitesApi = new SitesApi(apiService.getInstance());

        await sitesApi.deleteSite(managerSite.entry.id, { permanent: true });
        await sitesApi.deleteSite(consumerSite.entry.id, { permanent: true });
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

            const message = await new SnackbarPage().getSnackBarMessage();
            expect(message).toEqual('You don\'t have the create permission to upload the content');
        });
    });

    describe('full permissions', () => {
        beforeEach(async () => {
            await apiService.loginWithProfile('admin');
            await navigationBarPage.openContentServicesFolder(managerSite.entry.guid);
            await contentServicesPage.goToDocumentList();
        });

        it('[C279917] Should be allowed to upload a file in a folder with manager permissions', async () => {
            await contentServicesPage.uploadFile(emptyFile.location);
            await uploadDialog.fileIsUploaded(emptyFile.name);
        });
    });
});
