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
import { NavigationBarPage } from '../../pages/adf/navigation-bar.page';
import { ContentServicesPage } from '../../pages/adf/content-services.page';
import CONSTANTS = require('../../util/constants');
import { FileModel } from '../../models/ACS/file.model';
import { AcsUserModel } from '../../models/ACS/acs-user.model';

describe('Info Drawer', () => {

    const viewerPage = new ViewerPage();
    const navigationBarPage = new NavigationBarPage();
    const loginPage = new LoginSSOPage();
    const contentServicesPage = new ContentServicesPage();
    const alfrescoJsApi = new ApiService().apiService;

    const uploadActions = new UploadActions(alfrescoJsApi);
    let site;
    const acsUser = new AcsUserModel();
    let pngFileUploaded;

    const pngFileInfo = new FileModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_path
    });

    beforeAll(async () => {
        await alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
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

        pngFileUploaded = await uploadActions.uploadFile(pngFileInfo.location, pngFileInfo.name, site.entry.guid);
   });

    afterAll(async () => {
        await alfrescoJsApi.login(acsUser.id, acsUser.password);
        await uploadActions.deleteFileOrFolder(pngFileUploaded.entry.id);
        await alfrescoJsApi.core.sitesApi.deleteSite(site.entry.id, { permanent: true });
    });

    beforeEach(async() => {
        await loginPage.login(acsUser.email, acsUser.password);

        await navigationBarPage.goToSite(site);
        await contentServicesPage.checkAcsContainer();
    });

    it('[C277251] Should display the icon when the icon property is defined', async () => {
        await viewerPage.viewFile(pngFileUploaded.entry.name);
        await viewerPage.clickLeftSidebarButton();
        await viewerPage.enableShowTabWithIcon();
        await viewerPage.enableShowTabWithIconAndLabel();
        await viewerPage.checkTabHasNoIcon(0);
        await expect(await viewerPage.getTabIconById(1)).toBe('face');
        await expect(await viewerPage.getTabIconById(2)).toBe('comment');
    });

    it('[C277252] Should display the label when the label property is defined', async () => {
        await viewerPage.viewFile(pngFileUploaded.entry.name);
        await viewerPage.clickLeftSidebarButton();
        await viewerPage.enableShowTabWithIcon();
        await viewerPage.enableShowTabWithIconAndLabel();
        await expect(await viewerPage.getTabLabelById(0)).toBe('SETTINGS');
        await viewerPage.checkTabHasNoLabel(1);
        await expect(await viewerPage.getTabLabelById(2)).toBe('COMMENTS');
    });
});
