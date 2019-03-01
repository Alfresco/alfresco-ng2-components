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
import { BrowserVisibility } from '../../core/browser-visibility';
export class LoginSSOPage {

    ssoButton = element(by.css(`[data-automation-id="login-button-sso"]`));
    usernameField = element(by.id('username'));
    passwordField = element(by.id('password'));
    loginButton = element(by.css('input[class="submit"]'));
    header = element(by.id('adf-header'));

    loginAPS(username, password) {
        BrowserVisibility.waitUntilElementIsVisible(this.usernameField);
        this.enterUsername(username);
        this.enterPassword(password);
        this.clickLoginButton();
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
        return BrowserVisibility.waitUntilElementIsVisible(this.header);
    }

    clickOnSSOButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.ssoButton);
        this.ssoButton.click();
    }

    enterUsername(username) {
        BrowserVisibility.waitUntilElementIsVisible(this.usernameField);
        this.usernameField.clear();
        this.usernameField.sendKeys(username);
    }

    enterPassword(password) {
        BrowserVisibility.waitUntilElementIsVisible(this.passwordField);
        this.passwordField.clear();
        this.passwordField.sendKeys(password);
    }

    clickLoginButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.loginButton);
        return this.loginButton.click();
    }

}
