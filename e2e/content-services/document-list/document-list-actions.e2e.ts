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

import { LoginPage } from '../../pages/adf/loginPage';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';

import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

import { AcsUserModel } from '../../models/ACS/acsUserModel';
import TestConfig = require('../../test.config');
import resources = require('../../util/resources');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '../../actions/ACS/upload.actions';
import { FileModel } from '../../models/ACS/fileModel';
import { Util } from '../../util/util';
import { browser } from 'protractor';

describe('Document List Component - Actions', () => {

    let loginPage = new LoginPage();
    let contentServicesPage = new ContentServicesPage();
    let contentListPage = contentServicesPage.getDocumentList();
    let navigationBarPage = new NavigationBarPage();

    let uploadedFolder, secondUploadedFolder;
    let uploadActions = new UploadActions();
    let acsUser = null;
    let testFileNode;
    let pdfUploadedNode;
    let folderName;
    let fileNames = [], nrOfFiles = 5;

    let pdfFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF.file_location
    });
    let testFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TEST.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
    });

    let files = {
        base: 'newFile',
        extension: '.txt'
    };

    beforeAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        acsUser = new AcsUserModel();
        folderName = `TATSUMAKY_${Util.generateRandomString(5)}_SENPOUKYAKU`;
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
        pdfUploadedNode = await uploadActions.uploadFile(this.alfrescoJsApi, pdfFileModel.location, pdfFileModel.name, '-my-');
        testFileNode = await uploadActions.uploadFile(this.alfrescoJsApi, testFileModel.location, testFileModel.name, '-my-');
        uploadedFolder = await uploadActions.createFolder(this.alfrescoJsApi, folderName, '-my-');
        secondUploadedFolder = await uploadActions.createFolder(this.alfrescoJsApi, 'secondFolder', '-my-');

        fileNames = Util.generateSequenceFiles(1, nrOfFiles, files.base, files.extension);
        await uploadActions.createEmptyFiles(this.alfrescoJsApi, fileNames, uploadedFolder.entry.id);

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        browser.driver.sleep(15000);
        done();
    });

    beforeEach(async (done) => {
        navigationBarPage.clickContentServicesButton();
        done();
    });

    describe('File Actions', () => {

        it('[C213257] Should be able to copy a file', () => {
            contentServicesPage.checkContentIsDisplayed(pdfUploadedNode.entry.name);

            contentServicesPage.getDocumentList().rightClickOnRow(pdfFileModel.name);
            contentServicesPage.pressContextMenuActionNamed('Copy');
            contentServicesPage.typeIntoNodeSelectorSearchField(folderName);
            contentServicesPage.clickContentNodeSelectorResult(folderName);
            contentServicesPage.clickChooseButton();
            contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);
            contentServicesPage.doubleClickRow(uploadedFolder.entry.name);
            contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);
        });

        it('[C297491] Should be able to move a file', () => {
            contentServicesPage.checkContentIsDisplayed(testFileModel.name);

            contentServicesPage.getDocumentList().rightClickOnRow(testFileModel.name);
            contentServicesPage.pressContextMenuActionNamed('Move');
            contentServicesPage.typeIntoNodeSelectorSearchField(folderName);
            contentServicesPage.clickContentNodeSelectorResult(folderName);
            contentServicesPage.clickChooseButton();
            contentServicesPage.checkContentIsNotDisplayed(testFileModel.name);
            contentServicesPage.doubleClickRow(uploadedFolder.entry.name);
            contentServicesPage.checkContentIsDisplayed(testFileModel.name);
        });

        it('[C280561] Should be able to delete a file via dropdown menu', () => {
            contentServicesPage.doubleClickRow(uploadedFolder.entry.name);

            contentServicesPage.checkContentIsDisplayed(fileNames[0]);
            contentServicesPage.deleteContent(fileNames[0]);
            contentServicesPage.checkContentIsNotDisplayed(fileNames[0]);
        });

        it('[C280562] Should be able to delete multiple files via dropdown menu', () => {
            contentServicesPage.doubleClickRow(uploadedFolder.entry.name);

            contentListPage.selectRow(fileNames[1]);
            contentListPage.selectRow(fileNames[2]);
            contentServicesPage.deleteContent(fileNames[1]);
            contentServicesPage.checkContentIsNotDisplayed(fileNames[1]);
            contentServicesPage.checkContentIsDisplayed(fileNames[2]);
        });

        it('[C280565] Should be able to delete a file using context menu', () => {
            contentServicesPage.doubleClickRow(uploadedFolder.entry.name);

            contentListPage.rightClickOnRow(fileNames[2]);
            contentServicesPage.pressContextMenuActionNamed('Delete');
            contentServicesPage.checkContentIsNotDisplayed(fileNames[2]);
        });

        it('[C280567] Should be able to delete multiple files using context menu', () => {
            contentServicesPage.doubleClickRow(uploadedFolder.entry.name);

            contentListPage.selectRow(fileNames[3]);
            contentListPage.selectRow(fileNames[4]);
            contentListPage.rightClickOnRow(fileNames[3]);
            contentServicesPage.pressContextMenuActionNamed('Delete');
            contentServicesPage.checkContentIsNotDisplayed(fileNames[3]);
            contentServicesPage.checkContentIsDisplayed(fileNames[4]);
        });

        it('[C280566] Should be able to open context menu with right click', () => {
            contentServicesPage.getDocumentList().rightClickOnRow(pdfFileModel.name);
            contentServicesPage.checkContextActionIsVisible('Download');
            contentServicesPage.checkContextActionIsVisible('Copy');
            contentServicesPage.checkContextActionIsVisible('Move');
            contentServicesPage.checkContextActionIsVisible('Delete');
            contentServicesPage.checkContextActionIsVisible('Info');
            contentServicesPage.checkContextActionIsVisible('Manage versions');
            contentServicesPage.checkContextActionIsVisible('Permission');
            contentServicesPage.checkContextActionIsVisible('Lock');
            browser.actions().click(protractor.Button.ESCAPE).perform();
        });

    });

    describe('Folder Actions', () => {

        it('[C260138] Should be able to copy a folder', () => {
            contentServicesPage.copyContent(folderName);
            contentServicesPage.typeIntoNodeSelectorSearchField(secondUploadedFolder.entry.name);
            contentServicesPage.clickContentNodeSelectorResult(secondUploadedFolder.entry.name);
            contentServicesPage.clickChooseButton();
            contentServicesPage.checkContentIsDisplayed(folderName);
            contentServicesPage.doubleClickRow(secondUploadedFolder.entry.name);
            contentServicesPage.checkContentIsDisplayed(folderName);
        });

        it('[C260123] Should be able to delete a folder using context menu', () => {
            contentServicesPage.deleteContent(folderName);
            contentServicesPage.checkContentIsNotDisplayed(folderName);
        });

        it('[C280568] Should be able to open context menu with right click', () => {
            contentServicesPage.checkContentIsDisplayed(secondUploadedFolder.entry.name);

            contentListPage.rightClickOnRow(secondUploadedFolder.entry.name);
            contentServicesPage.checkContextActionIsVisible('Download');
            contentServicesPage.checkContextActionIsVisible('Copy');
            contentServicesPage.checkContextActionIsVisible('Move');
            contentServicesPage.checkContextActionIsVisible('Delete');
            contentServicesPage.checkContextActionIsVisible('Info');
            contentServicesPage.checkContextActionIsVisible('Permission');
        });

    });

});
