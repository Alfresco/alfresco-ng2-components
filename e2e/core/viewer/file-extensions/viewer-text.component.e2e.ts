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
import { LoginSSOPage, UploadActions, StringUtil, ViewerPage, ApiService, UserModel } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../../pages/adf/content-services.page';
import CONSTANTS = require('../../../util/constants');
import { FolderModel } from '../../../models/ACS/folder.model';
import { UsersActions } from '../../../actions/users.actions';

describe('Viewer', () => {

    const viewerPage = new ViewerPage();
    const loginPage = new LoginSSOPage();
    const contentServicesPage = new ContentServicesPage();

    const apiService = new ApiService();
    const usersActions = new UsersActions(apiService);
    const uploadActions = new UploadActions(apiService);
    let site;
    const acsUser = new UserModel();

    const textFolderInfo = new FolderModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.TEXT_FOLDER.folder_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.TEXT_FOLDER.folder_path
    });

    beforeAll(async () => {
        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
        await usersActions.createUser(acsUser);

        site = await apiService.getInstance().core.sitesApi.createSite({
            title: StringUtil.generateRandomString(8),
            visibility: 'PUBLIC'
        });

        await apiService.getInstance().core.sitesApi.addSiteMember(site.entry.id, {
            id: acsUser.email,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });

        await apiService.getInstance().login(acsUser.email, acsUser.password);
    });

    afterAll(async () => {
        await apiService.getInstance().core.sitesApi.deleteSite(site.entry.id, { permanent: true });
    });

    describe('Text Folder Uploaded', () => {
        let uploadedTexts;
        let textFolderUploaded;

        beforeAll(async () => {
            textFolderUploaded = await uploadActions.createFolder(textFolderInfo.name, '-my-');

            uploadedTexts = await uploadActions.uploadFolder(textFolderInfo.location, textFolderUploaded.entry.id);

            await loginPage.login(acsUser.email, acsUser.password);
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
