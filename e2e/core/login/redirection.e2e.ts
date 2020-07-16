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

import {
    ApiService,
    LocalStorageUtil,
    SettingsPage,
    StringUtil,
    UploadActions,
    UsersActions
} from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../core/pages/content-services.page';
import { ProcessServicesPage } from '../../process-services/pages/process-services.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { LogoutPage } from '../../core/pages/logout.page';
import { LoginShellPage } from '../../core/pages/login-shell.page';

describe('Login component - Redirect', () => {

    const settingsPage = new SettingsPage();
    const processServicesPage = new ProcessServicesPage();
    const navigationBarPage = new NavigationBarPage();
    const contentServicesPage = new ContentServicesPage();
    const loginPage = new LoginShellPage();
    const logoutPage = new LogoutPage();

    let user;
    let uploadedFolder;

    const apiService = new ApiService();
    const uploadActions = new UploadActions(apiService);
    const usersActions = new UsersActions(apiService);

    beforeAll(async () => {
        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

        user = await usersActions.createUser();
        await apiService.getInstance().login(user.email, user.password);

        uploadedFolder = await uploadActions.createFolder('protecteFolder' + StringUtil.generateRandomString(), '-my-');
    });

    it('[C213838] Should after login in CS be redirect to Login page when try to access to PS', async () => {
        await LocalStorageUtil.setStorageItem('providers', 'ECM');

        await loginPage.goToLoginPage();
        await loginPage.clickSettingsIcon();
        await settingsPage.setProviderEcm();
        await loginPage.login(user.email, user.password);

        await navigationBarPage.clickContentServicesButton();
        await contentServicesPage.checkAcsContainer();

        await navigationBarPage.navigateToProcessServicesPage();

        await loginPage.waitForElements();
    });

    it('[C260085] Should after login in PS be redirect to Login page when try to access to CS', async () => {
        await LocalStorageUtil.setStorageItem('providers', 'BPM');

        await loginPage.goToLoginPage();
        await loginPage.clickSettingsIcon();
        await settingsPage.setProviderBpm();

        await loginPage.enableSuccessRouteSwitch();
        await loginPage.enterSuccessRoute('activiti');

        await loginPage.login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

        await navigationBarPage.navigateToProcessServicesPage();
        await processServicesPage.checkApsContainer();

        await navigationBarPage.clickContentServicesButton();

        await loginPage.waitForElements();
    });

    it('[C260081] Should after login in BOTH not be redirect to Login page when try to access to CS or PS', async () => {
        await LocalStorageUtil.setStorageItem('providers', 'ALL');

        await loginPage.goToLoginPage();
        await loginPage.clickSettingsIcon();

        await settingsPage.setProviderEcmBpm();

        await loginPage.login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

        await navigationBarPage.navigateToProcessServicesPage();
        await processServicesPage.checkApsContainer();

        await navigationBarPage.clickContentServicesButton();
        await contentServicesPage.checkAcsContainer();
    });

    it('[C260088] Should be re-redirect to the request URL after login when try to access to a protect URL ', async () => {
        await loginPage.goToLoginPage();
        await loginPage.clickSettingsIcon();
        await settingsPage.setProviderEcm();
        await loginPage.login(user.email, user.password);

        await navigationBarPage.openContentServicesFolder(uploadedFolder.entry.id);

        let actualUrl = await browser.getCurrentUrl();
        await expect(actualUrl).toEqual(browser.baseUrl + '/files/' + uploadedFolder.entry.id);

        await contentServicesPage.waitForTableBody();

        await navigationBarPage.clickLogoutButton();

        await logoutPage.checkLogoutSectionIsDisplayed();

        await navigationBarPage.openContentServicesFolder(uploadedFolder.entry.id);

        await loginPage.waitForElements();

        await loginPage.login(user.email, user.password);

        actualUrl = await browser.getCurrentUrl();
        await expect(actualUrl).toEqual(browser.baseUrl + '/files/' + uploadedFolder.entry.id);
    });

    it('[C299161] Should redirect user to requested URL after reloading login page', async () => {
        await loginPage.goToLoginPage();
        await loginPage.clickSettingsIcon();
        await settingsPage.setProviderEcm();
        await loginPage.login(user.email, user.password);

        await navigationBarPage.openContentServicesFolder(uploadedFolder.entry.id);

        const currentUrl = await browser.getCurrentUrl();
        await expect(currentUrl).toEqual(browser.baseUrl + '/files/' + uploadedFolder.entry.id);

        await contentServicesPage.waitForTableBody();

        await navigationBarPage.clickLogoutButton();

        await logoutPage.checkLogoutSectionIsDisplayed();

        await navigationBarPage.openContentServicesFolder(uploadedFolder.entry.id);
        await loginPage.waitForElements();
        await browser.refresh();
        await loginPage.waitForElements();

        await loginPage.enterUsername(user.email);
        await loginPage.enterPassword(user.password);
        await loginPage.clickSignInButton();

        await navigationBarPage.checkMenuButtonIsDisplayed();

        const actualUrl = await browser.getCurrentUrl();
        await expect(actualUrl).toEqual(browser.baseUrl + '/files/' + uploadedFolder.entry.id);
    });
});
