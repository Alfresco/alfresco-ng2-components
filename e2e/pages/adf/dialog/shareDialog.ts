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

import { element, by } from 'protractor';
import Util = require('../../../util/util');

export class ShareDialog {

    dialogTitle = element(by.id('adf-share-title'));
    shareToggle = element(by.id('adf-share-toggle'));
    shareLink = element(by.id('adf-share-link'));
    closeButton = element(by.css('button[class="mat-button mat-primary"]'));

    checkDialogIsDisplayed() {
        return Util.waitUntilElementIsVisible(this.dialogTitle);
    }

    clickShareToggle() {
        Util.waitUntilElementIsVisible(this.shareToggle);
        Util.waitUntilElementIsClickable(this.shareToggle);
        return this.shareToggle.click();

    }

    checkShareLinkIsDisplayed() {
        return Util.waitUntilElementIsVisible(this.shareLink);
    }

    getShareLink() {
        Util.waitUntilElementIsVisible(this.shareLink);
        return this.shareLink.getAttribute('value');
    }

    clickCloseButton() {
        Util.waitUntilElementIsVisible(this.closeButton);
        return this.closeButton.click();
    }
}
