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

import { browser } from 'protractor';

import { LoginPage } from '../../pages/adf/loginPage';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { ProcessServicesPage } from '../../pages/adf/process_services/processServicesPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

import TestConfig = require('../../test.config');
import { AcsUserModel } from '../../models/ACS/acsUserModel';

import { SettingsPage } from '../../pages/adf/settingsPage';

import AlfrescoApi = require('alfresco-js-api-node');

import { Util } from '../../util/util';
import { UploadActions } from '../../actions/ACS/upload.actions';

describe('Login component - Redirect', () => {

    let settingsPage = new SettingsPage();
    let processServicesPage = new ProcessServicesPage();
    let navigationBarPage = new NavigationBarPage();
    let contentServicesPage = new ContentServicesPage();
    let loginPage = new LoginPage();
    let user = new AcsUserModel();
    let userFolderOwner = new AcsUserModel();
    let adminUserModel = new AcsUserModel({
        'id': TestConfig.adf.adminUser,
        'password': TestConfig.adf.adminPassword
    });
    let uploadedFolder;
    let uploadActions = new UploadActions();

    beforeAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url,
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(user);
        await this.alfrescoJsApi.core.peopleApi.addPerson(userFolderOwner);

        await this.alfrescoJsApi.login(user.id, user.password);

        uploadedFolder = await uploadActions.createFolder(this.alfrescoJsApi, 'protecteFolder' + Util.generateRandomString(), '-my-');

        done();
    });

    it('[C213838] Should after login in CS be redirect to Login page when try to access to PS', () => {
        settingsPage.setProviderEcm();
        loginPage.login(user.id, user.password);

        navigationBarPage.clickContentServicesButton();
        contentServicesPage.checkAcsContainer();

        navigationBarPage.navigateToProcessServicesPage();

        loginPage.waitForElements();
    });

    it('[C260085] Should after login in PS be redirect to Login page when try to access to CS', () => {
        settingsPage.setProviderBpm();

        loginPage.enableSuccessRouteSwitch();
        loginPage.enterSuccessRoute('activiti');

        loginPage.login(adminUserModel.id, adminUserModel.password);

        navigationBarPage.navigateToProcessServicesPage();
        processServicesPage.checkApsContainer();

        navigationBarPage.clickContentServicesButton();

        loginPage.waitForElements();
    });

    it('[C260081] Should after login in BOTH not be redirect to Login page when try to access to CS or PS', () => {
        settingsPage.setProviderEcmBpm();

        loginPage.login(adminUserModel.id, adminUserModel.password);

        navigationBarPage.navigateToProcessServicesPage();
        processServicesPage.checkApsContainer();

        navigationBarPage.clickContentServicesButton();
        contentServicesPage.checkAcsContainer();
    });

    it('[C260088] Should be re-redirect to the request URL after login when try to access to a protect URL ', () => {
        settingsPage.setProviderEcm();
        loginPage.login(user.id, user.password);

        browser.controlFlow().execute(async () => {

            navigationBarPage.openContentServicesFolder(uploadedFolder.entry.id);

            browser.getCurrentUrl().then((actualUrl) => {
                expect(actualUrl).toEqual(TestConfig.adf.url + '/files/' + uploadedFolder.entry.id);
            });

            browser.driver.sleep(1000);

            navigationBarPage.clickLogoutButton();

            browser.driver.sleep(1000);

            navigationBarPage.openContentServicesFolder(uploadedFolder.entry.id);

            loginPage.waitForElements();
            loginPage.enterUsername(user.id);
            loginPage.enterPassword(user.password);
            loginPage.clickSignInButton();

            browser.driver.sleep(1000);

            browser.getCurrentUrl().then((actualUrl) => {
                expect(actualUrl).toEqual(TestConfig.adf.url + '/files/' + uploadedFolder.entry.id);
            });
        });

    });
});
