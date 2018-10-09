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

import { LoginPage } from '../../pages/adf/loginPage';
import SearchDialog = require('../../pages/adf/dialog/searchDialog');
import SearchFiltersPage = require('../../pages/adf/searchFiltersPage');

import AcsUserModel = require('../../models/ACS/acsUserModel');
import FileModel = require('../../models/ACS/fileModel');

import TestConfig = require('../../test.config');
import Util = require('../../util/util');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../../actions/ACS/upload.actions';
import { browser } from 'protractor';

describe('Search Filters', () => {

    let loginPage = new LoginPage();
    let searchDialog = new SearchDialog();
    let searchFiltersPage = new SearchFiltersPage();
    let uploadActions = new UploadActions();

    let acsUser = new AcsUserModel();

    let filename = Util.generateRandomString(16);

    let fileModel = new FileModel({
        'name': filename, 'shortName': filename.substring(0, 8)
    });
    let fileUploaded;

    beforeAll(async (done) => {

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        fileUploaded = await uploadActions.uploadFile(this.alfrescoJsApi, fileModel.location, fileModel.name, '-my-');

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        await browser.driver.sleep(30000); // wait search index previous file/folder uploaded

        searchDialog.checkSearchIconIsVisible();
        searchDialog.clickOnSearchIcon();
        searchDialog.enterTextAndPressEnter(fileUploaded.entry.name);

        searchFiltersPage.checkSearchFiltersIsDisplayed();

        done();
    });

    afterAll(async (done) => {
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, fileUploaded.entry.id);

        done();
    });

    it('[C286298] Should be able to cancel a filter using "x" button from the toolbar', () => {
        searchFiltersPage.filterByCreator(acsUser.firstName, acsUser.lastName);
        searchFiltersPage.checkCreatorChipIsDisplayed(acsUser.firstName, acsUser.lastName);
        searchFiltersPage.removeCreatorFilter(acsUser.firstName, acsUser.lastName);
        searchFiltersPage.checkCreatorChipIsNotDisplayed(acsUser.firstName, acsUser.lastName);
    });

    it('[C277146] Show more/less buttons are hidden when inactive', () => {
        browser.get(TestConfig.adf.url + '/search;q=*');

        searchFiltersPage.checkShowLessButtonIsNotDisplayed();
        searchFiltersPage.checkSizeShowMoreButtonIsDisplayed();

        searchFiltersPage.clickSizeShowMoreButtonUntilIsNotDisplayed();
        searchFiltersPage.checkShowLessButtonIsDisplayed();

        searchFiltersPage.clickSizeShowLessButtonUntilIsNotDisplayed();
    });

});
