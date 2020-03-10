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

import { ContentServicesPage } from '../../pages/adf/content-services.page';
import { AcsUserModel } from '../../models/ACS/acs-user.model';
import { FileModel } from '../../models/ACS/file.model';
import { LoginPage, UploadActions, PaginationPage } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { NavigationBarPage } from '../../pages/adf/navigation-bar.page';
import { FolderModel } from '../../models/ACS/folder.model';
/*tslint:disable*/
describe('Delete Directive', () => {

    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const navigationBarPage = new NavigationBarPage();
    const paginationPage = new PaginationPage();
    const contentListPage = contentServicesPage.getDocumentList();
    const acsUser = new AcsUserModel();
    const uploadActions = new UploadActions(this.alfrescoJsApi);
    let baseFolderUploaded;

    const txtFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.TXT.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.TXT.file_location
    });

    const file0BytesModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });

    const pdfFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_location
    });

    const secondPdfFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PDF_B.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PDF_B.file_location
    });

    const pngFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    const secondPngFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG_B.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG_B.file_location
    });

    const folderInfo = new FolderModel({
        name: 'myFolder',
        location: browser.params.resources.Files.ADF_DOCUMENTS.TEXT_FOLDER.folder_location
    });

    const folderSecond = new FolderModel({
        name: 'myrSecondFolder',
        location: browser.params.resources.Files.ADF_DOCUMENTS.TEXT_FOLDER.folder_location
    });

    const baseFolder = new FolderModel({
        name: 'BASE_FOLDER',
        location: browser.params.resources.Files.ADF_DOCUMENTS.TEXT_FOLDER.folder_location
    });

    beforeAll(async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
    });

    beforeEach(async () => {
        baseFolderUploaded = await uploadActions.createFolder(
            baseFolder.name,
            '-my-'
        );
    });

    afterEach(async () => {
        await uploadActions.deleteFileOrFolder(baseFolderUploaded.entry.id);
    });

    describe('Handling multiselection', () => {

        beforeEach(async () => {
            await uploadActions.uploadFile(txtFileModel.location, txtFileModel.name, baseFolderUploaded.entry.id);
            await uploadActions.uploadFile(file0BytesModel.location, file0BytesModel.name, baseFolderUploaded.entry.id);
            const textFolderUploaded = await uploadActions.createFolder(folderInfo.name, baseFolderUploaded.entry.id);
            await uploadActions.uploadFolder(folderInfo.location, textFolderUploaded.entry.id);
            await uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, textFolderUploaded.entry.id);
            await uploadActions.createFolder(folderSecond.name, baseFolderUploaded.entry.id);

            await loginPage.loginToContentServicesUsingUserModel(acsUser);
            await navigationBarPage.clickContentServicesButton();
            await contentServicesPage.waitForTableBody();
            await contentServicesPage.doubleClickRow(baseFolder.name);
            await contentServicesPage.waitForTableBody();
        });

        it('[C260188] - Delete multiple content', async () => {
            await contentListPage.selectRowWithKeyboard(txtFileModel.name);
            await contentListPage.dataTable.checkRowIsSelected('Display name', txtFileModel.name);
            await contentListPage.selectRowWithKeyboard(file0BytesModel.name);
            await contentListPage.dataTable.checkRowIsSelected('Display name', txtFileModel.name);
            await contentListPage.dataTable.checkRowIsSelected('Display name', file0BytesModel.name);
            await contentListPage.selectRowWithKeyboard(folderSecond.name);
            await contentListPage.dataTable.checkRowIsSelected('Display name', txtFileModel.name);
            await contentListPage.dataTable.checkRowIsSelected('Display name', file0BytesModel.name);
            await contentListPage.dataTable.checkRowIsSelected('Display name', folderSecond.name);
            await contentListPage.selectRowWithKeyboard(folderInfo.name);
            await contentListPage.dataTable.checkRowIsSelected('Display name', folderInfo.name);
            await contentListPage.dataTable.checkRowIsSelected('Display name', txtFileModel.name);
            await contentListPage.dataTable.checkRowIsSelected('Display name', file0BytesModel.name);
            await contentListPage.dataTable.checkRowIsSelected('Display name', folderSecond.name);
            await contentServicesPage.clickDeleteOnToolbar();
            await contentListPage.dataTable.checkContentIsNotDisplayed('Display name', folderInfo.name);
            await contentListPage.dataTable.checkContentIsNotDisplayed('Display name', txtFileModel.name);
            await contentListPage.dataTable.checkContentIsNotDisplayed('Display name', file0BytesModel.name);
            await contentListPage.dataTable.checkContentIsNotDisplayed('Display name', folderSecond.name);
        });

        it('[C260192] - Delete file and folder with hierarchy', async () => {
            await contentListPage.selectRowWithKeyboard(txtFileModel.name);
            await contentListPage.dataTable.checkRowIsSelected('Display name', txtFileModel.name);
            await contentListPage.selectRowWithKeyboard(folderInfo.name);
            await contentListPage.dataTable.checkRowIsSelected('Display name', folderInfo.name);
            await contentServicesPage.clickDeleteOnToolbar();
            await contentListPage.dataTable.checkContentIsNotDisplayed('Display name', txtFileModel.name);
            await contentListPage.dataTable.checkContentIsNotDisplayed('Display name', folderInfo.name);
        });

        it('[C260193] - Delete file when different selections are set', async () => {
            await contentServicesPage.chooseSelectionMode('None');
            await contentListPage.selectRow(txtFileModel.name);
            await contentListPage.dataTable.checkRowIsNotSelected('Display name', txtFileModel.name);
            await contentServicesPage.checkToolbarDeleteIsDisabled();

            await contentServicesPage.chooseSelectionMode('Single');
            await contentListPage.selectRow(txtFileModel.name);
            await contentListPage.dataTable.checkRowIsSelected('Display name', txtFileModel.name);
            await contentListPage.selectRowWithKeyboard(folderInfo.name);
            await contentListPage.dataTable.checkRowIsSelected('Display name', folderInfo.name);
            await contentListPage.dataTable.checkRowIsNotSelected('Display name', txtFileModel.name);
            await contentServicesPage.clickDeleteOnToolbar();
            await contentListPage.dataTable.checkContentIsNotDisplayed('Display name', folderInfo.name);
            await contentListPage.dataTable.checkContentIsDisplayed('Display name', txtFileModel.name);

            await contentServicesPage.chooseSelectionMode('Multiple');
            await contentListPage.selectRow(txtFileModel.name);
            await contentListPage.dataTable.checkRowIsSelected('Display name', txtFileModel.name);
            await contentListPage.selectRowWithKeyboard(file0BytesModel.name);
            await contentListPage.dataTable.checkRowIsSelected('Display name', file0BytesModel.name);
            await contentServicesPage.clickDeleteOnToolbar();
            await contentListPage.dataTable.checkContentIsNotDisplayed('Display name', txtFileModel.name);
            await contentListPage.dataTable.checkContentIsNotDisplayed('Display name', file0BytesModel.name);
        });
    });

    describe('When selection on multiple pages', () => {

        beforeEach(async () => {
            await uploadActions.uploadFile( txtFileModel.location, txtFileModel.name, baseFolderUploaded.entry.id);
            await uploadActions.uploadFile(file0BytesModel.location, file0BytesModel.name, baseFolderUploaded.entry.id);
            await uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, baseFolderUploaded.entry.id);
            await uploadActions.uploadFile(secondPdfFileModel.location, secondPdfFileModel.name, baseFolderUploaded.entry.id);
            await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, baseFolderUploaded.entry.id);
            await uploadActions.uploadFile(secondPngFileModel.location, secondPngFileModel.name, baseFolderUploaded.entry.id);

            await loginPage.loginToContentServicesUsingUserModel(acsUser);
            await navigationBarPage.clickContentServicesButton();
            await contentServicesPage.waitForTableBody();
            await contentServicesPage.doubleClickRow(baseFolder.name);
            await contentServicesPage.waitForTableBody();
        })

        it('[C260191] - Delete content selected from different pages', async () => {
            await contentServicesPage.sortByName('ASC');
            await paginationPage.selectItemsPerPage('5');

            await contentListPage.selectRowWithKeyboard(txtFileModel.name);
            await contentListPage.dataTable.checkRowIsSelected('Display name', txtFileModel.name);
            await paginationPage.clickOnNextPage();
            await contentListPage.selectRowWithKeyboard(file0BytesModel.name);
            await contentListPage.dataTable.checkRowIsSelected('Display name', file0BytesModel.name);
            await contentServicesPage.clickDeleteOnToolbar();
            await contentListPage.dataTable.checkContentIsNotDisplayed('Display name', file0BytesModel.name);
            await contentListPage.dataTable.checkContentIsDisplayed('Display name', txtFileModel.name);
        });

    });
});
