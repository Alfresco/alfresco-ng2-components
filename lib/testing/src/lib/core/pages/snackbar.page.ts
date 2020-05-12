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

import { element, by, ElementFinder } from 'protractor';
import { BrowserVisibility } from '../utils/browser-visibility';
import { Logger } from '../utils/logger';

export class SnackbarPage {

    notificationSnackBar: ElementFinder = element.all(by.css('simple-snack-bar')).first();
    snackBarContainerCss = by.css('.mat-snack-bar-container');

    async waitForSnackBarToAppear() {
        return BrowserVisibility.waitUntilElementIsVisible(element(this.snackBarContainerCss), 20000,
            'snackbar did not appear'
        );
    }

    async waitForSnackBarToClose() {
        return BrowserVisibility.waitUntilElementIsNotVisible(element(this.snackBarContainerCss), 20000);
    }

    async getSnackBarMessage(): Promise<string> {
        await this.waitForSnackBarToAppear();
        return this.notificationSnackBar.getAttribute('innerText');
    }

    async isNotificationSnackBarDisplayed(): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.notificationSnackBar);
        } catch (e) {
            Logger.error(`Snackbar is not displayed `);
            return false;
        }
        return true;
    }
}
