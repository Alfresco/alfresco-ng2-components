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

    const errorMessages = {
        username: 'Your username needs to be at least 2 characters.',
        invalid_credentials: 'You\'ve entered an unknown username or password',
        password: 'Enter your password to sign in',
        required: 'Required'
    };

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

    it('[C260036] Should require username', async () => {
        await loginPage.goToLoginPage();
        await loginPage.checkUsernameInactive();
        await expect(await loginPage.getSignInButtonIsEnabled()).toBe(false);
        await loginPage.enterUsername('A');
        await expect(await loginPage.getUsernameTooltip()).toEqual(errorMessages.username);
        await loginPage.clearUsername();
        await expect(await loginPage.getUsernameTooltip()).toEqual(errorMessages.required);
        await loginPage.checkUsernameHighlighted();
        await expect(await loginPage.getSignInButtonIsEnabled()).toBe(false);
    });

    it('[C260043] Should require password', async () => {
        await loginPage.goToLoginPage();
        await loginPage.checkPasswordInactive();
        await loginPage.checkUsernameInactive();
        await loginPage.enterPassword('A');
        await loginPage.checkPasswordTooltipIsNotVisible();
        await loginPage.clearPassword();
        await expect(await loginPage.getPasswordTooltip()).toEqual(errorMessages.password);
        await loginPage.checkPasswordHighlighted();
        await expect(await loginPage.getSignInButtonIsEnabled()).toBe(false);
    });

    it('[C260044] Username should be at least 2 characters long', async () => {
        await loginPage.goToLoginPage();
        await expect(await loginPage.getSignInButtonIsEnabled()).toBe(false);
        await loginPage.enterUsername('A');
        await expect(await loginPage.getUsernameTooltip()).toEqual(errorMessages.username);
        await loginPage.enterUsername('AB');
        await loginPage.checkUsernameTooltipIsNotVisible();
        await expect(await loginPage.getSignInButtonIsEnabled()).toBe(false);
        await loginPage.clearUsername();
    });

    it('[C260045] Should enable login button after entering a valid username and a password', async () => {
        await loginPage.goToLoginPage();
        await loginPage.enterUsername(browser.params.testConfig.users.admin.username);
        await expect(await loginPage.getSignInButtonIsEnabled()).toBe(false);
        await loginPage.enterPassword('a');
        await expect(await loginPage.getSignInButtonIsEnabled()).toBe(true);
        await loginPage.clearUsername();
        await loginPage.clearPassword();
    });

    it('[C260047] Password should be crypted', async () => {
        await loginPage.goToLoginPage();
        await expect(await loginPage.getSignInButtonIsEnabled()).toBe(false);
        await loginPage.enterPassword('test');
        await loginPage.showPassword();
        const tooltip = await loginPage.getShownPassword();
        await expect(tooltip).toEqual('test');
        await loginPage.hidePassword();
        await loginPage.checkPasswordIsHidden();
        await loginPage.clearPassword();
    });

    it('[C260048] Should be possible to enable/disable login footer', async () => {
        await loginPage.goToLoginPage();
        await loginPage.enableFooter();
        await loginPage.checkRememberIsDisplayed();
        await loginPage.checkNeedHelpIsDisplayed();
        await loginPage.checkRegisterDisplayed();
        await loginPage.disableFooter();
        await loginPage.checkRememberIsNotDisplayed();
        await loginPage.checkNeedHelpIsNotDisplayed();
        await loginPage.checkRegisterIsNotDisplayed();
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

    it('[C279932] Should successRoute property change the landing page when the user Login', async () => {
        await loginPage.goToLoginPage();
        await loginPage.enableSuccessRouteSwitch();
        await loginPage.enterSuccessRoute('activiti');
        await loginPage.loginWithProfile('admin');
        await processServicesPage.checkApsContainer();
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

    it('[C279933] Should be possible change the login component logo when logoImageUrl is changed', async () => {
        await loginPage.goToLoginPage();
        await loginPage.enableLogoSwitch();
        await loginPage.enterLogo('https://rawgit.com/Alfresco/alfresco-ng2-components/master/assets/angular2.png');
        await loginPage.checkLoginImgURL();
    });
});
