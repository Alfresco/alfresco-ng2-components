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

import { LoginPage } from '@alfresco/adf-testing';
import { TrashcanPage } from '../pages/adf/trashcanPage';

import { PaginationPage } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';

import { AcsUserModel } from '../models/ACS/acsUserModel';
import { FolderModel } from '../models/ACS/folderModel';

import TestConfig = require('../test.config');
import { Util } from '../util/util';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '../actions/ACS/upload.actions';
import { browser } from 'protractor';

describe('Trashcan - Pagination', () => {
    const pagination = {
        base: 'newFile',
        extension: '.txt'
    };

    const itemsPerPage = {
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

    const loginPage = new LoginPage();
    const trashcanPage = new TrashcanPage();
    const paginationPage = new PaginationPage();
    const navigationBarPage = new NavigationBarPage();

    const acsUser = new AcsUserModel();
    const newFolderModel = new FolderModel({ 'name': 'newFolder' });
    const nrOfFiles = 20;

    beforeAll(async (done) => {
        const uploadActions = new UploadActions();

        const fileNames = Util.generateSequenceFiles(10, nrOfFiles + 9, pagination.base, pagination.extension);

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        const folderUploadedModel = await uploadActions.createFolder(this.alfrescoJsApi, newFolderModel.name, '-my-');

        const emptyFiles = await uploadActions.createEmptyFiles(this.alfrescoJsApi, fileNames, folderUploadedModel.entry.id);
        await emptyFiles.list.entries.forEach(async (node) => {
            await this.alfrescoJsApi.node.deleteNode(node.entry.id).then(() => {
            }, () => {
                this.alfrescoJsApi.node.deleteNode(node.entry.id);
            });
        });

        await loginPage.loginToContentServicesUsingUserModel(acsUser);
        navigationBarPage.clickTrashcanButton();
        trashcanPage.waitForTableBody();

        done();
    });

    afterEach((done) => {
        browser.refresh();
        trashcanPage.waitForTableBody();
        done();
    });

    it('[C272811] Should be able to set Items per page to 20', () => {
        paginationPage.selectItemsPerPage(itemsPerPage.twenty);

        trashcanPage.waitForTableBody();
        trashcanPage.waitForPagination();

        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.twenty);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + nrOfFiles + ' of ' + nrOfFiles);
        expect(trashcanPage.numberOfResultsDisplayed()).toBe(nrOfFiles);

        paginationPage.checkNextPageButtonIsDisabled();
        paginationPage.checkPreviousPageButtonIsDisabled();
    });

    it('[C276742] Should be able to set Items per page to 15', () => {
        paginationPage.selectItemsPerPage(itemsPerPage.fifteen);
        trashcanPage.waitForTableBody();
        trashcanPage.waitForPagination();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.fifteenValue + ' of ' + nrOfFiles);
        expect(trashcanPage.numberOfResultsDisplayed()).toBe(itemsPerPage.fifteenValue);
        paginationPage.checkNextPageButtonIsEnabled();
        paginationPage.checkPreviousPageButtonIsDisabled();
    });

    it('[C276743] Should be able to set Items per page to 10', () => {
        paginationPage.selectItemsPerPage(itemsPerPage.ten);
        trashcanPage.waitForTableBody();
        trashcanPage.waitForPagination();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.tenValue + ' of ' + nrOfFiles);
        expect(trashcanPage.numberOfResultsDisplayed()).toBe(itemsPerPage.tenValue);
        paginationPage.checkNextPageButtonIsEnabled();
        paginationPage.checkPreviousPageButtonIsDisabled();
    });

    it('[C276744] Should be able to set Items per page to 5', () => {
        paginationPage.selectItemsPerPage(itemsPerPage.five);
        trashcanPage.waitForTableBody();
        trashcanPage.waitForPagination();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.fiveValue + ' of ' + nrOfFiles);
        expect(trashcanPage.numberOfResultsDisplayed()).toBe(itemsPerPage.fiveValue);
        paginationPage.checkNextPageButtonIsEnabled();
        paginationPage.checkPreviousPageButtonIsDisabled();
    });
})
;
