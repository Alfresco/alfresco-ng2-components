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

import { browser } from 'protractor';
import { createApiService,
    ContentNodeSelectorDialogPage,
    LoginPage,
    StringUtil,
    UploadActions,
    UsersActions,
    ViewerPage
} from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../core/pages/content-services.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { FileModel } from '../../models/ACS/file.model';
import { FolderModel } from '../../models/ACS/folder.model';

describe('Document List Component - Actions', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const navigationBarPage = new NavigationBarPage();
    const contentNodeSelector = new ContentNodeSelectorDialogPage();
    const viewerPage = new ViewerPage();
    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);

    const uploadActions = new UploadActions(apiService);

    describe('Document List Component - Check Actions', () => {
        let uploadedFolder; let secondUploadedFolder;
        let acsUser = null;
        let pdfUploadedNode;
        let folderName;
        let fileNames = [];
        const nrOfFiles = 5;

        const pdfFileModel = new FileModel({
            name: browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_name,
            location: browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_path
        });
        const testFileModel = new FileModel({
            name: browser.params.resources.Files.ADF_DOCUMENTS.TEST.file_name,
            location: browser.params.resources.Files.ADF_DOCUMENTS.TEST.file_path
        });

        const files = {
            base: 'newFile',
            extension: '.txt'
        };

        beforeAll(async () => {
            folderName = `TATSUMAKY_${StringUtil.generateRandomString(5)}_SENPOUKYAKU`;
            await apiService.loginWithProfile('admin');
            acsUser = await usersActions.createUser();
            await apiService.login(acsUser.username, acsUser.password);
            pdfUploadedNode = await uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, '-my-');
            await uploadActions.uploadFile(testFileModel.location, testFileModel.name, '-my-');
            uploadedFolder = await uploadActions.createFolder(folderName, '-my-');
            secondUploadedFolder = await uploadActions.createFolder('secondFolder', '-my-');

            fileNames = StringUtil.generateFilesNames(1, nrOfFiles, files.base, files.extension);
            await uploadActions.createEmptyFiles(fileNames, uploadedFolder.entry.id);

            await loginPage.login(acsUser.username, acsUser.password);

            await browser.sleep(browser.params.testConfig.timeouts.index_search); // wait search index previous file/folder uploaded
        });

        afterAll(async () => {
            await navigationBarPage.clickLogoutButton();
        });

        beforeEach(async () => {
            await navigationBarPage.navigateToContentServices();
            await contentServicesPage.contentList.dataTablePage().waitTillContentLoaded();
        });

        describe('File Actions', () => {
            it('[C213257] Should be able to copy a file', async () => {
                await contentServicesPage.checkContentIsDisplayed(pdfUploadedNode.entry.name);
                await contentServicesPage.getDocumentList().rightClickOnRow(pdfFileModel.name);
                await contentServicesPage.pressContextMenuActionNamed('Copy');
                await contentNodeSelector.checkDialogIsDisplayed();
                await contentNodeSelector.typeIntoNodeSelectorSearchField(folderName);
                await contentNodeSelector.clickContentNodeSelectorResult(folderName);
                await contentNodeSelector.clickMoveCopyButton();
                await contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);
                await contentServicesPage.openFolder(uploadedFolder.entry.name);
                await contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);
            });

            it('[C260131] Copy - Destination picker search', async () => {
                await contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);
                await contentServicesPage.getDocumentList().rightClickOnRow(pdfFileModel.name);
                await contentServicesPage.pressContextMenuActionNamed('Copy');
                await contentNodeSelector.checkDialogIsDisplayed();
                await contentNodeSelector.typeIntoNodeSelectorSearchField(folderName);
                await contentNodeSelector.contentListPage().dataTablePage().checkCellByHighlightContent(folderName);
                await contentNodeSelector.clickCancelButton();
                await contentNodeSelector.checkDialogIsNotDisplayed();
            });

            it('[C297491] Should be able to move a file', async () => {
                await contentServicesPage.checkContentIsDisplayed(testFileModel.name);

                await contentServicesPage.getDocumentList().rightClickOnRow(testFileModel.name);
                await contentServicesPage.pressContextMenuActionNamed('Move');
                await contentNodeSelector.checkDialogIsDisplayed();
                await contentNodeSelector.typeIntoNodeSelectorSearchField(folderName);
                await contentNodeSelector.clickContentNodeSelectorResult(folderName);
                await contentNodeSelector.clickMoveCopyButton();
                await contentServicesPage.checkContentIsNotDisplayed(testFileModel.name);
                await contentServicesPage.openFolder(uploadedFolder.entry.name);
                await contentServicesPage.checkContentIsDisplayed(testFileModel.name);
            });

            it('[C260127] Move - Destination picker search', async () => {
                await contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);
                await contentServicesPage.getDocumentList().rightClickOnRow(pdfFileModel.name);
                await contentServicesPage.pressContextMenuActionNamed('Move');
                await contentNodeSelector.checkDialogIsDisplayed();
                await contentNodeSelector.typeIntoNodeSelectorSearchField(folderName);
                await contentNodeSelector.contentListPage().dataTablePage().checkCellByHighlightContent(folderName);
                await contentNodeSelector.clickCancelButton();
                await contentNodeSelector.checkDialogIsNotDisplayed();
            });

            it('[C280561] Should be able to delete a file via dropdown menu', async () => {
                await contentServicesPage.openFolder(uploadedFolder.entry.name);

                await contentServicesPage.checkContentIsDisplayed(fileNames[0]);
                await contentServicesPage.deleteContent(fileNames[0]);
                await contentServicesPage.checkContentIsNotDisplayed(fileNames[0]);
            });

            it('[C280562] Only one file is deleted when multiple files are selected using dropdown menu', async () => {
                await contentServicesPage.openFolder(uploadedFolder.entry.name);

                await contentServicesPage.getDocumentList().selectRow(fileNames[1]);
                await contentServicesPage.getDocumentList().selectRow(fileNames[2]);
                await contentServicesPage.deleteContent(fileNames[1]);
                await contentServicesPage.checkContentIsNotDisplayed(fileNames[1]);
                await contentServicesPage.checkContentIsDisplayed(fileNames[2]);
            });

            it('[C280565] Should be able to delete a file using context menu', async () => {
                await contentServicesPage.openFolder(uploadedFolder.entry.name);
                await contentServicesPage.checkContentIsDisplayed(fileNames[2]);
                await contentServicesPage.getDocumentList().rightClickOnRow(fileNames[2]);
                await contentServicesPage.pressContextMenuActionNamed('Delete');
                await contentServicesPage.checkContentIsNotDisplayed(fileNames[2]);
            });

            it('[C280567] Only one file is deleted when multiple files are selected using context menu', async () => {
                await contentServicesPage.openFolder(uploadedFolder.entry.name);

                await contentServicesPage.getDocumentList().selectRow(fileNames[3]);
                await contentServicesPage.getDocumentList().selectRow(fileNames[4]);
                await contentServicesPage.getDocumentList().rightClickOnRow(fileNames[3]);
                await contentServicesPage.pressContextMenuActionNamed('Delete');
                await contentServicesPage.checkContentIsNotDisplayed(fileNames[3]);
                await contentServicesPage.checkContentIsDisplayed(fileNames[4]);
            });

            it('[C280566] Should be able to open context menu with right click', async () => {
                await contentServicesPage.getDocumentList().rightClickOnRow(pdfFileModel.name);
                await contentServicesPage.checkContextActionIsVisible('Download');
                await contentServicesPage.checkContextActionIsVisible('Copy');
                await contentServicesPage.checkContextActionIsVisible('Move');
                await contentServicesPage.checkContextActionIsVisible('Delete');
                await contentServicesPage.checkContextActionIsVisible('Info');
                await contentServicesPage.checkContextActionIsVisible('Manage versions');
                await contentServicesPage.checkContextActionIsVisible('Permission');
                await contentServicesPage.checkContextActionIsVisible('Lock');
                await contentServicesPage.closeActionContext();
            });

            it('[C260060] Should be able to open a file/folder through double click action - file', async () => {
                await contentServicesPage.doubleClickRow(pdfFileModel.name);
                await expect(await viewerPage.getDisplayedFileName()).toEqual(pdfFileModel.name);
                await viewerPage.checkPreviewFileDefaultOptionsAreDisplayed();
                await viewerPage.clickCloseButton();
            });
        });

        describe('Folder Actions', () => {
            it('[C260138] Should be able to copy a folder', async () => {
                await contentServicesPage.copyContent(folderName);
                await contentNodeSelector.checkDialogIsDisplayed();
                await contentNodeSelector.typeIntoNodeSelectorSearchField(secondUploadedFolder.entry.name);
                await contentNodeSelector.clickContentNodeSelectorResult(secondUploadedFolder.entry.name);
                await contentNodeSelector.clickMoveCopyButton();
                await contentServicesPage.checkContentIsDisplayed(folderName);
                await contentServicesPage.openFolder(secondUploadedFolder.entry.name);
                await contentServicesPage.checkContentIsDisplayed(folderName);
            });

            it('[C260060] Should be able to open a file/folder through double click action - folder', async () => {
                const folderTwoModel = new FolderModel({ name: 'folderTwo' });
                const numberOfSubFolders = 3;

                await contentServicesPage.createNewFolder(folderTwoModel.name);
                const nodeIdSubFolderTwo = await contentServicesPage.getAttributeValueForElement(folderTwoModel.name, 'Node id');
                await contentServicesPage.openFolder(folderTwoModel.name);

                for (let i = 0; i < numberOfSubFolders; i++) {
                    await uploadActions.createFolder('subfolder' + (i + 1), nodeIdSubFolderTwo);
                }

                await browser.refresh();

                await contentServicesPage.checkContentsAreDisplayed(numberOfSubFolders);
            });

            it('[C260123] Should be able to delete a folder using context menu', async () => {
                await contentServicesPage.deleteContent(folderName);
                await contentServicesPage.checkContentIsNotDisplayed(folderName);
            });

            it('[C280568] Should be able to open context menu with right click', async () => {
                await contentServicesPage.checkContentIsDisplayed(secondUploadedFolder.entry.name);

                await contentServicesPage.getDocumentList().rightClickOnRow(secondUploadedFolder.entry.name);
                await contentServicesPage.checkContextActionIsVisible('Download');
                await contentServicesPage.checkContextActionIsVisible('Copy');
                await contentServicesPage.checkContextActionIsVisible('Move');
                await contentServicesPage.checkContextActionIsVisible('Delete');
                await contentServicesPage.checkContextActionIsVisible('Info');
                await contentServicesPage.checkContextActionIsVisible('Permission');
            });
        });
    });

});
