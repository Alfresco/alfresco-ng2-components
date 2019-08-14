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

import { browser } from 'protractor';

import { LoginPage, UploadActions, StringUtil } from '@alfresco/adf-testing';

import { SearchDialog } from '../pages/adf/dialog/searchDialog';
import { ContentServicesPage } from '../pages/adf/contentServicesPage';
import { SearchResultsPage } from '../pages/adf/searchResultsPage';
import { AcsUserModel } from '../models/ACS/acsUserModel';
import { FolderModel } from '../models/ACS/folderModel';
import { FileModel } from '../models/ACS/fileModel';
import { Util } from '../util/util';
import resources = require('../util/resources');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';

describe('Search component - Search Page', () => {
    const search = {
        active: {
            firstFile: null,
            secondFile: null,
            base: StringUtil.generateRandomString(7),
            extension: '.txt'
        },
        no_permission: {
            noPermFile: 'Meetings',
            noPermFolder: 'Meeting Notes'
        }
    };

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const searchDialog = new SearchDialog();
    const searchResultPage = new SearchResultsPage();
    const navigationBarPage = new NavigationBarPage();

    const acsUser = new AcsUserModel();
    const emptyFolderModel = new FolderModel({ 'name': 'search' + StringUtil.generateRandomString() });
    let firstFileModel;
    const newFolderModel = new FolderModel({ 'name': 'newFolder' });
    let fileNames = [];
    const nrOfFiles = 15;
    const adminNrOfFiles = 5;
    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);

    beforeAll(async () => {
        fileNames = Util.generateSequenceFiles(1, nrOfFiles, search.active.base, search.active.extension);
        const adminFileNames = Util.generateSequenceFiles(nrOfFiles + 1, nrOfFiles + adminNrOfFiles, search.active.base, search.active.extension);
        search.active.firstFile = fileNames[0];
        search.active.secondFile = fileNames[1];
        fileNames.splice(0, 1);

        firstFileModel = new FileModel({
            'name': search.active.firstFile,
            'location': resources.Files.ADF_DOCUMENTS.TXT.file_location
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        await uploadActions.createFolder(emptyFolderModel.name, '-my-');
        const newFolderModelUploaded = await uploadActions.createFolder(newFolderModel.name, '-my-');

        await uploadActions.createEmptyFiles(fileNames, newFolderModelUploaded.entry.id);

        await uploadActions.uploadFile(firstFileModel.location, firstFileModel.name, '-my-');

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await uploadActions.createEmptyFiles(adminFileNames, newFolderModelUploaded.entry.id);

        await browser.sleep(15000);

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    it('[C260264] Should display message when no results are found', async() => {
        const notExistentFileName = StringUtil.generateRandomString();
        await searchDialog.checkSearchBarIsNotVisible();
        await searchDialog.checkSearchIconIsVisible();
        await searchDialog.clickOnSearchIcon();
        await searchDialog.enterTextAndPressEnter(notExistentFileName);
        await searchResultPage.checkNoResultMessageIsDisplayed();
    });

    it('[C272810] Should display only files corresponding to search', async () => {
        await searchDialog.clickOnSearchIcon();
        await searchDialog.enterTextAndPressEnter(search.active.firstFile);

        await searchResultPage.checkContentIsDisplayed(search.active.firstFile);
        await expect(await searchResultPage.numberOfResultsDisplayed()).toBe(1);
    });

    it('[C260267] Should display content when opening a folder from search results', async () => {
        await searchDialog.clickOnSearchIcon();
        await searchDialog.enterTextAndPressEnter(emptyFolderModel.name);

        await searchResultPage.checkNoResultMessageIsNotDisplayed();
        await searchResultPage.checkContentIsDisplayed(emptyFolderModel.name);
        await searchResultPage.navigateToFolder(emptyFolderModel.name);
        const result = await contentServicesPage.currentFolderName();
        await expect(result).toEqual(emptyFolderModel.name);
    });

    it('[C260261] Should be able to delete a file from search results', async () => {
        await searchDialog.clickOnSearchIcon();
        await searchDialog.enterTextAndPressEnter(search.active.firstFile);

        await searchResultPage.checkContentIsDisplayed(search.active.firstFile);

        await searchResultPage.deleteContent(search.active.firstFile);

        await searchResultPage.checkNoResultMessageIsDisplayed();
        await searchResultPage.checkContentIsNotDisplayed(search.active.firstFile);

        await searchDialog.checkSearchBarIsNotVisible();
        await searchDialog.checkSearchIconIsVisible();
        await searchDialog.clickOnSearchIcon();
        await searchDialog.enterTextAndPressEnter(search.active.firstFile);
        await searchResultPage.checkNoResultMessageIsDisplayed();
    });

    it('[C272809] Should be able to delete a folder from search results', async () => {
        await searchDialog.clickOnSearchIcon();
        await searchDialog.enterTextAndPressEnter(emptyFolderModel.name);

        await searchResultPage.checkContentIsDisplayed(emptyFolderModel.name);
        await searchResultPage.checkNoResultMessageIsNotDisplayed();
        await searchResultPage.checkContentIsDisplayed(emptyFolderModel.name);
        await searchResultPage.deleteContent(emptyFolderModel.name);
        await searchResultPage.checkNoResultMessageIsDisplayed();

        await searchDialog.checkSearchBarIsNotVisible();
        await searchDialog.checkSearchIconIsVisible();
        await searchDialog.clickOnSearchIcon();
        await searchDialog.enterTextAndPressEnter(emptyFolderModel.name);
        await searchResultPage.checkNoResultMessageIsDisplayed();
    });

    it('[C286675] Should display results when searching for all elements', async () => {
        await searchDialog.clickOnSearchIcon();
        await searchDialog.enterTextAndPressEnter('*');

        await searchResultPage.checkNoResultMessageIsNotDisplayed();
    });
});
