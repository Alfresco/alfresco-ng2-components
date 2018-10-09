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

import { ContentServicesPage } from './contentServicesPage';
import { FormControllersPage } from './material/formControllersPage';

import Util = require('../../util/util');
import TestConfig = require('../../test.config');
import { SettingsPage } from './settingsPage';

export class LoginPage {

    formControllersPage = new FormControllersPage();
    txtUsername = element(by.css('input[id="username"]'));
    txtPassword = element(by.css('input[id="password"]'));
    logoImg = element(by.css('img[id="adf-login-img-logo"]'));
    successRouteTxt = element(by.css('input[data-automation-id="adf-success-route"]'));
    logoTxt = element(by.css('input[data-automation-id="adf-url-logo"]'));
    usernameTooltip = element(by.css('span[data-automation-id="username-error"]'));
    passwordTooltip = element(by.css('span[data-automation-id="password-required"]'));
    loginTooltip = element(by.css('span[class="login-error-message"]'));
    usernameInactive = element(by.css('input[id="username"][aria-invalid="false"]'));
    passwordInactive = element(by.css('input[id="password"][aria-invalid="false"]'));
    adfLogo = element(by.css('img[class="adf-img-logo ng-star-inserted"]'));
    usernameHighlighted = element(by.css('input[id="username"][aria-invalid="true"]'));
    passwordHighlighted = element(by.css('input[id="password"][aria-invalid="true"]'));
    signInButton = element(by.id('login-button'));
    showPassword = element(by.css('mat-icon[data-automation-id="show_password"]'));
    hidePassword = element(by.css('mat-icon[data-automation-id="hide_password"]'));
    rememberMe = element(by.css('mat-checkbox[id="adf-login-remember"]'));
    needHelp = element(by.css('div[id="adf-login-action-left"]'));
    register = element(by.css('div[id="adf-login-action-right"]'));
    footerSwitch = element(by.id('switch4'));
    rememberMeSwitch = element(by.id('adf-toogle-show-rememberme'));
    successRouteSwitch = element(by.id('adf-toogle-show-successRoute'));
    logoSwitch = element(by.id('adf-toogle-logo'));
    header = element(by.id('adf-header'));
    cardBackground = element(by.css('mat-card[class*="adf-login-card"]'));
    settingsPage = new SettingsPage();
    loginForm = element(by.css('form[id="adf-login-form"'));

    checkLoginFormIsDisplayed() {
        Util.waitUntilElementIsVisible(this.loginForm);
    }

    waitForElements() {
        let deferred = protractor.promise.defer();

        Util.waitUntilElementIsVisible(this.txtUsername).then(() => {
            Util.waitUntilElementIsVisible(this.txtPassword).then(() => {
                deferred.fulfill();
            }, () => {
                deferred.rejected();
            });
        });

        return deferred.promise;

    }

    enterUsername(username) {
        Util.waitUntilElementIsVisible(this.txtUsername);
        this.txtUsername.sendKeys('');
        return this.txtUsername.clear().sendKeys(username);
    }

    enterPassword(password) {
        Util.waitUntilElementIsVisible(this.txtPassword);
        return this.txtPassword.clear().sendKeys(password);
    }

    clearUsername() {
        Util.waitUntilElementIsVisible(this.txtUsername);
        return this.txtUsername.click().clear();
    }

    clearPassword() {
        Util.waitUntilElementIsVisible(this.txtPassword);
        this.txtPassword.getAttribute('value').then(function (value) {
            for (let i = value.length; i >= 0; i--) {
                this.txtPassword.sendKeys(protractor.Key.BACK_SPACE);
            }
        });
    }

    checkUsernameTooltip() {
        Util.waitUntilElementIsVisible(this.usernameTooltip);
    }

    checkPasswordTooltip() {
        Util.waitUntilElementIsVisible(this.passwordTooltip);
    }

    checkLoginError(message) {
        Util.waitUntilElementIsVisible(this.loginTooltip);
        expect(this.loginTooltip.getText()).toEqual(message);
    }

    checkLoginImgURL(url) {
        Util.waitUntilElementIsVisible(this.logoImg);
        expect(this.logoImg.getAttribute('src')).toEqual(url);
    }

    checkUsernameInactive() {
        Util.waitUntilElementIsVisible(this.usernameInactive);
    }

    checkPasswordInactive() {
        Util.waitUntilElementIsVisible(this.passwordInactive);
    }

    checkUsernameHighlighted() {
        this.adfLogo.click();
        Util.waitUntilElementIsVisible(this.usernameHighlighted);
    }

    checkPasswordHighlighted() {
        this.adfLogo.click();
        Util.waitUntilElementIsVisible(this.passwordHighlighted);
    }

    checkUsernameTooltipIsNotVisible() {
        Util.waitUntilElementIsNotVisible(this.usernameTooltip);
    }

    checkPasswordTooltipIsNotVisible() {
        Util.waitUntilElementIsNotVisible(this.passwordTooltip);
    }

