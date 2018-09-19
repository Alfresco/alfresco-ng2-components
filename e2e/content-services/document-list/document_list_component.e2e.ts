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

import { browser } from 'protractor';
import LoginPage = require('../../pages/adf/loginPage');
import ContentServicesPage = require('../../pages/adf/contentServicesPage');
import NavigationBarPage = require('../../pages/adf/navigationBarPage');
import AcsUserModel = require('../../models/ACS/acsUserModel');
import TestConfig = require('../../test.config');
import resources = require('../../util/resources');
import Util = require('../../util/util');
import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../../actions/ACS/upload.actions';
import ErrorPage = require('../../pages/adf/errorPage');
import FileModel = require('../../models/ACS/fileModel');
import moment from 'moment-es6';

describe('Document List Component', () => {

    let loginPage = new LoginPage();
    let contentServicesPage = new ContentServicesPage();
    let navBar = new NavigationBarPage();
    let errorPage = new ErrorPage();
    let privateSite;
    let uploadedFolder, uploadedFolderExtra;
    let uploadActions = new UploadActions();
    let acsUser = null;
    let testFileNode, pdfBFileNode;

    beforeAll(() => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });
    });

    afterEach(async (done) => {
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        if (uploadedFolder) {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, uploadedFolder.entry.id);
            uploadedFolder = null;
        }
        if (uploadedFolderExtra) {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, uploadedFolderExtra.entry.id);
            uploadedFolderExtra = null;
        }
        if (testFileNode) {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, testFileNode.entry.id);
            testFileNode = null;
        }
        if (pdfBFileNode) {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, pdfBFileNode.entry.id);
            pdfBFileNode = null;
        }
        done();
    });

    describe('Permission Message', async () => {

        beforeAll(async (done) => {
            acsUser = new AcsUserModel();
            let siteName = `PRIVATE_TEST_SITE_${Util.generateRandomString(5)}`;
            let folderName = `MEESEEKS_${Util.generateRandomString(5)}`;
            let privateSiteBody = { visibility: 'PRIVATE' , title: siteName};

            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

            privateSite = await this.alfrescoJsApi.core.sitesApi.createSite(privateSiteBody);

            uploadedFolder = await uploadActions.uploadFolder(this.alfrescoJsApi, folderName, privateSite.entry.guid);

            done();
        });

        afterAll(async(done) => {
            await this.alfrescoJsApi.core.sitesApi.deleteSite(privateSite.entry.id);
            done();
        });

        it('[C217334] - Error message displayed without permissions', () => {
            loginPage.loginToContentServicesUsingUserModel(acsUser);
            browser.get(TestConfig.adf.url + '/files/' + privateSite.entry.guid);
            expect(errorPage.getErrorCode()).toBe('403');
            expect(errorPage.getErrorDescription()).toBe('You\'re not allowed access to this resource on the server.');
        });

        it('[C279924] - Custom error message is displayed', () => {
            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();
            contentServicesPage.enableCustomPermissionMessage();
            browser.get(TestConfig.adf.url + '/files/' + privateSite.entry.guid);
            expect(errorPage.getErrorCode()).toBe('403');
        });

        it('[C279925] - Message is translated', () => {
            loginPage.loginToContentServicesUsingUserModel(acsUser);
            navBar.openLanguageMenu();
            navBar.chooseLanguage('Italian');
            browser.sleep(2000);
            browser.get(TestConfig.adf.url + '/files/' + privateSite.entry.guid);
            expect(errorPage.getErrorDescription()).toBe('Accesso alla risorsa sul server non consentito.');
        });

    });

    describe('Custom Column', () => {

        let folderName;
        let pdfFileModel = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
            'location': resources.Files.ADF_DOCUMENTS.PDF.file_location
        });
        let docxFileModel = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.DOCX.file_name,
            'location': resources.Files.ADF_DOCUMENTS.DOCX.file_location
        });
        let timeAgoFileModel = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.TEST.file_name,
            'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
        });
        let mediumFileModel = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.PDF_B.file_name,
            'location': resources.Files.ADF_DOCUMENTS.PDF_B.file_location
        });

        let pdfUploadedNode, docxUploadedNode, timeAgoUploadedNode, mediumDateUploadedNode;

        beforeAll(async (done) => {

            acsUser = new AcsUserModel();

            folderName = `MEESEEKS_${Util.generateRandomString(5)}_LOOK_AT_ME`;

            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            uploadedFolder = await uploadActions.uploadFolder(this.alfrescoJsApi, folderName, '-my-');
            pdfUploadedNode = await uploadActions.uploadFile(this.alfrescoJsApi, pdfFileModel.location, pdfFileModel.name, '-my-');
            docxUploadedNode = await uploadActions.uploadFile(this.alfrescoJsApi, docxFileModel.location, docxFileModel.name, '-my-');
            done();
        });

        afterAll(async (done) => {
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            if (pdfUploadedNode) {
                await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, pdfUploadedNode.entry.id);
            }
            if (docxUploadedNode) {
                await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, docxUploadedNode.entry.id);
            }
            if (timeAgoUploadedNode) {
                await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, timeAgoUploadedNode.entry.id);
            }
            if (mediumDateUploadedNode) {
                await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, mediumDateUploadedNode.entry.id);
            }
            done();
        });

        it('[C279926] - Checks that only the files and folders of the users are showed', () => {
            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();
            contentServicesPage.checkContentIsDisplayed(folderName);
            contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);
            contentServicesPage.checkContentIsDisplayed(docxFileModel.name);
            expect(contentServicesPage.getDocumentListRowNumber()).toBe(4);
        });

        it('[C279927] - All columns are showed', () => {
            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();
            contentServicesPage.checkColumnNameHeader();
            contentServicesPage.checkColumnSizeHeader();
            contentServicesPage.checkColumnCreatedByHeader();
            contentServicesPage.checkColumnCreatedHeader();
        });

        it('[C279928] - The date is showed with timeAgo', async (done) => {
            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            timeAgoUploadedNode = await uploadActions.uploadFile(this.alfrescoJsApi, timeAgoFileModel.location, timeAgoFileModel.name, '-my-');
            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();
            let dateValue = contentServicesPage.getColumnValueForRow(timeAgoFileModel.name, 'Created');
            expect(dateValue).toContain('ago');
            done();
        });

        it('[C279929] - The date is showed with date type', async (done) => {
            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            mediumDateUploadedNode = await uploadActions.uploadFile(this.alfrescoJsApi, mediumFileModel.location, mediumFileModel.name, '-my-');
            let createdDate = moment(mediumDateUploadedNode.createdAt).format('ll');
            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();
            contentServicesPage.enableMediumTimeFormat();
            let dateValue = contentServicesPage.getColumnValueForRow(mediumFileModel.name, 'Created');
            expect(dateValue).toContain(createdDate);
            done();
        });
    });

    describe('Column Sorting', () => {

        let fakeFileA = new FileModel({
            'name': 'A',
            'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
        });

        let fakeFileB = new FileModel({
            'name': 'B',
            'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
        });

        let fakeFileC = new FileModel({
            'name': 'C',
            'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
        });

        let fileANode, fileBNode, fileCNode;

        beforeAll(async (done) => {

            acsUser = new AcsUserModel();

            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            fileANode = await uploadActions.uploadFile(this.alfrescoJsApi, fakeFileA.location, fakeFileA.name, '-my-');
            fileBNode = await uploadActions.uploadFile(this.alfrescoJsApi, fakeFileB.location, fakeFileB.name, '-my-');
            fileCNode = await uploadActions.uploadFile(this.alfrescoJsApi, fakeFileC.location, fakeFileC.name, '-my-');
            done();
        });

        afterAll(async (done) => {
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            if (fileANode) {
                await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, fileANode.entry.id);
            }
            if (fileBNode) {
                await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, fileBNode.entry.id);
            }
            if (fileCNode) {
                await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, fileCNode.entry.id);
            }
            done();
        });

        it('[C260112] - Sorting ascending by name', () => {
            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();
            contentServicesPage.sortAndCheckListIsOrderedByName('asc');
        });

        it('[C272770] - Sorting descending by name', () => {
            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();
            contentServicesPage.sortAndCheckListIsOrderedByName('desc');
        });

        it('[C272771] - Sorting ascending by author', () => {
            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();
            contentServicesPage.sortAndCheckListIsOrderedByAuthor('asc');
        });

        it('[C272772] - Sorting descending by author', () => {
            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();
            contentServicesPage.sortAndCheckListIsOrderedByAuthor('desc');
        });

        it('[C272773] - Sorting ascending by created date', () => {
            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();
            contentServicesPage.sortAndCheckListIsOrderedByCreated('asc');
        });

        it('[C272774] - Sorting descending by created date', () => {
            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();
            contentServicesPage.sortAndCheckListIsOrderedByCreated('desc');
        });
    });

    it('[C260121] - should show the spinner on loading', async (done) => {
        acsUser = new AcsUserModel();
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        loginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.clickOnContentServices();
        contentServicesPage.checkSpinnerIsShowed();
        done();
    });

    it('[C279959] - Empty Folder state is displayed for new folders', async (done) => {
        acsUser = new AcsUserModel();

        let folderName = 'BANANA';
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        loginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.goToDocumentList();
        contentServicesPage.createNewFolder(folderName);
        contentServicesPage.navigateToFolder(folderName);
        contentServicesPage.checkEmptyFolderTextToBe('This folder is empty');
        contentServicesPage.checkEmptyFolderImageUrlToContain('/assets/images/empty_doc_lib.svg');
        done();
    });

    it('[C272775] - File can be uploaded in a new created folder', async (done) => {
        let testFile = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.TEST.file_name,
            'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
        });
        acsUser = new AcsUserModel();
        let folderName = `MEESEEKS_${Util.generateRandomString(5)}_LOOK_AT_ME`;
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
        uploadedFolder = await uploadActions.uploadFolder(this.alfrescoJsApi, folderName, '-my-');
        loginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.goToDocumentList();
        contentServicesPage.checkContentIsDisplayed(uploadedFolder.entry.name);
        contentServicesPage.navigateToFolder(uploadedFolder.entry.name);
        contentServicesPage.uploadFile(testFile.location);
        contentServicesPage.checkContentIsDisplayed(testFile.name);
        done();
    });

    it('[C261997] - Recent Files empty', async (done) => {
        acsUser = new AcsUserModel();
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        loginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.clickOnContentServices();
        contentServicesPage.checkRecentFileToBeShowed();
        let icon = await contentServicesPage.getRecentFileIcon();
        expect(icon).toBe('history');
        contentServicesPage.expandRecentFiles();
        contentServicesPage.checkEmptyRecentFileIsDisplayed();
        contentServicesPage.closeRecentFiles();
        done();
    });

    it('[C268119] - "ygj" letters rendering in document list', async (done) => {
        acsUser = new AcsUserModel();
        let folderName = 'ggggggjjjjjjjjjjjjyyyyyy';
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
        uploadedFolder = await uploadActions.uploadFolder(this.alfrescoJsApi, folderName, '-my-');
        loginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.clickOnContentServices();
        let lineHeight = await contentServicesPage.getStyleValueForRowText(folderName, 'line-height');
        let fontSize = await contentServicesPage.getStyleValueForRowText(folderName, 'font-size');
        let actualFontValue = (parseInt(fontSize, 10) * 1.12).toFixed(2);
        expect(lineHeight).toBe(actualFontValue + 'px');
        done();
    });

    it('[C279970] - Custom column - isLocked field is showed for folders', async (done) => {
        acsUser = new AcsUserModel();
        let folderNameA = `MEESEEKS_${Util.generateRandomString(5)}_LOOK_AT_ME`;
        let folderNameB = `MEESEEKS_${Util.generateRandomString(5)}_LOOK_AT_ME`;
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
        uploadedFolder = await uploadActions.uploadFolder(this.alfrescoJsApi, folderNameA, '-my-');
        uploadedFolderExtra = await uploadActions.uploadFolder(this.alfrescoJsApi, folderNameB, '-my-');
        loginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.goToDocumentList();
        contentServicesPage.checkContentIsDisplayed(folderNameA);
        contentServicesPage.checkContentIsDisplayed(folderNameB);
        contentServicesPage.checkLockIsDislpayedForElement(folderNameA);
        contentServicesPage.checkLockIsDislpayedForElement(folderNameB);
        done();
    });

    it('[C269086] - Custom column - IsLocked field is showed for files', async (done) => {
        let testFileA = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.TEST.file_name,
            'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
        });
        let testFileB = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.PDF_B.file_name,
            'location': resources.Files.ADF_DOCUMENTS.PDF_B.file_location
        });
        acsUser = new AcsUserModel();
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
        testFileNode = await uploadActions.uploadFile(this.alfrescoJsApi, testFileA.location, testFileA.name, '-my-');
        pdfBFileNode = await uploadActions.uploadFile(this.alfrescoJsApi, testFileB.location, testFileB.name, '-my-');
        loginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.goToDocumentList();
        contentServicesPage.checkContentIsDisplayed(testFileA.name);
        contentServicesPage.checkContentIsDisplayed(testFileB.name);
        contentServicesPage.checkLockIsDislpayedForElement(testFileA.name);
        contentServicesPage.checkLockIsDislpayedForElement(testFileB.name);
        done();
    });

    describe('Once uploaded 20 folders', () => {

        let folderCreated;

        beforeAll(async (done) => {
            acsUser = new AcsUserModel();
            folderCreated = [];
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            let folderName = '';
            let folder = null;
            for (let i = 0; i < 20; i++) {
                folderName = `MEESEEKS_000${i}`;
                folder = await uploadActions.uploadFolder(this.alfrescoJsApi, folderName, '-my-');
                folderCreated.push(folder);
            }
            done();
        });

        afterAll(async (done) => {
            Promise.all(folderCreated.map((folder) =>
                uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, folder.entry.id)
            )).then(
                done()
            );
        });

        it('[C277093] - Sorting files with Items per page set to default', async (done) => {
            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();
            contentServicesPage.checkListIsSortedByNameColumn('asc');
            done();
        });

    });

    describe('Thumbnails and tooltips', () => {

        let pdfFile = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
            'location': resources.Files.ADF_DOCUMENTS.PDF.file_location
        });

        let testFile = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.TEST.file_name,
            'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
        });

        let docxFile = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.DOCX.file_name,
            'location': resources.Files.ADF_DOCUMENTS.DOCX.file_location
        });
        let folderName = `MEESEEKS_${Util.generateRandomString(5)}_LOOK_AT_ME`;
        let filePdfNode, fileTestNode, fileDocxNode, folderNode;

        beforeAll(async (done) => {
            acsUser = new AcsUserModel();
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            filePdfNode = await uploadActions.uploadFile(this.alfrescoJsApi, pdfFile.location, pdfFile.name, '-my-');
            fileTestNode = await uploadActions.uploadFile(this.alfrescoJsApi, testFile.location, testFile.name, '-my-');
            fileDocxNode = await uploadActions.uploadFile(this.alfrescoJsApi, docxFile.location, docxFile.name, '-my-');
            folderNode = await uploadActions.uploadFolder(this.alfrescoJsApi, folderName, '-my-');

            done();
        });

        afterAll(async (done) => {
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            if (filePdfNode) {
                await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, filePdfNode.entry.id);
            }
            if (fileTestNode) {
                await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, fileTestNode.entry.id);
            }
            if (fileDocxNode) {
                await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, fileDocxNode.entry.id);
            }
            if (folderNode) {
                await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, folderNode.entry.id);
            }
            done();
        });

        beforeEach( () => {
            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();
        });

        it('[C260108] - File tooltip', () => {
            expect(contentServicesPage.getTooltip(pdfFile.name)).toEqual(pdfFile.name);
        });

        it('[C260109] - Folder tooltip', () => {
            expect(contentServicesPage.getTooltip(folderName)).toEqual(folderName);
        });

        it('[C260119] - Thumbnail - Disabled - folder', async (done) => {
            let folderIconUrl = await contentServicesPage.getRowIconImageUrl(folderName);
            expect(folderIconUrl).toContain('/assets/images/ft_ic_folder.svg');
            done();
        });

        it('[C280066] - Thumbnail - Disabled - pdf file', async (done) => {
            let fileIconUrl = await contentServicesPage.getRowIconImageUrl(pdfFile.name);
            expect(fileIconUrl).toContain('/assets/images/ft_ic_pdf.svg');
            done();
        });

        it('[C280067] - Thumbnail - Disabled - docx file', async (done) => {
            let fileIconUrl = await contentServicesPage.getRowIconImageUrl(docxFile.name);
            expect(fileIconUrl).toContain('/assets/images/ft_ic_ms_word.svg');
            done();
        });

        it('[C280068] - Thumbnail - Disabled - test file', async (done) => {
            let fileIconUrl = await contentServicesPage.getRowIconImageUrl(testFile.name);
            expect(fileIconUrl).toContain('/assets/images/ft_ic_document.svg');
            done();
        });

        it('[C274701] - Thumbnails - Enabled', async (done) => {
            contentServicesPage.enableThumbnails();
            contentServicesPage.checkAcsContainer();
            let fileIconUrl = await contentServicesPage.getRowIconImageUrl(pdfFile.name);
            expect(fileIconUrl).toContain(`/versions/1/nodes/${filePdfNode.entry.id}/renditions`);
            done();
        });
    });

    describe('Gallery View', () => {

        let cardProperties = {
            DISPLAY_NAME : 'Display name',
            SIZE: 'Size',
            LOCK: 'Lock',
            CREATED_BY: 'Created by',
            CREATED: 'Created'
        };

        let funnyUser = {};

        let pdfFile = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
            'location': resources.Files.ADF_DOCUMENTS.PDF.file_location
        });

        let testFile = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.TEST.file_name,
            'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
        });

        let docxFile = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.DOCX.file_name,
            'location': resources.Files.ADF_DOCUMENTS.DOCX.file_location
        });
        let folderName = `MEESEEKS_${Util.generateRandomString(5)}_LOOK_AT_ME`;
        let filePdfNode, fileTestNode, fileDocxNode, folderNode, filePDFSubNode;

        beforeAll(async (done) => {
            acsUser = new AcsUserModel();
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            funnyUser = await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            filePdfNode = await uploadActions.uploadFile(this.alfrescoJsApi, pdfFile.location, pdfFile.name, '-my-');
            fileTestNode = await uploadActions.uploadFile(this.alfrescoJsApi, testFile.location, testFile.name, '-my-');
            fileDocxNode = await uploadActions.uploadFile(this.alfrescoJsApi, docxFile.location, docxFile.name, '-my-');
            folderNode = await uploadActions.uploadFolder(this.alfrescoJsApi, folderName, '-my-');
            filePDFSubNode = await uploadActions.uploadFile(this.alfrescoJsApi, pdfFile.location, pdfFile.name, folderNode.entry.id);

            done();
        });

        beforeEach( () => {
            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();
            contentServicesPage.clickGridViewButton();
            contentServicesPage.checkCardViewContainerIsDisplayed();
        });

        it('[C280016] - Gallery view is showed', () => {
            expect(contentServicesPage.getCardElementShowedInPage()).toBe(4);
        });

        it('[C280023] - Gallery Card show details', () => {
            expect(contentServicesPage.getDocumentCardIconForElement(folderName)).toContain('/assets/images/ft_ic_folder.svg');
            expect(contentServicesPage.getDocumentCardIconForElement(pdfFile.name)).toContain('/assets/images/ft_ic_pdf.svg');
            expect(contentServicesPage.getDocumentCardIconForElement(docxFile.name)).toContain('/assets/images/ft_ic_ms_word.svg');
            expect(contentServicesPage.getDocumentCardIconForElement(testFile.name)).toContain('/assets/images/ft_ic_document.svg');
            contentServicesPage.checkMenuIsShowedForElementIndex(0);
            contentServicesPage.checkMenuIsShowedForElementIndex(1);
            contentServicesPage.checkMenuIsShowedForElementIndex(2);
            contentServicesPage.checkMenuIsShowedForElementIndex(3);
        });

        it('[C280069] - Gallery Card show details - attributes', () => {
            contentServicesPage.checkDocumentCardPropertyIsShowed(folderName, cardProperties.DISPLAY_NAME);
            contentServicesPage.checkDocumentCardPropertyIsShowed(folderName, cardProperties.SIZE);
            contentServicesPage.checkDocumentCardPropertyIsShowed(folderName, cardProperties.CREATED_BY);
            contentServicesPage.checkDocumentCardPropertyIsShowed(folderName, cardProperties.CREATED);

            expect(contentServicesPage.getAttributeValueForElement(folderName, cardProperties.DISPLAY_NAME)).toBe(folderName);
            expect(contentServicesPage.getAttributeValueForElement(folderName, cardProperties.CREATED_BY)).toBe(`${funnyUser.entry.firstName} ${funnyUser.entry.lastName}`);

            expect(contentServicesPage.getAttributeValueForElement(folderName, cardProperties.CREATED)).toContain('ago');

            expect(contentServicesPage.getAttributeValueForElement(pdfFile.name, cardProperties.DISPLAY_NAME)).toBe(pdfFile.name);
            expect(contentServicesPage.getAttributeValueForElement(pdfFile.name, cardProperties.SIZE)).toBe(`702.76 KB`);
            expect(contentServicesPage.getAttributeValueForElement(pdfFile.name, cardProperties.CREATED_BY)).toBe(`${funnyUser.entry.firstName} ${funnyUser.entry.lastName}`);

            expect(contentServicesPage.getAttributeValueForElement(pdfFile.name, cardProperties.CREATED)).toContain('ago');

            expect(contentServicesPage.getAttributeValueForElement(docxFile.name, cardProperties.DISPLAY_NAME)).toBe(docxFile.name);
            expect(contentServicesPage.getAttributeValueForElement(docxFile.name, cardProperties.SIZE)).toBe(`770.35 KB`);
            expect(contentServicesPage.getAttributeValueForElement(docxFile.name, cardProperties.CREATED_BY)).toBe(`${funnyUser.entry.firstName} ${funnyUser.entry.lastName}`);

            expect(contentServicesPage.getAttributeValueForElement(docxFile.name, cardProperties.CREATED)).toContain('ago');

            expect(contentServicesPage.getAttributeValueForElement(testFile.name, cardProperties.DISPLAY_NAME)).toBe(testFile.name);
            expect(contentServicesPage.getAttributeValueForElement(testFile.name, cardProperties.SIZE)).toBe(`14 Bytes`);
            expect(contentServicesPage.getAttributeValueForElement(testFile.name, cardProperties.CREATED_BY)).toBe(`${funnyUser.entry.firstName} ${funnyUser.entry.lastName}`);

            expect(contentServicesPage.getAttributeValueForElement(testFile.name, cardProperties.CREATED)).toContain('ago');
        });

        it('[C280129] - Gallery Card show details - subfolder gallery displayed', () => {
            contentServicesPage.navigateToCardFolder(folderName);
            expect(contentServicesPage.getCardElementShowedInPage()).toBe(1);
            expect(contentServicesPage.getDocumentCardIconForElement(pdfFile.name)).toContain('/assets/images/ft_ic_pdf.svg');
        });

        it('[C280130] - Gallery Card show details - back to list view', () => {
            contentServicesPage.clickGridViewButton();
            contentServicesPage.checkAcsContainer();
            contentServicesPage.navigateToFolder(folderName);
            contentServicesPage.checkRowIsDisplayed(pdfFile.name);
        });

        it('[C261993] - Sort by Display name', () => {
            contentServicesPage.selectGridSortingFromDropdown(cardProperties.DISPLAY_NAME);
            contentServicesPage.checkListIsSortedByNameColumn('asc');
        });

        it('[C261994] - Sort by Size', () => {
            contentServicesPage.selectGridSortingFromDropdown(cardProperties.SIZE);
            contentServicesPage.checkListIsSortedBySizeColumn('asc');
        });

        it('[C261995] - Sort by Author', () => {
            contentServicesPage.selectGridSortingFromDropdown(cardProperties.CREATED_BY);
            contentServicesPage.checkListIsSortedByAuthorColumn('asc');
        });

        it('[C261996] - Sort by Created', () => {
            contentServicesPage.selectGridSortingFromDropdown(cardProperties.CREATED);
            contentServicesPage.checkListIsSortedByCreatedColumn('asc');
        });

        afterAll(async (done) => {
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            if (filePdfNode) {
                await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, filePdfNode.entry.id);
            }
            if (fileTestNode) {
                await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, fileTestNode.entry.id);
            }
            if (fileDocxNode) {
                await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, fileDocxNode.entry.id);
            }
            if (filePDFSubNode) {
                await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, filePDFSubNode.entry.id);
            }
            if (folderNode) {
                await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, folderNode.entry.id);
            }
            done();
        });
    });
});
