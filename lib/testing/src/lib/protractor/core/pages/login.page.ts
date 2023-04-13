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

import { browser, protractor, $ } from 'protractor';
import { BrowserVisibility } from '../utils/browser-visibility';
import { BrowserActions } from '../utils/browser-actions';
import { LocalStorageUtil } from '../utils/local-storage.util';
import { Logger } from '../utils/logger';

export interface LoginOptions {
    waitForUserIcon: boolean;
}
export class LoginPage {

    loginUrl = `${browser.baseUrl}/login`;

    ssoButton = $(`[data-automation-id="login-button-sso"]`);
    usernameField = $('#username');
    passwordField = $('#password');
    loginButton = $('input[type="submit"]');
    userIcon = $(`[data-automation-id*='user-initials']`);
    loginError = $(`div[data-automation-id="login-error"]`);
    visibilityLabel = $('#v');

    txtUsernameBasicAuth = $('input[id="username"]');
    txtPasswordBasicAuth = $('input[id="password"]');
    signInButtonBasicAuth = $('#login-button');

    async goToLoginPage(): Promise<void> {
        let currentUrl;

        try {
            currentUrl = await browser.getCurrentUrl();
        } catch (e) {
        }

        if (!currentUrl || currentUrl.indexOf(this.loginUrl) === -1) {
            await BrowserActions.getUrl(this.loginUrl);
        }

        await BrowserVisibility.waitUntilElementIsVisible(this.txtUsernameBasicAuth);
        await BrowserVisibility.waitUntilElementIsVisible(this.txtPasswordBasicAuth);
    }

    async loginWithProfile(profileName: string): Promise<void> {
        const profile = browser.params.testConfig.users[profileName];
        if (profile) {
            await this.login(profile.username, profile.password);
        } else {
            throw new Error(`Login profile "${profileName}" not found on "browser.params.testConfig".`);
        }
    }

    async login(username: string, password: string, options: LoginOptions = { waitForUserIcon: true }) {
        Logger.log('Login With ' + username);
        const authType = await LocalStorageUtil.getConfigField('authType');

        if (!authType || authType === 'OAUTH') {
            await this.loginSSOIdentityService(username, password, options);
        } else {
            await this.loginBasicAuth(username, password, options);
        }

        await browser.waitForAngular();
    }

    async loginSSOIdentityService(username: string, password: string, options: LoginOptions = { waitForUserIcon: true }) {
        browser.ignoreSynchronization = true;
        const loginURL: string = browser.baseUrl + (browser.params.loginRoute ? browser.params.loginRoute : '');

        const oauth2 = await LocalStorageUtil.getConfigField('oauth2');
        await BrowserActions.getUrl(loginURL);

        if (oauth2 && oauth2.silentLogin === false) {
            await this.clickOnSSOButton();
        }

        await BrowserVisibility.waitUntilElementIsVisible(this.usernameField);
        await this.displayPassword();
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();
        await browser.actions().sendKeys(protractor.Key.ENTER).perform();
        if (options.waitForUserIcon) {
            await BrowserVisibility.waitUntilElementIsVisible(this.userIcon, BrowserVisibility.DEFAULT_TIMEOUT * 2);
        }
    }

    async loginBasicAuth(username: string, password: string, options: LoginOptions = { waitForUserIcon: true }): Promise<void> {
        await this.goToLoginPage();

        await this.enterUsernameBasicAuth(username);
        await this.enterPasswordBasicAuth(password);
        await this.clickSignInBasicAuthButton();
        if (options.waitForUserIcon) {
            await BrowserVisibility.waitUntilElementIsVisible(this.userIcon);
        }
    }

    async clickSignInBasicAuthButton(): Promise<void> {
        await BrowserActions.click(this.signInButtonBasicAuth);
    }

    async enterUsernameBasicAuth(username: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.txtUsernameBasicAuth, username);
    }

    async enterPasswordBasicAuth(password: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.txtPasswordBasicAuth, password);
    }

    async clickOnSSOButton() {
        await BrowserActions.click(this.ssoButton);
    }

    async enterUsername(username: string) {
        await BrowserActions.clearSendKeys(this.usernameField, username);
    }

    async enterPassword(password: string) {
        await BrowserActions.clearSendKeys(this.passwordField, password);
    }

    async clickLoginButton() {
        await BrowserActions.click(this.loginButton);
    }

    async checkLoginErrorIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.loginError);
    }

    async getLoginErrorMessage() {
        return BrowserActions.getText(this.loginError);
    }

    async displayPassword(): Promise<void> {
        await BrowserActions.click(this.visibilityLabel);
        const passwordInputTypeText = $(`input[name="password"][type="text"]`);
        await BrowserVisibility.waitUntilElementIsVisible(passwordInputTypeText);
    }

}
