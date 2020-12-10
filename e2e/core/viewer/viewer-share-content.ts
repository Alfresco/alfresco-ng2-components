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

import {
    ApiService,
    BrowserActions,
    LoginPage,
    StringUtil,
    UploadActions,
    UserModel,
    UsersActions,
    ViewerPage
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { ContentServicesPage } from '../../core/pages/content-services.page';
import { ShareDialogPage } from '../../core/pages/dialog/share-dialog.page';
import { FileModel } from '../../models/ACS/file.model';
import { browser } from 'protractor';
import CONSTANTS = require('../../util/constants');

describe('Viewer', () => {

    const viewerPage = new ViewerPage();
    const navigationBarPage = new NavigationBarPage();
    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const shareDialog = new ShareDialogPage();

    const apiService = new ApiService();
    const usersActions = new UsersActions(apiService);
    const uploadActions = new UploadActions(apiService);

    let site;
    const acsUser = new UserModel();
    let pngFileUploaded;
    const contentList = contentServicesPage.getDocumentList();

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

        pngFileUploaded = await uploadActions.uploadFile(pngFileInfo.location, pngFileInfo.name, site.entry.guid);

        await apiService.login(acsUser.email, acsUser.password);

        wordFileUploaded = await uploadActions.uploadFile(wordFileInfo.location, wordFileInfo.name, '-my-');

        pngFileShared = await apiService.getInstance().core.sharedlinksApi.addSharedLink({ 'nodeId': pngFileUploaded.entry.id });
    });

    afterAll(async () => {
        await apiService.getInstance().core.sitesApi.deleteSite(site.entry.id, { permanent: true });
        await apiService.login(acsUser.email, acsUser.password);
        await uploadActions.deleteFileOrFolder(wordFileUploaded.entry.id);
    });

    beforeEach(async () => {
        await loginPage.login(acsUser.email, acsUser.password);
    });

    it('[C260105] Should be able to open an image file shared via API', async () => {
        await BrowserActions.getUrl(browser.baseUrl + '/preview/s/' + pngFileShared.entry.id);
        await viewerPage.checkImgContainerIsDisplayed();
        await BrowserActions.getUrl(browser.baseUrl);
        await navigationBarPage.clickLogoutButton();
        await BrowserActions.getUrl(browser.baseUrl + '/preview/s/' + pngFileShared.entry.id);
        await viewerPage.checkImgContainerIsDisplayed();
    });

    it('[C260106] Should be able to open a Word file shared via API', async () => {
        await navigationBarPage.navigateToContentServices();
        await contentServicesPage.waitForTableBody();

        await contentList.selectRow(wordFileInfo.name);
        await contentServicesPage.clickShareButton();
        await shareDialog.checkDialogIsDisplayed();
        await shareDialog.clickShareLinkButton();
        const sharedLink = await shareDialog.getShareLink();

        await BrowserActions.getUrl(sharedLink);
        await viewerPage.checkFileIsLoaded();
        await viewerPage.checkFileNameIsDisplayed(wordFileInfo.name);

        await BrowserActions.getUrl(browser.baseUrl);
        await navigationBarPage.clickLogoutButton();
        await BrowserActions.getUrl(sharedLink);
        await viewerPage.checkFileIsLoaded();
        await viewerPage.checkFileNameIsDisplayed(wordFileInfo.name);
    });
});
