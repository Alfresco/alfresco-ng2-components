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
import { ApiService, LoginSSOPage, UploadActions, ViewerPage } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/content-services.page';
import { FileModel } from '../../models/ACS/file.model';
import { AcsUserModel } from '../../models/ACS/acs-user.model';
import { NavigationBarPage } from '../../pages/adf/navigation-bar.page';

describe('Viewer', () => {

    const navigationBarPage = new NavigationBarPage();
    const viewerPage = new ViewerPage();
    const loginPage = new LoginSSOPage();
    const contentServicesPage = new ContentServicesPage();
    const alfrescoJsApi = new ApiService().apiService;
    const uploadActions = new UploadActions(alfrescoJsApi);
    const acsUser = new AcsUserModel();
    let txtFileUploaded;

    const txtFileInfo = new FileModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.TXT.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.TXT.file_path
    });

    beforeAll(async () => {
        await alfrescoJsApi.login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
        await alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await alfrescoJsApi.login(acsUser.id, acsUser.password);

        txtFileUploaded = await uploadActions.uploadFile(txtFileInfo.location, txtFileInfo.name, '-my-');

        await loginPage.login(acsUser.email, acsUser.password);
   });

    afterAll(async () => {
        await uploadActions.deleteFileOrFolder(txtFileUploaded.entry.id);
        await navigationBarPage.clickLogoutButton();
   });

    beforeEach(async () => {
        await contentServicesPage.goToDocumentList();
        await contentServicesPage.doubleClickRow(txtFileUploaded.entry.name);
    });

    afterEach(async () => {
        await viewerPage.clickCloseButton();
    });

    it('[C260096] Should the Viewer able to accept a customToolbar', async () => {
        await viewerPage.clickLeftSidebarButton();
        await viewerPage.checkLeftSideBarIsDisplayed();
        await viewerPage.checkToolbarIsDisplayed();
        await viewerPage.enableCustomToolbar();
        await viewerPage.checkCustomToolbarIsDisplayed();
        await viewerPage.disableCustomToolbar();
    });

    it('[C260097] Should the viewer able to show a custom info-drawer when the sidebarTemplate is set', async () => {
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await viewerPage.clickOnTab('Comments');
        await viewerPage.checkTabIsActive('Comments');
        await viewerPage.clickOnTab('Properties');
        await viewerPage.checkTabIsActive('Properties');
        await viewerPage.clickOnTab('Versions');
        await viewerPage.checkTabIsActive('Versions');
    });
});
