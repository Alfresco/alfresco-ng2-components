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

import CONSTANTS = require('../../util/constants');
import {
    ApiService,
    BrowserActions,
    ErrorPage,
    LoginPage,
    NotificationHistoryPage,
    StringUtil,
    UploadActions,
    UserModel,
    UsersActions
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { ContentServicesPage } from '../../core/pages/content-services.page';
import { ShareDialogPage } from '../../core/pages/dialog/share-dialog.page';
import { FileModel } from '../../models/ACS/file.model';
import { browser } from 'protractor';

describe('Unshare file', () => {

    const apiService = new ApiService();
    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const contentListPage = contentServicesPage.getDocumentList();
    const navBar = new NavigationBarPage();
    const errorPage = new ErrorPage();
    const notificationHistoryPage = new NotificationHistoryPage();
    const navigationBarPage = new NavigationBarPage();
    const shareDialog = new ShareDialogPage();

    const uploadActions = new UploadActions(apiService);
    const usersActions = new UsersActions(apiService);

    const siteName = `PRIVATE-TEST-SITE-${StringUtil.generateRandomString(5)}`;
    let acsUser: UserModel;

    let nodeBody, nodeId, testSite;

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

        testSite = await apiService.getInstance().core.sitesApi.createSite(site);

        const docLibId = (await apiService.getInstance().core.sitesApi.getSiteContainers(siteName)).list.entries[0].entry.id;
        const testFile1Id = (await apiService.getInstance().core.nodesApi.addNode(docLibId, nodeBody)).entry.id;
        await apiService.getInstance().core.sitesApi.addSiteMember(siteName, {
            id: acsUser.username,
            role: CONSTANTS.CS_USER_ROLES.CONSUMER
        });

        await apiService.getInstance().core.nodesApi.updateNode(testFile1Id, {
            permissions: {
                isInheritanceEnabled: false,
                locallySet: [
                    {
                        authorityId: acsUser.email,
                        name: CONSTANTS.CS_USER_ROLES.CONSUMER
                    }
                ]
            }
        });
        await apiService.getInstance().core.sharedlinksApi.addSharedLink({ nodeId: testFile1Id });
        await apiService.login(acsUser.email, acsUser.password);

        const pngUploadedFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, '-my-');
        nodeId = pngUploadedFile.entry.id;

        await loginPage.login(acsUser.email, acsUser.password);
        await navBar.navigateToContentServices();
        await contentServicesPage.waitForTableBody();
    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
        await apiService.getInstance().core.sitesApi.deleteSite(testSite.entry.id, { permanent: true });
    });

    describe('with permission', () => {
        afterAll(async () => {
            await apiService.loginWithProfile('admin');
            await uploadActions.deleteFileOrFolder(nodeId);
        });

        it('[C286550] Should display unshare confirmation dialog', async () => {
            await contentListPage.selectRow(pngFileModel.name);
            await contentServicesPage.clickShareButton();
            await shareDialog.checkDialogIsDisplayed();
            await browser.sleep(2000);
            await shareDialog.clickUnShareFile();
            await shareDialog.confirmationDialogIsDisplayed();
        });

        it('[C286551] Should be able to cancel unshare action', async () => {
            await contentListPage.selectRow(pngFileModel.name);
            await contentServicesPage.clickShareButton();
            await shareDialog.checkDialogIsDisplayed();
            await shareDialog.clickUnShareFile();
            await shareDialog.confirmationDialogIsDisplayed();
            await shareDialog.clickConfirmationDialogCancelButton();
            await shareDialog.shareToggleButtonIsChecked();
        });

        it('[C286552] Should be able to confirm unshare action', async () => {
            await contentListPage.selectRow(pngFileModel.name);
            await contentServicesPage.clickShareButton();
            await shareDialog.checkDialogIsDisplayed();
            await shareDialog.clickUnShareFile();
            await shareDialog.confirmationDialogIsDisplayed();
            await shareDialog.clickConfirmationDialogRemoveButton();
            await shareDialog.dialogIsClosed();
        });

        it('[C280556] Should redirect to 404 when trying to access an unshared file', async () => {
            await contentListPage.selectRow(pngFileModel.name);
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

        afterAll(async () => {
            await apiService.loginWithProfile('admin');
            await apiService.getInstance().core.sitesApi.deleteSite(siteName, { permanent: true });
        });

        it('[C286555] Should NOT be able to unshare file without permission', async () => {
            await navBar.goToSite(testSite);
            await contentServicesPage.openFolder('documentLibrary');
            await contentListPage.selectRow(nodeBody.name);
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
