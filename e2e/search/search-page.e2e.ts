/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { browser } from 'protractor';

import { createApiService, LoginPage, StringUtil, UploadActions, UserModel, UsersActions } from '@alfresco/adf-testing';

import { SearchBarPage } from './pages/search-bar.page';
import { ContentServicesPage } from '../core/pages/content-services.page';
import { SearchResultsPage } from './pages/search-results.page';
import { FolderModel } from '../models/ACS/folder.model';
import { FileModel } from '../models/ACS/file.model';
import { NavigationBarPage } from '../core/pages/navigation-bar.page';

describe('Search component - Search Page', () => {
    const search = {
        active: {
            firstFile: null,
            secondFile: null,
            base: StringUtil.generateRandomString(7),
            extension: '.txt'
        },
        no_permission: {
            noPermFile: 'Meetings',
            noPermFolder: 'Meeting Notes'
        }
    };

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const searchBarPage = new SearchBarPage();
    const searchResultPage = new SearchResultsPage();
    const navigationBarPage = new NavigationBarPage();

    const apiService = createApiService();
    const uploadActions = new UploadActions(apiService);
    const usersActions = new UsersActions(apiService);

    const acsUser = new UserModel();
    const emptyFolderModel = new FolderModel({ name: 'search' + StringUtil.generateRandomString() });
    let firstFileModel;
    const newFolderModel = new FolderModel();
    let fileNames = [];
    const nrOfFiles = 15;
    const adminNrOfFiles = 5;

    beforeAll(async () => {
        fileNames = StringUtil.generateFilesNames(1, nrOfFiles, search.active.base, search.active.extension);
        const adminFileNames = StringUtil.generateFilesNames(nrOfFiles + 1, nrOfFiles + adminNrOfFiles, search.active.base, search.active.extension);
        search.active.firstFile = fileNames[0];
        search.active.secondFile = fileNames[1];
        fileNames.splice(0, 1);

        firstFileModel = new FileModel({
            name: search.active.firstFile,
            location: browser.params.resources.Files.ADF_DOCUMENTS.TXT.file_path
        });

        await apiService.loginWithProfile('admin');

        await usersActions.createUser(acsUser);
        await apiService.login(acsUser.username, acsUser.password);

        await uploadActions.createFolder(emptyFolderModel.name, '-my-');
        const newFolderModelUploaded = await uploadActions.createFolder(newFolderModel.name, '-my-');

        await uploadActions.createEmptyFiles(fileNames, newFolderModelUploaded.entry.id);

        await uploadActions.uploadFile(firstFileModel.location, firstFileModel.name, '-my-');

        await apiService.loginWithProfile('admin');

        await uploadActions.createEmptyFiles(adminFileNames, newFolderModelUploaded.entry.id);

        await browser.sleep(browser.params.testConfig.timeouts.index_search);

        await loginPage.login(acsUser.username, acsUser.password);
   });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    it('[C260264] Should display message when no results are found', async () => {
        const notExistentFileName = StringUtil.generateRandomString();
        await searchBarPage.checkSearchBarIsNotVisible();
        await searchBarPage.checkSearchIconIsVisible();
        await searchBarPage.clickOnSearchIcon();
        await searchBarPage.enterTextAndPressEnter(notExistentFileName);
        await searchResultPage.dataTable.waitTillContentLoaded();

        await searchResultPage.checkNoResultMessageIsDisplayed();
    });

    it('[C272810] Should display only files corresponding to search', async () => {
        await searchBarPage.clickOnSearchIcon();
        await searchBarPage.enterTextAndPressEnter(search.active.firstFile);
        await searchResultPage.dataTable.waitTillContentLoaded();

        await searchResultPage.checkContentIsDisplayed(search.active.firstFile);
        await expect(await searchResultPage.numberOfResultsDisplayed()).toBe(1);
    });

    it('[C260267] Should display content when opening a folder from search results', async () => {
        await searchBarPage.clickOnSearchIcon();
        await searchBarPage.enterTextAndPressEnter(emptyFolderModel.name);
        await searchResultPage.dataTable.waitTillContentLoaded();

        await searchResultPage.checkNoResultMessageIsNotDisplayed();
        await searchResultPage.dataTable.waitTillContentLoaded();

        await searchResultPage.checkContentIsDisplayed(emptyFolderModel.name);
        await searchResultPage.navigateToFolder(emptyFolderModel.name);
        const result = await contentServicesPage.currentFolderName();
        await expect(result).toEqual(emptyFolderModel.name);
    });

    it('[C260261] Should be able to delete a file from search results', async () => {
        await searchBarPage.clickOnSearchIcon();
        await searchBarPage.enterTextAndPressEnter(search.active.firstFile);
        await searchResultPage.dataTable.waitTillContentLoaded();

        await searchResultPage.checkContentIsDisplayed(search.active.firstFile);

        await searchResultPage.deleteContent(search.active.firstFile);

        await searchResultPage.checkNoResultMessageIsDisplayed();
        await searchResultPage.checkContentIsNotDisplayed(search.active.firstFile);

        await searchBarPage.checkSearchBarIsNotVisible();
        await searchBarPage.checkSearchIconIsVisible();
        await searchBarPage.clickOnSearchIcon();
        await searchBarPage.enterTextAndPressEnter(search.active.firstFile);
        await searchResultPage.dataTable.waitTillContentLoaded();

        await searchResultPage.checkNoResultMessageIsDisplayed();
    });

    it('[C272809] Should be able to delete a folder from search results', async () => {
        await searchBarPage.clickOnSearchIcon();
        await searchBarPage.enterTextAndPressEnter(emptyFolderModel.name);
        await searchResultPage.dataTable.waitTillContentLoaded();

        await searchResultPage.checkContentIsDisplayed(emptyFolderModel.name);
        await searchResultPage.checkNoResultMessageIsNotDisplayed();
        await searchResultPage.dataTable.waitTillContentLoaded();

        await searchResultPage.checkContentIsDisplayed(emptyFolderModel.name);
        await searchResultPage.deleteContent(emptyFolderModel.name);
        await searchResultPage.checkNoResultMessageIsDisplayed();

        await searchBarPage.checkSearchBarIsNotVisible();
        await searchBarPage.checkSearchIconIsVisible();
        await searchBarPage.clickOnSearchIcon();
        await searchBarPage.enterTextAndPressEnter(emptyFolderModel.name);
        await searchResultPage.dataTable.waitTillContentLoaded();

        await searchResultPage.checkNoResultMessageIsDisplayed();
    });

    it('[C286675] Should display results when searching for all elements', async () => {
        await searchBarPage.clickOnSearchIcon();
        await searchBarPage.enterTextAndPressEnter('*');
        await searchResultPage.dataTable.waitTillContentLoaded();

        await searchResultPage.checkNoResultMessageIsNotDisplayed();
    });
});
