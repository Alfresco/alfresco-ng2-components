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

import { UserInfoDialog } from '../../pages/adf/dialog/userInfoDialog';

import TestConfig = require('../../test.config');
import AcsUserModel = require('../../models/ACS/acsUserModel');

import { SettingsPage } from '../../pages/adf/settingsPage';
import AlfrescoApi = require('alfresco-js-api-node');

import Util = require('../../util/util');

describe('Login component', () => {

    let settingsPage = new SettingsPage();
    let processServicesPage = new ProcessServicesPage();
    let navigationBarPage = new NavigationBarPage();
    let userInfoDialog = new UserInfoDialog();
    let contentServicesPage = new ContentServicesPage();
    let loginPage = new LoginPage();
    let adminUserModel = new AcsUserModel({
        'id': TestConfig.adf.adminUser,
        'password': TestConfig.adf.adminPassword
    });

    let userA = new AcsUserModel();
    let userB = new AcsUserModel();

    let errorMessages = {
        username: 'Your username needs to be at least 2 characters.',
        invalid_credentials: 'You\'ve entered an unknown username or password',
        password: 'Enter your password to sign in',
        required: 'Required'
    };

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

    it('[C260036] Should require username', () => {
        loginPage.goToLoginPage();
        loginPage.checkUsernameInactive();
        loginPage.checkSignInButtonIsDisabled();
        loginPage.enterUsername('A');
        loginPage.checkUsernameTooltip(errorMessages.username);
        loginPage.clearUsername();
        loginPage.checkUsernameTooltip(errorMessages.required);
        loginPage.checkUsernameHighlighted();
        loginPage.checkSignInButtonIsDisabled();
    });

    it('[C260043] Should require password', () => {
        loginPage.goToLoginPage();
        loginPage.checkPasswordInactive();
        loginPage.checkSignInButtonIsDisabled();
        loginPage.enterPassword('A');
        loginPage.checkPasswordTooltipIsNotVisible();
        loginPage.clearPassword();
        loginPage.checkPasswordTooltip(errorMessages.password);
        loginPage.checkPasswordHighlighted();
        loginPage.checkSignInButtonIsDisabled();
    });

    it('[C260044] Username should be at least 2 characters long', () => {
        loginPage.goToLoginPage();
        loginPage.checkSignInButtonIsDisabled();
        loginPage.enterUsername('A');
        loginPage.checkUsernameTooltip(errorMessages.username);
        loginPage.enterUsername('AB');
        loginPage.checkUsernameTooltipIsNotVisible();
        loginPage.checkSignInButtonIsDisabled();
        loginPage.clearUsername();
    });

    it('[C260045] Should enable login button after entering a valid username and a password', () => {
        loginPage.goToLoginPage();
        loginPage.enterUsername(adminUserModel.id);
        loginPage.checkSignInButtonIsDisabled();
        loginPage.enterPassword('a');
        loginPage.checkSignInButtonIsEnabled();
        loginPage.clearUsername();
        loginPage.clearPassword();
    });

    it('[C260046] Should NOT be possible to login with an invalid username/password', () => {
        loginPage.goToLoginPage();
        loginPage.checkSignInButtonIsDisabled();
        loginPage.enterUsername('test');
        loginPage.enterPassword('test');
        loginPage.checkSignInButtonIsEnabled();
        loginPage.clickSignInButton();
        loginPage.checkLoginError(errorMessages.invalid_credentials);
        loginPage.clearUsername();
        loginPage.clearPassword();
    });

    it('[C260047] Password should be crypted', () => {
        loginPage.goToLoginPage();
        loginPage.checkSignInButtonIsDisabled();
        loginPage.enterPassword('test');
        loginPage.showPassword();
        loginPage.checkPasswordIsShown('test');
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
        loginPage.checkSignInButtonIsDisabled();
        settingsPage.setProviderBpm();
        loginPage.login(adminUserModel.id, adminUserModel.password);
        navigationBarPage.navigateToProcessServicesPage();
        processServicesPage.checkApsContainer();
        navigationBarPage.clickContentServicesButton();
        loginPage.waitForElements();
    });

    it('[C260050] Should be possible to login to Content Services with Process Services disabled', () => {
        loginPage.goToLoginPage();
        loginPage.checkSignInButtonIsDisabled();
        settingsPage.setProviderEcm();
        loginPage.login(TestConfig.adf.adminUser, TestConfig.adf.adminPassword);
        navigationBarPage.clickContentServicesButton();
        contentServicesPage.checkAcsContainer();
        navigationBarPage.navigateToProcessServicesPage();
        loginPage.waitForElements();
    });

    it('[C260051] Should be able to login to both Content Services and Process Services', () => {
        settingsPage.setProviderEcmBpm();
        loginPage.checkSignInButtonIsDisabled();
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
        settingsPage.setProviderEcmBpm();
        loginPage.login(adminUserModel.id, adminUserModel.password);
        browser.executeScript('window.localStorage.removeItem("ticket-ECM");').then(() => {
            browser.get(TestConfig.adf.url + '/files');
            loginPage.waitForElements();
        });

    });

    it('[C279932] Should successRoute property change the landing page when the user Login', () => {
        settingsPage.setProviderEcmBpm();
        loginPage.enableSuccessRouteSwitch();
        loginPage.enterSuccessRoute('activiti');
        loginPage.login(adminUserModel.id, adminUserModel.password);
        processServicesPage.checkApsContainer();
    });

    it('[C279931] Should the user be redirect to the login page when the Process Service session expire', () => {
        settingsPage.setProviderEcmBpm();
        loginPage.login(adminUserModel.id, adminUserModel.password);
        browser.executeScript('window.localStorage.removeItem("ticket-BPM");').then(() => {
            browser.get(TestConfig.adf.url + '/activiti');
            loginPage.waitForElements();
        });
    });

    it('[C279930] Should a user still be logged-in when open a new tab', () => {
        settingsPage.setProviderEcmBpm();
        loginPage.login(adminUserModel.id, adminUserModel.password);

        Util.openNewTabInBrowser();

        browser.getAllWindowHandles().then((handles) => {

            browser.ignoreSynchronization = true;
            browser.switchTo().window(handles[1]).then(() => {
                browser.get(TestConfig.adf.url + '/activiti');
                processServicesPage.checkApsContainer();
                browser.get(TestConfig.adf.url + '/files');
                contentServicesPage.checkAcsContainer();
            });
        });
    });

    it('[C276746] Should display the right information in user-info when a different users logs in', () => {
        loginPage.loginToContentServicesUsingUserModel(userA);
        navigationBarPage.clickUserProfile();
        expect(userInfoDialog.getContentHeaderTitle()).toEqual(userA.firstName + ' ' + userA.lastName);
        expect(userInfoDialog.getContentEmail()).toEqual(userA.email);

        loginPage.loginToContentServicesUsingUserModel(userB);
        navigationBarPage.clickUserProfile();
        expect(userInfoDialog.getContentHeaderTitle()).toEqual(userB.firstName + ' ' + userB.lastName);
        expect(userInfoDialog.getContentEmail()).toEqual(userB.email);
    });

    it('[C279933] Should be possible change the login component logo when logoImageUrl is changed', () => {
        settingsPage.setProviderEcmBpm();
        loginPage.enableLogoSwitch();
        loginPage.enterLogo('https://rawgit.com/Alfresco/alfresco-ng2-components/master/assets/angular2.png');
        loginPage.checkLoginImgURL('https://rawgit.com/Alfresco/alfresco-ng2-components/master/assets/angular2.png');
    });

});
