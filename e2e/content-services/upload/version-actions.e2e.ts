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

import { createApiService,
    BrowserActions,
    BrowserVisibility,
    FileBrowserUtil,
    LoginPage,
    UploadActions,
    UserModel,
    UsersActions,
    ViewerPage
} from '@alfresco/adf-testing';
import { browser, by, element } from 'protractor';
import { FileModel } from '../../models/ACS/file.model';
import { ContentServicesPage } from '../../core/pages/content-services.page';
import { UploadDialogPage } from '../../core/pages/dialog/upload-dialog.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { VersionManagePage } from '../../core/pages/version-manager.page';

describe('Version component actions', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const versionManagePage = new VersionManagePage();
    const navigationBarPage = new NavigationBarPage();
    const uploadDialog = new UploadDialogPage();
    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const viewerPage = new ViewerPage();

    let acsUser: UserModel;

    const txtFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.TXT.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.TXT.file_path
    });

    const fileModelVersionTwo = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.TXT.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.TXT.file_location
    });
    let uploadActions;

    const bigFileToCancel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.LARGE_FILE.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.LARGE_FILE.file_location
    });

    beforeAll(async () => {
        uploadActions = new UploadActions(apiService);
        await apiService.loginWithProfile('admin');
        acsUser = await usersActions.createUser();
        await apiService.login(acsUser.username, acsUser.password);
        const txtUploadedFile = await uploadActions.uploadFile(txtFileModel.location, txtFileModel.name, '-my-');
        Object.assign(txtFileModel, txtUploadedFile.entry);
        txtFileModel.update(txtUploadedFile.entry);
        await loginPage.login(acsUser.username, acsUser.password);
        await navigationBarPage.navigateToContentServices();
        await contentServicesPage.waitForTableBody();
   });

    beforeEach(async () => {
        await contentServicesPage.versionManagerContent(txtFileModel.name);
    });

    afterEach(async () => {
        await BrowserActions.closeMenuAndDialogs();
    });

    it('[C280003] Should not be possible delete a file version if there is only one version', async () => {
        await versionManagePage.clickActionButton('1.0');
        await expect(await element(by.css(`[id="adf-version-list-action-delete-1.0"]`)).isEnabled()).toBe(false);
        await versionManagePage.closeActionsMenu();
        await BrowserVisibility.waitUntilElementIsNotVisible(element(by.css(`[id="adf-version-list-action-delete-1.0"]`)));
    });

    it('[C280004] Should not be possible restore the version if there is only one version', async () => {
        await versionManagePage.clickActionButton('1.0');
        await expect(await element(by.css(`[id="adf-version-list-action-restore-1.0"]`)).isEnabled()).toBe(false);
        await versionManagePage.closeActionsMenu();
        await BrowserVisibility.waitUntilElementIsNotVisible(element(by.css(`[id="adf-version-list-action-restore-1.0"]`)));
    });

    it('[C280005] Should be showed all the default action when you have more then one version', async () => {
        await versionManagePage.showNewVersionButton.click();

        await versionManagePage.uploadNewVersionFile(fileModelVersionTwo.location);

        await versionManagePage.clickActionButton('1.1');
        await versionManagePage.checkActionsArePresent('1.1');

        await versionManagePage.closeActionsMenu();

        await versionManagePage.closeVersionDialog();

        await uploadDialog.clickOnCloseButton();
    });

    it('[C269081] Should be possible download all the version of a file', async () => {
        await versionManagePage.downloadFileVersion('1.0');
        await FileBrowserUtil.isFileDownloaded(txtFileModel.name);
        await versionManagePage.downloadFileVersion('1.1');
        await FileBrowserUtil.isFileDownloaded(fileModelVersionTwo.name);
    });

    it('[C272819] Should be possible delete a version when click on delete version action', async () => {
        await versionManagePage.deleteFileVersion('1.1');

        await versionManagePage.confirmAccept.click();

        await versionManagePage.checkFileVersionNotExist('1.1');
        await versionManagePage.checkFileVersionExist('1.0');
    });

    it('[C280006] Should be possible prevent a version to be deleted when click on No on the confirm dialog', async () => {
        await versionManagePage.showNewVersionButton.click();

        await versionManagePage.uploadNewVersionFile(fileModelVersionTwo.location);
        await versionManagePage.checkFileVersionExist('1.1');
        await versionManagePage.deleteFileVersion('1.1');
        await versionManagePage.confirmCancel.click();

        await versionManagePage.checkFileVersionExist('1.1');
        await versionManagePage.checkFileVersionExist('1.0');
        await versionManagePage.closeVersionDialog();
    });

    it('[C280007] Should be possible to restore an old version of your file and the document list updated', async () => {
        await versionManagePage.showNewVersionButton.click();
        await versionManagePage.uploadNewVersionFile(fileModelVersionTwo.location);

        await versionManagePage.restoreFileVersion('1.0');
        await versionManagePage.checkFileVersionExist('2.0');
        await versionManagePage.closeVersionDialog();
        await contentServicesPage.waitForTableBody();
        await contentServicesPage.checkContentIsDisplayed(txtFileModel.name);
    });

    it('[C362240] Should be possible to view a previous document version', async () => {
        await contentServicesPage.versionManagerContent(fileModelVersionTwo.name);
        await versionManagePage.viewFileVersion('1.0');
        await viewerPage.expectUrlToContain('1.0');
    });

    it('[C362241] Should be possible to download a previous document version', async () => {
        await viewerPage.clickDownloadButton();
        await FileBrowserUtil.isFileDownloaded(fileModelVersionTwo.name);
        await viewerPage.clickCloseButton();
    });

    it('[C307033] Should be possible to cancel the upload of a new version', async () => {
        await browser.refresh();
        await contentServicesPage.versionManagerContent(txtFileModel.name);

        await versionManagePage.showNewVersionButton.click();

        await browser.executeScript(' setTimeout(() => {document.querySelector("div[data-automation-id=\'cancel-upload-progress\']").click();}, 1000)');
        await versionManagePage.uploadNewVersionFile(bigFileToCancel.location);
        await versionManagePage.closeVersionDialog();

        await expect(await uploadDialog.getTitleText()).toEqual('Upload canceled');

        await browser.refresh();

        await navigationBarPage.navigateToContentServices();
        await contentServicesPage.waitForTableBody();
        await contentServicesPage.checkContentIsDisplayed(txtFileModel.name);
    });
});
