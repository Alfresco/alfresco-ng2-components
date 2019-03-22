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

import { FormControllersPage } from './form-controller.page';
import { browser, by, element, protractor } from 'protractor';
import { BrowserVisibility } from '../browser-visibility';

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

    waitForElements() {
        BrowserVisibility.waitUntilElementIsVisible(this.txtUsername);
        BrowserVisibility.waitUntilElementIsVisible(this.txtPassword);
        return this;
    }

    enterUsername(username) {
        BrowserVisibility.waitUntilElementIsVisible(this.txtUsername);
        this.txtUsername.sendKeys('');
        this.txtUsername.clear();
        return this.txtUsername.sendKeys(username);
    }

    enterPassword(password) {
        BrowserVisibility.waitUntilElementIsVisible(this.txtPassword);
        this.txtPassword.clear();
        return this.txtPassword.sendKeys(password);
    }

    clearUsername() {
        BrowserVisibility.waitUntilElementIsVisible(this.txtUsername);
        this.txtUsername.click();
        this.txtUsername.getAttribute('value').then((value) => {
            for (let i = value.length; i >= 0; i--) {
                this.txtUsername.sendKeys(protractor.Key.BACK_SPACE);
            }
        });
        return this;
    }

    clearPassword() {
        BrowserVisibility.waitUntilElementIsVisible(this.txtPassword);
        this.txtPassword.getAttribute('value').then((value) => {
            for (let i = value.length; i >= 0; i--) {
                this.txtPassword.sendKeys(protractor.Key.BACK_SPACE);
            }
        });
    }

    getUsernameTooltip() {
        BrowserVisibility.waitUntilElementIsVisible(this.usernameTooltip);
        return this.usernameTooltip.getText();
    }

    getPasswordTooltip() {
        BrowserVisibility.waitUntilElementIsVisible(this.passwordTooltip);
        return this.passwordTooltip.getText();
    }

    getLoginError() {
        BrowserVisibility.waitUntilElementIsVisible(this.loginTooltip);
        return this.loginTooltip.getText();
    }

    checkLoginImgURL(url) {
        BrowserVisibility.waitUntilElementIsVisible(this.logoImg);
        return this.logoImg.getAttribute('src');
    }

    checkUsernameInactive() {
        BrowserVisibility.waitUntilElementIsVisible(this.usernameInactive);
    }

    checkPasswordInactive() {
        BrowserVisibility.waitUntilElementIsVisible(this.passwordInactive);
    }

    checkUsernameHighlighted() {
        this.adfLogo.click();
        BrowserVisibility.waitUntilElementIsVisible(this.usernameHighlighted);
    }

    checkPasswordHighlighted() {
        this.adfLogo.click();
        BrowserVisibility.waitUntilElementIsVisible(this.passwordHighlighted);
    }

    checkUsernameTooltipIsNotVisible() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.usernameTooltip);
    }

    checkPasswordTooltipIsNotVisible() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.passwordTooltip);
    }

    getSignInButtonIsEnabled() {
        BrowserVisibility.waitUntilElementIsVisible(this.signInButton);
        return this.signInButton.isEnabled();
    }

    goToLoginPage() {
        browser.waitForAngularEnabled(true);
        browser.driver.get(browser.params.baseUrl);
        this.waitForElements();
    }

    clickSignInButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.signInButton);
        this.signInButton.click();
    }

    showPassword() {
        BrowserVisibility.waitUntilElementIsVisible(this.showPasswordElement);
        this.showPasswordElement.click();
    }

    hidePassword() {
        BrowserVisibility.waitUntilElementIsVisible(this.hidePasswordElement);
        this.hidePasswordElement.click();
    }

    getShownPassword() {
        return this.txtPassword.getAttribute('value');
    }

    checkPasswordIsHidden() {
        BrowserVisibility.waitUntilElementIsVisible(this.txtPassword);
    }

    checkRememberIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.rememberMe);
    }

    checkRememberIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.rememberMe);
    }

    checkNeedHelpIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.needHelp);
    }

    checkNeedHelpIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.needHelp);
    }

    checkRegisterDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.register);
    }

    checkRegisterIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.register);
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
        BrowserVisibility.waitUntilElementIsVisible(this.successRouteTxt);
        this.successRouteTxt.sendKeys('');
        this.successRouteTxt.clear();
        return this.successRouteTxt.sendKeys(route);
    }

    enterLogo(logo) {
        BrowserVisibility.waitUntilElementIsVisible(this.logoTxt);
        this.logoTxt.sendKeys('');
        this.logoTxt.clear();
        return this.logoTxt.sendKeys(logo);
    }

    login(username, password) {
        this.waitForElements();
        this.enterUsername(username);
        this.enterPassword(password);
        this.clickSignInButton();
        return BrowserVisibility.waitUntilElementIsVisible(this.header);
    }
}
