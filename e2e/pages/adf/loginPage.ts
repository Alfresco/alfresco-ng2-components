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

import { FormControllersPage } from './material/formControllersPage';

import Util = require('../../util/util');
import TestConfig = require('../../test.config');
import { SettingsPage } from './settingsPage';
import { element, by, protractor, browser } from 'protractor';

export class LoginPage {

    formControllersPage = new FormControllersPage();
    txtUsername = element(by.css('input[id="username"]'));
    txtPassword = element(by.css('input[id="password"]'));
    logoImg = element(by.css('img[id="adf-login-img-logo"]'));
    successRouteTxt = element(by.css('input[data-automation-id="adf-success-route"]'));
    logoTxt = element(by.css('input[data-automation-id="adf-url-logo"]'));
    usernameTooltip = element(by.css('span[data-automation-id="username-error"]'));
    passwordTooltip = element(by.css('span[data-automation-id="password-required"]'));
    loginTooltip = element(by.css('span[class="adf-login-error-message"]'));
    usernameInactive = element(by.css('input[id="username"][aria-invalid="false"]'));
    passwordInactive = element(by.css('input[id="password"][aria-invalid="false"]'));
    adfLogo = element(by.css('img[class="adf-img-logo ng-star-inserted"]'));
    usernameHighlighted = element(by.css('input[id="username"][aria-invalid="true"]'));
    passwordHighlighted = element(by.css('input[id="password"][aria-invalid="true"]'));
    signInButton = element(by.id('login-button'));
    showPasswordElement = element(by.css('mat-icon[data-automation-id="show_password"]'));
    hidePasswordElement = element(by.css('mat-icon[data-automation-id="hide_password"]'));
    rememberMe = element(by.css('mat-checkbox[id="adf-login-remember"]'));
    needHelp = element(by.css('div[id="adf-login-action-left"]'));
    register = element(by.css('div[id="adf-login-action-right"]'));
    footerSwitch = element(by.id('switch4'));
    rememberMeSwitch = element(by.id('adf-toggle-show-rememberme'));
    successRouteSwitch = element(by.id('adf-toggle-show-successRoute'));
    logoSwitch = element(by.id('adf-toggle-logo'));
    header = element(by.id('adf-header'));
    settingsPage = new SettingsPage();

    waitForElements() {
        Util.waitUntilElementIsVisible(this.txtUsername);
        Util.waitUntilElementIsVisible(this.txtPassword);
        return this;
    }

    enterUsername(username) {
        Util.waitUntilElementIsVisible(this.txtUsername);
        this.txtUsername.sendKeys('');
        this.txtUsername.clear();
        return this.txtUsername.sendKeys(username);
    }

    enterPassword(password) {
        Util.waitUntilElementIsVisible(this.txtPassword);
        this.txtPassword.clear();
        return this.txtPassword.sendKeys(password);
    }

    clearUsername() {
        Util.waitUntilElementIsVisible(this.txtUsername);
        this.txtUsername.click();
        this.txtUsername.getAttribute('value').then((value) => {
            for (let i = value.length; i >= 0; i--) {
                this.txtUsername.sendKeys(protractor.Key.BACK_SPACE);
            }
        });
        return this;
    }

    clearPassword() {
        Util.waitUntilElementIsVisible(this.txtPassword);
        this.txtPassword.getAttribute('value').then((value) => {
            for (let i = value.length; i >= 0; i--) {
                this.txtPassword.sendKeys(protractor.Key.BACK_SPACE);
            }
        });
    }

    getUsernameTooltip() {
        Util.waitUntilElementIsVisible(this.usernameTooltip);
        return this.usernameTooltip.getText();
    }

    getPasswordTooltip() {
        Util.waitUntilElementIsVisible(this.passwordTooltip);
        return this.passwordTooltip.getText();
    }

    getLoginError() {
        Util.waitUntilElementIsVisible(this.loginTooltip);
        return this.loginTooltip.getText();
    }

    checkLoginImgURL(url) {
        Util.waitUntilElementIsVisible(this.logoImg);
        return this.logoImg.getAttribute('src');
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

    getSignInButtonIsEnabled() {
        Util.waitUntilElementIsVisible(this.signInButton);
        return this.signInButton.isEnabled();
    }

    loginToProcessServicesUsingUserModel(userModel) {
        this.settingsPage.setProviderBpm();
        this.waitForElements();
        this.login(userModel.email, userModel.password);
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
        browser.controlFlow().execute(async () => {
            await browser.driver.get(TestConfig.adf.url + TestConfig.adf.port + '/login');
        });
        this.waitForElements();
    }

    clickSignInButton() {
        Util.waitUntilElementIsVisible(this.signInButton);
        this.signInButton.click();
    }

    showPassword() {
        Util.waitUntilElementIsVisible(this.showPasswordElement);
        this.showPasswordElement.click();
    }

    hidePassword() {
        Util.waitUntilElementIsVisible(this.hidePasswordElement);
        this.hidePasswordElement.click();
    }

    getShownPassword() {
        return this.txtPassword.getAttribute('value');
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

    enableSuccessRouteSwitch() {
        this.formControllersPage.enableToggle(this.successRouteSwitch);
    }

    enableLogoSwitch() {
        this.formControllersPage.enableToggle(this.logoSwitch);
    }

    enterSuccessRoute(route) {
        Util.waitUntilElementIsVisible(this.successRouteTxt);
        this.successRouteTxt.sendKeys('');
        this.successRouteTxt.clear();
        return this.successRouteTxt.sendKeys(route);
    }

    enterLogo(logo) {
        Util.waitUntilElementIsVisible(this.logoTxt);
        this.logoTxt.sendKeys('');
        this.logoTxt.clear();
        return this.logoTxt.sendKeys(logo);
    }

    login(username, password) {
        this.waitForElements();
        this.enterUsername(username);
        this.enterPassword(password);
        this.clickSignInButton();
        return Util.waitUntilElementIsVisible(this.header);
    }
}
