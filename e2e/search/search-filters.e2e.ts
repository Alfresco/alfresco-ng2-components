/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { SearchBarPage } from './pages/search-bar.page';
import { SearchFiltersPage } from './pages/search-filters.page';
import { SearchResultsPage } from './pages/search-results.page';
import { FileModel } from '../models/ACS/file.model';
import { NavigationBarPage } from '../core/pages/navigation-bar.page';
import {
    createApiService,
    BrowserActions,
    DocumentListPage,
    LocalStorageUtil,
    LoginPage,
    PaginationPage,
    StringUtil,
    UploadActions,
    UserModel,
    UsersActions
} from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { SearchConfiguration } from './search.config';
import * as moment from 'moment';

describe('Search Filters', () => {

    const loginPage = new LoginPage();
    const searchBarPage = new SearchBarPage();
    const searchFiltersPage = new SearchFiltersPage();
    const paginationPage = new PaginationPage();
    const contentList = new DocumentListPage();
    const searchResults = new SearchResultsPage();
    const navigationBarPage = new NavigationBarPage();

    const apiService = createApiService();
    const uploadActions = new UploadActions(apiService);
    const usersActions = new UsersActions(apiService);

    const acsUser = new UserModel();

    const filename = StringUtil.generateRandomString(16);
    const fileNamePrefix = StringUtil.generateRandomString(5);
    const uniqueFileName1 = fileNamePrefix + StringUtil.generateRandomString(5);
    const uniqueFileName2 = fileNamePrefix + StringUtil.generateRandomString(5);
    const uniqueFileName3 = fileNamePrefix + StringUtil.generateRandomString(5);

    const fileModel = new FileModel({
        name: filename, shortName: filename.substring(0, 8)
    });

    const pngFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_path
    });

    const txtFileModel1 = new FileModel({
        location: browser.params.resources.Files.ADF_DOCUMENTS.TXT_0B.file_path,
        name: `${uniqueFileName1}.txt`
    });

    const jpgFileModel = new FileModel({
        location: browser.params.resources.Files.ADF_DOCUMENTS.JPG.file_path,
        name: `${uniqueFileName2}.jpg`
    });

    const txtFileModel2 = new FileModel({
        location: browser.params.resources.Files.ADF_DOCUMENTS.TXT_0B.file_path,
        name: `${uniqueFileName3}.txt`
    });

    let fileUploaded; let fileTypePng; let fileTypeTxt1; let fileTypeJpg; let fileTypeTxt2;

    const filter = { type: 'TYPE-PNG Image' };

    let jsonFile;

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        await usersActions.createUser(acsUser);

        await apiService.login(acsUser.username, acsUser.password);

        fileUploaded = await uploadActions.uploadFile(fileModel.location, fileModel.name, '-my-');
        fileTypePng = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, '-my-');
        fileTypeTxt1 = await uploadActions.uploadFile(txtFileModel1.location, txtFileModel1.name, '-my-');
        fileTypeJpg = await uploadActions.uploadFile(jpgFileModel.location, jpgFileModel.name, '-my-');
        fileTypeTxt2 = await uploadActions.uploadFile(txtFileModel2.location, txtFileModel2.name, '-my-');

        await loginPage.login(acsUser.username, acsUser.password);

        await browser.sleep(browser.params.testConfig.timeouts.index_search); // wait search index previous file/folder uploaded

    });

    beforeEach(async () => {
        jsonFile = SearchConfiguration.getConfiguration();
    });

    afterAll(async () => {
        await apiService.login(acsUser.username, acsUser.password);

        await uploadActions.deleteFileOrFolder(fileUploaded.entry.id);
        await uploadActions.deleteFileOrFolder(fileTypePng.entry.id);
        await uploadActions.deleteFileOrFolder(fileTypeTxt1.entry.id);
        await uploadActions.deleteFileOrFolder(fileTypeTxt2.entry.id);
        await uploadActions.deleteFileOrFolder(fileTypeJpg.entry.id);
        await navigationBarPage.clickLogoutButton();
    });

    it('[C291980] Should group search facets under specified labels', async () => {
        const currentYear = moment().year();

        jsonFile.facetQueries.queries[0] = {
            query: `created:${currentYear}`,
            label: 'SEARCH.FACET_QUERIES.CREATED_THIS_YEAR'
        };
        jsonFile.facetQueries.queries[1] = {
            query: `content.mimetype:text/html`,
            label: 'SEARCH.FACET_QUERIES.MIMETYPE',
            group: 'Type facet queries'
        };
        jsonFile.facetQueries.queries[2] = {
            query: `content.size:[0 TO 10240]`,
            label: 'SEARCH.FACET_QUERIES.XTRASMALL',
            group: 'Size facet queries'
        };


        await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

        await searchBarPage.clickOnSearchIcon();
        await searchBarPage.enterTextAndPressEnter('*');
        await searchResults.dataTable.waitTillContentLoaded();

        await searchFiltersPage.checkDefaultFacetQueryGroupIsDisplayed();
        await searchFiltersPage.checkTypeFacetQueryGroupIsDisplayed();

        await searchFiltersPage.checkSizeFacetQueryGroupIsDisplayed();
    });

    it('[C286298] Should be able to cancel a filter using "x" button from the toolbar', async () => {
        await searchBarPage.checkSearchIconIsVisible();
        await searchBarPage.clickOnSearchIcon();

        await searchBarPage.enterTextAndPressEnter(fileUploaded.entry.name);
        await searchResults.dataTable.waitTillContentLoaded();

        await searchFiltersPage.checkSearchFiltersIsDisplayed();

        const userOption = `${acsUser.firstName} ${acsUser.lastName}`;
        const searchCheckListPage = await searchFiltersPage.creatorCheckListFiltersPage().filterBy(userOption);
        await searchCheckListPage.checkChipIsDisplayed(userOption);
        await searchCheckListPage.removeFilterOption(userOption);
        await searchCheckListPage.checkChipIsNotDisplayed(userOption);
    });

    it('[C277146] Should Show more/less buttons be hidden when inactive', async () => {
        await BrowserActions.getUrl(`${browser.baseUrl}/search;q=*`);

        const searchCheckListPage = searchFiltersPage.creatorCheckListFiltersPage();

        await searchCheckListPage.checkShowLessButtonIsNotDisplayed();
        await searchCheckListPage.checkShowMoreButtonIsDisplayed();
        await searchCheckListPage.clickShowMoreButtonUntilIsNotDisplayed();
        await searchCheckListPage.checkShowLessButtonIsDisplayed();
        await searchCheckListPage.clickShowLessButtonUntilIsNotDisplayed();
    });

    it('[C286556] Search categories should preserve their collapsed/expanded state after the search', async () => {
        await BrowserActions.getUrl(`${browser.baseUrl}/search;q=*`);

        await searchFiltersPage.clickFileTypeListFilter();
        await searchFiltersPage.checkFileTypeFilterIsCollapsed();
        await searchFiltersPage.clickFileSizeFilterHeader();
        await searchFiltersPage.checkFileSizeFilterIsCollapsed();

        await searchFiltersPage.creatorCheckListFiltersPage().clickCheckListOption('Administrator');

        await searchFiltersPage.checkFileTypeFilterIsCollapsed();
        await searchFiltersPage.checkFileSizeFilterIsCollapsed();
    });

    it('[C287796] Should be able to display the correct bucket number after selecting a filter', async () => {
        await BrowserActions.getUrl(`${browser.baseUrl}/search;q=*`);

        await searchFiltersPage.fileTypeCheckListFiltersPage().clickCheckListOption('PNG Image');

        const bucketNumberForFilter = await searchFiltersPage.fileTypeCheckListFiltersPage().getBucketNumberOfFilterType(filter.type);
        const resultFileNames: any = await contentList.getAllRowsColumnValues('Display name');

        await expect(bucketNumberForFilter).not.toEqual('0');
        await expect(await paginationPage.getTotalNumberOfFiles()).toEqual(bucketNumberForFilter);

        resultFileNames.map(async (nameOfResultFiles) => {
            await expect(nameOfResultFiles.toLowerCase()).toContain('.png');
        });
    });

    it('[C297509] Should display search intervals under specified labels from config', async () => {
        await searchBarPage.clickOnSearchIcon();
        await searchBarPage.enterTextAndPressEnter('*');
        await searchResults.dataTable.waitTillContentLoaded();

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
        await navigationBarPage.navigateToContentServices();
        await searchBarPage.checkSearchIconIsVisible();
        await searchBarPage.clickOnSearchIcon();
        await searchBarPage.enterTextAndPressEnter(fileTypeTxt1.entry.name);
        await searchResults.dataTable.waitTillContentLoaded();

        await searchFiltersPage.checkSearchFiltersIsDisplayed();
        await searchResults.checkContentIsDisplayed(fileTypeTxt1.entry.name);
        await searchFiltersPage.checkFileTypeFacetLabelIsDisplayed('Plain Text (1)');
        await searchFiltersPage.checkFileTypeFacetLabelIsNotDisplayed('JPEG Image');

        await searchBarPage.checkSearchIconIsVisible();
        await searchBarPage.clickOnSearchIcon();

        await searchBarPage.enterTextAndPressEnter(fileNamePrefix);
        await searchResults.dataTable.waitTillContentLoaded();

        await searchFiltersPage.checkSearchFiltersIsDisplayed();
        await searchResults.checkContentIsDisplayed(fileTypeTxt1.entry.name);
        await searchResults.checkContentIsDisplayed(fileTypeTxt2.entry.name);
        await searchResults.checkContentIsDisplayed(fileTypeJpg.entry.name);
        await searchFiltersPage.checkFileTypeFacetLabelIsDisplayed('Plain Text (2)');
        await searchFiltersPage.checkFileTypeFacetLabelIsDisplayed('JPEG Image (1)');
    });

    describe('Change config', () => {

        it('[C291802] Should be able to filter facet fields with "Contains"', async () => {
            await navigationBarPage.navigateToContentServices();

            jsonFile['filterWithContains'] = true;
            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchBarPage.clickOnSearchIcon();
            await searchBarPage.enterTextAndPressEnter('*');
            await searchResults.dataTable.waitTillContentLoaded();

            await searchFiltersPage.creatorCheckListFiltersPage().searchInFilter('dminis');
            await searchFiltersPage.creatorCheckListFiltersPage().checkCheckListOptionIsDisplayed('Administrator');
        });

        it('[C291981] Should group search facets under the default label, by default', async () => {
            await navigationBarPage.navigateToContentServices();

            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchBarPage.clickOnSearchIcon();
            await searchBarPage.enterTextAndPressEnter('*');
            await searchResults.dataTable.waitTillContentLoaded();

            await searchFiltersPage.checkDefaultFacetQueryGroupIsDisplayed();
            await expect(await searchFiltersPage.isTypeFacetQueryGroupPresent()).toBe(false);
            await expect(await searchFiltersPage.isSizeFacetQueryGroupPresent()).toBe(false);
        });

        it('[C299124] Should be able to parse escaped empty spaced labels inside facetFields', async () => {
            await navigationBarPage.navigateToContentServices();

            jsonFile.facetFields.fields[0].label = 'My File Types';
            jsonFile.facetFields.fields[1].label = 'My File Sizes';
            await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

            await searchBarPage.clickOnSearchIcon();
            await searchBarPage.enterTextAndPressEnter('*');
            await searchResults.dataTable.waitTillContentLoaded();

            await searchFiltersPage.checkCustomFacetFieldLabelIsDisplayed('My File Types');
            await searchFiltersPage.checkCustomFacetFieldLabelIsDisplayed('My File Sizes');
        });
    });
});
