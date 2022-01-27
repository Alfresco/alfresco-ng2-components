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

import { browser, protractor } from 'protractor';
import { BrowserVisibility } from '../utils/browser-visibility';
import { BrowserActions } from '../utils/browser-actions';
import { LocalStorageUtil } from '../utils/local-storage.util';
import { Logger } from '../utils/logger';
import { ADFPage } from '../../page';

export class LoginPage extends ADFPage {

    loginUrl = `/login`;

    ssoButton = this.page.$(`[data-automation-id="login-button-sso"]`);
    usernameField = this.page.$('#username');
    passwordField = this.page.$('#password');
    loginButton = this.page.$('input[type="submit"]');
    header = this.page.$('adf-layout-header');
    loginError = this.page.$(`div[data-automation-id="login-error"]`);
    visibilityLabel = this.page.$('#v');

    txtUsernameBasicAuth = this.page.$('input[id="username"]');
    txtPasswordBasicAuth = this.page.$('input[id="password"]');
    signInButtonBasicAuth = this.page.$('#login-button');

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

    async login(username: string, password: string) {
        Logger.log('Login With ' + username);

        const localStorageUtil = new LocalStorageUtil(this.page);
        const authType = await localStorageUtil.getConfigField('authType');

        if (!authType || authType === 'OAUTH') {
            await this.loginSSOIdentityService(username, password);
        } else {
            await this.loginBasicAuth(username, password);
        }

        await browser.waitForAngular();
    }

    async loginSSOIdentityService(username: string, password: string) {
        const localStorageUtil = new LocalStorageUtil(this.page);
        const oauth2 = await localStorageUtil.getConfigField('oauth2');

        await this.page.goto('https://adfdev.envalfresco.com/adf');

        if (oauth2 && oauth2.silentLogin === false) {
            await this.clickOnSSOButton();
        }

        await this.displayPassword();
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();
        await this.page.keyboard.press(protractor.Key.ENTER);
    }

    async loginBasicAuth(username: string, password: string): Promise<void> {
        await this.goToLoginPage();

        await this.enterUsernameBasicAuth(username);
        await this.enterPasswordBasicAuth(password);
        await this.clickSignInBasicAuthButton();
        await BrowserVisibility.waitUntilElementIsVisible(this.header);
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
        (await this.visibilityLabel).isVisible();
        await BrowserActions.click(this.visibilityLabel);
        const passwordInputTypeText = this.page.$(`input[name="password"][type="text"]`);
        await BrowserVisibility.waitUntilElementIsVisible(passwordInputTypeText);
    }

}
