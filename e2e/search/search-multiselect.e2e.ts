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

import { createApiService, LoginPage, StringUtil, UploadActions, UserModel, UsersActions } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { SearchBarPage } from './pages/search-bar.page';
import { SearchResultsPage } from './pages/search-results.page';
import { SearchFiltersPage } from './pages/search-filters.page';
import { FileModel } from '../models/ACS/file.model';
import { NavigationBarPage } from '../core/pages/navigation-bar.page';
import CONSTANTS = require('../util/constants');
import { SitesApi } from '@alfresco/js-api';

describe('Search Component - Multi-Select Facet', () => {
    const loginPage = new LoginPage();
    const searchBarPage = new SearchBarPage();
    const searchResultsPage = new SearchResultsPage();
    const searchFiltersPage = new SearchFiltersPage();
    const navigationBarPage = new NavigationBarPage();

    const apiService = createApiService();
    const uploadActions = new UploadActions(apiService);
    const usersActions = new UsersActions(apiService);

    const createSite = async (user: UserModel) => {
        await apiService.loginWithProfile('admin');
        await usersActions.createUser(user);
        await apiService.login(user.username, user.password);
        const sitesApi = new SitesApi(apiService.getInstance());
        site = await sitesApi.createSite({
            title: StringUtil.generateRandomString(8),
            visibility: 'PUBLIC'
        });
    };
    const randomName = StringUtil.generateRandomString();
    const txtFileInfo = new FileModel({
        location: browser.params.resources.Files.ADF_DOCUMENTS.TXT_0B.file_path,
        name: `${randomName}.txt`
    });

    let site; let userOption;

    describe('', () => {
        let jpgFile; let jpgFileSite; let txtFile; let txtFileSite;
        const acsUser = new UserModel();

        const jpgFileInfo = new FileModel({
            location: browser.params.resources.Files.ADF_DOCUMENTS.JPG.file_path,
            name: `${randomName}.jpg`
        });

        beforeAll(async () => {
            await createSite(acsUser);

            jpgFile = await uploadActions.uploadFile(jpgFileInfo.location, jpgFileInfo.name, '-my-');

            jpgFileSite = await uploadActions.uploadFile(jpgFileInfo.location, jpgFileInfo.name, site.entry.guid);

            txtFile = await uploadActions.uploadFile(txtFileInfo.location, txtFileInfo.name, '-my-');

            txtFileSite = await uploadActions.uploadFile(txtFileInfo.location, txtFileInfo.name, site.entry.guid);

            await browser.sleep(browser.params.testConfig.timeouts.index_search);

            await loginPage.login(acsUser.username, acsUser.password);

            await searchBarPage.checkSearchIconIsVisible();
            await searchBarPage.clickOnSearchIcon();
            await searchBarPage.enterTextAndPressEnter(`${randomName}`);
            await searchResultsPage.dataTable.waitTillContentLoaded();

            userOption = `${acsUser.firstName} ${acsUser.lastName}`;

            await searchFiltersPage.checkSearchFiltersIsDisplayed();
            await searchFiltersPage.creatorCheckListFiltersPage().filterBy(userOption);
        });

        afterAll(async () => {
            await apiService.loginWithProfile('admin');
            const sitesApi = new SitesApi(apiService.getInstance());
            await Promise.all([
                uploadActions.deleteFileOrFolder(jpgFile.entry.id),
                uploadActions.deleteFileOrFolder(jpgFileSite.entry.id),
                uploadActions.deleteFileOrFolder(txtFile.entry.id),
                uploadActions.deleteFileOrFolder(txtFileSite.entry.id)
            ]);

            await sitesApi.deleteSite(site.entry.id, { permanent: true });
            await navigationBarPage.clickLogoutButton();
        });

        it('[C280054] Should be able to select multiple items from a search facet filter', async () => {
            await searchBarPage.checkSearchIconIsVisible();
            await searchBarPage.clickOnSearchIcon();
            await searchBarPage.enterTextAndPressEnter(`${randomName}`);
            await searchResultsPage.dataTable.waitTillContentLoaded();

            userOption = `${acsUser.firstName} ${acsUser.lastName}`;

            await searchFiltersPage.checkSearchFiltersIsDisplayed();
            await searchFiltersPage.creatorCheckListFiltersPage().filterBy(userOption);
            await searchFiltersPage.fileTypeCheckListFiltersPage().filterBy('Plain Text');
            await searchResultsPage.dataTable.waitTillContentLoaded();

            await expect(searchResultsPage.numberOfResultsDisplayed()).toBe(2);
            await searchResultsPage.checkContentIsDisplayed(txtFile.entry.name);
            await searchResultsPage.checkContentIsDisplayed(txtFileSite.entry.name);

            await searchFiltersPage.fileTypeCheckListFiltersPage().filterBy('JPEG Image');
            await searchResultsPage.dataTable.waitTillContentLoaded();

            await expect(await searchResultsPage.numberOfResultsDisplayed()).toBe(4);
            await searchResultsPage.checkContentIsDisplayed(txtFile.entry.name);
            await searchResultsPage.checkContentIsDisplayed(txtFileSite.entry.name);
            await searchResultsPage.checkContentIsDisplayed(jpgFile.entry.name);
            await searchResultsPage.checkContentIsDisplayed(jpgFileSite.entry.name);
        });
    });

    describe('', () => {
        let jpgFile; let txtFile;
        const userUploadingTxt = new UserModel();
        const userUploadingImg = new UserModel();

        const jpgFileInfo = new FileModel({
            location: browser.params.resources.Files.ADF_DOCUMENTS.JPG.file_path,
            name: `${randomName}.jpg`
        });

        beforeAll(async () => {
            await apiService.loginWithProfile('admin');

            await usersActions.createUser(userUploadingTxt);
            await usersActions.createUser(userUploadingImg);

            await apiService.login(userUploadingTxt.username, userUploadingTxt.password);

            const sitesApi = new SitesApi(apiService.getInstance());

            site = await sitesApi.createSite({
                title: StringUtil.generateRandomString(8),
                visibility: 'PUBLIC'
            });

            await sitesApi.createSiteMembership(site.entry.id, {
                id: userUploadingImg.username,
                role: CONSTANTS.CS_USER_ROLES.MANAGER
            });

            txtFile = await uploadActions.uploadFile(txtFileInfo.location, txtFileInfo.name, site.entry.guid);

            await apiService.login(userUploadingImg.username, userUploadingImg.password);

            jpgFile = await uploadActions.uploadFile(jpgFileInfo.location, jpgFileInfo.name, site.entry.guid);

            await browser.sleep(browser.params.testConfig.timeouts.index_search);

            await loginPage.login(userUploadingImg.username, userUploadingImg.password);

            await searchBarPage.checkSearchIconIsVisible();
            await searchBarPage.clickOnSearchIcon();
            await searchBarPage.enterTextAndPressEnter(`*${randomName}*`);
            await searchResultsPage.dataTable.waitTillContentLoaded();

            await searchFiltersPage.checkSearchFiltersIsDisplayed();
            await searchFiltersPage.creatorCheckListFiltersPage().filterBy(`${userUploadingTxt.firstName} ${userUploadingTxt.lastName}`);
            await searchFiltersPage.creatorCheckListFiltersPage().filterBy(`${userUploadingImg.firstName} ${userUploadingImg.lastName}`);
            await searchResultsPage.dataTable.waitTillContentLoaded();

            await searchResultsPage.checkContentIsDisplayed(txtFile.entry.name);
            await searchResultsPage.checkContentIsDisplayed(jpgFile.entry.name);

            await searchFiltersPage.fileTypeCheckListFiltersPage().filterBy('Plain Text');
            await searchFiltersPage.fileTypeCheckListFiltersPage().filterBy('JPEG Image');
            await searchResultsPage.dataTable.waitTillContentLoaded();

            await expect(await searchResultsPage.numberOfResultsDisplayed()).toBe(2);
            await searchResultsPage.checkContentIsDisplayed(txtFile.entry.name);
            await searchResultsPage.checkContentIsDisplayed(jpgFile.entry.name);
        });
    });

    describe('', () => {
        let txtFile;
        const acsUser = new UserModel();

        beforeAll(async () => {
            await createSite(acsUser);

            txtFile = await uploadActions.uploadFile(txtFileInfo.location, txtFileInfo.name, '-my-');
            await browser.sleep(browser.params.testConfig.timeouts.index_search);

            await loginPage.login(acsUser.username, acsUser.password);

            await searchBarPage.checkSearchIconIsVisible();
            await searchBarPage.clickOnSearchIcon();
            await searchBarPage.enterTextAndPressEnter(`*${randomName}*`);
            await searchResultsPage.dataTable.waitTillContentLoaded();

            await searchFiltersPage.checkSearchFiltersIsDisplayed();
        });

        afterAll(async () => {
            await apiService.loginWithProfile('admin');
            await uploadActions.deleteFileOrFolder(txtFile.entry.id);
            const sitesApi = new SitesApi(apiService.getInstance());
            await sitesApi.deleteSite(site.entry.id, { permanent: true });
        });

        it('[C280058] Should update filter facets items number when another filter facet item is selected', async () => {
            await searchBarPage.checkSearchIconIsVisible();
            await searchBarPage.clickOnSearchIcon();
            await searchBarPage.enterTextAndPressEnter(`*${randomName}*`);
            await searchResultsPage.dataTable.waitTillContentLoaded();

            await searchFiltersPage.checkSearchFiltersIsDisplayed();
            await searchFiltersPage.fileTypeCheckListFiltersPage().filterBy('Plain Text');
            await searchFiltersPage.creatorCheckListFiltersPage().filterBy(`${acsUser.firstName} ${acsUser.lastName}`);
            await searchResultsPage.dataTable.waitTillContentLoaded();

            await expect(await searchResultsPage.numberOfResultsDisplayed()).toBe(1);
            await searchResultsPage.checkContentIsDisplayed(txtFile.entry.name);
        });
    });
});
