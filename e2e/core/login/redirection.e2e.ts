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

import { SettingsPage, UploadActions, StringUtil, ApiService, LocalStorageUtil, getTestConfig } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/content-services.page';
import { ProcessServicesPage } from '../../pages/adf/process-services/process-services.page';
import { NavigationBarPage } from '../../pages/adf/navigation-bar.page';
import { LogoutPage } from '../../pages/adf/demo-shell/logout.page';
import { LoginPage } from '../../pages/adf/demo-shell/login.page';
import { UsersActions } from '../../actions/users.actions';

describe('Login component - Redirect', () => {

    const settingsPage = new SettingsPage();
    const processServicesPage = new ProcessServicesPage();
    const navigationBarPage = new NavigationBarPage();
    const contentServicesPage = new ContentServicesPage();
    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const testConfig = getTestConfig();

    let user;
    let uploadedFolder;

    const apiService = new ApiService();
    const uploadActions = new UploadActions(apiService);
    const usersActions = new UsersActions(apiService);

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');
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

        await apiService.loginWithProfile('admin');

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

        await apiService.loginWithProfile('admin');

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
        await expect(actualUrl).toEqual(testConfig.adf.url + '/files/' + uploadedFolder.entry.id);

        await contentServicesPage.waitForTableBody();

        await navigationBarPage.clickLogoutButton();

        await logoutPage.checkLogoutSectionIsDisplayed();

        await navigationBarPage.openContentServicesFolder(uploadedFolder.entry.id);

        await loginPage.waitForElements();

        await loginPage.login(user.email, user.password);

        actualUrl = await browser.getCurrentUrl();
        await expect(actualUrl).toEqual(testConfig.adf.url + '/files/' + uploadedFolder.entry.id);
    });

    it('[C299161] Should redirect user to requested URL after reloading login page', async () => {
        await loginPage.goToLoginPage();
        await loginPage.clickSettingsIcon();
        await settingsPage.setProviderEcm();
        await loginPage.login(user.email, user.password);

        await navigationBarPage.openContentServicesFolder(uploadedFolder.entry.id);

        const currentUrl = await browser.getCurrentUrl();
        await expect(currentUrl).toEqual(testConfig.adf.url + '/files/' + uploadedFolder.entry.id);

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
        await expect(actualUrl).toEqual(testConfig.adf.url + '/files/' + uploadedFolder.entry.id);
    });
});
