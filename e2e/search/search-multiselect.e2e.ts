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

import TestConfig = require('../test.config');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';

import { StringUtil } from '@alfresco/adf-testing';
import resources = require('../util/resources');
import CONSTANTS = require('../util/constants');
import { UploadActions } from '../actions/ACS/upload.actions';
import { browser } from 'protractor';

import { LoginPage } from '@alfresco/adf-testing';
import { SearchDialog } from '../pages/adf/dialog/searchDialog';
import { SearchResultsPage } from '../pages/adf/searchResultsPage';
import { SearchFiltersPage } from '../pages/adf/searchFiltersPage';

import { AcsUserModel } from '../models/ACS/acsUserModel';
import { FileModel } from '../models/ACS/fileModel';

describe('Search Component - Multi-Select Facet', () => {
    const loginPage = new LoginPage();
    const searchDialog = new SearchDialog();
    const searchResultsPage = new SearchResultsPage();
    const uploadActions = new UploadActions();
    const searchFiltersPage = new SearchFiltersPage();
    let site, userOption;

    beforeAll(() => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });
    });

    describe('', () => {
        let jpgFile, jpgFileSite, txtFile, txtFileSite;
        const acsUser = new AcsUserModel();

        const randomName = StringUtil.generateRandomString();
        const jpgFileInfo = new FileModel({
            'location': resources.Files.ADF_DOCUMENTS.JPG.file_location,
            'name': `${randomName}.jpg`
        });
        const txtFileInfo = new FileModel({
            'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location,
            'name': `${randomName}.txt`
        });

        beforeAll(async (done) => {
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

            site = await this.alfrescoJsApi.core.sitesApi.createSite({
                title: StringUtil.generateRandomString(8),
                visibility: 'PUBLIC'
            });

            jpgFile = await uploadActions.uploadFile(this.alfrescoJsApi, jpgFileInfo.location, jpgFileInfo.name, '-my-');
            jpgFileSite = await uploadActions.uploadFile(this.alfrescoJsApi, jpgFileInfo.location, jpgFileInfo.name, site.entry.guid);
            txtFile = await uploadActions.uploadFile(this.alfrescoJsApi, txtFileInfo.location, txtFileInfo.name, '-my-');
            txtFileSite = await uploadActions.uploadFile(this.alfrescoJsApi, txtFileInfo.location, txtFileInfo.name, site.entry.guid);

            await browser.driver.sleep(20000);

            done();
        });

        afterAll(async (done) => {
            Promise.all([
                uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, jpgFile.entry.id),
                uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, jpgFileSite.entry.id),
                uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, txtFile.entry.id),
                uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, txtFileSite.entry.id)
            ]);

            await this.alfrescoJsApi.core.sitesApi.deleteSite(site.entry.id);

            done();
        });

        it('[C280054] Should be able to select multiple items from a search facet filter', async () => {
            await loginPage.loginToContentServicesUsingUserModel(acsUser);

            searchDialog.checkSearchIconIsVisible();
            searchDialog.clickOnSearchIcon();
            searchDialog.enterTextAndPressEnter(`${randomName}`);

            userOption = `${acsUser.firstName} ${acsUser.lastName}`;

            searchFiltersPage.checkSearchFiltersIsDisplayed();
            searchFiltersPage.creatorCheckListFiltersPage().filterBy(userOption);
            searchFiltersPage.fileTypeCheckListFiltersPage().filterBy('Plain Text');

            expect(searchResultsPage.numberOfResultsDisplayed()).toBe(2);
            searchResultsPage.checkContentIsDisplayed(txtFile.entry.name);
            searchResultsPage.checkContentIsDisplayed(txtFileSite.entry.name);

            searchFiltersPage.fileTypeCheckListFiltersPage().filterBy('JPEG Image');

            expect(searchResultsPage.numberOfResultsDisplayed()).toBe(4);
            searchResultsPage.checkContentIsDisplayed(txtFile.entry.name);
            searchResultsPage.checkContentIsDisplayed(txtFileSite.entry.name);
            searchResultsPage.checkContentIsDisplayed(jpgFile.entry.name);
            searchResultsPage.checkContentIsDisplayed(jpgFileSite.entry.name);
        });
    });

    describe('', () => {
        let jpgFile, txtFile;
        const userUploadingTxt = new AcsUserModel();
        const userUploadingImg = new AcsUserModel();

        const randomName = StringUtil.generateRandomString();
        const jpgFileInfo = new FileModel({
            'location': resources.Files.ADF_DOCUMENTS.JPG.file_location,
            'name': `${randomName}.jpg`
        });
        const txtFileInfo = new FileModel({
            'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location,
            'name': `${randomName}.txt`
        });

        beforeAll(async (done) => {
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            await this.alfrescoJsApi.core.peopleApi.addPerson(userUploadingTxt);
            await this.alfrescoJsApi.core.peopleApi.addPerson(userUploadingImg);

            await this.alfrescoJsApi.login(userUploadingTxt.id, userUploadingTxt.password);

            site = await this.alfrescoJsApi.core.sitesApi.createSite({
                title: StringUtil.generateRandomString(8),
                visibility: 'PUBLIC'
            });

            await this.alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
                id: userUploadingImg.id,
                role: CONSTANTS.CS_USER_ROLES.MANAGER
            });

            txtFile = await uploadActions.uploadFile(this.alfrescoJsApi, txtFileInfo.location, txtFileInfo.name, site.entry.guid);

            await this.alfrescoJsApi.login(userUploadingImg.id, userUploadingImg.password);

            jpgFile = await uploadActions.uploadFile(this.alfrescoJsApi, jpgFileInfo.location, jpgFileInfo.name, site.entry.guid);

            await browser.driver.sleep(20000);

            done();
        });

        it('[C280056] Should be able to select multiple items from multiple search facet filters', async () => {
            await loginPage.loginToContentServicesUsingUserModel(userUploadingImg);

            searchDialog.checkSearchIconIsVisible();
            searchDialog.clickOnSearchIcon();
            searchDialog.enterTextAndPressEnter(`*${randomName}*`);

            searchFiltersPage.checkSearchFiltersIsDisplayed();
            searchFiltersPage.creatorCheckListFiltersPage().filterBy(`${userUploadingTxt.firstName} ${userUploadingTxt.lastName}`);
            searchFiltersPage.creatorCheckListFiltersPage().filterBy(`${userUploadingImg.firstName} ${userUploadingImg.lastName}`);

            searchResultsPage.checkContentIsDisplayed(txtFile.entry.name);
            searchResultsPage.checkContentIsDisplayed(jpgFile.entry.name);

            searchFiltersPage.fileTypeCheckListFiltersPage().filterBy('Plain Text');
            searchFiltersPage.fileTypeCheckListFiltersPage().filterBy('JPEG Image');

            expect(searchResultsPage.numberOfResultsDisplayed()).toBe(2);
            searchResultsPage.checkContentIsDisplayed(txtFile.entry.name);
            searchResultsPage.checkContentIsDisplayed(jpgFile.entry.name);
        });
    });

    describe('', () => {
        let txtFile;
        const acsUser = new AcsUserModel();

        const randomName = StringUtil.generateRandomString();
        const txtFileInfo = new FileModel({
            'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location,
            'name': `${randomName}.txt`
        });

        beforeAll(async (done) => {
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

            site = await this.alfrescoJsApi.core.sitesApi.createSite({
                title: StringUtil.generateRandomString(8),
                visibility: 'PUBLIC'
            });

            txtFile = await uploadActions.uploadFile(this.alfrescoJsApi, txtFileInfo.location, txtFileInfo.name, '-my-');
            await browser.driver.sleep(20000);

            done();
        });

        afterAll(async (done) => {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, txtFile.entry.id);
            await this.alfrescoJsApi.core.sitesApi;
            done();
        });

        it('[C280058] Should update filter facets items number when another filter facet item is selected', async () => {
            await loginPage.loginToContentServicesUsingUserModel(acsUser);

            searchDialog.checkSearchIconIsVisible();
            searchDialog.clickOnSearchIcon();
            searchDialog.enterTextAndPressEnter(`*${randomName}*`);

            searchFiltersPage.checkSearchFiltersIsDisplayed();
            searchFiltersPage.fileTypeCheckListFiltersPage().filterBy('Plain Text');
            searchFiltersPage.creatorCheckListFiltersPage().filterBy(`${acsUser.firstName} ${acsUser.lastName}`);

            expect(searchResultsPage.numberOfResultsDisplayed()).toBe(1);
            searchResultsPage.checkContentIsDisplayed(txtFile.entry.name);
        });
    });
});
