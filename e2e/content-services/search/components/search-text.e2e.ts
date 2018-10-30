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

import { SearchFiltersPage } from '../../../pages/adf/searchFiltersPage';
import { LoginPage } from '../../../pages/adf/loginPage';
import SearchDialog = require('../../../pages/adf/dialog/searchDialog');
import { SearchResultsPage } from '../../../pages/adf/searchResultsPage';

describe('Search component - Search Page', () => {

    let searchFiltersPage = new SearchFiltersPage();

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
            'description': newFolderModel.description,
            'nodeType': 'cm:folder'
        }, {}, {});

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        done();
    });

    it('[C289329] Placeholder should be displayed in the widget when the input string is empty', () => {
        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible().clickOnSearchIcon()
            .enterTextAndPressEnter('*');

        searchFiltersPage.checkNameFilterIsDisplayed();
        expect(searchFiltersPage.getNamePlaceholder()).toEqual('Enter the name');
    });

    it('[C289330] Should be able to change the Field setting', () => {
        searchDialog.checkSearchBarIsNotVisible().checkSearchIconIsVisible().clickOnSearchIcon()
            .enterTextAndPressEnter('*');

        searchFiltersPage.checkCheckListFilterIsDisplayed();
        searchFiltersPage.clickCheckListFilter();
        // check Folder checkbox
        searchFiltersPage.checkNameFilterIsDisplayed();
        searchFiltersPage.searchByName(newFolderModel.name);
        searchResultPage.checkContentIsDisplayed(newFolderModel.name);
    });
});

