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

import { element, by, browser } from 'protractor';

import LoginPage = require('../../pages/adf/loginPage');
import ContentServicesPage = require('../../pages/adf/contentServicesPage');
import UploadDialog = require('../../pages/adf/dialog/uploadDialog');
import UploadToggles = require('../../pages/adf/dialog/uploadToggles');

import AcsUserModel = require('../../models/ACS/acsUserModel');
import FileModel = require('../../models/ACS/fileModel');
import FolderModel = require('../../models/ACS/folderModel');

import TestConfig = require('../../test.config');
import resources = require('../../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { DropActions } from '../../actions/drop.actions';

describe('Upload component - Excluded Files', () => {

    let contentServicesPage = new ContentServicesPage();
    let uploadDialog = new UploadDialog();
    let uploadToggles = new UploadToggles();
    let loginPage = new LoginPage();
    let acsUser = new AcsUserModel();

    let iniExcludedFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.INI.file_name,
        'location': resources.Files.ADF_DOCUMENTS.INI.file_location
    });

    let folderWithExcludedFile = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.FOLDER_EXCLUDED.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.FOLDER_EXCLUDED.folder_location
    });

    beforeAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        contentServicesPage.goToDocumentList();

        done();
    });

    it('[C279914] Should not allow upload default excluded files using D&D', () => {
        contentServicesPage.checkDandDIsDisplayed();

        let dragAndDropArea = element(by.css('adf-upload-drag-area div'));

        let dragAndDrop = new DropActions();

        dragAndDrop.dropFile(dragAndDropArea, iniExcludedFile.location);

        browser.driver.sleep(5000);

        uploadDialog.dialogIsNotDisplayed();

        contentServicesPage.checkContentIsNotDisplayed(iniExcludedFile.name);
    });

    it('[C260122] Should not allow upload default excluded files using Upload button', () => {
        contentServicesPage
            .uploadFile(iniExcludedFile.location)
            .checkContentIsNotDisplayed(iniExcludedFile.name);
    });

    it('[C260125] Should not upload excluded file when they are in a Folder', () => {
        uploadToggles.enableFolderUpload();

        contentServicesPage.uploadFolder(folderWithExcludedFile.location).checkContentIsDisplayed(folderWithExcludedFile.name);

        contentServicesPage.doubleClickRow(folderWithExcludedFile.name).checkContentIsNotDisplayed(iniExcludedFile.name).checkContentIsDisplayed('a_file.txt');
    });
});
