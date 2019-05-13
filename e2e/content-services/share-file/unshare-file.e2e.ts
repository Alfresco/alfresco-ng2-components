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
import { StringUtil, BrowserActions } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { LoginPage, ErrorPage } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { ShareDialog } from '../../pages/adf/dialog/shareDialog';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';
import TestConfig = require('../../test.config');
import resources = require('../../util/resources');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '../../actions/ACS/upload.actions';
import { browser } from 'protractor';

describe('Unshare file', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const contentListPage = contentServicesPage.getDocumentList();
    const navBar = new NavigationBarPage();
    const errorPage = new ErrorPage();
    const shareDialog = new ShareDialog();
    const siteName = `PRIVATE-TEST-SITE-${StringUtil.generateRandomString(5)}`;

    const acsUser = new AcsUserModel();
    const uploadActions = new UploadActions();
    let nodeBody;
    let nodeId;
    let testSite;
    const pngFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    beforeAll(async (done) => {
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

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
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

        const pngUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, pngFileModel.location, pngFileModel.name, '-my-');
        nodeId = pngUploadedFile.entry.id;

        await loginPage.loginToContentServicesUsingUserModel(acsUser);
        navBar.clickContentServicesButton();
        contentServicesPage.waitForTableBody();
        done();
    });

    afterEach(async (done) => {
        await browser.refresh();
        done();
    });

    describe('with permission', () => {
        afterAll(async (done) => {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, nodeId);
            done();
        });

        it('[C286550] Should display unshare confirmation dialog', () => {
            contentListPage.selectRow(pngFileModel.name);
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.clickUnShareFile();
            shareDialog.confirmationDialogIsDisplayed();
        });

        it('[C286551] Should be able to cancel unshare action', () => {
            contentListPage.selectRow(pngFileModel.name);
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.clickUnShareFile();
            shareDialog.confirmationDialogIsDisplayed();
            shareDialog.clickConfirmationDialogCancelButton();
            shareDialog.shareToggleButtonIsChecked();
        });

        it('[C286552] Should be able to confirm unshare action', async () => {
            contentListPage.selectRow(pngFileModel.name);
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.clickUnShareFile();
            shareDialog.confirmationDialogIsDisplayed();
            shareDialog.clickConfirmationDialogRemoveButton();
            shareDialog.dialogIsClosed();
        });

        it('[C280556] Should redirect to 404 when trying to access an unshared file', async () => {
            contentListPage.selectRow(pngFileModel.name);
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            const sharedLink = await shareDialog.getShareLink();
            shareDialog.clickUnShareFile();
            shareDialog.confirmationDialogIsDisplayed();
            shareDialog.clickConfirmationDialogRemoveButton();
            shareDialog.dialogIsClosed();
            BrowserActions.getUrl(sharedLink);
            errorPage.checkErrorCode();
        });
    });

    describe('without permission', () => {
        afterAll(async (done) => {
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            await this.alfrescoJsApi.core.sitesApi.deleteSite(siteName, { permanent: true });
            done();
        });

        it('[C286555] Should NOT be able to unshare file without permission', () => {
            navBar.goToSite(testSite);
            contentListPage.doubleClickRow('documentLibrary');
            contentListPage.selectRow(nodeBody.name);
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.shareToggleButtonIsChecked();
            shareDialog.shareToggleButtonIsDisabled();
            shareDialog.clickUnShareFile();
            shareDialog.confirmationDialogIsNotDisplayed();
        });
    });
});
