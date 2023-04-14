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

import { browser, by, element } from 'protractor';
import { createApiService,
    DropActions,
    LocalStorageUtil,
    LoginPage,
    UserModel,
    UsersActions
} from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../core/pages/content-services.page';
import { UploadDialogPage } from '../../core/pages/dialog/upload-dialog.page';
import { UploadTogglesPage } from '../../core/pages/dialog/upload-toggles.page';
import { FileModel } from '../../models/ACS/file.model';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { FolderModel } from '../../models/ACS/folder.model';

describe('Upload component - Excluded Files', () => {

    const contentServicesPage = new ContentServicesPage();
    const uploadDialog = new UploadDialogPage();
    const uploadToggles = new UploadTogglesPage();
    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);

    let acsUser: UserModel;

    const iniExcludedFile = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.INI.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.INI.file_location
    });

    const txtFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });

    const pngFile = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    const folderUpload = new FolderModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.TEXT_FOLDER.folder_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.TEXT_FOLDER.folder_location
    });

    const acceptedFileInsideFolder = new FolderModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.FILE_ACCEPTED_INSIDE_TEXT_FOLDER.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.FILE_ACCEPTED_INSIDE_TEXT_FOLDER.file_location
    });

    const excludedFileInsideFolder = new FolderModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.FILE_EXCLUDED_INSIDE_TEXT_FOLDER.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.FILE_EXCLUDED_INSIDE_TEXT_FOLDER.file_location
    });

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        acsUser = await usersActions.createUser();

        await apiService.login(acsUser.username, acsUser.password);

        await loginPage.login(acsUser.username, acsUser.password);

        await contentServicesPage.goToDocumentList();
   });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
   });

    afterEach(async () => {
        await contentServicesPage.goToDocumentList();
   });

    it('[C279914] Should not allow upload default excluded files using D&D', async () => {
        await contentServicesPage.checkDragAndDropDIsDisplayed();

        const dragAndDropArea = element.all(by.css('adf-upload-drag-area div')).first();

        await DropActions.dropFile(dragAndDropArea, iniExcludedFile.location);

        await browser.sleep(5000);

        await uploadDialog.dialogIsNotDisplayed();

        await contentServicesPage.checkContentIsNotDisplayed(iniExcludedFile.name);
    });

    it('[C260122] Should not allow upload default excluded files using Upload button', async () => {
        await contentServicesPage.uploadFile(iniExcludedFile.location);
        await contentServicesPage.checkContentIsNotDisplayed(iniExcludedFile.name);
    });

    it('[C212862] Should not allow upload file excluded in the files extension of app.config.json', async () => {
        await LocalStorageUtil.setConfigField('files', JSON.stringify({
            excluded: ['.DS_Store', 'desktop.ini', '*.txt'],
            'match-options': { nocase: true }
        }));

        await contentServicesPage.goToDocumentList();

        await contentServicesPage
            .uploadFile(txtFileModel.location);

        await contentServicesPage.checkContentIsNotDisplayed(txtFileModel.name);
    });

    it('[C260125] Should not upload excluded file when they are in a Folder', async () => {
        await LocalStorageUtil.setConfigField('files', JSON.stringify({
            excluded: ['*.cpio'],
            'match-options': { nocase: true }
        }));

        await uploadToggles.enableFolderUpload();
        await contentServicesPage.uploadFolder(folderUpload.location);

        await contentServicesPage.checkContentIsDisplayed(folderUpload.name);

        await uploadDialog.clickOnCloseButton();
        await uploadDialog.dialogIsNotDisplayed();

        await contentServicesPage.openFolder(folderUpload.name);
        await contentServicesPage.checkContentIsDisplayed(acceptedFileInsideFolder.name);
        await contentServicesPage.checkContentIsNotDisplayed(excludedFileInsideFolder.name);
    });

    it('[C274688] Should extension type added as excluded and accepted not be uploaded', async () => {
        await LocalStorageUtil.setConfigField('files', JSON.stringify({
            excluded: ['.DS_Store', 'desktop.ini', '*.png'],
            'match-options': { nocase: true }
        }));

        await contentServicesPage.goToDocumentList();

        await uploadToggles.enableExtensionFilter();
        await browser.sleep(1000);
        await uploadToggles.addExtension('.png');

        await contentServicesPage.uploadFile(pngFile.location);
        await browser.sleep(1000);
        await contentServicesPage.checkContentIsNotDisplayed(pngFile.name);
    });
});
