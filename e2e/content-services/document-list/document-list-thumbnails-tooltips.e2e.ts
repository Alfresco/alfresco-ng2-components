/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ContentServicesPage } from '../../core/pages/content-services.page';
import { browser } from 'protractor';
import { createApiService, LoginPage, StringUtil, UploadActions, UsersActions } from '@alfresco/adf-testing';
import { FileModel } from '../../models/ACS/file.model';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';

describe('Document List Component', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    let uploadedFolder; let uploadedFolderExtra;
    const apiService = createApiService();

    const uploadActions = new UploadActions(apiService);
    let acsUser = null;
    let testFileNode; let pdfBFileNode;
    const navigationBarPage = new NavigationBarPage();
    const usersActions = new UsersActions(apiService);

    afterEach(async () => {
        await apiService.loginWithProfile('admin');
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
            name: browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_name,
            location: browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_path
        });

        const testFile = new FileModel({
            name: browser.params.resources.Files.ADF_DOCUMENTS.TEST.file_name,
            location: browser.params.resources.Files.ADF_DOCUMENTS.TEST.file_path
        });

        const docxFile = new FileModel({
            name: browser.params.resources.Files.ADF_DOCUMENTS.DOCX.file_name,
            location: browser.params.resources.Files.ADF_DOCUMENTS.DOCX.file_path
        });
        const folderName = `MEESEEKS_${StringUtil.generateRandomString(5)}_LOOK_AT_ME`;
        let filePdfNode; let fileTestNode; let fileDocxNode; let folderNode;

        beforeAll(async () => {
            await apiService.loginWithProfile('admin');

            acsUser = await usersActions.createUser();

            await apiService.login(acsUser.username, acsUser.password);
            filePdfNode = await uploadActions.uploadFile(pdfFile.location, pdfFile.name, '-my-');
            fileTestNode = await uploadActions.uploadFile(testFile.location, testFile.name, '-my-');
            fileDocxNode = await uploadActions.uploadFile(docxFile.location, docxFile.name, '-my-');
            folderNode = await uploadActions.createFolder(folderName, '-my-');
        });

        afterAll(async () => {
            await navigationBarPage.clickLogoutButton();

            await apiService.loginWithProfile('admin');
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
            await loginPage.login(acsUser.username, acsUser.password);
            await contentServicesPage.goToDocumentList();
        });

        afterEach(async () => {
            await navigationBarPage.clickLogoutButton();
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
