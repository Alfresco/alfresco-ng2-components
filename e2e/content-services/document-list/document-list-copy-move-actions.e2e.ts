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
import {
    LoginPage,
    UploadActions,
    StringUtil,
    ContentNodeSelectorDialogPage,
    NotificationHistoryPage
} from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import resources = require('../../util/resources');
import {AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { FileModel } from '../../models/ACS/fileModel';

describe('Document List Component - Actions Move and Copy', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const navigationBarPage = new NavigationBarPage();
    const contentNodeSelector = new ContentNodeSelectorDialogPage();
    const notificationHistoryPage = new NotificationHistoryPage();

    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf.url
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);

    let uploadedFolder, uploadedFile, sourceFolder, destinationFolder, subFolder, subFile;
    let acsUser = null;
    let folderName;

    const pdfFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF.file_location
    });

    const testFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TEST.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
    });

    beforeAll(async (done) => {
        acsUser = new AcsUserModel();
        folderName = StringUtil.generateRandomString(5);
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
        uploadedFolder = await uploadActions.createFolder(folderName, '-my-');
        destinationFolder = await uploadActions.createFolder(StringUtil.generateRandomString(5), '-my-');
        sourceFolder = await uploadActions.createFolder(StringUtil.generateRandomString(5), '-my-');
        subFolder = await uploadActions.createFolder(StringUtil.generateRandomString(5), sourceFolder.entry.id);
        subFile = await uploadActions.uploadFile(testFileModel.location, testFileModel.name, subFolder.entry.id);
        await uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, uploadedFolder.entry.id);
        uploadedFile = await uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, '-my-');

        await loginPage.loginToContentServicesUsingUserModel(acsUser);
        browser.driver.sleep(10000);
        done();
    });

    afterAll(async (done) => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        uploadActions.deleteFileOrFolder(uploadedFolder.entry.id);
        uploadActions.deleteFileOrFolder(uploadedFile.entry.id);
        uploadActions.deleteFileOrFolder(sourceFolder.entry.id);
        uploadActions.deleteFileOrFolder(destinationFolder.entry.id);
        done();
    });

    beforeEach((done) => {
        navigationBarPage.clickContentServicesButton();
        done();
    });

    it('[C260128] Move - Same name file', () => {
        contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);
        contentServicesPage.getDocumentList().rightClickOnRow(pdfFileModel.name);
        contentServicesPage.pressContextMenuActionNamed('Move');
        contentNodeSelector.checkDialogIsDisplayed();
        contentNodeSelector.typeIntoNodeSelectorSearchField(folderName);
        contentNodeSelector.clickContentNodeSelectorResult(folderName);
        contentNodeSelector.clickMoveCopyButton();
        notificationHistoryPage.checkNotifyContains('This name is already in use, try a different name.');
    });

    it('[C260134] Move - folder with subfolder and file within it', () => {
        contentServicesPage.checkContentIsDisplayed(destinationFolder.entry.name);
        contentServicesPage.checkContentIsDisplayed(sourceFolder.entry.name);
        contentServicesPage.getDocumentList().rightClickOnRow(sourceFolder.entry.name);
        contentServicesPage.pressContextMenuActionNamed('Move');
        contentNodeSelector.checkDialogIsDisplayed();
        contentNodeSelector.typeIntoNodeSelectorSearchField(destinationFolder.entry.name);
        contentNodeSelector.clickContentNodeSelectorResult(destinationFolder.entry.name);
        contentNodeSelector.clickMoveCopyButton();
        contentServicesPage.checkContentIsNotDisplayed(sourceFolder.entry.name);
        contentServicesPage.doubleClickRow(destinationFolder.entry.name);
        contentServicesPage.checkContentIsDisplayed(sourceFolder.entry.name);
        contentServicesPage.doubleClickRow(sourceFolder.entry.name);
        contentServicesPage.checkContentIsDisplayed(subFolder.entry.name);
        contentServicesPage.doubleClickRow(subFolder.entry.name);
        contentServicesPage.checkContentIsDisplayed(subFile.entry.name);
    });

});
