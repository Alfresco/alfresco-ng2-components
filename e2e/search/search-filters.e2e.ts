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

import { SearchDialog } from '../pages/adf/dialog/searchDialog';
import { SearchFiltersPage } from '../pages/adf/searchFiltersPage';
import { SearchResultsPage } from '../pages/adf/searchResultsPage';
import { AcsUserModel } from '../models/ACS/acsUserModel';
import { FileModel } from '../models/ACS/fileModel';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import {
    StringUtil,
    DocumentListPage,
    PaginationPage,
    LoginPage,
    LocalStorageUtil,
    UploadActions,
    BrowserActions
} from '@alfresco/adf-testing';
import resources = require('../util/resources');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { browser } from 'protractor';
import { SearchConfiguration } from './search.config';

describe('Search Filters', () => {

    const loginPage = new LoginPage();
    const searchDialog = new SearchDialog();
    const searchFiltersPage = new SearchFiltersPage();
    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);
    const paginationPage = new PaginationPage();
    const contentList = new DocumentListPage();
    const searchResults = new SearchResultsPage();
    const navigationBarPage = new NavigationBarPage();

    const acsUser = new AcsUserModel();

    const filename = StringUtil.generateRandomString(16);
    const fileNamePrefix = StringUtil.generateRandomString(5);
    const uniqueFileName1 = fileNamePrefix + StringUtil.generateRandomString(5);
    const uniqueFileName2 = fileNamePrefix + StringUtil.generateRandomString(5);
    const uniqueFileName3 = fileNamePrefix + StringUtil.generateRandomString(5);

    const fileModel = new FileModel({
        'name': filename, 'shortName': filename.substring(0, 8)
    });

    const pngFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    const txtFileModel1 = new FileModel({
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location,
        'name': `${uniqueFileName1}.txt`
    });

    const jpgFileModel = new FileModel({
        'location': resources.Files.ADF_DOCUMENTS.JPG.file_location,
        'name': `${uniqueFileName2}.jpg`
    });

    const txtFileModel2 = new FileModel({
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location,
        'name': `${uniqueFileName3}.txt`
    });

    let fileUploaded, fileTypePng, fileTypeTxt1, fileTypeJpg, fileTypeTxt2;

    const filter = { type: 'TYPE-PNG Image' };

    let jsonFile;

    beforeAll(async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        fileUploaded = await uploadActions.uploadFile(fileModel.location, fileModel.name, '-my-');
        fileTypePng = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, '-my-');
        fileTypeTxt1 = await uploadActions.uploadFile(txtFileModel1.location, txtFileModel1.name, '-my-');
        fileTypeJpg = await uploadActions.uploadFile(jpgFileModel.location, jpgFileModel.name, '-my-');
        fileTypeTxt2 = await uploadActions.uploadFile(txtFileModel2.location, txtFileModel2.name, '-my-');

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        await browser.sleep(15000); // wait search index previous file/folder uploaded

        jsonFile = SearchConfiguration.getConfiguration();
    });

    afterAll(async () => {
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        await uploadActions.deleteFileOrFolder(fileUploaded.entry.id);
        await uploadActions.deleteFileOrFolder(fileTypePng.entry.id);
        await uploadActions.deleteFileOrFolder(fileTypeTxt1.entry.id);
        await uploadActions.deleteFileOrFolder(fileTypeTxt2.entry.id);
        await uploadActions.deleteFileOrFolder(fileTypeJpg.entry.id);
        await navigationBarPage.clickLogoutButton();
    });

    it('[C286298] Should be able to cancel a filter using "x" button from the toolbar', async () => {
        await searchDialog.checkSearchIconIsVisible();
        await searchDialog.clickOnSearchIcon();
        await searchDialog.enterTextAndPressEnter(fileUploaded.entry.name);

        await searchFiltersPage.checkSearchFiltersIsDisplayed();

        const userOption = `${acsUser.firstName} ${acsUser.lastName}`;
        const searchCheckListPage = await searchFiltersPage.creatorCheckListFiltersPage().filterBy(userOption);
        await searchCheckListPage.checkChipIsDisplayed(userOption);
        await searchCheckListPage.removeFilterOption(userOption);
        await searchCheckListPage.checkChipIsNotDisplayed(userOption);
    });

    it('[C277146] Should Show more/less buttons be hidden when inactive', async () => {
        await BrowserActions.getUrl(`${browser.params.testConfig.adf.url}/search;q=*`);

        const searchCheckListPage = searchFiltersPage.creatorCheckListFiltersPage();

        await searchCheckListPage.checkShowLessButtonIsNotDisplayed();
        await searchCheckListPage.checkShowMoreButtonIsDisplayed();
        await searchCheckListPage.clickShowMoreButtonUntilIsNotDisplayed();
        await searchCheckListPage.checkShowLessButtonIsDisplayed();
        await searchCheckListPage.clickShowLessButtonUntilIsNotDisplayed();
    });

    it('[C286556] Search categories should preserve their collapsed/expanded state after the search', async () => {
        await BrowserActions.getUrl(`${browser.params.testConfig.adf.url}/search;q=*`);

        await searchFiltersPage.clickFileTypeListFilter();
        await searchFiltersPage.checkFileTypeFilterIsCollapsed();
        await searchFiltersPage.clickFileSizeFilterHeader();
        await searchFiltersPage.checkFileSizeFilterIsCollapsed();

        await searchFiltersPage.creatorCheckListFiltersPage().clickCheckListOption('Administrator');

        await searchFiltersPage.checkFileTypeFilterIsCollapsed();
        await searchFiltersPage.checkFileSizeFilterIsCollapsed();
    });

    it('[C287796] Should be able to display the correct bucket number after selecting a filter', async () => {
        await BrowserActions.getUrl(`${browser.params.testConfig.adf.url}/search;q=*`);

        await searchFiltersPage.fileTypeCheckListFiltersPage().clickCheckListOption('PNG Image');

        const bucketNumberForFilter = await searchFiltersPage.fileTypeCheckListFiltersPage().getBucketNumberOfFilterType(filter.type);
        const resultFileNames: any = await contentList.getAllRowsColumnValues('Display name');

        await expect(bucketNumberForFilter).not.toEqual('0');
        await expect(await paginationPage.getTotalNumberOfFiles()).toEqual(bucketNumberForFilter);

        resultFileNames.map(async (nameOfResultFiles) => {
            await expect(nameOfResultFiles).toContain('.png');
        });
    });

    it('[C291802] Should be able to filter facet fields with "Contains"', async () => {
        await navigationBarPage.clickContentServicesButton();

        jsonFile['filterWithContains'] = true;
        await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

        await searchDialog.clickOnSearchIcon();
        await searchDialog.enterTextAndPressEnter('*');

        await searchResults.tableIsLoaded();

        await searchFiltersPage.creatorCheckListFiltersPage().searchInFilter('dminis');
        await searchFiltersPage.creatorCheckListFiltersPage().checkCheckListOptionIsDisplayed('Administrator');
    });

    it('[C291980] Should group search facets under specified labels', async () => {
        await BrowserActions.getUrl(`${browser.params.testConfig.adf.url}/search;q=*`);

        await searchFiltersPage.checkDefaultFacetQueryGroupIsDisplayed();
        await searchFiltersPage.checkTypeFacetQueryGroupIsDisplayed();
        await searchFiltersPage.checkSizeFacetQueryGroupIsDisplayed();
    });

    it('[C291981] Should group search facets under the default label, by default', async () => {
        await navigationBarPage.clickContentServicesButton();

        await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

        await searchDialog.clickOnSearchIcon();
        await searchDialog.enterTextAndPressEnter('*');

        await searchResults.tableIsLoaded();

        await searchFiltersPage.checkDefaultFacetQueryGroupIsDisplayed();
        await expect(await searchFiltersPage.isTypeFacetQueryGroupPresent()).toBe(false);
        await expect(await searchFiltersPage.isSizeFacetQueryGroupPresent()).toBe(false);
    });

    it('[C297509] Should display search intervals under specified labels from config', async () => {
        await BrowserActions.getUrl(`${browser.params.testConfig.adf.url}/search;q=*`);

        await searchFiltersPage.checkFacetIntervalsByCreatedIsDisplayed();
        await searchFiltersPage.checkFacetIntervalsByCreatedIsExpanded();
        await searchFiltersPage.clickFacetIntervalsByCreatedFilterHeader();
        await searchFiltersPage.checkFacetIntervalsByCreatedIsCollapsed();
        await searchFiltersPage.clickFacetIntervalsByCreatedFilterHeader();
        await searchFiltersPage.checkFacetIntervalsByCreatedIsExpanded();
        await searchFiltersPage.checkFacetIntervalsByModifiedIsDisplayed();
        await searchFiltersPage.checkFacetIntervalsByModifiedIsExpanded();
        await searchFiltersPage.clickFacetIntervalsByModifiedFilterHeader();
        await searchFiltersPage.checkFacetIntervalsByModifiedIsCollapsed();
        await searchFiltersPage.clickFacetIntervalsByModifiedFilterHeader();
        await searchFiltersPage.checkFacetIntervalsByModifiedIsExpanded();
    });

    it('[C299200] Should reset the filters facet with search query', async () => {
        await navigationBarPage.clickContentServicesButton();
        await searchDialog.checkSearchIconIsVisible();
        await searchDialog.clickOnSearchIcon();
        await searchDialog.enterTextAndPressEnter(fileTypeTxt1.entry.name);

        await searchFiltersPage.checkSearchFiltersIsDisplayed();
        await searchResults.tableIsLoaded();
        await searchResults.checkContentIsDisplayed(fileTypeTxt1.entry.name);
        await searchFiltersPage.checkFileTypeFacetLabelIsDisplayed('Plain Text (1)');
        await searchFiltersPage.checkFileTypeFacetLabelIsNotDisplayed('JPEG Image');

        await searchDialog.checkSearchIconIsVisible();
        await searchDialog.clickOnSearchIcon();

        await searchDialog.enterTextAndPressEnter(fileNamePrefix);
        await searchFiltersPage.checkSearchFiltersIsDisplayed();
        await searchResults.tableIsLoaded();
        await searchResults.checkContentIsDisplayed(fileTypeTxt1.entry.name);
        await searchResults.checkContentIsDisplayed(fileTypeTxt2.entry.name);
        await searchResults.checkContentIsDisplayed(fileTypeJpg.entry.name);
        await searchFiltersPage.checkFileTypeFacetLabelIsDisplayed('Plain Text (2)');
        await searchFiltersPage.checkFileTypeFacetLabelIsDisplayed('JPEG Image (1)');

    });

    it('[C299124] Should be able to parse escaped empty spaced labels inside facetFields', async () => {
        await navigationBarPage.clickContentServicesButton();

        jsonFile.facetFields.fields[0].label = 'My File Types';
        jsonFile.facetFields.fields[1].label = 'My File Sizes';
        await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

        await searchDialog.clickOnSearchIcon();
        await searchDialog.enterTextAndPressEnter('*');

        await searchResults.tableIsLoaded();
        await searchFiltersPage.checkCustomFacetFieldLabelIsDisplayed('My File Types');
        await searchFiltersPage.checkCustomFacetFieldLabelIsDisplayed('My File Sizes');
    });

});
