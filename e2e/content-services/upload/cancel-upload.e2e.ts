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
import { UploadDialog } from '../../pages/adf/dialog/uploadDialog';
import { UploadToggles } from '../../pages/adf/dialog/uploadToggles';

import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';

import TestConfig = require('../../test.config');
import resources = require('../../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '../../actions/ACS/upload.actions';

describe('Upload component', () => {

    const contentServicesPage = new ContentServicesPage();
    const uploadDialog = new UploadDialog();
    const uploadToggles = new UploadToggles();
    const loginPage = new LoginPage();
    const acsUser = new AcsUserModel();
    const uploadActions = new UploadActions();

    const firstPdfFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF_B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF_B.file_location
    });
    const pngFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });
    const largeFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.LARGE_FILE.file_name,
        'location': resources.Files.ADF_DOCUMENTS.LARGE_FILE.file_location
    });

    beforeAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        contentServicesPage.goToDocumentList();

        const pdfUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, firstPdfFileModel.location, firstPdfFileModel.name, '-my-');

        Object.assign(firstPdfFileModel, pdfUploadedFile.entry);

        done();
    });

    beforeEach(() => {
        contentServicesPage.goToDocumentList();
    });

    it('[C272792] Should be possible to cancel upload of a big file using row cancel icon', () => {
        browser.executeScript(' setTimeout(() => {document.querySelector(\'mat-icon[class*="adf-file-uploading-row__action"]\').click();}, 3000)');

        contentServicesPage.uploadFile(largeFile.location);

        expect(uploadDialog.getTitleText()).toEqual('Upload canceled');
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.checkContentIsNotDisplayed(largeFile.name);
    });

    it('[C287790] Should be possible to cancel upload of a big file through the cancel uploads button', () => {
        browser.executeScript(' setInterval(() => {document.querySelector("#adf-upload-dialog-cancel-all").click();' +
            'document.querySelector("#adf-upload-dialog-cancel").click();  }, 500)');

        contentServicesPage.uploadFile(largeFile.location);

        expect(uploadDialog.getTitleText()).toEqual('Upload canceled');
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.checkContentIsNotDisplayed(largeFile.name);
    });

    it('[C272793] Should be able to cancel multiple files upload', () => {
        browser.executeScript(' setInterval(() => {document.querySelector("#adf-upload-dialog-cancel-all").click();' +
            'document.querySelector("#adf-upload-dialog-cancel").click();  }, 500)');

        uploadToggles.enableMultipleFileUpload();
        contentServicesPage.uploadMultipleFile([pngFileModel.location, largeFile.location]);
        expect(uploadDialog.getTitleText()).toEqual('Upload canceled');
        uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();
        contentServicesPage.checkContentIsNotDisplayed(pngFileModel.name).checkContentIsNotDisplayed(largeFile.name);
        uploadToggles.disableMultipleFileUpload();
    });

});
