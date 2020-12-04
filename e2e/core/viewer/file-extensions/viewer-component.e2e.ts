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
    ApiService, LocalStorageUtil,
    LoginPage,
    StringUtil,
    UploadActions,
    UserModel,
    UsersActions,
    ViewerPage
} from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../../core/pages/content-services.page';
import { FileModel } from '../../../models/ACS/file.model';
import { FolderModel } from '../../../models/ACS/folder.model';
import { NavigationBarPage } from '../../../core/pages/navigation-bar.page';
import CONSTANTS = require('../../../util/constants');

describe('Viewer', () => {

    const viewerPage = new ViewerPage();
    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const navigationBarPage = new NavigationBarPage();

    const apiService = new ApiService({ authType: 'ECM', provider: 'ECM' });
    const uploadActions = new UploadActions(apiService);
    const usersActions = new UsersActions(apiService);

    let site;
    const acsUser = new UserModel();
    let pngFileUploaded;

    const pngFileInfo = new FileModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_path
    });

    const otherFolderInfo = new FolderModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.OTHER_FOLDER.folder_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.OTHER_FOLDER.folder_path
    });

    beforeAll(async () => {
        await LocalStorageUtil.setStorageItem('providers', 'ECM');
        await LocalStorageUtil.setStorageItem('authType', 'BASIC');

        await apiService.loginWithProfile('admin');
        await usersActions.createUser(acsUser);

        site = await apiService.getInstance().core.sitesApi.createSite({
            title: StringUtil.generateRandomString(8),
            visibility: 'PUBLIC'
        });

        await apiService.getInstance().core.sitesApi.addSiteMember(site.entry.id, {
            id: acsUser.email,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });

        await apiService.login(acsUser.email, acsUser.password);

        pngFileUploaded = await uploadActions.uploadFile(pngFileInfo.location, pngFileInfo.name, site.entry.guid);
    });

    afterAll(async () => {
        await apiService.loginWithProfile('admin');
        await apiService.getInstance().core.sitesApi.deleteSite(site.entry.id, { permanent: true });
    });

    it('[C272813] Should be redirected to site when opening and closing a file in a site', async () => {
        await loginPage.login(acsUser.email, acsUser.password);

        await navigationBarPage.goToSite(site);
        await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();

        await viewerPage.viewFile(pngFileUploaded.entry.name);

        await viewerPage.checkImgViewerIsDisplayed();

        await viewerPage.clickCloseButton();
        await navigationBarPage.clickLogoutButton();
    });

    describe('Other Folder Uploaded', () => {
        let uploadedOthers;
        let otherFolderUploaded;

        beforeAll(async () => {
            await apiService.login(acsUser.email, acsUser.password);
            otherFolderUploaded = await uploadActions.createFolder(otherFolderInfo.name, '-my-');

            uploadedOthers = await uploadActions.uploadFolder(otherFolderInfo.location, otherFolderUploaded.entry.id);

            await loginPage.login(acsUser.email, acsUser.password);
            await contentServicesPage.goToDocumentList();
        });

        afterAll(async () => {
            await uploadActions.deleteFileOrFolder(otherFolderUploaded.entry.id);
        });

        it('[C280012] Should be possible to open any other Document supported extension', async () => {
            await contentServicesPage.doubleClickRow('other');
            for (const file of uploadedOthers) {
                if (file.entry.name !== '.DS_Store') {
                    await contentServicesPage.doubleClickRow(file.entry.name);
                    await viewerPage.checkFileIsLoaded();
                    await viewerPage.clickCloseButton();
                }
            }
        });
    });
});
