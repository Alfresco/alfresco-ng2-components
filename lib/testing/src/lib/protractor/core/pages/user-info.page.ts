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

import { $, $$ } from 'protractor';
import { BrowserVisibility } from '../utils/browser-visibility';
import { BrowserActions } from '../utils/browser-actions';

export class UserInfoPage {
    dialog = $$('mat-card[class*="adf-userinfo-card"]').first();
    userInfoSsoHeaderTitle = this.dialog.$('div[id="identity-username"]');
    userInfoSsoTitle = $('.adf-userinfo__detail-title');
    ssoEmail = $('#identity-email');
    userProfileButton = $('button[data-automation-id="adf-user-profile"]');

    async dialogIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.dialog);
    }

    async clickUserProfile(): Promise<void> {
        await BrowserActions.click(this.userProfileButton);
    }

    async getSsoHeaderTitle(): Promise<string> {
        return BrowserActions.getText(this.userInfoSsoHeaderTitle);
    }

    async getSsoTitle(): Promise<string> {
        return BrowserActions.getText(this.userInfoSsoTitle);
    }

    async getSsoEmail(): Promise<string> {
        return BrowserActions.getText(this.ssoEmail);
    }

    async closeUserProfile(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.dialog);
        await BrowserActions.closeMenuAndDialogs();
    }
}
