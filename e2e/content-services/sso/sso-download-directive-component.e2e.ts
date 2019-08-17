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

import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { browser } from 'protractor';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import {
    ApiService,
    LoginSSOPage,
    UploadActions,
    IdentityService,
    SettingsPage,
    StringUtil,
    UserModel,
    FileBrowserUtil
} from '@alfresco/adf-testing';
import { FileModel } from '../../models/ACS/fileModel';
import { ViewerPage } from '../../pages/adf/viewerPage';
import resources = require('../../util/resources');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';

describe('SSO in ADF using ACS and AIS, Download Directive, Viewer, DocumentList, implicitFlow true', () => {

    const settingsPage = new SettingsPage();
    const navigationBarPage = new NavigationBarPage();
    const contentServicesPage = new ContentServicesPage();
    const contentListPage = contentServicesPage.getDocumentList();
    const loginSsoPage = new LoginSSOPage();
    const viewerPage = new ViewerPage();
    let silentLogin;
    let implicitFlow;

    const firstPdfFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF_B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF_B.file_location
    });

    const pngFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    let pdfUploadedFile, pngUploadedFile, folder;

    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host,
        authType: 'OAUTH',
        oauth2: {
            host: browser.params.testConfig.adf.hostSso,
            clientId: browser.params.config.oauth2.clientId,
            scope: 'openid',
            secret: '',
            implicitFlow: false,
            silentLogin: false,
            redirectUri: '/',
            redirectUriLogout: '/logout'
        }
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);
    const folderName = StringUtil.generateRandomString(5);
    const acsUser = new UserModel();
    let identityService: IdentityService;

    describe('SSO in ADF using ACS and AIS, implicit flow set', () => {

        beforeAll(async () => {
            const apiService = new ApiService(browser.params.config.oauth2.clientId, browser.params.testConfig.adf_acs.host, browser.params.testConfig.adf.hostSso, 'ECM');
            await apiService.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

            identityService = new IdentityService(apiService);

            await identityService.createIdentityUserAndSyncECMBPM(acsUser);

            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

            folder = await uploadActions.createFolder(folderName, '-my-');

            pdfUploadedFile = await uploadActions.uploadFile(firstPdfFileModel.location, firstPdfFileModel.name, folder.entry.id);
            pngUploadedFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, folder.entry.id);

            silentLogin = false;
            implicitFlow = true;

            await settingsPage.setProviderEcmSso(browser.params.testConfig.adf_acs.host,
                browser.params.testConfig.adf.hostSso,
                browser.params.testConfig.adf.hostIdentity, silentLogin, implicitFlow, browser.params.config.oauth2.clientId);

            await loginSsoPage.clickOnSSOButton();
            await loginSsoPage.loginSSOIdentityService(acsUser.id, acsUser.password);

            await navigationBarPage.clickContentServicesButton();
            await contentServicesPage.checkAcsContainer();
            await contentListPage.doubleClickRow(folderName);
            await contentListPage.waitForTableBody();
        });

        afterAll(async () => {
            try {
                await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
                await uploadActions.deleteFileOrFolder(folder.entry.id);
                await identityService.deleteIdentityUser(acsUser.id);
            } catch (error) {
            }
            await this.alfrescoJsApi.logout();
            await browser.executeScript('window.sessionStorage.clear();');
            await browser.executeScript('window.localStorage.clear();');
        });

        afterEach(async () => {
            await browser.refresh();
            await contentListPage.waitForTableBody();
        });

        it('[C291936] Should be able to download a file', async () => {
            await contentListPage.selectRow(pngFileModel.name);
            await contentServicesPage.clickDownloadButton();
            await expect(await FileBrowserUtil.isFileDownloaded(pngFileModel.name)).toBe(true, `${pngFileModel.name} not downloaded`);
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
            await expect(await FileBrowserUtil.isFileDownloaded('archive.zip')).toBe(true, `archive.zip not downloaded`);
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
