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

import { LoginPage, SettingsPage, UploadActions, StringUtil } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { ProcessServicesPage } from '../../pages/adf/process-services/processServicesPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { LogoutPage } from '../../pages/adf/demo-shell/logoutPage';

describe('Login component - Redirect', () => {

    const settingsPage = new SettingsPage();
    const processServicesPage = new ProcessServicesPage();
    const navigationBarPage = new NavigationBarPage();
    const contentServicesPage = new ContentServicesPage();
    const loginPage = new LoginPage();
    const user = new AcsUserModel();
    const userFolderOwner = new AcsUserModel();
    const adminUserModel = new AcsUserModel({
        'id': browser.params.testConfig.adf.adminUser,
        'password': browser.params.testConfig.adf.adminPassword
    });
    let uploadedFolder;

    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host,
        hostBpm: browser.params.testConfig.adf_aps.host
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);
    const logoutPage = new LogoutPage();

    beforeAll(async () => {

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(user);
        await this.alfrescoJsApi.core.peopleApi.addPerson(userFolderOwner);

        await this.alfrescoJsApi.login(user.id, user.password);

        uploadedFolder = await uploadActions.createFolder('protecteFolder' + StringUtil.generateRandomString(), '-my-');

    });

    it('[C213838] Should after login in CS be redirect to Login page when try to access to PS', async () => {
        await loginPage.goToLoginPage();
        await loginPage.clickSettingsIcon();
        await settingsPage.setProviderEcm();
        await loginPage.login(user.id, user.password);

        await navigationBarPage.clickContentServicesButton();
        await contentServicesPage.checkAcsContainer();

        await navigationBarPage.navigateToProcessServicesPage();

        await loginPage.waitForElements();
    });

    it('[C260085] Should after login in PS be redirect to Login page when try to access to CS', async () => {
        await loginPage.goToLoginPage();
        await loginPage.clickSettingsIcon();
        await settingsPage.setProviderBpm();

        await loginPage.enableSuccessRouteSwitch();
        await loginPage.enterSuccessRoute('activiti');

        await loginPage.login(adminUserModel.id, adminUserModel.password);

        await navigationBarPage.navigateToProcessServicesPage();
        await processServicesPage.checkApsContainer();

        await navigationBarPage.clickContentServicesButton();

        await loginPage.waitForElements();
    });

    it('[C260081] Should after login in BOTH not be redirect to Login page when try to access to CS or PS', async () => {
        await loginPage.goToLoginPage();
        await loginPage.clickSettingsIcon();

        await settingsPage.setProviderEcmBpm();

        await loginPage.login(adminUserModel.id, adminUserModel.password);

        await navigationBarPage.navigateToProcessServicesPage();
        await processServicesPage.checkApsContainer();

        await navigationBarPage.clickContentServicesButton();
        await contentServicesPage.checkAcsContainer();
    });

    it('[C260088] Should be re-redirect to the request URL after login when try to access to a protect URL ', async () => {
        await loginPage.goToLoginPage();
        await loginPage.clickSettingsIcon();
        await settingsPage.setProviderEcm();
        await loginPage.login(user.id, user.password);

        await navigationBarPage.openContentServicesFolder(uploadedFolder.entry.id);

        let actualUrl = await browser.getCurrentUrl();
        await expect(actualUrl).toEqual(browser.params.testConfig.adf.url + '/files/' + uploadedFolder.entry.id);

        await contentServicesPage.waitForTableBody();

        await navigationBarPage.clickLogoutButton();

        await logoutPage.checkLogoutSectionIsDisplayed();

        await navigationBarPage.openContentServicesFolder(uploadedFolder.entry.id);

        await loginPage.waitForElements();

        await loginPage.login(user.id, user.password);

        actualUrl = await browser.getCurrentUrl();
        await expect(actualUrl).toEqual(browser.params.testConfig.adf.url + '/files/' + uploadedFolder.entry.id);
    });

    it('[C299161] Should redirect user to requested URL after reloading login page', async () => {
        await loginPage.goToLoginPage();
        await loginPage.clickSettingsIcon();
        await settingsPage.setProviderEcm();
        await loginPage.login(user.id, user.password);

        await navigationBarPage.openContentServicesFolder(uploadedFolder.entry.id);

        const currentUrl = await browser.getCurrentUrl();
        await expect(currentUrl).toEqual(browser.params.testConfig.adf.url + '/files/' + uploadedFolder.entry.id);

        await contentServicesPage.waitForTableBody();

        await navigationBarPage.clickLogoutButton();

        await logoutPage.checkLogoutSectionIsDisplayed();

        await navigationBarPage.openContentServicesFolder(uploadedFolder.entry.id);
        await loginPage.waitForElements();
        await browser.refresh();
        await loginPage.waitForElements();

        await loginPage.enterUsername(user.id);
        await loginPage.enterPassword(user.password);
        await loginPage.clickSignInButton();

        await navigationBarPage.checkMenuButtonIsDisplayed();

        const actualUrl = await browser.getCurrentUrl();
        await expect(actualUrl).toEqual(browser.params.testConfig.adf.url + '/files/' + uploadedFolder.entry.id);
    });
});
