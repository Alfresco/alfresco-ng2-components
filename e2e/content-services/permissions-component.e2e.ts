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
import AlfrescoApi = require('alfresco-js-api-node');
import { FileModel } from '../models/ACS/fileModel';
import { UploadActions } from '../actions/ACS/upload.actions';
import { Util } from '../util/util';
import { browser } from 'protractor';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';

describe('Permissions Component', function () {

    let loginPage = new LoginPage();
    let contentServicesPage = new ContentServicesPage();
    let permissionsPage = new PermissionsPage();
    let uploadActions = new UploadActions();
    let contentList = contentServicesPage.getDocumentList();
    let fileOwnerUser, filePermissionUser, file;
    let publicSite, folderName;
    const navigationBar = new NavigationBarPage();

    let fileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });

    let groupBody = {
        id: Util.generateRandomString(),
        displayName: Util.generateRandomString()
    };

    let group;
    let alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: TestConfig.adf.url
    });

    fileOwnerUser = new AcsUserModel();

    filePermissionUser = new AcsUserModel();
    let duplicateUserPermissionMessage = 'One or more of the permissions you have set is already present : authority -> ' + filePermissionUser.getId() + ' / role -> Contributor';

    beforeAll(async (done) => {

        await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await alfrescoJsApi.core.peopleApi.addPerson(fileOwnerUser);
        await alfrescoJsApi.core.peopleApi.addPerson(filePermissionUser);

        group = await alfrescoJsApi.core.groupsApi.createGroup(groupBody);
        browser.driver.sleep(15000); // wait search get the groups

        await alfrescoJsApi.login(fileOwnerUser.id, fileOwnerUser.password);

        let siteName = Util.generateRandomString(5);
        let publicSiteBody = {'title': siteName, 'visibility': 'PUBLIC'};
        publicSite = await alfrescoJsApi.core.sitesApi.createSite(publicSiteBody);

        folderName = Util.generateRandomString(5);
        await uploadActions.createFolder(alfrescoJsApi, folderName, publicSite.entry.guid);

        done();
    });

    afterAll(async (done) => {
        await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await alfrescoJsApi.core.sitesApi.deleteSite(publicSite.entry.id);
        await alfrescoJsApi.core.groupsApi.deleteGroup(group.entry.id);
        done();
    });

    describe('Inherit and assigning permissions', function () {

        beforeAll(async (done) => {
            await alfrescoJsApi.login(fileOwnerUser.id, fileOwnerUser.password);

            file = await uploadActions.uploadFile(alfrescoJsApi, fileModel.location, fileModel.name, '-my-');

            loginPage.loginToContentServicesUsingUserModel(fileOwnerUser);

            done();
        });

        afterAll(async (done) => {
            await uploadActions.deleteFilesOrFolder(alfrescoJsApi, file.entry.id);
            done();
        });

        beforeEach(() => {
            navigationBar.clickContentServicesButton();
            contentServicesPage.checkContentIsDisplayed(fileModel.name);
            contentServicesPage.checkSelectedSiteIsDisplayed('My files');
            contentList.rightClickOnRow(fileModel.name);
            contentServicesPage.pressContextMenuActionNamed('Permission');
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

        it('[C286272] Should be able to see results when searching for a user', () => {
            permissionsPage.checkAddPermissionButtonIsDisplayed();
            permissionsPage.clickAddPermissionButton();
            permissionsPage.checkAddPermissionDialogIsDisplayed();
            permissionsPage.checkSearchUserInputIsDisplayed();
            permissionsPage.searchUserOrGroup('a');
            permissionsPage.checkResultListIsDisplayed();
            permissionsPage.clickCloseButton();
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
    });

    describe('Changing and duplicate Permissions', function () {

        beforeEach(async (done) => {
            await alfrescoJsApi.login(fileOwnerUser.id, fileOwnerUser.password);

            file = await uploadActions.uploadFile(alfrescoJsApi, fileModel.location, fileModel.name, '-my-');

            loginPage.loginToContentServicesUsingUserModel(fileOwnerUser);
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
            contentServicesPage.checkContentIsDisplayed(folderName);
            contentServicesPage.checkSelectedSiteIsDisplayed('My files');
            contentList.rightClickOnRow(folderName);
            contentServicesPage.pressContextMenuActionNamed('Permission');
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
});
