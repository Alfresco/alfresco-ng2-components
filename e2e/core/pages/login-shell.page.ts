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
import { TogglePage, BrowserActions, BrowserVisibility, LoginPage } from '@alfresco/adf-testing';

export class LoginShellPage {

    loginURL = browser.baseUrl + '/login';
    loginSSOPage = new LoginPage();

    togglePage = new TogglePage();
    txtUsername = element(by.css('input[id="username"]'));
    txtPassword = element(by.css('input[id="password"]'));
    usernameError = element(by.css('span[data-automation-id="username-error"]'));
    passwordError = element(by.css('span[data-automation-id="password-required"]'));
    loginError = element(by.css('.adf-login-error-message'));
    usernameInactive = element(by.css('input[id="username"][aria-invalid="false"]'));
    passwordInactive = element(by.css('input[id="password"][aria-invalid="false"]'));
    adfLogo = element(by.css('.adf-img-logo'));

    usernameHighlighted = element(by.css('input[id="username"][aria-invalid="true"]'));
    passwordHighlighted = element(by.css('input[id="password"][aria-invalid="true"]'));
    signInButton = element(by.id('login-button'));
    register = element(by.id('adf-login-action-right'));
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

    async checkLoginErrorIsDisplayed(loginError: string): Promise<void> {
        await BrowserVisibility.waitUntilElementHasText(this.loginError, loginError);
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

    async login(username: string, password: string): Promise<void> {
        await this.loginSSOPage.login(username, password);
    }

    async loginWithProfile(profile: string): Promise<void> {
        await this.loginSSOPage.loginWithProfile(profile);
    }
}
