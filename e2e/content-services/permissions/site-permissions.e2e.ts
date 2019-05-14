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

import { PermissionsPage } from '../../pages/adf/permissionsPage';
import { LoginPage, BrowserActions } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import TestConfig = require('../../test.config');
import resources = require('../../util/resources');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { FileModel } from '../../models/ACS/fileModel';
import { UploadActions } from '../../actions/ACS/upload.actions';
import { StringUtil } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { ViewerPage } from '../../pages/adf/viewerPage';
import { NotificationPage } from '../../pages/adf/notificationPage';
import CONSTANTS = require('../../util/constants');
import { MetadataViewPage } from '../../pages/adf/metadataViewPage';
import { UploadDialog } from '../../pages/adf/dialog/uploadDialog';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

describe('Permissions Component', function () {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const permissionsPage = new PermissionsPage();
    const uploadActions = new UploadActions();

    const contentList = contentServicesPage.getDocumentList();

    const viewerPage = new ViewerPage();
    const navigationBarPage = new NavigationBarPage();
    const metadataViewPage = new MetadataViewPage();
    const notificationPage = new NotificationPage();
    const uploadDialog = new UploadDialog();

    let folderOwnerUser, consumerUser, siteConsumerUser, contributorUser, managerUser, collaboratorUser;

    let publicSite, privateSite, folderName;

    const fileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });

    const testFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TEST.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
    });

    const pngFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    const alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: TestConfig.adf.url
    });

    let siteFolder, privateSiteFile;

    folderOwnerUser = new AcsUserModel();
    consumerUser = new AcsUserModel();
    siteConsumerUser = new AcsUserModel();
    collaboratorUser = new AcsUserModel();
    contributorUser = new AcsUserModel();
    managerUser = new AcsUserModel();

    beforeAll(async (done) => {

        await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await alfrescoJsApi.core.peopleApi.addPerson(folderOwnerUser);
        await alfrescoJsApi.core.peopleApi.addPerson(siteConsumerUser);
        await alfrescoJsApi.core.peopleApi.addPerson(consumerUser);
        await alfrescoJsApi.core.peopleApi.addPerson(contributorUser);
        await alfrescoJsApi.core.peopleApi.addPerson(collaboratorUser);
        await alfrescoJsApi.core.peopleApi.addPerson(managerUser);
        await alfrescoJsApi.login(folderOwnerUser.id, folderOwnerUser.password);

        const publicSiteName = `PUBLIC_TEST_SITE_${StringUtil.generateRandomString(5)}`;

        const privateSiteName = `PRIVATE_TEST_SITE_${StringUtil.generateRandomString(5)}`;

        folderName = `MEESEEKS_${StringUtil.generateRandomString(5)}`;

        const publicSiteBody = { visibility: 'PUBLIC', title: publicSiteName };

        const privateSiteBody = { visibility: 'PRIVATE', title: privateSiteName };

        publicSite = await alfrescoJsApi.core.sitesApi.createSite(publicSiteBody);
        privateSite = await alfrescoJsApi.core.sitesApi.createSite(privateSiteBody);

        await alfrescoJsApi.core.sitesApi.addSiteMember(publicSite.entry.id, {
            id: siteConsumerUser.id,
            role: CONSTANTS.CS_USER_ROLES.CONSUMER
        });

        await alfrescoJsApi.core.sitesApi.addSiteMember(publicSite.entry.id, {
            id: collaboratorUser.id,
            role: CONSTANTS.CS_USER_ROLES.COLLABORATOR
        });

        await alfrescoJsApi.core.sitesApi.addSiteMember(publicSite.entry.id, {
            id: contributorUser.id,
            role: CONSTANTS.CS_USER_ROLES.CONTRIBUTOR
        });

        await alfrescoJsApi.core.sitesApi.addSiteMember(publicSite.entry.id, {
            id: managerUser.id,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });

        await alfrescoJsApi.core.sitesApi.addSiteMember(privateSite.entry.id, {
            id: managerUser.id,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });

        siteFolder = await uploadActions.createFolder(alfrescoJsApi, folderName, publicSite.entry.guid);

        privateSiteFile = await uploadActions.uploadFile(alfrescoJsApi, fileModel.location, 'privateSite' + fileModel.name, privateSite.entry.guid);

        await alfrescoJsApi.core.nodesApi.updateNode(privateSiteFile.entry.id,
            {
                permissions: {
                    locallySet: [{
                        authorityId: managerUser.getId(),
                        name: 'SiteConsumer',
                        accessStatus: 'ALLOWED'
                    }]
                }
            });

        await uploadActions.uploadFile(alfrescoJsApi, fileModel.location, 'Site' + fileModel.name, siteFolder.entry.id);
        done();
    });

    afterAll(async (done) => {
        await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await alfrescoJsApi.core.sitesApi.deleteSite(publicSite.entry.id);
        await alfrescoJsApi.core.sitesApi.deleteSite(privateSite.entry.id);

        done();
    });

    describe('Role Site Dropdown', function () {

        beforeAll(async (done) => {
            await loginPage.loginToContentServicesUsingUserModel(folderOwnerUser);

            await BrowserActions.getUrl(TestConfig.adf.url + '/files/' + publicSite.entry.guid);

            done();
        });

        xit('[C277002] Should display the Role Site dropdown', async () => {
            contentServicesPage.checkContentIsDisplayed(folderName);

            contentServicesPage.checkSelectedSiteIsDisplayed('My files');

            contentList.rightClickOnRow(folderName);

            contentServicesPage.pressContextMenuActionNamed('Permission');

            permissionsPage.checkPermissionInheritedButtonIsDisplayed();
            permissionsPage.checkAddPermissionButtonIsDisplayed();
            permissionsPage.clickAddPermissionButton();
            permissionsPage.checkAddPermissionDialogIsDisplayed();
            permissionsPage.checkSearchUserInputIsDisplayed();

            browser.sleep(10000);

            permissionsPage.searchUserOrGroup(consumerUser.getId());
            permissionsPage.clickUserOrGroup(consumerUser.getFirstName());
            permissionsPage.checkUserOrGroupIsAdded(consumerUser.getId());

            expect(permissionsPage.getRoleCellValue(consumerUser.getId())).toEqual('SiteCollaborator');

            permissionsPage.clickRoleDropdownByUserOrGroupName(consumerUser.getId());

            expect(permissionsPage.getRoleDropdownOptions().count()).toBe(4);
            expect(permissionsPage.getRoleDropdownOptions().get(0).getText()).toBe('SiteCollaborator');
            expect(permissionsPage.getRoleDropdownOptions().get(1).getText()).toBe('SiteConsumer');
            expect(permissionsPage.getRoleDropdownOptions().get(2).getText()).toBe('SiteContributor');
            expect(permissionsPage.getRoleDropdownOptions().get(3).getText()).toBe('SiteManager');
        });

    });

    describe('Roles: SiteConsumer, SiteCollaborator, SiteContributor, SiteManager', function () {

        xit('[C276994] Role SiteConsumer', async () => {

            await loginPage.loginToContentServicesUsingUserModel(siteConsumerUser);

            navigationBarPage.openContentServicesFolder(siteFolder.entry.id);

            contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name);

            contentList.doubleClickRow('Site' + fileModel.name);

            viewerPage.checkFileIsLoaded();
            viewerPage.clickCloseButton();

            contentList.waitForTableBody();

            contentServicesPage.checkDeleteIsDisabled('Site' + fileModel.name);

            BrowserActions.closeMenuAndDialogs();

            contentList.checkActionMenuIsNotDisplayed();

            contentServicesPage.metadataContent('Site' + fileModel.name);

            notificationPage.checkNotifyContains('You don\'t have access to do this.');

            contentServicesPage.uploadFile(fileModel.location);

            notificationPage.checkNotifyContains('You don\'t have the create permission to upload the content');

        });

        it('[C276997] Role SiteContributor', async () => {
            await loginPage.loginToContentServicesUsingUserModel(contributorUser);

            navigationBarPage.openContentServicesFolder(siteFolder.entry.id);

            contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name);

            contentList.doubleClickRow('Site' + fileModel.name);

            viewerPage.checkFileIsLoaded();
            viewerPage.clickCloseButton();

            contentList.waitForTableBody();

            contentServicesPage.checkDeleteIsDisabled('Site' + fileModel.name);

            BrowserActions.closeMenuAndDialogs();

            contentList.checkActionMenuIsNotDisplayed();

            contentServicesPage.metadataContent('Site' + fileModel.name);

            notificationPage.checkNotifyContains('You don\'t have access to do this.');

            contentServicesPage.uploadFile(testFileModel.location).checkContentIsDisplayed(testFileModel.name);

            uploadDialog.fileIsUploaded(testFileModel.name);
            uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

        });

        it('[C277005] Role SiteCollaborator', async () => {

            await loginPage.loginToContentServicesUsingUserModel(collaboratorUser);

            navigationBarPage.openContentServicesFolder(siteFolder.entry.id);

            contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name);

            contentList.doubleClickRow('Site' + fileModel.name);

            viewerPage.checkFileIsLoaded();
            viewerPage.clickCloseButton();

            contentList.waitForTableBody();

            contentServicesPage.checkDeleteIsDisabled('Site' + fileModel.name);

            BrowserActions.closeMenuAndDialogs();

            browser.controlFlow().execute(async () => {

                contentList.checkActionMenuIsNotDisplayed();

                contentServicesPage.metadataContent('Site' + fileModel.name);

                metadataViewPage.editIconIsDisplayed();
                await metadataViewPage.editIconClick();

                metadataViewPage.editPropertyIconIsDisplayed('properties.cm:title');
                metadataViewPage.clickEditPropertyIcons('properties.cm:title');

                metadataViewPage.enterPropertyText('properties.cm:title', 'newTitle');
                await metadataViewPage.clickUpdatePropertyIcon('properties.cm:title');

                expect(metadataViewPage.getPropertyText('properties.cm:title')).toEqual('newTitle');
                metadataViewPage.clickCloseButton();

                contentServicesPage.uploadFile(pngFileModel.location).checkContentIsDisplayed(pngFileModel.name);

                uploadDialog.fileIsUploaded(pngFileModel.name);
                uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

            });

        });

        it('[C277006] Role SiteManager', async () => {
            await loginPage.loginToContentServicesUsingUserModel(managerUser);
            navigationBarPage.openContentServicesFolder(siteFolder.entry.id);
            contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name);

            contentList.doubleClickRow('Site' + fileModel.name);

            viewerPage.checkFileIsLoaded();
            viewerPage.clickCloseButton();

            contentList.waitForTableBody();
            contentServicesPage.metadataContent('Site' + fileModel.name);

            metadataViewPage.editIconIsDisplayed();

            browser.controlFlow().execute(async () => {

                await metadataViewPage.editIconClick();

                metadataViewPage.editPropertyIconIsDisplayed('properties.cm:description');
                metadataViewPage.clickEditPropertyIcons('properties.cm:description');
                metadataViewPage.enterDescriptionText('newDescription');

                await metadataViewPage.clickUpdatePropertyIcon('properties.cm:description');

                expect(metadataViewPage.getPropertyText('properties.cm:description')).toEqual('newDescription');

                metadataViewPage.clickCloseButton();
                contentServicesPage.uploadFile(testFileModel.location).checkContentIsDisplayed(testFileModel.name);

                uploadDialog.fileIsUploaded(testFileModel.name);
                uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

                contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name);
                contentServicesPage.deleteContent('Site' + fileModel.name);
                contentServicesPage.checkContentIsNotDisplayed('Site' + fileModel.name);
            });

        });

    });

});
