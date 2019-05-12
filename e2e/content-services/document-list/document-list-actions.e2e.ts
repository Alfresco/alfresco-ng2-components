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

import { browser } from 'protractor';
import { LoginPage } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import TestConfig = require('../../test.config');
import resources = require('../../util/resources');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '../../actions/ACS/upload.actions';
import { FileModel } from '../../models/ACS/fileModel';
import { StringUtil } from '@alfresco/adf-testing';
import { Util } from '../../util/util';
import { ContentNodeSelectorDialogPage } from '@alfresco/adf-testing';

describe('Document List Component - Actions', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const navigationBarPage = new NavigationBarPage();
    const contentListPage = contentServicesPage.getDocumentList();
    const contentNodeSelector = new ContentNodeSelectorDialogPage();
    const uploadActions = new UploadActions();

    const alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: TestConfig.adf.url
    });

    describe('Document List Component - Check Actions', () => {

        let uploadedFolder, secondUploadedFolder;
        let acsUser = null;
        let pdfUploadedNode;
        let folderName;
        let fileNames = [];
        const nrOfFiles = 5;

        const pdfFileModel = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
            'location': resources.Files.ADF_DOCUMENTS.PDF.file_location
        });
        const testFileModel = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.TEST.file_name,
            'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
        });

        const files = {
            base: 'newFile',
            extension: '.txt'
        };

        beforeAll(async (done) => {
            acsUser = new AcsUserModel();
            folderName = `TATSUMAKY_${StringUtil.generateRandomString(5)}_SENPOUKYAKU`;
            await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            await alfrescoJsApi.core.peopleApi.addPerson(acsUser);
            await alfrescoJsApi.login(acsUser.id, acsUser.password);
            pdfUploadedNode = await uploadActions.uploadFile(alfrescoJsApi, pdfFileModel.location, pdfFileModel.name, '-my-');
            await uploadActions.uploadFile(alfrescoJsApi, testFileModel.location, testFileModel.name, '-my-');
            uploadedFolder = await uploadActions.createFolder(alfrescoJsApi, folderName, '-my-');
            secondUploadedFolder = await uploadActions.createFolder(alfrescoJsApi, 'secondFolder', '-my-');

            fileNames = Util.generateSequenceFiles(1, nrOfFiles, files.base, files.extension);
            await uploadActions.createEmptyFiles(alfrescoJsApi, fileNames, uploadedFolder.entry.id);

            await loginPage.loginToContentServicesUsingUserModel(acsUser);

            await browser.driver.sleep(15000);
            done();
        });

        beforeEach((done) => {
            navigationBarPage.clickContentServicesButton();
            done();
        });

        describe('File Actions', () => {

            it('[C213257] Should be able to copy a file', () => {
                contentServicesPage.checkContentIsDisplayed(pdfUploadedNode.entry.name);

                contentServicesPage.getDocumentList().rightClickOnRow(pdfFileModel.name);
                contentServicesPage.pressContextMenuActionNamed('Copy');

                contentNodeSelector.checkDialogIsDisplayed();
                contentNodeSelector.typeIntoNodeSelectorSearchField(folderName);
                contentNodeSelector.clickContentNodeSelectorResult(folderName);
                contentNodeSelector.clickMoveCopyButton();
                contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);
                contentServicesPage.doubleClickRow(uploadedFolder.entry.name);
                contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);
            });

            it('[C297491] Should be able to move a file', () => {
                contentServicesPage.checkContentIsDisplayed(testFileModel.name);

                contentServicesPage.getDocumentList().rightClickOnRow(testFileModel.name);
                contentServicesPage.pressContextMenuActionNamed('Move');
                contentNodeSelector.checkDialogIsDisplayed();
                contentNodeSelector.typeIntoNodeSelectorSearchField(folderName);
                contentNodeSelector.clickContentNodeSelectorResult(folderName);
                contentNodeSelector.clickMoveCopyButton();
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

            it('[C280562] Only one file is deleted when multiple files are selected using dropdown menu', () => {
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

            it('[C280567] Only one file is deleted when multiple files are selected using context menu', () => {
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
                contentServicesPage.closeActionContext();
            });

        });

        describe('Folder Actions', () => {

            it('[C260138] Should be able to copy a folder', () => {
                contentServicesPage.copyContent(folderName);
                contentNodeSelector.checkDialogIsDisplayed();
                contentNodeSelector.typeIntoNodeSelectorSearchField(secondUploadedFolder.entry.name);
                contentNodeSelector.clickContentNodeSelectorResult(secondUploadedFolder.entry.name);
                contentNodeSelector.clickMoveCopyButton();
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
});
