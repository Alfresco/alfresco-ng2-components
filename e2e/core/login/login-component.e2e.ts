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

import TestConfig = require('../../test.config');
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
        'id': TestConfig.adf.adminUser,
        'password': TestConfig.adf.adminPassword
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

    beforeAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ALL',
            hostEcm: TestConfig.adf.url,
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(userA);
        await this.alfrescoJsApi.core.peopleApi.addPerson(userB);

        done();
    });

    it('[C276746] Should display the right information in user-info when a different users logs in', async () => {
        await loginPage.loginToContentServicesUsingUserModel(userA);
        userInfoPage.clickUserProfile();
        expect(userInfoPage.getContentHeaderTitle()).toEqual(userA.firstName + ' ' + userA.lastName);
        expect(userInfoPage.getContentEmail()).toEqual(userA.email);

        await loginPage.loginToContentServicesUsingUserModel(userB);
        userInfoPage.clickUserProfile();
        expect(userInfoPage.getContentHeaderTitle()).toEqual(userB.firstName + ' ' + userB.lastName);
        expect(userInfoPage.getContentEmail()).toEqual(userB.email);
    });

    it('[C299206] Should redirect the user without the right access role on a forbidden page', async () => {
        await loginPage.loginToContentServicesUsingUserModel(userA);
        navigationBarPage.navigateToProcessServicesCloudPage();
        expect(errorPage.getErrorCode()).toBe('403');
        expect(errorPage.getErrorTitle()).toBe('You don\'t have permission to access this server.');
        expect(errorPage.getErrorDescription()).toBe('You\'re not allowed access to this resource on the server.');
    });

    it('[C260036] Should require username', () => {
        loginPage.goToLoginPage();
        loginPage.checkUsernameInactive();
        expect(loginPage.getSignInButtonIsEnabled()).toBe(false);
        loginPage.enterUsername('A');
        expect(loginPage.getUsernameTooltip()).toEqual(errorMessages.username);
        loginPage.clearUsername();
        expect(loginPage.getUsernameTooltip()).toEqual(errorMessages.required);
        loginPage.checkUsernameHighlighted();
        expect(loginPage.getSignInButtonIsEnabled()).toBe(false);
    });

    it('[C260043] Should require password', () => {
        loginPage.goToLoginPage();
        loginPage.checkPasswordInactive();
        loginPage.checkUsernameInactive();
        loginPage.enterPassword('A');
        loginPage.checkPasswordTooltipIsNotVisible();
        loginPage.clearPassword();
        expect(loginPage.getPasswordTooltip()).toEqual(errorMessages.password);
        loginPage.checkPasswordHighlighted();
        expect(loginPage.getSignInButtonIsEnabled()).toBe(false);
    });

    it('[C260044] Username should be at least 2 characters long', () => {
        loginPage.goToLoginPage();
        expect(loginPage.getSignInButtonIsEnabled()).toBe(false);
        loginPage.enterUsername('A');
        expect(loginPage.getUsernameTooltip()).toEqual(errorMessages.username);
        loginPage.enterUsername('AB');
        loginPage.checkUsernameTooltipIsNotVisible();
        expect(loginPage.getSignInButtonIsEnabled()).toBe(false);
        loginPage.clearUsername();
    });

    it('[C260045] Should enable login button after entering a valid username and a password', () => {
        loginPage.goToLoginPage();
        loginPage.enterUsername(adminUserModel.id);
        expect(loginPage.getSignInButtonIsEnabled()).toBe(false);
        loginPage.enterPassword('a');
        expect(loginPage.getSignInButtonIsEnabled()).toBe(true);
        loginPage.clearUsername();
        loginPage.clearPassword();
    });

    it('[C260046] Should NOT be possible to login with an invalid username/password', () => {
        loginPage.goToLoginPage();
        expect(loginPage.getSignInButtonIsEnabled()).toBe(false);
        loginPage.enterUsername('test');
        loginPage.enterPassword('test');
        expect(loginPage.getSignInButtonIsEnabled()).toBe(true);
        loginPage.clickSignInButton();
        expect(loginPage.getLoginError()).toEqual(errorMessages.invalid_credentials);
        loginPage.clearUsername();
        loginPage.clearPassword();
    });

    it('[C260047] Password should be crypted', () => {
        loginPage.goToLoginPage();
        expect(loginPage.getSignInButtonIsEnabled()).toBe(false);
        loginPage.enterPassword('test');
        loginPage.showPassword();
        loginPage.getShownPassword().then(async (tooltip) => {
            await expect(tooltip).toEqual('test');
        });
        loginPage.hidePassword();
        loginPage.checkPasswordIsHidden();
        loginPage.clearPassword();
    });

    it('[C260048] Should be possible to enable/disable login footer', () => {
        loginPage.goToLoginPage();
        loginPage.enableFooter();
        loginPage.checkRememberIsDisplayed();
        loginPage.checkNeedHelpIsDisplayed();
        loginPage.checkRegisterDisplayed();
        loginPage.disableFooter();
        loginPage.checkRememberIsNotDisplayed();
        loginPage.checkNeedHelpIsNotDisplayed();
        loginPage.checkRegisterIsNotDisplayed();
    });

    it('[C260049] Should be possible to login to Process Services with Content Services disabled', () => {
        loginPage.goToLoginPage();
        expect(loginPage.getSignInButtonIsEnabled()).toBe(false);
        loginPage.clickSettingsIcon();
        settingsPage.setProviderBpm();
        loginPage.login(adminUserModel.id, adminUserModel.password);
        navigationBarPage.navigateToProcessServicesPage();
        processServicesPage.checkApsContainer();
        navigationBarPage.clickContentServicesButton();
        loginPage.waitForElements();
    });

    it('[C260050] Should be possible to login to Content Services with Process Services disabled', () => {
        loginPage.goToLoginPage();
        expect(loginPage.getSignInButtonIsEnabled()).toBe(false);
        loginPage.clickSettingsIcon();
        settingsPage.setProviderEcm();
        loginPage.login(TestConfig.adf.adminUser, TestConfig.adf.adminPassword);
        navigationBarPage.clickContentServicesButton();
        contentServicesPage.checkAcsContainer();
    });

    it('[C260051] Should be able to login to both Content Services and Process Services', () => {
        loginPage.goToLoginPage();
        loginPage.clickSettingsIcon();
        settingsPage.setProviderEcmBpm();
        expect(loginPage.getSignInButtonIsEnabled()).toBe(false);
        loginPage.clickSettingsIcon();
        settingsPage.setProviderEcmBpm();
        loginPage.login(adminUserModel.id, adminUserModel.password);
        navigationBarPage.navigateToProcessServicesPage();
        processServicesPage.checkApsContainer();
        navigationBarPage.clickContentServicesButton();
        contentServicesPage.checkAcsContainer();
        navigationBarPage.clickLoginButton();
        loginPage.waitForElements();
    });

    it('[C277754] Should the user be redirect to the login page when the Content Service session expire', () => {
        loginPage.goToLoginPage();
        loginPage.clickSettingsIcon();
        settingsPage.setProviderEcmBpm();
        loginPage.login(adminUserModel.id, adminUserModel.password);
        browser.executeScript('window.localStorage.removeItem("ticket-ECM");');
        BrowserActions.getUrl(TestConfig.adf.url + '/files');
        loginPage.waitForElements();
    });

    it('[C279932] Should successRoute property change the landing page when the user Login', () => {
        loginPage.goToLoginPage();
        loginPage.clickSettingsIcon();
        settingsPage.setProviderEcmBpm();
        loginPage.enableSuccessRouteSwitch();
        loginPage.enterSuccessRoute('activiti');
        loginPage.login(adminUserModel.id, adminUserModel.password);
        processServicesPage.checkApsContainer();
    });

    it('[C279931] Should the user be redirect to the login page when the Process Service session expire', () => {
        loginPage.goToLoginPage();
        loginPage.clickSettingsIcon();
        settingsPage.setProviderEcmBpm();
        loginPage.login(adminUserModel.id, adminUserModel.password);
        browser.executeScript('window.localStorage.removeItem("ticket-BPM");');
        BrowserActions.getUrl(TestConfig.adf.url + '/activiti');
        loginPage.waitForElements();
    });

    it('[C279930] Should a user still be logged-in when open a new tab', () => {
        loginPage.goToLoginPage();
        loginPage.clickSettingsIcon();
        settingsPage.setProviderEcmBpm();
        loginPage.login(adminUserModel.id, adminUserModel.password);

        Util.openNewTabInBrowser();

        browser.getAllWindowHandles().then((handles) => {

            browser.switchTo().window(handles[1]).then(() => {
                BrowserActions.getUrl(TestConfig.adf.url + '/activiti');
                processServicesPage.checkApsContainer();
                BrowserActions.getUrl(TestConfig.adf.url + '/files');
                contentServicesPage.checkAcsContainer();
            });
        });
    });

    it('[C279933] Should be possible change the login component logo when logoImageUrl is changed', () => {
        loginPage.goToLoginPage();
        loginPage.clickSettingsIcon();
        settingsPage.setProviderEcmBpm();
        loginPage.enableLogoSwitch();
        loginPage.enterLogo('https://rawgit.com/Alfresco/alfresco-ng2-components/master/assets/angular2.png');
        loginPage.checkLoginImgURL();
    });

    it('[C291854] Should be possible login in valid credentials', () => {
        BrowserActions.getUrl(TestConfig.adf.url);
        loginPage.waitForElements();
        expect(loginPage.getSignInButtonIsEnabled()).toBe(false);
        loginPage.enterUsername(invalidUsername);
        expect(loginPage.getSignInButtonIsEnabled()).toBe(false);
        loginPage.enterPassword(invalidPassword);
        expect(loginPage.getSignInButtonIsEnabled()).toBe(true);
        loginPage.clickSignInButton();
        expect(loginPage.getLoginError()).toEqual(errorMessages.invalid_credentials);
        loginPage.login(adminUserModel.id, adminUserModel.password);
    });

});
