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

import { $, $$ } from 'protractor';
import { BrowserVisibility } from '../utils/browser-visibility';
import { BrowserActions } from '../utils/browser-actions';

export class SnackbarPage {

    notificationSnackBar = $$('simple-snack-bar span').first();
    snackBarAction = $('simple-snack-bar button span');
    snackBarContainerCss = $$('.mat-snack-bar-container');

    async waitForSnackBarToAppear(timeout = 5000) {
        return BrowserVisibility.waitUntilElementIsVisible(this.snackBarContainerCss.first(), timeout,
            'snackbar did not appear'
        );
    }

    async waitForSnackBarToClose(timeout = 5000) {
        return BrowserVisibility.waitUntilElementIsNotVisible(this.snackBarContainerCss.first(), timeout);
    }

    async getSnackBarMessage(): Promise<string> {
        await this.waitForSnackBarToAppear();
        return this.notificationSnackBar.getText();
    }

    async getSnackBarActionMessage(): Promise<string> {
        await this.waitForSnackBarToAppear();
        return this.snackBarAction.getText();
    }

    async clickSnackBarAction(): Promise<void> {
        await this.waitForSnackBarToAppear();
        await BrowserActions.click(this.snackBarAction);
    }

    async isNotificationSnackBarDisplayed(): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.notificationSnackBar, 2000);
            return true;
        } catch {
            return false;
        }
    }
}
