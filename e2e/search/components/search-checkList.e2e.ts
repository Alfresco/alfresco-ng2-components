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

import { LoginPage } from '../../pages/adf/loginPage';
import { SearchResultsPage } from '../../pages/adf/searchResultsPage';
import { SearchFiltersPage } from '../../pages/adf/searchFiltersPage';
import { ConfigEditorPage } from '../../pages/adf/configEditorPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { SearchDialog } from '../../pages/adf/dialog/searchDialog';

import { AcsUserModel } from '../../models/ACS/acsUserModel';

import TestConfig = require('../../test.config');

import { SearchConfiguration } from '../search.config';

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../../actions/ACS/upload.actions';
import { browser } from 'protractor';
import { Util } from '../../util/util';

describe('Search Checklist Component', () => {

    const loginPage = new LoginPage();
    const searchFiltersPage = new SearchFiltersPage();
    const configEditorPage = new ConfigEditorPage();
    const navigationBarPage = new NavigationBarPage();
    const searchDialog = new SearchDialog();
    const searchResults = new SearchResultsPage();

    let acsUser = new AcsUserModel();
    let uploadActions = new UploadActions();

    let filterType = {
        folder: 'Folder',
        document: 'Document',
        custom: 'TEST_NAME'
    };

    let randomName = Util.generateRandomString();
    let nodeNames = {
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

        createdFolder = await this.alfrescoJsApi.nodes.addNode('-my-', {name: nodeNames.folder, nodeType: 'cm:folder'});
        createdFile = await this.alfrescoJsApi.nodes.addNode('-my-', {name: nodeNames.document, nodeType: 'cm:content'});

        await browser.driver.sleep(15000);

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        browser.get(TestConfig.adf.url + '/search;q=' + randomName + '');

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
            let searchConfiguration = new SearchConfiguration();
            jsonFile = searchConfiguration.getConfiguration();
        });

        it('[C277143] Should be able to click show more/less button with pageSize set as default', () => {
            navigationBarPage.clickConfigEditorButton();

            for (let numberOfOptions = 0; numberOfOptions < 8; numberOfOptions++) {
                jsonFile.categories[1].component.settings.options.push({ 'name': 'Folder', 'value': "TYPE:'cm:folder'" });
            }

            configEditorPage.clickSearchConfiguration();
            configEditorPage.clickClearButton();
            configEditorPage.enterBigConfigurationText(JSON.stringify(jsonFile));
            configEditorPage.clickSaveButton();

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

            browser.refresh();
        });

        it('[C277144] Should be able to click show more/less button with pageSize set with a custom value', () => {
            navigationBarPage.clickConfigEditorButton();

            jsonFile.categories[1].component.settings.pageSize = 10;

            for (let numberOfOptions = 0; numberOfOptions < 8; numberOfOptions++) {
                jsonFile.categories[1].component.settings.options.push({ 'name': 'Folder', 'value': "TYPE:'cm:folder'" });
            }

            configEditorPage.clickSearchConfiguration();
            configEditorPage.clickClearButton();
            configEditorPage.enterBigConfigurationText(JSON.stringify(jsonFile));
            configEditorPage.clickSaveButton();

            searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterTextAndPressEnter(randomName);
            searchFiltersPage.clickCheckListFilter();

            expect(searchFiltersPage.checkListFiltersPage().getCheckListOptionsNumberOnPage()).toBe(10);

            searchFiltersPage.checkListFiltersPage().checkShowMoreButtonIsNotDisplayed();

            browser.refresh();

            navigationBarPage.clickConfigEditorButton();

            jsonFile.categories[1].component.settings.pageSize = 11;

            configEditorPage.clickSearchConfiguration();
            configEditorPage.clickClearButton();
            configEditorPage.enterBigConfigurationText(JSON.stringify(jsonFile));
            configEditorPage.clickSaveButton();

            searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterTextAndPressEnter(randomName);
            searchFiltersPage.clickCheckListFilter();

            expect(searchFiltersPage.checkListFiltersPage().getCheckListOptionsNumberOnPage()).toBe(10);

            searchFiltersPage.checkListFiltersPage().checkShowMoreButtonIsNotDisplayed();

            browser.refresh();

            navigationBarPage.clickConfigEditorButton();

            jsonFile.categories[1].component.settings.pageSize = 9;

            configEditorPage.clickSearchConfiguration();
            configEditorPage.clickClearButton();
            configEditorPage.enterBigConfigurationText(JSON.stringify(jsonFile));
            configEditorPage.clickSaveButton();

            searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterTextAndPressEnter(randomName);
            searchFiltersPage.clickCheckListFilter();

            expect(searchFiltersPage.checkListFiltersPage().getCheckListOptionsNumberOnPage()).toBe(9);

            searchFiltersPage.checkListFiltersPage().checkShowMoreButtonIsDisplayed();

            browser.refresh();
        });

        it('[C277145] Should be able to click show more/less button with pageSize set to zero', () => {
            navigationBarPage.clickConfigEditorButton();

            jsonFile.categories[1].component.settings.pageSize = 0;

            for (let numberOfOptions = 0; numberOfOptions < 8; numberOfOptions++) {
                jsonFile.categories[1].component.settings.options.push({ 'name': 'Folder', 'value': "TYPE:'cm:folder'" });
            }

            configEditorPage.clickSearchConfiguration();
            configEditorPage.clickClearButton();
            configEditorPage.enterBigConfigurationText(JSON.stringify(jsonFile));
            configEditorPage.clickSaveButton();

            searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterTextAndPressEnter(randomName);
            searchFiltersPage.clickCheckListFilter();

            expect(searchFiltersPage.checkListFiltersPage().getCheckListOptionsNumberOnPage()).toBe(5);

            searchFiltersPage.checkListFiltersPage().checkShowMoreButtonIsDisplayed();
            searchFiltersPage.checkListFiltersPage().checkShowLessButtonIsNotDisplayed();

            searchFiltersPage.checkListFiltersPage().clickShowMoreButton();

            expect(searchFiltersPage.checkListFiltersPage().getCheckListOptionsNumberOnPage()).toBe(10);

            searchFiltersPage.checkListFiltersPage().checkShowMoreButtonIsNotDisplayed();
            searchFiltersPage.checkListFiltersPage().checkShowLessButtonIsDisplayed();

            browser.refresh();

            navigationBarPage.clickConfigEditorButton();

            delete jsonFile.categories[1].component.settings.pageSize;

            configEditorPage.clickSearchConfiguration();
            configEditorPage.clickClearButton();
            configEditorPage.enterBigConfigurationText(JSON.stringify(jsonFile));
            configEditorPage.clickSaveButton();

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
            let searchConfiguration = new SearchConfiguration();
            jsonFile = searchConfiguration.getConfiguration();
        });

        beforeAll(async (done) => {
            loginPage.loginToContentServicesUsingUserModel(acsUser);

            done();
        });

        it('[C277018] Should be able to change the operator', () => {
            navigationBarPage.clickConfigEditorButton();

            jsonFile.categories[1].component.settings.operator = 'AND';

            configEditorPage.clickSearchConfiguration();
            configEditorPage.clickClearButton();
            configEditorPage.enterBigConfigurationText(JSON.stringify(jsonFile));
            configEditorPage.clickSaveButton();

            searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterTextAndPressEnter(randomName);
            searchFiltersPage.clickCheckListFilter();

            searchFiltersPage.checkListFiltersPage().clickCheckListOption(filterType.folder);
            searchFiltersPage.checkListFiltersPage().checkCheckListOptionIsSelected(filterType.folder);

            searchResults.checkContentIsDisplayed(nodeNames.folder);
            searchResults.checkContentIsNotDisplayed(nodeNames.document);

            searchFiltersPage.checkListFiltersPage().clickCheckListOption(filterType.document);

            searchResults.checkContentIsNotDisplayed(nodeNames.folder);
            searchResults.checkContentIsNotDisplayed(nodeNames.document);

            browser.refresh();
        });

        it('[C277019] Should be able to add new properties with different types', () => {
            navigationBarPage.clickConfigEditorButton();

            jsonFile.categories[1].component.settings.options.push({ 'name': filterType.custom, 'value': "TYPE:'cm:auditable'" });

            configEditorPage.clickSearchConfiguration();
            configEditorPage.clickClearButton();
            configEditorPage.enterBigConfigurationText(JSON.stringify(jsonFile));
            configEditorPage.clickSaveButton();

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
