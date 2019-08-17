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
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class LockFilePage {

    cancelButton: ElementFinder = element(by.css('button[data-automation-id="lock-dialog-btn-cancel"]'));
    saveButton: ElementFinder = element(by.cssContainingText('button span', 'Save'));
    lockFileCheckboxText: ElementFinder = element(by.cssContainingText('mat-checkbox label span', ' Lock file '));
    lockFileCheckbox: ElementFinder = element(by.css('mat-checkbox[data-automation-id="adf-lock-node-checkbox"]'));
    allowOwnerCheckbox: ElementFinder = element(by.cssContainingText('mat-checkbox[class*="adf-lock-file-name"] span', ' Allow the owner to modify this file '));

    async checkLockFileCheckboxIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.lockFileCheckboxText);
    }

    async checkCancelButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.cancelButton);
    }

    async checkSaveButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
    }

    async clickCancelButton(): Promise<void> {
        await BrowserActions.click(this.cancelButton);
    }

    async clickLockFileCheckbox(): Promise<void> {
        await BrowserActions.click(this.lockFileCheckbox);
    }

    async clickSaveButton(): Promise<void> {
        await BrowserActions.click(this.saveButton);
    }

    async clickAllowOwnerCheckbox(): Promise<void> {
        await BrowserActions.click(this.allowOwnerCheckbox);
    }
}