    checkSignInButtonIsEnabled() {
        Util.waitUntilElementIsVisible(this.signInButton);
        expect(this.signInButton.isEnabled()).toBe(true);
    }

    defaultLogin() {
        browser.driver.get(TestConfig.adf.url + TestConfig.adf.login);
        this.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
    }

    loginUsingUserModel(userModel) {
        browser.driver.get(TestConfig.adf.url + TestConfig.adf.login);
        this.waitForElements();
        this.login(userModel.getId(), userModel.getPassword());
    }

    loginToProcessServicesUsingUserModel(userModel) {
        this.settingsPage.setProviderBpm();
        this.waitForElements();
        this.login(userModel.email, userModel.password);
    }

    loginToProcessServicesUsingDefaultUser() {
        this.settingsPage.setProviderBpm();
        this.waitForElements();
        this.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
    }

    loginToContentServicesUsingUserModel(userModel) {
        this.settingsPage.setProviderEcm();
        this.waitForElements();

        this.login(userModel.getId(), userModel.getPassword());
    }

    loginToContentServices(username, password) {
        this.settingsPage.setProviderEcm();
        this.waitForElements();

        this.login(username, password);
    }

    goToLoginPage() {
        browser.driver.get(TestConfig.adf.url + TestConfig.adf.port + '/login');
        this.waitForElements();
    }

    checkSignInButtonIsDisabled() {
        Util.waitUntilElementIsVisible(this.signInButton);
        expect(this.signInButton.isEnabled()).toBe(false);
    }

    clickSignInButton() {
        Util.waitUntilElementIsVisible(this.signInButton);
        this.signInButton.click();
    }

    clickRememberMe() {
        Util.waitUntilElementIsVisible(this.rememberMe);
        this.rememberMe.click();
    }

    showPassword() {
        Util.waitUntilElementIsVisible(this.showPassword);
        this.showPassword.click();
    }

    getShowPasswordIconColor() {
        let deferred = protractor.promise.defer();

        Util.waitUntilElementIsVisible(this.showPassword);
        this.showPassword.getCssValue('color').then(function (value) {
            deferred.fulfill(value);
        });

        return deferred.promise;
    }

    getSignInButtonColor() {
        let deferred = protractor.promise.defer();

        Util.waitUntilElementIsVisible(this.signInButton);
        this.signInButton.getCssValue('color').then(function (value) {
            deferred.fulfill(value);
        });

        return deferred.promise;
    }

    getBackgroundColor() {
        let deferred = protractor.promise.defer();

        Util.waitUntilElementIsVisible(this.cardBackground);
        this.cardBackground.getCssValue('color').then(function (value) {
            deferred.fulfill(value);
        });

        return deferred.promise;
    }

    hidePassword() {
        Util.waitUntilElementIsVisible(this.hidePassword);
        this.hidePassword.click();
    }

    checkPasswordIsShown(password) {
        this.txtPassword.getAttribute('value').then(function (text) {
            expect(text).toEqual(password);
        });
    }

    checkPasswordIsHidden() {
        Util.waitUntilElementIsVisible(this.txtPassword);
    }

    checkRememberIsDisplayed() {
        Util.waitUntilElementIsVisible(this.rememberMe);
    }

    checkRememberIsNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.rememberMe);
    }

    checkNeedHelpIsDisplayed() {
        Util.waitUntilElementIsVisible(this.needHelp);
    }

    checkNeedHelpIsNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.needHelp);
    }

    checkRegisterDisplayed() {
        Util.waitUntilElementIsVisible(this.register);
    }

    checkRegisterIsNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.register);
    }

    enableFooter() {
        this.formControllersPage.enableToggle(this.footerSwitch);
    }

    disableFooter() {
        this.formControllersPage.disableToggle(this.footerSwitch);
    }

    disableRememberMe() {
        this.formControllersPage.disableToggle(this.rememberMeSwitch);
    }

    enableRememberMe() {
        this.formControllersPage.enableToggle(this.rememberMeSwitch);
    }

    disableSuccessRouteSwitch() {
        this.formControllersPage.disableToggle(this.successRouteSwitch);
    }

    enableSuccessRouteSwitch() {
        this.formControllersPage.enableToggle(this.successRouteSwitch);
    }

    disableLogowitch() {
        this.formControllersPage.disableToggle(this.logoSwitch);
    }

    enableLogoSwitch() {
        this.formControllersPage.enableToggle(this.logoSwitch);
    }

    enterSuccessRoute(route) {
        Util.waitUntilElementIsVisible(this.successRouteTxt);
        this.successRouteTxt.sendKeys('');
        return this.successRouteTxt.clear().sendKeys(route);
    }

    enterLogo(logo) {
        Util.waitUntilElementIsVisible(this.logoTxt);
        this.logoTxt.sendKeys('');
        return this.logoTxt.clear().sendKeys(logo);
    }

    login(username, password) {
        this.waitForElements();
        this.enterUsername(username);
        this.enterPassword(password);
        this.clickSignInButton();
        return Util.waitUntilElementIsVisible(this.header);
    }
}
