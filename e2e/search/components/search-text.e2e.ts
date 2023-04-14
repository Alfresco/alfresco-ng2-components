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

import { FolderModel } from '../../models/ACS/folder.model';

import { createApiService,
    BrowserActions,
    LocalStorageUtil,
    LoginPage,
    UserModel,
    UsersActions
} from '@alfresco/adf-testing';
import { SearchBarPage } from '../pages/search-bar.page';
import { SearchResultsPage } from '../pages/search-results.page';
import { SearchFiltersPage } from '../pages/search-filters.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';

import { SearchConfiguration } from '../search.config';
import { NodesApi } from '@alfresco/js-api';

describe('Search component - Text widget', () => {

    const navigationBarPage = new NavigationBarPage();
    const searchFiltersPage = new SearchFiltersPage();

    const loginPage = new LoginPage();
    const searchBarPage = new SearchBarPage();
    const searchResultPage = new SearchResultsPage();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const nodesApi = new NodesApi(apiService.getInstance());

    const acsUser = new UserModel();
    const newFolderModel = new FolderModel({ description: 'newDescription' });

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        await usersActions.createUser(acsUser);

        await apiService.login(acsUser.username, acsUser.password);

        await nodesApi.createNode('-my-', {
            name: newFolderModel.name,
            nodeType: 'cm:folder',
            properties:
                {
                    'cm:description': newFolderModel.description
                }
        }, {});

        await browser.sleep(browser.params.testConfig.timeouts.index_search);

        await loginPage.login(acsUser.username, acsUser.password);
    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    describe('configuration change', () => {
        let jsonFile;

        beforeAll(async () => {
            jsonFile = SearchConfiguration.getConfiguration();
        });

        it('[C289330] Should be able to change the Field setting', async () => {
            await BrowserActions.getUrl(browser.baseUrl + '/search;q=*');
            await searchResultPage.tableIsLoaded();

            await searchFiltersPage.checkCheckListFilterIsDisplayed();
            await searchFiltersPage.clickCheckListFilter();
            await searchFiltersPage.checkListFiltersPage().clickCheckListOption('Folder');

            await searchFiltersPage.checkNameFilterIsDisplayed();
            await searchFiltersPage.textFiltersPage().searchByName(newFolderModel.name);
            await searchResultPage.dataTable.waitTillContentLoaded();

            await searchResultPage.checkContentIsDisplayed(newFolderModel.name);

            await searchFiltersPage.textFiltersPage().searchByName(newFolderModel.description);
            await searchResultPage.checkContentIsNotDisplayed(newFolderModel.name);

            jsonFile.categories[0].component.settings.field = 'cm:description';

            await navigationBarPage.navigateToContentServices();
            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchBarPage.clickOnSearchIcon();
            await searchBarPage.enterTextAndPressEnter('*');
            await searchResultPage.dataTable.waitTillContentLoaded();

            await searchFiltersPage.checkCheckListFilterIsDisplayed();
            await searchFiltersPage.clickCheckListFilter();
            await searchFiltersPage.checkListFiltersPage().clickCheckListOption('Folder');

            await searchFiltersPage.checkNameFilterIsDisplayed();
            await searchFiltersPage.textFiltersPage().searchByName(newFolderModel.name);
            await searchResultPage.checkContentIsNotDisplayed(newFolderModel.name);

            await searchFiltersPage.textFiltersPage().searchByName(newFolderModel.description);
            await searchResultPage.dataTable.waitTillContentLoaded();

            await searchResultPage.checkContentIsDisplayed(newFolderModel.name);
        });
    });
});
