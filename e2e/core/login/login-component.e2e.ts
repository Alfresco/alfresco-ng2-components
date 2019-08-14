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

import { LoginPage, SettingsPage, ErrorPage, BrowserActions } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { ProcessServicesPage } from '../../pages/adf/process-services/processServicesPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

import { UserInfoPage } from '@alfresco/adf-testing';

import { AcsUserModel } from '../../models/ACS/acsUserModel';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';

import { Util } from '../../util/util';

describe('Login component', () => {

    const settingsPage = new SettingsPage();
    const processServicesPage = new ProcessServicesPage();
    const navigationBarPage = new NavigationBarPage();
    const userInfoPage = new UserInfoPage();
    const contentServicesPage = new ContentServicesPage();
    const loginPage = new LoginPage();
    const errorPage = new ErrorPage();
    const adminUserModel = new AcsUserModel({
        'id': browser.params.testConfig.adf.adminUser,
        'password': browser.params.testConfig.adf.adminPassword
    });

    const userA = new AcsUserModel();
    const userB = new AcsUserModel();

    const errorMessages = {
        username: 'Your username needs to be at least 2 characters.',
        invalid_credentials: 'You\'ve entered an unknown username or password',
        password: 'Enter your password to sign in',
        required: 'Required'
    };
    const invalidUsername = 'invaliduser';
    const invalidPassword = 'invalidpassword';

    beforeAll(async () => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ALL',
            hostEcm: browser.params.testConfig.adf_acs.host,
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(userA);
        await this.alfrescoJsApi.core.peopleApi.addPerson(userB);

    });

    it('[C276746] Should display the right information in user-info when a different users logs in', async () => {
        await loginPage.loginToContentServicesUsingUserModel(userA);
        await userInfoPage.clickUserProfile();
        await expect(await userInfoPage.getContentHeaderTitle()).toEqual(userA.firstName + ' ' + userA.lastName);
        await expect(await userInfoPage.getContentEmail()).toEqual(userA.email);

        await loginPage.loginToContentServicesUsingUserModel(userB);
        await userInfoPage.clickUserProfile();
        await expect(await userInfoPage.getContentHeaderTitle()).toEqual(userB.firstName + ' ' + userB.lastName);
        await expect(await userInfoPage.getContentEmail()).toEqual(userB.email);
    });

    it('[C299206] Should redirect the user without the right access role on a forbidden page', async () => {
        await loginPage.loginToContentServicesUsingUserModel(userA);
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
        await loginPage.enterUsername(adminUserModel.id);
        await expect(await loginPage.getSignInButtonIsEnabled()).toBe(false);
        await loginPage.enterPassword('a');
        await expect(await loginPage.getSignInButtonIsEnabled()).toBe(true);
        await loginPage.clearUsername();
        await loginPage.clearPassword();
    });

    it('[C260046] Should NOT be possible to login with an invalid username/password', async () => {
        await loginPage.goToLoginPage();
        await expect(await loginPage.getSignInButtonIsEnabled()).toBe(false);
        await loginPage.enterUsername('test');
        await loginPage.enterPassword('test');
        await expect(await loginPage.getSignInButtonIsEnabled()).toBe(true);
        await loginPage.clickSignInButton();
        await expect(await loginPage.getLoginError()).toEqual(errorMessages.invalid_credentials);
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
        await loginPage.goToLoginPage();
        await expect(await loginPage.getSignInButtonIsEnabled()).toBe(false);
        await loginPage.clickSettingsIcon();
        await settingsPage.setProviderBpm();
        await loginPage.login(adminUserModel.id, adminUserModel.password);
        await navigationBarPage.navigateToProcessServicesPage();
        await processServicesPage.checkApsContainer();
        await navigationBarPage.clickContentServicesButton();
        await loginPage.waitForElements();
    });

    it('[C260050] Should be possible to login to Content Services with Process Services disabled', async () => {
        await loginPage.goToLoginPage();
        await expect(await loginPage.getSignInButtonIsEnabled()).toBe(false);
        await loginPage.clickSettingsIcon();
        await settingsPage.setProviderEcm();
        await loginPage.login(browser.params.testConfig.adf.adminUser, browser.params.testConfig.adf.adminPassword);
        await navigationBarPage.clickContentServicesButton();
        await contentServicesPage.checkAcsContainer();
    });

    it('[C260051] Should be able to login to both Content Services and Process Services', async () => {
        await loginPage.goToLoginPage();
        await loginPage.clickSettingsIcon();
        await settingsPage.setProviderEcmBpm();
        await expect(await loginPage.getSignInButtonIsEnabled()).toBe(false);
        await loginPage.clickSettingsIcon();
        await settingsPage.setProviderEcmBpm();
        await loginPage.login(adminUserModel.id, adminUserModel.password);
        await navigationBarPage.navigateToProcessServicesPage();
        await processServicesPage.checkApsContainer();
        await navigationBarPage.clickContentServicesButton();
        await contentServicesPage.checkAcsContainer();
        await navigationBarPage.clickLoginButton();
        await loginPage.waitForElements();
    });

    it('[C277754] Should the user be redirect to the login page when the Content Service session expire', async () => {
        await loginPage.goToLoginPage();
        await loginPage.clickSettingsIcon();
        await settingsPage.setProviderEcmBpm();
        await loginPage.login(adminUserModel.id, adminUserModel.password);
        await browser.executeScript('window.localStorage.removeItem("ticket-ECM");');
        await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/files');
        await loginPage.waitForElements();
    });

    it('[C279932] Should successRoute property change the landing page when the user Login', async () => {
        await loginPage.goToLoginPage();
        await loginPage.clickSettingsIcon();
        await settingsPage.setProviderEcmBpm();
        await loginPage.enableSuccessRouteSwitch();
        await loginPage.enterSuccessRoute('activiti');
        await loginPage.login(adminUserModel.id, adminUserModel.password);
        await processServicesPage.checkApsContainer();
    });

    it('[C279931] Should the user be redirect to the login page when the Process Service session expire', async () => {
        await loginPage.goToLoginPage();
        await loginPage.clickSettingsIcon();
        await settingsPage.setProviderEcmBpm();
        await loginPage.login(adminUserModel.id, adminUserModel.password);
        await browser.executeScript('window.localStorage.removeItem("ticket-BPM");');
        await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/activiti');
        await loginPage.waitForElements();
    });

    it('[C279930] Should a user still be logged-in when open a new tab', async () => {
        await loginPage.goToLoginPage();
        await loginPage.clickSettingsIcon();
        await settingsPage.setProviderEcmBpm();
        await loginPage.login(adminUserModel.id, adminUserModel.password);

        await Util.openNewTabInBrowser();

        const handles = await browser.getAllWindowHandles();
        await browser.switchTo().window(handles[1]);
        await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/activiti');
        await processServicesPage.checkApsContainer();
        await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/files');
        await contentServicesPage.checkAcsContainer();
    });

    it('[C279933] Should be possible change the login component logo when logoImageUrl is changed', async () => {
        await loginPage.goToLoginPage();
        await loginPage.clickSettingsIcon();
        await settingsPage.setProviderEcmBpm();
        await loginPage.enableLogoSwitch();
        await loginPage.enterLogo('https://rawgit.com/Alfresco/alfresco-ng2-components/master/assets/angular2.png');
        await loginPage.checkLoginImgURL();
    });

    it('[C291854] Should be possible login in valid credentials', async () => {
        await BrowserActions.getUrl(browser.params.testConfig.adf.url);
        await loginPage.waitForElements();
        await expect(await loginPage.getSignInButtonIsEnabled()).toBe(false);
        await loginPage.enterUsername(invalidUsername);
        await expect(await loginPage.getSignInButtonIsEnabled()).toBe(false);
        await loginPage.enterPassword(invalidPassword);
        await expect(await loginPage.getSignInButtonIsEnabled()).toBe(true);
        await loginPage.clickSignInButton();
        await expect(await loginPage.getLoginError()).toEqual(errorMessages.invalid_credentials);
        await loginPage.login(adminUserModel.id, adminUserModel.password);
    });

});
