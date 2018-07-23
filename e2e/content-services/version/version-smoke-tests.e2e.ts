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

import AcsUserModel = require('../../models/ACS/acsUserModel');
import FileModel = require('../../models/ACS/fileModel');

import TestConfig = require('../../test.config');
import resources = require('../../util/resources');
import dateFormat = require('dateformat');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../../actions/ACS/upload.actions';

describe('Version component', () => {

    let loginPage = new LoginPage();
    let contentServicesPage = new ContentServicesPage();
    let viewerPage = new ViewerPage();
    let cardViewPage;

    let acsUser = new AcsUserModel();

    let pdfFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF_ALL.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF_ALL.file_location
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

        let pdfUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, pdfFileModel.location, pdfFileModel.name, '-my-');

        Object.assign(pdfFileModel, pdfUploadedFile.entry);

        pdfFileModel.update(pdfUploadedFile.entry);

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        done();
    });

    it('[C272768] Versions', () => {
        contentServicesPage.navigateToDocumentList();
        viewerPage.viewFile(pdfFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        viewerPage.clickOnVersionsTab().checkUploadVersionsButtonIsDisplayed();
        expect(viewerPage.getActiveTab()).toEqual('VERSIONS');
        viewerPage.checkVersionIsDisplayed(pdfFileModel.name);
    });

});
