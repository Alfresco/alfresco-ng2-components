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

import TestConfig = require('../../test.config');

import { LoginPage } from '../../pages/adf/loginPage';
import { ViewerPage } from '../../pages/adf/viewerPage';
import NavigationBarPage = require('../../pages/adf/navigationBarPage');

import resources = require('../../util/resources');

import FileModel = require('../../models/ACS/fileModel');
import AcsUserModel = require('../../models/ACS/acsUserModel');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../../actions/ACS/upload.actions';
import { SettingsPage } from '../../pages/adf/settingsPage';

describe('Viewer Integration with Router', () => {

    let acsUser;
    let viewerPage = new ViewerPage();
    let loginPage = new LoginPage();
    let navigationBarPage = new NavigationBarPage();
    let settingsPage = new SettingsPage();
    let uploadActions = new UploadActions();

    let pngFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    beforeAll(async (done) => {

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        done();
    });

    beforeEach(async (done) => {
        acsUser = new AcsUserModel();

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        let pngFileUploaded = await uploadActions.uploadFile(this.alfrescoJsApi, pngFile.location, pngFile.name, '-my-');
        Object.assign(pngFile, pngFileUploaded.entry);

        loginPage.goToLoginPage();
        settingsPage.setProviderEcm();

        done();
    });

    afterEach(() => {
        this.alfrescoJsApi.nodes.deleteNode(pngFile.id);
    });

    it('[C260063] Should be able to open file with URL when user is logged in', () => {
        loginPage.login(acsUser.id, acsUser.password);

        navigationBarPage.openViewer(pngFile.id);

        viewerPage.checkImgViewerIsDisplayed();
    });

    it('[C260061] Should be able to open file with URL when user is logged out', () => {
        navigationBarPage.openViewer(pngFile.id);

        loginPage.checkLoginFormIsDisplayed();
        loginPage.login(acsUser.id, acsUser.password);

        viewerPage.checkImgViewerIsDisplayed();
    });
});
