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
import SearchDialog = require('../../../pages/adf/dialog/searchDialog');
import DataTablePage = require('../../../pages/adf/dataTablePage');
import { SearchResultsPage } from '../../../pages/adf/searchResultsPage';
import { NavigationBarPage } from '../../../pages/adf/navigationBarPage';
import { ConfigEditorPage } from '../../../pages/adf/configEditorPage';
import { SearchFiltersPage } from '../../../pages/adf/searchFiltersPage';

import TestConfig = require('../../../test.config');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../../../actions/ACS/upload.actions';
import AcsUserModel = require('../../../models/ACS/acsUserModel');
import FileModel = require('../../../models/ACS/fileModel');
import { browser } from 'protractor';
import resources = require('../../../util/resources');
import { SearchConfiguration } from '../search.config';
import { from } from 'rxjs/internal/observable/from';

describe('Search Number Range Filter', () => {

    let loginPage = new LoginPage();
    let searchDialog = new SearchDialog();
    let searchFilters = new SearchFiltersPage();
    let sizeRangeFilter = searchFilters.sizeRangeFilterPage();
    let searchResults = new SearchResultsPage();
    let navigationBar = new NavigationBarPage();
    let configEditor = new ConfigEditorPage();
    let dataTable = new DataTablePage();

    let acsUser = new AcsUserModel();

    let fileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.UNSUPPORTED.file_name,
        'location': resources.Files.ADF_DOCUMENTS.UNSUPPORTED.file_location
    });

    let file;
    let uploadActions = new UploadActions();

    beforeAll(async (done) => {

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        file = await uploadActions.uploadFile(this.alfrescoJsApi, fileModel.location, fileModel.name, '-my-');
        await browser.driver.sleep(15000);

        loginPage.loginToContentServices(acsUser.id, acsUser.password);

        searchDialog.checkSearchIconIsVisible()
            .clickOnSearchIcon()
            .enterTextAndPressEnter('*');

        done();
    });

    afterAll(async (done) => {
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
        await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, file.entry.id);
        done();
    });

    beforeEach(() => {
        searchFilters.checkSizeRangeFilterIsDisplayed()
            .clickSizeRangeFilterHeader()
            .checkSizeRangeFilterIsExpanded();
    });

    afterEach(async (done) => {
        await browser.refresh();
        done();
    });

    it('[C276921] Should display default values for Number Range widget', () => {
        sizeRangeFilter.checkFromFieldIsDisplayed()
            .checkToFieldIsDisplayed()
            .checkApplyButtonIsDisplayed()
            .checkApplyButtonIsDisabled()
            .checkClearButtonIsDisplayed();
    });

    it('[C276922] Should be keep value when Number Range widget is collapsed', () => {
        let size = 5;
        sizeRangeFilter.putFromNumber(size);
        sizeRangeFilter.putToNumber(size);
        searchFilters.clickSizeRangeFilterHeader()
            .checkSizeRangeFilterIsCollapsed()
            .clickSizeRangeFilterHeader()
            .checkSizeRangeFilterIsExpanded();
        browser.controlFlow().execute(async () => {
            await expect(sizeRangeFilter.getFromNumber()).toEqual(`${size}`);
            await expect(sizeRangeFilter.getToNumber()).toEqual(`${size}`);
        });
    });

    it('[C276924] Should display error message when input had an invalid format', () => {
        sizeRangeFilter.checkFromFieldIsDisplayed()
            .putFromNumber('a').checkFromErrorInvalidIsDisplayed().putToNumber('A').checkToErrorInvalidIsDisplayed().checkApplyButtonIsDisabled()
            .putFromNumber('@').checkFromErrorInvalidIsDisplayed().putToNumber('£').checkToErrorInvalidIsDisplayed().checkApplyButtonIsDisabled()
            .putFromNumber('4.5').checkFromErrorInvalidIsDisplayed().putToNumber('4,5').checkToErrorInvalidIsDisplayed().checkApplyButtonIsDisabled()
            .putFromNumber('01').checkFromErrorInvalidIsDisplayed().putToNumber('-1').checkToErrorInvalidIsDisplayed().checkApplyButtonIsDisabled()
            .clearFromField().checkFromErrorRequiredIsDisplayed().clearToField().checkToErrorRequiredIsDisplayed().checkApplyButtonIsDisabled();
    });

    it('[C276943] Should be able to put a big value in To field', () => {
        let toSize = 999999999;
        let fromSize = 0;
        sizeRangeFilter.checkToFieldIsDisplayed()
            .putToNumber(toSize)
            .putFromNumber(fromSize)
            .checkApplyButtonIsEnabled()
            .clickApplyButton();
        searchResults.tableIsLoaded();
        searchResults.sortBySize(false);
        browser.controlFlow().execute(async () => {
            let firstResult = await dataTable.getNodeIdFirstElement();
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            await this.alfrescoJsApi.core.nodesApi.getNode(firstResult).then(async (node) => {
                await expect(node.entry.content.sizeInBytes <= toSize).toBe(true);
            });
        });
    });

    it('[C276944] Should be able to filter by name when size range filter is applied', () => {
        let nameFilter = searchFilters.textFiltersPage();
        let toSize = 40;
        let fromSize = 0;
        searchFilters.checkNameFilterIsDisplayed()
            .checkNameFilterIsExpanded();
        nameFilter.searchByName('*');
        sizeRangeFilter.checkFromFieldIsDisplayed()
            .putFromNumber(fromSize)
            .putToNumber(toSize)
            .checkApplyButtonIsEnabled()
            .clickApplyButton();
        searchResults.sortBySize(false);
        browser.controlFlow().execute(async () => {
            let firstResult = await dataTable.getNodeIdFirstElement();
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            await this.alfrescoJsApi.core.nodesApi.getNode(firstResult).then(async (node) => {
                await expect(node.entry.content.sizeInBytes <= toSize).toBe(true);
            });
        });
        searchFilters.checkNameFilterIsDisplayed()
            .checkNameFilterIsExpanded();
        nameFilter.searchByName('a*');
        searchResults.sortBySize(false);
        browser.controlFlow().execute(async () => {
            let firstResult = await dataTable.getNodeIdFirstElement();
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            await this.alfrescoJsApi.core.nodesApi.getNode(firstResult).then(async (node) => {
                await expect(node.entry.content.sizeInBytes <= toSize).toBe(true);
                let name = node.entry.name;
                await expect(/a*/i.test(name)).toBe(true);
            });
        });
    });

    it('[C276950] Should be able to filter by size (slider) when size range filter is applied', () => {
        let sizeSliderFilter = searchFilters.sizeSliderFilterPage();
        let toSize = 20;
        let sliderSize = 18;

        searchFilters.checkSizeSliderFilterIsDisplayed()
            .clickSizeSliderFilterHeader()
            .checkSizeSliderFilterIsExpanded();
        sizeSliderFilter.checkSliderIsDisplayed().setSliderToValue(sliderSize);

        sizeRangeFilter.checkFromFieldIsDisplayed()
            .putFromNumber(0)
            .putToNumber(toSize)
            .checkApplyButtonIsEnabled()
            .clickApplyButton();
        searchResults.sortBySize(false);
        searchResults.tableIsLoaded();
        browser.controlFlow().execute(async () => {
            let firstResult = await dataTable.getNodeIdFirstElement();
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            await this.alfrescoJsApi.core.nodesApi.getNode(firstResult).then(async (node) => {
                await expect(node.entry.content.sizeInBytes <= sliderSize).toBe(true);
            });
        });

        sizeRangeFilter.checkFromFieldIsDisplayed()
            .putFromNumber(1)
            .checkApplyButtonIsEnabled()
            .clickApplyButton();
        searchResults.sortBySize(true);
        searchResults.tableIsLoaded();
        browser.controlFlow().execute(async () => {
            let firstResult = await dataTable.getNodeIdFirstElement();
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            await this.alfrescoJsApi.core.nodesApi.getNode(firstResult).then(async (node) => {
                await expect(node.entry.content.sizeInBytes >= 1).toBe(true);
                await expect(node.entry.content.sizeInBytes <= sliderSize).toBe(true);
            });
        });

        sizeRangeFilter.checkFromFieldIsDisplayed()
            .putFromNumber(19)
            .checkApplyButtonIsEnabled()
            .clickApplyButton();
        searchResults.checkNoResultMessageIsDisplayed();
    });

    it('[C276951] Should not display folders when Size range is applied', () => {
        sizeRangeFilter.checkToFieldIsDisplayed()
            .putToNumber(99999999)
            .putFromNumber(0)
            .checkApplyButtonIsEnabled()
            .clickApplyButton();
        searchResults.tableIsLoaded();
        searchFilters.checkCheckListFilterIsDisplayed();
        searchFilters.clickCheckListFilter();
        searchFilters.checkCheckListFilterIsExpanded();
        searchFilters.checkListFiltersPage().clickCheckListOption('Folder');
        searchResults.tableIsLoaded();
        searchResults.checkNoResultMessageIsDisplayed();
    });

    it('[C276952] Should only display empty files when size range is set from 0 to 1', () => {
        sizeRangeFilter.checkToFieldIsDisplayed()
            .putToNumber(1)
            .putFromNumber(0)
            .checkApplyButtonIsEnabled()
            .clickApplyButton();
        searchResults.tableIsLoaded();
        searchResults.sortBySize(false);
        browser.controlFlow().execute(async () => {
            let firstResult = await dataTable.getNodeIdFirstElement();
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            await this.alfrescoJsApi.core.nodesApi.getNode(firstResult).then(async (node) => {
                await expect(node.entry.content.sizeInBytes).toEqual(0);
            });
        });
    });

    it('[C277092] Should disable apply button when from field value equal/is bigger than to field value', () => {
        sizeRangeFilter.checkFromFieldIsDisplayed()
            .putFromNumber(10).checkApplyButtonIsDisabled()
            .putToNumber('5').checkApplyButtonIsDisabled()
            .putToNumber('10').checkApplyButtonIsDisabled();
    });

    it('[C289930] Should be able to clear values in number range fields', () => {
        sizeRangeFilter.checkFromFieldIsDisplayed().checkClearButtonIsDisplayed().checkNoErrorMessageIsDisplayed()
            .clickClearButton().checkNoErrorMessageIsDisplayed()
            .putFromNumber(0).putToNumber(1).clickClearButton().checkFromFieldIsEmpty().checkToFieldIsEmpty()
            .putFromNumber(0).putToNumber(1).clickApplyButton();
        searchResults.sortBySize(false);
        browser.controlFlow().execute(async () => {
            let firstResult = await dataTable.getNodeIdFirstElement();
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            await this.alfrescoJsApi.core.nodesApi.getNode(firstResult).then(async (node) => {
                await expect(node.entry.content.sizeInBytes <= 1).toBe(true);
            });
        });
        sizeRangeFilter.clickClearButton().checkFromFieldIsEmpty().checkToFieldIsEmpty();
        browser.controlFlow().execute(async () => {
            let firstResult = await dataTable.getNodeIdFirstElement();
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            await this.alfrescoJsApi.core.nodesApi.getNode(firstResult).then(async (node) => {
                await expect(node.entry.content.sizeInBytes >= 1).toBe(true);
            });
        });
    });

    it('[C277137] Number Range should be inclusive', () => {
        sizeRangeFilter.checkToFieldIsDisplayed()
            .putToNumber(2)
            .putFromNumber(1)
            .checkApplyButtonIsEnabled()
            .clickApplyButton();

        searchResults.tableIsLoaded();
        searchResults.checkContentIsDisplayed(fileModel.name);

        sizeRangeFilter.checkToFieldIsDisplayed()
            .putToNumber(1)
            .putFromNumber(0)
            .checkApplyButtonIsEnabled()
            .clickApplyButton();

        searchResults.tableIsLoaded();
        searchResults.checkContentIsNotDisplayed(fileModel.name);

        sizeRangeFilter.checkToFieldIsDisplayed()
            .putToNumber(3)
            .putFromNumber(2)
            .checkApplyButtonIsEnabled()
            .clickApplyButton();

        searchResults.tableIsLoaded();
        searchResults.checkContentIsDisplayed(fileModel.name);

        sizeRangeFilter.checkToFieldIsDisplayed()
            .putToNumber(4)
            .putFromNumber(3)
            .checkApplyButtonIsEnabled()
            .clickApplyButton();

        searchResults.tableIsLoaded();
        searchResults.checkContentIsNotDisplayed(fileModel.name);
    });

    describe('Configuration change', () => {
        let jsonFile;

        beforeEach(() => {
            let searchConfiguration = new SearchConfiguration();
            jsonFile = searchConfiguration.getConfiguration();
        });

        it('[C276928] Should be able to change the field property for number range', () => {
            jsonFile.categories[3].component.settings.field = 'cm:created';

            navigationBar.clickConfigEditorButton();
            configEditor.clickSearchConfiguration();
            configEditor.clickClearButton();
            configEditor.enterBigConfigurationText(JSON.stringify(jsonFile)).clickSaveButton();

            searchDialog.checkSearchIconIsVisible()
                .clickOnSearchIcon()
                .enterTextAndPressEnter('*');

            searchFilters.checkSizeRangeFilterIsDisplayed()
                .clickSizeRangeFilterHeader()
                .checkSizeRangeFilterIsExpanded();

            let toYear = 2030;
            let fromYear = 2018;

            sizeRangeFilter.checkToFieldIsDisplayed()
                .putToNumber(toYear)
                .putFromNumber(fromYear)
                .checkApplyButtonIsEnabled()
                .clickApplyButton();

            searchResults.tableIsLoaded();
            searchResults.sortByCreated(false);
            browser.controlFlow().execute(async () => {
                let firstResult = await dataTable.getNodeIdFirstElement();
                await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
                await this.alfrescoJsApi.core.nodesApi.getNode(firstResult).then(async (node) => {
                    await expect((node.entry.createdAt.getYear() + 1900) <= toYear).toBe(true);
                });
            });

            searchResults.sortByCreated(true);
            browser.controlFlow().execute(async () => {
                let firstResult = await dataTable.getNodeIdFirstElement();
                await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
                await this.alfrescoJsApi.core.nodesApi.getNode(firstResult).then(async (node) => {
                    await expect((node.entry.createdAt.getYear() + 1900) >= fromYear).toBe(true);
                });
            });
        });

        it('[C277139] Should be able to set To field to be exclusive', () => {
            jsonFile.categories[3].component.settings.format = '[{FROM} TO {TO}>';

            navigationBar.clickConfigEditorButton();
            configEditor.clickSearchConfiguration();
            configEditor.clickClearButton();
            configEditor.enterBigConfigurationText(JSON.stringify(jsonFile)).clickSaveButton();

            searchDialog.checkSearchIconIsVisible()
                .clickOnSearchIcon()
                .enterTextAndPressEnter('*');

            searchFilters.checkSizeRangeFilterIsDisplayed()
                .clickSizeRangeFilterHeader()
                .checkSizeRangeFilterIsExpanded();

            sizeRangeFilter.checkToFieldIsDisplayed()
                .putToNumber(2)
                .putFromNumber(1)
                .checkApplyButtonIsEnabled()
                .clickApplyButton();

            searchResults.tableIsLoaded();
            searchResults.checkContentIsNotDisplayed(fileModel.name);

            sizeRangeFilter.checkToFieldIsDisplayed()
                .putToNumber(3)
                .putFromNumber(1)
                .checkApplyButtonIsEnabled()
                .clickApplyButton();

            searchResults.tableIsLoaded();
            searchResults.checkContentIsDisplayed(fileModel.name);
        });

        it('[C277140] Should be able to set From field to be exclusive', () => {
            jsonFile.categories[3].component.settings.format = '<{FROM} TO {TO}]';

            navigationBar.clickConfigEditorButton();
            configEditor.clickSearchConfiguration();
            configEditor.clickClearButton();
            configEditor.enterBigConfigurationText(JSON.stringify(jsonFile)).clickSaveButton();

            searchDialog.checkSearchIconIsVisible()
                .clickOnSearchIcon()
                .enterTextAndPressEnter('*');

            searchFilters.checkSizeRangeFilterIsDisplayed()
                .clickSizeRangeFilterHeader()
                .checkSizeRangeFilterIsExpanded();

            sizeRangeFilter.checkToFieldIsDisplayed()
                .putToNumber(3)
                .putFromNumber(1)
                .checkApplyButtonIsEnabled()
                .clickApplyButton();

            searchResults.tableIsLoaded();
            searchResults.checkContentIsDisplayed(fileModel.name);

            sizeRangeFilter.checkToFieldIsDisplayed()
                .putToNumber(3)
                .putFromNumber(2)
                .checkApplyButtonIsEnabled()
                .clickApplyButton();

            searchResults.tableIsLoaded();
            searchResults.checkContentIsNotDisplayed(fileModel.name);
        });
    });
});
