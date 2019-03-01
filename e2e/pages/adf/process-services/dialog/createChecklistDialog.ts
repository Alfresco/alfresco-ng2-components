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
import { Util } from '../../../../util/util';

export class ChecklistDialog {

    nameField = element(by.css('input[data-automation-id="checklist-name"]'));
    addChecklistButton = element(by.css('button[id="add-check"] span'));
    closeButton = element(by.css('button[id="close-check-dialog"] span'));
    dialogTitle = element(by.id('add-checklist-title'));

    addName(name) {
        Util.waitUntilElementIsClickable(this.nameField);
        this.nameField.clear();
        this.nameField.sendKeys(name);
        return this;
    }

    clickCreateChecklistButton() {
        Util.waitUntilElementIsVisible(this.addChecklistButton);
        this.addChecklistButton.click();
    }

    clickCancelButton() {
        Util.waitUntilElementIsVisible(this.closeButton);
        this.closeButton.click();
    }

    getDialogTitle() {
        Util.waitUntilElementIsVisible(this.dialogTitle);
        return this.dialogTitle.getText();
    }

    getNameFieldPlaceholder() {
        Util.waitUntilElementIsVisible(this.nameField);
        return this.nameField.getAttribute('placeholder');
    }

    checkCancelButtonIsEnabled() {
        Util.waitUntilElementIsVisible(this.closeButton);
        Util.waitUntilElementIsClickable(this.closeButton);
        return this;
    }

    checkAddChecklistButtonIsEnabled() {
        Util.waitUntilElementIsVisible(this.addChecklistButton);
        Util.waitUntilElementIsClickable(this.addChecklistButton);
        return this;
    }

}
