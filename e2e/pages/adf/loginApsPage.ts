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

import Util = require('../../util/util');
import { element, by } from 'protractor';

export class LoginAPSPage {

    ssoButton = element(by.css(`[data-automation-id="login-button-sso"]`));
    usernameField = element(by.id('username'));
    passwordField = element(by.id('password'));
    loginButton = element(by.id('kc-login'));

    async loginAPS (username, password) {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();
    }

    async clickOnSSOButton () {
        Util.waitUntilElementIsVisible(this.ssoButton);
        await this.ssoButton.click();
    }

    async enterUsername (username) {
        Util.waitUntilElementIsVisible(this.usernameField);
        await this.usernameField.clear();
        await this.usernameField.sendKeys(username);
    }

    async enterPassword (password) {
        Util.waitUntilElementIsVisible(this.passwordField);
        await this.passwordField.clear();
        await this.passwordField.sendKeys(password);
    }

    async clickLoginButton () {
        Util.waitUntilElementIsVisible(this.loginButton);
        await this.loginButton.click();
    }

}
