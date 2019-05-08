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

import { LoginPage, BrowserActions } from '@alfresco/adf-testing';
import { SearchResultsPage } from '../../pages/adf/searchResultsPage';
import { SearchFiltersPage } from '../../pages/adf/searchFiltersPage';
import { SearchDialog } from '../../pages/adf/dialog/searchDialog';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

import { AcsUserModel } from '../../models/ACS/acsUserModel';

import TestConfig = require('../../test.config');

import { SearchConfiguration } from '../search.config';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '../../actions/ACS/upload.actions';
import { browser } from 'protractor';
import { StringUtil, LocalStorageUtil } from '@alfresco/adf-testing';

describe('Search Checklist Component', () => {

    const loginPage = new LoginPage();
    const searchFiltersPage = new SearchFiltersPage();
    const searchDialog = new SearchDialog();
    const searchResults = new SearchResultsPage();
    const navigationBarPage = new NavigationBarPage();

    const acsUser = new AcsUserModel();
    const uploadActions = new UploadActions();

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

    beforeAll(async (done) => {

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        createdFolder = await this.alfrescoJsApi.nodes.addNode('-my-', {
            name: nodeNames.folder,
            nodeType: 'cm:folder'
        });
        createdFile = await this.alfrescoJsApi.nodes.addNode('-my-', {
            name: nodeNames.document,
            nodeType: 'cm:content'
        });

        await browser.driver.sleep(15000);

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        BrowserActions.getUrl(TestConfig.adf.url + '/search;q=' + randomName + '');

        done();
    });

    afterAll(async (done) => {
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, createdFile.entry.id);
        await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, createdFolder.entry.id);

        done();
    });

    it('[C276991] Should be able to click between options and Clear All button', () => {
        searchFiltersPage.checkCheckListFilterIsDisplayed();
        searchFiltersPage.checkCheckListFilterIsCollapsed();
        searchFiltersPage.clickCheckListFilter();

        searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsDisplayed(filterType.folder);
        searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsDisplayed(filterType.document);
        searchFiltersPage.checkListFiltersPage().checkClearAllButtonIsDisplayed();
        searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsNotSelected(filterType.folder);
        searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsNotSelected(filterType.document);
        searchFiltersPage.checkListFiltersPage().clickCheckListOption(filterType.folder);
        searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsSelected(filterType.folder);

        searchResults.checkContentIsDisplayed(nodeNames.folder);
        searchResults.checkContentIsNotDisplayed(nodeNames.document);

        searchFiltersPage.checkListFiltersPage().clickClearAllButton();
        searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsNotSelected(filterType.folder);

        searchResults.checkContentIsDisplayed(nodeNames.folder);
        searchResults.checkContentIsDisplayed(nodeNames.document);

        searchFiltersPage.checkListFiltersPage().clickCheckListOption(filterType.folder);
        searchFiltersPage.checkListFiltersPage().clickCheckListOption(filterType.document);
        searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsSelected(filterType.folder);
        searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsSelected(filterType.document);

        searchResults.checkContentIsDisplayed(nodeNames.folder);
        searchResults.checkContentIsDisplayed(nodeNames.document);

        searchFiltersPage.checkListFiltersPage().clickCheckListOption(filterType.folder);
        searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsSelected(filterType.document);
        searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsNotSelected(filterType.folder);

        searchResults.checkContentIsDisplayed(nodeNames.document);
        searchResults.checkContentIsNotDisplayed(nodeNames.folder);
    });

    describe('configuration change', () => {
        let jsonFile;

        beforeEach(() => {
            jsonFile = SearchConfiguration.getConfiguration();
        });

        it('[C277143] Should be able to click show more/less button with pageSize set as default', async () => {
            navigationBarPage.clickContentServicesButton();

            for (let numberOfOptions = 0; numberOfOptions < 8; numberOfOptions++) {
                jsonFile.categories[1].component.settings.options.push({
                    'name': 'Folder',
                    'value': "TYPE:'cm:folder'"
                });
            }

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));
            browser.sleep(2000);
            searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterTextAndPressEnter(randomName);
            searchFiltersPage.clickCheckListFilter();

            expect(searchFiltersPage.checkListFiltersPage().getCheckListOptionsNumberOnPage()).toBe(5);

            searchFiltersPage.checkListFiltersPage().checkShowMoreButtonIsDisplayed();
            searchFiltersPage.checkListFiltersPage().checkShowLessButtonIsNotDisplayed();

            searchFiltersPage.checkListFiltersPage().clickShowMoreButton();

            expect(searchFiltersPage.checkListFiltersPage().getCheckListOptionsNumberOnPage()).toBe(10);

            searchFiltersPage.checkListFiltersPage().checkShowMoreButtonIsNotDisplayed();
            searchFiltersPage.checkListFiltersPage().checkShowLessButtonIsDisplayed();

            searchFiltersPage.checkListFiltersPage().clickShowLessButton();

            expect(searchFiltersPage.checkListFiltersPage().getCheckListOptionsNumberOnPage()).toBe(5);

            searchFiltersPage.checkListFiltersPage().checkShowMoreButtonIsDisplayed();
            searchFiltersPage.checkListFiltersPage().checkShowLessButtonIsNotDisplayed();
        });

        it('[C277144] Should be able to click show more/less button with pageSize set with a custom value', async () => {
            navigationBarPage.clickContentServicesButton();

            jsonFile.categories[1].component.settings.pageSize = 10;

            for (let numberOfOptions = 0; numberOfOptions < 8; numberOfOptions++) {
                jsonFile.categories[1].component.settings.options.push({
                    'name': 'Folder',
                    'value': "TYPE:'cm:folder'"
                });
            }

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterTextAndPressEnter(randomName);
            searchFiltersPage.clickCheckListFilter();

            expect(searchFiltersPage.checkListFiltersPage().getCheckListOptionsNumberOnPage()).toBe(10);

            searchFiltersPage.checkListFiltersPage().checkShowMoreButtonIsNotDisplayed();

            navigationBarPage.clickContentServicesButton();
            jsonFile.categories[1].component.settings.pageSize = 11;

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterTextAndPressEnter(randomName);
            searchFiltersPage.clickCheckListFilter();

            expect(searchFiltersPage.checkListFiltersPage().getCheckListOptionsNumberOnPage()).toBe(10);

            searchFiltersPage.checkListFiltersPage().checkShowMoreButtonIsNotDisplayed();

            navigationBarPage.clickContentServicesButton();

            jsonFile.categories[1].component.settings.pageSize = 9;

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterTextAndPressEnter(randomName);
            searchFiltersPage.clickCheckListFilter();

            expect(searchFiltersPage.checkListFiltersPage().getCheckListOptionsNumberOnPage()).toBe(9);

            searchFiltersPage.checkListFiltersPage().checkShowMoreButtonIsDisplayed();
        });

        it('[C277145] Should be able to click show more/less button with pageSize set to zero', async () => {
            navigationBarPage.clickContentServicesButton();

            jsonFile.categories[1].component.settings.pageSize = 0;

            for (let numberOfOptions = 0; numberOfOptions < 8; numberOfOptions++) {
                jsonFile.categories[1].component.settings.options.push({
                    'name': 'Folder',
                    'value': "TYPE:'cm:folder'"
                });
            }

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterTextAndPressEnter(randomName);
            searchFiltersPage.clickCheckListFilter();

            expect(searchFiltersPage.checkListFiltersPage().getCheckListOptionsNumberOnPage()).toBe(5);

            searchFiltersPage.checkListFiltersPage().checkShowMoreButtonIsDisplayed();
            searchFiltersPage.checkListFiltersPage().checkShowLessButtonIsNotDisplayed();

            searchFiltersPage.checkListFiltersPage().clickShowMoreButton();

            expect(searchFiltersPage.checkListFiltersPage().getCheckListOptionsNumberOnPage()).toBe(10);

            searchFiltersPage.checkListFiltersPage().checkShowMoreButtonIsNotDisplayed();
            searchFiltersPage.checkListFiltersPage().checkShowLessButtonIsDisplayed();

            navigationBarPage.clickContentServicesButton();

            delete jsonFile.categories[1].component.settings.pageSize;

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterTextAndPressEnter(randomName);
            searchFiltersPage.clickCheckListFilter();

            expect(searchFiltersPage.checkListFiltersPage().getCheckListOptionsNumberOnPage()).toBe(5);

            searchFiltersPage.checkListFiltersPage().checkShowMoreButtonIsDisplayed();
            searchFiltersPage.checkListFiltersPage().checkShowLessButtonIsNotDisplayed();

            searchFiltersPage.checkListFiltersPage().clickShowMoreButton();

            expect(searchFiltersPage.checkListFiltersPage().getCheckListOptionsNumberOnPage()).toBe(10);

            searchFiltersPage.checkListFiltersPage().checkShowMoreButtonIsNotDisplayed();
            searchFiltersPage.checkListFiltersPage().checkShowLessButtonIsDisplayed();
        });

    });

    describe('Properties', () => {

        let jsonFile;

        beforeEach(() => {
            jsonFile = SearchConfiguration.getConfiguration();
        });

        beforeAll(async (done) => {
            await loginPage.loginToContentServicesUsingUserModel(acsUser);

            done();
        });

        it('[C277018] Should be able to change the operator', async () => {
            navigationBarPage.clickContentServicesButton();

            jsonFile.categories[1].component.settings.operator = 'AND';

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterTextAndPressEnter(randomName);
            searchFiltersPage.clickCheckListFilter();

            searchFiltersPage.checkListFiltersPage().clickCheckListOption(filterType.folder);
            searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsSelected(filterType.folder);

            searchResults.checkContentIsDisplayed(nodeNames.folder);
            searchResults.checkContentIsNotDisplayed(nodeNames.document);

            searchFiltersPage.checkListFiltersPage().clickCheckListOption(filterType.document);

            searchResults.checkContentIsNotDisplayed(nodeNames.folder);
            searchResults.checkContentIsNotDisplayed(nodeNames.document);
        });

        it('[C277019] Should be able to add new properties with different types', async () => {
            navigationBarPage.clickContentServicesButton();

            jsonFile.categories[1].component.settings.options.push({
                'name': filterType.custom,
                'value': "TYPE:'cm:auditable'"
            });

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterTextAndPressEnter(randomName);
            searchFiltersPage.clickCheckListFilter();

            searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsDisplayed(filterType.folder);
            searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsDisplayed(filterType.document);
            searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsDisplayed(filterType.custom);

            searchFiltersPage.checkListFiltersPage().clickCheckListOption(filterType.custom);

            searchResults.checkContentIsNotDisplayed(nodeNames.folder);
            searchResults.checkContentIsNotDisplayed(nodeNames.document);

            searchFiltersPage.checkListFiltersPage().clickCheckListOption(filterType.document);
            searchFiltersPage.checkListFiltersPage().clickCheckListOption(filterType.folder);

            searchResults.checkContentIsDisplayed(nodeNames.folder);
            searchResults.checkContentIsDisplayed(nodeNames.document);
        });
    });

});
