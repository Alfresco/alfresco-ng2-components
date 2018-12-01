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

export class LockFilePage {

    cancelButton =  element(by.css('button[aria-label="Close dialog"]'));
    saveButton = element(by.cssContainingText('button span', 'Save'));
    lockFileCheckboxText = element(by.cssContainingText('mat-checkbox label span', ' Lock file '));
    lockFileCheckbox = element(by.css('mat-checkbox[data-automation-id="adf-lock-node-checkbox"]'));
    allowOwnerCheckbox = element(by.cssContainingText('mat-checkbox[class*="adf-lock-file-name"] span', ' Allow the owner to modify this file '));

    checkLockFileCheckboxIsDisplayed() {
        return Util.waitUntilElementIsVisible(this.lockFileCheckboxText);
    }

    checkCancelButtonIsDisplayed() {
        return Util.waitUntilElementIsVisible(this.cancelButton);
    }

    checkSaveButtonIsDisplayed() {
        return Util.waitUntilElementIsVisible(this.saveButton);
    }

    clickCancelButton() {
        Util.waitUntilElementIsClickable(this.cancelButton);
        return this.cancelButton.click();
    }

    clickLockFileCheckbox() {
        Util.waitUntilElementIsClickable(this.lockFileCheckbox);
        return this.lockFileCheckbox.click();
    }

    clickSaveButton() {
        Util.waitUntilElementIsClickable(this.saveButton);
        return this.saveButton.click();
    }

    clickAllowOwnerCheckbox() {
        Util.waitUntilElementIsClickable(this.allowOwnerCheckbox);
        return this.allowOwnerCheckbox.click();
    }
}
