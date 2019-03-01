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

import { element, by, browser } from 'protractor';

import { LoginPage } from '../../pages/adf/loginPage';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { UploadDialog } from '../../pages/adf/dialog/uploadDialog';
import { UploadToggles } from '../../pages/adf/dialog/uploadToggles';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';
import { FolderModel } from '../../models/ACS/folderModel';

import TestConfig = require('../../test.config');
import resources = require('../../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { DropActions } from '../../actions/drop.actions';
import { ConfigEditorPage } from '../../pages/adf/configEditorPage';

describe('Upload component - Excluded Files', () => {

    let contentServicesPage = new ContentServicesPage();
    let uploadDialog = new UploadDialog();
    let uploadToggles = new UploadToggles();
    let loginPage = new LoginPage();
    let acsUser = new AcsUserModel();
    let navigationBarPage = new NavigationBarPage();
    let configEditorPage = new ConfigEditorPage();

    let iniExcludedFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.INI.file_name,
        'location': resources.Files.ADF_DOCUMENTS.INI.file_location
    });

    let folderWithExcludedFile = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.FOLDER_EXCLUDED.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.FOLDER_EXCLUDED.folder_location
    });

    let txtFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });

    let pngFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
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

    afterEach(async (done) => {
        await browser.refresh();
        done();
    });

    it('[C279914] Should not allow upload default excluded files using D&D', () => {
        contentServicesPage.checkDragAndDropDIsDisplayed();

        let dragAndDropArea = element.all(by.css('adf-upload-drag-area div')).first();

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

        contentServicesPage.uploadFolder(folderWithExcludedFile.location);

        uploadDialog.checkUploadCompleted().then(() => {
            contentServicesPage.doubleClickRow(folderWithExcludedFile.name)
                .checkContentIsNotDisplayed(iniExcludedFile.name)
                .checkContentIsDisplayed('a_file.txt');
        });
    });

    it('[C212862] Should not allow upload file excluded in the files extension of app.config.json', () => {

        navigationBarPage.clickConfigEditorButton();
        configEditorPage.clickFileConfiguration();

        configEditorPage.clickClearButton();

        configEditorPage.enterConfiguration('{' +
            '"excluded": [' +
                '".DS_Store",' +
                '"desktop.ini",' +
                '"*.txt"' +
            '],' +
            '"match-options": {' +
                '"nocase": true' +
            '}}');

        configEditorPage.clickSaveButton();

        contentServicesPage.goToDocumentList();

        contentServicesPage
            .uploadFile(txtFileModel.location)
            .checkContentIsNotDisplayed(txtFileModel.name);
    });

    it('[C274688] Should extension type added as excluded and accepted not be uploaded', () => {

        browser.refresh();

        navigationBarPage.clickConfigEditorButton();

        configEditorPage.clickFileConfiguration();

        configEditorPage.clickClearButton();

        configEditorPage.enterConfiguration('{' +
            '"excluded": [' +
                '".DS_Store",' +
                '"desktop.ini",' +
                '"*.png"' +
            '],' +
            '"match-options": {' +
                '"nocase": true' +
            '}}');

        configEditorPage.clickSaveButton();

        contentServicesPage.goToDocumentList();

        uploadToggles.enableExtensionFilter();
        browser.driver.sleep(1000);
        uploadToggles.addExtension('.png');

        contentServicesPage.uploadFile(pngFile.location);
        browser.driver.sleep(1000);
        contentServicesPage.checkContentIsNotDisplayed(pngFile.name);
    });
});
