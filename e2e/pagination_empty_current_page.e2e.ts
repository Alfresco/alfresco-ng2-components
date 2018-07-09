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
import PaginationPage = require('./pages/adf/paginationPage');

import AcsUserModel = require('./models/ACS/acsUserModel');
import FolderModel = require('./models/ACS/folderModel');

import TestConfig = require('./test.config');
import Util = require('./util/util');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from './actions/ACS/upload.actions';

describe('Pagination - returns to previous page when current is empty', () => {

    let loginPage = new LoginPage();
    let contentServicesPage = new ContentServicesPage();
    let paginationPage = new PaginationPage();

    let acsUser = new AcsUserModel();
    let folderModel = new FolderModel({ 'name': 'folderOne' });

    let fileNames = [], nrOfFiles = 6;
    let lastFile = 'newFile6.txt';

    let itemsPerPage = {
        five: '5',
        fiveValue: 5
    };

    let files = {
        base: 'newFile',
        extension: '.txt'
    };

    beforeAll(async (done) => {
        let uploadActions = new UploadActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        fileNames = Util.generateSeqeunceFiles(1, nrOfFiles, files.base, files.extension);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        let folderUploadedModel = await uploadActions.uploadFolder(this.alfrescoJsApi, folderModel.name, '-my-');

        await uploadActions.createEmptyFiles(this.alfrescoJsApi, fileNames, folderUploadedModel.entry.id);

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        contentServicesPage.goToDocumentList();

        done();
    });

    xit('Pagination - returns to previous page when current is empty', () => {
        contentServicesPage.navigateToFolder(folderModel.name);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();

        paginationPage.selectItemsPerPage(itemsPerPage.five);

        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();

        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(contentServicesPage.numberOfResultsDisplayed()).toBe(itemsPerPage.fiveValue);

        contentServicesPage.getAllRowsNameColumn().then((list) => {
            expect(Util.arrayContainsArray(list, fileNames.slice(0, 5))).toEqual(true);
        });

        paginationPage.clickOnNextPage();

        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();

        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);

        contentServicesPage.getAllRowsNameColumn().then((list) => {
            expect(Util.arrayContainsArray(list, fileNames.slice(5, 6))).toEqual(true);
        });

        contentServicesPage.deleteContent(lastFile);
        contentServicesPage.checkContentIsNotDisplayed(lastFile);

        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(contentServicesPage.numberOfResultsDisplayed()).toBe(itemsPerPage.fiveValue);

        contentServicesPage.getAllRowsNameColumn().then((list) => {
            expect(Util.arrayContainsArray(list, fileNames.slice(0, 5))).toEqual(true);
        });

    });

});
