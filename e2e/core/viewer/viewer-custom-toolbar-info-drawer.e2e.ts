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
import { LoginPage, UploadActions } from '@alfresco/adf-testing';
import { ViewerPage } from '../../pages/adf/viewerPage';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import resources = require('../../util/resources');
import { FileModel } from '../../models/ACS/fileModel';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

describe('Viewer', () => {

    const navigationBarPage = new NavigationBarPage();
    const viewerPage = new ViewerPage();
    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: browser.params.testConfig.adf_acs.host
        });
    const uploadActions = new UploadActions(this.alfrescoJsApi);
    const acsUser = new AcsUserModel();
    let txtFileUploaded;

    const txtFileInfo = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT.file_location
    });

    beforeAll(async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        txtFileUploaded = await uploadActions.uploadFile(txtFileInfo.location, txtFileInfo.name, '-my-');

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

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
