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
import { browser } from 'protractor';
import resources = require('../../util/resources');
import { LoginPage, StringUtil, UploadActions } from '@alfresco/adf-testing';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { FileModel } from '../../models/ACS/fileModel';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

describe('Document List Component', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    let uploadedFolder, uploadedFolderExtra;
    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);
    let acsUser = null;
    let testFileNode, pdfBFileNode;
    const navigationBarPage = new NavigationBarPage();

    afterEach(async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        if (uploadedFolder) {
            await uploadActions.deleteFileOrFolder(uploadedFolder.entry.id);
            uploadedFolder = null;
        }
        if (uploadedFolderExtra) {
            await uploadActions.deleteFileOrFolder(uploadedFolderExtra.entry.id);
            uploadedFolderExtra = null;
        }
        if (testFileNode) {
            await uploadActions.deleteFileOrFolder(testFileNode.entry.id);
            testFileNode = null;
        }
        if (pdfBFileNode) {
            await uploadActions.deleteFileOrFolder(pdfBFileNode.entry.id);
            pdfBFileNode = null;
        }

    });

    describe('Thumbnails and tooltips', () => {

        const pdfFile = new FileModel({
            name: resources.Files.ADF_DOCUMENTS.PDF.file_name,
            location: resources.Files.ADF_DOCUMENTS.PDF.file_location
        });

        const testFile = new FileModel({
            name: resources.Files.ADF_DOCUMENTS.TEST.file_name,
            location: resources.Files.ADF_DOCUMENTS.TEST.file_location
        });

        const docxFile = new FileModel({
            name: resources.Files.ADF_DOCUMENTS.DOCX.file_name,
            location: resources.Files.ADF_DOCUMENTS.DOCX.file_location
        });
        const folderName = `MEESEEKS_${StringUtil.generateRandomString(5)}_LOOK_AT_ME`;
        let filePdfNode, fileTestNode, fileDocxNode, folderNode;

        beforeAll(async () => {
            acsUser = new AcsUserModel();
            await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

            await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            filePdfNode = await uploadActions.uploadFile(pdfFile.location, pdfFile.name, '-my-');
            fileTestNode = await uploadActions.uploadFile(testFile.location, testFile.name, '-my-');
            fileDocxNode = await uploadActions.uploadFile(docxFile.location, docxFile.name, '-my-');
            folderNode = await uploadActions.createFolder(folderName, '-my-');

        });

        afterAll(async () => {
            await navigationBarPage.clickLogoutButton();

            await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
            if (filePdfNode) {
                await uploadActions.deleteFileOrFolder(filePdfNode.entry.id);
            }
            if (fileTestNode) {
                await uploadActions.deleteFileOrFolder(fileTestNode.entry.id);
            }
            if (fileDocxNode) {
                await uploadActions.deleteFileOrFolder(fileDocxNode.entry.id);
            }
            if (folderNode) {
                await uploadActions.deleteFileOrFolder(folderNode.entry.id);
            }

        });

        beforeEach(async () => {
            await loginPage.loginToContentServicesUsingUserModel(acsUser);
            await contentServicesPage.goToDocumentList();
        });

        it('[C260108] Should display tooltip for file\'s name', async () => {
            await expect(await contentServicesPage.getDocumentList().getTooltip(pdfFile.name)).toEqual(pdfFile.name);
        });

        it('[C260109] Should display tooltip for folder\'s name', async () => {
            await expect(await contentServicesPage.getDocumentList().getTooltip(folderName)).toEqual(folderName);
        });

        it('[C260119] Should have a specific thumbnail for folders', async () => {
            const folderIconUrl = await contentServicesPage.getRowIconImageUrl(folderName);
            await expect(folderIconUrl).toContain('/assets/images/ft_ic_folder.svg');

        });

        it('[C280066] Should have a specific thumbnail PDF files', async () => {
            const fileIconUrl = await contentServicesPage.getRowIconImageUrl(pdfFile.name);
            await expect(fileIconUrl).toContain('/assets/images/ft_ic_pdf.svg');

        });

        it('[C280067] Should have a specific thumbnail DOCX files', async () => {
            const fileIconUrl = await contentServicesPage.getRowIconImageUrl(docxFile.name);
            await expect(fileIconUrl).toContain('/assets/images/ft_ic_ms_word.svg');

        });

        it('[C280068] Should have a specific thumbnail files', async () => {
            const fileIconUrl = await contentServicesPage.getRowIconImageUrl(testFile.name);
            await expect(fileIconUrl).toContain('/assets/images/ft_ic_document.svg');

        });

        it('[C274701] Should be able to enable thumbnails', async () => {
            await contentServicesPage.enableThumbnails();
            await contentServicesPage.checkAcsContainer();
            const fileIconUrl = await contentServicesPage.getRowIconImageUrl(pdfFile.name);
            await expect(fileIconUrl).toContain(`/versions/1/nodes/${filePdfNode.entry.id}/renditions`);

        });
    });

});
