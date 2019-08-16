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
import { browser } from 'protractor';
import resources = require('../../util/resources');
import { LoginPage, StringUtil, UploadActions } from '@alfresco/adf-testing';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { FileModel } from '../../models/ACS/fileModel';
import moment from 'moment-es6';

describe('Document List Component', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    let uploadedFolder, uploadedFolderExtra;
    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);
    let acsUser = null;
    let testFileNode, pdfBFileNode;

    afterEach(async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        if (uploadedFolder) {
            await uploadActions.deleteFileOrFolder(uploadedFolder.entry.id);
            uploadedFolder = null;
        }
        if (uploadedFolderExtra) {
            await uploadActions.deleteFileOrFolder(uploadedFolderExtra.entry.id);
            uploadedFolderExtra = null;
        }
        if (testFileNode) {
            await uploadActions.deleteFileOrFolder(testFileNode.entry.id);
            testFileNode = null;
        }
        if (pdfBFileNode) {
            await uploadActions.deleteFileOrFolder(pdfBFileNode.entry.id);
            pdfBFileNode = null;
        }

    });

    describe('Custom Column', () => {

        let folderName;
        const pdfFileModel = new FileModel({
            name: resources.Files.ADF_DOCUMENTS.PDF.file_name,
            location: resources.Files.ADF_DOCUMENTS.PDF.file_location
        });
        const docxFileModel = new FileModel({
            name: resources.Files.ADF_DOCUMENTS.DOCX.file_name,
            location: resources.Files.ADF_DOCUMENTS.DOCX.file_location
        });
        const timeAgoFileModel = new FileModel({
            name: resources.Files.ADF_DOCUMENTS.TEST.file_name,
            location: resources.Files.ADF_DOCUMENTS.TEST.file_location
        });
        const mediumFileModel = new FileModel({
            name: resources.Files.ADF_DOCUMENTS.PDF_B.file_name,
            location: resources.Files.ADF_DOCUMENTS.PDF_B.file_location
        });

        let pdfUploadedNode, docxUploadedNode, timeAgoUploadedNode, mediumDateUploadedNode;

        beforeAll(async () => {

            acsUser = new AcsUserModel();

            /* cspell:disable-next-line */
            folderName = `MEESEEKS_${StringUtil.generateRandomString(5)}_LOOK_AT_ME`;

            await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

            await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            uploadedFolder = await uploadActions.createFolder(folderName, '-my-');
            pdfUploadedNode = await uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, '-my-');
            docxUploadedNode = await uploadActions.uploadFile(docxFileModel.location, docxFileModel.name, '-my-');

        });

        afterAll(async () => {
            await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

            if (pdfUploadedNode) {
                await uploadActions.deleteFileOrFolder(pdfUploadedNode.entry.id);
            }
            if (docxUploadedNode) {
                await uploadActions.deleteFileOrFolder(docxUploadedNode.entry.id);
            }
            if (timeAgoUploadedNode) {
                await uploadActions.deleteFileOrFolder(timeAgoUploadedNode.entry.id);
            }
            if (mediumDateUploadedNode) {
                await uploadActions.deleteFileOrFolder(mediumDateUploadedNode.entry.id);
            }

        });

        beforeEach(async () => {
            await loginPage.loginToContentServicesUsingUserModel(acsUser);

        });

        it('[C279926] Should only display the user\'s files and folders', async () => {
            await contentServicesPage.goToDocumentList();
            await contentServicesPage.checkContentIsDisplayed(folderName);
            await contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);
            await contentServicesPage.checkContentIsDisplayed(docxFileModel.name);
            await expect(await contentServicesPage.getDocumentListRowNumber()).toBe(4);
        });

        it('[C279927] Should display default columns', async () => {
            await contentServicesPage.goToDocumentList();
            await contentServicesPage.checkColumnNameHeader();
            await contentServicesPage.checkColumnSizeHeader();
            await contentServicesPage.checkColumnCreatedByHeader();
            await contentServicesPage.checkColumnCreatedHeader();
        });

        it('[C279928] Should be able to display date with timeAgo', async () => {
            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            timeAgoUploadedNode = await uploadActions.uploadFile(timeAgoFileModel.location, timeAgoFileModel.name, '-my-');
            await contentServicesPage.goToDocumentList();
            const dateValue = await contentServicesPage.getColumnValueForRow(timeAgoFileModel.name, 'Created');
            await expect(dateValue).toMatch(/(ago|few)/);

        });

        it('[C279929] Should be able to display the date with date type', async () => {
            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            mediumDateUploadedNode = await uploadActions.uploadFile(mediumFileModel.location, mediumFileModel.name, '-my-');
            const createdDate = moment(mediumDateUploadedNode.createdAt).format('ll');
            await contentServicesPage.goToDocumentList();
            await contentServicesPage.enableMediumTimeFormat();
            const dateValue = await contentServicesPage.getColumnValueForRow(mediumFileModel.name, 'Created');
            await expect(dateValue).toContain(createdDate);

        });
    });

    describe('Column Sorting', () => {

        const fakeFileA = new FileModel({
            name: 'A',
            location: resources.Files.ADF_DOCUMENTS.TEST.file_location
        });

        const fakeFileB = new FileModel({
            name: 'B',
            location: resources.Files.ADF_DOCUMENTS.TEST.file_location
        });

        const fakeFileC = new FileModel({
            name: 'C',
            location: resources.Files.ADF_DOCUMENTS.TEST.file_location
        });

        let fileANode, fileBNode, fileCNode;

        beforeAll(async () => {

            const user = new AcsUserModel();

            await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

            await this.alfrescoJsApi.core.peopleApi.addPerson(user);

            await this.alfrescoJsApi.login(user.id, user.password);
            fileANode = await uploadActions.uploadFile(fakeFileA.location, fakeFileA.name, '-my-');
            fileBNode = await uploadActions.uploadFile(fakeFileB.location, fakeFileB.name, '-my-');
            fileCNode = await uploadActions.uploadFile(fakeFileC.location, fakeFileC.name, '-my-');

            await loginPage.loginToContentServicesUsingUserModel(user);
            await contentServicesPage.goToDocumentList();

        });

        afterAll(async () => {
            await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
            if (fileANode) {
                await uploadActions.deleteFileOrFolder(fileANode.entry.id);
            }
            if (fileBNode) {
                await uploadActions.deleteFileOrFolder(fileBNode.entry.id);
            }
            if (fileCNode) {
                await uploadActions.deleteFileOrFolder(fileCNode.entry.id);
            }

        });

        it('[C260112] Should be able to sort by name (Ascending)', async () => {
            await expect(await contentServicesPage.sortAndCheckListIsOrderedByName('asc')).toBe(true, 'List is not sorted.');
        });

        it('[C272770] Should be able to sort by name (Descending)', async () => {
            await expect(await contentServicesPage.sortAndCheckListIsOrderedByName('desc')).toBe(true, 'List is not sorted.');
        });

        it('[C272771] Should be able to sort by author (Ascending)', async () => {
            await expect(await contentServicesPage.sortAndCheckListIsOrderedByAuthor('asc')).toBe(true, 'List is not sorted.');
        });

        it('[C272772] Should be able to sort by author (Descending)', async () => {
            await expect(await contentServicesPage.sortAndCheckListIsOrderedByAuthor('desc')).toBe(true, 'List is not sorted.');
        });

        it('[C272773] Should be able to sort by date (Ascending)', async () => {
            await expect(await contentServicesPage.sortAndCheckListIsOrderedByCreated('asc')).toBe(true, 'List is not sorted.');
        });

        it('[C272774] Should be able to sort by date (Descending)', async () => {
            await expect(await contentServicesPage.sortAndCheckListIsOrderedByCreated('desc')).toBe(true, 'List is not sorted.');
        });
    });

    it('[C279959] Should display empty folder state for new folders', async () => {
        acsUser = new AcsUserModel();

        const folderName = 'BANANA';
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await loginPage.loginToContentServicesUsingUserModel(acsUser);
        await contentServicesPage.goToDocumentList();
        await contentServicesPage.createNewFolder(folderName);
        await contentServicesPage.doubleClickRow(folderName);
        await contentServicesPage.checkEmptyFolderTextToBe('This folder is empty');
        await contentServicesPage.checkEmptyFolderImageUrlToContain('/assets/images/empty_doc_lib.svg');

    });

    it('[C272775] Should be able to upload a file in new folder', async () => {
        const testFile = new FileModel({
            name: resources.Files.ADF_DOCUMENTS.TEST.file_name,
            location: resources.Files.ADF_DOCUMENTS.TEST.file_location
        });
        acsUser = new AcsUserModel();
        /* cspell:disable-next-line */
        const folderName = `MEESEEKS_${StringUtil.generateRandomString(5)}_LOOK_AT_ME`;
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
        uploadedFolder = await uploadActions.createFolder(folderName, '-my-');
        await loginPage.loginToContentServicesUsingUserModel(acsUser);
        await contentServicesPage.goToDocumentList();
        await contentServicesPage.checkContentIsDisplayed(uploadedFolder.entry.name);
        await contentServicesPage.doubleClickRow(uploadedFolder.entry.name);
        await contentServicesPage.uploadFile(testFile.location);
        await contentServicesPage.checkContentIsDisplayed(testFile.name);

    });

    it('[C261997] Should be able to clean Recent Files history', async () => {
        acsUser = new AcsUserModel();
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await loginPage.loginToContentServicesUsingUserModel(acsUser);
        await contentServicesPage.clickOnContentServices();
        await contentServicesPage.checkRecentFileToBeShowed();
        const icon = await contentServicesPage.getRecentFileIcon();
        await expect(icon).toBe('history');
        await contentServicesPage.expandRecentFiles();
        await contentServicesPage.checkEmptyRecentFileIsDisplayed();
        await contentServicesPage.closeRecentFiles();

    });

    it('[C279970] Should display Islocked field for folders', async () => {
        acsUser = new AcsUserModel();
        const folderNameA = `MEESEEKS_${StringUtil.generateRandomString(5)}_LOOK_AT_ME`;
        const folderNameB = `MEESEEKS_${StringUtil.generateRandomString(5)}_LOOK_AT_ME`;
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
        uploadedFolder = await uploadActions.createFolder(folderNameA, '-my-');
        uploadedFolderExtra = await uploadActions.createFolder(folderNameB, '-my-');
        await loginPage.loginToContentServicesUsingUserModel(acsUser);
        await contentServicesPage.goToDocumentList();
        await contentServicesPage.checkContentIsDisplayed(folderNameA);
        await contentServicesPage.checkContentIsDisplayed(folderNameB);
        await contentServicesPage.checkLockIsDisplayedForElement(folderNameA);
        await contentServicesPage.checkLockIsDisplayedForElement(folderNameB);

    });

    it('[C269086] Should display Islocked field for files', async () => {
        const testFileA = new FileModel({
            name: resources.Files.ADF_DOCUMENTS.TEST.file_name,
            location: resources.Files.ADF_DOCUMENTS.TEST.file_location
        });
        const testFileB = new FileModel({
            name: resources.Files.ADF_DOCUMENTS.PDF_B.file_name,
            location: resources.Files.ADF_DOCUMENTS.PDF_B.file_location
        });
        acsUser = new AcsUserModel();
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
        testFileNode = await uploadActions.uploadFile(testFileA.location, testFileA.name, '-my-');
        pdfBFileNode = await uploadActions.uploadFile(testFileB.location, testFileB.name, '-my-');
        await loginPage.loginToContentServicesUsingUserModel(acsUser);
        await contentServicesPage.goToDocumentList();
        await contentServicesPage.checkContentIsDisplayed(testFileA.name);
        await contentServicesPage.checkContentIsDisplayed(testFileB.name);
        await contentServicesPage.checkLockIsDisplayedForElement(testFileA.name);
        await contentServicesPage.checkLockIsDisplayedForElement(testFileB.name);

    });

    describe('Once uploaded 20 folders', () => {

        let folderCreated;

        beforeAll(async () => {
            acsUser = new AcsUserModel();
            folderCreated = [];
            await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
            await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            let folderName = '';
            let folder = null;
            for (let i = 0; i < 20; i++) {
                folderName = `MEESEEKS_000${i}`;
                folder = await uploadActions.createFolder(folderName, '-my-');
                folderCreated.push(folder);
            }
        });

        afterAll(async () => {
            for (let i = 0; i <= folderCreated.length; i++) {
                await uploadActions.deleteFileOrFolder(folderCreated[i].entry.id);
            }
        });

        it('[C277093] Should sort files with Items per page set to default', async () => {
            await loginPage.loginToContentServicesUsingUserModel(acsUser);
            await contentServicesPage.goToDocumentList();
            await contentServicesPage.checkListIsSortedByNameColumn('asc');

        });

    });

    describe('Column Template', () => {

        const file0BytesModel = new FileModel({
            name: resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
            location: resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
        });

        let file;
        const viewer = new ViewerPage();

        beforeAll(async () => {
            acsUser = new AcsUserModel();
            await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
            await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            file = await uploadActions.uploadFile(file0BytesModel.location, file0BytesModel.name, '-my-');

            await loginPage.loginToContentServicesUsingUserModel(acsUser);
            await contentServicesPage.goToDocumentList();
            await contentServicesPage.waitForTableBody();

        });

        it('[C291843] Should be able to navigate using nodes hyperlink when activated', async () => {
            await contentServicesPage.clickHyperlinkNavigationToggle();
            await contentServicesPage.checkFileHyperlinkIsEnabled(file.entry.name);
            await contentServicesPage.clickFileHyperlink(file.entry.name);
            await viewer.checkFileIsLoaded();
        });
    });
});
