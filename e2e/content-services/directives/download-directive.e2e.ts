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
import { LoginPage, FileBrowserUtil, BrowserVisibility } from '@alfresco/adf-testing';

import TestConfig = require('../../test.config');
import resources = require('../../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '../../actions/ACS/upload.actions';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { FolderModel } from '../../models/ACS/folderModel';

describe('Version component actions', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const navigationBarPage = new NavigationBarPage();
    const contentListPage = contentServicesPage.getDocumentList();

    const acsUser = new AcsUserModel();

    const txtFileComma = new FileModel({
        'name': 'comma,name',
        'location': resources.Files.ADF_DOCUMENTS.TXT.file_location
    });

    const txtFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT.file_location
    });

    const file0BytesModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });

    const folderInfo = new FolderModel({
        'name': 'myFolder',
        'location': resources.Files.ADF_DOCUMENTS.TEXT_FOLDER.folder_location
    });

    const folderSecond = new FolderModel({
        'name': 'myrSecondFolder',
        'location': resources.Files.ADF_DOCUMENTS.TEXT_FOLDER.folder_location
    });

    beforeAll(async (done) => {

        const uploadActions = new UploadActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        await uploadActions.uploadFile(this.alfrescoJsApi, txtFileModel.location, txtFileModel.name, '-my-');
        await uploadActions.uploadFile(this.alfrescoJsApi, file0BytesModel.location, file0BytesModel.name, '-my-');
        await uploadActions.uploadFile(this.alfrescoJsApi, txtFileComma.location, txtFileComma.name, '-my-');

        const textFolderUploaded = await uploadActions.createFolder(this.alfrescoJsApi, folderInfo.name, '-my-');
        await uploadActions.uploadFolder(this.alfrescoJsApi, folderInfo.location, textFolderUploaded.entry.id);

        await uploadActions.createFolder(this.alfrescoJsApi, folderSecond.name, '-my-');

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        navigationBarPage.clickContentServicesButton();
        contentServicesPage.waitForTableBody();

        done();
    });

    afterEach(async () => {
        BrowserVisibility.waitUntilDialogIsClose();
    });

    it('[C260083] Download files - Different size values', () => {
        contentListPage.selectRow(txtFileModel.name);
        contentServicesPage.clickDownloadButton();
        FileBrowserUtil.isFileDownloaded(txtFileModel.name);
        BrowserVisibility.waitUntilDialogIsClose();

        contentListPage.selectRow(file0BytesModel.name);
        contentServicesPage.clickDownloadButton();
        FileBrowserUtil.isFileDownloaded(file0BytesModel.name);
    });

    it('[C260084] Download folder', () => {
        contentListPage.selectRow(folderInfo.name);
        contentServicesPage.clickDownloadButton();
        FileBrowserUtil.isFileDownloaded(folderInfo.name + '.zip');
    });

    it('[C261032] File and Folder', () => {
        contentServicesPage.clickMultiSelectToggle();
        contentServicesPage.checkAcsContainer();
        contentListPage.dataTablePage().checkAllRows();
        contentServicesPage.clickDownloadButton();
        FileBrowserUtil.isFileDownloaded('archive.zip');
    });

    it('[C261033] Folder and Folder', () => {
        contentListPage.selectRow(folderInfo.name);
        contentListPage.selectRow(folderSecond.name);

        contentServicesPage.clickDownloadButton();

        FileBrowserUtil.isFileDownloaded('archive.zip');
        BrowserVisibility.waitUntilDialogIsClose();
    });

    it('[C277757] Download file - Comma in file name', () => {
        contentListPage.selectRow(txtFileComma.name);
        contentServicesPage.clickDownloadButton();
        FileBrowserUtil.isFileDownloaded(txtFileComma.name);
    });

});
