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

import { browser } from 'protractor';
import { LoginSSOPage, UploadActions, StringUtil, ViewerPage, ApiService } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../../pages/adf/content-services.page';
import CONSTANTS = require('../../../util/constants');
import { FolderModel } from '../../../models/ACS/folder.model';
import { AcsUserModel } from '../../../models/ACS/acs-user.model';
import { NavigationBarPage } from '../../../pages/adf/navigation-bar.page';

describe('Viewer', () => {

    const viewerPage = new ViewerPage();
    const loginPage = new LoginSSOPage();
    const contentServicesPage = new ContentServicesPage();
    const navigationBarPage = new NavigationBarPage();
    const apiService = new ApiService();

    const uploadActions = new UploadActions(apiService);
    let site;
    const acsUser = new AcsUserModel();

    const wordFolderInfo = new FolderModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.WORD_FOLDER.folder_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.WORD_FOLDER.folder_path
    });

    beforeAll(async () => {
        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
        await apiService.getInstance().core.peopleApi.addPerson(acsUser);

        site = await apiService.getInstance().core.sitesApi.createSite({
            title: StringUtil.generateRandomString(8),
            visibility: 'PUBLIC'
        });

        await apiService.getInstance().core.sitesApi.addSiteMember(site.entry.id, {
            id: acsUser.id,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });

        await apiService.getInstance().login(acsUser.id, acsUser.password);
    });

    afterAll(async () => {
        await apiService.getInstance().core.sitesApi.deleteSite(site.entry.id, { permanent: true });
        await navigationBarPage.clickLogoutButton();
    });

    describe('Word Folder Uploaded', () => {
        let uploadedWords;
        let wordFolderUploaded;

        beforeAll(async () => {
            wordFolderUploaded = await uploadActions.createFolder(wordFolderInfo.name, '-my-');

            uploadedWords = await uploadActions.uploadFolder(wordFolderInfo.location, wordFolderUploaded.entry.id);

            await loginPage.login(acsUser.id, acsUser.password);
            await contentServicesPage.goToDocumentList();
        });

        afterAll(async () => {
            await uploadActions.deleteFileOrFolder(wordFolderUploaded.entry.id);
        });

        it('[C280011] Should be possible to open any Word file', async () => {
            await contentServicesPage.doubleClickRow('word');
            for (const currentFile of uploadedWords) {
                if (currentFile.entry.name !== '.DS_Store') {
                    await contentServicesPage.doubleClickRow(currentFile.entry.name);
                    await viewerPage.checkFileIsLoaded();
                    await viewerPage.clickCloseButton();
                }
            }
        });
    });
});
