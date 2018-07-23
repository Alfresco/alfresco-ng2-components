/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import TestConfig = require('./test.config');

import LoginPage = require('./pages/adf/loginPage');
import ContentServicesPage = require('./pages/adf/contentServicesPage');
import ViewerPage = require('./pages/adf/viewerPage');
import NavigationBarPage = require('./pages/adf/NavigationBarPage');

import resources = require('./util/resources');
import Util = require('./util/util');
import CONSTANTS = require('./util/constants');

import FileModel = require('./models/ACS/fileModel');
import FolderModel = require("./models/ACS/folderModel");
import AcsUserModel = require('./models/ACS/acsUserModel');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from './actions/ACS/upload.actions';

describe('Viewer', () => {

    let acsUser = new AcsUserModel();
    let viewerPage = new ViewerPage();
    let navigationBarPage = new NavigationBarPage();
    let contentServicesPage = new ContentServicesPage();
    let loginPage = new LoginPage();
    let site, uploadedDocs, uploadedImages;

    let pdfFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
        'firstPageText': resources.Files.ADF_DOCUMENTS.PDF.first_page_text,
        'secondPageText': resources.Files.ADF_DOCUMENTS.PDF.second_page_text,
        'lastPageNumber': resources.Files.ADF_DOCUMENTS.PDF.last_page_number
    });

    let docFolder = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.DOC_FOLDER.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.DOC_FOLDER.folder_location
    });

    let imgFolder = new FolderModel({
        'name': resources.Files.ADF_DOCUMENTS.IMG_FOLDER.folder_name,
        'location': resources.Files.ADF_DOCUMENTS.IMG_FOLDER.folder_location
    });

    beforeAll(async (done) => {
        let uploadActions = new UploadActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        site = await this.alfrescoJsApi.core.sitesApi.createSite({
            title: Util.generateRandomString(),
            visibility: "PUBLIC"
        });

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        /*tslint:disable-next-line*/
        console.log(`USERNAME : ${acsUser.id} - PASSWORD : ${acsUser.password}`);

        await this.alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
            id: acsUser.id,
            role: CONSTANTS.SITEMEMBERROLES.SITEMANAGER
        });

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        let pdfFileUploaded = await uploadActions.uploadFile(this.alfrescoJsApi, pdfFile.location, pdfFile.name, site.entry.guid);
        Object.assign(pdfFile, pdfFileUploaded.entry);

        let docFolderUploaded = await uploadActions.uploadFolder(this.alfrescoJsApi, docFolder.name, "-my-");
        Object.assign(docFolder, docFolderUploaded.entry);

        uploadedDocs = await uploadActions.uploadFolderFiles(this.alfrescoJsApi, docFolder.location, docFolderUploaded);

        let imgFolderUploaded = await uploadActions.uploadFolder(this.alfrescoJsApi, imgFolder.name, "-my-");
        Object.assign(imgFolder, imgFolderUploaded.entry);

        uploadedImages = await uploadActions.uploadFolderFiles(this.alfrescoJsApi, imgFolder.location, imgFolderUploaded);

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        done();
    });

    afterAll(() => {
        this.alfrescoJsApi.nodes.deleteNode(docFolder.id).then( () => {
            this.alfrescoJsApi.nodes.deleteNode(imgFolder.id);
        });
    });

    beforeEach(() => {
        browser.get(TestConfig.adf.url);
    });

    it('[C260517] Should be possible to open any Document supported extension', () => {
        uploadedDocs.forEach((currentFile) => {
            navigationBarPage.openViewer(currentFile.entry.id);
            viewerPage.checkPageCanvasIsDisplayed();
        });
    });

    it('[C279966] Should be possible to open any Image supported extension', () => {
        uploadedImages.forEach((currentFile) => {
            navigationBarPage.openViewer(currentFile.entry.id);
            viewerPage.checkPageCanvasIsDisplayed();
        });
    });

    it('[C272813] Should be able to close the viewer when clicking close button', () => {
        navigationBarPage.goToSite(site);

        viewerPage.viewFile(pdfFile.name);
        viewerPage.checkFileContent('1', pdfFile.firstPageText);

        viewerPage.clickCloseButton();
    });

});
