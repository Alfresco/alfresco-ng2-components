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
import { FileModel } from '../../../models/ACS/file.model';
import { FolderModel } from '../../../models/ACS/folder.model';
import { AcsUserModel } from '../../../models/ACS/acs-user.model';
import { NavigationBarPage } from '../../../pages/adf/navigation-bar.page';

describe('Viewer', () => {

    const viewerPage = new ViewerPage();
    const loginPage = new LoginSSOPage();
    const contentServicesPage = new ContentServicesPage();
    const navigationBarPage = new NavigationBarPage();

    const apiService = new ApiService();
    const uploadActions = new UploadActions(apiService);
    let site;
    const acsUser = new AcsUserModel();
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
        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
        await apiService.getInstance().core.peopleApi.addPerson(acsUser);

        site = await apiService.getInstance().core.sitesApi.createSite({
            title: StringUtil.generateRandomString(8),
            visibility: 'PUBLIC'
        });

        await apiService.getInstance().core.sitesApi.addSiteMember(site.entry.id, {
            id: acsUser.id,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });

        await apiService.getInstance().login(acsUser.id, acsUser.password);

        pngFileUploaded = await uploadActions.uploadFile(pngFileInfo.location, pngFileInfo.name, site.entry.guid);
    });

    afterAll(async () => {
        await apiService.getInstance().core.sitesApi.deleteSite(site.entry.id, { permanent: true });
        await navigationBarPage.clickLogoutButton();
    });

    it('[C272813] Should be redirected to site when opening and closing a file in a site', async () => {
        await loginPage.login(acsUser.id, acsUser.password);

        await navigationBarPage.goToSite(site);
        await contentServicesPage.checkAcsContainer();

        await viewerPage.viewFile(pngFileUploaded.entry.name);

        await viewerPage.checkImgViewerIsDisplayed();

        await viewerPage.clickCloseButton();
    });

    describe('Other Folder Uploaded', () => {
        let uploadedOthers;
        let otherFolderUploaded;

        beforeAll(async () => {
            otherFolderUploaded = await uploadActions.createFolder(otherFolderInfo.name, '-my-');

            uploadedOthers = await uploadActions.uploadFolder(otherFolderInfo.location, otherFolderUploaded.entry.id);

            await loginPage.login(acsUser.id, acsUser.password);
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
