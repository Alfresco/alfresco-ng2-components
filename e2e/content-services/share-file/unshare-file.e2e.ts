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
    StringUtil,
    BrowserActions,
    NotificationHistoryPage,
    LoginPage,
    ErrorPage,
    UploadActions
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { ShareDialog } from '../../pages/adf/dialog/shareDialog';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';
import resources = require('../../util/resources');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { browser } from 'protractor';

describe('Unshare file', () => {

    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });
    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const contentListPage = contentServicesPage.getDocumentList();
    const navBar = new NavigationBarPage();
    const errorPage = new ErrorPage();
    const notificationHistoryPage = new NotificationHistoryPage();
    const navigationBarPage = new NavigationBarPage();

    const shareDialog = new ShareDialog();
    const siteName = `PRIVATE-TEST-SITE-${StringUtil.generateRandomString(5)}`;
    const acsUser = new AcsUserModel();
    const uploadActions = new UploadActions(this.alfrescoJsApi);
    let nodeBody;
    let nodeId;
    let testSite;
    const pngFileModel = new FileModel({
        name: resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    beforeAll(async () => {
        const site = {
            title: siteName,
            visibility: 'PRIVATE',
            id: siteName
        };

        const memberBody = {
            id: acsUser.id,
            role: CONSTANTS.CS_USER_ROLES.CONSUMER
        };

        nodeBody = {
            name: StringUtil.generateRandomString(5),
            nodeType: 'cm:content',
            properties: {
                'cm:title': StringUtil.generateRandomString(5)
            }
        };

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        testSite = await this.alfrescoJsApi.core.sitesApi.createSite(site);

        const docLibId = (await this.alfrescoJsApi.core.sitesApi.getSiteContainers(siteName)).list.entries[0].entry.id;
        const testFile1Id = (await this.alfrescoJsApi.core.nodesApi.addNode(docLibId, nodeBody)).entry.id;
        await this.alfrescoJsApi.core.sitesApi.addSiteMember(siteName, memberBody);

        await this.alfrescoJsApi.core.nodesApi.updateNode(testFile1Id, {
            permissions: {
                isInheritanceEnabled: false,
                locallySet: [
                    {
                        authorityId: acsUser.id,
                        name: CONSTANTS.CS_USER_ROLES.CONSUMER
                    }
                ]
            }
        });
        await this.alfrescoJsApi.core.sharedlinksApi.addSharedLink({ nodeId: testFile1Id });
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        const pngUploadedFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, '-my-');
        nodeId = pngUploadedFile.entry.id;

        await loginPage.loginToContentServicesUsingUserModel(acsUser);
        await navBar.clickContentServicesButton();
        await contentServicesPage.waitForTableBody();

    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    afterEach(async () => {
        await browser.refresh();

    });

    describe('with permission', () => {
        afterAll(async () => {
            await uploadActions.deleteFileOrFolder(nodeId);

        });

        it('[C286550] Should display unshare confirmation dialog', async () => {
            await contentListPage.selectRow(pngFileModel.name);
            await contentServicesPage.clickShareButton();
            await shareDialog.checkDialogIsDisplayed();
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
            const sharedLink = await shareDialog.getShareLink();
            await shareDialog.clickUnShareFile();
            await shareDialog.confirmationDialogIsDisplayed();
            await shareDialog.clickConfirmationDialogRemoveButton();
            await shareDialog.dialogIsClosed();
            await BrowserActions.getUrl(sharedLink.replace(browser.params.testConfig.adf_acs.host, browser.params.testConfig.adf.host));
            await errorPage.checkErrorCode();
        });
    });

    describe('without permission', () => {
        afterAll(async () => {
            await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
            await this.alfrescoJsApi.core.sitesApi.deleteSite(siteName, { permanent: true });

        });

        it('[C286555] Should NOT be able to unshare file without permission', async () => {
            await navBar.goToSite(testSite);
            await contentListPage.doubleClickRow('documentLibrary');
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
