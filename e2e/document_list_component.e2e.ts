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

import LoginPage = require('./pages/adf/loginPage');
import ContentServicesPage = require('./pages/adf/contentServicesPage');

import AcsUserModel = require('./models/ACS/acsUserModel');
import FileModel = require('./models/ACS/fileModel');
import FolderModel = require('./models/ACS/folderModel');

import TestConfig = require('./test.config');
import resources = require('./util/resources');
import Util = require('./util/util');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from './actions/ACS/upload.actions';

describe('Test DocumentList component', () => {

    let loginPage = new LoginPage();
    let contentServicesPage = new ContentServicesPage();

    let acsUser = new AcsUserModel();
    let pdfFileModel = new FileModel({ 'name': resources.Files.ADF_DOCUMENTS.PDF.file_name });
    let docxFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.DOCX.file_name,
        'location': resources.Files.ADF_DOCUMENTS.DOCX.file_location
    });
    let testFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TEST.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
    });
    let folderOneModel = new FolderModel({ 'name': 'folderOne' + Util.generateRandomString() });
    let folderTwoModel = new FolderModel({ 'name': 'folderTwo' + Util.generateRandomString() });

    let uploadedFolder;
    let rootFolder = 'APP.PERSONAL-FILES', userHomes = 'User Homes', rootFolderName = 'Personal Files';
    let fileNames = [], adminFileNames = [], nrOfFiles = 15, adminNrOfFiles = 5;

    let files = {
        base: 'newFile',
        firstFile: 'newFile14.txt',
        extension: '.txt'
    };

    let extensions = {
        pdf: 'pdf',
        docx: 'word',
        test: 'document'
    };

    beforeAll(async (done) => {
        let uploadActions = new UploadActions();

        fileNames = Util.generateSeqeunceFiles(1, nrOfFiles, files.base, files.extension);
        adminFileNames = Util.generateSeqeunceFiles(nrOfFiles + 1, nrOfFiles + adminNrOfFiles, files.base, files.extension);

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        await uploadActions.uploadFile(this.alfrescoJsApi, pdfFileModel.location, pdfFileModel.name, '-my-');
        await uploadActions.uploadFile(this.alfrescoJsApi, docxFileModel.location, docxFileModel.name, '-my-');
        await uploadActions.uploadFile(this.alfrescoJsApi, testFileModel.location, testFileModel.name, '-my-');

        uploadedFolder = await uploadActions.uploadFolder(this.alfrescoJsApi, folderOneModel.name, '-my-');

        await uploadActions.createEmptyFiles(this.alfrescoJsApi, fileNames, uploadedFolder.entry.id);

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await uploadActions.createEmptyFiles(this.alfrescoJsApi, adminFileNames, uploadedFolder.entry.id);

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        contentServicesPage.goToDocumentList();

        done();
    });

    it('1. File has tooltip', () => {
        expect(contentServicesPage.getTooltip(pdfFileModel.name)).toEqual(pdfFileModel.name);
    });

    it('2. Folder has tooltip', () => {
        expect(contentServicesPage.getTooltip(folderOneModel.name)).toEqual(folderOneModel.name);
        expect(contentServicesPage.getBreadcrumbTooltip(rootFolderName)).toEqual(rootFolderName);
    });

    it('4. Sort content ascending by name.', () => {
        contentServicesPage.doubleClickRow(folderOneModel.name).checkContentIsDisplayed(files.firstFile);
        expect(contentServicesPage.getActiveBreadcrumb()).toEqual(uploadedFolder.entry.name);
        expect(contentServicesPage.getCurrentFolderID()).toContain(uploadedFolder.entry.id);
        expect(contentServicesPage.sortAndCheckListIsOrderedByName(true)).toEqual(true);
    });

    it('5. Sort content descending by name.', () => {
        expect(contentServicesPage.sortAndCheckListIsOrderedByName(false)).toEqual(true);
    });

    it('6. Sort content ascending by author.', () => {
        expect(contentServicesPage.sortAndCheckListIsOrderedByAuthor(true)).toEqual(true);
    });

    it('7. Sort content descending by author.', () => {
        expect(contentServicesPage.sortAndCheckListIsOrderedByAuthor(false)).toEqual(true);
    });

    it('8. Sort content ascending by created date.', () => {
        expect(contentServicesPage.sortAndCheckListIsOrderedByCreated(true)).toEqual(true);
    });

    it('9. Sort content descending by created date.', () => {
        expect(contentServicesPage.sortAndCheckListIsOrderedByCreated(false)).toEqual(true);
    });

    it('10. File can be uploaded in a new created folder.', () => {
        contentServicesPage.createNewFolder(folderTwoModel.name).checkContentIsDisplayed(folderTwoModel.name);
        contentServicesPage.doubleClickRow(folderTwoModel.name).checkEmptyFolderMessageIsDisplayed();
    });

    it('11. Navigate to child folder via breadcrumbs.', () => {
        contentServicesPage.navigateToFolderViaBreadcrumbs(acsUser.getId());

        contentServicesPage
            .checkContentIsDisplayed(folderOneModel.name)
            .doubleClickRow(folderOneModel.name)
            .checkContentIsDisplayed(folderTwoModel.name)
            .doubleClickRow(folderTwoModel.name);

        expect(contentServicesPage.getActiveBreadcrumb()).toEqual(folderTwoModel.name);
    });

    it('12. Navigate to parent folder via breadcrumbs.', () => {
        contentServicesPage.navigateToFolderViaBreadcrumbs(uploadedFolder.entry.name);

        expect(contentServicesPage.getActiveBreadcrumb()).toEqual(uploadedFolder.entry.name);

        expect(contentServicesPage.getCurrentFolderID()).toContain(uploadedFolder.entry.id);

        Util.refreshBrowser();
        expect(contentServicesPage.getActiveBreadcrumb()).toEqual(uploadedFolder.entry.name);
        expect(contentServicesPage.getCurrentFolderID()).toContain(uploadedFolder.entry.id);
    });

    it('13. Each known extension has it s own icon.', () => {
        contentServicesPage.navigateToFolderViaBreadcrumbs(acsUser.getId());

        contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);
        contentServicesPage.checkContentIsDisplayed(docxFileModel.name);
        contentServicesPage.checkContentIsDisplayed(testFileModel.name);
        contentServicesPage.checkIconColumn(pdfFileModel.name, extensions.pdf);
        contentServicesPage.checkIconColumn(docxFileModel.name, extensions.docx);
        contentServicesPage.checkIconColumn(testFileModel.name, extensions.test);
    });

    it('14. Navigate to root folder via breadcrumbs.', () => {
        contentServicesPage.navigateToFolderViaBreadcrumbs(rootFolder);
        expect(contentServicesPage.getActiveBreadcrumb()).toEqual(rootFolderName);
    });
});
