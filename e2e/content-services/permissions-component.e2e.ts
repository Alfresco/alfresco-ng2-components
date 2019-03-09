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

import { PermissionsPage } from '../pages/adf/permissionsPage';
import { LoginPage } from '../pages/adf/loginPage';
import { ContentServicesPage } from '../pages/adf/contentServicesPage';
import { AcsUserModel } from '../models/ACS/acsUserModel';
import TestConfig = require('../test.config');
import resources = require('../util/resources');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { FileModel } from '../models/ACS/fileModel';
import { UploadActions } from '../actions/ACS/upload.actions';
import { Util } from '../util/util';
import { browser, protractor } from 'protractor';
import { FolderModel } from '../models/ACS/folderModel';
import { SearchDialog } from '../pages/adf/dialog/searchDialog';
import { ViewerPage } from '../pages/adf/viewerPage';
import { NotificationPage } from '../pages/adf/notificationPage';
import CONSTANTS = require('../util/constants');
import { MetadataViewPage } from '../pages/adf/metadataViewPage';
import { UploadDialog } from '../pages/adf/dialog/uploadDialog';
import { VersionManagePage } from '../pages/adf/versionManagerPage';

describe('Permissions Component', function () {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const permissionsPage = new PermissionsPage();
    const uploadActions = new UploadActions();
    let  contentList = contentServicesPage.getDocumentList();
    const searchDialog = new SearchDialog();
    const viewerPage = new ViewerPage();
    const metadataViewPage = new MetadataViewPage();
    const notificationPage = new NotificationPage();
    const versionManagePage = new VersionManagePage();
    let uploadDialog = new UploadDialog();
    let folderOwnerUser, consumerUser, siteConsumerUser, contributorUser, managerUser, collaboratorUser, editorUser,
        coordinatorUser, file;
    let publicSite, privateSite, folderName;

    let fileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });

    let pdfFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF.file_location
    });

    let testFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TEST.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
    });

    let pngFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    let groupBody = {
        id: Util.generateRandomString(),
        displayName: Util.generateRandomString()
    };

    let groupId;
    let alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: TestConfig.adf.url
    });

    let roleConsumerFolderModel = new FolderModel({'name': 'roleConsumer' + Util.generateRandomString()});
    let roleCoordinatorFolderModel = new FolderModel({'name': 'roleCoordinator' + Util.generateRandomString()});
    let roleCollaboratorFolderModel = new FolderModel({'name': 'roleCollaborator' + Util.generateRandomString()});
    let roleContributorFolderModel = new FolderModel({'name': 'roleContributor' + Util.generateRandomString()});
    let roleEditorFolderModel = new FolderModel({'name': 'roleEditor' + Util.generateRandomString()});
    let roleConsumerFolder, roleCoordinatorFolder, roleContributorFolder, roleCollaboratorFolder, roleEditorFolder,
        siteFolder, privateSiteFile;

    folderOwnerUser = new AcsUserModel();
    consumerUser = new AcsUserModel();
    siteConsumerUser = new AcsUserModel();
    collaboratorUser = new AcsUserModel();
    coordinatorUser = new AcsUserModel();
    contributorUser = new AcsUserModel();
    managerUser = new AcsUserModel();
    editorUser = new AcsUserModel();

    const duplicateUserPermissionMessage = 'One or more of the permissions you have set is already present : authority -> ' + consumerUser.getId() + ' / role -> Contributor';

    beforeAll(async (done) => {

        await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await alfrescoJsApi.core.peopleApi.addPerson(folderOwnerUser);
        await alfrescoJsApi.core.peopleApi.addPerson(consumerUser);
        await alfrescoJsApi.core.peopleApi.addPerson(siteConsumerUser);
        await alfrescoJsApi.core.peopleApi.addPerson(contributorUser);
        await alfrescoJsApi.core.peopleApi.addPerson(collaboratorUser);
        await alfrescoJsApi.core.peopleApi.addPerson(editorUser);
        await alfrescoJsApi.core.peopleApi.addPerson(managerUser);
        await alfrescoJsApi.core.peopleApi.addPerson(coordinatorUser);

        let group = await alfrescoJsApi.core.groupsApi.createGroup(groupBody);
        groupId = group.entry.id;

        await alfrescoJsApi.login(folderOwnerUser.id, folderOwnerUser.password);
        let publicSiteName = `PUBLIC_TEST_SITE_${Util.generateRandomString(5)}`;
        let privateSiteName = `PRIVATE_TEST_SITE_${Util.generateRandomString(5)}`;
        folderName = `MEESEEKS_${Util.generateRandomString(5)}`;
        let publicSiteBody = {visibility: 'PUBLIC', title: publicSiteName};
        let privateSiteBody = {visibility: 'PRIVATE', title: privateSiteName};
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
        roleConsumerFolder = await uploadActions.createFolder(alfrescoJsApi, roleConsumerFolderModel.name, '-my-');
        roleCoordinatorFolder = await uploadActions.createFolder(alfrescoJsApi, roleCoordinatorFolderModel.name, '-my-');
        roleContributorFolder = await uploadActions.createFolder(alfrescoJsApi, roleContributorFolderModel.name, '-my-');
        roleCollaboratorFolder = await uploadActions.createFolder(alfrescoJsApi, roleCollaboratorFolderModel.name, '-my-');
        roleEditorFolder = await uploadActions.createFolder(alfrescoJsApi, roleEditorFolderModel.name, '-my-');
        privateSiteFile = await uploadActions.uploadFile(alfrescoJsApi, fileModel.location, 'privateSite' + fileModel.name, privateSite.entry.guid);

        await alfrescoJsApi.core.nodesApi.updateNode(roleConsumerFolder.entry.id,
            {
                permissions: {
                    locallySet: [{
                        authorityId: consumerUser.getId(),
                        name: 'Consumer',
                        accessStatus: 'ALLOWED'
                    }]
                }
            });

        await alfrescoJsApi.core.nodesApi.updateNode(roleCollaboratorFolder.entry.id,
            {
                permissions: {
                    locallySet: [{
                        authorityId: collaboratorUser.getId(),
                        name: 'Collaborator',
                        accessStatus: 'ALLOWED'
                    }]
                }
            });

        await alfrescoJsApi.core.nodesApi.updateNode(roleCoordinatorFolder.entry.id,
            {
                permissions: {
                    locallySet: [{
                        authorityId: coordinatorUser.getId(),
                        name: 'Coordinator',
                        accessStatus: 'ALLOWED'
                    }]
                }
            });

        await alfrescoJsApi.core.nodesApi.updateNode(roleContributorFolder.entry.id,
            {
                permissions: {
                    locallySet: [{
                        authorityId: contributorUser.getId(),
                        name: 'Contributor',
                        accessStatus: 'ALLOWED'
                    }]
                }
            });

        await alfrescoJsApi.core.nodesApi.updateNode(roleEditorFolder.entry.id,
            {
                permissions: {
                    locallySet: [{
                        authorityId: editorUser.getId(),
                        name: 'Editor',
                        accessStatus: 'ALLOWED'
                    }]
                }
            });

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

        await uploadActions.uploadFile(alfrescoJsApi, fileModel.location, 'RoleConsumer' + fileModel.name, roleConsumerFolder.entry.id);
        await uploadActions.uploadFile(alfrescoJsApi, fileModel.location, 'RoleContributor' + fileModel.name, roleContributorFolder.entry.id);
        await uploadActions.uploadFile(alfrescoJsApi, fileModel.location, 'RoleCoordinator' + fileModel.name, roleCoordinatorFolder.entry.id);
        await uploadActions.uploadFile(alfrescoJsApi, fileModel.location, 'RoleCollaborator' + fileModel.name, roleCollaboratorFolder.entry.id);
        await uploadActions.uploadFile(alfrescoJsApi, fileModel.location, 'RoleEditor' + fileModel.name, roleEditorFolder.entry.id);
        await uploadActions.uploadFile(alfrescoJsApi, fileModel.location, 'Site' + fileModel.name, siteFolder.entry.id);
        browser.driver.sleep(15000); // wait search get the groups, files and folders

        done();
    });

    afterAll(async (done) => {
        await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await alfrescoJsApi.core.sitesApi.deleteSite(publicSite.entry.id);
        await alfrescoJsApi.core.sitesApi.deleteSite(privateSite.entry.id);
        await alfrescoJsApi.core.groupsApi.deleteGroup(groupId);
        await uploadActions.deleteFilesOrFolder(alfrescoJsApi, roleConsumerFolder.entry.id);
        await uploadActions.deleteFilesOrFolder(alfrescoJsApi, roleCoordinatorFolder.entry.id);
        await uploadActions.deleteFilesOrFolder(alfrescoJsApi, roleCollaboratorFolder.entry.id);
        await uploadActions.deleteFilesOrFolder(alfrescoJsApi, roleContributorFolder.entry.id);
        await uploadActions.deleteFilesOrFolder(alfrescoJsApi, roleEditorFolder.entry.id);
        done();
    });

    describe('Inherit and assigning permissions', function () {

        beforeEach(async (done) => {
            await alfrescoJsApi.login(folderOwnerUser.id, folderOwnerUser.password);

            file = await uploadActions.uploadFile(alfrescoJsApi, fileModel.location, fileModel.name, '-my-');

            loginPage.loginToContentServicesUsingUserModel(folderOwnerUser);
            contentServicesPage.goToDocumentList();
            contentServicesPage.checkContentIsDisplayed(fileModel.name);
            contentServicesPage.checkSelectedSiteIsDisplayed('My files');
            contentList.rightClickOnRow(fileModel.name);
            contentServicesPage.pressContextMenuActionNamed('Permission');

            done();
        });

        afterEach(async (done) => {
            await uploadActions.deleteFilesOrFolder(alfrescoJsApi, file.entry.id);
            done();
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

        it('[C268974] Inherit Permission', () => {
            permissionsPage.checkPermissionContainerIsDisplayed();
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

        it('[C277100] Should display EVERYONE group in the search result set', () => {
            permissionsPage.checkAddPermissionButtonIsDisplayed();
            permissionsPage.clickAddPermissionButton();
            permissionsPage.checkAddPermissionDialogIsDisplayed();
            permissionsPage.checkSearchUserInputIsDisplayed();
            permissionsPage.searchUserOrGroup(consumerUser.getId());
            permissionsPage.checkResultListIsDisplayed();
            permissionsPage.checkUserOrGroupIsDisplayed('EVERYONE');
            permissionsPage.searchUserOrGroup('somerandomtext');
            permissionsPage.checkResultListIsDisplayed();
            permissionsPage.checkUserOrGroupIsDisplayed('EVERYONE');
        });
    });

    describe('Changing and duplicate Permissions', function () {

        beforeEach(async (done) => {
            await alfrescoJsApi.login(folderOwnerUser.id, folderOwnerUser.password);

            file = await uploadActions.uploadFile(alfrescoJsApi, fileModel.location, fileModel.name, '-my-');

            loginPage.loginToContentServicesUsingUserModel(folderOwnerUser);
            contentServicesPage.goToDocumentList();

            contentServicesPage.checkContentIsDisplayed(fileModel.name);
            contentServicesPage.checkSelectedSiteIsDisplayed('My files');
            contentList.rightClickOnRow(fileModel.name);
            contentServicesPage.pressContextMenuActionNamed('Permission');
            permissionsPage.checkAddPermissionButtonIsDisplayed();
            permissionsPage.clickAddPermissionButton();
            permissionsPage.checkAddPermissionDialogIsDisplayed();
            permissionsPage.checkSearchUserInputIsDisplayed();
            permissionsPage.searchUserOrGroup(consumerUser.getId());
            permissionsPage.clickUserOrGroup(consumerUser.getFirstName());
            permissionsPage.checkUserOrGroupIsAdded(consumerUser.getId());
            done();
        });

        afterEach(async (done) => {
            await uploadActions.deleteFilesOrFolder(alfrescoJsApi, file.entry.id);

            done();
        });

        it('[C274691] Should be able to add a new User with permission to the file and also change locally set permissions', () => {

            expect(permissionsPage.getRoleCellValue(consumerUser.getId())).toEqual('Contributor');
            permissionsPage.clickRoleDropdown();
            expect(permissionsPage.getRoleDropdownOptions().count()).toBe(5);
            expect(permissionsPage.getRoleDropdownOptions().get(0).getText()).toBe('Contributor');
            expect(permissionsPage.getRoleDropdownOptions().get(1).getText()).toBe('Collaborator');
            expect(permissionsPage.getRoleDropdownOptions().get(2).getText()).toBe('Coordinator');
            expect(permissionsPage.getRoleDropdownOptions().get(3).getText()).toBe('Editor');
            expect(permissionsPage.getRoleDropdownOptions().get(4).getText()).toBe('Consumer');
            permissionsPage.selectOption('Collaborator');
            expect(permissionsPage.getRoleCellValue(consumerUser.getId())).toEqual('Collaborator');
            permissionsPage.clickRoleDropdown();
            permissionsPage.selectOption('Coordinator');
            expect(permissionsPage.getRoleCellValue(consumerUser.getId())).toEqual('Coordinator');
            permissionsPage.clickRoleDropdown();
            permissionsPage.selectOption('Editor');
            expect(permissionsPage.getRoleCellValue(consumerUser.getId())).toEqual('Editor');
            permissionsPage.clickRoleDropdown();
            permissionsPage.selectOption('Consumer');
            expect(permissionsPage.getRoleCellValue(consumerUser.getId())).toEqual('Consumer');

        });

        it('[C276980] Should not be able to duplicate User or Group to the locally set permissions', () => {

            expect(permissionsPage.getRoleCellValue(consumerUser.getId())).toEqual('Contributor');
            permissionsPage.clickAddPermissionButton();
            permissionsPage.checkAddPermissionDialogIsDisplayed();
            permissionsPage.checkSearchUserInputIsDisplayed();
            permissionsPage.searchUserOrGroup(consumerUser.getId());
            permissionsPage.clickUserOrGroup(consumerUser.getFirstName());
            expect(permissionsPage.getAssignPermissionErrorText()).toBe(duplicateUserPermissionMessage);
        });

        it('[C276982] Should be able to remove User or Group from the locally set permissions', () => {

            expect(permissionsPage.getRoleCellValue(consumerUser.getId())).toEqual('Contributor');
            permissionsPage.clickDeletePermissionButton();
            permissionsPage.checkUserOrGroupIsDeleted(consumerUser.getId());
        });

    });

    describe('Role Site Dropdown', function () {

        beforeEach(async (done) => {
            loginPage.loginToContentServicesUsingUserModel(folderOwnerUser);
            browser.get(TestConfig.adf.url + '/files/' + publicSite.entry.guid);
            contentServicesPage.checkContentIsDisplayed(folderName);
            contentServicesPage.checkSelectedSiteIsDisplayed('My files');
            contentList.rightClickOnRow(folderName);
            contentServicesPage.pressContextMenuActionNamed('Permission');
            permissionsPage.checkPermissionInheritedButtonIsDisplayed();
            permissionsPage.checkAddPermissionButtonIsDisplayed();
            permissionsPage.clickAddPermissionButton();
            permissionsPage.checkAddPermissionDialogIsDisplayed();
            permissionsPage.checkSearchUserInputIsDisplayed();
            permissionsPage.searchUserOrGroup(consumerUser.getId());
            permissionsPage.clickUserOrGroup(consumerUser.getFirstName());
            permissionsPage.checkUserOrGroupIsAdded(consumerUser.getId());
            done();
        });

        it('[C277002] Should display the Role Site dropdown', () => {

            expect(permissionsPage.getRoleCellValue(consumerUser.getId())).toEqual('SiteCollaborator');
            permissionsPage.clickRoleDropdown();
            expect(permissionsPage.getRoleDropdownOptions().count()).toBe(4);
            expect(permissionsPage.getRoleDropdownOptions().get(0).getText()).toBe('SiteCollaborator');
            expect(permissionsPage.getRoleDropdownOptions().get(1).getText()).toBe('SiteConsumer');
            expect(permissionsPage.getRoleDropdownOptions().get(2).getText()).toBe('SiteContributor');
            expect(permissionsPage.getRoleDropdownOptions().get(3).getText()).toBe('SiteManager');

        });

    });

    describe('Role: Consumer, Contributor, Coordinator, Collaborator, Editor, No Permissions', function () {

        it('[C276993] Role Consumer', () => {

            loginPage.loginToContentServicesUsingUserModel(consumerUser);
            contentServicesPage.goToDocumentList();
            searchDialog
                .checkSearchIconIsVisible()
                .clickOnSearchIcon()
                .checkSearchBarIsVisible()
                .enterText(roleConsumerFolderModel.name)
                .resultTableContainsRow(roleConsumerFolderModel.name)
                .clickOnSpecificRow(roleConsumerFolderModel.name);
            contentServicesPage.checkContentIsDisplayed('RoleConsumer' + fileModel.name);
            contentList.doubleClickRow('RoleConsumer' + fileModel.name);
            viewerPage.checkFileIsLoaded();
            viewerPage.clickCloseButton();
            contentList.waitForTableBody();
            contentServicesPage.checkDeleteIsDisabled('RoleConsumer' + fileModel.name);
            browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
            contentList.checkActionMenuIsNotDisplayed();
            contentServicesPage.metadataContent('RoleConsumer' + fileModel.name);
            notificationPage.checkNotifyContains('You don\'t have access to do this.');
            contentServicesPage.uploadFile(fileModel.location);
            notificationPage.checkNotifyContains('You don\'t have the create permission to upload the content');

        });

        it('[C276996] Role Contributor', () => {

            loginPage.loginToContentServicesUsingUserModel(contributorUser);
            contentServicesPage.goToDocumentList();
            searchDialog
                .checkSearchIconIsVisible()
                .clickOnSearchIcon()
                .checkSearchBarIsVisible()
                .enterText(roleContributorFolderModel.name)
                .resultTableContainsRow(roleContributorFolderModel.name)
                .clickOnSpecificRow(roleContributorFolderModel.name);
            contentServicesPage.checkContentIsDisplayed('RoleContributor' + fileModel.name);
            contentList.doubleClickRow('RoleContributor' + fileModel.name);
            viewerPage.checkFileIsLoaded();
            viewerPage.clickCloseButton();
            contentList.waitForTableBody();
            contentServicesPage.checkDeleteIsDisabled('RoleContributor' + fileModel.name);
            browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
            contentList.checkActionMenuIsNotDisplayed();
            contentServicesPage.metadataContent('RoleContributor' + fileModel.name);
            notificationPage.checkNotifyContains('You don\'t have access to do this.');
            contentServicesPage.uploadFile(pdfFileModel.location).checkContentIsDisplayed(pdfFileModel.name);
            uploadDialog.fileIsUploaded(pdfFileModel.name);

            uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

        });

        it('[C277000] Role Editor', () => {

            loginPage.loginToContentServicesUsingUserModel(editorUser);
            contentServicesPage.goToDocumentList();
            searchDialog
                .checkSearchIconIsVisible()
                .clickOnSearchIcon()
                .checkSearchBarIsVisible()
                .enterText(roleEditorFolderModel.name)
                .resultTableContainsRow(roleEditorFolderModel.name)
                .clickOnSpecificRow(roleEditorFolderModel.name);
            contentServicesPage.checkContentIsDisplayed('RoleEditor' + fileModel.name);
            contentList.doubleClickRow('RoleEditor' + fileModel.name);
            viewerPage.checkFileIsLoaded();
            viewerPage.clickCloseButton();
            contentList.waitForTableBody();
            contentServicesPage.checkDeleteIsDisabled('RoleEditor' + fileModel.name);
            browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
            contentList.checkActionMenuIsNotDisplayed();

            contentServicesPage.metadataContent('RoleEditor' + fileModel.name);
            browser.controlFlow().execute(async () => {
                await metadataViewPage.editIconClick();
                metadataViewPage.clickEditPropertyIcons('properties.cm:title');
                metadataViewPage.enterPropertyText('properties.cm:title', 'newTitle');
                metadataViewPage.clickUpdatePropertyIcon('properties.cm:title');
                expect(metadataViewPage.getPropertyText('properties.cm:title')).toEqual('newTitle');
                metadataViewPage.clickCloseButton();

                contentServicesPage.uploadFile(fileModel.location);
                notificationPage.checkNotifyContains('You don\'t have the create permission to upload the content');
            });

        });

        it('[C277003] Role Collaborator', () => {

            loginPage.loginToContentServicesUsingUserModel(collaboratorUser);
            contentServicesPage.goToDocumentList();
            searchDialog
                .checkSearchIconIsVisible()
                .clickOnSearchIcon()
                .checkSearchBarIsVisible()
                .enterText(roleCollaboratorFolderModel.name)
                .resultTableContainsRow(roleCollaboratorFolderModel.name)
                .clickOnSpecificRow(roleCollaboratorFolderModel.name);
            contentServicesPage.checkContentIsDisplayed('RoleCollaborator' + fileModel.name);
            contentList.doubleClickRow('RoleCollaborator' + fileModel.name);
            viewerPage.checkFileIsLoaded();
            viewerPage.clickCloseButton();
            contentList.waitForTableBody();
            contentServicesPage.checkDeleteIsDisabled('RoleCollaborator' + fileModel.name);
            browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
            contentList.checkActionMenuIsNotDisplayed();

            contentServicesPage.metadataContent('RoleCollaborator' + fileModel.name);
            browser.controlFlow().execute(async () => {
                await metadataViewPage.editIconClick();
                metadataViewPage.clickEditPropertyIcons('properties.cm:description');
                metadataViewPage.enterDescriptionText('newDescription');
                metadataViewPage.clickUpdatePropertyIcon('properties.cm:description');
                expect(metadataViewPage.getPropertyText('properties.cm:description')).toEqual('newDescription');
                metadataViewPage.clickCloseButton();

                contentServicesPage.uploadFile(testFileModel.location).checkContentIsDisplayed(testFileModel.name);
                uploadDialog.fileIsUploaded(testFileModel.name);

                uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
            });

        });

        it('[C277004] Role Coordinator', () => {

            loginPage.loginToContentServicesUsingUserModel(coordinatorUser);
            contentServicesPage.goToDocumentList();
            searchDialog
                .checkSearchIconIsVisible()
                .clickOnSearchIcon()
                .checkSearchBarIsVisible()
                .enterText(roleCoordinatorFolderModel.name)
                .resultTableContainsRow(roleCoordinatorFolderModel.name)
                .clickOnSpecificRow(roleCoordinatorFolderModel.name);
            contentServicesPage.checkContentIsDisplayed('RoleCoordinator' + fileModel.name);
            contentList.doubleClickRow('RoleCoordinator' + fileModel.name);
            viewerPage.checkFileIsLoaded();
            viewerPage.clickCloseButton();
            contentList.waitForTableBody();

            contentServicesPage.metadataContent('RoleCoordinator' + fileModel.name);
            browser.controlFlow().execute(async () => {
                await metadataViewPage.editIconClick();
                metadataViewPage.clickEditPropertyIcons('properties.cm:author');
                metadataViewPage.enterPropertyText('properties.cm:author', 'newAuthor');
                metadataViewPage.clickUpdatePropertyIcon('properties.cm:author');
                expect(metadataViewPage.getPropertyText('properties.cm:author')).toEqual('newAuthor');
                metadataViewPage.clickCloseButton();

                contentServicesPage.uploadFile(pngFileModel.location).checkContentIsDisplayed(pngFileModel.name);
                uploadDialog.fileIsUploaded(pngFileModel.name);

                uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
                contentServicesPage.checkContentIsDisplayed('RoleCoordinator' + fileModel.name);
                contentServicesPage.deleteContent('RoleCoordinator' + fileModel.name);
                contentServicesPage.checkContentIsNotDisplayed('RoleCoordinator' + fileModel.name);
            });

        });

        it('[C279881] No Permission User', () => {

            loginPage.loginToContentServicesUsingUserModel(consumerUser);
            contentServicesPage.goToDocumentList();
            searchDialog
                .checkSearchIconIsVisible()
                .clickOnSearchIcon()
                .checkSearchBarIsVisible()
                .enterText(roleConsumerFolderModel.name)
                .resultTableContainsRow(roleConsumerFolderModel.name)
                .clickOnSpecificRow(roleConsumerFolderModel.name);
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

    describe('Roles: SiteConsumer, SiteCollaborator, SiteContributor, SiteManager', function () {

        it('[C276994] Role SiteConsumer', () => {

            loginPage.loginToContentServicesUsingUserModel(siteConsumerUser);
            contentServicesPage.goToDocumentList();
            searchDialog
                .checkSearchIconIsVisible()
                .clickOnSearchIcon()
                .checkSearchBarIsVisible()
                .enterText(folderName)
                .resultTableContainsRow(folderName)
                .clickOnSpecificRow(folderName);
            contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name);
            contentList.doubleClickRow('Site' + fileModel.name);
            viewerPage.checkFileIsLoaded();
            viewerPage.clickCloseButton();
            contentList.waitForTableBody();
            contentServicesPage.checkDeleteIsDisabled('Site' + fileModel.name);
            browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
            contentList.checkActionMenuIsNotDisplayed();
            contentServicesPage.metadataContent('Site' + fileModel.name);
            notificationPage.checkNotifyContains('You don\'t have access to do this.');
            contentServicesPage.uploadFile(fileModel.location);
            notificationPage.checkNotifyContains('You don\'t have the create permission to upload the content');

        });

        it('[C276997] Role SiteContributor', () => {

            loginPage.loginToContentServicesUsingUserModel(contributorUser);
            contentServicesPage.goToDocumentList();
            searchDialog
                .checkSearchIconIsVisible()
                .clickOnSearchIcon()
                .checkSearchBarIsVisible()
                .enterText(folderName)
                .resultTableContainsRow(folderName)
                .clickOnSpecificRow(folderName);
            contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name);
            contentList.doubleClickRow('Site' + fileModel.name);
            viewerPage.checkFileIsLoaded();
            viewerPage.clickCloseButton();
            contentList.waitForTableBody();
            contentServicesPage.checkDeleteIsDisabled('Site' + fileModel.name);
            browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
            contentList.checkActionMenuIsNotDisplayed();
            contentServicesPage.metadataContent('Site' + fileModel.name);
            notificationPage.checkNotifyContains('You don\'t have access to do this.');
            contentServicesPage.uploadFile(pdfFileModel.location).checkContentIsDisplayed(pdfFileModel.name);
            uploadDialog.fileIsUploaded(pdfFileModel.name);

            uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

        });

        it('[C277005] Role SiteCollaborator', () => {

            loginPage.loginToContentServicesUsingUserModel(collaboratorUser);
            contentServicesPage.goToDocumentList();
            searchDialog
                .checkSearchIconIsVisible()
                .clickOnSearchIcon()
                .checkSearchBarIsVisible()
                .enterText(folderName)
                .resultTableContainsRow(folderName)
                .clickOnSpecificRow(folderName);
            contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name);
            contentList.doubleClickRow('Site' + fileModel.name);
            viewerPage.checkFileIsLoaded();
            viewerPage.clickCloseButton();
            contentList.waitForTableBody();
            contentServicesPage.checkDeleteIsDisabled('Site' + fileModel.name);
            browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
            contentList.checkActionMenuIsNotDisplayed();

            contentServicesPage.metadataContent('Site' + fileModel.name);
            browser.controlFlow().execute(async () => {
                await metadataViewPage.editIconClick();
                metadataViewPage.clickEditPropertyIcons('properties.cm:title');
                metadataViewPage.enterPropertyText('properties.cm:title', 'newTitle');
                metadataViewPage.clickUpdatePropertyIcon('properties.cm:title');
                expect(metadataViewPage.getPropertyText('properties.cm:title')).toEqual('newTitle');
                metadataViewPage.clickCloseButton();

                contentServicesPage.uploadFile(pngFileModel.location).checkContentIsDisplayed(pngFileModel.name);
                uploadDialog.fileIsUploaded(pngFileModel.name);

                uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
            });
        });

        it('[C277006] Role SiteManager', () => {

            loginPage.loginToContentServicesUsingUserModel(managerUser);
            contentServicesPage.goToDocumentList();
            searchDialog
                .checkSearchIconIsVisible()
                .clickOnSearchIcon()
                .checkSearchBarIsVisible()
                .enterText(folderName)
                .resultTableContainsRow(folderName)
                .clickOnSpecificRow(folderName);
            contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name);
            contentList.doubleClickRow('Site' + fileModel.name);
            viewerPage.checkFileIsLoaded();
            viewerPage.clickCloseButton();
            contentList.waitForTableBody();

            contentServicesPage.metadataContent('Site' + fileModel.name);
            browser.controlFlow().execute(async () => {
                await metadataViewPage.editIconClick();
                metadataViewPage.clickEditPropertyIcons('properties.cm:description');
                metadataViewPage.enterDescriptionText('newDescription');
                metadataViewPage.clickUpdatePropertyIcon('properties.cm:description');
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

    describe('Site Consumer - Add new version', function () {

        it('[C277118] Should be able to add new version with Site Consumer permission on file', () => {

            loginPage.loginToContentServicesUsingUserModel(managerUser);
            browser.get(TestConfig.adf.url + '/files/' + privateSite.entry.guid);
            contentServicesPage.checkContentIsDisplayed('privateSite' + fileModel.name);
            contentList.doubleClickRow('privateSite' + fileModel.name);
            viewerPage.checkFileIsLoaded();
            viewerPage.checkInfoButtonIsDisplayed();
            viewerPage.clickInfoButton();
            viewerPage.checkInfoSideBarIsDisplayed();
            viewerPage.clickMoveRightChevron();
            viewerPage.clickMoveRightChevron();
            viewerPage.clickOnTab('Versions');
            viewerPage.checkTabIsActive('Versions');
            versionManagePage
                .checkUploadNewVersionsButtonIsDisplayed()
                .clickAddNewVersionsButton()
                .checkMajorChangeIsDisplayed()
                .checkMinorChangeIsDisplayed()
                .checkCommentTextIsDisplayed()
                .checkCancelButtonIsDisplayed();

            versionManagePage.uploadNewVersionFile(pngFileModel.location);
            versionManagePage.checkFileVersionExist('1.0');
            expect(versionManagePage.getFileVersionName('1.0')).toEqual('privateSite' + fileModel.name);
            versionManagePage.checkFileVersionExist('1.1');
            expect(versionManagePage.getFileVersionName('1.1')).toEqual(pngFileModel.name);
            viewerPage.checkFileNameIsDisplayed(pngFileModel.name);

        });

    });
});
