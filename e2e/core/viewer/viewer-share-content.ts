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

import { LoginSSOPage, UploadActions, StringUtil, BrowserActions, ViewerPage, ApiService } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../pages/adf/navigation-bar.page';
import { ContentServicesPage } from '../../pages/adf/content-services.page';
import { ShareDialogPage } from '../../pages/adf/dialog/share-dialog.page';
import CONSTANTS = require('../../util/constants');
import { FileModel } from '../../models/ACS/file.model';
import { AcsUserModel } from '../../models/ACS/acs-user.model';
import { browser } from 'protractor';

describe('Viewer', () => {

    const viewerPage = new ViewerPage();
    const navigationBarPage = new NavigationBarPage();
    const loginPage = new LoginSSOPage();
    const contentServicesPage = new ContentServicesPage();
    const alfrescoJsApi = new ApiService().apiService;

    const uploadActions = new UploadActions(alfrescoJsApi);
    let site;
    const acsUser = new AcsUserModel();
    let pngFileUploaded;
    const contentList = contentServicesPage.getDocumentList();
    const shareDialog = new ShareDialogPage();

    const pngFileInfo = new FileModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_path
    });

    const wordFileInfo = new FileModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.DOCX.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.DOCX.file_path
    });

    let pngFileShared, wordFileUploaded;

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

        await alfrescoJsApi.login(acsUser.id, acsUser.password);

        wordFileUploaded = await uploadActions.uploadFile(wordFileInfo.location, wordFileInfo.name, '-my-');

        pngFileShared = await alfrescoJsApi.core.sharedlinksApi.addSharedLink({ 'nodeId': pngFileUploaded.entry.id });
    });

    afterAll(async () => {
        await alfrescoJsApi.core.sitesApi.deleteSite(site.entry.id, { permanent: true });
        await alfrescoJsApi.login(acsUser.id, acsUser.password);
        await uploadActions.deleteFileOrFolder(wordFileUploaded.entry.id);
    });

    beforeEach(async () => {
        await loginPage.login(acsUser.email, acsUser.password);
    });

    it('[C260105] Should be able to open an image file shared via API', async () => {
        await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/preview/s/' + pngFileShared.entry.id);
        await viewerPage.checkImgContainerIsDisplayed();
        await BrowserActions.getUrl(browser.params.testConfig.adf.url);
        await navigationBarPage.clickLogoutButton();
        await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/preview/s/' + pngFileShared.entry.id);
        await viewerPage.checkImgContainerIsDisplayed();
    });

    it('[C260106] Should be able to open a Word file shared via API', async () => {
        await navigationBarPage.clickContentServicesButton();
        await contentServicesPage.waitForTableBody();

        await contentList.selectRow(wordFileInfo.name);
        await contentServicesPage.clickShareButton();
        await shareDialog.checkDialogIsDisplayed();
        await shareDialog.clickShareLinkButton();
        const sharedLink = await shareDialog.getShareLink();

        await BrowserActions.getUrl(sharedLink);
        await viewerPage.checkFileIsLoaded();
        await viewerPage.checkFileNameIsDisplayed(wordFileInfo.name);

        await BrowserActions.getUrl(browser.params.testConfig.adf.url);
        await navigationBarPage.clickLogoutButton();
        await BrowserActions.getUrl(sharedLink);
        await viewerPage.checkFileIsLoaded();
        await viewerPage.checkFileNameIsDisplayed(wordFileInfo.name);
    });
});
