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

import { browser, by, element } from 'protractor';
import { TogglePage, BrowserActions, BrowserVisibility, LoginSSOPage } from '@alfresco/adf-testing';

export class LoginPage {

    loginURL = browser.baseUrl + '/login';
    loginSSOPage = new LoginSSOPage();

    togglePage = new TogglePage();
    txtUsername = element(by.css('input[id="username"]'));
    txtPassword = element(by.css('input[id="password"]'));
    logoImg = element(by.css('img[id="adf-login-img-logo"]'));
    successRouteTxt = element(by.css('input[data-automation-id="adf-success-route"]'));
    logoTxt = element(by.css('input[data-automation-id="adf-url-logo"]'));
    usernameError = element(by.css('span[data-automation-id="username-error"]'));
    passwordError = element(by.css('span[data-automation-id="password-required"]'));
    loginError = element(by.css('.adf-login-error-message'));
    usernameInactive = element(by.css('input[id="username"][aria-invalid="false"]'));
    passwordInactive = element(by.css('input[id="password"][aria-invalid="false"]'));
    adfLogo = element(by.css('.adf-img-logo'));

    usernameHighlighted = element(by.css('input[id="username"][aria-invalid="true"]'));
    passwordHighlighted = element(by.css('input[id="password"][aria-invalid="true"]'));
    signInButton = element(by.id('login-button'));
    showPasswordElement = element(by.css('button[data-automation-id="show_password"]'));
    hidePasswordElement = element(by.css('button[data-automation-id="hide_password"]'));
    rememberMe = element(by.css('mat-checkbox[id="adf-login-remember"]'));
    needHelp = element(by.id('adf-login-action-left'));
    register = element(by.id('adf-login-action-right'));
    footerSwitch = element(by.id('switch4'));
    rememberMeSwitch = element(by.id('adf-toggle-show-rememberme'));
    successRouteSwitch = element(by.id('adf-toggle-show-successRoute'));
    logoSwitch = element(by.id('adf-toggle-logo'));
    header = element(by.id('adf-header'));
    settingsIcon = element(by.cssContainingText('a[data-automation-id="settings"] mat-icon', 'settings'));
    sidenavLayout = element(by.css(`[data-automation-id="sidenav-layout"]`));

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

    async checkLoginImgURL(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.logoImg);
        return this.logoImg.getAttribute('src');
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
        return this.txtPassword.getAttribute('value');
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
}
