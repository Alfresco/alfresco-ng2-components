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

import { ContentServicesPage } from '../../core/pages/content-services.page';
import { browser } from 'protractor';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { createApiService,
    FileBrowserUtil,
    IdentityService,
    LoginPage,
    SettingsPage,
    StringUtil,
    UploadActions,
    UsersActions,
    ViewerPage
} from '@alfresco/adf-testing';
import { FileModel } from '../../models/ACS/file.model';

describe('SSO in ADF using ACS and AIS, Download Directive, Viewer, DocumentList, implicitFlow true', () => {

    const settingsPage = new SettingsPage();
    const navigationBarPage = new NavigationBarPage();
    const contentServicesPage = new ContentServicesPage();
    const contentListPage = contentServicesPage.getDocumentList();
    const loginSsoPage = new LoginPage();
    const viewerPage = new ViewerPage();

    const apiService = createApiService({ authType: 'OAUTH' });
    const uploadActions = new UploadActions(apiService);
    const identityService = new IdentityService(apiService);
    const usersActions = new UsersActions(apiService);

    const firstPdfFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PDF_B.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PDF_B.file_path
    });

    const pngFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_path
    });

    let pdfUploadedFile; let pngUploadedFile; let folder; let acsUser;
    const folderName = StringUtil.generateRandomString(5);

    beforeAll(async () => {
        await apiService.login(browser.params.testConfig.users.admin.username, browser.params.testConfig.users.admin.password);

        acsUser = await usersActions.createUser();

        await apiService.login(acsUser.username, acsUser.password);

        folder = await uploadActions.createFolder(folderName, '-my-');

        pdfUploadedFile = await uploadActions.uploadFile(firstPdfFileModel.location, firstPdfFileModel.name, folder.entry.id);
        pngUploadedFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, folder.entry.id);

        await settingsPage.setProviderEcmSso(browser.params.testConfig.appConfig.ecmHost,
            browser.params.testConfig.appConfig.oauth2.host,
            browser.params.testConfig.appConfig.identityHost, false, true, browser.params.testConfig.appConfig.oauth2.clientId);

        await loginSsoPage.loginSSOIdentityService(acsUser.username, acsUser.password);

        await navigationBarPage.navigateToContentServices();
        await contentServicesPage.checkAcsContainer();
        await contentServicesPage.openFolder(folderName);
        await contentListPage.waitForTableBody();
    });

    afterAll(async () => {
        try {
            await apiService.loginWithProfile('admin');
            await uploadActions.deleteFileOrFolder(folder.entry.id);
            await identityService.deleteIdentityUser(acsUser.email);
        } catch (error) {
        }
        await apiService.getInstance().logout();
        await browser.executeScript('window.sessionStorage.clear();');
        await browser.executeScript('window.localStorage.clear();');
    });

    describe('SSO in ADF using ACS and AIS, implicit flow set', () => {

        afterEach(async () => {
            await browser.refresh();
            await contentListPage.waitForTableBody();
        });

        it('[C291936] Should be able to download a file', async () => {
            await contentListPage.selectRow(pngFileModel.name);
            await contentServicesPage.clickDownloadButton();
            await FileBrowserUtil.isFileDownloaded(pngFileModel.name);
        });

        it('[C291938] Should be able to open a document', async () => {
            await contentServicesPage.doubleClickRow(firstPdfFileModel.name);
            await viewerPage.checkFileIsLoaded();
            await viewerPage.checkFileNameIsDisplayed(firstPdfFileModel.name);
            await viewerPage.clickCloseButton();
            await contentListPage.waitForTableBody();
        });

        it('[C291942] Should be able to open an image', async () => {
            await viewerPage.viewFile(pngFileModel.name);
            await viewerPage.checkImgViewerIsDisplayed();
            await viewerPage.checkFileNameIsDisplayed(pngFileModel.name);
            await viewerPage.clickCloseButton();
            await contentListPage.waitForTableBody();
        });

        it('[C291941] Should be able to download multiple files', async () => {
            await contentServicesPage.clickMultiSelectToggle();
            await contentServicesPage.checkAcsContainer();
            await contentListPage.dataTablePage().checkAllRows();
            await contentListPage.dataTablePage().checkRowIsChecked('Display name', pngFileModel.name);
            await contentListPage.dataTablePage().checkRowIsChecked('Display name', firstPdfFileModel.name);
            await contentServicesPage.clickDownloadButton();
            await FileBrowserUtil.isFileDownloaded('archive.zip');
        });

        it('[C291940] Should be able to view thumbnails when enabled', async () => {
            await contentServicesPage.enableThumbnails();
            await contentServicesPage.checkAcsContainer();
            await contentListPage.waitForTableBody();
            const filePdfIconUrl = await contentServicesPage.getRowIconImageUrl(firstPdfFileModel.name);
            await expect(filePdfIconUrl).toContain(`/versions/1/nodes/${pdfUploadedFile.entry.id}/renditions`);
            const filePngIconUrl = await contentServicesPage.getRowIconImageUrl(pngFileModel.name);
            await expect(filePngIconUrl).toContain(`/versions/1/nodes/${pngUploadedFile.entry.id}/renditions`);
        });
    });
});
