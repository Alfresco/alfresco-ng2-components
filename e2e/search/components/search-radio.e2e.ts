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
import { SearchFiltersPage } from '../../pages/adf/searchFiltersPage';
import { SearchResultsPage } from '../../pages/adf/searchResultsPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { SearchDialog } from '../../pages/adf/dialog/searchDialog';

import { AcsUserModel } from '../../models/ACS/acsUserModel';

import TestConfig = require('../../test.config');

import { SearchConfiguration } from '../search.config';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '../../actions/ACS/upload.actions';
import { browser } from 'protractor';
import { StringUtil, LocalStorageUtil } from '@alfresco/adf-testing';

describe('Search Radio Component', () => {

    const loginPage = new LoginPage();
    const searchFiltersPage = new SearchFiltersPage();
    const navigationBarPage = new NavigationBarPage();
    const searchDialog = new SearchDialog();
    const searchResults = new SearchResultsPage();

    const acsUser = new AcsUserModel();
    const uploadActions = new UploadActions();

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

        BrowserActions.getUrl(TestConfig.adf.url + '/search;q=' + randomName);

        done();
    });

    afterAll(async (done) => {
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, createdFile.entry.id);
        await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, createdFolder.entry.id);

        done();
    });

    it('[C277039] Should be able to choose only one option at a time', () => {
        searchFiltersPage.checkTypeFilterIsDisplayed();
        searchFiltersPage.checkTypeFilterIsCollapsed();
        searchFiltersPage.clickTypeFilterHeader();

        searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsDisplayed(filterType.none);
        searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsDisplayed(filterType.all);
        searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsDisplayed(filterType.folder);
        searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsDisplayed(filterType.document);

        searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsChecked(filterType.none);

        searchResults.checkContentIsDisplayed(nodeNames.folder);
        searchResults.checkContentIsDisplayed(nodeNames.document);

        searchFiltersPage.typeFiltersPage().clickFilterRadioButton(filterType.folder);
        searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsChecked(filterType.folder);

        searchResults.checkContentIsDisplayed(nodeNames.folder);
        searchResults.checkContentIsNotDisplayed(nodeNames.document);

        searchFiltersPage.typeFiltersPage().clickFilterRadioButton(filterType.document);
        searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsChecked(filterType.document);

        searchResults.checkContentIsDisplayed(nodeNames.document);
        searchResults.checkContentIsNotDisplayed(nodeNames.folder);

        searchFiltersPage.typeFiltersPage().clickFilterRadioButton(filterType.all);
        searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsChecked(filterType.all);

        searchResults.checkContentIsDisplayed(nodeNames.folder);
        searchResults.checkContentIsDisplayed(nodeNames.document);
    });

    describe('configuration change', () => {

        let jsonFile;

        beforeEach(() => {
            jsonFile = SearchConfiguration.getConfiguration();
        });

        it('[C277147] Should be able to customise the pageSize value', async () => {
            navigationBarPage.clickContentServicesButton();

            jsonFile.categories[5].component.settings.pageSize = 10;

            for (let numberOfOptions = 0; numberOfOptions < 6; numberOfOptions++) {
                jsonFile.categories[5].component.settings.options.push({
                    'name': 'APP.SEARCH.RADIO.FOLDER',
                    'value': "TYPE:'cm:folder'"
                });
            }

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterTextAndPressEnter(randomName);
            searchFiltersPage.clickTypeFilterHeader();

            expect(searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()).toBe(10);

            navigationBarPage.clickContentServicesButton();

            jsonFile.categories[5].component.settings.pageSize = 11;

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterTextAndPressEnter(randomName);
            searchFiltersPage.clickTypeFilterHeader();

            expect(searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()).toBe(10);

            navigationBarPage.clickContentServicesButton();
            jsonFile.categories[5].component.settings.pageSize = 9;

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterTextAndPressEnter(randomName);
            searchFiltersPage.clickTypeFilterHeader();

            expect(searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()).toBe(9);

            searchFiltersPage.typeFiltersPage().checkShowMoreButtonIsDisplayed();
            searchFiltersPage.typeFiltersPage().checkShowLessButtonIsNotDisplayed();

            browser.refresh();
        });

        it('[C277148] Should be able to click show more/less button', async () => {
            navigationBarPage.clickContentServicesButton();

            jsonFile.categories[5].component.settings.pageSize = 0;

            for (let numberOfOptions = 0; numberOfOptions < 6; numberOfOptions++) {
                jsonFile.categories[5].component.settings.options.push({
                    'name': 'APP.SEARCH.RADIO.FOLDER',
                    'value': "TYPE:'cm:folder'"
                });
            }

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterTextAndPressEnter(randomName);
            searchFiltersPage.clickTypeFilterHeader();

            expect(searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()).toBe(5);

            searchFiltersPage.typeFiltersPage().checkShowMoreButtonIsDisplayed();
            searchFiltersPage.typeFiltersPage().checkShowLessButtonIsNotDisplayed();

            searchFiltersPage.typeFiltersPage().clickShowMoreButton();

            expect(searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()).toBe(10);

            searchFiltersPage.typeFiltersPage().checkShowMoreButtonIsNotDisplayed();
            searchFiltersPage.typeFiltersPage().checkShowLessButtonIsDisplayed();

            searchFiltersPage.typeFiltersPage().clickShowLessButton();

            expect(searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()).toBe(5);

            searchFiltersPage.typeFiltersPage().checkShowMoreButtonIsDisplayed();
            searchFiltersPage.typeFiltersPage().checkShowLessButtonIsNotDisplayed();

            navigationBarPage.clickContentServicesButton();
            delete jsonFile.categories[5].component.settings.pageSize;

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterTextAndPressEnter(randomName);
            searchFiltersPage.clickTypeFilterHeader();

            expect(searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()).toBe(5);

            searchFiltersPage.typeFiltersPage().checkShowMoreButtonIsDisplayed();
            searchFiltersPage.typeFiltersPage().checkShowLessButtonIsNotDisplayed();

            searchFiltersPage.typeFiltersPage().clickShowMoreButton();

            expect(searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()).toBe(10);

            searchFiltersPage.typeFiltersPage().checkShowMoreButtonIsNotDisplayed();
            searchFiltersPage.typeFiltersPage().checkShowLessButtonIsDisplayed();

            searchFiltersPage.typeFiltersPage().clickShowLessButton();

            expect(searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()).toBe(5);

            searchFiltersPage.typeFiltersPage().checkShowMoreButtonIsDisplayed();
            searchFiltersPage.typeFiltersPage().checkShowLessButtonIsNotDisplayed();
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

        it('[C277033] Should be able to add a new option', async () => {
            navigationBarPage.clickContentServicesButton();

            jsonFile.categories[5].component.settings.options.push({
                'name': filterType.custom,
                'value': "TYPE:'cm:content'"
            });

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterTextAndPressEnter(randomName);
            searchFiltersPage.clickTypeFilterHeader();

            searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsDisplayed(filterType.none);
            searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsDisplayed(filterType.all);
            searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsDisplayed(filterType.folder);
            searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsDisplayed(filterType.document);
            searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsDisplayed(filterType.custom);
            searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsChecked(filterType.none);

            searchFiltersPage.typeFiltersPage().clickFilterRadioButton(filterType.custom);

            searchResults.checkContentIsDisplayed(nodeNames.document);
            searchResults.checkContentIsNotDisplayed(nodeNames.folder);
        });

    });

});
