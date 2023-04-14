/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { $, browser, by, element } from 'protractor';
import { TogglePage, BrowserActions, BrowserVisibility, LoginPage } from '@alfresco/adf-testing';

export class LoginShellPage {

    loginURL = browser.baseUrl + '/login';
    loginSSOPage = new LoginPage();

    togglePage = new TogglePage();
    txtUsername = $('input[id="username"]');
    txtPassword = $('input[id="password"]');
    logoImg = $('img[id="adf-login-img-logo"]');
    successRouteTxt = $('input[data-automation-id="adf-success-route"]');
    logoTxt = $('input[data-automation-id="adf-url-logo"]');
    usernameError = $('span[data-automation-id="username-error"]');
    passwordError = $('span[data-automation-id="password-required"]');
    loginError = $('.adf-login-error-message');
    usernameInactive = $('input[id="username"][class*="ng-invalid"]');
    passwordInactive = $('input[id="password"][class*="ng-invalid"]');
    adfLogo = $('.adf-img-logo');

    usernameHighlighted = $('input[id="username"][aria-invalid="true"]');
    passwordHighlighted = $('input[id="password"][aria-invalid="true"]');
    signInButton = $('#login-button');
    showPasswordElement = $('button[data-automation-id="show_password"]');
    hidePasswordElement = $('button[data-automation-id="hide_password"]');
    rememberMe = $('mat-checkbox[id="adf-login-remember"]');
    needHelp = $('#adf-login-action-left');
    register = $('#adf-login-action-right');
    footerSwitch = $('#switch4');
    rememberMeSwitch = $('#adf-toggle-show-rememberme');
    successRouteSwitch = $('#adf-toggle-show-successRoute');
    logoSwitch = $('#adf-toggle-logo');
    header = $('#adf-header');
    settingsIcon = element(by.cssContainingText('a[data-automation-id="settings"] mat-icon', 'settings'));
    sidenavLayout = $(`[data-automation-id="sidenav-layout"]`);

    async goToLoginPage(): Promise<void> {
        await BrowserActions.getUrl(this.loginURL);
        await this.waitForElements();
    }

    async waitForElements(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.txtUsername);
        await BrowserVisibility.waitUntilElementIsVisible(this.txtPassword);
    }

    async enterUsername(username: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.txtUsername, username);
    }

    async enterPassword(password: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.txtPassword, password);
    }

    async clearUsername(): Promise<void> {
        await BrowserActions.click(this.txtUsername);
        await BrowserActions.clearWithBackSpace(this.txtUsername);
    }

    async clearPassword(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.txtPassword);
        await BrowserActions.clearWithBackSpace(this.txtPassword);
    }

    async getUsernameTooltip(): Promise<string> {
        return BrowserActions.getText(this.usernameError);
    }

    async getPasswordTooltip(): Promise<string> {
        return BrowserActions.getText(this.passwordError);
    }

    async getLoginError(): Promise<string> {
        return BrowserActions.getText(this.loginError);
    }

    async checkLoginErrorIsDisplayed(loginError: string): Promise<void> {
        await BrowserVisibility.waitUntilElementHasText(this.loginError, loginError);
    }

    async checkLoginImgURL(): Promise<string> {
        return BrowserActions.getAttribute(this.logoImg, 'src');
    }

    async checkUsernameInactive(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.usernameInactive);
    }

    async checkPasswordInactive(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.passwordInactive);
    }

    async checkUsernameHighlighted(): Promise<void> {
        await BrowserActions.click(this.adfLogo);
        await BrowserVisibility.waitUntilElementIsVisible(this.usernameHighlighted);
    }

    async checkPasswordHighlighted(): Promise<void> {
        await BrowserActions.click(this.adfLogo);
        await browser.sleep(900000);
        await BrowserVisibility.waitUntilElementIsVisible(this.passwordHighlighted);
    }

    async checkUsernameTooltipIsNotVisible(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.usernameError);
    }

    async checkPasswordTooltipIsNotVisible(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.passwordError);
    }

    async getSignInButtonIsEnabled(): Promise<boolean> {
        return this.signInButton.isEnabled();
    }

    async clickSignInButton(): Promise<void> {
        await BrowserActions.click(this.signInButton);
    }

    async clickSettingsIcon(): Promise<void> {
        await BrowserActions.click(this.settingsIcon);
    }

    async showPassword(): Promise<void> {
        await BrowserActions.click(this.showPasswordElement);
    }

    async hidePassword(): Promise<void> {
        await BrowserActions.click(this.hidePasswordElement);
    }

    async getShownPassword(): Promise<string> {
        return BrowserActions.getInputValue(this.txtPassword);
    }

    async checkPasswordIsHidden(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.txtPassword);
    }

    async checkRememberIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.rememberMe);
    }

    async checkRememberIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.rememberMe);
    }

    async checkNeedHelpIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.needHelp);
    }

    async checkNeedHelpIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.needHelp);
    }

    async checkRegisterDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.register);
    }

    async checkRegisterIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.register);
    }

    async enableFooter(): Promise<void> {
        await this.togglePage.enableToggle(this.footerSwitch);
    }

    async disableFooter(): Promise<void> {
        await this.togglePage.disableToggle(this.footerSwitch);
    }

    async disableRememberMe(): Promise<void> {
        await this.togglePage.disableToggle(this.rememberMeSwitch);
    }

    async enableSuccessRouteSwitch(): Promise<void> {
        await this.togglePage.enableToggle(this.successRouteSwitch);
    }

    async enableLogoSwitch(): Promise<void> {
        await this.togglePage.enableToggle(this.logoSwitch);
    }

    async enterSuccessRoute(route: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.successRouteTxt, route);
    }

    async enterLogo(logo: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.logoTxt, logo);
    }

    async login(username: string, password: string): Promise<void> {
        await this.loginSSOPage.login(username, password);
    }

    async loginWithProfile(profile: string): Promise<void> {
        await this.loginSSOPage.loginWithProfile(profile);
    }
}
