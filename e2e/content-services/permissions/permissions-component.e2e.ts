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
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import resources = require('../../util/resources');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { FileModel } from '../../models/ACS/fileModel';
import { StringUtil, BrowserActions, NotificationHistoryPage, LoginPage, UploadActions } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { FolderModel } from '../../models/ACS/folderModel';
import { ViewerPage } from '../../pages/adf/viewerPage';
import { MetadataViewPage } from '../../pages/adf/metadataViewPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { UploadDialog } from '../../pages/adf/dialog/uploadDialog';

describe('Permissions Component', () => {

    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });
    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const permissionsPage = new PermissionsPage();
    const navigationBarPage = new NavigationBarPage();
    const uploadActions = new UploadActions(this.alfrescoJsApi);

    const contentList = contentServicesPage.getDocumentList();
    const viewerPage = new ViewerPage();
    const metadataViewPage = new MetadataViewPage();
    const notificationHistoryPage = new NotificationHistoryPage();
    const uploadDialog = new UploadDialog();
    let fileOwnerUser, filePermissionUser, file;
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

    const groupBody = {
        id: StringUtil.generateRandomString(),
        displayName: StringUtil.generateRandomString()
    };

    const roleConsumerFolderModel = new FolderModel({ name: 'roleConsumer' + StringUtil.generateRandomString() });
    const roleCoordinatorFolderModel = new FolderModel({ name: 'roleCoordinator' + StringUtil.generateRandomString() });
    const roleCollaboratorFolderModel = new FolderModel({ name: 'roleCollaborator' + StringUtil.generateRandomString() });
    const roleContributorFolderModel = new FolderModel({ name: 'roleContributor' + StringUtil.generateRandomString() });
    const roleEditorFolderModel = new FolderModel({ name: 'roleEditor' + StringUtil.generateRandomString() });

    let roleConsumerFolder, roleCoordinatorFolder, roleContributorFolder, roleCollaboratorFolder, roleEditorFolder;
    let folders;
    fileOwnerUser = new AcsUserModel();

    filePermissionUser = new AcsUserModel();

    const duplicateUserPermissionMessage = 'One or more of the permissions you have set is already present : authority -> ' + filePermissionUser.getId() + ' / role -> Contributor';

    beforeAll(async () => {

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(fileOwnerUser);
        await this.alfrescoJsApi.core.peopleApi.addPerson(filePermissionUser);
        await this.alfrescoJsApi.core.groupsApi.createGroup(groupBody);
        await this.alfrescoJsApi.login(fileOwnerUser.id, fileOwnerUser.password);

        roleConsumerFolder = await uploadActions.createFolder(roleConsumerFolderModel.name, '-my-');
        roleCoordinatorFolder = await uploadActions.createFolder(roleCoordinatorFolderModel.name, '-my-');
        roleContributorFolder = await uploadActions.createFolder(roleContributorFolderModel.name, '-my-');
        roleCollaboratorFolder = await uploadActions.createFolder(roleCollaboratorFolderModel.name, '-my-');
        roleEditorFolder = await uploadActions.createFolder(roleEditorFolderModel.name, '-my-');

        folders = [roleConsumerFolder, roleContributorFolder, roleCoordinatorFolder, roleCollaboratorFolder, roleEditorFolder];

        await this.alfrescoJsApi.core.nodesApi.updateNode(roleConsumerFolder.entry.id,

            {
                permissions: {
                    locallySet: [{
                        authorityId: filePermissionUser.getId(),
                        name: 'Consumer',
                        accessStatus: 'ALLOWED'
                    }]
                }
            });

        await this.alfrescoJsApi.core.nodesApi.updateNode(roleCollaboratorFolder.entry.id,
            {
                permissions: {
                    locallySet: [{
                        authorityId: filePermissionUser.getId(),
                        name: 'Collaborator',
                        accessStatus: 'ALLOWED'
                    }]
                }
            });

        await this.alfrescoJsApi.core.nodesApi.updateNode(roleCoordinatorFolder.entry.id,
            {
                permissions: {
                    locallySet: [{
                        authorityId: filePermissionUser.getId(),
                        name: 'Coordinator',
                        accessStatus: 'ALLOWED'
                    }]
                }
            });

        await this.alfrescoJsApi.core.nodesApi.updateNode(roleContributorFolder.entry.id,

            {
                permissions: {
                    locallySet: [{
                        authorityId: filePermissionUser.getId(),
                        name: 'Contributor',
                        accessStatus: 'ALLOWED'
                    }]
                }
            });

        await this.alfrescoJsApi.core.nodesApi.updateNode(roleEditorFolder.entry.id,

            {
                permissions: {
                    locallySet: [{
                        authorityId: filePermissionUser.getId(),
                        name: 'Editor',
                        accessStatus: 'ALLOWED'
                    }]
                }
            });

        await uploadActions.uploadFile(fileModel.location, 'RoleConsumer' + fileModel.name, roleConsumerFolder.entry.id);
        await uploadActions.uploadFile(fileModel.location, 'RoleContributor' + fileModel.name, roleContributorFolder.entry.id);
        await uploadActions.uploadFile(fileModel.location, 'RoleCoordinator' + fileModel.name, roleCoordinatorFolder.entry.id);
        await uploadActions.uploadFile(fileModel.location, 'RoleCollaborator' + fileModel.name, roleCollaboratorFolder.entry.id);
        await uploadActions.uploadFile(fileModel.location, 'RoleEditor' + fileModel.name, roleEditorFolder.entry.id);

    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        for (const folder of folders) {
            await uploadActions.deleteFileOrFolder(folder.entry.id);
        }

    });

    describe('Inherit and assigning permissions', () => {

        beforeEach(async () => {
            await this.alfrescoJsApi.login(fileOwnerUser.id, fileOwnerUser.password);
            file = await uploadActions.uploadFile(fileModel.location, fileModel.name, '-my-');
            await loginPage.loginToContentServicesUsingUserModel(fileOwnerUser);
            await contentServicesPage.goToDocumentList();
            await contentServicesPage.checkContentIsDisplayed(fileModel.name);
            await contentServicesPage.checkSelectedSiteIsDisplayed('My files');
            await contentList.rightClickOnRow(fileModel.name);
            await contentServicesPage.pressContextMenuActionNamed('Permission');
            await permissionsPage.checkPermissionContainerIsDisplayed();

        });

        afterEach(async () => {
            await BrowserActions.closeMenuAndDialogs();
            try {
                await uploadActions.deleteFileOrFolder(file.entry.id);
            } catch (error) {
            }

        });

        it('[C268974] Inherit Permission', async () => {
            await permissionsPage.checkPermissionInheritedButtonIsDisplayed();
            await expect(await permissionsPage.getPermissionInheritedButtonText()).toBe('Permission Inherited');
            await permissionsPage.checkPermissionsDatatableIsDisplayed();
            await permissionsPage.clickPermissionInheritedButton();
            await expect(await permissionsPage.getPermissionInheritedButtonText()).toBe('Inherit Permission');
            await permissionsPage.checkNoPermissionsIsDisplayed();
            await permissionsPage.clickPermissionInheritedButton();
            await expect(await permissionsPage.getPermissionInheritedButtonText()).toBe('Permission Inherited');
            await permissionsPage.checkPermissionsDatatableIsDisplayed();
        });

        it('[C286272] Should be able to see results when searching for a user', async () => {
            await permissionsPage.checkAddPermissionButtonIsDisplayed();
            await permissionsPage.clickAddPermissionButton();
            await permissionsPage.checkAddPermissionDialogIsDisplayed();
            await permissionsPage.checkSearchUserInputIsDisplayed();
            await permissionsPage.searchUserOrGroup('a');
            await permissionsPage.checkResultListIsDisplayed();
        });

        it('[C276979] Should be able to give permissions to a group of people', async () => {
            await permissionsPage.checkAddPermissionButtonIsDisplayed();
            await permissionsPage.clickAddPermissionButton();
            await permissionsPage.checkAddPermissionDialogIsDisplayed();
            await permissionsPage.checkSearchUserInputIsDisplayed();
            await permissionsPage.searchUserOrGroup('GROUP_' + groupBody.id);
            await permissionsPage.clickUserOrGroup('GROUP_' + groupBody.id);
            await permissionsPage.checkUserOrGroupIsAdded('GROUP_' + groupBody.id);
        });

        it('[C277100] Should display EVERYONE group in the search result set', async () => {
            await permissionsPage.checkAddPermissionButtonIsDisplayed();
            await permissionsPage.clickAddPermissionButton();
            await permissionsPage.checkAddPermissionDialogIsDisplayed();
            await permissionsPage.checkSearchUserInputIsDisplayed();
            await permissionsPage.searchUserOrGroup(filePermissionUser.getId());
            await permissionsPage.checkResultListIsDisplayed();
            await permissionsPage.checkUserOrGroupIsDisplayed('EVERYONE');
            await permissionsPage.searchUserOrGroup('somerandomtext');
            await permissionsPage.checkResultListIsDisplayed();
            await permissionsPage.checkUserOrGroupIsDisplayed('EVERYONE');
        });

    });

    describe('Changing and duplicate Permissions', () => {

        beforeEach(async () => {
            await this.alfrescoJsApi.login(fileOwnerUser.id, fileOwnerUser.password);
            file = await uploadActions.uploadFile(fileModel.location, fileModel.name, '-my-');
            await loginPage.loginToContentServicesUsingUserModel(fileOwnerUser);
            await contentServicesPage.goToDocumentList();
            await contentServicesPage.checkContentIsDisplayed(fileModel.name);
            await contentServicesPage.checkSelectedSiteIsDisplayed('My files');
            await contentList.rightClickOnRow(fileModel.name);
            await contentServicesPage.pressContextMenuActionNamed('Permission');
            await permissionsPage.checkAddPermissionButtonIsDisplayed();
            await permissionsPage.clickAddPermissionButton();
            await permissionsPage.checkAddPermissionDialogIsDisplayed();
            await permissionsPage.checkSearchUserInputIsDisplayed();
            await permissionsPage.searchUserOrGroup(filePermissionUser.getId());
            await permissionsPage.clickUserOrGroup(filePermissionUser.getFirstName());
            await permissionsPage.checkUserOrGroupIsAdded(filePermissionUser.getId());
        });

        afterEach(async () => {
            await uploadActions.deleteFileOrFolder(file.entry.id);
        });

        it('[C274691] Should be able to add a new User with permission to the file and also change locally set permissions', async () => {
            await expect(await permissionsPage.getRoleCellValue(filePermissionUser.getId())).toEqual('Contributor');
            await permissionsPage.clickRoleDropdownByUserOrGroupName(filePermissionUser.getId());
            const roleDropdownOptions = permissionsPage.getRoleDropdownOptions();
            await expect(await roleDropdownOptions.count()).toBe(5);
            await expect(await BrowserActions.getText(roleDropdownOptions.get(0))).toBe('Contributor');
            await expect(await BrowserActions.getText(roleDropdownOptions.get(1))).toBe('Collaborator');
            await expect(await BrowserActions.getText(roleDropdownOptions.get(2))).toBe('Coordinator');
            await expect(await BrowserActions.getText(roleDropdownOptions.get(3))).toBe('Editor');
            await expect(await BrowserActions.getText(roleDropdownOptions.get(4))).toBe('Consumer');
            await permissionsPage.selectOption('Collaborator');
            await expect(await permissionsPage.getRoleCellValue(filePermissionUser.getId())).toEqual('Collaborator');
            await permissionsPage.clickRoleDropdownByUserOrGroupName(filePermissionUser.getId());
            await permissionsPage.selectOption('Coordinator');
            await expect(await permissionsPage.getRoleCellValue(filePermissionUser.getId())).toEqual('Coordinator');
            await permissionsPage.clickRoleDropdownByUserOrGroupName(filePermissionUser.getId());
            await permissionsPage.selectOption('Editor');
            await expect(await permissionsPage.getRoleCellValue(filePermissionUser.getId())).toEqual('Editor');
            await permissionsPage.clickRoleDropdownByUserOrGroupName(filePermissionUser.getId());
            await permissionsPage.selectOption('Consumer');
            await expect(await permissionsPage.getRoleCellValue(filePermissionUser.getId())).toEqual('Consumer');
        });

        it('[C276980] Should not be able to duplicate User or Group to the locally set permissions', async () => {
            await expect(await permissionsPage.getRoleCellValue(filePermissionUser.getId())).toEqual('Contributor');
            await permissionsPage.clickAddPermissionButton();
            await permissionsPage.checkAddPermissionDialogIsDisplayed();
            await permissionsPage.checkSearchUserInputIsDisplayed();
            await permissionsPage.searchUserOrGroup(filePermissionUser.getId());
            await permissionsPage.clickUserOrGroup(filePermissionUser.getFirstName());

            await notificationHistoryPage.checkNotifyContains(duplicateUserPermissionMessage);
        });

        it('[C276982] Should be able to remove User or Group from the locally set permissions', async () => {
            await expect(await permissionsPage.getRoleCellValue(filePermissionUser.getId())).toEqual('Contributor');
            await permissionsPage.clickDeletePermissionButton();
            await permissionsPage.checkUserOrGroupIsDeleted(filePermissionUser.getId());
        });

    });

    describe('Role: Consumer, Contributor, Coordinator, Collaborator, Editor, No Permissions', () => {

        it('[C276993] Role Consumer', async () => {
            await loginPage.loginToContentServicesUsingUserModel(filePermissionUser);
            await navigationBarPage.openContentServicesFolder(roleConsumerFolder.entry.id);
            await contentServicesPage.checkContentIsDisplayed('RoleConsumer' + fileModel.name);
            await contentList.doubleClickRow('RoleConsumer' + fileModel.name);
            await viewerPage.checkFileIsLoaded();
            await viewerPage.clickCloseButton();
            await contentList.waitForTableBody();
            await contentServicesPage.checkDeleteIsDisabled('RoleConsumer' + fileModel.name);
            await BrowserActions.closeMenuAndDialogs();
            await contentList.checkActionMenuIsNotDisplayed();
            await contentServicesPage.metadataContent('RoleConsumer' + fileModel.name);
            await notificationHistoryPage.checkNotifyContains('You don\'t have access to do this.');
            await contentServicesPage.uploadFile(fileModel.location);
            await notificationHistoryPage.checkNotifyContains('You don\'t have the create permission to upload the content');
        });

        it('[C276996] Role Contributor', async () => {
            await loginPage.loginToContentServicesUsingUserModel(filePermissionUser);
            await navigationBarPage.openContentServicesFolder(roleContributorFolder.entry.id);
            await contentServicesPage.checkContentIsDisplayed('RoleContributor' + fileModel.name);
            await contentList.doubleClickRow('RoleContributor' + fileModel.name);
            await viewerPage.checkFileIsLoaded();
            await viewerPage.clickCloseButton();
            await contentList.waitForTableBody();
            await contentServicesPage.checkDeleteIsDisabled('RoleContributor' + fileModel.name);
            await BrowserActions.closeMenuAndDialogs();
            await contentList.checkActionMenuIsNotDisplayed();
            await contentServicesPage.metadataContent('RoleContributor' + fileModel.name);
            await notificationHistoryPage.checkNotifyContains('You don\'t have access to do this.');
            await contentServicesPage.uploadFile(testFileModel.location);
            await contentServicesPage.checkContentIsDisplayed(testFileModel.name);
            await uploadDialog.fileIsUploaded(testFileModel.name);
            await uploadDialog.clickOnCloseButton();
            await uploadDialog.dialogIsNotDisplayed();
        });

        it('[C277000] Role Editor', async () => {
            await loginPage.loginToContentServicesUsingUserModel(filePermissionUser);
            await navigationBarPage.openContentServicesFolder(roleEditorFolder.entry.id);
            await contentServicesPage.checkContentIsDisplayed('RoleEditor' + fileModel.name);
            await contentList.doubleClickRow('RoleEditor' + fileModel.name);
            await viewerPage.checkFileIsLoaded();
            await viewerPage.clickCloseButton();
            await contentList.waitForTableBody();
            await contentServicesPage.checkDeleteIsDisabled('RoleEditor' + fileModel.name);
            await BrowserActions.closeMenuAndDialogs();
            await contentList.checkActionMenuIsNotDisplayed();
            await contentServicesPage.metadataContent('RoleEditor' + fileModel.name);
            await metadataViewPage.editIconIsDisplayed();
            await metadataViewPage.editIconClick();
            await metadataViewPage.editPropertyIconIsDisplayed('properties.cm:title');
            await metadataViewPage.clickEditPropertyIcons('properties.cm:title');
            await metadataViewPage.enterPropertyText('properties.cm:title', 'newTitle1');
            await metadataViewPage.clickUpdatePropertyIcon('properties.cm:title');
            await expect(await metadataViewPage.getPropertyText('properties.cm:title')).toEqual('newTitle1');
            await metadataViewPage.clickCloseButton();
            await contentServicesPage.uploadFile(fileModel.location);
            await notificationHistoryPage.checkNotifyContains('You don\'t have the create permission to upload the content');
        });

        it('[C277003] Role Collaborator', async () => {
            await loginPage.loginToContentServicesUsingUserModel(filePermissionUser);
            await navigationBarPage.openContentServicesFolder(roleCollaboratorFolder.entry.id);
            await contentServicesPage.checkContentIsDisplayed('RoleCollaborator' + fileModel.name);
            await contentList.doubleClickRow('RoleCollaborator' + fileModel.name);
            await viewerPage.checkFileIsLoaded();
            await viewerPage.clickCloseButton();
            await contentList.waitForTableBody();
            await contentServicesPage.checkDeleteIsDisabled('RoleCollaborator' + fileModel.name);
            await BrowserActions.closeMenuAndDialogs();
            await contentList.checkActionMenuIsNotDisplayed();
            await contentServicesPage.metadataContent('RoleCollaborator' + fileModel.name);
            await metadataViewPage.editIconIsDisplayed();
            await metadataViewPage.editIconClick();
            await metadataViewPage.editPropertyIconIsDisplayed('properties.cm:title');
            await metadataViewPage.clickEditPropertyIcons('properties.cm:title');
            await metadataViewPage.enterPropertyText('properties.cm:title', 'newTitle2');
            await metadataViewPage.clickUpdatePropertyIcon('properties.cm:title');
            await expect(await metadataViewPage.getPropertyText('properties.cm:title')).toEqual('newTitle2');
            await metadataViewPage.clickCloseButton();
            await contentServicesPage.uploadFile(testFileModel.location);
            await contentServicesPage.checkContentIsDisplayed(testFileModel.name);
            await uploadDialog.fileIsUploaded(testFileModel.name);
            await uploadDialog.clickOnCloseButton();
            await uploadDialog.dialogIsNotDisplayed();
        });

        it('[C277004] Role Coordinator', async () => {
            await loginPage.loginToContentServicesUsingUserModel(filePermissionUser);
            await navigationBarPage.openContentServicesFolder(roleCoordinatorFolder.entry.id);
            await contentServicesPage.checkContentIsDisplayed('RoleCoordinator' + fileModel.name);
            await contentList.doubleClickRow('RoleCoordinator' + fileModel.name);
            await viewerPage.checkFileIsLoaded();
            await viewerPage.clickCloseButton();
            await contentList.waitForTableBody();
            await contentServicesPage.metadataContent('RoleCoordinator' + fileModel.name);
            await metadataViewPage.editIconIsDisplayed();
            await metadataViewPage.editIconClick();
            await metadataViewPage.editPropertyIconIsDisplayed('properties.cm:title');
            await metadataViewPage.clickEditPropertyIcons('properties.cm:title');
            await metadataViewPage.enterPropertyText('properties.cm:title', 'newTitle3');
            await metadataViewPage.clickUpdatePropertyIcon('properties.cm:title');
            await expect(await metadataViewPage.getPropertyText('properties.cm:title')).toEqual('newTitle3');
            await metadataViewPage.clickCloseButton();
            await contentServicesPage.uploadFile(pngFileModel.location);
            await contentServicesPage.checkContentIsDisplayed(pngFileModel.name);
            await uploadDialog.fileIsUploaded(pngFileModel.name);
            await uploadDialog.clickOnCloseButton();
            await uploadDialog.dialogIsNotDisplayed();
            await contentServicesPage.checkContentIsDisplayed('RoleCoordinator' + fileModel.name);
            await contentServicesPage.deleteContent('RoleCoordinator' + fileModel.name);
            await contentServicesPage.checkContentIsNotDisplayed('RoleCoordinator' + fileModel.name);
        });

        it('[C279881] No Permission User', async () => {
            await loginPage.loginToContentServicesUsingUserModel(filePermissionUser);
            await navigationBarPage.openContentServicesFolder(roleConsumerFolder.entry.id);
            await contentServicesPage.checkContentIsDisplayed('RoleConsumer' + fileModel.name);
            await contentServicesPage.checkSelectedSiteIsDisplayed('My files');
            await contentList.rightClickOnRow('RoleConsumer' + fileModel.name);
            await contentServicesPage.pressContextMenuActionNamed('Permission');
            await permissionsPage.checkPermissionInheritedButtonIsDisplayed();
            await permissionsPage.checkAddPermissionButtonIsDisplayed();
            await permissionsPage.clickPermissionInheritedButton();
            await notificationHistoryPage.checkNotifyContains('You are not allowed to change permissions');
            await permissionsPage.clickAddPermissionButton();
            await notificationHistoryPage.checkNotifyContains('You are not allowed to change permissions');
        });

    });

});
