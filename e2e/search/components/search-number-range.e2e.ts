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
import { SearchDialog } from '../../pages/adf/dialog/searchDialog';
import { DataTableComponentPage } from '../../pages/adf/dataTableComponentPage';
import { SearchResultsPage } from '../../pages/adf/searchResultsPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { ConfigEditorPage } from '../../pages/adf/configEditorPage';
import { SearchFiltersPage } from '../../pages/adf/searchFiltersPage';

import TestConfig = require('../../test.config');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../../actions/ACS/upload.actions';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';
import { browser } from 'protractor';
import resources = require('../../util/resources');
import { SearchConfiguration } from '../search.config';

describe('Search Number Range Filter', () => {

    const loginPage = new LoginPage();
    const searchDialog = new SearchDialog();
    const searchFilters = new SearchFiltersPage();
    const sizeRangeFilter = searchFilters.sizeRangeFilterPage();
    const searchResults = new SearchResultsPage();
    const navigationBar = new NavigationBarPage();
    const configEditor = new ConfigEditorPage();
    const dataTable = new DataTableComponentPage();

    const acsUser = new AcsUserModel();

    const file2BytesModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.UNSUPPORTED.file_name,
        'location': resources.Files.ADF_DOCUMENTS.UNSUPPORTED.file_location
    });

    const file0BytesModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });

    let file2Bytes, file0Bytes;
    const uploadActions = new UploadActions();

    beforeAll(async (done) => {

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        file2Bytes = await uploadActions.uploadFile(this.alfrescoJsApi, file2BytesModel.location, file2BytesModel.name, '-my-');
        file0Bytes = await uploadActions.uploadFile(this.alfrescoJsApi, file0BytesModel.location, file0BytesModel.name, '-my-');
        await browser.driver.sleep(15000);

        loginPage.loginToContentServices(acsUser.id, acsUser.password);

        searchDialog.checkSearchIconIsVisible()
            .clickOnSearchIcon()
            .enterTextAndPressEnter('*');

        done();
    });

    afterAll(async (done) => {
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
        await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, file2Bytes.entry.id);
        await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, file0Bytes.entry.id);
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
            .checkClearButtonIsDisplayed();

        expect(sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(false);
    });

    it('[C276922] Should be keep value when Number Range widget is collapsed', () => {
        let size = 5;
        sizeRangeFilter.putFromNumber(size);
        sizeRangeFilter.putToNumber(size);
        searchFilters.clickSizeRangeFilterHeader()
            .checkSizeRangeFilterIsCollapsed()
            .clickSizeRangeFilterHeader()
            .checkSizeRangeFilterIsExpanded();
        expect(sizeRangeFilter.getFromNumber()).toEqual(`${size}`);
        expect(sizeRangeFilter.getToNumber()).toEqual(`${size}`);
    });

    it('[C276924] Should display error message when input had an invalid format', () => {
        sizeRangeFilter.checkFromFieldIsDisplayed()
            .putFromNumber('a').putToNumber('A')
            .checkFromErrorInvalidIsDisplayed().checkToErrorInvalidIsDisplayed();

        expect(sizeRangeFilter.getFromErrorInvalid()).toEqual('Invalid Format');
        expect(sizeRangeFilter.getToErrorInvalid()).toEqual('Invalid Format');
        expect(sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(false);

        sizeRangeFilter.putFromNumber('@').putToNumber('£')
            .checkFromErrorInvalidIsDisplayed().checkToErrorInvalidIsDisplayed();
        expect(sizeRangeFilter.getFromErrorInvalid()).toEqual('Invalid Format');
        expect(sizeRangeFilter.getToErrorInvalid()).toEqual('Invalid Format');
        expect(sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(false);

        sizeRangeFilter.putFromNumber('4.5').putToNumber('4,5')
            .checkFromErrorInvalidIsDisplayed().checkToErrorInvalidIsDisplayed();
        expect(sizeRangeFilter.getFromErrorInvalid()).toEqual('Invalid Format');
        expect(sizeRangeFilter.getToErrorInvalid()).toEqual('Invalid Format');
        expect(sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(false);

        sizeRangeFilter.putFromNumber('01').putToNumber('-1');
        expect(sizeRangeFilter.getFromErrorInvalid()).toEqual('Invalid Format');
        expect(sizeRangeFilter.getToErrorInvalid()).toEqual('Invalid Format');
        expect(sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(false);

        sizeRangeFilter.clearFromField().clearToField()
            .checkFromErrorRequiredIsDisplayed().checkToErrorRequiredIsDisplayed();
        expect(sizeRangeFilter.getFromErrorRequired()).toEqual('Required value');
        expect(sizeRangeFilter.getToErrorRequired()).toEqual('Required value');
        expect(sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(false);
    });

    it('[C276943] Should be able to put a big value in To field', () => {
        let toSize = 999999999;
        let fromSize = 0;
        sizeRangeFilter.checkToFieldIsDisplayed()
            .putToNumber(toSize)
            .putFromNumber(fromSize);

        expect(sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

        sizeRangeFilter.clickApplyButton();
        searchResults.tableIsLoaded();
        searchResults.sortBySize(false);

        browser.controlFlow().execute(async () => {
            let firstResult = await dataTable.getFirstElementDetail('Node id');
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
            .putToNumber(toSize);

        expect(sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

        sizeRangeFilter.clickApplyButton();
        searchResults.sortBySize(false);

        browser.controlFlow().execute(async () => {
            let firstResult = await dataTable.getFirstElementDetail('Node id');
            await this.alfrescoJsApi.core.nodesApi.getNode(firstResult).then(async (node) => {
                await expect(node.entry.content.sizeInBytes <= toSize).toBe(true);
            });
        });

        searchFilters.checkNameFilterIsDisplayed()
            .checkNameFilterIsExpanded();
        nameFilter.searchByName('z*');
        searchResults.sortBySize(false);

        browser.controlFlow().execute(async () => {
            let firstResult = await dataTable.getFirstElementDetail('Node id');
            await this.alfrescoJsApi.core.nodesApi.getNode(firstResult).then(async (node) => {
                await expect(node.entry.content.sizeInBytes <= toSize).toBe(true);
                let name = node.entry.name;
                await expect(/z*/i.test(name)).toBe(true);
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
        sizeSliderFilter.checkSliderIsDisplayed().setValue(sliderSize);

        sizeRangeFilter.checkFromFieldIsDisplayed()
            .putFromNumber(0)
            .putToNumber(toSize);
        expect(sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

        sizeRangeFilter.clickApplyButton();
        searchResults.sortBySize(false);
        searchResults.tableIsLoaded();

        browser.controlFlow().execute(async () => {
            let firstResult = await dataTable.getFirstElementDetail('Node id');
            await this.alfrescoJsApi.core.nodesApi.getNode(firstResult).then(async (node) => {
                await expect(node.entry.content.sizeInBytes <= sliderSize).toBe(true);
            });
        });

        sizeRangeFilter.checkFromFieldIsDisplayed()
            .putFromNumber(1);
        expect(sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

        sizeRangeFilter.clickApplyButton();
        searchResults.sortBySize(true);
        searchResults.tableIsLoaded();

        browser.controlFlow().execute(async () => {
            let firstResult = await dataTable.getFirstElementDetail('Node id');
            await this.alfrescoJsApi.core.nodesApi.getNode(firstResult).then(async (node) => {
                await expect(node.entry.content.sizeInBytes >= 1).toBe(true);
                await expect(node.entry.content.sizeInBytes <= sliderSize).toBe(true);
            });
        });

        sizeRangeFilter.checkFromFieldIsDisplayed()
            .putFromNumber(19);
        expect(sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

        sizeRangeFilter.clickApplyButton();
        searchResults.checkNoResultMessageIsDisplayed();
    });

    it('[C276951] Should not display folders when Size range is applied', () => {
        sizeRangeFilter.checkToFieldIsDisplayed()
            .putToNumber(99999999)
            .putFromNumber(0);
        expect(sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

        sizeRangeFilter.clickApplyButton();
        searchResults.tableIsLoaded();
        searchFilters.checkCheckListFilterIsDisplayed();
        searchFilters.clickCheckListFilter();
        searchFilters.checkCheckListFilterIsExpanded();

        searchFilters.checkListFiltersPage()
            .clickCheckListOption('Folder');

        searchResults.tableIsLoaded();
        searchResults.checkNoResultMessageIsDisplayed();
    });

    it('[C276952] Should only display empty files when size range is set from 0 to 1', () => {
        sizeRangeFilter.checkToFieldIsDisplayed()
            .putToNumber(1)
            .putFromNumber(0);
        expect(sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

        sizeRangeFilter.clickApplyButton();
        searchResults.tableIsLoaded();
        searchResults.sortBySize(false);

        browser.controlFlow().execute(async () => {
            let firstResult = await dataTable.getFirstElementDetail('Node id');
            await this.alfrescoJsApi.core.nodesApi.getNode(firstResult).then(async (node) => {
                await expect(node.entry.content.sizeInBytes).toEqual(0);
            });
        });
    });

    it('[C277092] Should disable apply button when from field value equal/is bigger than to field value', () => {
        sizeRangeFilter.checkFromFieldIsDisplayed()
            .putFromNumber(10);
        expect(sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(false);

        sizeRangeFilter.putToNumber('5');
        expect(sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(false);

        sizeRangeFilter.putToNumber('10');
        expect(sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(false);
    });

    it('[C289930] Should be able to clear values in number range fields', () => {
        sizeRangeFilter.checkFromFieldIsDisplayed().checkClearButtonIsDisplayed().checkNoErrorMessageIsDisplayed()
            .clickClearButton().checkNoErrorMessageIsDisplayed()
            .putFromNumber(0).putToNumber(1).clickClearButton();

        expect(sizeRangeFilter.getFromNumber()).toEqual('');
        expect(sizeRangeFilter.getToNumber()).toEqual('');

        sizeRangeFilter.putFromNumber(0).putToNumber(1).clickApplyButton();
        searchResults.sortBySize(false);

        browser.controlFlow().execute(async () => {
            let firstResult = await dataTable.getFirstElementDetail('Node id');
            await this.alfrescoJsApi.core.nodesApi.getNode(firstResult).then(async (node) => {
                await expect(node.entry.content.sizeInBytes <= 1).toBe(true);
            });
        });

        sizeRangeFilter.clickClearButton();

        expect(sizeRangeFilter.getFromNumber()).toEqual('');
        expect(sizeRangeFilter.getToNumber()).toEqual('');

        browser.controlFlow().execute(async () => {
            let firstResult = await dataTable.getFirstElementDetail('Node id');
            await this.alfrescoJsApi.core.nodesApi.getNode(firstResult).then(async (node) => {
                await expect(node.entry.content.sizeInBytes >= 1).toBe(true);
            });
        });
    });

    it('[C277137] Number Range should be inclusive', () => {
        sizeRangeFilter.checkToFieldIsDisplayed()
            .putToNumber(2)
            .putFromNumber(1);
        expect(sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

        sizeRangeFilter.clickApplyButton();

        searchResults.tableIsLoaded();
        searchResults.checkContentIsDisplayed(file2BytesModel.name);

        sizeRangeFilter.checkToFieldIsDisplayed()
            .putToNumber(1)
            .putFromNumber(0);
        expect(sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

        sizeRangeFilter.clickApplyButton();

        searchResults.tableIsLoaded();
        searchResults.checkContentIsNotDisplayed(file2BytesModel.name);

        sizeRangeFilter.checkToFieldIsDisplayed()
            .putToNumber(3)
            .putFromNumber(2);
        expect(sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

        sizeRangeFilter.clickApplyButton();

        searchResults.tableIsLoaded();
        searchResults.checkContentIsDisplayed(file2BytesModel.name);

        sizeRangeFilter.checkToFieldIsDisplayed()
            .putToNumber(4)
            .putFromNumber(3);
        expect(sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

        sizeRangeFilter.clickApplyButton();

        searchResults.tableIsLoaded();
        searchResults.checkContentIsNotDisplayed(file2BytesModel.name);
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

            let fromYear = (new Date()).getFullYear();
            let toYear = fromYear + 1;

            sizeRangeFilter.checkToFieldIsDisplayed()
                .putToNumber(toYear)
                .putFromNumber(fromYear);
            expect(sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

            sizeRangeFilter.clickApplyButton();
            searchResults.tableIsLoaded();
            searchResults.sortByCreated(false);

            browser.controlFlow().execute(async () => {
                let firstResult = await dataTable.getFirstElementDetail('Node id');
                await this.alfrescoJsApi.core.nodesApi.getNode(firstResult).then(async (node) => {
                    await expect((node.entry.createdAt.getFullYear()) <= toYear).toBe(true);
                });
            });

            searchResults.sortByCreated(true);

            browser.controlFlow().execute(async () => {
                let firstResult = await dataTable.getFirstElementDetail('Node id');
                await this.alfrescoJsApi.core.nodesApi.getNode(firstResult).then(async (node) => {
                    await expect((node.entry.createdAt.getFullYear()) >= fromYear).toBe(true);
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
                .putFromNumber(1);
            expect(sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

            sizeRangeFilter.clickApplyButton();

            searchResults.tableIsLoaded();
            searchResults.checkContentIsNotDisplayed(file2BytesModel.name);

            sizeRangeFilter.checkToFieldIsDisplayed()
                .putToNumber(3)
                .putFromNumber(1);
            expect(sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

            sizeRangeFilter.clickApplyButton();

            searchResults.tableIsLoaded();
            searchResults.checkContentIsDisplayed(file2BytesModel.name);
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
                .putFromNumber(1);
            expect(sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

            sizeRangeFilter.clickApplyButton();

            searchResults.tableIsLoaded();
            searchResults.checkContentIsDisplayed(file2BytesModel.name);

            sizeRangeFilter.checkToFieldIsDisplayed()
                .putToNumber(3)
                .putFromNumber(2);
            expect(sizeRangeFilter.checkApplyButtonIsEnabled()).toBe(true);

            sizeRangeFilter.clickApplyButton();

            searchResults.tableIsLoaded();
            searchResults.checkContentIsNotDisplayed(file2BytesModel.name);
        });
    });
});
