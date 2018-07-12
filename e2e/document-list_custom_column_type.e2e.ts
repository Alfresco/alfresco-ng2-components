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

import LoginPage = require('./pages/adf/loginPage');
import ContentServicesPage = require('./pages/adf/contentServicesPage');
import NavigationBarPage = require('./pages/adf/navigationBarPage');

import AcsUserModel = require('./models/ACS/acsUserModel');
import FileModel = require('./models/ACS/fileModel');
import FolderModel = require('./models/ACS/folderModel');

import TestConfig = require('./test.config');
import resources = require('./util/resources');
import Util = require('./util/util');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from './actions/ACS/upload.actions';

import ErrorPage = require('./pages/adf/documentListErrorPage');

fdescribe('[C260110] - Document List - Custom column type', () => {

    let loginPage = new LoginPage();
    let contentServicesPage = new ContentServicesPage();
    let navBar = new NavigationBarPage();
    let errorPage = new ErrorPage();
    let acsUser = new AcsUserModel();
    let uploadedFolder, folderName;
    let pdfFileModel = new FileModel({ 'name': resources.Files.ADF_DOCUMENTS.PDF.file_name });
    let docxFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.DOCX.file_name,
        'location': resources.Files.ADF_DOCUMENTS.DOCX.file_location
    });
    let testFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TEST.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
    });

    beforeAll(async (done) => {
        let uploadActions = new UploadActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        folderName = `MEESEEKS_${Util.generateRandomString()}_LOOK_AT_ME`;

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        uploadedFolder = await uploadActions.uploadFolder(this.alfrescoJsApi, folderName, '-my-');
        await uploadActions.uploadFile(this.alfrescoJsApi, pdfFileModel.location, pdfFileModel.name, '-my-');
        await uploadActions.uploadFile(this.alfrescoJsApi, docxFileModel.location, docxFileModel.name, '-my-');
        await uploadActions.uploadFile(this.alfrescoJsApi, testFileModel.location, testFileModel.name, '-my-');

        done();
    });

    it('1. Checks that only the files and folders of the users are showed', () => {
        loginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.goToDocumentList();
        contentServicesPage.checkContentIsDisplayed(folderName);
        contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);
        contentServicesPage.checkContentIsDisplayed(docxFileModel.name);
        contentServicesPage.checkContentIsDisplayed(testFileModel.name);
        expect(contentServicesPage.getDocumentListRowNumber()).toBe(5);
    });

    it('2. All columns are showed', () => {
        loginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.goToDocumentList();
        contentServicesPage.checkColumnNameHeader();
        contentServicesPage.checkColumnSizeHeader();
        contentServicesPage.checkColumnCreatedByHeader();
        contentServicesPage.checkColumnCreatedHeader();
    });

});
