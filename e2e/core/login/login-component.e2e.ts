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

import {
    ApiService,
    BrowserActions,
    ErrorPage,
    LocalStorageUtil,
    UserInfoPage,
    UserModel,
    UsersActions
} from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { ContentServicesPage } from '../../core/pages/content-services.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { ProcessServicesPage } from '../../process-services/pages/process-services.page';
import { LoginShellPage } from '../../core/pages/login-shell.page';

describe('Login component', () => {

    const processServicesPage = new ProcessServicesPage();
    const navigationBarPage = new NavigationBarPage();
    const userInfoPage = new UserInfoPage();
    const contentServicesPage = new ContentServicesPage();
    const loginPage = new LoginShellPage();
    const errorPage = new ErrorPage();

    const userA = new UserModel();
    const userB = new UserModel();

    const apiService = new ApiService();
    const usersActions = new UsersActions(apiService);

    beforeAll(async () => {
        await LocalStorageUtil.setStorageItem('authType', 'BASIC');

        await apiService.loginWithProfile('admin');

        await usersActions.createUser(userA);
        await usersActions.createUser(userB);
   });

    afterEach(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    it('[C276746] Should display the right information in user-info when a different users logs in', async () => {
        await LocalStorageUtil.setStorageItem('providers', 'ECM');

        await loginPage.login(userA.email, userA.password);
        await userInfoPage.clickUserProfile();
        await expect(await userInfoPage.getContentHeaderTitle()).toEqual(userA.firstName + ' ' + userA.lastName);
        await expect(await userInfoPage.getContentEmail()).toEqual(userA.email);

        await navigationBarPage.clickLogoutButton();

        await loginPage.login(userB.email, userB.password);
        await userInfoPage.clickUserProfile();
        await expect(await userInfoPage.getContentHeaderTitle()).toEqual(userB.firstName + ' ' + userB.lastName);
        await expect(await userInfoPage.getContentEmail()).toEqual(userB.email);
    });

    it('[C299206] Should redirect the user without the right access role on a forbidden page', async () => {
        await loginPage.login(userA.email, userA.password);
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await expect(await errorPage.getErrorCode()).toBe('403');
        await expect(await errorPage.getErrorTitle()).toBe('You don\'t have permission to access this server.');
        await expect(await errorPage.getErrorDescription()).toBe('You\'re not allowed access to this resource on the server.');
    });

    it('[C260049] Should be possible to login to Process Services with Content Services disabled', async () => {
        await LocalStorageUtil.setStorageItem('providers', 'BPM');

        await loginPage.goToLoginPage();
        await expect(await loginPage.getSignInButtonIsEnabled()).toBe(false);
        await loginPage.loginWithProfile('admin');
        await navigationBarPage.navigateToProcessServicesPage();
        await processServicesPage.checkApsContainer();
        await navigationBarPage.navigateToContentServices();
        await loginPage.waitForElements();
    });

    it('[C260050] Should be possible to login to Content Services with Process Services disabled', async () => {
        await LocalStorageUtil.setStorageItem('providers', 'ECM');

        await loginPage.goToLoginPage();
        await expect(await loginPage.getSignInButtonIsEnabled()).toBe(false);
        await loginPage.loginWithProfile('admin');
        await navigationBarPage.navigateToContentServices();
        await contentServicesPage.checkAcsContainer();
    });

    it('[C260051] Should be able to login to both Content Services and Process Services', async () => {
        await LocalStorageUtil.setStorageItem('providers', 'ALL');

        await loginPage.goToLoginPage();
        await expect(await loginPage.getSignInButtonIsEnabled()).toBe(false);
        await loginPage.loginWithProfile('admin');
        await navigationBarPage.navigateToProcessServicesPage();
        await processServicesPage.checkApsContainer();
        await navigationBarPage.navigateToContentServices();
        await contentServicesPage.checkAcsContainer();
        await navigationBarPage.clickLoginButton();
        await loginPage.waitForElements();
    });

    it('[C277754] Should the user be redirect to the login page when the Content Service session expire', async () => {
        await LocalStorageUtil.setStorageItem('providers', 'ECM');

        await loginPage.goToLoginPage();
        await loginPage.loginWithProfile('admin');
        await browser.executeScript('window.localStorage.removeItem("ADF_ticket-ECM");');
        await BrowserActions.getUrl(browser.baseUrl + '/files');
        await loginPage.waitForElements();

        await LocalStorageUtil.setStorageItem('providers', 'ALL');
    });

    it('[C279931] Should the user be redirect to the login page when the Process Service session expire', async () => {
        await loginPage.goToLoginPage();
        await loginPage.loginWithProfile('admin');
        await browser.executeScript('window.localStorage.removeItem("ADF_ticket-BPM");');
        await BrowserActions.getUrl(browser.baseUrl + '/activiti');
        await loginPage.waitForElements();
    });

    it('[C279930] Should a user still be logged-in when open a new tab', async () => {
        await loginPage.goToLoginPage();
        await loginPage.loginWithProfile('admin');

        await browser.executeScript("window.open('about: blank', '_blank');");

        const handles = await browser.getAllWindowHandles();
        await browser.switchTo().window(handles[1]);
        await BrowserActions.getUrl(browser.baseUrl + '/activiti');
        await processServicesPage.checkApsContainer();
        await BrowserActions.getUrl(browser.baseUrl + '/files');
        await contentServicesPage.checkAcsContainer();
    });
});
