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
import { createApiService, LoginPage, StringUtil, UploadActions, UserModel, UsersActions } from '@alfresco/adf-testing';
import { FileModel } from '../../models/ACS/file.model';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { NodeEntry } from '@alfresco/js-api';

describe('Document List Component', () => {
    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const apiService = createApiService();

    const uploadActions = new UploadActions(apiService);
    const navigationBarPage = new NavigationBarPage();
    const usersActions = new UsersActions(apiService);

    let acsUser: UserModel;

    describe('Thumbnails and tooltips', () => {
        const pdfFile = new FileModel({
            name: browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_name,
            location: browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_path
        });

        const folderName = `MEESEEKS_${StringUtil.generateRandomString(5)}_LOOK_AT_ME`;
        let filePdfNode: NodeEntry;
        let folderNode: NodeEntry;

        beforeAll(async () => {
            await apiService.loginWithProfile('admin');

            acsUser = await usersActions.createUser();

            await apiService.login(acsUser.username, acsUser.password);
            filePdfNode = await uploadActions.uploadFile(pdfFile.location, pdfFile.name, '-my-');
            folderNode = await uploadActions.createFolder(folderName, '-my-');
        });

        afterAll(async () => {
            await navigationBarPage.clickLogoutButton();

            await apiService.loginWithProfile('admin');
            if (filePdfNode) {
                await uploadActions.deleteFileOrFolder(filePdfNode.entry.id);
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

        it('[C274701] Should be able to enable thumbnails', async () => {
            await contentServicesPage.enableThumbnails();
            await contentServicesPage.checkAcsContainer();
            const fileIconUrl = await contentServicesPage.getRowIconImageUrl(pdfFile.name);
            await expect(fileIconUrl).toContain(`/versions/1/nodes/${filePdfNode.entry.id}/renditions`);
        });
    });
});
