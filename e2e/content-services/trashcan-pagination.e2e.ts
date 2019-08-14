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

import { Util } from '../util/util';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '@alfresco/adf-testing';
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
    const newFolderModel = new FolderModel({ name: 'newFolder' });
    const noOfFiles = 20;

    beforeAll(async () => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: browser.params.testConfig.adf_acs.host
        });
        const uploadActions = new UploadActions(this.alfrescoJsApi);
        const fileNames = Util.generateSequenceFiles(10, noOfFiles + 9, pagination.base, pagination.extension);
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
        const folderUploadedModel = await uploadActions.createFolder(newFolderModel.name, '-my-');
        const emptyFiles: any = await uploadActions.createEmptyFiles(fileNames, folderUploadedModel.entry.id);
        for (const entry of emptyFiles.list.entries) {
            await this.alfrescoJsApi.node.deleteNode(entry.entry.id).then(() => {}, () => {
                this.alfrescoJsApi.node.deleteNode(entry.entry.id);
            });
        }
        await loginPage.loginToContentServicesUsingUserModel(acsUser);
        await navigationBarPage.clickTrashcanButton();
        await trashcanPage.waitForTableBody();
    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();

    });

    afterEach(async () => {
        await browser.refresh();
        await trashcanPage.waitForTableBody();

    });

    it('[C272811] Should be able to set Items per page to 20', async () => {
        await paginationPage.selectItemsPerPage(itemsPerPage.twenty);
        await trashcanPage.waitForTableBody();
        await trashcanPage.waitForPagination();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.twenty);
        await expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + noOfFiles + ' of ' + noOfFiles);
        await expect(await trashcanPage.numberOfResultsDisplayed()).toBe(noOfFiles);
        await paginationPage.checkNextPageButtonIsDisabled();
        await paginationPage.checkPreviousPageButtonIsDisabled();
    });

    it('[C276742] Should be able to set Items per page to 15', async () => {
        await paginationPage.selectItemsPerPage(itemsPerPage.fifteen);
        await trashcanPage.waitForTableBody();
        await trashcanPage.waitForPagination();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        await expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.fifteenValue + ' of ' + noOfFiles);
        await expect(await trashcanPage.numberOfResultsDisplayed()).toBe(itemsPerPage.fifteenValue);
        await paginationPage.checkNextPageButtonIsEnabled();
        await paginationPage.checkPreviousPageButtonIsDisabled();
    });

    it('[C276743] Should be able to set Items per page to 10', async () => {
        await paginationPage.selectItemsPerPage(itemsPerPage.ten);
        await trashcanPage.waitForTableBody();
        await trashcanPage.waitForPagination();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        await expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.tenValue + ' of ' + noOfFiles);
        await expect(await trashcanPage.numberOfResultsDisplayed()).toBe(itemsPerPage.tenValue);
        await paginationPage.checkNextPageButtonIsEnabled();
        await paginationPage.checkPreviousPageButtonIsDisabled();
    });

    it('[C276744] Should be able to set Items per page to 5', async () => {
        await paginationPage.selectItemsPerPage(itemsPerPage.five);
        await trashcanPage.waitForTableBody();
        await trashcanPage.waitForPagination();
        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        await expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.fiveValue + ' of ' + noOfFiles);
        await expect(await trashcanPage.numberOfResultsDisplayed()).toBe(itemsPerPage.fiveValue);
        await paginationPage.checkNextPageButtonIsEnabled();
        await paginationPage.checkPreviousPageButtonIsDisabled();
    });
})
;
