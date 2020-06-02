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
import { LoginSSOPage, StringUtil, UploadActions, ViewerPage } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../../pages/adf/content-services.page';
import CONSTANTS = require('../../../util/constants');
import { FolderModel } from '../../../models/ACS/folder.model';
import { AcsUserModel } from '../../../models/ACS/acs-user.model';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';

describe('Viewer', () => {

    const viewerPage = new ViewerPage();
    const loginPage = new LoginSSOPage();
    const contentServicesPage = new ContentServicesPage();
    let site;
    const acsUser = new AcsUserModel();

    const excelFolderInfo = new FolderModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.EXCEL_FOLDER.folder_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.EXCEL_FOLDER.folder_path
    });
    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);

    beforeAll(async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
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
    });

    afterAll(async () => {
        await this.alfrescoJsApi.core.sitesApi.deleteSite(site.entry.id, { permanent: true });
    });

    describe('Excel Folder Uploaded', () => {

        let uploadedExcels;
        let excelFolderUploaded;

        beforeAll(async () => {
            excelFolderUploaded = await uploadActions.createFolder(excelFolderInfo.name, '-my-');

            uploadedExcels = await uploadActions.uploadFolder(excelFolderInfo.location, excelFolderUploaded.entry.id);

            await loginPage.login(acsUser.email, acsUser.password);
            await contentServicesPage.goToDocumentList();
        });

        afterAll(async () => {
            await uploadActions.deleteFileOrFolder(excelFolderUploaded.entry.id);
        });

        it('[C280008] Should be possible to open any Excel file', async () => {
            await contentServicesPage.doubleClickRow('excel');
            for (const currentFile of uploadedExcels) {
                if (currentFile.entry.name !== '.DS_Store') {
                    await contentServicesPage.doubleClickRow(currentFile.entry.name);
                    await viewerPage.checkFileIsLoaded(currentFile.entry.name);
                    await viewerPage.clickCloseButton();
                }
            }
        });
    });
});
