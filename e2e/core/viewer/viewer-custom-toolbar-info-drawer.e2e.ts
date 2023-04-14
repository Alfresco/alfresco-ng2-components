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
import { createApiService, FileBrowserUtil, LoginPage, UploadActions, UserModel, UsersActions, ViewerPage } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../core/pages/content-services.page';
import { FileModel } from '../../models/ACS/file.model';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { VersionManagePage } from '../pages/version-manager.page';

describe('Viewer', () => {

    const navigationBarPage = new NavigationBarPage();
    const viewerPage = new ViewerPage();
    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();

    const apiService = createApiService();
    const uploadActions = new UploadActions(apiService);
    const usersActions = new UsersActions(apiService);

    const versionManagePage = new VersionManagePage();
    const acsUser = new UserModel();
    let txtFileUploaded;

    const txtFileInfo = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.TXT.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.TXT.file_path
    });

    const fileModelVersionTwo = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.TXT.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.TXT.file_location
    });

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');
        await usersActions.createUser(acsUser);

        await apiService.login(acsUser.username, acsUser.password);

        txtFileUploaded = await uploadActions.uploadFile(txtFileInfo.location, txtFileInfo.name, '-my-');

        await loginPage.login(acsUser.username, acsUser.password);
   });

    afterAll(async () => {
        await apiService.loginWithProfile('admin');
        await uploadActions.deleteFileOrFolder(txtFileUploaded.entry.id);
        await navigationBarPage.clickLogoutButton();
   });

    beforeEach(async () => {
        await contentServicesPage.goToDocumentList();
        await contentServicesPage.doubleClickRow(txtFileUploaded.entry.name);
        await viewerPage.waitTillContentLoaded();
    });

    afterEach(async () => {
        await viewerPage.clickCloseButton();
    });

    it('[C260096] Should the Viewer able to accept a customToolbar', async () => {
        await viewerPage.clickLeftSidebarButton();
        await viewerPage.checkLeftSideBarIsDisplayed();
        await viewerPage.checkToolbarIsDisplayed();
        await viewerPage.enableCustomToolbar();
        await viewerPage.checkCustomToolbarIsDisplayed();
        await viewerPage.disableCustomToolbar();
    });

    it('[C260097] Should the viewer able to show a custom info-drawer when the sidebarTemplate is set', async () => {
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await viewerPage.clickOnTab('Comments');
        await viewerPage.checkTabIsActive('Comments');
        await viewerPage.clickOnTab('Properties');
        await viewerPage.checkTabIsActive('Properties');
        await viewerPage.clickOnTab('Versions');
        await viewerPage.checkTabIsActive('Versions');
    });

    it('[C362242] Should the Viewer be able to view a previous version of a file', async () => {
        await contentServicesPage.versionManagerContent(txtFileInfo.name);
        await versionManagePage.showNewVersionButton.click();
        await versionManagePage.uploadNewVersionFile(fileModelVersionTwo.location);
        await versionManagePage.closeVersionDialog();
        await contentServicesPage.doubleClickRow(txtFileUploaded.entry.name);
        await viewerPage.waitTillContentLoaded();
        await viewerPage.clickInfoButton();
        await viewerPage.clickOnTab('Versions');
        await versionManagePage.viewFileVersion('1.0');
        await viewerPage.expectUrlToContain('1.0');
    });

    it('[C362265] Should the Viewer be able to download a previous version of a file', async () => {
        await viewerPage.clickDownloadButton();
        await FileBrowserUtil.isFileDownloaded(txtFileInfo.name);
    });
});
