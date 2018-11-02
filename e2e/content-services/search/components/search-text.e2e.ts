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

import { browser } from 'protractor';

import AcsUserModel = require('../../../models/ACS/acsUserModel');
import FolderModel = require('../../../models/ACS/folderModel');

import TestConfig = require('../../../test.config');

import AlfrescoApi = require('alfresco-js-api-node');

import { LoginPage } from '../../../pages/adf/loginPage';
import SearchDialog = require('../../../pages/adf/dialog/searchDialog');
import { SearchResultsPage } from '../../../pages/adf/searchResultsPage';
import { SearchFiltersPage } from '../../../pages/adf/searchFiltersPage';
import { ConfigEditorPage } from '../../../pages/adf/configEditorPage';
import { NavigationBarPage } from '../../../pages/adf/navigationBarPage';
import path = require('path');

describe('Search component - Text widget', () => {

    const configEditorPage = new ConfigEditorPage();
    const navigationBarPage = new NavigationBarPage();
    const searchFiltersPage = new SearchFiltersPage();

    let loginPage = new LoginPage();
    let searchDialog = new SearchDialog();
    let searchResultPage = new SearchResultsPage();

    let acsUser = new AcsUserModel();
    let newFolderModel = new FolderModel({ 'name': 'newFolder' , 'description': 'newDescription' });

    beforeAll(async (done) => {

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        await this.alfrescoJsApi.nodes.addNode('-my-', {
            'name': newFolderModel.name,
            'nodeType': 'cm:folder',
            'properties':
            {
                'cm:description': newFolderModel.description
            }
        }, {}, {});

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        done();
    });

    it('[C289329] Placeholder should be displayed in the widget when the input string is empty', () => {
        browser.get(TestConfig.adf.url + '/search;q=*');
        searchResultPage.tableIsLoaded();

        searchFiltersPage.checkNameFilterIsDisplayed();
        expect(searchFiltersPage.textFiltersPage().getNamePlaceholder()).toEqual('Enter the name');
    });

    it('[C289330] Should be able to change the Field setting', () => {
        browser.get(TestConfig.adf.url + '/search;q=*');
        searchResultPage.tableIsLoaded();

        searchFiltersPage.checkCheckListFilterIsDisplayed();
        searchFiltersPage.clickCheckListFilter();
        searchFiltersPage.checkListFiltersPage().clickCheckListOption('Folder');

        searchFiltersPage.checkNameFilterIsDisplayed();
        searchFiltersPage.textFiltersPage().searchByName(newFolderModel.name);
        searchResultPage.checkContentIsDisplayed(newFolderModel.name);

        searchFiltersPage.textFiltersPage().searchByName(newFolderModel.description);
        searchResultPage.checkContentIsNotDisplayed(newFolderModel.name);

        let json = JSON.parse(require('fs').readFileSync(path.join(TestConfig.main.rootPath, '/content-services/search/search.config.json'), 'utf8'));
        json.categories[0].component.settings.field = 'cm:description';

        navigationBarPage.clickConfigEditorButton();
        configEditorPage.clickSearchConfiguration();
        configEditorPage.clickClearButton();
        configEditorPage.enterBigConfigurationText(JSON.stringify(json));
        configEditorPage.clickSaveButton();

        searchDialog.clickOnSearchIcon().enterTextAndPressEnter('*');
        searchResultPage.tableIsLoaded();

        searchFiltersPage.checkCheckListFilterIsDisplayed();
        searchFiltersPage.clickCheckListFilter();
        searchFiltersPage.checkListFiltersPage().clickCheckListOption('Folder');

        searchFiltersPage.checkNameFilterIsDisplayed();
        searchFiltersPage.textFiltersPage().searchByName(newFolderModel.name);
        searchResultPage.checkContentIsNotDisplayed(newFolderModel.name);

        searchFiltersPage.textFiltersPage().searchByName(newFolderModel.description);
        searchResultPage.checkContentIsDisplayed(newFolderModel.name);
    });
});
