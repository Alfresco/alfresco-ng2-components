/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import Util = require('../../util/util');
import NavigationBarPage = require('../../pages/adf/navigationBarPage');
import LoginPage = require('../../pages/adf/loginPage');
import ContentServicesPage = require('../../pages/adf/contentServicesPage');
import ContentListPage = require('../../pages/adf/dialog/contentList');
import ErrorPage = require('../../pages/adf/errorPage');
import { ShareDialog } from '../../pages/adf/dialog/shareDialog';
import AcsUserModel = require('../../models/ACS/acsUserModel');
import FileModel = require('../../models/ACS/fileModel');
import TestConfig = require('../../test.config');
import resources = require('../../util/resources');
import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../../actions/ACS/upload.actions';
import { browser } from 'protractor';

describe('Unshare file', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const contentListPage = new ContentListPage();
    let navBar = new NavigationBarPage();
    const errorPage = new ErrorPage();
    const shareDialog = new ShareDialog();
    const siteName = `PRIVATE-TEST-SITE-${Util.generateRandomString(5)}`;

    let acsUser = new AcsUserModel();
    let uploadActions = new UploadActions();
    let nodeBody;
    let nodeId;
    let testSite;
    let pngFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    beforeAll(async(done) => {
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
            name: Util.generateRandomString(5),
            nodeType: 'cm:content',
            properties: {
                'cm:title': Util.generateRandomString(5)
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

        let pngUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, pngFileModel.location, pngFileModel.name, '-my-');
        nodeId = pngUploadedFile.entry.id;

        loginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.navigateToDocumentList();
        done();
    });

    afterEach(async (done) => {
        await browser.refresh();
        done();
    });

    describe('with permission', () => {
        afterAll(async done => {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, nodeId);
            done();
        });

        it('[C286550] Unshare action opens confirmation dialog', () => {
            contentListPage.clickRowToSelect(pngFileModel.name);
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.clickShareToggle();
            shareDialog.confirmationDialogIsDisplayed();
        });

        it('[C286551] Cancel unshare file action', () => {
            contentListPage.clickRowToSelect(pngFileModel.name);
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.clickShareToggle();
            shareDialog.confirmationDialogIsDisplayed();
            shareDialog.clickConfirmationDialogCancelButton();
            shareDialog.shareToggleButtonIsChecked();
        });

        it('[C286552] Confirm unshare file action', async () => {
            contentListPage.clickRowToSelect(pngFileModel.name);
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.clickShareToggle();
            shareDialog.confirmationDialogIsDisplayed();
            shareDialog.clickConfirmationDialogRemoveButton();
            shareDialog.shareToggleButtonIsChecked();
        });

        it('[C280556] Unshared file should show 404 page', async() => {
            contentListPage.clickRowToSelect(pngFileModel.name);
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            let sharedLink = await shareDialog.getShareLink();
            shareDialog.clickShareToggle();
            shareDialog.confirmationDialogIsDisplayed();
            shareDialog.clickConfirmationDialogRemoveButton();
            shareDialog.dialogIsClosed();
            browser.get(sharedLink);
            errorPage.checkErrorCode();
        });
    });

    describe('without permission', () => {
        afterAll(async done => {
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            await this.alfrescoJsApi.core.sitesApi.deleteSite(siteName, { permanent: true });
            done();
        });

        it('[C286555] User without permission cannot remove shared file', () => {
            navBar.goToSite(testSite);
            contentListPage.navigateToFolder('documentLibrary');
            contentListPage.clickRowToSelect(nodeBody.name);
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.shareToggleButtonIsChecked();
            shareDialog.shareToggleButtonIsDisabled();
            shareDialog.clickShareToggle();
            shareDialog.confirmationDialogIsNotDisplayed();
        });
    });
});
