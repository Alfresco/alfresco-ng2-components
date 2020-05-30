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

import { ApiService, LoginSSOPage, PaginationPage } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/content-services.page';
import { NavigationBarPage } from '../../pages/adf/navigation-bar.page';
import { AcsUserModel } from '../../models/ACS/acs-user.model';
import { FolderModel } from '../../models/ACS/folder.model';
import { browser } from 'protractor';
import { FileModel } from '../../models/ACS/file.model';
import { UploadDialogPage } from '../../pages/adf/dialog/upload-dialog.page';

describe('Document List - Selection', () => {
    const loginPage = new LoginSSOPage();
    const contentServicesPage = new ContentServicesPage();
    const navigationBarPage = new NavigationBarPage();
    const uploadDialog = new UploadDialogPage();
    const paginationPage = new PaginationPage();
    const acsUser = new AcsUserModel();
    const folderModel = new FolderModel({ name: 'folder' });
    const docxFileModel = new FileModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.DOCX.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.DOCX.file_location
    });
    const displayColumnName = 'Display name';
    const apiService = new ApiService();

    beforeAll(async () => {
        try {
            await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
            await apiService.getInstance().core.peopleApi.addPerson(acsUser);
            await apiService.getInstance().login(acsUser.id, acsUser.password);

            await loginPage.login(acsUser.id, acsUser.password);

            await contentServicesPage.goToDocumentList();
            await contentServicesPage.checkDocumentListElementsAreDisplayed();
            await contentServicesPage.createNewFolder(folderModel.name);
            await contentServicesPage.uploadFile(docxFileModel.location);
            await contentServicesPage.checkContentIsDisplayed(docxFileModel.name);
            await uploadDialog.clickOnCloseButton();
            await uploadDialog.dialogIsNotDisplayed();
        } catch (error) {
            throw new Error(`API call failed in beforeAll: ${error}`);
        }
    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    it('[C274696] Should be able to select and unselect a file or folder', async () => {
        await contentServicesPage.selectRow(docxFileModel.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected(displayColumnName, docxFileModel.name);

        await paginationPage.clickItemsPerPageDropdown();
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected(displayColumnName, docxFileModel.name);

        await contentServicesPage.selectRow(docxFileModel.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsNotSelected(displayColumnName, docxFileModel.name);

        await contentServicesPage.selectRow(folderModel.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected(displayColumnName, folderModel.name);

        await paginationPage.clickItemsPerPageDropdown();
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected(displayColumnName, folderModel.name);

        await contentServicesPage.selectRow(folderModel.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsNotSelected(displayColumnName, folderModel.name);
    });

    it('[C260057] Should be able to choose between the Selection Mode options and select items accordingly', async () => {
        await contentServicesPage.chooseSelectionMode('None');

        await contentServicesPage.selectRow(docxFileModel.name);
        await contentServicesPage.selectFolderWithCommandKey(folderModel.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsNotSelected(displayColumnName, docxFileModel.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsNotSelected(displayColumnName, folderModel.name);
        await expect(JSON.stringify(await contentServicesPage.getItemSelected())).toEqual('[]');

        await contentServicesPage.chooseSelectionMode('Single');

        await contentServicesPage.selectRow(docxFileModel.name);
        await contentServicesPage.selectFolderWithCommandKey(folderModel.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected(displayColumnName, folderModel.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsNotSelected(displayColumnName, docxFileModel.name );
        await expect(JSON.stringify(await contentServicesPage.getItemSelected())).toEqual('[\"' + folderModel.name + '\"]');

        await contentServicesPage.chooseSelectionMode('Multiple');

        await contentServicesPage.selectRow(docxFileModel.name);
        await contentServicesPage.selectFolderWithCommandKey(folderModel.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected(displayColumnName, docxFileModel.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected(displayColumnName, folderModel.name);
        await expect(JSON.stringify(await contentServicesPage.getItemSelected())).toEqual('[\"' + docxFileModel.name + '","' + folderModel.name + '\"]');
    });

    it('[C212928] Should be able to enable the Multiselect (with checkboxes) toggle and select items accordingly', async () => {
        await contentServicesPage.chooseSelectionMode('Multiple');
        await contentServicesPage.clickMultiSelectToggle();
        await expect(await contentServicesPage.multiSelectToggleIsEnabled()).toBe(true);
        await expect(JSON.stringify(await contentServicesPage.getItemSelected())).toEqual('[]');

        await contentServicesPage.selectItemWithCheckbox(docxFileModel.name);
        await contentServicesPage.selectItemWithCheckbox(folderModel.name);
        await expect(JSON.stringify(await contentServicesPage.getItemSelected())).toEqual('[\"' + docxFileModel.name + '","' + folderModel.name + '\"]');

        await contentServicesPage.unSelectItemWithCheckbox(docxFileModel.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected(displayColumnName, folderModel.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsNotSelected(displayColumnName, docxFileModel.name );

        await contentServicesPage.clickSelectAllCheckbox();
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected(displayColumnName, docxFileModel.name);
        await contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected(displayColumnName, folderModel.name);
        await expect(JSON.stringify(await contentServicesPage.getItemSelected())).toEqual('[\"' + folderModel.name + '","' + docxFileModel.name + '\"]');
    });

});
