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
import { ContentServicesPage } from '../pages/adf/contentServicesPage';
import { PaginationPage } from '@alfresco/adf-testing';
import { ViewerPage } from '../pages/adf/viewerPage';

import { AcsUserModel } from '../models/ACS/acsUserModel';
import { FolderModel } from '../models/ACS/folderModel';
import { FileModel } from '../models/ACS/fileModel';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '../actions/ACS/upload.actions';

import { Util } from '../util/util';
import resources = require('../util/resources');
import TestConfig = require('../test.config');

describe('Pagination - returns to previous page when current is empty', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const paginationPage = new PaginationPage();
    const viewerPage = new ViewerPage();

    const acsUser = new AcsUserModel();
    const folderModel = new FolderModel({ 'name': 'folderOne' });
    const parentFolderModel = new FolderModel({ 'name': 'parentFolder' });

    let fileNames = [];
    const nrOfFiles = 6;
    const nrOfFolders = 5;
    const lastFile = 'newFile6.txt';
    let lastFolderResponse;
    let pngFileUploaded;
    const folderNames = ['t1', 't2', 't3', 't4', 't5', 't6'];

    const itemsPerPage = {
        five: '5',
        fiveValue: 5
    };

    const files = {
        base: 'newFile',
        extension: '.txt'
    };

    const pngFileInfo = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    beforeAll(async (done) => {
        const uploadActions = new UploadActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        fileNames = Util.generateSequenceFiles(1, nrOfFiles, files.base, files.extension);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        const folderUploadedModel = await uploadActions.createFolder(this.alfrescoJsApi, folderModel.name, '-my-');

        const parentFolderResponse = await uploadActions.createFolder(this.alfrescoJsApi, parentFolderModel.name, '-my-');

        for (let i = 0; i < nrOfFolders; i++) {
            await uploadActions.createFolder(this.alfrescoJsApi, folderNames[i], parentFolderResponse.entry.id);
        }

        await uploadActions.createEmptyFiles(this.alfrescoJsApi, fileNames, folderUploadedModel.entry.id);

        lastFolderResponse = await uploadActions.createFolder(this.alfrescoJsApi, folderNames[5], parentFolderResponse.entry.id);

        pngFileUploaded = await uploadActions.uploadFile(this.alfrescoJsApi, pngFileInfo.location, pngFileInfo.name, lastFolderResponse.entry.id);

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        contentServicesPage.goToDocumentList();

        done();
    });

    it('[C274710] Should redirect to previous page when current is emptied', () => {
        contentServicesPage.doubleClickRow(folderModel.name);
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

    it('[C297494] Should display content when navigating to a non-empty folder not in the first page', () => {
        contentServicesPage.goToDocumentList();
        contentServicesPage.doubleClickRow(parentFolderModel.name);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();

        paginationPage.selectItemsPerPage(itemsPerPage.five);

        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();

        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(contentServicesPage.numberOfResultsDisplayed()).toBe(itemsPerPage.fiveValue);

        paginationPage.clickOnNextPage();

        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();

        contentServicesPage.doubleClickRow(lastFolderResponse.entry.name);
        contentServicesPage.checkContentIsDisplayed(pngFileInfo.name);

        viewerPage.viewFile(pngFileUploaded.entry.name);
        viewerPage.checkImgViewerIsDisplayed();
        viewerPage.clickCloseButton();
    });
});
