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

import {
    ApiService,
    BrowserActions,
    LocalStorageUtil,
    LoginPage,
    StringUtil,
    UploadActions,
    UserModel,
    UsersActions
} from '@alfresco/adf-testing';
import { SearchFiltersPage } from '../pages/search-filters.page';
import { SearchResultsPage } from '../pages/search-results.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { SearchBarPage } from '../pages/search-bar.page';
import { SearchConfiguration } from '../search.config';
import { browser } from 'protractor';

describe('Search Radio Component', () => {

    const loginPage = new LoginPage();
    const searchFiltersPage = new SearchFiltersPage();
    const navigationBarPage = new NavigationBarPage();
    const searchBarPage = new SearchBarPage();
    const searchResults = new SearchResultsPage();

    const acsUser = new UserModel();
    const apiService = new ApiService();

    const uploadActions = new UploadActions(apiService);
    const usersActions = new UsersActions(apiService);

    const filterType = {
        none: 'None',
        all: 'All',
        folder: 'Folder',
        document: 'Document',
        custom: 'TEST_NAME'
    };

    const randomName = StringUtil.generateRandomString();
    const nodeNames = {
        document: `${randomName}.txt`,
        folder: `${randomName}Folder`
    };

    let createdFile, createdFolder;

    beforeAll(async () => {
        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

        await usersActions.createUser(acsUser);
        await apiService.getInstance().login(acsUser.email, acsUser.password);

        createdFolder = await apiService.getInstance().nodes.addNode('-my-', {
            name: nodeNames.folder,
            nodeType: 'cm:folder'
        });
        createdFile = await apiService.getInstance().nodes.addNode('-my-', {
            name: nodeNames.document,
            nodeType: 'cm:content'
        });

        await browser.sleep(browser.params.testConfig.timeouts.index_search);

        await loginPage.login(acsUser.email, acsUser.password);

        await BrowserActions.getUrl(browser.baseUrl + '/search;q=' + randomName);
   });

    afterAll(async () => {
        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

        await uploadActions.deleteFileOrFolder(createdFile.entry.id);
        await uploadActions.deleteFileOrFolder(createdFolder.entry.id);

        await navigationBarPage.clickLogoutButton();
   });

    it('[C277039] Should be able to choose only one option at a time', async () => {
        await searchFiltersPage.checkTypeFilterIsDisplayed();
        await searchFiltersPage.checkTypeFilterIsCollapsed();
        await searchFiltersPage.clickTypeFilterHeader();

        await searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsDisplayed(filterType.none);
        await searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsDisplayed(filterType.all);
        await searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsDisplayed(filterType.folder);
        await searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsDisplayed(filterType.document);

        await searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsChecked(filterType.none);

        await searchResults.checkContentIsDisplayed(nodeNames.folder);
        await searchResults.checkContentIsDisplayed(nodeNames.document);

        await searchFiltersPage.typeFiltersPage().clickFilterRadioButton(filterType.folder);
        await searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsChecked(filterType.folder);

        await searchResults.checkContentIsDisplayed(nodeNames.folder);
        await searchResults.checkContentIsNotDisplayed(nodeNames.document);

        await searchFiltersPage.typeFiltersPage().clickFilterRadioButton(filterType.document);
        await searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsChecked(filterType.document);

        await searchResults.checkContentIsDisplayed(nodeNames.document);
        await searchResults.checkContentIsNotDisplayed(nodeNames.folder);

        await searchFiltersPage.typeFiltersPage().clickFilterRadioButton(filterType.all);
        await searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsChecked(filterType.all);

        await searchResults.checkContentIsDisplayed(nodeNames.folder);
        await searchResults.checkContentIsDisplayed(nodeNames.document);
    });

    describe('configuration change', () => {
        let jsonFile;

        beforeEach(() => {
            jsonFile = SearchConfiguration.getConfiguration();
        });

        it('[C277147] Should be able to customise the pageSize value', async () => {
            await navigationBarPage.clickContentServicesButton();

            jsonFile.categories[5].component.settings.pageSize = 10;

            for (let numberOfOptions = 0; numberOfOptions < 6; numberOfOptions++) {
                jsonFile.categories[5].component.settings.options.push({
                    'name': 'APP.SEARCH.RADIO.FOLDER',
                    'value': "TYPE:'cm:folder'"
                });
            }

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchBarPage.clickOnSearchIcon();
            await searchBarPage.checkSearchBarIsVisible();
            await searchBarPage.enterTextAndPressEnter(randomName);
            await searchResults.dataTable.waitTillContentLoaded();

            await searchFiltersPage.clickTypeFilterHeader();

            await expect(await searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()).toBe(10);

            await navigationBarPage.clickContentServicesButton();

            jsonFile.categories[5].component.settings.pageSize = 11;

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchBarPage.clickOnSearchIcon();
            await searchBarPage.checkSearchBarIsVisible();
            await searchBarPage.enterTextAndPressEnter(randomName);
            await searchResults.dataTable.waitTillContentLoaded();

            await searchFiltersPage.clickTypeFilterHeader();

            await expect(await searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()).toBe(10);

            await navigationBarPage.clickContentServicesButton();
            jsonFile.categories[5].component.settings.pageSize = 9;

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchBarPage.clickOnSearchIcon();
            await searchBarPage.checkSearchBarIsVisible();
            await searchBarPage.enterTextAndPressEnter(randomName);
            await searchResults.dataTable.waitTillContentLoaded();

            await searchFiltersPage.clickTypeFilterHeader();

            await expect(await searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()).toBe(9);

            await searchFiltersPage.typeFiltersPage().checkShowMoreButtonIsDisplayed();
            await searchFiltersPage.typeFiltersPage().checkShowLessButtonIsNotDisplayed();

            await browser.refresh();
        });

        it('[C277148] Should be able to click show more/less button', async () => {
            await navigationBarPage.clickContentServicesButton();

            jsonFile.categories[5].component.settings.pageSize = 0;

            for (let numberOfOptions = 0; numberOfOptions < 6; numberOfOptions++) {
                jsonFile.categories[5].component.settings.options.push({
                    'name': 'APP.SEARCH.RADIO.FOLDER',
                    'value': "TYPE:'cm:folder'"
                });
            }

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchBarPage.clickOnSearchIcon();
            await searchBarPage.checkSearchBarIsVisible();
            await searchBarPage.enterTextAndPressEnter(randomName);
            await searchResults.dataTable.waitTillContentLoaded();

            await searchFiltersPage.clickTypeFilterHeader();

            await expect(await searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()).toBe(5);

            await searchFiltersPage.typeFiltersPage().checkShowMoreButtonIsDisplayed();
            await searchFiltersPage.typeFiltersPage().checkShowLessButtonIsNotDisplayed();

            await searchFiltersPage.typeFiltersPage().clickShowMoreButton();

            await expect(await searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()).toBe(10);

            await searchFiltersPage.typeFiltersPage().checkShowMoreButtonIsNotDisplayed();
            await searchFiltersPage.typeFiltersPage().checkShowLessButtonIsDisplayed();

            await searchFiltersPage.typeFiltersPage().clickShowLessButton();

            await expect(await searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()).toBe(5);

            await searchFiltersPage.typeFiltersPage().checkShowMoreButtonIsDisplayed();
            await searchFiltersPage.typeFiltersPage().checkShowLessButtonIsNotDisplayed();

            await navigationBarPage.clickContentServicesButton();
            delete jsonFile.categories[5].component.settings.pageSize;

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchBarPage.clickOnSearchIcon();
            await searchBarPage.checkSearchBarIsVisible();
            await searchBarPage.enterTextAndPressEnter(randomName);
            await searchResults.dataTable.waitTillContentLoaded();

            await searchFiltersPage.clickTypeFilterHeader();

            await expect(await searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()).toBe(5);

            await searchFiltersPage.typeFiltersPage().checkShowMoreButtonIsDisplayed();
            await searchFiltersPage.typeFiltersPage().checkShowLessButtonIsNotDisplayed();

            await searchFiltersPage.typeFiltersPage().clickShowMoreButton();

            await expect(await searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()).toBe(10);

            await searchFiltersPage.typeFiltersPage().checkShowMoreButtonIsNotDisplayed();
            await searchFiltersPage.typeFiltersPage().checkShowLessButtonIsDisplayed();

            await searchFiltersPage.typeFiltersPage().clickShowLessButton();

            await expect(await searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()).toBe(5);

            await searchFiltersPage.typeFiltersPage().checkShowMoreButtonIsDisplayed();
            await searchFiltersPage.typeFiltersPage().checkShowLessButtonIsNotDisplayed();
        });
   });

    describe('Properties', () => {
        let jsonFile;

        beforeEach(() => {
            jsonFile = SearchConfiguration.getConfiguration();
        });

        beforeAll(async () => {
            await navigationBarPage.clickLogoutButton();
            await loginPage.login(acsUser.email, acsUser.password);
        });

        it('[C277033] Should be able to add a new option', async () => {
            await navigationBarPage.clickContentServicesButton();

            jsonFile.categories[5].component.settings.options.push({
                'name': filterType.custom,
                'value': "TYPE:'cm:content'"
            });

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchBarPage.clickOnSearchIcon();
            await searchBarPage.checkSearchBarIsVisible();
            await searchBarPage.enterTextAndPressEnter(randomName);
            await searchResults.dataTable.waitTillContentLoaded();

            await searchFiltersPage.clickTypeFilterHeader();

            await searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsDisplayed(filterType.none);
            await searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsDisplayed(filterType.all);
            await searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsDisplayed(filterType.folder);
            await searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsDisplayed(filterType.document);
            await searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsDisplayed(filterType.custom);
            await searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsChecked(filterType.none);

            await searchFiltersPage.typeFiltersPage().clickFilterRadioButton(filterType.custom);

            await searchResults.checkContentIsDisplayed(nodeNames.document);
            await searchResults.checkContentIsNotDisplayed(nodeNames.folder);
        });
   });
});
