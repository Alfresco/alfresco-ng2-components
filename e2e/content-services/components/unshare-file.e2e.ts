/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import CONSTANTS = require('../../util/constants');
import { createApiService,
    BrowserActions,
    ErrorPage,
    LoginPage,
    NotificationHistoryPage,
    StringUtil,
    UploadActions,
    UserModel,
    UsersActions
} from '@alfresco/adf-testing';
import { NodeEntry, NodesApi, SharedlinksApi, SitesApi } from '@alfresco/js-api';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { ContentServicesPage } from '../../core/pages/content-services.page';
import { ShareDialogPage } from '../../core/pages/dialog/share-dialog.page';
import { FileModel } from '../../models/ACS/file.model';
import { browser } from 'protractor';

describe('Unshare file', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const navBar = new NavigationBarPage();
    const errorPage = new ErrorPage();
    const notificationHistoryPage = new NotificationHistoryPage();
    const navigationBarPage = new NavigationBarPage();
    const shareDialog = new ShareDialogPage();

    const apiService = createApiService();
    const uploadActions = new UploadActions(apiService);
    const usersActions = new UsersActions(apiService);
    const nodesApi = new NodesApi(apiService.getInstance());
    const sharedlinksApi = new SharedlinksApi(apiService.getInstance());

    const siteName = `PRIVATE-TEST-SITE-${StringUtil.generateRandomString(5)}`;
    let acsUser: UserModel;

    let nodeBody; let shareFilesSite;
    let pngUploadedFile: NodeEntry;

    const pngFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_path
    });

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');
        acsUser = await usersActions.createUser();

        const site = {
            title: siteName,
            visibility: 'PRIVATE',
            id: siteName
        };

        nodeBody = {
            name: StringUtil.generateRandomString(5),
            nodeType: 'cm:content',
            properties: {
                'cm:title': StringUtil.generateRandomString(5)
            }
        };

        const sitesApi = new SitesApi(apiService.getInstance());

        shareFilesSite = await sitesApi.createSite(site);

        const docLibId = (await sitesApi.listSiteContainers(siteName)).list.entries[0].entry.id;
        const testFile1Id = (await nodesApi.createNode(docLibId, nodeBody)).entry.id;
        await sitesApi.createSiteMembership(siteName, {
            id: acsUser.username,
            role: CONSTANTS.CS_USER_ROLES.CONSUMER
        });

        await nodesApi.updateNode(testFile1Id, {
            permissions: {
                isInheritanceEnabled: false,
                locallySet: [
                    {
                        authorityId: acsUser.username,
                        name: CONSTANTS.CS_USER_ROLES.CONSUMER
                    }
                ]
            }
        });
        await sharedlinksApi.createSharedLink({ nodeId: testFile1Id });
    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();

        const sitesApi = new SitesApi(apiService.getInstance());
        await sitesApi.deleteSite(shareFilesSite.entry.id, { permanent: true });
    });

    describe('with permission', () => {

        afterEach(async () => {
            await apiService.loginWithProfile('admin');
            await navigationBarPage.clickLogoutButton();
            await uploadActions.deleteFileOrFolder(pngUploadedFile.entry.id);
        });

        beforeEach(async () => {
            await apiService.login(acsUser.username, acsUser.password);

            pngUploadedFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, '-my-');

            await loginPage.login(acsUser.username, acsUser.password);
            await navBar.navigateToContentServices();
            await contentServicesPage.waitForTableBody();
        });

        it('[C286551] Should be able to cancel unshare action', async () => {
            await contentServicesPage.getDocumentList().selectRow(pngFileModel.name);
            await contentServicesPage.clickShareButton();
            await shareDialog.checkDialogIsDisplayed();
            await shareDialog.clickUnShareFile();
            await shareDialog.confirmationDialogIsDisplayed();
            await shareDialog.clickConfirmationDialogCancelButton();
            await shareDialog.shareToggleButtonIsChecked();
        });

        it('[C286550] Should display unshare confirmation dialog', async () => {
            await contentServicesPage.getDocumentList().selectRow(pngFileModel.name);
            await contentServicesPage.clickShareButton();
            await shareDialog.checkDialogIsDisplayed();
            await browser.sleep(2000);
            await shareDialog.clickUnShareFile();
            await shareDialog.confirmationDialogIsDisplayed();
        });

        it('[C286552] Should be able to confirm unshare action', async () => {
            await contentServicesPage.getDocumentList().selectRow(pngFileModel.name);
            await contentServicesPage.clickShareButton();
            await shareDialog.checkDialogIsDisplayed();
            await shareDialog.clickUnShareFile();
            await shareDialog.confirmationDialogIsDisplayed();
            await shareDialog.clickConfirmationDialogRemoveButton();
            await shareDialog.dialogIsClosed();
        });

        it('[C280556] Should redirect to 404 when trying to access an unshared file', async () => {
            await contentServicesPage.getDocumentList().selectRow(pngFileModel.name);
            await contentServicesPage.clickShareButton();
            await shareDialog.checkDialogIsDisplayed();
            await browser.sleep(2000);

            const sharedLink = await shareDialog.getShareLink();
            await shareDialog.clickUnShareFile();
            await shareDialog.confirmationDialogIsDisplayed();
            await shareDialog.clickConfirmationDialogRemoveButton();
            await shareDialog.dialogIsClosed();
            await BrowserActions.getUrl(sharedLink.replace(browser.params.testConfig.appConfig.ecmHost, `${browser.baseUrl}`));
            await errorPage.checkErrorCode();
        });
    });

    describe('without permission', () => {

        beforeEach(async () => {
            await loginPage.login(acsUser.username, acsUser.password);
        });

        it('[C286555] Should NOT be able to unshare file without permission', async () => {
            await navBar.goToSite(shareFilesSite);
            await contentServicesPage.openFolder('documentLibrary');
            await contentServicesPage.getDocumentList().selectRow(nodeBody.name);
            await contentServicesPage.clickShareButton();

            await shareDialog.checkDialogIsDisplayed();
            await shareDialog.shareToggleButtonIsChecked();
            await shareDialog.clickUnShareFile();
            await shareDialog.confirmationDialogIsDisplayed();
            await shareDialog.clickConfirmationDialogRemoveButton();
            await shareDialog.checkDialogIsDisplayed();
            await shareDialog.shareToggleButtonIsChecked();

            await notificationHistoryPage.checkNotifyContains(`You don't have permission to unshare this file`);
        });
    });
});
