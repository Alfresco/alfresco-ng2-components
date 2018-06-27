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

import AdfLoginPage = require('./pages/adf/loginPage.js');
import ContentServicesPage = require('./pages/adf/contentServicesPage.js');
import PaginationPage = require('./pages/adf/paginationPage.js');

import AcsUserModel = require('./models/ACS/acsUserModel.js');
import FolderModel = require('./models/ACS/folderModel.js');

import PeopleAPI = require('./restAPI/ACS/PeopleAPI.js');
import NodesAPI = require('./restAPI/ACS/NodesAPI.js');
import QueriesAPI = require('./restAPI/ACS/QueriesAPI.js');

import TestConfig = require('./test.config.js');
import Util = require('./util/util.js');

describe('Pagination - returns to previous page when current is empty', () => {

    let adfLoginPage = new AdfLoginPage();
    let contentServicesPage = new ContentServicesPage();
    let paginationPage = new PaginationPage();

    let acsUser = new AcsUserModel();
    let adminUserModel = new AcsUserModel({
        'id': TestConfig.adf.adminEmail,
        'password': TestConfig.adf.adminPassword
    });
    let folderModel = new FolderModel({'name': 'folderOne'});

    let retryNumber = 30;
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

    beforeAll( (done) => {
        fileNames = Util.generateSeqeunceFiles(1, nrOfFiles, files.base, files.extension);

        PeopleAPI.createUserViaAPI(adminUserModel, acsUser)
            .then(() => {
                adfLoginPage.loginToContentServicesUsingUserModel(acsUser);
                return contentServicesPage.goToDocumentList();
            })
            .then(() => {
                return NodesAPI.uploadFolderViaAPI(acsUser, folderModel, '-my-');
            })
            .then(() => {
                return NodesAPI.createEmptyFilesViaAPI(acsUser, fileNames, folderModel.id);
            })
            .then(function (data) {
                QueriesAPI.getNodes(retryNumber, acsUser, 'term=nothing*&rootNodeId=-root-', nrOfFiles, () => {
                    done();
                });
            });

    });

    afterAll((done) => {
        NodesAPI.deleteContent(acsUser, folderModel.id, () => {
            done();
        });
    });

    it('Pagination - returns to previous page when current is empty', () => {
        contentServicesPage.goToDocumentList();
        contentServicesPage.navigateToFolder(folderModel.name);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        paginationPage.selectItemsPerPage(itemsPerPage.five);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(contentServicesPage.numberOfResultsDisplayed()).toBe(itemsPerPage.fiveValue);
        contentServicesPage.getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, fileNames.slice(0, 5))).toEqual(true);
        });
        paginationPage.clickOnNextPage();
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        contentServicesPage.getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, fileNames.slice(5, 6))).toEqual(true);
        });
        contentServicesPage.deleteContent(lastFile);
        contentServicesPage.checkContentIsNotDisplayed(lastFile);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(contentServicesPage.numberOfResultsDisplayed()).toBe(itemsPerPage.fiveValue);
        contentServicesPage.getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, fileNames.slice(0, 5))).toEqual(true);
        });

    });

});
