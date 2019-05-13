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

export class ChecklistDialog {

    nameField = element(by.css('input[data-automation-id="checklist-name"]'));
    addChecklistButton = element(by.css('button[id="add-check"] span'));
    closeButton = element(by.css('button[id="close-check-dialog"] span'));
    dialogTitle = element(by.id('add-checklist-title'));

    addName(name) {
        BrowserVisibility.waitUntilElementIsClickable(this.nameField);
        BrowserActions.clearSendKeys(this.nameField, name);
        return this;
    }

    clickCreateChecklistButton() {
        BrowserActions.click(this.addChecklistButton);
    }

    clickCancelButton() {
        BrowserActions.click(this.closeButton);
    }

    getDialogTitle() {
        return BrowserActions.getText(this.dialogTitle);
    }

    getNameFieldPlaceholder() {
        BrowserVisibility.waitUntilElementIsVisible(this.nameField);
        return this.nameField.getAttribute('placeholder');
    }

    checkCancelButtonIsEnabled() {
        BrowserVisibility.waitUntilElementIsVisible(this.closeButton);
        BrowserVisibility.waitUntilElementIsClickable(this.closeButton);
        return this;
    }

    checkAddChecklistButtonIsEnabled() {
        BrowserVisibility.waitUntilElementIsVisible(this.addChecklistButton);
        BrowserVisibility.waitUntilElementIsClickable(this.addChecklistButton);
        return this;
    }

}
