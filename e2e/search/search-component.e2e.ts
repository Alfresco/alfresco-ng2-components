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

import { createApiService,
    BrowserActions,
    LocalStorageUtil,
    LoginPage,
    StringUtil,
    UploadActions,
    UserModel,
    UsersActions,
    ViewerPage
} from '@alfresco/adf-testing';
import { SearchBarPage } from './pages/search-bar.page';
import { ContentServicesPage } from '../core/pages/content-services.page';
import { SearchResultsPage } from './pages/search-results.page';
import { FileModel } from '../models/ACS/file.model';
import { FolderModel } from '../models/ACS/folder.model';
import { NavigationBarPage } from '../core/pages/navigation-bar.page';
import { SearchConfiguration } from './search.config';
import { NodesApi } from '@alfresco/js-api';

describe('Search component - Search Bar', () => {

    const search = {
        inactive: {
            firstChar: 'x',
            secondChar: 'y',
            thirdChar: 'z',
            name: 'impossible-name-folder' + StringUtil.generateRandomString(8)
        }
    };

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const navigationBarPage = new NavigationBarPage();

    const searchBarPage = new SearchBarPage();
    const searchResultPage = new SearchResultsPage();
    const viewerPage = new ViewerPage();

    const acsUser = new UserModel();
    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const nodesApi = new NodesApi(apiService.getInstance());
    const uploadActions = new UploadActions(apiService);

    const filename = StringUtil.generateRandomString(16);
    const firstFolderName = StringUtil.generateRandomString(16);
    const secondFolderName = StringUtil.generateRandomString(16);
    const thirdFolderName = StringUtil.generateRandomString(16);
    const filesToDelete = [];

    const firstFileModel = new FileModel({
        name: filename, shortName: filename.substring(0, 8)
    });

    const firstFolderModel = new FolderModel({
        name: firstFolderName, shortName: firstFolderName.substring(0, 8)
    });
    const secondFolder = new FolderModel({
        name: secondFolderName, shortName: secondFolderName.substring(0, 8)
    });
    const thirdFolder = new FolderModel({
        name: thirdFolderName, shortName: thirdFolderName.substring(0, 8)
    });

    const term = 'Zoizo';

    let fileHighlightUploaded;

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');
        await usersActions.createUser(acsUser);
        await apiService.login(acsUser.username, acsUser.password);

        const firstFileUploaded = await uploadActions.uploadFile(firstFileModel.location, firstFileModel.name, '-my-');
        Object.assign(firstFileModel, firstFileUploaded.entry);

        fileHighlightUploaded = await nodesApi.createNode('-my-', {
            name: StringUtil.generateRandomString(16),
            nodeType: 'cm:content',
            properties: {
                'cm:title': term,
                'cm:description': 'Jadore les ' + term
            }
        });

        filesToDelete.push(fileHighlightUploaded);
        filesToDelete.push(firstFileUploaded);
        filesToDelete.push(await uploadActions.createFolder(firstFolderModel.name, '-my-'));
        filesToDelete.push(await uploadActions.createFolder(secondFolder.name, '-my-'));
        filesToDelete.push(await uploadActions.createFolder(thirdFolder.name, '-my-'));

        await browser.sleep(browser.params.testConfig.timeouts.index_search); // wait search index previous file/folder uploaded

        await loginPage.login(acsUser.username, acsUser.password);
    });

    afterAll(async () => {
        for (const currentNode of filesToDelete) {
            await uploadActions.deleteFileOrFolder(currentNode.entry.id);

        }
        await navigationBarPage.clickLogoutButton();
    });

    afterEach(async () => {
        await BrowserActions.getUrl(browser.baseUrl);
    });

    it('[C272798] Search bar should be visible', async () => {
        await openSearchBar();

        await searchBarPage.checkSearchIconIsVisible();

        await BrowserActions.closeMenuAndDialogs();

        await searchBarPage.checkSearchBarIsNotVisible();
        await searchBarPage.checkSearchIconIsVisible();
    });

    it('[C272799] Should be possible to hide search bar after input', async () => {
        await openSearchBar();

        await searchBarPage.enterText(firstFolderModel.shortName);
    });

    it('[C260255] Should display message when searching for an inexistent file', async () => {
        await openSearchBar();

        await searchBarPage.checkNoResultMessageIsNotDisplayed();
        await searchBarPage.enterText(search.inactive.name);
        await searchResultPage.dataTable.waitTillContentLoaded();

        await searchBarPage.checkNoResultMessageIsDisplayed();
    });

    it('[C260256] Should display file/folder in search suggestion when typing first characters', async () => {
        await openSearchBar();
        await searchBarPage.enterText(firstFolderModel.shortName);

        await searchBarPage.resultTableContainsRow(firstFolderModel.name);

        await expect(await searchBarPage.getSpecificRowsHighlightName(firstFolderModel.name)).toEqual(firstFolderModel.shortName);
        await expect(await searchBarPage.getSpecificRowsAuthor(firstFolderModel.name)).toContain(acsUser.firstName);
        await expect(await searchBarPage.getSpecificRowsAuthor(firstFolderModel.name)).toContain(acsUser.lastName);
        await expect(await searchBarPage.getSpecificRowsCompleteName(firstFolderModel.name)).toEqual(firstFolderModel.name);

        await searchBarPage.clearText();
        await searchBarPage.clickOnSearchIcon();
        await searchBarPage.enterText(firstFileModel.shortName);
        await searchBarPage.resultTableContainsRow(firstFileModel.name);

        await expect(await searchBarPage.getSpecificRowsHighlightName(firstFileModel.name)).toEqual(firstFileModel.shortName);
        await expect(await searchBarPage.getSpecificRowsAuthor(firstFileModel.name)).toContain(acsUser.firstName);
        await expect(await searchBarPage.getSpecificRowsAuthor(firstFileModel.name)).toContain(acsUser.lastName);
        await expect(await searchBarPage.getSpecificRowsCompleteName(firstFileModel.name)).toEqual(firstFileModel.name);
    });

    it('[C272800] Should display file/folder in search suggestion when typing name', async () => {
        await openSearchBar();

        await searchBarPage.enterText(firstFolderModel.name);

        await searchBarPage.resultTableContainsRow(firstFolderModel.name);

        await expect(await searchBarPage.getSpecificRowsHighlightName(firstFolderModel.name)).toEqual(firstFolderModel.name);
        await expect(await searchBarPage.getSpecificRowsAuthor(firstFolderModel.name)).toContain(acsUser.firstName);
        await expect(await searchBarPage.getSpecificRowsAuthor(firstFolderModel.name)).toContain(acsUser.lastName);
        await expect(await searchBarPage.getSpecificRowsCompleteName(firstFolderModel.name)).toEqual(firstFolderModel.name);

        await searchBarPage.clearText();

        await searchBarPage.clickOnSearchIcon();
        await searchBarPage.enterText(firstFileModel.name);
        await searchBarPage.resultTableContainsRow(firstFileModel.name);

        await expect(await searchBarPage.getSpecificRowsHighlightName(firstFileModel.name)).toEqual(firstFileModel.name);
        await expect(await searchBarPage.getSpecificRowsAuthor(firstFileModel.name)).toContain(acsUser.firstName);
        await expect(await searchBarPage.getSpecificRowsAuthor(firstFileModel.name)).toContain(acsUser.lastName);
        await expect(await searchBarPage.getSpecificRowsCompleteName(firstFileModel.name)).toEqual(firstFileModel.name);
    });

    it('[C260257] Should display content when clicking on folder from search suggestions', async () => {
        await openSearchBar();

        await searchBarPage.enterText(firstFolderModel.shortName);

        await searchBarPage.resultTableContainsRow(firstFolderModel.name);
        await searchBarPage.clickOnSpecificRow(firstFolderModel.name);
        await searchResultPage.dataTable.waitTillContentLoaded();

        await expect(await contentServicesPage.currentFolderName()).toEqual(firstFolderModel.name);

        await searchBarPage.checkSearchIconIsVisible();
        await searchBarPage.clickOnSearchIcon();
        await searchBarPage.checkSearchBarIsVisible();
        await searchBarPage.enterText(firstFileModel.name);
        await searchBarPage.resultTableContainsRow(firstFileModel.name);

        await searchBarPage.clickOnSpecificRow(firstFileModel.name);

        await expect(await viewerPage.getDisplayedFileName()).toEqual(firstFileModel.name);

        await viewerPage.clickCloseButton();
    });

    it('[C272801] Should display message when searching for non-existent folder', async () => {
        await openSearchBar();

        await searchBarPage.enterTextAndPressEnter(search.inactive.name);
        await searchResultPage.dataTable.waitTillContentLoaded();

        await searchResultPage.checkNoResultMessageIsDisplayed();
    });

    it('[C272802] Should be able to find an existent folder in search results', async () => {
        await openSearchBar();

        await searchBarPage.enterTextAndPressEnter(firstFolderModel.name);
        await searchResultPage.dataTable.waitTillContentLoaded();

        await searchResultPage.checkContentIsDisplayed(firstFolderModel.name);
    });

    it('[C260258] Should be able to find an existent file in search results', async () => {
        await openSearchBar();

        await searchBarPage.enterTextAndPressEnter(firstFileModel.name);
        await searchResultPage.dataTable.waitTillContentLoaded();

        await searchResultPage.checkContentIsDisplayed(firstFileModel.name);
    });

    it('[C290137] Should be able to search by \'%\'', async () => {
        await openSearchBar();

        await searchBarPage.enterTextAndPressEnter('%');
        await searchResultPage.dataTable.waitTillContentLoaded();
    });

    describe('Highlight', () => {
        const searchConfiguration = SearchConfiguration.getConfiguration();

        beforeAll(async () => {
            await navigationBarPage.navigateToContentServices();

            await LocalStorageUtil.setConfigField('search', JSON.stringify(searchConfiguration));

            await openSearchBar();

            await searchBarPage.enterTextAndPressEnter(term);
            await searchResultPage.dataTable.waitTillContentLoaded();

        });

        it('[C299212] Should be able to configure the highlight option for search results', async () => {
            const text = await searchResultPage.getNodeHighlight(fileHighlightUploaded.entry.name).getText();
            await expect(text.includes(`¿${term}?`)).toBe(true);
            await expect(text.includes(`(${term})`)).toBe(true);
        });
    });

    async function openSearchBar(): Promise<void> {
        if (await searchBarPage.searchBarExpanded.isDisplayed()) {
            await searchBarPage.clearText();
            await searchBarPage.checkSearchBarIsNotVisible();
        }

        await searchBarPage.clickOnSearchIcon();
        await searchBarPage.checkSearchBarIsVisible();
    }
});
