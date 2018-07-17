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
import NavigationBarPage = require('./pages/adf/navigationBarPage');
import AcsUserModel = require('./models/ACS/acsUserModel');
import TestConfig = require('./test.config');
import resources = require('./util/resources');
import Util = require('./util/util');
import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from './actions/ACS/upload.actions';
import ErrorPage = require('./pages/adf/documentListErrorPage');
import FileModel = require('./models/ACS/fileModel');
import moment from 'moment-es6';
import { browser } from '../node_modules/protractor';

describe('Document List Component', () => {

    let loginPage = new LoginPage();
    let contentServicesPage = new ContentServicesPage();
    let navBar = new NavigationBarPage();
    let errorPage = new ErrorPage();
    let privateSite;
    let uploadedFolder;
    let uploadActions = new UploadActions();

    beforeAll(() => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });
    });

    describe('Permission Message', async () => {

        let acsUser = new AcsUserModel();

        beforeAll(async (done) => {
            let siteName = `PRIVATE_TEST_SITE_${Util.generateRandomString()}`;
            let folderName = `MEESEEKS_${Util.generateRandomString()}`;
            let privateSiteBody: SiteBody = { visibility: 'PRIVATE' , title: siteName};

            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

            privateSite = await this.alfrescoJsApi.core.sitesApi.createSite(privateSiteBody);

            uploadedFolder = await uploadActions.uploadFolder(this.alfrescoJsApi, folderName, privateSite.entry.guid);

            done();
        });

        it('[C217334] - Error message displayed without permissions', () => {
            loginPage.loginToContentServicesUsingUserModel(acsUser);
            browser.get(TestConfig.adf.url + '/files/' + privateSite.entry.guid);
            expect(errorPage.getErrorCode()).toBe('403');
            expect(errorPage.getErrorDescription()).toBe('You\'re not allowed access to this resource on the server.');
        });

        xit('[C279924] - Custom error message is displayed', () => {
            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();
            contentServicesPage.enableCustomPermissionMessage();
            browser.get(TestConfig.adf.url + '/files/' + privateSite.entry.guid);
            expect(errorPage.getErrorCode()).toBe('Cris you don\'t have permissions');
        });

        it('[C279925] - Message is translated', () => {
            loginPage.loginToContentServicesUsingUserModel(acsUser);
            navBar.openLanguageMenu();
            navBar.chooseLanguage('Italian');
            browser.get(TestConfig.adf.url + '/files/' + privateSite.entry.guid);
            expect(errorPage.getErrorDescription()).toBe('Accesso alla risorsa sul server non consentito.');
        });

    });

    describe('Custom Column', () => {

        let folderName, acsUser;
        let pdfFileModel = new FileModel({ 'name': resources.Files.ADF_DOCUMENTS.PDF.file_name });
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

        beforeAll(async (done) => {

            acsUser = new AcsUserModel();

            folderName = `MEESEEKS_${Util.generateRandomString()}_LOOK_AT_ME`;

            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            uploadedFolder = await uploadActions.uploadFolder(this.alfrescoJsApi, folderName, '-my-');
            await uploadActions.uploadFile(this.alfrescoJsApi, pdfFileModel.location, pdfFileModel.name, '-my-');
            await uploadActions.uploadFile(this.alfrescoJsApi, docxFileModel.location, docxFileModel.name, '-my-');
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
            await uploadActions.uploadFile(this.alfrescoJsApi, timeAgoFileModel.location, timeAgoFileModel.name, '-my-');
            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();
            let dateValue = contentServicesPage.getColumnValueForRow(timeAgoFileModel.name, 'Created');
            expect(dateValue).toBe('a few seconds ago');
            done();
        });

        it('[C279929] - The date is showed with date type', async (done) => {
            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            let file = await uploadActions.uploadFile(this.alfrescoJsApi, mediumFileModel.location, mediumFileModel.name, '-my-');
            let createdDate = moment(file.createdAt).format('ll');
            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.goToDocumentList();
            contentServicesPage.enableMediumTimeFormat();
            let dateValue = contentServicesPage.getColumnValueForRow(mediumFileModel.name, 'Created');
            expect(dateValue).toContain(createdDate);
            done();
        });
    });

    describe('Column Sorting', () => {

        let acsUser;

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

        beforeAll(async (done) => {

            acsUser = new AcsUserModel();

            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            await uploadActions.uploadFile(this.alfrescoJsApi, fakeFileA.location, fakeFileA.name, '-my-');
            await uploadActions.uploadFile(this.alfrescoJsApi, fakeFileB.location, fakeFileB.name, '-my-');
            await uploadActions.uploadFile(this.alfrescoJsApi, fakeFileC.location, fakeFileC.name, '-my-');
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
        let acsUser = new AcsUserModel();
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        loginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.clickOnContentServices();
        let documentListSpinner = element(by.css('mat-progress-spinner'));
        Util.waitUntilElementIsPresent(documentListSpinner);
        done();
    });

});
