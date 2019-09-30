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

import { LoginPage, BrowserActions, UploadActions, StringUtil, LocalStorageUtil } from '@alfresco/adf-testing';
import { SearchResultsPage } from '../../pages/adf/searchResultsPage';
import { SearchFiltersPage } from '../../pages/adf/searchFiltersPage';
import { SearchDialog } from '../../pages/adf/dialog/searchDialog';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { SearchConfiguration } from '../search.config';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { browser } from 'protractor';

describe('Search Checklist Component', () => {

    const loginPage = new LoginPage();
    const searchFiltersPage = new SearchFiltersPage();
    const searchDialog = new SearchDialog();
    const searchResults = new SearchResultsPage();
    const navigationBarPage = new NavigationBarPage();

    const acsUser = new AcsUserModel();
    this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: browser.params.testConfig.adf_acs.host
        });
    const uploadActions = new UploadActions(this.alfrescoJsApi);

    const filterType = {
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
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        createdFolder = await this.alfrescoJsApi.nodes.addNode('-my-', { name: nodeNames.folder, nodeType: 'cm:folder' });
        createdFile = await this.alfrescoJsApi.nodes.addNode('-my-', { name: nodeNames.document, nodeType: 'cm:content' });

        await browser.sleep(15000);

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

    });

    beforeEach(async () => {
        await navigationBarPage.clickContentServicesButton();
        await BrowserActions.getUrl(`${browser.params.testConfig.adf.url}/search;q=${randomName}`);
    });

    afterAll(async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await uploadActions.deleteFileOrFolder(createdFile.entry.id);
        await uploadActions.deleteFileOrFolder(createdFolder.entry.id);

        await navigationBarPage.clickLogoutButton();

    });

    it('[C276991] Should be able to click between options and Clear All button', async() => {
        await searchFiltersPage.checkCheckListFilterIsDisplayed();
        await searchFiltersPage.checkCheckListFilterIsCollapsed();
        await searchFiltersPage.clickCheckListFilter();

        await searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsDisplayed(filterType.folder);
        await searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsDisplayed(filterType.document);
        await searchFiltersPage.checkListFiltersPage().checkClearAllButtonIsDisplayed();
        await searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsNotSelected(filterType.folder);
        await searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsNotSelected(filterType.document);
        await searchFiltersPage.checkListFiltersPage().clickCheckListOption(filterType.folder);
        await searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsSelected(filterType.folder);

        await searchResults.checkContentIsDisplayed(nodeNames.folder);
        await searchResults.checkContentIsNotDisplayed(nodeNames.document);

        await searchFiltersPage.checkListFiltersPage().clickClearAllButton();
        await searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsNotSelected(filterType.folder);

        await searchResults.checkContentIsDisplayed(nodeNames.folder);
        await searchResults.checkContentIsDisplayed(nodeNames.document);

        await searchFiltersPage.checkListFiltersPage().clickCheckListOption(filterType.folder);
        await searchFiltersPage.checkListFiltersPage().clickCheckListOption(filterType.document);
        await searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsSelected(filterType.folder);
        await searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsSelected(filterType.document);

        await searchResults.checkContentIsDisplayed(nodeNames.folder);
        await searchResults.checkContentIsDisplayed(nodeNames.document);

        await searchFiltersPage.checkListFiltersPage().clickCheckListOption(filterType.folder);
        await searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsSelected(filterType.document);
        await searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsNotSelected(filterType.folder);

        await searchResults.checkContentIsDisplayed(nodeNames.document);
        await searchResults.checkContentIsNotDisplayed(nodeNames.folder);
    });

    describe('configuration change', () => {
        let jsonFile;

        beforeEach(() => {
            jsonFile = SearchConfiguration.getConfiguration();
        });

        it('[C277143] Should be able to click show more/less button with pageSize set as default', async () => {
            await navigationBarPage.clickContentServicesButton();

            for (let numberOfOptions = 0; numberOfOptions < 8; numberOfOptions++) {
                jsonFile.categories[1].component.settings.options.push({
                    'name': 'Folder',
                    'value': "TYPE:'cm:folder'"
                });
            }

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));
            await searchDialog.clickOnSearchIcon();
            await searchDialog.checkSearchBarIsVisible();
            await searchDialog.enterTextAndPressEnter(randomName);
            await searchFiltersPage.clickCheckListFilter();

            await expect(await searchFiltersPage.checkListFiltersPage().getCheckListOptionsNumberOnPage()).toBe(5);

            await searchFiltersPage.checkListFiltersPage().checkShowMoreButtonIsDisplayed();
            await searchFiltersPage.checkListFiltersPage().checkShowLessButtonIsNotDisplayed();

            await searchFiltersPage.checkListFiltersPage().clickShowMoreButton();

            await expect(await searchFiltersPage.checkListFiltersPage().getCheckListOptionsNumberOnPage()).toBe(10);

            await searchFiltersPage.checkListFiltersPage().checkShowMoreButtonIsNotDisplayed();
            await searchFiltersPage.checkListFiltersPage().checkShowLessButtonIsDisplayed();

            await searchFiltersPage.checkListFiltersPage().clickShowLessButton();

            await expect(await searchFiltersPage.checkListFiltersPage().getCheckListOptionsNumberOnPage()).toBe(5);

            await searchFiltersPage.checkListFiltersPage().checkShowMoreButtonIsDisplayed();
            await searchFiltersPage.checkListFiltersPage().checkShowLessButtonIsNotDisplayed();
        });

        it('[C277144] Should be able to click show more/less button with pageSize set with a custom value', async () => {
            await navigationBarPage.clickContentServicesButton();

            jsonFile.categories[1].component.settings.pageSize = 10;

            for (let numberOfOptions = 0; numberOfOptions < 8; numberOfOptions++) {
                jsonFile.categories[1].component.settings.options.push({
                    'name': 'Folder',
                    'value': "TYPE:'cm:folder'"
                });
            }

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchDialog.clickOnSearchIcon();
            await searchDialog.checkSearchBarIsVisible();
            await searchDialog.enterTextAndPressEnter(randomName);
            await searchFiltersPage.clickCheckListFilter();

            await expect(await searchFiltersPage.checkListFiltersPage().getCheckListOptionsNumberOnPage()).toBe(10);

            await searchFiltersPage.checkListFiltersPage().checkShowMoreButtonIsNotDisplayed();

            await navigationBarPage.clickContentServicesButton();
            jsonFile.categories[1].component.settings.pageSize = 11;

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchDialog.clickOnSearchIcon();
            await searchDialog.checkSearchBarIsVisible();
            await searchDialog.enterTextAndPressEnter(randomName);
            await searchFiltersPage.clickCheckListFilter();

            await expect(await searchFiltersPage.checkListFiltersPage().getCheckListOptionsNumberOnPage()).toBe(10);

            await searchFiltersPage.checkListFiltersPage().checkShowMoreButtonIsNotDisplayed();

            await navigationBarPage.clickContentServicesButton();

            jsonFile.categories[1].component.settings.pageSize = 9;

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchDialog.clickOnSearchIcon();
            await searchDialog.checkSearchBarIsVisible();
            await searchDialog.enterTextAndPressEnter(randomName);
            await searchFiltersPage.clickCheckListFilter();

            await expect(await searchFiltersPage.checkListFiltersPage().getCheckListOptionsNumberOnPage()).toBe(9);

            await searchFiltersPage.checkListFiltersPage().checkShowMoreButtonIsDisplayed();
        });

        it('[C277145] Should be able to click show more/less button with pageSize set to zero', async () => {
            await navigationBarPage.clickContentServicesButton();

            jsonFile.categories[1].component.settings.pageSize = 0;

            for (let numberOfOptions = 0; numberOfOptions < 8; numberOfOptions++) {
                jsonFile.categories[1].component.settings.options.push({
                    'name': 'Folder',
                    'value': "TYPE:'cm:folder'"
                });
            }

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchDialog.clickOnSearchIcon();
            await searchDialog.checkSearchBarIsVisible();
            await searchDialog.enterTextAndPressEnter(randomName);
            await searchFiltersPage.clickCheckListFilter();

            await expect(await searchFiltersPage.checkListFiltersPage().getCheckListOptionsNumberOnPage()).toBe(5);

            await searchFiltersPage.checkListFiltersPage().checkShowMoreButtonIsDisplayed();
            await searchFiltersPage.checkListFiltersPage().checkShowLessButtonIsNotDisplayed();

            await searchFiltersPage.checkListFiltersPage().clickShowMoreButton();

            await expect(await searchFiltersPage.checkListFiltersPage().getCheckListOptionsNumberOnPage()).toBe(10);

            await searchFiltersPage.checkListFiltersPage().checkShowMoreButtonIsNotDisplayed();
            await searchFiltersPage.checkListFiltersPage().checkShowLessButtonIsDisplayed();

            await navigationBarPage.clickContentServicesButton();

            delete jsonFile.categories[1].component.settings.pageSize;

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchDialog.clickOnSearchIcon();
            await searchDialog.checkSearchBarIsVisible();
            await searchDialog.enterTextAndPressEnter(randomName);
            await searchFiltersPage.clickCheckListFilter();

            await expect(await searchFiltersPage.checkListFiltersPage().getCheckListOptionsNumberOnPage()).toBe(5);

            await searchFiltersPage.checkListFiltersPage().checkShowMoreButtonIsDisplayed();
            await searchFiltersPage.checkListFiltersPage().checkShowLessButtonIsNotDisplayed();

            await searchFiltersPage.checkListFiltersPage().clickShowMoreButton();

            await expect(await searchFiltersPage.checkListFiltersPage().getCheckListOptionsNumberOnPage()).toBe(10);

            await searchFiltersPage.checkListFiltersPage().checkShowMoreButtonIsNotDisplayed();
            await searchFiltersPage.checkListFiltersPage().checkShowLessButtonIsDisplayed();
        });

    });

    describe('Properties', () => {

        let jsonFile;

        beforeEach(() => {
            jsonFile = SearchConfiguration.getConfiguration();
        });

        beforeAll(async () => {
            await loginPage.loginToContentServicesUsingUserModel(acsUser);

        });

        it('[C277018] Should be able to change the operator', async () => {
            await navigationBarPage.clickContentServicesButton();

            jsonFile.categories[1].component.settings.operator = 'AND';

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchDialog.clickOnSearchIcon();
            await searchDialog.checkSearchBarIsVisible();
            await searchDialog.enterTextAndPressEnter(randomName);
            await searchFiltersPage.clickCheckListFilter();

            await searchFiltersPage.checkListFiltersPage().clickCheckListOption(filterType.folder);
            await searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsSelected(filterType.folder);

            await searchResults.checkContentIsDisplayed(nodeNames.folder);
            await searchResults.checkContentIsNotDisplayed(nodeNames.document);

            await searchFiltersPage.checkListFiltersPage().clickCheckListOption(filterType.document);

            await searchResults.checkContentIsNotDisplayed(nodeNames.folder);
            await searchResults.checkContentIsNotDisplayed(nodeNames.document);
        });

        it('[C277019] Should be able to add new properties with different types', async () => {
            await navigationBarPage.clickContentServicesButton();

            jsonFile.categories[1].component.settings.options.push({
                'name': filterType.custom,
                'value': "TYPE:'cm:auditable'"
            });

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchDialog.clickOnSearchIcon();
            await searchDialog.checkSearchBarIsVisible();
            await searchDialog.enterTextAndPressEnter(randomName);
            await searchFiltersPage.clickCheckListFilter();

            await searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsDisplayed(filterType.folder);
            await searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsDisplayed(filterType.document);
            await searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsDisplayed(filterType.custom);

            await searchFiltersPage.checkListFiltersPage().clickCheckListOption(filterType.custom);

            await searchResults.checkContentIsNotDisplayed(nodeNames.folder);
            await searchResults.checkContentIsNotDisplayed(nodeNames.document);

            await searchFiltersPage.checkListFiltersPage().clickCheckListOption(filterType.document);
            await searchFiltersPage.checkListFiltersPage().clickCheckListOption(filterType.folder);

            await searchResults.checkContentIsDisplayed(nodeNames.folder);
            await searchResults.checkContentIsDisplayed(nodeNames.document);
        });
    });

});
