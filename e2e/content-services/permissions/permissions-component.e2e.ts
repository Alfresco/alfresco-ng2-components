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
import { LoginPage } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import TestConfig = require('../../test.config');
import resources = require('../../util/resources');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { FileModel } from '../../models/ACS/fileModel';
import { UploadActions } from '../../actions/ACS/upload.actions';
import { StringUtil, BrowserActions } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { FolderModel } from '../../models/ACS/folderModel';
import { ViewerPage } from '../../pages/adf/viewerPage';
import { NotificationPage } from '../../pages/adf/notificationPage';
import { MetadataViewPage } from '../../pages/adf/metadataViewPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { UploadDialog } from '../../pages/adf/dialog/uploadDialog';

describe('Permissions Component', function () {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const permissionsPage = new PermissionsPage();
    const navigationBarPage = new NavigationBarPage();
    const uploadActions = new UploadActions();

    const contentList = contentServicesPage.getDocumentList();

    const viewerPage = new ViewerPage();
    const metadataViewPage = new MetadataViewPage();
    const notificationPage = new NotificationPage();
    const uploadDialog = new UploadDialog();
    let fileOwnerUser, filePermissionUser, file;
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

    const groupBody = {
        id: StringUtil.generateRandomString(),
        displayName: StringUtil.generateRandomString()
    };

    const alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: TestConfig.adf.url
    });

    const roleConsumerFolderModel = new FolderModel({ 'name': 'roleConsumer' + StringUtil.generateRandomString() });
    const roleCoordinatorFolderModel = new FolderModel({ 'name': 'roleCoordinator' + StringUtil.generateRandomString() });
    const roleCollaboratorFolderModel = new FolderModel({ 'name': 'roleCollaborator' + StringUtil.generateRandomString() });
    const roleContributorFolderModel = new FolderModel({ 'name': 'roleContributor' + StringUtil.generateRandomString() });
    const roleEditorFolderModel = new FolderModel({ 'name': 'roleEditor' + StringUtil.generateRandomString() });

    let roleConsumerFolder, roleCoordinatorFolder, roleContributorFolder, roleCollaboratorFolder, roleEditorFolder;
    let folders;
    fileOwnerUser = new AcsUserModel();

    filePermissionUser = new AcsUserModel();

    const duplicateUserPermissionMessage = 'One or more of the permissions you have set is already present : authority -> ' + filePermissionUser.getId() + ' / role -> Contributor';

    beforeAll(async (done) => {

        await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await alfrescoJsApi.core.peopleApi.addPerson(fileOwnerUser);
        await alfrescoJsApi.core.peopleApi.addPerson(filePermissionUser);
        await alfrescoJsApi.core.groupsApi.createGroup(groupBody);

        await alfrescoJsApi.login(fileOwnerUser.id, fileOwnerUser.password);

        roleConsumerFolder = await uploadActions.createFolder(alfrescoJsApi, roleConsumerFolderModel.name, '-my-');
        roleCoordinatorFolder = await uploadActions.createFolder(alfrescoJsApi, roleCoordinatorFolderModel.name, '-my-');
        roleContributorFolder = await uploadActions.createFolder(alfrescoJsApi, roleContributorFolderModel.name, '-my-');
        roleCollaboratorFolder = await uploadActions.createFolder(alfrescoJsApi, roleCollaboratorFolderModel.name, '-my-');
        roleEditorFolder = await uploadActions.createFolder(alfrescoJsApi, roleEditorFolderModel.name, '-my-');

        folders = [roleConsumerFolder, roleContributorFolder, roleCoordinatorFolder, roleCollaboratorFolder, roleEditorFolder];

        await alfrescoJsApi.core.nodesApi.updateNode(roleConsumerFolder.entry.id,

            {
                permissions: {
                    locallySet: [{
                        authorityId: filePermissionUser.getId(),
                        name: 'Consumer',
                        accessStatus: 'ALLOWED'
                    }]
                }
            });

        await alfrescoJsApi.core.nodesApi.updateNode(roleCollaboratorFolder.entry.id,
            {
                permissions: {
                    locallySet: [{
                        authorityId: filePermissionUser.getId(),
                        name: 'Collaborator',
                        accessStatus: 'ALLOWED'
                    }]
                }
            });

        await alfrescoJsApi.core.nodesApi.updateNode(roleCoordinatorFolder.entry.id,
            {
                permissions: {
                    locallySet: [{
                        authorityId: filePermissionUser.getId(),
                        name: 'Coordinator',
                        accessStatus: 'ALLOWED'
                    }]
                }
            });

        await alfrescoJsApi.core.nodesApi.updateNode(roleContributorFolder.entry.id,

            {
                permissions: {
                    locallySet: [{
                        authorityId: filePermissionUser.getId(),
                        name: 'Contributor',
                        accessStatus: 'ALLOWED'
                    }]
                }
            });

        await alfrescoJsApi.core.nodesApi.updateNode(roleEditorFolder.entry.id,

            {
                permissions: {
                    locallySet: [{
                        authorityId: filePermissionUser.getId(),
                        name: 'Editor',
                        accessStatus: 'ALLOWED'
                    }]
                }
            });

        await uploadActions.uploadFile(alfrescoJsApi, fileModel.location, 'RoleConsumer' + fileModel.name, roleConsumerFolder.entry.id);
        await uploadActions.uploadFile(alfrescoJsApi, fileModel.location, 'RoleContributor' + fileModel.name, roleContributorFolder.entry.id);
        await uploadActions.uploadFile(alfrescoJsApi, fileModel.location, 'RoleCoordinator' + fileModel.name, roleCoordinatorFolder.entry.id);
        await uploadActions.uploadFile(alfrescoJsApi, fileModel.location, 'RoleCollaborator' + fileModel.name, roleCollaboratorFolder.entry.id);
        await uploadActions.uploadFile(alfrescoJsApi, fileModel.location, 'RoleEditor' + fileModel.name, roleEditorFolder.entry.id);

        done();
    });

    afterAll(async (done) => {
        await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await folders.forEach(function (folder) {
            uploadActions.deleteFilesOrFolder(alfrescoJsApi, folder.entry.id);
        });

        done();
    });

    describe('Inherit and assigning permissions', () => {

        beforeEach(async (done) => {

            await alfrescoJsApi.login(fileOwnerUser.id, fileOwnerUser.password);

            file = await uploadActions.uploadFile(alfrescoJsApi, fileModel.location, fileModel.name, '-my-');

            await loginPage.loginToContentServicesUsingUserModel(fileOwnerUser);

            contentServicesPage.goToDocumentList();
            contentServicesPage.checkContentIsDisplayed(fileModel.name);
            contentServicesPage.checkSelectedSiteIsDisplayed('My files');
            contentList.rightClickOnRow(fileModel.name);

            contentServicesPage.pressContextMenuActionNamed('Permission');

            permissionsPage.checkPermissionContainerIsDisplayed();

            done();

        });

        afterEach(async (done) => {
            try {
                await uploadActions.deleteFilesOrFolder(alfrescoJsApi, file.entry.id);
            } catch (error) {
            }

            done();
        });

        it('[C268974] Inherit Permission', () => {
            permissionsPage.checkPermissionInheritedButtonIsDisplayed();

            expect(permissionsPage.getPermissionInheritedButtonText()).toBe('Permission Inherited');

            permissionsPage.checkPermissionsDatatableIsDisplayed();
            permissionsPage.clickPermissionInheritedButton();

            expect(permissionsPage.getPermissionInheritedButtonText()).toBe('Inherit Permission');

            permissionsPage.checkNoPermissionsIsDisplayed();
            permissionsPage.clickPermissionInheritedButton();

            expect(permissionsPage.getPermissionInheritedButtonText()).toBe('Permission Inherited');

            permissionsPage.checkPermissionsDatatableIsDisplayed();

        });

        it('[C286272] Should be able to see results when searching for a user', () => {
            permissionsPage.checkAddPermissionButtonIsDisplayed();
            permissionsPage.clickAddPermissionButton();
            permissionsPage.checkAddPermissionDialogIsDisplayed();
            permissionsPage.checkSearchUserInputIsDisplayed();
            permissionsPage.searchUserOrGroup('a');
            permissionsPage.checkResultListIsDisplayed();

        });

        it('[C276979] Should be able to give permissions to a group of people', () => {
            permissionsPage.checkAddPermissionButtonIsDisplayed();
            permissionsPage.clickAddPermissionButton();
            permissionsPage.checkAddPermissionDialogIsDisplayed();
            permissionsPage.checkSearchUserInputIsDisplayed();
            permissionsPage.searchUserOrGroup('GROUP_' + groupBody.id);
            permissionsPage.clickUserOrGroup('GROUP_' + groupBody.id);
            permissionsPage.checkUserOrGroupIsAdded('GROUP_' + groupBody.id);

        });

        it('[C277100] Should display EVERYONE group in the search result set', () => {
            permissionsPage.checkAddPermissionButtonIsDisplayed();
            permissionsPage.clickAddPermissionButton();
            permissionsPage.checkAddPermissionDialogIsDisplayed();
            permissionsPage.checkSearchUserInputIsDisplayed();
            permissionsPage.searchUserOrGroup(filePermissionUser.getId());
            permissionsPage.checkResultListIsDisplayed();
            permissionsPage.checkUserOrGroupIsDisplayed('EVERYONE');
            permissionsPage.searchUserOrGroup('somerandomtext');
            permissionsPage.checkResultListIsDisplayed();
            permissionsPage.checkUserOrGroupIsDisplayed('EVERYONE');

        });

    });

    describe('Changing and duplicate Permissions', () => {

        beforeEach(async (done) => {

            await alfrescoJsApi.login(fileOwnerUser.id, fileOwnerUser.password);

            file = await uploadActions.uploadFile(alfrescoJsApi, fileModel.location, fileModel.name, '-my-');

            await loginPage.loginToContentServicesUsingUserModel(fileOwnerUser);

            contentServicesPage.goToDocumentList();
            contentServicesPage.checkContentIsDisplayed(fileModel.name);
            contentServicesPage.checkSelectedSiteIsDisplayed('My files');

            contentList.rightClickOnRow(fileModel.name);

            contentServicesPage.pressContextMenuActionNamed('Permission');

            permissionsPage.checkAddPermissionButtonIsDisplayed();
            permissionsPage.clickAddPermissionButton();
            permissionsPage.checkAddPermissionDialogIsDisplayed();
            permissionsPage.checkSearchUserInputIsDisplayed();
            permissionsPage.searchUserOrGroup(filePermissionUser.getId());
            permissionsPage.clickUserOrGroup(filePermissionUser.getFirstName());
            permissionsPage.checkUserOrGroupIsAdded(filePermissionUser.getId());

            done();

        });

        afterEach(async (done) => {

            await uploadActions.deleteFilesOrFolder(alfrescoJsApi, file.entry.id);

            done();

        });

        it('[C274691] Should be able to add a new User with permission to the file and also change locally set permissions', () => {

            expect(permissionsPage.getRoleCellValue(filePermissionUser.getId())).toEqual('Contributor');

            permissionsPage.clickRoleDropdownByUserOrGroupName(filePermissionUser.getId());

            expect(permissionsPage.getRoleDropdownOptions().count()).toBe(5);
            expect(permissionsPage.getRoleDropdownOptions().get(0).getText()).toBe('Contributor');
            expect(permissionsPage.getRoleDropdownOptions().get(1).getText()).toBe('Collaborator');
            expect(permissionsPage.getRoleDropdownOptions().get(2).getText()).toBe('Coordinator');
            expect(permissionsPage.getRoleDropdownOptions().get(3).getText()).toBe('Editor');
            expect(permissionsPage.getRoleDropdownOptions().get(4).getText()).toBe('Consumer');

            permissionsPage.selectOption('Collaborator');

            expect(permissionsPage.getRoleCellValue(filePermissionUser.getId())).toEqual('Collaborator');

            permissionsPage.clickRoleDropdownByUserOrGroupName(filePermissionUser.getId());
            permissionsPage.selectOption('Coordinator');

            expect(permissionsPage.getRoleCellValue(filePermissionUser.getId())).toEqual('Coordinator');

            permissionsPage.clickRoleDropdownByUserOrGroupName(filePermissionUser.getId());
            permissionsPage.selectOption('Editor');

            expect(permissionsPage.getRoleCellValue(filePermissionUser.getId())).toEqual('Editor');

            permissionsPage.clickRoleDropdownByUserOrGroupName(filePermissionUser.getId());
            permissionsPage.selectOption('Consumer');

            expect(permissionsPage.getRoleCellValue(filePermissionUser.getId())).toEqual('Consumer');

        });

        it('[C276980] Should not be able to duplicate User or Group to the locally set permissions', () => {
            expect(permissionsPage.getRoleCellValue(filePermissionUser.getId())).toEqual('Contributor');

            permissionsPage.clickAddPermissionButton();
            permissionsPage.checkAddPermissionDialogIsDisplayed();
            permissionsPage.checkSearchUserInputIsDisplayed();
            permissionsPage.searchUserOrGroup(filePermissionUser.getId());
            permissionsPage.clickUserOrGroup(filePermissionUser.getFirstName());

            expect(permissionsPage.getAssignPermissionErrorText()).toBe(duplicateUserPermissionMessage);

        });

        it('[C276982] Should be able to remove User or Group from the locally set permissions', () => {
            expect(permissionsPage.getRoleCellValue(filePermissionUser.getId())).toEqual('Contributor');

            permissionsPage.clickDeletePermissionButton();

            permissionsPage.checkUserOrGroupIsDeleted(filePermissionUser.getId());

        });

    });

    describe('Role: Consumer, Contributor, Coordinator, Collaborator, Editor, No Permissions', () => {

        it('[C276993] Role Consumer', async () => {

            await loginPage.loginToContentServicesUsingUserModel(filePermissionUser);

            navigationBarPage.openContentServicesFolder(roleConsumerFolder.entry.id);

            contentServicesPage.checkContentIsDisplayed('RoleConsumer' + fileModel.name);

            contentList.doubleClickRow('RoleConsumer' + fileModel.name);

            viewerPage.checkFileIsLoaded();
            viewerPage.clickCloseButton();

            contentList.waitForTableBody();

            contentServicesPage.checkDeleteIsDisabled('RoleConsumer' + fileModel.name);

            BrowserActions.closeMenuAndDialogs();

            contentList.checkActionMenuIsNotDisplayed();

            contentServicesPage.metadataContent('RoleConsumer' + fileModel.name);

            notificationPage.checkNotifyContains('You don\'t have access to do this.');

            contentServicesPage.uploadFile(fileModel.location);

            notificationPage.checkNotifyContains('You don\'t have the create permission to upload the content');

        });

        it('[C276996] Role Contributor', async () => {

            await loginPage.loginToContentServicesUsingUserModel(filePermissionUser);

            navigationBarPage.openContentServicesFolder(roleContributorFolder.entry.id);

            contentServicesPage.checkContentIsDisplayed('RoleContributor' + fileModel.name);

            contentList.doubleClickRow('RoleContributor' + fileModel.name);

            viewerPage.checkFileIsLoaded();
            viewerPage.clickCloseButton();

            contentList.waitForTableBody();

            contentServicesPage.checkDeleteIsDisabled('RoleContributor' + fileModel.name);

            BrowserActions.closeMenuAndDialogs();

            contentList.checkActionMenuIsNotDisplayed();

            contentServicesPage.metadataContent('RoleContributor' + fileModel.name);

            notificationPage.checkNotifyContains('You don\'t have access to do this.');

            contentServicesPage.uploadFile(testFileModel.location).checkContentIsDisplayed(testFileModel.name);

            uploadDialog.fileIsUploaded(testFileModel.name);
            uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

        });

        it('[C277000] Role Editor', async () => {

            await loginPage.loginToContentServicesUsingUserModel(filePermissionUser);

            navigationBarPage.openContentServicesFolder(roleEditorFolder.entry.id);

            contentServicesPage.checkContentIsDisplayed('RoleEditor' + fileModel.name);

            contentList.doubleClickRow('RoleEditor' + fileModel.name);

            viewerPage.checkFileIsLoaded();
            viewerPage.clickCloseButton();

            contentList.waitForTableBody();

            contentServicesPage.checkDeleteIsDisabled('RoleEditor' + fileModel.name);

            BrowserActions.closeMenuAndDialogs();

            browser.controlFlow().execute(async () => {

                contentList.checkActionMenuIsNotDisplayed();

                contentServicesPage.metadataContent('RoleEditor' + fileModel.name);

                metadataViewPage.editIconIsDisplayed();

                await metadataViewPage.editIconClick();

                metadataViewPage.editPropertyIconIsDisplayed('properties.cm:title');
                metadataViewPage.clickEditPropertyIcons('properties.cm:title');
                metadataViewPage.enterPropertyText('properties.cm:title', 'newTitle1');

                await metadataViewPage.clickUpdatePropertyIcon('properties.cm:title');

                expect(metadataViewPage.getPropertyText('properties.cm:title')).toEqual('newTitle1');

                metadataViewPage.clickCloseButton();

                contentServicesPage.uploadFile(fileModel.location);

                notificationPage.checkNotifyContains('You don\'t have the create permission to upload the content');

            });

        });

        it('[C277003] Role Collaborator', async () => {

            await loginPage.loginToContentServicesUsingUserModel(filePermissionUser);

            navigationBarPage.openContentServicesFolder(roleCollaboratorFolder.entry.id);

            contentServicesPage.checkContentIsDisplayed('RoleCollaborator' + fileModel.name);

            contentList.doubleClickRow('RoleCollaborator' + fileModel.name);

            viewerPage.checkFileIsLoaded();
            viewerPage.clickCloseButton();

            contentList.waitForTableBody();

            contentServicesPage.checkDeleteIsDisabled('RoleCollaborator' + fileModel.name);

            BrowserActions.closeMenuAndDialogs();

            browser.controlFlow().execute(async () => {

                contentList.checkActionMenuIsNotDisplayed();

                contentServicesPage.metadataContent('RoleCollaborator' + fileModel.name);

                metadataViewPage.editIconIsDisplayed();

                await metadataViewPage.editIconClick();

                metadataViewPage.editPropertyIconIsDisplayed('properties.cm:title');
                metadataViewPage.clickEditPropertyIcons('properties.cm:title');
                metadataViewPage.enterPropertyText('properties.cm:title', 'newTitle2');

                await metadataViewPage.clickUpdatePropertyIcon('properties.cm:title');

                expect(metadataViewPage.getPropertyText('properties.cm:title')).toEqual('newTitle2');

                metadataViewPage.clickCloseButton();

                contentServicesPage.uploadFile(testFileModel.location).checkContentIsDisplayed(testFileModel.name);

                uploadDialog.fileIsUploaded(testFileModel.name);
                uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

            });

        });

        it('[C277004] Role Coordinator', async () => {

            await loginPage.loginToContentServicesUsingUserModel(filePermissionUser);

            navigationBarPage.openContentServicesFolder(roleCoordinatorFolder.entry.id);

            contentServicesPage.checkContentIsDisplayed('RoleCoordinator' + fileModel.name);

            contentList.doubleClickRow('RoleCoordinator' + fileModel.name);

            viewerPage.checkFileIsLoaded();
            viewerPage.clickCloseButton();

            contentList.waitForTableBody();

            contentServicesPage.metadataContent('RoleCoordinator' + fileModel.name);

            metadataViewPage.editIconIsDisplayed();

            browser.controlFlow().execute(async () => {

                await metadataViewPage.editIconClick();

                metadataViewPage.editPropertyIconIsDisplayed('properties.cm:title');
                metadataViewPage.clickEditPropertyIcons('properties.cm:title');
                metadataViewPage.enterPropertyText('properties.cm:title', 'newTitle3');

                await metadataViewPage.clickUpdatePropertyIcon('properties.cm:title');

                expect(metadataViewPage.getPropertyText('properties.cm:title')).toEqual('newTitle3');

                metadataViewPage.clickCloseButton();
                contentServicesPage.uploadFile(pngFileModel.location).checkContentIsDisplayed(pngFileModel.name);

                uploadDialog.fileIsUploaded(pngFileModel.name);
                uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

                contentServicesPage.checkContentIsDisplayed('RoleCoordinator' + fileModel.name);
                contentServicesPage.deleteContent('RoleCoordinator' + fileModel.name);
                contentServicesPage.checkContentIsNotDisplayed('RoleCoordinator' + fileModel.name);

            });

        });

        it('[C279881] No Permission User', async () => {

            await loginPage.loginToContentServicesUsingUserModel(filePermissionUser);

            navigationBarPage.openContentServicesFolder(roleConsumerFolder.entry.id);

            contentServicesPage.checkContentIsDisplayed('RoleConsumer' + fileModel.name);
            contentServicesPage.checkSelectedSiteIsDisplayed('My files');

            contentList.rightClickOnRow('RoleConsumer' + fileModel.name);

            contentServicesPage.pressContextMenuActionNamed('Permission');

            permissionsPage.checkPermissionInheritedButtonIsDisplayed();
            permissionsPage.checkAddPermissionButtonIsDisplayed();
            permissionsPage.clickPermissionInheritedButton();

            notificationPage.checkNotifyContains('You are not allowed to change permissions');
            notificationPage.checkNotificationSnackBarIsNotDisplayed();

            permissionsPage.clickAddPermissionButton();

            notificationPage.checkNotifyContains('You are not allowed to change permissions');

        });

    });

});
