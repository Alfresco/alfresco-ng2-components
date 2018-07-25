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

import LoginPage = require('../../pages/adf/loginPage');
import ContentServicesPage = require('../../pages/adf/contentServicesPage');
import ViewerPage = require('../../pages/adf/viewerPage');
import ContentListPage = require('../../pages/adf/dialog/contentList');
import { VersionManagePage } from '../../pages/adf/versionManagerPage';

import AcsUserModel = require('../../models/ACS/acsUserModel');
import FileModel = require('../../models/ACS/fileModel');

import TestConfig = require('../../test.config');
import resources = require('../../util/resources');
import dateFormat = require('dateformat');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../../actions/ACS/upload.actions';
import Util = require('../../util/util');
import path = require('path');

fdescribe('Version component', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const contentListPage = new ContentListPage();
    const versionManagePage = new VersionManagePage();
    const viewerPage = new ViewerPage();
    const cardViewPage;

    let acsUser = new AcsUserModel();

    let txtFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });

    beforeAll(async (done) => {

        let uploadActions = new UploadActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        let txtUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, txtFileModel.location, txtFileModel.name, '-my-');

        Object.assign(txtFileModel, txtUploadedFile.entry);

        txtFileModel.update(txtUploadedFile.entry);

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        contentServicesPage.navigateToDocumentList();
        contentListPage.versionManagerContent(txtFileModel.name);

        done();
    });

    it('[C272817] Should NOT be possible download a file when allowDownload property is false', () => {
        versionManagePage.disableDownload();

        versionManagePage.downloadFileVersion('1.0');

        browser.driver.sleep(700);

        expect(Util.fileExists(path.join(__dirname, 'downloads', txtFileModel.name), 20)).toBe(false);
    });

    it('[C272817] Should be possible download a file when allowDownload property is true', () => {
        versionManagePage.enableDownload();

        versionManagePage.downloadFileVersion('1.0');

        browser.driver.sleep(700);

        expect(Util.fileExists(path.join(__dirname, 'downloads', txtFileModel.name), 20)).toBe(true);
    });
});
