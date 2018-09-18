/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import LoginPage = require('../pages/adf/loginPage');
import ContentServicesPage = require('../pages/adf/contentServicesPage');
import AcsUserModel = require('../models/ACS/acsUserModel');
import TestConfig = require('../test.config');
import resources = require('../util/resources');
import ContentListPage = require('../pages/adf/dialog/contentList');
import AlfrescoApi = require('alfresco-js-api-node');
import FileModel = require('../models/ACS/fileModel');
import { UploadActions } from '../actions/ACS/upload.actions';
import Util = require('../util/util.js');

describe('Permissions Component', function () {

    let loginPage = new LoginPage();
    let contentServicesPage = new ContentServicesPage();
    let permissionsPage = new PermissionsPage();
    let uploadActions = new UploadActions();
    let contentList = new ContentListPage();
    let acsUser, file;

    let fileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });

    let groupBody = {
        id: Util.generateRandomString(),
        displayName: Util.generateRandomString()
    };

    let groupId;

    beforeAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        acsUser = new AcsUserModel();

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        let group = await this.alfrescoJsApi.core.groupsApi.createGroup(groupBody);

        groupId = group.entry.id;

        done();
    });

    beforeEach(async (done) => {
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        file = await uploadActions.uploadFile(this.alfrescoJsApi, fileModel.location, fileModel.name, '-my-');

        loginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.goToDocumentList();

        contentList.checkContentIsDisplayed(fileModel.name);
        contentList.rightClickOnRowNamed(fileModel.name);
        contentList.pressContextMenuActionNamed('Permission');

        done();
    });

    afterEach(async (done) => {
        await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, file.entry.id);

        done();
    });

    afterAll(async (done) => {
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.groupsApi.deleteGroup(groupId);
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

});
