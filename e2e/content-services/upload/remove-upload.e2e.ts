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

import { LoginPage, BrowserActions } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { UploadDialog } from '../../pages/adf/dialog/uploadDialog';
import { VersionManagePage } from '../../pages/adf/versionManagerPage';

import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';

import TestConfig = require('../../test.config');
import resources = require('../../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';

describe('Upload component', () => {
    const contentServicesPage = new ContentServicesPage();
    const uploadDialog = new UploadDialog();
    const versionManagePage = new VersionManagePage();
    const loginPage = new LoginPage();
    const acsUser = new AcsUserModel();

    const docxFileModel = new FileModel({
        name: resources.Files.ADF_DOCUMENTS.DOCX_SUPPORTED.file_name,
        location: resources.Files.ADF_DOCUMENTS.DOCX_SUPPORTED.file_location
    });

    const fileModelVersion = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    beforeAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(
            TestConfig.adf.adminEmail,
            TestConfig.adf.adminPassword
        );

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        done();
    });

    it('should remove uploaded file', () => {
        contentServicesPage.goToDocumentList();
        contentServicesPage.uploadFile(docxFileModel.location);
        uploadDialog.fileIsUploaded(docxFileModel.name);
        uploadDialog
            .removeUploadedFile(docxFileModel.name)
            .fileIsCancelled(docxFileModel.name)
            .clickOnCloseButton();
    });

    it('should not have remove action if uploaded file is a file version', () => {
        contentServicesPage.goToDocumentList();
        contentServicesPage.uploadFile(docxFileModel.location);
        uploadDialog.fileIsUploaded(docxFileModel.name);
        contentServicesPage.checkContentIsDisplayed(docxFileModel.name);

        contentServicesPage.versionManagerContent(docxFileModel.name);
        BrowserActions.click(versionManagePage.showNewVersionButton);
        versionManagePage.uploadNewVersionFile(
            fileModelVersion.location
        );
        versionManagePage.closeVersionDialog();
        uploadDialog.removeUploadedFile(fileModelVersion.name);
        contentServicesPage.checkContentIsDisplayed(fileModelVersion.name);
    });
});
