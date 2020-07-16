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

import { browser } from 'protractor';

import { FolderModel } from '../../models/ACS/folder.model';

import {
    ApiService,
    BrowserActions,
    LocalStorageUtil,
    LoginPage,
    UserModel,
    UsersActions
} from '@alfresco/adf-testing';
import { SearchDialogPage } from '../pages/search-dialog.page';
import { SearchResultsPage } from '../pages/search-results.page';
import { SearchFiltersPage } from '../pages/search-filters.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';

import { SearchConfiguration } from '../search.config';

describe('Search component - Text widget', () => {

    const navigationBarPage = new NavigationBarPage();
    const searchFiltersPage = new SearchFiltersPage();

    const loginPage = new LoginPage();
    const searchDialog = new SearchDialogPage();
    const searchResultPage = new SearchResultsPage();

    const apiService = new ApiService();
    const usersActions = new UsersActions(apiService);

    const acsUser = new UserModel();
    const newFolderModel = new FolderModel({ 'description': 'newDescription' });

    beforeAll(async () => {
        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

        await usersActions.createUser(acsUser);

        await apiService.getInstance().login(acsUser.email, acsUser.password);

        await apiService.getInstance().nodes.addNode('-my-', {
            'name': newFolderModel.name,
            'nodeType': 'cm:folder',
            'properties':
                {
                    'cm:description': newFolderModel.description
                }
        }, {});

        await browser.sleep(15000);

        await loginPage.login(acsUser.email, acsUser.password);
    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    it('[C289329] Placeholder should be displayed in the widget when the input string is empty', async () => {
        await BrowserActions.getUrl(browser.baseUrl + '/search;q=*');
        await searchResultPage.tableIsLoaded();

        await searchFiltersPage.checkNameFilterIsDisplayed();
        await expect(await searchFiltersPage.textFiltersPage().getNamePlaceholder()).toEqual('Enter the name');
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
            await searchResultPage.checkContentIsDisplayed(newFolderModel.name);

            await searchFiltersPage.textFiltersPage().searchByName(newFolderModel.description);
            await searchResultPage.checkContentIsNotDisplayed(newFolderModel.name);

            jsonFile.categories[0].component.settings.field = 'cm:description';

            await navigationBarPage.clickContentServicesButton();
            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchDialog.clickOnSearchIcon();
            await searchDialog.enterTextAndPressEnter('*');
            await searchResultPage.tableIsLoaded();

            await searchFiltersPage.checkCheckListFilterIsDisplayed();
            await searchFiltersPage.clickCheckListFilter();
            await searchFiltersPage.checkListFiltersPage().clickCheckListOption('Folder');

            await searchFiltersPage.checkNameFilterIsDisplayed();
            await searchFiltersPage.textFiltersPage().searchByName(newFolderModel.name);
            await searchResultPage.checkContentIsNotDisplayed(newFolderModel.name);

            await searchFiltersPage.textFiltersPage().searchByName(newFolderModel.description);
            await searchResultPage.checkContentIsDisplayed(newFolderModel.name);
        });
    });
});
