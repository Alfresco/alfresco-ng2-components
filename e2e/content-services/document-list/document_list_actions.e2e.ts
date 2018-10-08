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

import { browser } from 'protractor';
import LoginPage = require('../../pages/adf/loginPage');
import ContentServicesPage = require('../../pages/adf/contentServicesPage');
import ContentListPage = require('../../pages/adf/dialog/contentList');
import AcsUserModel = require('../../models/ACS/acsUserModel');
import TestConfig = require('../../test.config');
import resources = require('../../util/resources');
import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../../actions/ACS/upload.actions';
import FileModel = require('../../models/ACS/fileModel');
import Util = require('../../util/util');

describe('Document List Component - Actions', () => {

    let loginPage = new LoginPage();
    let contentServicesPage = new ContentServicesPage();
    let contentListPage = new ContentListPage();
    let uploadedFolder, secondUploadedFolder;
    let uploadActions = new UploadActions();
    let acsUser = null;
    let testFileNode;

    let pdfFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF.file_location
    });
    let testFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TEST.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
    });

    beforeAll(() => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });
    });

    afterEach(async (done) => {
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        if (uploadedFolder) {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, uploadedFolder.entry.id);
            uploadedFolder = null;
        }
        if (testFileNode) {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, testFileNode.entry.id);
            testFileNode = null;
        }
        done();
    });

    describe('File Actions', () => {

        let pdfUploadedNode;
        let folderName;

        beforeEach(async (done) => {
            acsUser = new AcsUserModel();
            folderName = `TATSUMAKY_${Util.generateRandomString(5)}_SENPOUKYAKU`;
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            pdfUploadedNode = await uploadActions.uploadFile(this.alfrescoJsApi, pdfFileModel.location, pdfFileModel.name, '-my-');
            testFileNode = await uploadActions.uploadFile(this.alfrescoJsApi, testFileModel.location, testFileModel.name, '-my-');
            uploadedFolder = await uploadActions.uploadFolder(this.alfrescoJsApi, folderName, '-my-');

            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            done();
        });

        it('[C213257] Should be able to copy a file', () => {
            browser.driver.sleep(12000);

            contentListPage.rightClickOnRowNamed(pdfUploadedNode.entry.name);
            contentListPage.pressContextMenuActionNamed('Copy');
            contentServicesPage.typeIntoNodeSelectorSearchField(folderName);
            contentServicesPage.clickContentNodeSelectorResult(folderName);
            contentServicesPage.clickCopyButton();
            contentServicesPage.checkAcsContainer();
            contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);
            browser.get(TestConfig.adf.url + '/files/' + uploadedFolder.entry.id);
            contentServicesPage.checkAcsContainer();
            contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);
        });

        it('[C280561] Should be able to delete a file via dropdown menu', () => {
            contentListPage.deleteContent(pdfFileModel.name);
            contentListPage.checkContentIsNotDisplayed(pdfFileModel.name);
            pdfUploadedNode = null;
        });

        it('[C280562] Should be able to delete multiple files via dropdown menu', () => {
            contentListPage.clickRowToSelect(pdfFileModel.name);
            contentListPage.clickRowToSelect(testFileModel.name);
            contentListPage.deleteContent(pdfFileModel.name);
            contentListPage.checkContentIsNotDisplayed(pdfFileModel.name);
            contentListPage.checkContentIsDisplayed(testFileModel.name);
        });

        it('[C280565] Should be able to delete a file using context menu', () => {
            contentListPage.rightClickOnRowNamed(pdfFileModel.name);
            contentListPage.pressContextMenuActionNamed('Delete');
            contentListPage.checkContentIsNotDisplayed(pdfFileModel.name);
            pdfUploadedNode = null;
        });

        it('[C280566] Should be able to open context menu with right click', () => {
            contentListPage.rightClickOnRowNamed(pdfFileModel.name);
            contentListPage.checkContextActionIsVisible('Download');
            contentListPage.checkContextActionIsVisible('Copy');
            contentListPage.checkContextActionIsVisible('Move');
            contentListPage.checkContextActionIsVisible('Delete');
            contentListPage.checkContextActionIsVisible('Info');
            contentListPage.checkContextActionIsVisible('Manage versions');
            contentListPage.checkContextActionIsVisible('Permission');
            contentListPage.checkContextActionIsVisible('Lock');
        });

        it('[C280567] Should be able to delete multiple files using context menu', () => {
            contentListPage.clickRowToSelect(pdfFileModel.name);
            contentListPage.clickRowToSelect(testFileModel.name);
            contentListPage.rightClickOnRowNamed(pdfFileModel.name);
            contentListPage.pressContextMenuActionNamed('Delete');
            contentListPage.checkContentIsNotDisplayed(pdfFileModel.name);
            contentListPage.checkContentIsDisplayed(testFileModel.name);
        });

    });

    describe('Folder Actions', () => {

        let folderName, secondfolderName;

        beforeEach(async (done) => {
            acsUser = new AcsUserModel();
            folderName = `TATSUMAKY_${Util.generateRandomString(5)}_SENPOUKYAKU`;
            secondfolderName = `TATSUMAKY_${Util.generateRandomString(5)}_SENPOUKYAKU`;
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            uploadedFolder = await uploadActions.uploadFolder(this.alfrescoJsApi, folderName, '-my-');
            secondUploadedFolder = await uploadActions.uploadFolder(this.alfrescoJsApi, secondfolderName, '-my-');

            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            done();
        });

        it('[C260123] Should be able to delete a folder using context menu', () => {
            contentListPage.deleteContent(folderName);
            contentListPage.checkContentIsNotDisplayed(folderName);
            uploadedFolder = null;
        });

        it('[C280568] Should be able to open context menu with right click', () => {
            contentListPage.rightClickOnRowNamed(folderName);
            contentListPage.checkContextActionIsVisible('Download');
            contentListPage.checkContextActionIsVisible('Copy');
            contentListPage.checkContextActionIsVisible('Move');
            contentListPage.checkContextActionIsVisible('Delete');
            contentListPage.checkContextActionIsVisible('Info');
            contentListPage.checkContextActionIsVisible('Permission');
        });

        it('[C260138] Should be able to copy a folder', () => {
            browser.driver.sleep(12000);

            contentListPage.copyContent(folderName);
            contentServicesPage.typeIntoNodeSelectorSearchField(secondfolderName);
            contentServicesPage.clickContentNodeSelectorResult(secondfolderName);
            contentServicesPage.clickCopyButton();
            contentServicesPage.checkAcsContainer();
            contentServicesPage.checkContentIsDisplayed(folderName);
            browser.get(TestConfig.adf.url + '/files/' + secondUploadedFolder.entry.id);
            contentServicesPage.checkAcsContainer();
            contentServicesPage.checkContentIsDisplayed(folderName);
        });

    });

});
