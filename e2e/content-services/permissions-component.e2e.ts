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
import { browser } from 'protractor';

describe('Permissions Component', function () {

    let loginPage = new LoginPage();
    let contentServicesPage = new ContentServicesPage();
    let permissionsPage = new PermissionsPage();
    let uploadActions = new UploadActions();
    let contentList = new ContentListPage();
    let acsUser, acsUser2, file;

    let fileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
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

    acsUser = new AcsUserModel();

    acsUser2 = new AcsUserModel();
    const duplicateUserPermissionMessage = 'One or more of the permissions you have set is already present : authority -> ' + acsUser2.getId() + ' / role -> Contributor';

    beforeAll(async (done) => {

        await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await alfrescoJsApi.core.peopleApi.addPerson(acsUser2);

        let group = await alfrescoJsApi.core.groupsApi.createGroup(groupBody);

        groupId = group.entry.id;

        browser.driver.sleep(15000); // wait search get the groups

        done();
    });

    afterAll(async (done) => {
        await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await alfrescoJsApi.core.groupsApi.deleteGroup(groupId);
        done();
    });

    describe('Inherit and assigning permissions', function () {

        beforeEach(async (done) => {
            await alfrescoJsApi.login(acsUser.id, acsUser.password);

            file = await uploadActions.uploadFile(alfrescoJsApi, fileModel.location, fileModel.name, '-my-');

            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            contentList.checkContentIsDisplayed(fileModel.name);
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
            await alfrescoJsApi.login(acsUser.id, acsUser.password);

            file = await uploadActions.uploadFile(alfrescoJsApi, fileModel.location, fileModel.name, '-my-');

            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            contentList.checkContentIsDisplayed(fileModel.name);
            contentList.rightClickOnRowNamed(fileModel.name);
            contentList.pressContextMenuActionNamed('Permission');
            permissionsPage.checkAddPermissionButtonIsDisplayed();
            permissionsPage.clickAddPermissionButton();
            permissionsPage.checkAddPermissionDialogIsDisplayed();
            permissionsPage.checkSearchUserInputIsDisplayed();
            permissionsPage.searchUserOrGroup(acsUser2.getId());
            permissionsPage.clickUserOrGroup(acsUser2.getFirstName());
            permissionsPage.checkUserOrGroupIsAdded(acsUser2.getId());
            done();
        });

        afterEach(async (done) => {
            await uploadActions.deleteFilesOrFolder(alfrescoJsApi, file.entry.id);

            done();
        });

        it('[C274691, C276978] Should be able to add a user and change roles for the locally set permissions', () => {

            permissionsPage.checkUserHasRoleSelected(acsUser2.getId(), 'Contributor');
            permissionsPage.clickRoleDropdown();
            expect(permissionsPage.getRoleDropdownOptions().count()).toBe(5);
            expect(permissionsPage.getRoleDropdownOptions().get(0).getText()).toBe('Contributor');
            expect(permissionsPage.getRoleDropdownOptions().get(1).getText()).toBe('Collaborator');
            expect(permissionsPage.getRoleDropdownOptions().get(2).getText()).toBe('Coordinator');
            expect(permissionsPage.getRoleDropdownOptions().get(3).getText()).toBe('Editor');
            expect(permissionsPage.getRoleDropdownOptions().get(4).getText()).toBe('Consumer');
            permissionsPage.selectOption('Collaborator');
            permissionsPage.checkUserHasRoleSelected(acsUser2.getId(), 'Collaborator');
            permissionsPage.clickRoleDropdown();
            permissionsPage.selectOption('Coordinator');
            permissionsPage.checkUserHasRoleSelected(acsUser2.getId(), 'Coordinator');
            permissionsPage.clickRoleDropdown();
            permissionsPage.selectOption('Editor');
            permissionsPage.checkUserHasRoleSelected(acsUser2.getId(), 'Editor');
            permissionsPage.clickRoleDropdown();
            permissionsPage.selectOption('Consumer');
            permissionsPage.checkUserHasRoleSelected(acsUser2.getId(), 'Consumer');

        });

        it('[C276980] Should not be able to duplicate User or Group to the locally set permissions', () => {

            permissionsPage.checkUserHasRoleSelected(acsUser2.getId(), 'Contributor');
            permissionsPage.clickAddPermissionButton();
            permissionsPage.checkAddPermissionDialogIsDisplayed();
            permissionsPage.checkSearchUserInputIsDisplayed();
            permissionsPage.searchUserOrGroup(acsUser2.getId());
            permissionsPage.clickUserOrGroup(acsUser2.getFirstName());
            expect(permissionsPage.getAssignPermissionErrorText()).toBe(duplicateUserPermissionMessage);
        });

    });

});
