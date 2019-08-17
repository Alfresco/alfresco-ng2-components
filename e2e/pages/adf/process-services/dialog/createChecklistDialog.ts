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

export class ChecklistDialog {

    nameField: ElementFinder = element(by.css('input[data-automation-id="checklist-name"]'));
    addChecklistButton: ElementFinder = element(by.css('button[id="add-check"] span'));
    closeButton: ElementFinder = element(by.css('button[id="close-check-dialog"] span'));
    dialogTitle: ElementFinder = element(by.id('add-checklist-title'));

    async addName(name): Promise<void> {
        await BrowserVisibility.waitUntilElementIsClickable(this.nameField);
        await BrowserActions.clearSendKeys(this.nameField, name);
    }

    async clickCreateChecklistButton(): Promise<void> {
        await BrowserActions.click(this.addChecklistButton);
    }

    async clickCancelButton(): Promise<void> {
        await BrowserActions.click(this.closeButton);
    }

    getDialogTitle(): Promise<string> {
        return BrowserActions.getText(this.dialogTitle);
    }

    async getNameFieldPlaceholder(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.nameField);
        return this.nameField.getAttribute('placeholder');
    }

    async checkCancelButtonIsEnabled(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.closeButton);
        await BrowserVisibility.waitUntilElementIsClickable(this.closeButton);
    }

    async checkAddChecklistButtonIsEnabled(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.addChecklistButton);
        await BrowserVisibility.waitUntilElementIsClickable(this.addChecklistButton);
    }

}
