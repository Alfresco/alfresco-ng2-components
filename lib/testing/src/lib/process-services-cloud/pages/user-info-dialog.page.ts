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

export class UserInfoDialogPage {

    dialog = element.all(by.css('mat-card[class*="adf-userinfo-card"]')).first();
    userInfoSsoHeaderTitle = this.dialog.element(by.css('div[id="identity-username"]'));
    userInfoSsoTitle = element(by.css('.adf-userinfo__detail-title'));
    ssoEmail = element(by.id('identity-email'));

    getSsoHeaderTitle () {
        BrowserVisibility.waitUntilElementIsVisible(this.userInfoSsoHeaderTitle);
        return this.userInfoSsoHeaderTitle.getText();
    }

    getSsoTitle() {
        BrowserVisibility.waitUntilElementIsVisible(this.userInfoSsoTitle);
        return this.userInfoSsoTitle.getText();
    }

    getSsoEmail() {
        BrowserVisibility.waitUntilElementIsVisible(this.ssoEmail);
        return this.ssoEmail.getText();
    }

    closeUserProfile() {
        BrowserVisibility.waitUntilElementIsVisible(this.dialog);
        browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
    }
}
