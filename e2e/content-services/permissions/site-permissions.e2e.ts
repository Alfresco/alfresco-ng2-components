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

import { PermissionsPage } from '../../content-services/pages/permissions.page';
import {
    ApiService,
    BrowserActions,
    LoginPage,
    NotificationHistoryPage,
    StringUtil,
    UploadActions,
    UserModel,
    UsersActions,
    ViewerPage
} from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../core/pages/content-services.page';
import { FileModel } from '../../models/ACS/file.model';
import { browser } from 'protractor';
import { MetadataViewPage } from '../../core/pages/metadata-view.page';
import { UploadDialogPage } from '../../core/pages/dialog/upload-dialog.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { VersionManagePage } from '../../core/pages/version-manager.page';
import CONSTANTS = require('../../util/constants');

describe('Permissions Component', () => {

    const apiService = new ApiService();
    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const permissionsPage = new PermissionsPage();
    const uploadActions = new UploadActions(apiService);

    const contentList = contentServicesPage.getDocumentList();

    const viewerPage = new ViewerPage();
    const navigationBarPage = new NavigationBarPage();
    const metadataViewPage = new MetadataViewPage();
    const notificationHistoryPage = new NotificationHistoryPage();
    const uploadDialog = new UploadDialogPage();
    const versionManagePage = new VersionManagePage();

    let publicSite, privateSite, folderName;

    const fileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.TXT_0B.file_path
    });

    const testFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.TEST.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.TEST.file_location
    });

    const pngFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    const newVersionFile = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG_B.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG_B.file_location
    });

    let siteFolder, privateSiteFile;

    const folderOwnerUser = new UserModel();
    const consumerUser: UserModel = new UserModel();
    const siteConsumerUser: UserModel = new UserModel();
    const collaboratorUser: UserModel = new UserModel();
    const contributorUser: UserModel = new UserModel();
    const managerUser: UserModel = new UserModel();
    const usersActions = new UsersActions(apiService);

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');
        await usersActions.createUser(folderOwnerUser);
        await usersActions.createUser(siteConsumerUser);
        await usersActions.createUser(consumerUser);
        await usersActions.createUser(contributorUser);
        await usersActions.createUser(collaboratorUser);
        await usersActions.createUser(managerUser);
        await apiService.login(folderOwnerUser.email, folderOwnerUser.password);

        await browser.sleep(15000);

        const publicSiteName = `PUBLIC_TEST_SITE_${StringUtil.generateRandomString(5)}`;

        const privateSiteName = `PRIVATE_TEST_SITE_${StringUtil.generateRandomString(5)}`;

        folderName = `MEESEEKS_${StringUtil.generateRandomString(5)}`;

        const publicSiteBody = { visibility: 'PUBLIC', title: publicSiteName };

        const privateSiteBody = { visibility: 'PRIVATE', title: privateSiteName };

        publicSite = await apiService.getInstance().core.sitesApi.createSite(publicSiteBody);
        privateSite = await apiService.getInstance().core.sitesApi.createSite(privateSiteBody);

        await apiService.getInstance().core.sitesApi.addSiteMember(publicSite.entry.id, {
            id: siteConsumerUser.username,
            role: CONSTANTS.CS_USER_ROLES.CONSUMER
        });

        await apiService.getInstance().core.sitesApi.addSiteMember(publicSite.entry.id, {
            id: collaboratorUser.username,
            role: CONSTANTS.CS_USER_ROLES.COLLABORATOR
        });

        await apiService.getInstance().core.sitesApi.addSiteMember(publicSite.entry.id, {
            id: contributorUser.username,
            role: CONSTANTS.CS_USER_ROLES.CONTRIBUTOR
        });

        await apiService.getInstance().core.sitesApi.addSiteMember(publicSite.entry.id, {
            id: managerUser.username,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });

        await apiService.getInstance().core.sitesApi.addSiteMember(privateSite.entry.id, {
            id: managerUser.username,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });

        siteFolder = await uploadActions.createFolder(folderName, publicSite.entry.guid);
        privateSiteFile = await uploadActions.uploadFile(fileModel.location, 'privateSite' + fileModel.name, privateSite.entry.guid);

        await apiService.getInstance().core.nodesApi.updateNode(privateSiteFile.entry.id,
            {
                permissions: {
                    locallySet: [{
                        authorityId: managerUser.email,
                        name: 'SiteConsumer',
                        accessStatus: 'ALLOWED'
                    }]
                }
            });

        await uploadActions.uploadFile(fileModel.location, 'Site' + fileModel.name, siteFolder.entry.id);
    });

    afterAll(async () => {
        await apiService.loginWithProfile('admin');
        await apiService.getInstance().core.sitesApi.deleteSite(publicSite.entry.id, { permanent: true });
        await apiService.getInstance().core.sitesApi.deleteSite(privateSite.entry.id, { permanent: true });
    });

    describe('Role Site Dropdown', () => {

        beforeAll(async () => {
            await loginPage.login(folderOwnerUser.email, folderOwnerUser.password);

            await BrowserActions.getUrl(browser.baseUrl + '/files/' + publicSite.entry.guid);
            await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();
        });

        afterAll(async () => {
            await navigationBarPage.clickLogoutButton();
        });

        it('[C277002] Should display the Role Site dropdown', async () => {
            await contentServicesPage.checkContentIsDisplayed(folderName);

            await contentList.rightClickOnRow(folderName);

            await contentServicesPage.pressContextMenuActionNamed('Permission');

            await permissionsPage.addPermissionsDialog.checkPermissionInheritedButtonIsDisplayed();
            await permissionsPage.checkAddPermissionButtonIsDisplayed();

            await browser.sleep(5000);

            await permissionsPage.addPermissionsDialog.clickAddPermissionButton();
            await permissionsPage.addPermissionsDialog.checkAddPermissionDialogIsDisplayed();
            await permissionsPage.addPermissionsDialog.checkSearchUserInputIsDisplayed();

            await permissionsPage.addPermissionsDialog.searchUserOrGroup(consumerUser.email);

            await permissionsPage.addPermissionsDialog.clickUserOrGroup(consumerUser.firstName);
            await permissionsPage.addPermissionsDialog.checkUserIsAdded(consumerUser.email);

            await expect(await permissionsPage.addPermissionsDialog.getRoleCellValue(consumerUser.email)).toEqual('SiteCollaborator');

            await permissionsPage.addPermissionsDialog.clickRoleDropdownByUserOrGroupName(consumerUser.email);

            const roleDropdownOptions = permissionsPage.addPermissionsDialog.getRoleDropdownOptions();

            await expect(await roleDropdownOptions.count()).toBe(4);
            await expect(await BrowserActions.getText(roleDropdownOptions.get(0))).toBe(CONSTANTS.CS_USER_ROLES.COLLABORATOR);
            await expect(await BrowserActions.getText(roleDropdownOptions.get(1))).toBe(CONSTANTS.CS_USER_ROLES.CONSUMER);
            await expect(await BrowserActions.getText(roleDropdownOptions.get(2))).toBe(CONSTANTS.CS_USER_ROLES.CONTRIBUTOR);
            await expect(await BrowserActions.getText(roleDropdownOptions.get(3))).toBe(CONSTANTS.CS_USER_ROLES.MANAGER);
        });
    });

    describe('Roles: SiteConsumer, SiteCollaborator, SiteContributor, SiteManager', () => {

        afterEach(async () => {
            await navigationBarPage.clickLogoutButton();
        });

        it('[C276994] Role SiteConsumer', async () => {
            await loginPage.login(siteConsumerUser.email, siteConsumerUser.password);

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

            await notificationHistoryPage.checkNotifyContains('You don\'t have the create permission to upload the content');
        });

        it('[C276997] Role SiteContributor', async () => {
            await loginPage.login(contributorUser.email, contributorUser.password);

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
            await loginPage.login(collaboratorUser.email, collaboratorUser.password);

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

            await metadataViewPage.enterPropertyText('properties.cm:title', 'newTitle');

            await expect(await metadataViewPage.getPropertyText('properties.cm:title')).toEqual('newTitle');
            await metadataViewPage.clickCloseButton();

            await contentServicesPage.uploadFile(pngFileModel.location);
            await contentServicesPage.checkContentIsDisplayed(pngFileModel.name);

            await uploadDialog.fileIsUploaded(pngFileModel.name);
            await uploadDialog.clickOnCloseButton();
            await uploadDialog.dialogIsNotDisplayed();
        });

        it('[C277006] Role SiteManager', async () => {
            await loginPage.login(managerUser.email, managerUser.password);

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
            await metadataViewPage.enterDescriptionText('newDescription');
            await metadataViewPage.clickSaveMetadata();

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

    describe('Roles: Private site and Manager User', () => {

        afterEach(async () => {
            await navigationBarPage.clickLogoutButton();
        });

        it('[C277196] should a user with Manager permissions be able to upload a new version for the created file', async () => {
            await loginPage.login(managerUser.email, managerUser.password);

            await navigationBarPage.openContentServicesFolder(privateSite.entry.guid);

            await contentServicesPage.versionManagerContent('privateSite' + fileModel.name);
            await BrowserActions.click(versionManagePage.showNewVersionButton);
            await versionManagePage.uploadNewVersionFile(newVersionFile.location);

            await versionManagePage.checkFileVersionExist('1.1');
            await expect(await versionManagePage.getFileVersionName('1.1')).toEqual(newVersionFile.name);
        });
    });
});
