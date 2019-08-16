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

import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FolderModel } from '../../models/ACS/folderModel';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';

import { LoginPage, LocalStorageUtil, BrowserActions } from '@alfresco/adf-testing';
import { SearchDialog } from '../../pages/adf/dialog/searchDialog';
import { SearchResultsPage } from '../../pages/adf/searchResultsPage';
import { SearchFiltersPage } from '../../pages/adf/searchFiltersPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

import { SearchConfiguration } from '../search.config';

describe('Search component - Text widget', () => {

    const navigationBarPage = new NavigationBarPage();
    const searchFiltersPage = new SearchFiltersPage();

    const loginPage = new LoginPage();
    const searchDialog = new SearchDialog();
    const searchResultPage = new SearchResultsPage();

    const acsUser = new AcsUserModel();
    const newFolderModel = new FolderModel({ 'name': 'newFolder', 'description': 'newDescription' });

    beforeAll(async () => {

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: browser.params.testConfig.adf_acs.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

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

        await browser.sleep(15000);

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    it('[C289329] Placeholder should be displayed in the widget when the input string is empty', async () => {
        await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/search;q=*');
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
            await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/search;q=*');
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
