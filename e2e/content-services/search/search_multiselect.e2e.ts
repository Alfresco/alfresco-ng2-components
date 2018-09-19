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

import TestConfig = require('../../test.config');
import AlfrescoApi = require('alfresco-js-api-node');

import Util = require('../../util/util');
import resources = require('../../util/resources');
import CONSTANTS = require('../../util/constants');
import { UploadActions } from '../../actions/ACS/upload.actions';
import { browser } from 'protractor';

import LoginPage = require('../../pages/adf/loginPage');
import SearchDialog = require('../../pages/adf/dialog/searchDialog');
import SearchResultPage = require('../../pages/adf/searchResultsPage');
import SearchFiltersPage = require('../../pages/adf/searchFiltersPage');

import AcsUserModel = require('../../models/ACS/acsUserModel');
import FileModel = require('../../models/ACS/fileModel');

describe('Search Component - Multi-Select Facet', () => {
    let loginPage = new LoginPage();
    let searchDialog = new SearchDialog();
    let searchResultsPage = new SearchResultPage();
    let uploadActions = new UploadActions();
    let searchFiltersPage = new SearchFiltersPage();
    let site;

    beforeAll(() => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });
    });

    describe('', () => {
        let jpgFile, jpgFileSite, txtFile, txtFileSite;
        let acsUser = new AcsUserModel();

        let jpgFileInfo = new FileModel({
            'location': resources.Files.ADF_DOCUMENTS.JPG.file_location,
            'name': resources.Files.ADF_DOCUMENTS.JPG.file_name
        });
        let txtFileInfo = new FileModel({
            'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location,
            'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name
        });

        beforeAll(async (done) => {
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

            site = await this.alfrescoJsApi.core.sitesApi.createSite({
                title: Util.generateRandomString(8),
                visibility: 'PUBLIC'
            });

            jpgFile = await uploadActions.uploadFile(this.alfrescoJsApi, jpgFileInfo.location, jpgFileInfo.name, '-my-');

            jpgFileSite = await uploadActions.uploadFile(this.alfrescoJsApi, jpgFileInfo.location, jpgFileInfo.name, site.entry.guid);

            txtFile = await uploadActions.uploadFile(this.alfrescoJsApi, txtFileInfo.location, txtFileInfo.name, '-my-');

            txtFileSite = await uploadActions.uploadFile(this.alfrescoJsApi, txtFileInfo.location, txtFileInfo.name, site.entry.guid);

            await browser.driver.sleep(15000);

            loginPage.loginToContentServicesUsingUserModel(acsUser);

            searchDialog.checkSearchIconIsVisible();
            searchDialog.clickOnSearchIcon();
            searchDialog.enterTextAndPressEnter('file');

            searchFiltersPage.checkSearchFiltersIsDisplayed();
            searchFiltersPage.filterByCreator(acsUser.firstName, acsUser.lastName);

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

        it('[C280054] Multiple items can be selected from a search facet filter', () => {
            searchFiltersPage.filterByFileType('Plain Text');

            expect(searchResultsPage.numberOfResultsDisplayed()).toBe(2);
            searchResultsPage.checkContentIsDisplayed(txtFile.entry.name);
            searchResultsPage.checkContentIsDisplayed(txtFileSite.entry.name);

            searchFiltersPage.filterByFileType('JPEG Image');

            expect(searchResultsPage.numberOfResultsDisplayed()).toBe(4);
            searchResultsPage.checkContentIsDisplayed(txtFile.entry.name);
            searchResultsPage.checkContentIsDisplayed(txtFileSite.entry.name);
            searchResultsPage.checkContentIsDisplayed(jpgFile.entry.name);
            searchResultsPage.checkContentIsDisplayed(jpgFileSite.entry.name);
        });
    });

    describe('', () => {
        let jpgFile, txtFile;
        let userUploadingTxt = new AcsUserModel();
        let userUploadingImg = new AcsUserModel();

        let jpgFileInfo = new FileModel({
            'location': resources.Files.ADF_DOCUMENTS.JPG.file_location,
            'name': resources.Files.ADF_DOCUMENTS.JPG.file_name
        });
        let txtFileInfo = new FileModel({
            'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location,
            'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name
        });

        beforeAll(async (done) => {
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            await this.alfrescoJsApi.core.peopleApi.addPerson(userUploadingTxt);
            await this.alfrescoJsApi.core.peopleApi.addPerson(userUploadingImg);

            await this.alfrescoJsApi.login(userUploadingTxt.id, userUploadingTxt.password);

            site = await this.alfrescoJsApi.core.sitesApi.createSite({
                title: Util.generateRandomString(8),
                visibility: 'PUBLIC'
            });

            await this.alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
                id: userUploadingImg.id,
                role: CONSTANTS.CS_USER_ROLES.MANAGER
            });

            txtFile = await uploadActions.uploadFile(this.alfrescoJsApi, txtFileInfo.location, txtFileInfo.name, site.entry.guid);

            await this.alfrescoJsApi.login(userUploadingImg.id, userUploadingImg.password);

            jpgFile = await uploadActions.uploadFile(this.alfrescoJsApi, jpgFileInfo.location, jpgFileInfo.name, site.entry.guid);

            await browser.driver.sleep(15000);

            loginPage.loginToContentServicesUsingUserModel(userUploadingImg);

            searchDialog.checkSearchIconIsVisible();
            searchDialog.clickOnSearchIcon();
            searchDialog.enterTextAndPressEnter('file');

            done();
        });

        afterAll(async (done) => {
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            Promise.all([
                uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, jpgFile.entry.id),
                uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, txtFile.entry.id)
            ]);

            await this.alfrescoJsApi.core.sitesApi.deleteSite(site.entry.id);

            done();
        });

        it('[C280056] Multiple items can be selected from multiple search facets', () => {
            searchFiltersPage.checkSearchFiltersIsDisplayed();

            searchFiltersPage.filterByCreator(userUploadingTxt.firstName, userUploadingTxt.lastName);
            searchFiltersPage.filterByCreator(userUploadingImg.firstName, userUploadingImg.lastName);

            searchResultsPage.checkContentIsDisplayed(txtFile.entry.name);
            searchResultsPage.checkContentIsDisplayed(jpgFile.entry.name);

            searchFiltersPage.filterByFileType('Plain Text');
            searchFiltersPage.filterByFileType('JPEG Image');

            expect(searchResultsPage.numberOfResultsDisplayed()).toBe(2);
            searchResultsPage.checkContentIsDisplayed(txtFile.entry.name);
            searchResultsPage.checkContentIsDisplayed(jpgFile.entry.name);
        });
    });

    describe('', () => {
        let txtFile;
        let acsUser = new AcsUserModel();

        let txtFileInfo = new FileModel({
            'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location,
            'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name
        });

        beforeAll(async (done) => {
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

            site = await this.alfrescoJsApi.core.sitesApi.createSite({
                title: Util.generateRandomString(8),
                visibility: 'PUBLIC'
            });

            txtFile = await uploadActions.uploadFile(this.alfrescoJsApi, txtFileInfo.location, txtFileInfo.name, '-my-');
            await browser.driver.sleep(15000);

            loginPage.loginToContentServicesUsingUserModel(acsUser);

            searchDialog.checkSearchIconIsVisible();
            searchDialog.clickOnSearchIcon();
            searchDialog.enterTextAndPressEnter('file');

            searchFiltersPage.checkSearchFiltersIsDisplayed();

            done();
        });

        afterAll(async (done) => {
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, txtFile.entry.id);
            await this.alfrescoJsApi.core.sitesApi;
            done();
        });

        it('[C280058] The filter facets items number is updated when another filter facet item is selected', () => {
            searchFiltersPage.filterByFileType('Plain Text');

            searchFiltersPage.filterByCreator(acsUser.firstName, acsUser.lastName);

            expect(searchResultsPage.numberOfResultsDisplayed()).toBe(1);
            searchResultsPage.checkContentIsDisplayed(txtFile.entry.name);
        });
    });
});
