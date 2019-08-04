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

import { element, by, browser, ElementFinder } from 'protractor';
import { BrowserActions } from '../utils/browser-actions';

export class LoginSSOPage {

    ssoButton: ElementFinder = element(by.css(`[data-automation-id="login-button-sso"]`));
    usernameField: ElementFinder = element(by.id('username'));
    passwordField: ElementFinder = element(by.id('password'));
    loginButton: ElementFinder = element(by.css('input[type="submit"]'));
    header: ElementFinder = element(by.id('adf-header'));
    loginError: ElementFinder = element(by.css(`div[data-automation-id="login-error"]`));
    sidenavLayout = element(by.css(`[data-automation-id="sidenav-layout"]`));

    async loginSSOIdentityService(username, password): Promise<void> {
        await browser.waitForAngularEnabled(false);
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();
        const hasError = await this.checkLoginErrorIsDisplayed();
        if (!hasError) {
            await browser.waitForAngularEnabled(true);
        }
    }

    async clickOnSSOButton(): Promise<void> {
        await BrowserActions.click(this.ssoButton);
    }

    async enterUsername(username): Promise<void> {
        await BrowserActions.clearSendKeys(this.usernameField, username);
    }

    async enterPassword(password): Promise<void> {
        await BrowserActions.clearSendKeys(this.passwordField, password);
    }

    async clickLoginButton(): Promise<void> {
        await BrowserActions.clickExecuteScript('input[type="submit"]');
    }

    async checkLoginErrorIsDisplayed(): Promise<any> {
        return await browser.isElementPresent(this.loginError);
    }

    async getLoginErrorMessage(): Promise<string> {
        return BrowserActions.getText(this.loginButton);
    }
}
