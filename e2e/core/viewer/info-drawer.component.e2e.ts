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
import { LoginPage, UploadActions, StringUtil } from '@alfresco/adf-testing';
import { ViewerPage } from '../../pages/adf/viewerPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import CONSTANTS = require('../../util/constants');
import resources = require('../../util/resources');
import { FileModel } from '../../models/ACS/fileModel';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';

describe('Info Drawer', () => {

    const viewerPage = new ViewerPage();
    const navigationBarPage = new NavigationBarPage();
    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: browser.params.testConfig.adf_acs.host
        });
    const uploadActions = new UploadActions(this.alfrescoJsApi);
    let site;
    const acsUser = new AcsUserModel();
    let pngFileUploaded;

    const pngFileInfo = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

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

        pngFileUploaded = await uploadActions.uploadFile(pngFileInfo.location, pngFileInfo.name, site.entry.guid);

    });

    afterAll(async () => {
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
        await uploadActions.deleteFileOrFolder(pngFileUploaded.entry.id);

    });

    beforeEach(async() => {
        await loginPage.loginToContentServicesUsingUserModel(acsUser);

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
