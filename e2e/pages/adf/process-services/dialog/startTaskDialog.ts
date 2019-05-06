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

import { element, by, Key } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class StartTaskDialog {

    name = element(by.css('input[id="name_id"]'));
    dueDate = element(by.css('input[id="date_id"]'));
    description = element(by.css('textarea[id="description_id"]'));
    assignee = element(by.css('div#people-widget-content input'));
    startButton = element(by.css('button[id="button-start"]'));
    startButtonEnabled = element(by.css('button[id="button-start"]:not(disabled)'));
    cancelButton = element(by.css('button[id="button-cancel"]'));
    formDropDown = element(by.css('mat-select[id="form_id"]'));

    addName(userName) {
        BrowserVisibility.waitUntilElementIsVisible(this.name);
        this.name.clear();
        this.name.sendKeys(userName);
        return this;
    }

    addDescription(userDescription) {
        BrowserVisibility.waitUntilElementIsVisible(this.description);
        this.description.sendKeys(userDescription);
        return this;
    }

    addDueDate(date) {
        BrowserVisibility.waitUntilElementIsVisible(this.dueDate);
        this.dueDate.sendKeys(date);
        return this;
    }

    addAssignee(name) {
        BrowserVisibility.waitUntilElementIsVisible(this.assignee);
        this.assignee.sendKeys(name);
        this.selectAssigneeFromList(name);
        return this;
    }

    selectAssigneeFromList(name) {
        const assigneeRow = element(by.cssContainingText('mat-option span.adf-people-label-name', name));
        BrowserActions.click(assigneeRow);
        BrowserVisibility.waitUntilElementIsNotVisible(assigneeRow);
        return this;
    }

    getAssignee() {
        BrowserVisibility.waitUntilElementIsVisible(this.assignee);
        return this.assignee.getAttribute('placeholder');
    }

    addForm(form) {
        BrowserActions.click(this.formDropDown);
        return this.selectForm(form);
    }

    selectForm(form) {
        const option = element(by.cssContainingText('span[class*="mat-option-text"]', form));
        BrowserActions.click(option);
        return this;
    }

    clickStartButton() {
        return BrowserActions.click(this.startButton);
    }

    checkStartButtonIsEnabled() {
        BrowserVisibility.waitUntilElementIsVisible(this.startButtonEnabled);
        return this;
    }

    checkStartButtonIsDisabled() {
        BrowserVisibility.waitUntilElementIsVisible(element(by.css('button[id="button-start"]:disabled')));
        return this;
    }

    clickCancelButton() {
        return BrowserActions.click(this.cancelButton);
    }

    blur(locator) {
        BrowserActions.click(locator);
        locator.sendKeys(Key.TAB);
        return this;
    }

    checkValidationErrorIsDisplayed(error, elementRef = 'mat-error') {
        const errorElement = element(by.cssContainingText(elementRef, error));
        BrowserVisibility.waitUntilElementIsVisible(errorElement);
        return this;
    }
}
