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

import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { ViewerPage } from '../../pages/adf/viewerPage';
import TestConfig = require('../../test.config');
import resources = require('../../util/resources');
import { LoginPage, StringUtil } from '@alfresco/adf-testing';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '../../actions/ACS/upload.actions';
import { FileModel } from '../../models/ACS/fileModel';
import moment from 'moment-es6';

describe('Document List Component', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    let uploadedFolder, uploadedFolderExtra;
    const uploadActions = new UploadActions();
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

    describe('Custom Column', () => {

        let folderName;
        const pdfFileModel = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
            'location': resources.Files.ADF_DOCUMENTS.PDF.file_location
        });
        const docxFileModel = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.DOCX.file_name,
            'location': resources.Files.ADF_DOCUMENTS.DOCX.file_location
        });
        const timeAgoFileModel = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.TEST.file_name,
            'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
        });
        const mediumFileModel = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.PDF_B.file_name,
            'location': resources.Files.ADF_DOCUMENTS.PDF_B.file_location
        });

        let pdfUploadedNode, docxUploadedNode, timeAgoUploadedNode, mediumDateUploadedNode;

        beforeAll(async (done) => {

            acsUser = new AcsUserModel();

            /* cspell:disable-next-line */
            folderName = `MEESEEKS_${StringUtil.generateRandomString(5)}_LOOK_AT_ME`;

            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            uploadedFolder = await uploadActions.createFolder(this.alfrescoJsApi, folderName, '-my-');
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

        beforeEach(async (done) => {
            await loginPage.loginToContentServicesUsingUserModel(acsUser);
            done();
        });

        it('[C279926] Should only display the user\'s files and folders', () => {
            contentServicesPage.goToDocumentList();
            contentServicesPage.checkContentIsDisplayed(folderName);
            contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);
            contentServicesPage.checkContentIsDisplayed(docxFileModel.name);
            expect(contentServicesPage.getDocumentListRowNumber()).toBe(4);
        });

        it('[C279927] Should display default columns', () => {
            contentServicesPage.goToDocumentList();
            contentServicesPage.checkColumnNameHeader();
            contentServicesPage.checkColumnSizeHeader();
            contentServicesPage.checkColumnCreatedByHeader();
            contentServicesPage.checkColumnCreatedHeader();
        });

        it('[C279928] Should be able to display date with timeAgo', async (done) => {
            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            timeAgoUploadedNode = await uploadActions.uploadFile(this.alfrescoJsApi, timeAgoFileModel.location, timeAgoFileModel.name, '-my-');
            contentServicesPage.goToDocumentList();
            const dateValue = contentServicesPage.getColumnValueForRow(timeAgoFileModel.name, 'Created');
            expect(dateValue).toMatch(/(ago|few)/);
            done();
        });

        it('[C279929] Should be able to display the date with date type', async (done) => {
            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            mediumDateUploadedNode = await uploadActions.uploadFile(this.alfrescoJsApi, mediumFileModel.location, mediumFileModel.name, '-my-');
            const createdDate = moment(mediumDateUploadedNode.createdAt).format('ll');
            contentServicesPage.goToDocumentList();
            contentServicesPage.enableMediumTimeFormat();
            const dateValue = contentServicesPage.getColumnValueForRow(mediumFileModel.name, 'Created');
            expect(dateValue).toContain(createdDate);
            done();
        });
    });

    describe('Column Sorting', () => {

        const fakeFileA = new FileModel({
            'name': 'A',
            'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
        });

        const fakeFileB = new FileModel({
            'name': 'B',
            'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
        });

        const fakeFileC = new FileModel({
            'name': 'C',
            'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
        });

        let fileANode, fileBNode, fileCNode;

        beforeAll(async (done) => {

            const user = new AcsUserModel();

            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            await this.alfrescoJsApi.core.peopleApi.addPerson(user);

            await this.alfrescoJsApi.login(user.id, user.password);
            fileANode = await uploadActions.uploadFile(this.alfrescoJsApi, fakeFileA.location, fakeFileA.name, '-my-');
            fileBNode = await uploadActions.uploadFile(this.alfrescoJsApi, fakeFileB.location, fakeFileB.name, '-my-');
            fileCNode = await uploadActions.uploadFile(this.alfrescoJsApi, fakeFileC.location, fakeFileC.name, '-my-');

            await loginPage.loginToContentServicesUsingUserModel(user);
            contentServicesPage.goToDocumentList();

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

        it('[C260112] Should be able to sort by name (Ascending)', () => {
            expect(contentServicesPage.sortAndCheckListIsOrderedByName('asc')).toBe(true, 'List is not sorted.');
        });

        it('[C272770] Should be able to sort by name (Descending)', () => {
            expect(contentServicesPage.sortAndCheckListIsOrderedByName('desc')).toBe(true, 'List is not sorted.');
        });

        it('[C272771] Should be able to sort by author (Ascending)', () => {
            expect(contentServicesPage.sortAndCheckListIsOrderedByAuthor('asc')).toBe(true, 'List is not sorted.');
        });

        it('[C272772] Should be able to sort by author (Descending)', () => {
            expect(contentServicesPage.sortAndCheckListIsOrderedByAuthor('desc')).toBe(true, 'List is not sorted.');
        });

        it('[C272773] Should be able to sort by date (Ascending)', () => {
            expect(contentServicesPage.sortAndCheckListIsOrderedByCreated('asc')).toBe(true, 'List is not sorted.');
        });

        it('[C272774] Should be able to sort by date (Descending)', () => {
            expect(contentServicesPage.sortAndCheckListIsOrderedByCreated('desc')).toBe(true, 'List is not sorted.');
        });
    });

    xit('[C260121] Should show the spinner on content loading', async (done) => {
        acsUser = new AcsUserModel();
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        loginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.clickOnContentServices();
        contentServicesPage.checkSpinnerIsShowed();
        done();
    });

    it('[C279959] Should display empty folder state for new folders', async (done) => {
        acsUser = new AcsUserModel();

        const folderName = 'BANANA';
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await loginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.goToDocumentList();
        contentServicesPage.createNewFolder(folderName);
        contentServicesPage.doubleClickRow(folderName);
        contentServicesPage.checkEmptyFolderTextToBe('This folder is empty');
        contentServicesPage.checkEmptyFolderImageUrlToContain('/assets/images/empty_doc_lib.svg');
        done();
    });

    it('[C272775] Should be able to upload a file in new folder', async (done) => {
        const testFile = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.TEST.file_name,
            'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
        });
        acsUser = new AcsUserModel();
        /* cspell:disable-next-line */
        const folderName = `MEESEEKS_${StringUtil.generateRandomString(5)}_LOOK_AT_ME`;
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
        uploadedFolder = await uploadActions.createFolder(this.alfrescoJsApi, folderName, '-my-');
        await loginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.goToDocumentList();
        contentServicesPage.checkContentIsDisplayed(uploadedFolder.entry.name);
        contentServicesPage.doubleClickRow(uploadedFolder.entry.name);
        contentServicesPage.uploadFile(testFile.location);
        contentServicesPage.checkContentIsDisplayed(testFile.name);
        done();
    });

    it('[C261997] Should be able to clean Recent Files history', async (done) => {
        acsUser = new AcsUserModel();
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await loginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.clickOnContentServices();
        contentServicesPage.checkRecentFileToBeShowed();
        const icon = await contentServicesPage.getRecentFileIcon();
        expect(icon).toBe('history');
        contentServicesPage.expandRecentFiles();
        contentServicesPage.checkEmptyRecentFileIsDisplayed();
        contentServicesPage.closeRecentFiles();
        done();
    });

    it('[C279970] Should display Islocked field for folders', async (done) => {
        acsUser = new AcsUserModel();
        const folderNameA = `MEESEEKS_${StringUtil.generateRandomString(5)}_LOOK_AT_ME`;
        const folderNameB = `MEESEEKS_${StringUtil.generateRandomString(5)}_LOOK_AT_ME`;
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
        uploadedFolder = await uploadActions.createFolder(this.alfrescoJsApi, folderNameA, '-my-');
        uploadedFolderExtra = await uploadActions.createFolder(this.alfrescoJsApi, folderNameB, '-my-');
        await loginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.goToDocumentList();
        contentServicesPage.checkContentIsDisplayed(folderNameA);
        contentServicesPage.checkContentIsDisplayed(folderNameB);
        contentServicesPage.checkLockIsDisplayedForElement(folderNameA);
        contentServicesPage.checkLockIsDisplayedForElement(folderNameB);
        done();
    });

    it('[C269086] Should display Islocked field for files', async (done) => {
        const testFileA = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.TEST.file_name,
            'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
        });
        const testFileB = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.PDF_B.file_name,
            'location': resources.Files.ADF_DOCUMENTS.PDF_B.file_location
        });
        acsUser = new AcsUserModel();
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
        testFileNode = await uploadActions.uploadFile(this.alfrescoJsApi, testFileA.location, testFileA.name, '-my-');
        pdfBFileNode = await uploadActions.uploadFile(this.alfrescoJsApi, testFileB.location, testFileB.name, '-my-');
        await loginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.goToDocumentList();
        contentServicesPage.checkContentIsDisplayed(testFileA.name);
        contentServicesPage.checkContentIsDisplayed(testFileB.name);
        contentServicesPage.checkLockIsDisplayedForElement(testFileA.name);
        contentServicesPage.checkLockIsDisplayedForElement(testFileB.name);
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
                folder = await uploadActions.createFolder(this.alfrescoJsApi, folderName, '-my-');
                folderCreated.push(folder);
            }
            done();
        });

        afterAll(async (done) => {
            Promise.all(folderCreated.map((folder) =>
                uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, folder.entry.id)
            )).then(() => {
                done();
            });
        });

        it('[C277093] Should sort files with Items per page set to default', async (done) => {
            await loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();
            contentServicesPage.checkListIsSortedByNameColumn('asc');
            done();
        });

    });

    describe('Column Template', () => {

        const file0BytesModel = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
            'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
        });

        let file;
        const viewer = new ViewerPage();

        beforeAll(async (done) => {
            acsUser = new AcsUserModel();
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            file = await uploadActions.uploadFile(this.alfrescoJsApi, file0BytesModel.location, file0BytesModel.name, '-my-');

            await loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList()
                .waitForTableBody();
            done();
        });

        it('[C291843] Should be able to navigate using nodes hyperlink when activated', () => {
            contentServicesPage.clickHyperlinkNavigationToggle()
                .checkFileHyperlinkIsEnabled(file.entry.name)
                .clickFileHyperlink(file.entry.name);
            viewer.checkFileIsLoaded();
        });
    });
});
