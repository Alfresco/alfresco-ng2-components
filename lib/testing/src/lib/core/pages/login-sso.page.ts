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

import { element, by, browser, protractor } from 'protractor';
import { BrowserVisibility } from '../utils/browser-visibility';
import { BrowserActions } from '../utils/browser-actions';

export class LoginSSOPage {

    ssoButton = element(by.css(`[data-automation-id="login-button-sso"]`));
    usernameField = element(by.id('username'));
    passwordField = element(by.id('password'));
    loginButton = element(by.css('input[class="submit"]'));
    header = element(by.id('adf-header'));
    loginError = element(by.css(`div[data-automation-id="login-error"]`));

    loginSSOIdentityService(username, password) {
        browser.ignoreSynchronization = true;
        BrowserVisibility.waitUntilElementIsVisible(this.usernameField);
        this.enterUsername(username);
        this.enterPassword(password);
        this.clickLoginButton();
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
        return BrowserVisibility.waitUntilElementIsVisible(this.header);
    }

    clickOnSSOButton() {
        return BrowserActions.clickExecuteScript('[data-automation-id="login-button-sso"]');
    }

    enterUsername(username) {
        BrowserActions.clearSendKeys(this.usernameField, username);
    }

    enterPassword(password) {
        BrowserActions.clearSendKeys(this.passwordField, password);
    }

    clickLoginButton() {
        return BrowserActions.click(this.loginButton);
    }

    checkLoginErrorIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.loginError);
    }

    getLoginErrorMessage() {
        return BrowserActions.getText(this.loginError);
    }

}
