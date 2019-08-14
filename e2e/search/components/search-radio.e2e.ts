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

import { LoginPage, BrowserActions, StringUtil, LocalStorageUtil, UploadActions } from '@alfresco/adf-testing';
import { SearchFiltersPage } from '../../pages/adf/searchFiltersPage';
import { SearchResultsPage } from '../../pages/adf/searchResultsPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { SearchDialog } from '../../pages/adf/dialog/searchDialog';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { SearchConfiguration } from '../search.config';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { browser } from 'protractor';

describe('Search Radio Component', () => {

    const loginPage = new LoginPage();
    const searchFiltersPage = new SearchFiltersPage();
    const navigationBarPage = new NavigationBarPage();
    const searchDialog = new SearchDialog();
    const searchResults = new SearchResultsPage();

    const acsUser = new AcsUserModel();
    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);

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
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

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

        await browser.sleep(15000);

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/search;q=' + randomName);

    });

    afterAll(async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

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

            await searchDialog.clickOnSearchIcon();
            await searchDialog.checkSearchBarIsVisible();
            await searchDialog.enterTextAndPressEnter(randomName);
            await searchFiltersPage.clickTypeFilterHeader();

            await expect(await searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()).toBe(10);

            await navigationBarPage.clickContentServicesButton();

            jsonFile.categories[5].component.settings.pageSize = 11;

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchDialog.clickOnSearchIcon();
            await searchDialog.checkSearchBarIsVisible();
            await searchDialog.enterTextAndPressEnter(randomName);
            await searchFiltersPage.clickTypeFilterHeader();

            await expect(await searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()).toBe(10);

            await navigationBarPage.clickContentServicesButton();
            jsonFile.categories[5].component.settings.pageSize = 9;

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchDialog.clickOnSearchIcon();
            await searchDialog.checkSearchBarIsVisible();
            await searchDialog.enterTextAndPressEnter(randomName);
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

            await searchDialog.clickOnSearchIcon();
            await searchDialog.checkSearchBarIsVisible();
            await searchDialog.enterTextAndPressEnter(randomName);
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

            await searchDialog.clickOnSearchIcon();
            await searchDialog.checkSearchBarIsVisible();
            await searchDialog.enterTextAndPressEnter(randomName);
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
            await loginPage.loginToContentServicesUsingUserModel(acsUser);

        });

        it('[C277033] Should be able to add a new option', async () => {
            await navigationBarPage.clickContentServicesButton();

            jsonFile.categories[5].component.settings.options.push({
                'name': filterType.custom,
                'value': "TYPE:'cm:content'"
            });

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchDialog.clickOnSearchIcon();
            await searchDialog.checkSearchBarIsVisible();
            await searchDialog.enterTextAndPressEnter(randomName);
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
