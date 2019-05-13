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

import TestConfig = require('../../../test.config');

import { LoginPage } from '@alfresco/adf-testing';
import { ViewerPage } from '../../../pages/adf/viewerPage';
import { ContentServicesPage } from '../../../pages/adf/contentServicesPage';

import CONSTANTS = require('../../../util/constants');
import resources = require('../../../util/resources');
import { StringUtil } from '@alfresco/adf-testing';

import { FolderModel } from '../../../models/ACS/folderModel';
import { AcsUserModel } from '../../../models/ACS/acsUserModel';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '../../../actions/ACS/upload.actions';

describe('Viewer', () => {

    const viewerPage = new ViewerPage();
    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const uploadActions = new UploadActions();
    let site;
    const acsUser = new AcsUserModel();

    const excelFolderInfo = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.EXCEL_FOLDER.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.EXCEL_FOLDER.folder_location
    });

    beforeAll(async (done) => {

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        site = await this.alfrescoJsApi.core.sitesApi.createSite({
            title: StringUtil.generateRandomString(8),
            visibility: 'PUBLIC'
        });

        await this.alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
            id: acsUser.id,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        done();
    });
    describe('Excel Folder Uploaded', () => {

        let uploadedExcels;
        let excelFolderUploaded;

        beforeAll(async (done) => {
            excelFolderUploaded = await uploadActions.createFolder(this.alfrescoJsApi, excelFolderInfo.name, '-my-');

            uploadedExcels = await uploadActions.uploadFolder(this.alfrescoJsApi, excelFolderInfo.location, excelFolderUploaded.entry.id);

            await loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            done();
        });

        afterAll(async (done) => {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, excelFolderUploaded.entry.id);
            done();
        });

        it('[C280008] Should be possible to open any Excel file', () => {
            contentServicesPage.doubleClickRow('excel');

            uploadedExcels.forEach((currentFile) => {
                if (currentFile.entry.name !== '.DS_Store') {
                    contentServicesPage.doubleClickRow(currentFile.entry.name);
                    viewerPage.checkFileIsLoaded(currentFile.entry.name);
                    viewerPage.clickCloseButton();
                }
            });
        });

    });

});
