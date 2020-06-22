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
import { ApiService, LoginSSOPage, StringUtil, UploadActions, ViewerPage, UserModel } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../pages/adf/navigation-bar.page';
import { ContentServicesPage } from '../../pages/adf/content-services.page';
import { MonacoExtensionPage } from '../../pages/adf/demo-shell/monaco-extension.page';
import CONSTANTS = require('../../util/constants');
import { FileModel } from '../../models/ACS/file.model';
import { UsersActions } from '../../actions/users.actions';

describe('Viewer', () => {

    const viewerPage = new ViewerPage();
    const navigationBarPage = new NavigationBarPage();
    const loginPage = new LoginSSOPage();
    const contentServicesPage = new ContentServicesPage();
    const acsUser = new UserModel();
    const monacoExtensionPage = new MonacoExtensionPage();

    const apiService = new ApiService();
    const usersActions = new UsersActions(apiService);
    const uploadActions = new UploadActions(apiService);

    let site;

    let jsFileUploaded;
    const jsFileInfo = new FileModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.JS.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.JS.file_path
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

        jsFileUploaded = await uploadActions.uploadFile(jsFileInfo.location, jsFileInfo.name, '-my-');

        await loginPage.login(acsUser.email, acsUser.password);
    });

    afterAll(async () => {
        await apiService.getInstance().core.sitesApi.deleteSite(site.entry.id, { permanent: true });
        await apiService.getInstance().login(acsUser.email, acsUser.password);
        await uploadActions.deleteFileOrFolder(jsFileUploaded.entry.id);
    });

    describe('Viewer extension', () => {
        it('[C297698] Should be able to add an extension for code editor viewer', async () => {
            await navigationBarPage.clickAboutButton();

            await monacoExtensionPage.checkMonacoPluginIsDisplayed();

            await navigationBarPage.clickContentServicesButton();

            await contentServicesPage.waitForTableBody();
            await contentServicesPage.checkContentIsDisplayed(jsFileInfo.name);
            await contentServicesPage.doubleClickRow(jsFileInfo.name);

            await viewerPage.checkCodeViewerIsDisplayed();
        });
    });
});
