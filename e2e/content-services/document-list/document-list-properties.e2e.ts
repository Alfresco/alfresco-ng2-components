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

import { createApiService, DropActions, LoginPage, UploadActions, UsersActions } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../core/pages/content-services.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { browser } from 'protractor';
import { FileModel } from '../../models/ACS/file.model';

describe('Document List Component - Properties', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const navigationBar = new NavigationBarPage();

    let subFolder; let parentFolder;
    const apiService = createApiService();
    const uploadActions = new UploadActions(apiService);
    let acsUser = null;
    const usersActions = new UsersActions(apiService);

    const pngFile = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    describe('Allow drop files property', () => {

        beforeEach(async () => {
            await apiService.loginWithProfile('admin');

            acsUser = await usersActions.createUser();
            await apiService.login(acsUser.username, acsUser.password);

            parentFolder = await uploadActions.createFolder('parentFolder', '-my-');
            subFolder = await uploadActions.createFolder('subFolder', parentFolder.entry.id);

            await loginPage.login(acsUser.username, acsUser.password);

            await navigationBar.navigateToContentServices();
            await contentServicesPage.getDocumentList().dataTablePage().waitTillContentLoaded();
        });

        afterEach(async () => {
            await apiService.loginWithProfile('admin');
            await uploadActions.deleteFileOrFolder(subFolder.entry.id);
            await uploadActions.deleteFileOrFolder(parentFolder.entry.id);
            await navigationBar.clickLogoutButton();
        });

        it('[C299154] Should disallow upload content on a folder row if allowDropFiles is false', async () => {
            await contentServicesPage.openFolder(parentFolder.entry.name);
            await contentServicesPage.disableDropFilesInAFolder();
            await browser.sleep(1000);

            const dragAndDropArea = contentServicesPage.getRowByName(subFolder.entry.name);

            await DropActions.dropFile(dragAndDropArea, pngFile.location);
            await contentServicesPage.checkContentIsDisplayed(pngFile.name);
            await contentServicesPage.openFolder(subFolder.entry.name);
            await contentServicesPage.checkEmptyFolderTextToBe('This folder is empty');
        });

        it('[C91319] Should allow upload content on a folder row if allowDropFiles is true', async () => {
            await contentServicesPage.openFolder(parentFolder.entry.name);
            await contentServicesPage.enableDropFilesInAFolder();
            await browser.sleep(1000);

            const dragAndDropArea = contentServicesPage.getRowByName(subFolder.entry.name);

            await DropActions.dropFile(dragAndDropArea, pngFile.location);

            await contentServicesPage.checkContentIsNotDisplayed(pngFile.name);
            await contentServicesPage.openFolder(subFolder.entry.name);
            await contentServicesPage.checkContentIsDisplayed(pngFile.name);
        });
    });
});
