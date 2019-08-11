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
import { LoginPage, UploadActions, StringUtil } from '@alfresco/adf-testing';
import { ViewerPage } from '../../../pages/adf/viewerPage';
import { ContentServicesPage } from '../../../pages/adf/contentServicesPage';
import CONSTANTS = require('../../../util/constants');
import resources = require('../../../util/resources');
import { FolderModel } from '../../../models/ACS/folderModel';
import { AcsUserModel } from '../../../models/ACS/acsUserModel';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { NavigationBarPage } from '../../../pages/adf/navigationBarPage';

describe('Viewer', () => {

    const viewerPage = new ViewerPage();
    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const navigationBarPage = new NavigationBarPage();

    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);
    let site;
    const acsUser = new AcsUserModel();

    const wordFolderInfo = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.WORD_FOLDER.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.WORD_FOLDER.folder_location
    });

    beforeAll(async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        site = await this.alfrescoJsApi.core.sitesApi.createSite({
            title: StringUtil.generateRandomString(8),
            visibility: 'PUBLIC'
        });

        await this.alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
            id: acsUser.id,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    describe('Word Folder Uploaded', () => {

        let uploadedWords;
        let wordFolderUploaded;

        beforeAll(async () => {
            wordFolderUploaded = await uploadActions.createFolder(wordFolderInfo.name, '-my-');

            uploadedWords = await uploadActions.uploadFolder(wordFolderInfo.location, wordFolderUploaded.entry.id);

            await loginPage.loginToContentServicesUsingUserModel(acsUser);
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
