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
import { FileModel } from '../../models/ACS/file.model';
import { createApiService,
    BrowserActions,
    LoginPage,
    PaginationPage,
    PermissionActions,
    StringUtil,
    UploadActions,
    UserModel,
    UsersActions
} from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { FolderModel } from '../../models/ACS/folder.model';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { SitesApi } from '@alfresco/js-api';

describe('Delete Directive', () => {

    let baseFolderUploaded;

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const paginationPage = new PaginationPage();
    const navigationBarPage = new NavigationBarPage();

    const contentListPage = contentServicesPage.getDocumentList();
    const acsUser = new UserModel();
    const secondAcsUser = new UserModel();

    const apiService = createApiService();
    const uploadActions = new UploadActions(apiService);
    const permissionActions = new PermissionActions(apiService);
    const usersActions = new UsersActions(apiService);

    const txtFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.TXT.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.TXT.file_path
    });

    const file0BytesModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.TXT_0B.file_path
    });

    const pdfFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_path
    });

    const secondPdfFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PDF_B.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PDF_B.file_path
    });

    const pngFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_path
    });

    const secondPngFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG_B.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG_B.file_path
    });

    const folderInfo = new FolderModel({
        name: 'myFolder',
        location: browser.params.resources.Files.ADF_DOCUMENTS.TEXT_FOLDER.folder_path
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
        await apiService.loginWithProfile('admin');
        await usersActions.createUser(acsUser);
        await usersActions.createUser(secondAcsUser);
    });

    beforeEach(async () => {
        await apiService.login(acsUser.username, acsUser.password);
        baseFolderUploaded = await uploadActions.createFolder(
            baseFolder.name,
            '-my-'
        );
    });

    afterEach(async () => {
        await apiService.loginWithProfile('admin');
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

            await loginPage.login(acsUser.username, acsUser.password);
            await BrowserActions.getUrl(`${browser.baseUrl}/files/${baseFolderUploaded.entry.id}`);
            await contentServicesPage.waitForTableBody();
        });

        afterEach(async () => {
            await navigationBarPage.clickLogoutButton();
        });

        it('[C260188] Delete multiple content', async () => {
            await contentListPage.selectRowsWithKeyboard(txtFileModel.name, file0BytesModel.name, folderSecond.name, folderInfo.name);
            await contentServicesPage.clickDeleteOnToolbar();
            await contentListPage.dataTable.checkContentIsNotDisplayed('Display name', folderInfo.name);
            await contentListPage.dataTable.checkContentIsNotDisplayed('Display name', txtFileModel.name);
            await contentListPage.dataTable.checkContentIsNotDisplayed('Display name', file0BytesModel.name);
            await contentListPage.dataTable.checkContentIsNotDisplayed('Display name', folderSecond.name);
        });

        it('[C260192] Delete file and folder with hierarchy', async () => {
            await contentListPage.selectRowsWithKeyboard(txtFileModel.name, folderInfo.name);
            await contentServicesPage.clickDeleteOnToolbar();
            await contentListPage.dataTable.checkContentIsNotDisplayed('Display name', txtFileModel.name);
            await contentListPage.dataTable.checkContentIsNotDisplayed('Display name', folderInfo.name);
        });

       it('[C260193] Delete file when different selections are set', async () => {
            await contentServicesPage.chooseSelectionMode('None');
            await contentListPage.selectRow(txtFileModel.name);
            await contentListPage.dataTable.checkRowIsNotSelected('Display name', txtFileModel.name);
            await expect(await contentServicesPage.checkToolbarDeleteIsDisabled()).toEqual(true);

            await contentServicesPage.chooseSelectionMode('Single');
            await contentListPage.selectRow(txtFileModel.name);
            await contentListPage.dataTable.checkRowIsSelected('Display name', txtFileModel.name);
            await contentListPage.selectRowsWithKeyboard(folderInfo.name);
            await contentListPage.dataTable.checkRowIsSelected('Display name', folderInfo.name);
            await contentListPage.dataTable.checkRowIsNotSelected('Display name', txtFileModel.name);
            await contentServicesPage.clickDeleteOnToolbar();
            await contentListPage.dataTable.checkContentIsNotDisplayed('Display name', folderInfo.name);
            await contentListPage.dataTable.checkContentIsDisplayed('Display name', txtFileModel.name);

            await contentServicesPage.chooseSelectionMode('Multiple');
            await contentListPage.selectRowsWithKeyboard(txtFileModel.name, file0BytesModel.name);
            await contentServicesPage.clickDeleteOnToolbar();
            await contentListPage.dataTable.checkContentIsNotDisplayed('Display name', txtFileModel.name);
            await contentListPage.dataTable.checkContentIsNotDisplayed('Display name', file0BytesModel.name);
        });
    });

    describe('When selection on multiple pages', () => {
        beforeEach(async () => {
            await apiService.login(acsUser.username, acsUser.password);

            await uploadActions.uploadFile( txtFileModel.location, txtFileModel.name, baseFolderUploaded.entry.id);
            await uploadActions.uploadFile(file0BytesModel.location, file0BytesModel.name, baseFolderUploaded.entry.id);
            await uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, baseFolderUploaded.entry.id);
            await uploadActions.uploadFile(secondPdfFileModel.location, secondPdfFileModel.name, baseFolderUploaded.entry.id);
            await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, baseFolderUploaded.entry.id);
            await uploadActions.uploadFile(secondPngFileModel.location, secondPngFileModel.name, baseFolderUploaded.entry.id);

            await loginPage.login(acsUser.username, acsUser.password);
            await BrowserActions.getUrl(`${browser.baseUrl}/files/${baseFolderUploaded.entry.id}`);
            await contentServicesPage.waitForTableBody();
        });

        afterEach(async () => {
            await navigationBarPage.clickLogoutButton();
        });

        it('[C260191] Delete content selected from different pages', async () => {
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

    describe('when user does not have `delete` permission', () => {
        let createdSite = null;
        let fileTxt; let filePdf; let folderA; let folderB;

        beforeAll(async () => {
            await apiService.login(acsUser.username, acsUser.password);

            const sitesApi = new SitesApi(apiService.getInstance());

            createdSite = await sitesApi.createSite({
                title: StringUtil.generateRandomString(20).toLowerCase(),
                visibility: 'PRIVATE'
            });

            await sitesApi.createSiteMembership(createdSite.entry.id, {
                id: secondAcsUser.username,
                role: 'SiteCollaborator'
            });

            fileTxt = await uploadActions.uploadFile(txtFileModel.location, txtFileModel.name, createdSite.entry.guid);
            filePdf = await uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, createdSite.entry.guid);
            folderA = await uploadActions.createFolder(StringUtil.generateRandomString(5), createdSite.entry.guid);
            folderB = await uploadActions.createFolder(StringUtil.generateRandomString(5), createdSite.entry.guid);

            await permissionActions.addRoleForUser(secondAcsUser.username, 'SiteManager', folderA);
            await permissionActions.addRoleForUser(secondAcsUser.username, 'SiteManager', fileTxt);
            await permissionActions.addRoleForUser(secondAcsUser.username, 'SiteConsumer', folderB);
            await permissionActions.addRoleForUser(secondAcsUser.username, 'SiteConsumer', filePdf);

            await permissionActions.disableInheritedPermissionsForNode(folderA.entry.id);
            await permissionActions.disableInheritedPermissionsForNode(folderB.entry.id);
            await permissionActions.disableInheritedPermissionsForNode(fileTxt.entry.id);
            await permissionActions.disableInheritedPermissionsForNode(filePdf.entry.id);

            await loginPage.login(secondAcsUser.username, secondAcsUser.password);
            await BrowserActions.getUrl(`${browser.baseUrl}/files/${createdSite.entry.guid}`);
            await contentServicesPage.waitForTableBody();
        });

        afterAll(async () => {
            try {
                await apiService.login(acsUser.username, acsUser.password);
                const sitesApi = new SitesApi(apiService.getInstance());
                await sitesApi.deleteSite(createdSite.entry.id, { permanent: true });
            } catch (error) {}
            await navigationBarPage.clickLogoutButton();
        });

        it('[C216426] Delete file without delete permissions', async () => {
            await contentListPage.selectRowWithKeyboard(filePdf.entry.name);
            await contentListPage.dataTable.checkRowIsSelected('Display name', filePdf.entry.name);
            await expect(await contentServicesPage.checkToolbarDeleteIsDisabled()).toEqual(true);
            await contentListPage.selectRowWithKeyboard(folderB.entry.name);
            await contentListPage.dataTable.checkRowIsSelected('Display name', folderB.entry.name);
            await expect(await contentServicesPage.checkToolbarDeleteIsDisabled()).toEqual(true);
            await contentListPage.selectRowWithKeyboard(fileTxt.entry.name);
            await contentListPage.dataTable.checkRowIsSelected('Display name', fileTxt.entry.name);
            await expect(await contentServicesPage.checkToolbarDeleteIsDisabled()).toEqual(true);
        });
    });
});
