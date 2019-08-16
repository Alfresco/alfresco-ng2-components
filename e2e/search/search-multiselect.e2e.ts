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

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { StringUtil, UploadActions, LoginPage } from '@alfresco/adf-testing';
import resources = require('../util/resources');
import CONSTANTS = require('../util/constants');
import { browser } from 'protractor';
import { SearchDialog } from '../pages/adf/dialog/searchDialog';
import { SearchResultsPage } from '../pages/adf/searchResultsPage';
import { SearchFiltersPage } from '../pages/adf/searchFiltersPage';
import { AcsUserModel } from '../models/ACS/acsUserModel';
import { FileModel } from '../models/ACS/fileModel';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';

describe('Search Component - Multi-Select Facet', () => {
    const loginPage = new LoginPage();
    const searchDialog = new SearchDialog();
    const searchResultsPage = new SearchResultsPage();
    this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: browser.params.testConfig.adf_acs.host
        });
    const uploadActions = new UploadActions(this.alfrescoJsApi);
    const searchFiltersPage = new SearchFiltersPage();
    const navigationBarPage = new NavigationBarPage();

    let site, userOption;

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

        beforeAll(async () => {
            await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

            await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

            site = await this.alfrescoJsApi.core.sitesApi.createSite({
                title: StringUtil.generateRandomString(8),
                visibility: 'PUBLIC'
            });

            jpgFile = await uploadActions.uploadFile(jpgFileInfo.location, jpgFileInfo.name, '-my-');

            jpgFileSite = await uploadActions.uploadFile(jpgFileInfo.location, jpgFileInfo.name, site.entry.guid);

            txtFile = await uploadActions.uploadFile(txtFileInfo.location, txtFileInfo.name, '-my-');

            txtFileSite = await uploadActions.uploadFile(txtFileInfo.location, txtFileInfo.name, site.entry.guid);

            await browser.sleep(15000);

            await loginPage.loginToContentServicesUsingUserModel(acsUser);

            await searchDialog.checkSearchIconIsVisible();
            await searchDialog.clickOnSearchIcon();
            await searchDialog.enterTextAndPressEnter(`${randomName}`);

            userOption = `${acsUser.firstName} ${acsUser.lastName}`;

            await searchFiltersPage.checkSearchFiltersIsDisplayed();
            await searchFiltersPage.creatorCheckListFiltersPage().filterBy(userOption);

        });

        afterAll(async () => {
            await Promise.all([
                uploadActions.deleteFileOrFolder(jpgFile.entry.id),
                uploadActions.deleteFileOrFolder(jpgFileSite.entry.id),
                uploadActions.deleteFileOrFolder(txtFile.entry.id),
                uploadActions.deleteFileOrFolder(txtFileSite.entry.id)
            ]);

            await this.alfrescoJsApi.core.sitesApi.deleteSite(site.entry.id);
            await navigationBarPage.clickLogoutButton();

        });

        it('[C280054] Should be able to select multiple items from a search facet filter', async () => {
            await loginPage.loginToContentServicesUsingUserModel(acsUser);

            await searchDialog.checkSearchIconIsVisible();
            await searchDialog.clickOnSearchIcon();
            await searchDialog.enterTextAndPressEnter(`${randomName}`);

            userOption = `${acsUser.firstName} ${acsUser.lastName}`;

            await searchFiltersPage.checkSearchFiltersIsDisplayed();
            await searchFiltersPage.creatorCheckListFiltersPage().filterBy(userOption);
            await searchFiltersPage.fileTypeCheckListFiltersPage().filterBy('Plain Text');

            await expect(searchResultsPage.numberOfResultsDisplayed()).toBe(2);
            await searchResultsPage.checkContentIsDisplayed(txtFile.entry.name);
            await searchResultsPage.checkContentIsDisplayed(txtFileSite.entry.name);

            await searchFiltersPage.fileTypeCheckListFiltersPage().filterBy('JPEG Image');

            await expect(await searchResultsPage.numberOfResultsDisplayed()).toBe(4);
            await searchResultsPage.checkContentIsDisplayed(txtFile.entry.name);
            await searchResultsPage.checkContentIsDisplayed(txtFileSite.entry.name);
            await searchResultsPage.checkContentIsDisplayed(jpgFile.entry.name);
            await searchResultsPage.checkContentIsDisplayed(jpgFileSite.entry.name);
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

        beforeAll(async () => {
            await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

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

            txtFile = await uploadActions.uploadFile(txtFileInfo.location, txtFileInfo.name, site.entry.guid);

            await this.alfrescoJsApi.login(userUploadingImg.id, userUploadingImg.password);

            jpgFile = await uploadActions.uploadFile(jpgFileInfo.location, jpgFileInfo.name, site.entry.guid);

            await browser.sleep(15000);

            await loginPage.loginToContentServicesUsingUserModel(userUploadingImg);

            await searchDialog.checkSearchIconIsVisible();
            await searchDialog.clickOnSearchIcon();
            await searchDialog.enterTextAndPressEnter(`*${randomName}*`);

            await searchFiltersPage.checkSearchFiltersIsDisplayed();
            await searchFiltersPage.creatorCheckListFiltersPage().filterBy(`${userUploadingTxt.firstName} ${userUploadingTxt.lastName}`);
            await searchFiltersPage.creatorCheckListFiltersPage().filterBy(`${userUploadingImg.firstName} ${userUploadingImg.lastName}`);

            await searchResultsPage.checkContentIsDisplayed(txtFile.entry.name);
            await searchResultsPage.checkContentIsDisplayed(jpgFile.entry.name);

            await searchFiltersPage.fileTypeCheckListFiltersPage().filterBy('Plain Text');
            await searchFiltersPage.fileTypeCheckListFiltersPage().filterBy('JPEG Image');

            await expect(await searchResultsPage.numberOfResultsDisplayed()).toBe(2);
            await searchResultsPage.checkContentIsDisplayed(txtFile.entry.name);
            await searchResultsPage.checkContentIsDisplayed(jpgFile.entry.name);
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

        beforeAll(async () => {
            await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

            await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

            site = await this.alfrescoJsApi.core.sitesApi.createSite({
                title: StringUtil.generateRandomString(8),
                visibility: 'PUBLIC'
            });

            txtFile = await uploadActions.uploadFile(txtFileInfo.location, txtFileInfo.name, '-my-');
            await browser.sleep(15000);

            await loginPage.loginToContentServicesUsingUserModel(acsUser);

            await searchDialog.checkSearchIconIsVisible();
            await searchDialog.clickOnSearchIcon();
            await searchDialog.enterTextAndPressEnter(`*${randomName}*`);

            await searchFiltersPage.checkSearchFiltersIsDisplayed();

        });

        afterAll(async () => {
            await uploadActions.deleteFileOrFolder(txtFile.entry.id);
            await this.alfrescoJsApi.core.sitesApi;

        });

        it('[C280058] Should update filter facets items number when another filter facet item is selected', async () => {
            await loginPage.loginToContentServicesUsingUserModel(acsUser);

            await searchDialog.checkSearchIconIsVisible();
            await searchDialog.clickOnSearchIcon();
            await searchDialog.enterTextAndPressEnter(`*${randomName}*`);

            await searchFiltersPage.checkSearchFiltersIsDisplayed();
            await searchFiltersPage.fileTypeCheckListFiltersPage().filterBy('Plain Text');
            await searchFiltersPage.creatorCheckListFiltersPage().filterBy(`${acsUser.firstName} ${acsUser.lastName}`);

            await expect(await searchResultsPage.numberOfResultsDisplayed()).toBe(1);
            await searchResultsPage.checkContentIsDisplayed(txtFile.entry.name);
        });
    });
});
