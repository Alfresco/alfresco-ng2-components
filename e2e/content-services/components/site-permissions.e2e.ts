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

import { PermissionsPage } from '../../content-services/pages/permissions.page';
import { createApiService,
    BrowserActions, Logger,
    LoginPage,
    NotificationHistoryPage, SearchService,
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
import { NodesApi, SitesApi } from '@alfresco/js-api';
import { NotificationDemoPage } from '../../core/pages/notification.page';

describe('Permissions Component', () => {

    const apiService = createApiService();
    const uploadActions = new UploadActions(apiService);
    const searchService = new SearchService(apiService);
    const nodesApi = new NodesApi(apiService.getInstance());

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const permissionsPage = new PermissionsPage();
    const viewerPage = new ViewerPage();
    const navigationBarPage = new NavigationBarPage();
    const metadataViewPage = new MetadataViewPage();
    const notificationHistoryPage = new NotificationHistoryPage();
    const notificationPage = new NotificationDemoPage();
    const uploadDialog = new UploadDialogPage();
    const versionManagePage = new VersionManagePage();

    const contentList = contentServicesPage.getDocumentList();

    let publicSite;
    let privateSite;
    let folderName;

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

    let siteFolder;
    let privateSiteFile;

    const folderOwnerUser = new UserModel();
    const consumerUser: UserModel = new UserModel();
    const siteConsumerUser: UserModel = new UserModel();
    const collaboratorUser: UserModel = new UserModel();
    const contributorUser: UserModel = new UserModel();
    const managerUser: UserModel = new UserModel();
    const usersActions = new UsersActions(apiService);

    beforeAll(async () => {
        try {
            await apiService.loginWithProfile('admin');
            await usersActions.createUser(folderOwnerUser);
            await usersActions.createUser(siteConsumerUser);
            await usersActions.createUser(consumerUser);
            await usersActions.createUser(contributorUser);
            await usersActions.createUser(collaboratorUser);
            await usersActions.createUser(managerUser);
            await apiService.login(folderOwnerUser.username, folderOwnerUser.password);

            const publicSiteName = `PUBLIC_TEST_SITE_${StringUtil.generateRandomString(5)}`;

            const privateSiteName = `PRIVATE_TEST_SITE_${StringUtil.generateRandomString(5)}`;

            folderName = `MEESEEKS_${StringUtil.generateRandomString(5)}`;

            const publicSiteBody = { visibility: 'PUBLIC', title: publicSiteName };
            const privateSiteBody = { visibility: 'PRIVATE', title: privateSiteName };

            const sitesApi = new SitesApi(apiService.getInstance());

            publicSite = await sitesApi.createSite(publicSiteBody);
            privateSite = await sitesApi.createSite(privateSiteBody);

            await sitesApi.createSiteMembership(publicSite.entry.id, {
                id: siteConsumerUser.username,
                role: CONSTANTS.CS_USER_ROLES.CONSUMER
            });

            await sitesApi.createSiteMembership(publicSite.entry.id, {
                id: collaboratorUser.username,
                role: CONSTANTS.CS_USER_ROLES.COLLABORATOR
            });

            await sitesApi.createSiteMembership(publicSite.entry.id, {
                id: contributorUser.username,
                role: CONSTANTS.CS_USER_ROLES.CONTRIBUTOR
            });

            await sitesApi.createSiteMembership(publicSite.entry.id, {
                id: managerUser.username,
                role: CONSTANTS.CS_USER_ROLES.MANAGER
            });

            await sitesApi.createSiteMembership(privateSite.entry.id, {
                id: managerUser.username,
                role: CONSTANTS.CS_USER_ROLES.MANAGER
            });

            siteFolder = await uploadActions.createFolder(folderName, publicSite.entry.guid);
            privateSiteFile = await uploadActions.uploadFile(fileModel.location, 'privateSite' + fileModel.name, privateSite.entry.guid);

            await nodesApi.updateNode(privateSiteFile.entry.id,
                {
                    permissions: {
                        locallySet: [{
                            authorityId: managerUser.username,
                            name: 'SiteConsumer',
                            accessStatus: 'ALLOWED'
                        }]
                    }
                });

            await uploadActions.uploadFile(fileModel.location, 'Site' + fileModel.name, siteFolder.entry.id);

            // to sync user in acs
            try {
                await searchService.isUserSearchable(consumerUser);
            } catch (e) {
                Logger.error(`*****\n Failed to sync user \n*****`);
            }
            await browser.sleep(browser.params.testConfig.timeouts.index_search);
        } catch (error) {
            fail('Failed to setup site permission : ' + JSON.stringify(error, null, 2));
        }
    });

    afterAll(async () => {
        await apiService.loginWithProfile('admin');

        const sitesApi = new SitesApi(apiService.getInstance());
        await sitesApi.deleteSite(publicSite.entry.id, { permanent: true });
        await sitesApi.deleteSite(privateSite.entry.id, { permanent: true });
    });

    describe('Role Site Dropdown', () => {

        beforeAll(async () => {
            await loginPage.login(folderOwnerUser.username, folderOwnerUser.password);

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

            await permissionsPage.checkPermissionManagerDisplayed();
            await permissionsPage.addPermissionButton.waitVisible();

            await permissionsPage.addPermissionsDialog.clickAddPermissionButton();
            await permissionsPage.addPermissionsDialog.checkAddPermissionDialogIsDisplayed();
            await permissionsPage.addPermissionsDialog.checkSearchUserInputIsDisplayed();

            await permissionsPage.addPermissionsDialog.searchUserOrGroup(consumerUser.username);
            await permissionsPage.addPermissionsDialog.checkResultListIsDisplayed();

            await permissionsPage.addPermissionsDialog.clickUserOrGroup(consumerUser.firstName);
            await permissionsPage.addPermissionsDialog.selectRole(consumerUser.fullName, 'Site Collaborator');
            await expect(await permissionsPage.addPermissionsDialog.getRoleCellValue(consumerUser.fullName)).toEqual('Site Collaborator');
            await expect(await permissionsPage.addPermissionsDialog.addButtonIsEnabled()).toBe(true, 'Add button should be enabled');
            await permissionsPage.addPermissionsDialog.clickAddButton();
            await expect(await notificationPage.snackbarPage.getSnackBarMessage()).toEqual('Added 1 user(s) 0 group(s)');
            await notificationPage.snackbarPage.waitForSnackBarToClose();

            await permissionsPage.checkUserIsAdded(consumerUser.username);

            await expect(await permissionsPage.getRoleCellValue(consumerUser.username)).toEqual(CONSTANTS.CS_USER_ROLES_I18N.COLLABORATOR);

            await permissionsPage.clickRoleDropdownByUserOrGroupName(consumerUser.username);

            const roleDropdownOptions = permissionsPage.addPermissionsDialog.getRoleDropdownOptions();

            await expect(await roleDropdownOptions.count()).toBe(4);
            await expect(await BrowserActions.getText(roleDropdownOptions.get(0))).toBe(CONSTANTS.CS_USER_ROLES_I18N.COLLABORATOR);
            await expect(await BrowserActions.getText(roleDropdownOptions.get(1))).toBe(CONSTANTS.CS_USER_ROLES_I18N.CONSUMER);
            await expect(await BrowserActions.getText(roleDropdownOptions.get(2))).toBe(CONSTANTS.CS_USER_ROLES_I18N.CONTRIBUTOR);
            await expect(await BrowserActions.getText(roleDropdownOptions.get(3))).toBe(CONSTANTS.CS_USER_ROLES_I18N.MANAGER);
        });
    });

    describe('Roles: SiteConsumer, SiteCollaborator, SiteContributor, SiteManager', () => {

        afterEach(async () => {
            await navigationBarPage.clickLogoutButton();
        });

        it('[C276994] Role SiteConsumer', async () => {
            await loginPage.login(siteConsumerUser.username, siteConsumerUser.password);

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
            await loginPage.login(contributorUser.username, contributorUser.password);

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
            await loginPage.login(collaboratorUser.username, collaboratorUser.password);

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
            await loginPage.login(managerUser.username, managerUser.password);

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
            await loginPage.login(managerUser.username, managerUser.password);

            await navigationBarPage.openContentServicesFolder(privateSite.entry.guid);

            await contentServicesPage.versionManagerContent('privateSite' + fileModel.name);
            await versionManagePage.showNewVersionButton.click();
            await versionManagePage.uploadNewVersionFile(newVersionFile.location);

            await versionManagePage.checkFileVersionExist('1.1');
            await expect(await versionManagePage.getFileVersionName('1.1')).toEqual(newVersionFile.name);
        });
    });
});
