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
import { LoginPage, StringUtil, UploadActions } from '@alfresco/adf-testing';
import { ViewerPage } from '../../../pages/adf/viewerPage';
import { ContentServicesPage } from '../../../pages/adf/contentServicesPage';
import CONSTANTS = require('../../../util/constants');
import resources = require('../../../util/resources');
import { FolderModel } from '../../../models/ACS/folderModel';
import { AcsUserModel } from '../../../models/ACS/acsUserModel';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';

describe('Viewer', () => {

    const viewerPage = new ViewerPage();
    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: browser.params.testConfig.adf_acs.host
        });
    const uploadActions = new UploadActions(this.alfrescoJsApi);
    let site;
    const acsUser = new AcsUserModel();

    const imgFolderInfo = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.IMG_FOLDER.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.IMG_FOLDER.folder_location
    });

    const imgRenditionFolderInfo = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.IMG_RENDITION_FOLDER.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.IMG_RENDITION_FOLDER.folder_location
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

    describe('Image Folder Uploaded', () => {

        let uploadedImages, uploadedImgRenditionFolderInfo;
        let imgFolderUploaded, imgFolderRenditionUploaded;

        beforeAll(async () => {
            imgFolderUploaded = await uploadActions.createFolder(imgFolderInfo.name, '-my-');

            uploadedImages = await uploadActions.uploadFolder(imgFolderInfo.location, imgFolderUploaded.entry.id);

            imgFolderRenditionUploaded = await uploadActions.createFolder(imgRenditionFolderInfo.name, imgFolderUploaded.entry.id);

            uploadedImgRenditionFolderInfo = await uploadActions.uploadFolder(imgRenditionFolderInfo.location, imgFolderRenditionUploaded.entry.id);

            await loginPage.loginToContentServicesUsingUserModel(acsUser);
            await contentServicesPage.goToDocumentList();

        });

        afterAll(async () => {
            await uploadActions.deleteFileOrFolder(imgFolderUploaded.entry.id);

        });

        it('[C279966] Should be possible to open any Image supported extension', async () => {
            await contentServicesPage.doubleClickRow('images');
            for (const image of uploadedImages) {
                if (image.entry.name !== '.DS_Store') {
                    await contentServicesPage.doubleClickRow(image.entry.name);
                    await viewerPage.checkImgViewerIsDisplayed();
                    await viewerPage.clickCloseButton();
                }
            }
            await contentServicesPage.doubleClickRow('images-rendition');
            for (const item of uploadedImgRenditionFolderInfo) {
                if (item.entry.name !== '.DS_Store') {
                    await contentServicesPage.doubleClickRow(item.entry.name);
                    await viewerPage.checkFileIsLoaded();
                    await viewerPage.clickCloseButton();
                }
            }
        });

    });

});
