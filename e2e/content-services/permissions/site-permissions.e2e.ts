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
import { LoginPage, BrowserActions, UploadActions, StringUtil, NotificationHistoryPage } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import resources = require('../../util/resources');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { FileModel } from '../../models/ACS/fileModel';
import { browser } from 'protractor';
import { ViewerPage } from '../../pages/adf/viewerPage';
import CONSTANTS = require('../../util/constants');
import { MetadataViewPage } from '../../pages/adf/metadataViewPage';
import { UploadDialog } from '../../pages/adf/dialog/uploadDialog';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

describe('Permissions Component', () => {

    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });
    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const permissionsPage = new PermissionsPage();
    const uploadActions = new UploadActions(this.alfrescoJsApi);

    const contentList = contentServicesPage.getDocumentList();

    const viewerPage = new ViewerPage();
    const navigationBarPage = new NavigationBarPage();
    const metadataViewPage = new MetadataViewPage();
    const notificationHistoryPage = new NotificationHistoryPage();
    const uploadDialog = new UploadDialog();

    let folderOwnerUser, consumerUser, siteConsumerUser, contributorUser, managerUser, collaboratorUser;

    let publicSite, privateSite, folderName;

    const fileModel = new FileModel({
        name: resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        location: resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });

    const testFileModel = new FileModel({
        name: resources.Files.ADF_DOCUMENTS.TEST.file_name,
        location: resources.Files.ADF_DOCUMENTS.TEST.file_location
    });

    const pngFileModel = new FileModel({
        name: resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    let siteFolder, privateSiteFile;

    folderOwnerUser = new AcsUserModel();
    consumerUser = new AcsUserModel();
    siteConsumerUser = new AcsUserModel();
    collaboratorUser = new AcsUserModel();
    contributorUser = new AcsUserModel();
    managerUser = new AcsUserModel();

    beforeAll(async () => {

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(folderOwnerUser);
        await this.alfrescoJsApi.core.peopleApi.addPerson(siteConsumerUser);
        await this.alfrescoJsApi.core.peopleApi.addPerson(consumerUser);
        await this.alfrescoJsApi.core.peopleApi.addPerson(contributorUser);
        await this.alfrescoJsApi.core.peopleApi.addPerson(collaboratorUser);
        await this.alfrescoJsApi.core.peopleApi.addPerson(managerUser);
        await this.alfrescoJsApi.login(folderOwnerUser.id, folderOwnerUser.password);

        await browser.sleep(15000);

        const publicSiteName = `PUBLIC_TEST_SITE_${StringUtil.generateRandomString(5)}`;

        const privateSiteName = `PRIVATE_TEST_SITE_${StringUtil.generateRandomString(5)}`;

        folderName = `MEESEEKS_${StringUtil.generateRandomString(5)}`;

        const publicSiteBody = { visibility: 'PUBLIC', title: publicSiteName };

        const privateSiteBody = { visibility: 'PRIVATE', title: privateSiteName };

        publicSite = await this.alfrescoJsApi.core.sitesApi.createSite(publicSiteBody);
        privateSite = await this.alfrescoJsApi.core.sitesApi.createSite(privateSiteBody);

        await this.alfrescoJsApi.core.sitesApi.addSiteMember(publicSite.entry.id, {
            id: siteConsumerUser.id,
            role: CONSTANTS.CS_USER_ROLES.CONSUMER
        });

        await this.alfrescoJsApi.core.sitesApi.addSiteMember(publicSite.entry.id, {
            id: collaboratorUser.id,
            role: CONSTANTS.CS_USER_ROLES.COLLABORATOR
        });

        await this.alfrescoJsApi.core.sitesApi.addSiteMember(publicSite.entry.id, {
            id: contributorUser.id,
            role: CONSTANTS.CS_USER_ROLES.CONTRIBUTOR
        });

        await this.alfrescoJsApi.core.sitesApi.addSiteMember(publicSite.entry.id, {
            id: managerUser.id,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });

        await this.alfrescoJsApi.core.sitesApi.addSiteMember(privateSite.entry.id, {
            id: managerUser.id,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });

        siteFolder = await uploadActions.createFolder(folderName, publicSite.entry.guid);

        privateSiteFile = await uploadActions.uploadFile(fileModel.location, 'privateSite' + fileModel.name, privateSite.entry.guid);

        await this.alfrescoJsApi.core.nodesApi.updateNode(privateSiteFile.entry.id,
            {
                permissions: {
                    locallySet: [{
                        authorityId: managerUser.getId(),
                        name: 'SiteConsumer',
                        accessStatus: 'ALLOWED'
                    }]
                }
            });

        await uploadActions.uploadFile(fileModel.location, 'Site' + fileModel.name, siteFolder.entry.id);

    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.sitesApi.deleteSite(publicSite.entry.id);
        await this.alfrescoJsApi.core.sitesApi.deleteSite(privateSite.entry.id);

    });

    describe('Role Site Dropdown', () => {

        beforeAll(async () => {
            await loginPage.loginToContentServicesUsingUserModel(folderOwnerUser);

            await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/files/' + publicSite.entry.guid);

        });

        it('[C277002] Should display the Role Site dropdown', async () => {
            await contentServicesPage.checkContentIsDisplayed(folderName);

            await contentList.rightClickOnRow(folderName);

            await contentServicesPage.pressContextMenuActionNamed('Permission');

            await permissionsPage.checkPermissionInheritedButtonIsDisplayed();
            await permissionsPage.checkAddPermissionButtonIsDisplayed();

            await browser.sleep(5000);

            await permissionsPage.clickAddPermissionButton();
            await permissionsPage.checkAddPermissionDialogIsDisplayed();
            await permissionsPage.checkSearchUserInputIsDisplayed();

            await permissionsPage.searchUserOrGroup(consumerUser.getId());

            await permissionsPage.clickUserOrGroup(consumerUser.getFirstName());
            await permissionsPage.checkUserOrGroupIsAdded(consumerUser.getId());

            await expect(await permissionsPage.getRoleCellValue(consumerUser.getId())).toEqual('SiteCollaborator');

            await permissionsPage.clickRoleDropdownByUserOrGroupName(consumerUser.getId());

            const roleDropdownOptions = permissionsPage.getRoleDropdownOptions();

            await expect(await roleDropdownOptions.count()).toBe(4);
            await expect(await BrowserActions.getText(roleDropdownOptions.get(0))).toBe(CONSTANTS.CS_USER_ROLES.COLLABORATOR);
            await expect(await BrowserActions.getText(roleDropdownOptions.get(1))).toBe(CONSTANTS.CS_USER_ROLES.CONSUMER);
            await expect(await BrowserActions.getText(roleDropdownOptions.get(2))).toBe(CONSTANTS.CS_USER_ROLES.CONTRIBUTOR);
            await expect(await BrowserActions.getText(roleDropdownOptions.get(3))).toBe(CONSTANTS.CS_USER_ROLES.MANAGER);
        });

    });

    describe('Roles: SiteConsumer, SiteCollaborator, SiteContributor, SiteManager', () => {

        it('[C276994] Role SiteConsumer', async () => {

            await loginPage.loginToContentServicesUsingUserModel(siteConsumerUser);

            await navigationBarPage.openContentServicesFolder(siteFolder.entry.id);

            await contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name);

            await contentList.doubleClickRow('Site' + fileModel.name);

            await viewerPage.checkFileIsLoaded();
            await viewerPage.clickCloseButton();

            await contentList.waitForTableBody();

            await contentServicesPage.checkDeleteIsDisabled('Site' + fileModel.name);

            await BrowserActions.closeMenuAndDialogs();

            await contentList.checkActionMenuIsNotDisplayed();

            await contentServicesPage.metadataContent('Site' + fileModel.name);

            await notificationHistoryPage.checkNotifyContains('You don\'t have access to do this.');

            await contentServicesPage.uploadFile(fileModel.location);

            await notificationHistoryPage.checkNotifyContains('You don\'t have the create permission to upload the content');

        });

        it('[C276997] Role SiteContributor', async () => {
            await loginPage.loginToContentServicesUsingUserModel(contributorUser);

            await navigationBarPage.openContentServicesFolder(siteFolder.entry.id);

            await contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name);

            await contentList.doubleClickRow('Site' + fileModel.name);

            await viewerPage.checkFileIsLoaded();
            await viewerPage.clickCloseButton();

            await contentList.waitForTableBody();

            await contentServicesPage.checkDeleteIsDisabled('Site' + fileModel.name);

            await BrowserActions.closeMenuAndDialogs();

            await contentList.checkActionMenuIsNotDisplayed();

            await contentServicesPage.metadataContent('Site' + fileModel.name);

            await notificationHistoryPage.checkNotifyContains('You don\'t have access to do this.');

            await contentServicesPage.uploadFile(testFileModel.location);
            await contentServicesPage.checkContentIsDisplayed(testFileModel.name);

            await uploadDialog.fileIsUploaded(testFileModel.name);
            await uploadDialog.clickOnCloseButton();
            await uploadDialog.dialogIsNotDisplayed();

        });

        it('[C277005] Role SiteCollaborator', async () => {

            await loginPage.loginToContentServicesUsingUserModel(collaboratorUser);

            await navigationBarPage.openContentServicesFolder(siteFolder.entry.id);

            await contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name);

            await contentList.doubleClickRow('Site' + fileModel.name);

            await viewerPage.checkFileIsLoaded();
            await viewerPage.clickCloseButton();

            await contentList.waitForTableBody();

            await contentServicesPage.checkDeleteIsDisabled('Site' + fileModel.name);

            await BrowserActions.closeMenuAndDialogs();

            await contentList.checkActionMenuIsNotDisplayed();

            await contentServicesPage.metadataContent('Site' + fileModel.name);

            await metadataViewPage.editIconIsDisplayed();
            await metadataViewPage.editIconClick();

            await metadataViewPage.editPropertyIconIsDisplayed('properties.cm:title');
            await metadataViewPage.clickEditPropertyIcons('properties.cm:title');

            await metadataViewPage.enterPropertyText('properties.cm:title', 'newTitle');
            await metadataViewPage.clickUpdatePropertyIcon('properties.cm:title');

            await expect(await metadataViewPage.getPropertyText('properties.cm:title')).toEqual('newTitle');
            await metadataViewPage.clickCloseButton();

            await contentServicesPage.uploadFile(pngFileModel.location);
            await contentServicesPage.checkContentIsDisplayed(pngFileModel.name);

            await uploadDialog.fileIsUploaded(pngFileModel.name);
            await uploadDialog.clickOnCloseButton();
            await uploadDialog.dialogIsNotDisplayed();
        });

        it('[C277006] Role SiteManager', async () => {
            await loginPage.loginToContentServicesUsingUserModel(managerUser);
            await navigationBarPage.openContentServicesFolder(siteFolder.entry.id);
            await contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name);

            await contentList.doubleClickRow('Site' + fileModel.name);

            await viewerPage.checkFileIsLoaded();
            await viewerPage.clickCloseButton();

            await contentList.waitForTableBody();
            await contentServicesPage.metadataContent('Site' + fileModel.name);

            await metadataViewPage.editIconIsDisplayed();

            await metadataViewPage.editIconClick();

            await metadataViewPage.editPropertyIconIsDisplayed('properties.cm:description');
            await metadataViewPage.clickEditPropertyIcons('properties.cm:description');
            await metadataViewPage.enterDescriptionText('newDescription');

            await metadataViewPage.clickUpdatePropertyIcon('properties.cm:description');

            await expect(await metadataViewPage.getPropertyText('properties.cm:description')).toEqual('newDescription');

            await metadataViewPage.clickCloseButton();
            await contentServicesPage.uploadFile(testFileModel.location);
            await contentServicesPage.checkContentIsDisplayed(testFileModel.name);

            await uploadDialog.fileIsUploaded(testFileModel.name);
            await uploadDialog.clickOnCloseButton();
            await uploadDialog.dialogIsNotDisplayed();

            await contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name);
            await contentServicesPage.deleteContent('Site' + fileModel.name);
            await contentServicesPage.checkContentIsNotDisplayed('Site' + fileModel.name);
        });

    });

});
