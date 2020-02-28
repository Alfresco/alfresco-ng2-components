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

import { LoginPage, PaginationPage, UploadActions, ViewerPage } from '@alfresco/adf-testing';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { browser } from 'protractor';
import { AcsUserModel } from '../models/ACS/acs-user.model';
import { FileModel } from '../models/ACS/file.model';
import { FolderModel } from '../models/ACS/folder.model';
import { ContentServicesPage } from '../pages/adf/content-services.page';
import { Util } from '../util/util';

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
        'name': browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    beforeAll(async () => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: browser.params.testConfig.adf_acs.host
        });
        const uploadActions = new UploadActions(this.alfrescoJsApi);

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        fileNames = Util.generateSequenceFiles(1, nrOfFiles, files.base, files.extension);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        const folderUploadedModel = await uploadActions.createFolder(folderModel.name, '-my-');

        const parentFolderResponse = await uploadActions.createFolder(parentFolderModel.name, '-my-');

        for (let i = 0; i < nrOfFolders; i++) {
            await uploadActions.createFolder(folderNames[i], parentFolderResponse.entry.id);
        }

        await uploadActions.createEmptyFiles(fileNames, folderUploadedModel.entry.id);

        lastFolderResponse = await uploadActions.createFolder(folderNames[5], parentFolderResponse.entry.id);

        pngFileUploaded = await uploadActions.uploadFile(pngFileInfo.location, pngFileInfo.name, lastFolderResponse.entry.id);

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        await contentServicesPage.goToDocumentList();
    });

    it('[C274710] Should redirect to previous page when current is emptied', async () => {
        await contentServicesPage.openFolder(folderModel.name);

        await paginationPage.selectItemsPerPage(itemsPerPage.five);
        await contentServicesPage.checkDocumentListElementsAreDisplayed();

        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(itemsPerPage.fiveValue);

        let list = await contentServicesPage.getAllRowsNameColumn();
        await expect(Util.arrayContainsArray(list, fileNames.slice(0, 5))).toEqual(true);

        await paginationPage.clickOnNextPage();

        await contentServicesPage.checkDocumentListElementsAreDisplayed();

        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);

        list = await contentServicesPage.getAllRowsNameColumn();
        await expect(Util.arrayContainsArray(list, fileNames.slice(5, 6))).toEqual(true);

        await contentServicesPage.deleteContent(lastFile);
        await contentServicesPage.checkContentIsNotDisplayed(lastFile);

        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(itemsPerPage.fiveValue);

        list = await contentServicesPage.getAllRowsNameColumn();
        await expect(Util.arrayContainsArray(list, fileNames.slice(0, 5))).toEqual(true);
    });

    it('[C297494] Should display content when navigating to a non-empty folder not in the first page', async () => {
        await contentServicesPage.goToDocumentList();
        await contentServicesPage.openFolder(parentFolderModel.name);

        await paginationPage.selectItemsPerPage(itemsPerPage.five);
        await contentServicesPage.checkDocumentListElementsAreDisplayed();

        await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        await expect(await contentServicesPage.numberOfResultsDisplayed()).toBe(itemsPerPage.fiveValue);

        await paginationPage.clickOnNextPage();
        await contentServicesPage.checkDocumentListElementsAreDisplayed();

        await contentServicesPage.doubleClickRow(lastFolderResponse.entry.name);
        await contentServicesPage.checkContentIsDisplayed(pngFileInfo.name);

        await viewerPage.viewFile(pngFileUploaded.entry.name);
        await viewerPage.checkImgViewerIsDisplayed();
        await viewerPage.clickCloseButton();
    });
});
