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
import { LoginPage, StringUtil, UploadActions } from '@alfresco/adf-testing';
import { ViewerPage } from '../../pages/adf/viewerPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { MonacoExtensionPage } from '../../pages/adf/demo-shell/monacoExtensionPage';
import CONSTANTS = require('../../util/constants');
import resources = require('../../util/resources');
import { FileModel } from '../../models/ACS/fileModel';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';

describe('Viewer', () => {

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
    const monacoExtensionPage = new MonacoExtensionPage();

    let jsFileUploaded;
    const jsFileInfo = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.JS.file_name,
        'location': resources.Files.ADF_DOCUMENTS.JS.file_location
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

        jsFileUploaded = await uploadActions.uploadFile(jsFileInfo.location, jsFileInfo.name, '-my-');

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

    });

    afterAll(async () => {
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
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
