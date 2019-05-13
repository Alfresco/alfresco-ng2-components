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

import { element, by } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class LockFilePage {

    cancelButton = element(by.css('button[data-automation-id="lock-dialog-btn-cancel"]'));
    saveButton = element(by.cssContainingText('button span', 'Save'));
    lockFileCheckboxText = element(by.cssContainingText('mat-checkbox label span', ' Lock file '));
    lockFileCheckbox = element(by.css('mat-checkbox[data-automation-id="adf-lock-node-checkbox"]'));
    allowOwnerCheckbox = element(by.cssContainingText('mat-checkbox[class*="adf-lock-file-name"] span', ' Allow the owner to modify this file '));

    checkLockFileCheckboxIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.lockFileCheckboxText);
    }

    checkCancelButtonIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.cancelButton);
    }

    checkSaveButtonIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
    }

    clickCancelButton() {
        BrowserActions.click(this.cancelButton);
    }

    clickLockFileCheckbox() {
        BrowserActions.click(this.lockFileCheckbox);
    }

    clickSaveButton() {
        BrowserActions.click(this.saveButton);
    }

    clickAllowOwnerCheckbox() {
        BrowserActions.click(this.allowOwnerCheckbox);
    }
}
