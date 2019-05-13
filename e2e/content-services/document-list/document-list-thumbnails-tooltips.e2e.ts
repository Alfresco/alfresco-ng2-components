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

import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import TestConfig = require('../../test.config');
import resources = require('../../util/resources');
import { LoginPage, StringUtil } from '@alfresco/adf-testing';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '../../actions/ACS/upload.actions';
import { FileModel } from '../../models/ACS/fileModel';

describe('Document List Component', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    let uploadedFolder, uploadedFolderExtra;
    const uploadActions = new UploadActions();
    let acsUser = null;
    let testFileNode, pdfBFileNode;

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
        if (uploadedFolderExtra) {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, uploadedFolderExtra.entry.id);
            uploadedFolderExtra = null;
        }
        if (testFileNode) {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, testFileNode.entry.id);
            testFileNode = null;
        }
        if (pdfBFileNode) {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, pdfBFileNode.entry.id);
            pdfBFileNode = null;
        }
        done();
    });

    describe('Thumbnails and tooltips', () => {

        const pdfFile = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
            'location': resources.Files.ADF_DOCUMENTS.PDF.file_location
        });

        const testFile = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.TEST.file_name,
            'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
        });

        const docxFile = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.DOCX.file_name,
            'location': resources.Files.ADF_DOCUMENTS.DOCX.file_location
        });
        const folderName = `MEESEEKS_${StringUtil.generateRandomString(5)}_LOOK_AT_ME`;
        let filePdfNode, fileTestNode, fileDocxNode, folderNode;

        beforeAll(async (done) => {
            acsUser = new AcsUserModel();
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            filePdfNode = await uploadActions.uploadFile(this.alfrescoJsApi, pdfFile.location, pdfFile.name, '-my-');
            fileTestNode = await uploadActions.uploadFile(this.alfrescoJsApi, testFile.location, testFile.name, '-my-');
            fileDocxNode = await uploadActions.uploadFile(this.alfrescoJsApi, docxFile.location, docxFile.name, '-my-');
            folderNode = await uploadActions.createFolder(this.alfrescoJsApi, folderName, '-my-');

            done();
        });

        afterAll(async (done) => {
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            if (filePdfNode) {
                await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, filePdfNode.entry.id);
            }
            if (fileTestNode) {
                await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, fileTestNode.entry.id);
            }
            if (fileDocxNode) {
                await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, fileDocxNode.entry.id);
            }
            if (folderNode) {
                await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, folderNode.entry.id);
            }
            done();
        });

        beforeEach(async () => {
            await loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();
        });

        it('[C260108] Should display tooltip for file\'s name', () => {
            expect(contentServicesPage.getContentList().getTooltip(pdfFile.name)).toEqual(pdfFile.name);
        });

        it('[C260109] Should display tooltip for folder\'s name', () => {
            expect(contentServicesPage.getContentList().getTooltip(folderName)).toEqual(folderName);
        });

        it('[C260119] Should have a specific thumbnail for folders', async (done) => {
            const folderIconUrl = await contentServicesPage.getRowIconImageUrl(folderName);
            expect(folderIconUrl).toContain('/assets/images/ft_ic_folder.svg');
            done();
        });

        it('[C280066] Should have a specific thumbnail PDF files', async (done) => {
            const fileIconUrl = await contentServicesPage.getRowIconImageUrl(pdfFile.name);
            expect(fileIconUrl).toContain('/assets/images/ft_ic_pdf.svg');
            done();
        });

        it('[C280067] Should have a specific thumbnail DOCX files', async (done) => {
            const fileIconUrl = await contentServicesPage.getRowIconImageUrl(docxFile.name);
            expect(fileIconUrl).toContain('/assets/images/ft_ic_ms_word.svg');
            done();
        });

        it('[C280068] Should have a specific thumbnail files', async (done) => {
            const fileIconUrl = await contentServicesPage.getRowIconImageUrl(testFile.name);
            expect(fileIconUrl).toContain('/assets/images/ft_ic_document.svg');
            done();
        });

        it('[C274701] Should be able to enable thumbnails', async (done) => {
            contentServicesPage.enableThumbnails();
            contentServicesPage.checkAcsContainer();
            const fileIconUrl = await contentServicesPage.getRowIconImageUrl(pdfFile.name);
            expect(fileIconUrl).toContain(`/versions/1/nodes/${filePdfNode.entry.id}/renditions`);
            done();
        });
    });

});
