/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { LoginPage } from '../../../pages/adf/loginPage';
import { SearchFiltersPage } from '../../../pages/adf/searchFiltersPage';
import ContentList = require('../../../pages/adf/dialog/contentList');
import { ConfigEditorPage } from '../../../pages/adf/configEditorPage';
import { NavigationBarPage } from '../../../pages/adf/navigationBarPage';
import SearchDialog = require('../../../pages/adf/dialog/searchDialog');

import AcsUserModel = require('../../../models/ACS/acsUserModel');

import TestConfig = require('../../../test.config');

import path = require('path');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../../../actions/ACS/upload.actions';
import { browser } from 'protractor';

describe('Search Radio Component', () => {

    const loginPage = new LoginPage();
    const searchFiltersPage = new SearchFiltersPage();
    const contentList =  new ContentList();
    const configEditorPage = new ConfigEditorPage();
    const navigationBarPage = new NavigationBarPage();
    const searchDialog = new SearchDialog();

    let acsUser = new AcsUserModel();
    let uploadActions = new UploadActions();

    let filterType = {
        none: 'None',
        all: 'All',
        folder: 'Folder',
        document: 'Document',
        custom: 'TEST_NAME'
    };

    let nodeNames = {
        document: 'this_is_a_unique_name.txt',
        folder: 'this_is_a_unique_name'
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

        browser.get(TestConfig.adf.url + '/search;q=' + nodeNames.folder + '');

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

        searchFiltersPage.typeFiltersPage().checkFilterTypeRadioButtonIsDisplayed(filterType.none);
        searchFiltersPage.typeFiltersPage().checkFilterTypeRadioButtonIsDisplayed(filterType.all);
        searchFiltersPage.typeFiltersPage().checkFilterTypeRadioButtonIsDisplayed(filterType.folder);
        searchFiltersPage.typeFiltersPage().checkFilterTypeRadioButtonIsDisplayed(filterType.document);

        searchFiltersPage.typeFiltersPage().checkFilterTypeRadioButtonIsChecked(filterType.none);

        contentList.checkContentIsDisplayed(nodeNames.folder);
        contentList.checkContentIsDisplayed(nodeNames.document);

        searchFiltersPage.typeFiltersPage().clickFilterTypeRadioButton(filterType.folder);
        searchFiltersPage.typeFiltersPage().checkFilterTypeRadioButtonIsChecked(filterType.folder);

        contentList.checkContentIsDisplayed(nodeNames.folder);
        contentList.checkContentIsNotDisplayed(nodeNames.document);

        searchFiltersPage.typeFiltersPage().clickFilterTypeRadioButton(filterType.document);
        searchFiltersPage.typeFiltersPage().checkFilterTypeRadioButtonIsChecked(filterType.document);

        contentList.checkContentIsDisplayed(nodeNames.document);
        contentList.checkContentIsNotDisplayed(nodeNames.folder);

        searchFiltersPage.typeFiltersPage().clickFilterTypeRadioButton(filterType.all);
        searchFiltersPage.typeFiltersPage().checkFilterTypeRadioButtonIsChecked(filterType.all);

        contentList.checkContentIsDisplayed(nodeNames.folder);
        contentList.checkContentIsDisplayed(nodeNames.document);
    });

    it('[C277147] Should be able to customise the pageSize value', () => {
        navigationBarPage.clickConfigEditorButton();

        let json = JSON.parse(require('fs').readFileSync(path.join(TestConfig.main.rootPath, '/content-services/search/search.config.json'), 'utf8'));
        json.categories[5].component.settings.pageSize = 10;

        for (let numberOfOptions = 0; numberOfOptions < 6; numberOfOptions++) {
            json.categories[5].component.settings.options.push({ 'name': 'APP.SEARCH.RADIO.FOLDER', 'value': "TYPE:'cm:folder'" });
        }

        configEditorPage.clickSearchConfiguration();
        configEditorPage.clickClearButton();
        configEditorPage.enterBigConfigurationText(JSON.stringify(json));
        configEditorPage.clickSaveButton();

        searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterTextAndPressEnter(nodeNames.folder);
        searchFiltersPage.clickTypeFilterHeader();

        expect(searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()).toBe(10);

        browser.refresh();

        navigationBarPage.clickConfigEditorButton();

        json.categories[5].component.settings.pageSize = 11;

        configEditorPage.clickSearchConfiguration();
        configEditorPage.clickClearButton();
        configEditorPage.enterBigConfigurationText(JSON.stringify(json));
        configEditorPage.clickSaveButton();

        searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterTextAndPressEnter(nodeNames.folder);
        searchFiltersPage.clickTypeFilterHeader();

        expect(searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()).toBe(10);

        browser.refresh();

        navigationBarPage.clickConfigEditorButton();

        json.categories[5].component.settings.pageSize = 9;

        configEditorPage.clickSearchConfiguration();
        configEditorPage.clickClearButton();
        configEditorPage.enterBigConfigurationText(JSON.stringify(json));
        configEditorPage.clickSaveButton();

        searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterTextAndPressEnter(nodeNames.folder);
        searchFiltersPage.clickTypeFilterHeader();

        expect(searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()).toBe(9);

        searchFiltersPage.typeFiltersPage().checkShowMoreButtonIsDisplayed();
        searchFiltersPage.typeFiltersPage().checkShowLessButtonIsNotDisplayed();

        browser.refresh();
    });

    it('[C277148] Should be able to click show more/less button', () => {
        navigationBarPage.clickConfigEditorButton();

        let json = JSON.parse(require('fs').readFileSync(path.join(TestConfig.main.rootPath, '/content-services/search/search.config.json'), 'utf8'));
        json.categories[5].component.settings.pageSize = 0;

        for (let numberOfOptions = 0; numberOfOptions < 6; numberOfOptions++) {
            json.categories[5].component.settings.options.push({ 'name': 'APP.SEARCH.RADIO.FOLDER', 'value': "TYPE:'cm:folder'" });
        }

        configEditorPage.clickSearchConfiguration();
        configEditorPage.clickClearButton();
        configEditorPage.enterBigConfigurationText(JSON.stringify(json));
        configEditorPage.clickSaveButton();

        searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterTextAndPressEnter(nodeNames.folder);
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

        browser.refresh();

        navigationBarPage.clickConfigEditorButton();

        delete json.categories[5].component.settings.pageSize;

        configEditorPage.clickSearchConfiguration();
        configEditorPage.clickClearButton();
        configEditorPage.enterBigConfigurationText(JSON.stringify(json));
        configEditorPage.clickSaveButton();

        searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterTextAndPressEnter(nodeNames.folder);
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

    describe('Properties', () => {

        beforeAll(async (done) => {
            loginPage.loginToContentServicesUsingUserModel(acsUser);

            done();
        });

        it('[C277033] Should be able to add a new option', () => {
            navigationBarPage.clickConfigEditorButton();

            let json = JSON.parse(require('fs').readFileSync(path.join(TestConfig.main.rootPath, '/content-services/search/search.config.json'), 'utf8'));
            json.categories[5].component.settings.options.push({ 'name': filterType.custom, 'value': "TYPE:'cm:content'" });

            configEditorPage.clickSearchConfiguration();
            configEditorPage.clickClearButton();
            configEditorPage.enterBigConfigurationText(JSON.stringify(json));
            configEditorPage.clickSaveButton();

            searchDialog.clickOnSearchIcon().checkSearchBarIsVisible().enterTextAndPressEnter(nodeNames.folder);
            searchFiltersPage.clickTypeFilterHeader();

            searchFiltersPage.typeFiltersPage().checkFilterTypeRadioButtonIsDisplayed(filterType.none);
            searchFiltersPage.typeFiltersPage().checkFilterTypeRadioButtonIsDisplayed(filterType.all);
            searchFiltersPage.typeFiltersPage().checkFilterTypeRadioButtonIsDisplayed(filterType.folder);
            searchFiltersPage.typeFiltersPage().checkFilterTypeRadioButtonIsDisplayed(filterType.document);
            searchFiltersPage.typeFiltersPage().checkFilterTypeRadioButtonIsDisplayed(filterType.custom);
            searchFiltersPage.typeFiltersPage().checkFilterTypeRadioButtonIsChecked(filterType.none);

            searchFiltersPage.typeFiltersPage().clickFilterTypeRadioButton(filterType.custom);

            contentList.checkContentIsDisplayed(nodeNames.document);
            contentList.checkContentIsNotDisplayed(nodeNames.folder);
        });

    });

});
