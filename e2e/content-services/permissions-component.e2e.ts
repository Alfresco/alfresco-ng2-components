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
import { ContentListPage } from '../pages/adf/dialog/contentListPage';
import AlfrescoApi = require('alfresco-js-api-node');
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

describe('Permissions Component', function () {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const permissionsPage = new PermissionsPage();
    const uploadActions = new UploadActions();
    const contentList = new ContentListPage();
    const searchDialog = new SearchDialog();
    const viewerPage = new ViewerPage();
    const metadataViewPage = new MetadataViewPage();
    const notificationPage = new NotificationPage();
    let fileOwnerUser, filePermissionUser, consumerUser, collaboratorUser, contributorUser, managerUser, file;
    let publicSite, folderName;

    let fileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });

    let pdfFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF.file_location
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

    let roleFolderModel = new FolderModel({'name': 'role' + Util.generateRandomString()});
    let roleFolder, siteFolder;

    fileOwnerUser = new AcsUserModel();

    filePermissionUser = new AcsUserModel();
    consumerUser = new AcsUserModel();
    collaboratorUser = new AcsUserModel();
    contributorUser = new AcsUserModel();
    managerUser = new AcsUserModel();

    const duplicateUserPermissionMessage = 'One or more of the permissions you have set is already present : authority -> ' + filePermissionUser.getId() + ' / role -> Contributor';

    beforeAll(async (done) => {

        await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await alfrescoJsApi.core.peopleApi.addPerson(fileOwnerUser);
        await alfrescoJsApi.core.peopleApi.addPerson(filePermissionUser);
        await alfrescoJsApi.core.peopleApi.addPerson(consumerUser);
        await alfrescoJsApi.core.peopleApi.addPerson(contributorUser);
        await alfrescoJsApi.core.peopleApi.addPerson(collaboratorUser);
        await alfrescoJsApi.core.peopleApi.addPerson(managerUser);
        let group = await alfrescoJsApi.core.groupsApi.createGroup(groupBody);
        groupId = group.entry.id;

        await alfrescoJsApi.login(fileOwnerUser.id, fileOwnerUser.password);
        let siteName = `PUBLIC_TEST_SITE_${Util.generateRandomString(5)}`;
        folderName = `MEESEEKS_${Util.generateRandomString(5)}`;
        let publicSiteBody = {visibility: 'PUBLIC', title: siteName};
        publicSite = await alfrescoJsApi.core.sitesApi.createSite(publicSiteBody);

        await alfrescoJsApi.core.sitesApi.addSiteMember(publicSite.entry.id, {
            id: consumerUser.id,
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

        siteFolder = await uploadActions.createFolder(alfrescoJsApi, folderName, publicSite.entry.guid);
        roleFolder = await uploadActions.createFolder(alfrescoJsApi, roleFolderModel.name, '-my-');

        await alfrescoJsApi.core.nodesApi.updateNode(roleFolder.entry.id,
            {
                permissions: {
                    locallySet: [{
                        authorityId: filePermissionUser.getId(),
                        name: 'Consumer',
                        accessStatus: 'ALLOWED'
                    }]
                }
            });

        await uploadActions.uploadFile(alfrescoJsApi, fileModel.location, 'Role' + fileModel.name, roleFolder.entry.id);
        await uploadActions.uploadFile(alfrescoJsApi, fileModel.location, 'Site' + fileModel.name, siteFolder.entry.id);
        browser.driver.sleep(15000); // wait search get the groups, files and folders

        done();
    });

    afterAll(async (done) => {
        await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await alfrescoJsApi.core.sitesApi.deleteSite(publicSite.entry.id);
        await alfrescoJsApi.core.groupsApi.deleteGroup(groupId);
        await uploadActions.deleteFilesOrFolder(alfrescoJsApi, roleFolder.entry.id);
        done();
    });

    describe('Inherit and assigning permissions', function () {

        beforeEach(async (done) => {
            await alfrescoJsApi.login(fileOwnerUser.id, fileOwnerUser.password);

            file = await uploadActions.uploadFile(alfrescoJsApi, fileModel.location, fileModel.name, '-my-');

            loginPage.loginToContentServicesUsingUserModel(fileOwnerUser);
            contentServicesPage.goToDocumentList();
            contentList.checkContentIsDisplayed(fileModel.name);
            contentServicesPage.checkSelectedSiteIsDisplayed('My files');
            contentList.rightClickOnRowNamed(fileModel.name);
            contentList.pressContextMenuActionNamed('Permission');

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
    });

    describe('Changing and duplicate Permissions', function () {

        beforeEach(async (done) => {
            await alfrescoJsApi.login(fileOwnerUser.id, fileOwnerUser.password);

            file = await uploadActions.uploadFile(alfrescoJsApi, fileModel.location, fileModel.name, '-my-');

            loginPage.loginToContentServicesUsingUserModel(fileOwnerUser);
            contentServicesPage.goToDocumentList();

            contentList.checkContentIsDisplayed(fileModel.name);
            contentServicesPage.checkSelectedSiteIsDisplayed('My files');
            contentList.clickRowMenuActionsButton(fileModel.name);
            contentList.clickMenuActionNamed('PERMISSION');
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
            permissionsPage.clickRoleDropdown();
            expect(permissionsPage.getRoleDropdownOptions().count()).toBe(5);
            expect(permissionsPage.getRoleDropdownOptions().get(0).getText()).toBe('Contributor');
            expect(permissionsPage.getRoleDropdownOptions().get(1).getText()).toBe('Collaborator');
            expect(permissionsPage.getRoleDropdownOptions().get(2).getText()).toBe('Coordinator');
            expect(permissionsPage.getRoleDropdownOptions().get(3).getText()).toBe('Editor');
            expect(permissionsPage.getRoleDropdownOptions().get(4).getText()).toBe('Consumer');
            permissionsPage.selectOption('Collaborator');
            expect(permissionsPage.getRoleCellValue(filePermissionUser.getId())).toEqual('Collaborator');
            permissionsPage.clickRoleDropdown();
            permissionsPage.selectOption('Coordinator');
            expect(permissionsPage.getRoleCellValue(filePermissionUser.getId())).toEqual('Coordinator');
            permissionsPage.clickRoleDropdown();
            permissionsPage.selectOption('Editor');
            expect(permissionsPage.getRoleCellValue(filePermissionUser.getId())).toEqual('Editor');
            permissionsPage.clickRoleDropdown();
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

    describe('Role Site Dropdown', function () {

        beforeEach(async (done) => {
            loginPage.loginToContentServicesUsingUserModel(fileOwnerUser);
            browser.get(TestConfig.adf.url + '/files/' + publicSite.entry.guid);
            contentList.checkContentIsDisplayed(folderName);
            contentServicesPage.checkSelectedSiteIsDisplayed('My files');
            contentList.clickRowMenuActionsButton(folderName);
            contentList.clickMenuActionNamed('PERMISSION');
            permissionsPage.checkPermissionInheritedButtonIsDisplayed();
            permissionsPage.checkAddPermissionButtonIsDisplayed();
            permissionsPage.clickAddPermissionButton();
            permissionsPage.checkAddPermissionDialogIsDisplayed();
            permissionsPage.checkSearchUserInputIsDisplayed();
            permissionsPage.searchUserOrGroup(filePermissionUser.getId());
            permissionsPage.clickUserOrGroup(filePermissionUser.getFirstName());
            permissionsPage.checkUserOrGroupIsAdded(filePermissionUser.getId());
            done();
        });

        it('[C277002] Should display the Role Site dropdown', () => {

            expect(permissionsPage.getRoleCellValue(filePermissionUser.getId())).toEqual('SiteCollaborator');
            permissionsPage.clickRoleDropdown();
            expect(permissionsPage.getRoleDropdownOptions().count()).toBe(4);
            expect(permissionsPage.getRoleDropdownOptions().get(0).getText()).toBe('SiteCollaborator');
            expect(permissionsPage.getRoleDropdownOptions().get(1).getText()).toBe('SiteConsumer');
            expect(permissionsPage.getRoleDropdownOptions().get(2).getText()).toBe('SiteContributor');
            expect(permissionsPage.getRoleDropdownOptions().get(3).getText()).toBe('SiteManager');

        });

    });

    describe('Role Consumer', function () {

        it('[C276993] Should not to be able to Delete, see Info or Upload a file with Consumer permission', () => {

            loginPage.loginToContentServicesUsingUserModel(filePermissionUser);
            contentServicesPage.goToDocumentList();
            searchDialog
                .checkSearchIconIsVisible()
                .clickOnSearchIcon()
                .checkSearchBarIsVisible()
                .enterText(roleFolderModel.name)
                .resultTableContainsRow(roleFolderModel.name)
                .clickOnSpecificRow(roleFolderModel.name);
            contentList.checkContentIsDisplayed('Role' + fileModel.name);
            contentList.doubleClickRow('Role' + fileModel.name);
            viewerPage.checkFileIsLoaded();
            viewerPage.clickCloseButton();
            contentList.waitForTableBody();
            contentList.checkDeleteIsDisabled('Role' + fileModel.name);
            browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
            contentList.checkActionMenuIsNotDisplayed();
            contentList.metadataContent('Role' + fileModel.name);
            notificationPage.checkNotifyContains('You don\'t have access to do this.');
            contentServicesPage.uploadFile(fileModel.location);
            notificationPage.checkNotifyContains('You don\'t have the create permission to upload the content');

        });
    });

    describe('Roles: SiteConsumer, SiteCollaborator, SiteContributor, SiteManager', function () {

        it('[C276994] Role SiteConsumer', () => {

            loginPage.loginToContentServicesUsingUserModel(consumerUser);
            contentServicesPage.goToDocumentList();
            searchDialog
                .checkSearchIconIsVisible()
                .clickOnSearchIcon()
                .checkSearchBarIsVisible()
                .enterText(folderName)
                .resultTableContainsRow(folderName)
                .clickOnSpecificRow(folderName);
            contentList.checkContentIsDisplayed('Site' + fileModel.name);
            contentList.doubleClickRow('Site' + fileModel.name);
            viewerPage.checkFileIsLoaded();
            viewerPage.clickCloseButton();
            contentList.waitForTableBody();
            contentList.checkDeleteIsDisabled('Site' + fileModel.name);
            browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
            contentList.checkActionMenuIsNotDisplayed();
            contentList.metadataContent('Site' + fileModel.name);
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
            contentList.checkContentIsDisplayed('Site' + fileModel.name);
            contentList.doubleClickRow('Site' + fileModel.name);
            viewerPage.checkFileIsLoaded();
            viewerPage.clickCloseButton();
            contentList.waitForTableBody();
            contentList.checkDeleteIsDisabled('Site' + fileModel.name);
            browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
            contentList.checkActionMenuIsNotDisplayed();
            contentList.metadataContent('Site' + fileModel.name);
            notificationPage.checkNotifyContains('You don\'t have access to do this.');
            contentServicesPage.uploadFile(pdfFileModel.location).checkContentIsDisplayed(pdfFileModel.name);

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
            contentList.checkContentIsDisplayed('Site' + fileModel.name);
            contentList.doubleClickRow('Site' + fileModel.name);
            viewerPage.checkFileIsLoaded();
            viewerPage.clickCloseButton();
            contentList.waitForTableBody();
            contentList.checkDeleteIsDisabled('Site' + fileModel.name);
            browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
            contentList.checkActionMenuIsNotDisplayed();

            contentList.metadataContent('Site' + fileModel.name);
            browser.controlFlow().execute(async () => {
                await metadataViewPage.editIconClick();
                metadataViewPage.clickEditPropertyIcons('properties.cm:title');
                metadataViewPage.enterPropertyText('properties.cm:title', 'newTitle');
                metadataViewPage.clickUpdatePropertyIcon('properties.cm:title');
                expect(metadataViewPage.getPropertyText('properties.cm:title')).toEqual('newTitle');
                metadataViewPage.clickCloseButton();

                contentServicesPage.uploadFile(pdfFileModel.location).checkContentIsDisplayed(pdfFileModel.name);
            });
        });
    });
});
