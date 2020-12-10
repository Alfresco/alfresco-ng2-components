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
import {
    ApiService,
    LoginPage,
    StringUtil,
    UploadActions,
    UserModel,
    UsersActions,
    ViewerPage
} from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../../core/pages/content-services.page';
import { FolderModel } from '../../../models/ACS/folder.model';
import { NavigationBarPage } from '../../../core/pages/navigation-bar.page';
import CONSTANTS = require('../../../util/constants');

describe('Viewer', () => {

    const viewerPage = new ViewerPage();
    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const navigationBarPage = new NavigationBarPage();

    let site;
    const acsUser = new UserModel();
    const apiService = new ApiService();
    const usersActions = new UsersActions(apiService);

    const uploadActions = new UploadActions(apiService);

    const archiveFolderInfo = new FolderModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.ARCHIVE_FOLDER.folder_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.ARCHIVE_FOLDER.folder_path
    });

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');
        await usersActions.createUser(acsUser);
        site = await apiService.getInstance().core.sitesApi.createSite({
            title: StringUtil.generateRandomString(8),
            visibility: 'PUBLIC'
        });
        await apiService.getInstance().core.sitesApi.addSiteMember(site.entry.id, {
            id: acsUser.username,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });
        await apiService.login(acsUser.email, acsUser.password);
    });

    afterAll(async () => {
        await apiService.loginWithProfile('admin');
        await apiService.getInstance().core.sitesApi.deleteSite(site.entry.id, { permanent: true });
        await navigationBarPage.clickLogoutButton();
    });

    describe('Archive Folder Uploaded', () => {
        let uploadedArchives;
        let archiveFolderUploaded;

        beforeAll(async () => {
            archiveFolderUploaded = await uploadActions.createFolder(archiveFolderInfo.name, '-my-');
            uploadedArchives = await uploadActions.uploadFolder(archiveFolderInfo.location, archiveFolderUploaded.entry.id);
            await loginPage.login(acsUser.email, acsUser.password);
            await contentServicesPage.goToDocumentList();
        });

        afterAll(async () => {
            await uploadActions.deleteFileOrFolder(archiveFolderUploaded.entry.id);
        });

        it('[C260517] Should be possible to open any Archive file', async () => {
            await contentServicesPage.doubleClickRow('archive');
            for (const file of uploadedArchives) {
                if (file.entry.name !== '.DS_Store') {
                    await contentServicesPage.doubleClickRow(file.entry.name);
                    await viewerPage.checkFileIsLoaded();
                    await viewerPage.clickCloseButton();
                }
            }
        });
    });
});
