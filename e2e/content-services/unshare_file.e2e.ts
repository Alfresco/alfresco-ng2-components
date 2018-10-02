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

import LoginPage = require('../pages/adf/loginPage');
import ContentServicesPage = require('../pages/adf/contentServicesPage');
import ContentListPage = require('../pages/adf/dialog/contentList');
import ErrorPage = require('../pages/adf/errorPage');
import { ShareDialog } from '../pages/adf/dialog/shareDialog';

import AcsUserModel = require('../models/ACS/acsUserModel');
import FileModel = require('../models/ACS/fileModel');

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../actions/ACS/upload.actions';
import { browser } from 'protractor';

describe('Unshare file', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const contentListPage = new ContentListPage();
    const errorPage = new ErrorPage();
    const shareDialog = new ShareDialog();

    let acsUser = new AcsUserModel();
    let uploadActions = new UploadActions();

    let pngFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    let nodeId;

    beforeAll(async(done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        let pngUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, pngFileModel.location, pngFileModel.name, '-my-');

        nodeId = pngUploadedFile.entry.id;

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        contentServicesPage.navigateToDocumentList();

        done();
    });

    afterAll(async(done) => {
        await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, nodeId);

        done();
    });

    it('[C280556] Unshared file should show 404 page', async() => {
        contentListPage.clickRowToSelect(pngFileModel.name);

        contentServicesPage.clickShareButton();

        shareDialog.checkDialogIsDisplayed();
        shareDialog.checkShareLinkIsDisplayed();

        let sharedLink = await shareDialog.getShareLink();

        shareDialog.clickShareToggle();
        shareDialog.clickCloseButton();

        browser.get(sharedLink);
        browser.sleep(300);

        errorPage.checkErrorCode();
    });
});
