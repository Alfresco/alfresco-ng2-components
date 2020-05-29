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
import { LoginSSOPage, UploadActions, StringUtil, ViewerPage, ApiService } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../../pages/adf/content-services.page';
import CONSTANTS = require('../../../util/constants');
import { FolderModel } from '../../../models/ACS/folder.model';
import { AcsUserModel } from '../../../models/ACS/acs-user.model';

describe('Viewer', () => {

    const viewerPage = new ViewerPage();
    const loginPage = new LoginSSOPage();
    const contentServicesPage = new ContentServicesPage();
    const alfrescoJsApi = new ApiService().apiService;

    const uploadActions = new UploadActions(alfrescoJsApi);
    let site;
    const acsUser = new AcsUserModel();

    const textFolderInfo = new FolderModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.TEXT_FOLDER.folder_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.TEXT_FOLDER.folder_path
    });

    beforeAll(async () => {
        await alfrescoJsApi.login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
        await alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        site = await alfrescoJsApi.core.sitesApi.createSite({
            title: StringUtil.generateRandomString(8),
            visibility: 'PUBLIC'
        });

        await alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
            id: acsUser.id,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });

        await alfrescoJsApi.login(acsUser.id, acsUser.password);
    });

    afterAll(async () => {
        await alfrescoJsApi.core.sitesApi.deleteSite(site.entry.id, { permanent: true });
    });

    describe('Text Folder Uploaded', () => {
        let uploadedTexts;
        let textFolderUploaded;

        beforeAll(async () => {
            textFolderUploaded = await uploadActions.createFolder(textFolderInfo.name, '-my-');

            uploadedTexts = await uploadActions.uploadFolder(textFolderInfo.location, textFolderUploaded.entry.id);

            await loginPage.login(acsUser.id, acsUser.password);
            await contentServicesPage.goToDocumentList();
        });

        afterAll(async () => {
            await uploadActions.deleteFileOrFolder(textFolderUploaded.entry.id);
        });

        it('[C280010] Should be possible to open any Text file', async () => {
            await contentServicesPage.doubleClickRow('text');
            for (const currentFile of uploadedTexts) {
                if (currentFile.entry.name !== '.DS_Store') {
                    await contentServicesPage.doubleClickRow(currentFile.entry.name);
                    await viewerPage.checkFileIsLoaded();
                    await viewerPage.clickCloseButton();
                }
            }
        });
    });
});
