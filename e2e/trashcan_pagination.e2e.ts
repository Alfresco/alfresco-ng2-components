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
import TrashcanPage = require('./pages/adf/trashcanPage.js');
import PaginationPage = require('./pages/adf/paginationPage.js');
import NavigationBarPage = require('./pages/adf/navigationBarPage.js');

import AcsUserModel = require('./models/ACS/acsUserModel.js');
import FolderModel = require('./models/ACS/folderModel.js');
import FilesModel = require('./models/ACS/filesModel.js');

import NodesAPI = require('./restAPI/ACS/NodesAPI.js');
import QueriesAPI = require('./restAPI/ACS/QueriesAPI.js');
import PeopleAPI = require('./restAPI/ACS/PeopleAPI.js');

import TestConfig = require('./test.config.js');
import Util = require('./util/util.js');
let retryNumber = 100;

xdescribe('Trashcan - Pagination', () => {
    let pagination = {
        base: 'newFile',
        extension: '.txt'
    };

    let itemsPerPage = {
        five: '5',
        fiveValue: 5,
        ten: '10',
        tenValue: 10,
        fifteen: '15',
        fifteenValue: 15,
        twenty: '20',
        twentyValue: 20,
        default: '25'
    };

    let adfLoginPage = new AdfLoginPage();
    let trashcanPage = new TrashcanPage();
    let paginationPage = new PaginationPage();
    let navigationBarPage = new NavigationBarPage();

    let acsUser = new AcsUserModel();
    let adminUserModel = new AcsUserModel({
        'id': TestConfig.adf.adminEmail,
        'password': TestConfig.adf.adminPassword
    });
    let newFolderModel = new FolderModel({'name': 'newFolder'});
    let fileNames = [], nrOfFiles = 20, currentPage = 1;
    let filesModel = new FilesModel();

    beforeAll( (done) => {
        fileNames = Util.generateSeqeunceFiles(10, nrOfFiles + 9, pagination.base, pagination.extension);

        PeopleAPI.createUserViaAPI(adminUserModel, acsUser)
            .then(() => {
                return adfLoginPage.loginToContentServicesUsingUserModel(acsUser);
            })
            .then(function () {
                return NodesAPI.uploadFolderViaAPI(acsUser, newFolderModel, '-my-');
            })
            .then(function () {
                return NodesAPI.createEmptyFilesViaAPI(acsUser, fileNames, newFolderModel.id);
            })
            .then(function (body) {
                filesModel.setFiles(body.list.entries);
                return new Promise(function (res, rej) {
                    QueriesAPI.getNodes(retryNumber, acsUser, 'term=newFile*&rootNodeId=-root-', nrOfFiles, function () {
                        res();
                    });
                });
            })
            .then(function () {
                function a(item) {
                    return new Promise(function (res, rej) {
                        NodesAPI.deleteContent(acsUser, item.id, () => {
                            res();
                        });
                    });
                }

                return filesModel.getFiles().reduce((acc, item) => {
                    return acc.then(() => a(item));
                }, Promise.resolve());

            })
            .then(() => {
                done();
            });
    });

    it('[C272811] 20 Items per page', () => {
        navigationBarPage.clickTrashcanButton();
        trashcanPage.waitForTableBody();
        paginationPage.selectItemsPerPage(itemsPerPage.twenty);
        trashcanPage.waitForTableBody();
        trashcanPage.waitForPagination();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.twenty);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + nrOfFiles + ' of ' + nrOfFiles);
        expect(trashcanPage.numberOfResultsDisplayed()).toBe(nrOfFiles);
        paginationPage.checkNextPageButtonIsDisabled();
        paginationPage.checkPreviousPageButtonIsDisabled();
    });

    it('[C276742] 15 Items per page', () => {
        navigationBarPage.clickTrashcanButton();
        trashcanPage.waitForTableBody();
        paginationPage.selectItemsPerPage(itemsPerPage.fifteen);
        trashcanPage.waitForTableBody();
        trashcanPage.waitForPagination();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.fifteenValue + ' of ' + nrOfFiles);
        expect(trashcanPage.numberOfResultsDisplayed()).toBe(itemsPerPage.fifteenValue);
        paginationPage.checkNextPageButtonIsEnabled();
        paginationPage.checkPreviousPageButtonIsDisabled();
    });

    it('[C276743] 10 Items per page', () => {
        navigationBarPage.clickTrashcanButton();
        trashcanPage.waitForTableBody();
        paginationPage.selectItemsPerPage(itemsPerPage.ten);
        trashcanPage.waitForTableBody();
        trashcanPage.waitForPagination();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.tenValue + ' of ' + nrOfFiles);
        expect(trashcanPage.numberOfResultsDisplayed()).toBe(itemsPerPage.tenValue);
        paginationPage.checkNextPageButtonIsEnabled();
        paginationPage.checkPreviousPageButtonIsDisabled();
    });

    it('[C276744] 5 Items per page', () => {
        navigationBarPage.clickTrashcanButton();
        trashcanPage.waitForTableBody();
        paginationPage.selectItemsPerPage(itemsPerPage.five);
        trashcanPage.waitForTableBody();
        trashcanPage.waitForPagination();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.fiveValue + ' of ' + nrOfFiles);
        expect(trashcanPage.numberOfResultsDisplayed()).toBe(itemsPerPage.fiveValue);
        paginationPage.checkNextPageButtonIsEnabled();
        paginationPage.checkPreviousPageButtonIsDisabled();
    });
});
