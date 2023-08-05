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

import { $, browser } from 'protractor';
import { TogglePage, BrowserActions, BrowserVisibility, LoginPage } from '@alfresco/adf-testing';

export class LoginShellPage {
    loginURL = browser.baseUrl + '/login';
    loginSSOPage = new LoginPage();

    togglePage = new TogglePage();
    txtUsername = $('input[id="username"]');
    txtPassword = $('input[id="password"]');
    logoImg = $('img[id="adf-login-img-logo"]');
    logoTxt = $('input[data-automation-id="adf-url-logo"]');
    usernameError = $('span[data-automation-id="username-error"]');
    usernameInactive = $('input[id="username"][class*="ng-invalid"]');
    adfLogo = $('.adf-img-logo');

    usernameHighlighted = $('input[id="username"][aria-invalid="true"]');
    signInButton = $('#login-button');
    showPasswordElement = $('button[data-automation-id="show_password"]');
    hidePasswordElement = $('button[data-automation-id="hide_password"]');
    register = $('#adf-login-action-right');
    logoSwitch = $('#adf-toggle-logo');
    header = $('#adf-header');
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

    async checkLoginImgURL(): Promise<string> {
        return BrowserActions.getAttribute(this.logoImg, 'src');
    }

    async checkUsernameInactive(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.usernameInactive);
    }

    async checkUsernameHighlighted(): Promise<void> {
        await BrowserActions.click(this.adfLogo);
        await BrowserVisibility.waitUntilElementIsVisible(this.usernameHighlighted);
    }

    async checkUsernameTooltipIsNotVisible(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.usernameError);
    }

    async getSignInButtonIsEnabled(): Promise<boolean> {
        return this.signInButton.isEnabled();
    }

    async clickSignInButton(): Promise<void> {
        await BrowserActions.click(this.signInButton);
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

    async enableLogoSwitch(): Promise<void> {
        await this.togglePage.enableToggle(this.logoSwitch);
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
