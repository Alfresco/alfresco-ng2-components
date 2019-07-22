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

import { LoginPage, LocalStorageUtil } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../pages/adf/contentServicesPage';
import { InfinitePaginationPage } from '../pages/adf/core/infinitePaginationPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';

import { AcsUserModel } from '../models/ACS/acsUserModel';
import { FolderModel } from '../models/ACS/folderModel';

import { browser } from 'protractor';
import { Util } from '../util/util';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '@alfresco/adf-testing';

describe('Enable infinite scrolling',  () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const infinitePaginationPage = new InfinitePaginationPage();
    const navigationBarPage = new NavigationBarPage();

    const acsUser = new AcsUserModel();
    const folderModel = new FolderModel({ 'name': 'folderOne' });

    let fileNames = [];
    const nrOfFiles = 30;
    let deleteFileNames = [];
    const nrOfDeletedFiles = 22;
    let deleteUploaded;
    const pageSize = 20;
    let emptyFolderModel;

    const files = {
        base: 'newFile',
        extension: '.txt'
    };

    beforeAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: browser.params.testConfig.adf.url
        });
        const uploadActions = new UploadActions(this.alfrescoJsApi);

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        fileNames = Util.generateSequenceFiles(1, nrOfFiles, files.base, files.extension);
        deleteFileNames = Util.generateSequenceFiles(1, nrOfDeletedFiles, files.base, files.extension);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        const folderUploadedModel = await uploadActions.createFolder(folderModel.name, '-my-');
        emptyFolderModel = await uploadActions.createFolder('emptyFolder', '-my-');

        await uploadActions.createEmptyFiles(fileNames, folderUploadedModel.entry.id);

        deleteUploaded = await uploadActions.createFolder('deleteFolder', '-my-');

        await uploadActions.createEmptyFiles(deleteFileNames, deleteUploaded.entry.id);

        done();
    });

    beforeEach(async (done) => {
        navigationBarPage.clickContentServicesButton();
        contentServicesPage.checkAcsContainer();
        done();
    });

    it('[C260484] Should be possible to enable infinite scrolling', async () => {
        contentServicesPage.doubleClickRow(folderModel.name);
        contentServicesPage.enableInfiniteScrolling();
        infinitePaginationPage.clickLoadMoreButton();
        for (let i = 0; i < nrOfFiles; i++) {
            contentServicesPage.checkContentIsDisplayed(fileNames[i]);
        }
    });

    it('[C268165] Delete folder when infinite scrolling is enabled', async () => {
        contentServicesPage.doubleClickRow(deleteUploaded.entry.name);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        contentServicesPage.enableInfiniteScrolling();
        infinitePaginationPage.clickLoadMoreButton();
        for (let i = 0; i < nrOfDeletedFiles; i++) {
            contentServicesPage.checkContentIsDisplayed(deleteFileNames[i]);
        }
        expect(contentServicesPage.getDocumentList().dataTablePage().numberOfRows()).toEqual(nrOfDeletedFiles);

        contentServicesPage.deleteContent(deleteFileNames[nrOfDeletedFiles - 1]);
        contentServicesPage.checkContentIsNotDisplayed(deleteFileNames[nrOfDeletedFiles - 1]);

        for (let i = 0; i < nrOfDeletedFiles - 1; i++) {
            contentServicesPage.checkContentIsDisplayed(deleteFileNames[i]);
        }
    });

    it('[C299201] Should use default pagination settings for infinite pagination', async () => {
        navigationBarPage.clickContentServicesButton();
        contentServicesPage.checkAcsContainer();
        contentServicesPage.doubleClickRow(folderModel.name);

        contentServicesPage.enableInfiniteScrolling();
        expect(contentServicesPage.numberOfResultsDisplayed()).toBe(pageSize);
        infinitePaginationPage.clickLoadMoreButton();
        expect(contentServicesPage.numberOfResultsDisplayed()).toBe(nrOfFiles);

        infinitePaginationPage.checkLoadMoreButtonIsNotDisplayed();
    });

    it('[C299202] Should not display load more button when all the files are already displayed', async () => {
        LocalStorageUtil.setUserPreference('paginationSize', '30');

        navigationBarPage.clickContentServicesButton();
        contentServicesPage.checkAcsContainer();

        contentServicesPage.doubleClickRow(folderModel.name);

        contentServicesPage.enableInfiniteScrolling();
        expect(contentServicesPage.numberOfResultsDisplayed()).toBe(nrOfFiles);

        infinitePaginationPage.checkLoadMoreButtonIsNotDisplayed();
    });

    it('[C299203] Should not display load more button when a folder is empty', async () => {
        navigationBarPage.clickContentServicesButton();
        contentServicesPage.checkAcsContainer();

        contentServicesPage.doubleClickRow(emptyFolderModel.entry.name);

        infinitePaginationPage.checkLoadMoreButtonIsNotDisplayed();
    });

});
