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

import { SettingsPage } from '../../pages/adf/settingsPage';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import TestConfig = require('../../test.config');
import { browser } from 'protractor';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { LoginSSOPage } from '@alfresco/adf-testing';
import { UploadActions } from '../../actions/ACS/upload.actions';
import { FileModel } from '../../models/ACS/fileModel';
import { ViewerPage } from '../../pages/adf/viewerPage';
import resources = require('../../util/resources');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import * as path from 'path';
import { Util } from '../../util/util';
import { DataTableComponentPage } from '../../pages/adf/dataTableComponentPage';

describe('SSO in ADF using ACS and AIS, Download Directive, Viewer, DocumentList, implicitFlow true', () => {

    let settingsPage = new SettingsPage();
    let navigationBarPage = new NavigationBarPage();
    let contentServicesPage = new ContentServicesPage();
    let contentListPage = contentServicesPage.getDocumentList();
    let loginSsoPage = new LoginSSOPage();
    let viewerPage = new ViewerPage();
    let dataTableComponentPage = new DataTableComponentPage();
    let silentLogin;
    let implicitFlow;
    let uploadActions = new UploadActions();
    let firstPdfFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF_B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF_B.file_location
    });

    let pngFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    let pdfUploadedFile, pngUploadedFile, folder;

    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: TestConfig.adf.url
    });
    let downloadedPngFile = path.join(__dirname, 'downloads', pngFileModel.name);
    let downloadedMultipleFiles = path.join(__dirname, 'downloads', 'archive.zip');
    let folderName = Util.generateRandomString(5);

    describe('SSO in ADF using ACS and AIS, implicit flow set', () => {

        beforeAll(async (done) => {
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            folder = await uploadActions.createFolder(this.alfrescoJsApi, folderName, '-my-');

            pdfUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, firstPdfFileModel.location, firstPdfFileModel.name, folder.entry.id);

            pngUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, pngFileModel.location, pngFileModel.name, folder.entry.id);

            silentLogin = false;
            implicitFlow = true;
            settingsPage.setProviderEcmSso(TestConfig.adf.url, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, silentLogin, implicitFlow, 'alfresco');
            loginSsoPage.clickOnSSOButton();
            loginSsoPage.loginSSOIdentityService(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            navigationBarPage.clickContentServicesButton();
            contentServicesPage.checkAcsContainer();
            contentListPage.doubleClickRow(folderName);
            contentListPage.waitForTableBody();
            done();
        });

        afterAll(async (done) => {
            try {
                await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
                await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, folder.entry.id);
            } catch (error) {
            }
            await this.alfrescoJsApi.logout();
            browser.executeScript('window.sessionStorage.clear();');
            browser.executeScript('window.localStorage.clear();');
            done();
        });

        afterEach(async (done) => {
            browser.refresh();
            contentListPage.waitForTableBody();
            done();
        });

        it('[C291936] Should be able to download a file', async (done) => {
            contentListPage.selectRow(pngFileModel.name);
            contentServicesPage.clickDownloadButton();
            browser.driver.sleep(1000);
            expect(Util.fileExists(downloadedPngFile, 30)).toBe(true);
            done();
        });

        it('[C291938] Should be able to open a document', async (done) => {

            contentServicesPage.doubleClickRow(firstPdfFileModel.name);
            viewerPage.checkFileIsLoaded();
            viewerPage.checkFileNameIsDisplayed(firstPdfFileModel.name);
            viewerPage.clickCloseButton();
            contentListPage.waitForTableBody();
            done();
        });

        it('[C291942] Should be able to open an image', async (done) => {

            viewerPage.viewFile(pngFileModel.name);
            viewerPage.checkImgViewerIsDisplayed();
            viewerPage.checkFileNameIsDisplayed(pngFileModel.name);
            viewerPage.clickCloseButton();
            contentListPage.waitForTableBody();
            done();
        });

        it('[C291941] Should be able to download multiple files', async (done) => {

            contentServicesPage.clickMultiSelectToggle();
            contentServicesPage.checkAcsContainer();
            contentServicesPage.clickAllRowsCheckbox();
            dataTableComponentPage.checkRowIsSelected('Display name', pngFileModel.name);
            dataTableComponentPage.checkRowIsSelected('Display name', firstPdfFileModel.name);
            contentServicesPage.clickDownloadButton();
            browser.driver.sleep(1000);
            expect(Util.fileExists(downloadedMultipleFiles, 30)).toBe(true);
            done();
        });

        it('[C291940] Should be able to view thumbnails when enabled', async (done) => {

            contentServicesPage.enableThumbnails();
            contentServicesPage.checkAcsContainer();
            contentListPage.waitForTableBody();
            let filePdfIconUrl = await contentServicesPage.getRowIconImageUrl(firstPdfFileModel.name);
            expect(filePdfIconUrl).toContain(`/versions/1/nodes/${pdfUploadedFile.entry.id}/renditions`);
            let filePngIconUrl = await contentServicesPage.getRowIconImageUrl(pngFileModel.name);
            expect(filePngIconUrl).toContain(`/versions/1/nodes/${pngUploadedFile.entry.id}/renditions`);
            done();
        });
    });
});
