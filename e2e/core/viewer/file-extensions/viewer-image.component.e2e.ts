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

import TestConfig = require('../../../test.config');

import { LoginPage } from '@alfresco/adf-testing';
import { ViewerPage } from '../../../pages/adf/viewerPage';
import { ContentServicesPage } from '../../../pages/adf/contentServicesPage';

import CONSTANTS = require('../../../util/constants');
import resources = require('../../../util/resources');
import { StringUtil } from '@alfresco/adf-testing';

import { FolderModel } from '../../../models/ACS/folderModel';
import { AcsUserModel } from '../../../models/ACS/acsUserModel';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '../../../actions/ACS/upload.actions';

describe('Viewer', () => {

    const viewerPage = new ViewerPage();
    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const uploadActions = new UploadActions();
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

    beforeAll(async (done) => {

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
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

        done();
    });

    describe('Image Folder Uploaded', () => {

        let uploadedImages, uploadedImgRenditionFolderInfo;
        let imgFolderUploaded, imgFolderRenditionUploaded;

        beforeAll(async (done) => {
            imgFolderUploaded = await uploadActions.createFolder(this.alfrescoJsApi, imgFolderInfo.name, '-my-');

            uploadedImages = await uploadActions.uploadFolder(this.alfrescoJsApi, imgFolderInfo.location, imgFolderUploaded.entry.id);

            imgFolderRenditionUploaded = await uploadActions.createFolder(this.alfrescoJsApi, imgRenditionFolderInfo.name, imgFolderUploaded.entry.id);

            uploadedImgRenditionFolderInfo = await uploadActions.uploadFolder(this.alfrescoJsApi, imgRenditionFolderInfo.location, imgFolderRenditionUploaded.entry.id);

            await loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();

            done();
        });

        afterAll(async (done) => {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, imgFolderUploaded.entry.id);
            done();
        });

        it('[C279966] Should be possible to open any Image supported extension', () => {
            contentServicesPage.doubleClickRow('images');

            uploadedImages.forEach((currentFile) => {
                if (currentFile.entry.name !== '.DS_Store') {
                    contentServicesPage.doubleClickRow(currentFile.entry.name);
                    viewerPage.checkImgViewerIsDisplayed();
                    viewerPage.clickCloseButton();
                }
            });

            contentServicesPage.doubleClickRow('images-rendition');

            uploadedImgRenditionFolderInfo.forEach((currentFile) => {
                if (currentFile.entry.name !== '.DS_Store') {
                    contentServicesPage.doubleClickRow(currentFile.entry.name);
                    viewerPage.checkFileIsLoaded();
                    viewerPage.clickCloseButton();
                }
            });
        });

    });

});
