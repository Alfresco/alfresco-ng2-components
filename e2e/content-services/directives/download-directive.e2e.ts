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
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';
import { LoginPage, UploadActions, BrowserVisibility, FileBrowserUtil } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import resources = require('../../util/resources');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { FolderModel } from '../../models/ACS/folderModel';

describe('Version component actions', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const navigationBarPage = new NavigationBarPage();
    const contentListPage = contentServicesPage.getDocumentList();

    const acsUser = new AcsUserModel();

    const txtFileComma = new FileModel({
        name: 'comma,name',
        location: resources.Files.ADF_DOCUMENTS.TXT.file_location
    });

    const txtFileModel = new FileModel({
        name: resources.Files.ADF_DOCUMENTS.TXT.file_name,
        location: resources.Files.ADF_DOCUMENTS.TXT.file_location
    });

    const file0BytesModel = new FileModel({
        name: resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        location: resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });

    const folderInfo = new FolderModel({
        name: 'myFolder',
        location: resources.Files.ADF_DOCUMENTS.TEXT_FOLDER.folder_location
    });

    const folderSecond = new FolderModel({
        name: 'myrSecondFolder',
        location: resources.Files.ADF_DOCUMENTS.TEXT_FOLDER.folder_location
    });

    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);

    beforeAll(async () => {

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        await uploadActions.uploadFile( txtFileModel.location, txtFileModel.name, '-my-');
        await uploadActions.uploadFile(file0BytesModel.location, file0BytesModel.name, '-my-');
        await uploadActions.uploadFile(txtFileComma.location, txtFileComma.name, '-my-');

        const textFolderUploaded = await uploadActions.createFolder(folderInfo.name, '-my-');
        await uploadActions.uploadFolder(folderInfo.location, textFolderUploaded.entry.id);

        await uploadActions.createFolder(folderSecond.name, '-my-');

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        await navigationBarPage.clickContentServicesButton();
        await contentServicesPage.waitForTableBody();

    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    afterEach(async () => {
        await BrowserVisibility.waitUntilDialogIsClose();
    });

    it('[C260083] Download files - Different size values', async () => {
        await contentListPage.selectRow(txtFileModel.name);
        await contentServicesPage.clickDownloadButton();
        await FileBrowserUtil.isFileDownloaded(txtFileModel.name);
        await BrowserVisibility.waitUntilDialogIsClose();

        await contentListPage.selectRow(file0BytesModel.name);
        await contentServicesPage.clickDownloadButton();
        await FileBrowserUtil.isFileDownloaded(file0BytesModel.name);
    });

    it('[C260084] Download folder', async () => {
        await contentListPage.selectRow(folderInfo.name);
        await contentServicesPage.clickDownloadButton();
        await FileBrowserUtil.isFileDownloaded(folderInfo.name + '.zip');
    });

    it('[C261032] File and Folder', async () => {
        await contentServicesPage.clickMultiSelectToggle();
        await contentServicesPage.checkAcsContainer();
        await contentListPage.dataTablePage().checkAllRows();
        await contentServicesPage.clickDownloadButton();
        await FileBrowserUtil.isFileDownloaded('archive.zip');
    });

    it('[C261033] Folder and Folder', async () => {
        await contentListPage.selectRow(folderInfo.name);
        await contentListPage.selectRow(folderSecond.name);

        await contentServicesPage.clickDownloadButton();

        await FileBrowserUtil.isFileDownloaded('archive.zip');
        await BrowserVisibility.waitUntilDialogIsClose();
    });

    it('[C277757] Download file - Comma in file name', async () => {
        await contentListPage.selectRow(txtFileComma.name);
        await contentServicesPage.clickDownloadButton();
        await FileBrowserUtil.isFileDownloaded(txtFileComma.name);
    });

});
