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

import TestConfig = require('../test.config');
import { StringUtil, DocumentListPage, PaginationPage, LoginPage, LocalStorageUtil, BrowserActions } from '@alfresco/adf-testing';
import resources = require('../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '../actions/ACS/upload.actions';
import { browser } from 'protractor';
import { SearchConfiguration } from './search.config';

describe('Search Filters', () => {

    const loginPage = new LoginPage();
    const searchDialog = new SearchDialog();
    const searchFiltersPage = new SearchFiltersPage();
    const uploadActions = new UploadActions();
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

    beforeAll(async (done) => {

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        fileUploaded = await uploadActions.uploadFile(this.alfrescoJsApi, fileModel.location, fileModel.name, '-my-');

        fileTypePng = await uploadActions.uploadFile(this.alfrescoJsApi, pngFileModel.location, pngFileModel.name, '-my-');

        fileTypeTxt1 = await uploadActions.uploadFile(this.alfrescoJsApi, txtFileModel1.location, txtFileModel1.name, '-my-');

        fileTypeJpg = await uploadActions.uploadFile(this.alfrescoJsApi, jpgFileModel.location, jpgFileModel.name, '-my-');

        fileTypeTxt2 = await uploadActions.uploadFile(this.alfrescoJsApi, txtFileModel2.location, txtFileModel2.name, '-my-');

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        await browser.driver.sleep(15000); // wait search index previous file/folder uploaded

        searchDialog.checkSearchIconIsVisible();
        searchDialog.clickOnSearchIcon();

        jsonFile = SearchConfiguration.getConfiguration();

        done();
    });

    afterAll(async (done) => {
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, fileUploaded.entry.id);
        await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, fileTypePng.entry.id);
        await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, fileTypeTxt1.entry.id);
        await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, fileTypeTxt2.entry.id);
        await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, fileTypeJpg.entry.id);

        done();
    });

    it('[C286298] Should be able to cancel a filter using "x" button from the toolbar', () => {
        searchDialog.enterTextAndPressEnter(fileUploaded.entry.name);

        searchFiltersPage.checkSearchFiltersIsDisplayed();

        const userOption = `${acsUser.firstName} ${acsUser.lastName}`;
        searchFiltersPage.creatorCheckListFiltersPage().filterBy(userOption)
            .checkChipIsDisplayed(userOption)
            .removeFilterOption(userOption)
            .checkChipIsNotDisplayed(userOption);
    });

    it('[C277146] Should Show more/less buttons be hidden when inactive', () => {
        BrowserActions.getUrl(TestConfig.adf.url + '/search;q=*');

        searchFiltersPage.creatorCheckListFiltersPage().checkShowLessButtonIsNotDisplayed()
            .checkShowMoreButtonIsDisplayed()
            .clickShowMoreButtonUntilIsNotDisplayed()
            .checkShowLessButtonIsDisplayed()
            .clickShowLessButtonUntilIsNotDisplayed();
    });

    it('[C286556] Search categories should preserve their collapsed/expanded state after the search', () => {
        BrowserActions.getUrl(TestConfig.adf.url + '/search;q=*');

        searchFiltersPage.clickFileTypeListFilter()
            .checkFileTypeFilterIsCollapsed()
            .clickFileSizeFilterHeader()
            .checkFileSizeFilterIsCollapsed();

        searchFiltersPage.creatorCheckListFiltersPage().clickCheckListOption('Administrator');

        searchFiltersPage.checkFileTypeFilterIsCollapsed()
            .checkFileSizeFilterIsCollapsed();
    });

    it('[C287796] Should be able to display the correct bucket number after selecting a filter', () => {
        BrowserActions.getUrl(TestConfig.adf.url + '/search;q=*');

        searchFiltersPage.fileTypeCheckListFiltersPage().clickCheckListOption('PNG Image');

        const bucketNumberForFilter = searchFiltersPage.fileTypeCheckListFiltersPage().getBucketNumberOfFilterType(filter.type);
        const resultFileNames = contentList.getAllRowsColumnValues('Display name');

        expect(bucketNumberForFilter).not.toEqual('0');
        expect(paginationPage.getTotalNumberOfFiles()).toEqual(bucketNumberForFilter);

        resultFileNames.then((fileNames) => {
            fileNames.map((nameOfResultFiles) => {
                expect(nameOfResultFiles).toContain('.png');
            });
        });
    });

    it('[C291802] Should be able to filter facet fields with "Contains"', async () => {
        navigationBarPage.clickContentServicesButton();

        jsonFile['filterWithContains'] = true;
        await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

        searchDialog.clickOnSearchIcon()
            .enterTextAndPressEnter('*');

        searchResults.tableIsLoaded();

        searchFiltersPage.creatorCheckListFiltersPage()
            .searchInFilter('dminis')
            .checkCheckListOptionIsDisplayed('Administrator');
    });

    it('[C291980] Should group search facets under specified labels', () => {
        BrowserActions.getUrl(TestConfig.adf.url + '/search;q=*');

        searchFiltersPage.checkDefaultFacetQueryGroupIsDisplayed()
            .checkTypeFacetQueryGroupIsDisplayed()
            .checkSizeFacetQueryGroupIsDisplayed();
    });

    it('[C291981] Should group search facets under the default label, by default', async () => {
        navigationBarPage.clickContentServicesButton();

        await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

        searchDialog.clickOnSearchIcon()
            .enterTextAndPressEnter('*');

        searchResults.tableIsLoaded();

        searchFiltersPage.checkDefaultFacetQueryGroupIsDisplayed();
        expect(searchFiltersPage.isTypeFacetQueryGroupPresent()).toBe(false);
        expect(searchFiltersPage.isSizeFacetQueryGroupPresent()).toBe(false);
    });

    it('[C297509] Should display search intervals under specified labels from config', () => {
        BrowserActions.getUrl(TestConfig.adf.url + '/search;q=*');

        searchFiltersPage.checkFacetIntervalsByCreatedIsDisplayed()
            .checkFacetIntervalsByCreatedIsExpanded()
            .clickFacetIntervalsByCreatedFilterHeader()
            .checkFacetIntervalsByCreatedIsCollapsed()
            .clickFacetIntervalsByCreatedFilterHeader()
            .checkFacetIntervalsByCreatedIsExpanded()
            .checkFacetIntervalsByModifiedIsDisplayed()
            .checkFacetIntervalsByModifiedIsExpanded()
            .clickFacetIntervalsByModifiedFilterHeader()
            .checkFacetIntervalsByModifiedIsCollapsed()
            .clickFacetIntervalsByModifiedFilterHeader()
            .checkFacetIntervalsByModifiedIsExpanded();
    });

    it('[C299200] Should reset the filters facet with search query', () => {
        searchDialog.enterTextAndPressEnter(fileTypeTxt1.entry.name);

        searchFiltersPage.checkSearchFiltersIsDisplayed();
        searchResults.tableIsLoaded();
        searchResults.checkContentIsDisplayed(fileTypeTxt1.entry.name);
        searchFiltersPage.checkFileTypeFacetLabelIsDisplayed('Plain Text (1)');
        searchFiltersPage.checkFileTypeFacetLabelIsNotDisplayed('JPEG Image');

        searchDialog.enterTextAndPressEnter(fileNamePrefix);
        searchFiltersPage.checkSearchFiltersIsDisplayed();
        searchResults.tableIsLoaded();
        searchResults.checkContentIsDisplayed(fileTypeTxt1.entry.name);
        searchResults.checkContentIsDisplayed(fileTypeTxt2.entry.name);
        searchResults.checkContentIsDisplayed(fileTypeJpg.entry.name);
        searchFiltersPage.checkFileTypeFacetLabelIsDisplayed('Plain Text (2)');
        searchFiltersPage.checkFileTypeFacetLabelIsDisplayed('JPEG Image (1)');

    });

    it('[C299124] Should be able to parse escaped empty spaced labels inside facetFields', async () => {
        navigationBarPage.clickContentServicesButton();

        jsonFile.facetFields.fields[0].label = 'My File Types';
        jsonFile.facetFields.fields[1].label = 'My File Sizes';
        await LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile));

        searchDialog.clickOnSearchIcon()
            .enterTextAndPressEnter('*');

        searchResults.tableIsLoaded();
        searchFiltersPage.checkCustomFacetFieldLabelIsDisplayed('My File Types');
        searchFiltersPage.checkCustomFacetFieldLabelIsDisplayed('My File Sizes');
    });

});
