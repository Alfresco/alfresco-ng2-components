/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { Util } from '../../util/util';
import { element, by, browser, protractor } from 'protractor';

export class LoginSSOPage {

    ssoButton = element(by.css(`[data-automation-id="login-button-sso"]`));
    usernameField = element(by.id('username'));
    passwordField = element(by.id('password'));
    loginButton = element(by.css('input[class="submit"]'));
    header = element(by.id('adf-header'));

    loginAPS(username, password) {
        browser.ignoreSynchronization = true;
        this.enterUsername(username);
        this.enterPassword(password);
        this.clickLoginButton();
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
        return Util.waitUntilElementIsVisible(this.header);
    }

    clickOnSSOButton() {
        Util.waitUntilElementIsVisible(this.ssoButton);
        this.ssoButton.click();
    }

    enterUsername(username) {
        Util.waitUntilElementIsVisible(this.usernameField);
        this.usernameField.clear();
        this.usernameField.sendKeys(username);
    }

    enterPassword(password) {
        Util.waitUntilElementIsVisible(this.passwordField);
        this.passwordField.clear();
        this.passwordField.sendKeys(password);
    }

    clickLoginButton() {
        Util.waitUntilElementIsVisible(this.loginButton);
        return this.loginButton.click();
    }

}
