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
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';

export class StartTasksCloudPage {

    name = element(by.css('input[id="name_id"]'));
    dueDate = element(by.css('input[id="date_id"]'));
    description = element(by.css('textarea[id="description_id"]'));
    priority = element(by.css('input[formcontrolname="priority"]'));
    startButton = element(by.css('button[id="button-start"]'));
    startButtonEnabled = element(by.css('button[id="button-start"]:not(disabled)'));
    cancelButton = element(by.css('button[id="button-cancel"]'));
    form = element.all(by.css('adf-cloud-start-task form')).first();

    checkFormIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.form);
        return this;
    }

    addName(userName) {
        BrowserActions.clearSendKeys(this.name, userName);
        return this;
    }

    addDescription(userDescription) {
        BrowserActions.clearSendKeys(this.description, userDescription);
        return this;
    }

    addPriority(userPriority) {
        BrowserActions.clearSendKeys(this.priority, userPriority);
        return this;
    }

    addDueDate(date) {
        BrowserVisibility.waitUntilElementIsVisible(this.dueDate);
        this.clearField(this.dueDate);
        this.dueDate.sendKeys(date);
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
        BrowserVisibility.waitUntilElementIsVisible(locator);
        BrowserVisibility.waitUntilElementIsClickable(locator);
        locator.click();
        locator.sendKeys(Key.TAB);
        return this;
    }

    checkValidationErrorIsDisplayed(error, elementRef = 'mat-error') {
        const errorElement = element(by.cssContainingText(elementRef, error));
        BrowserVisibility.waitUntilElementIsVisible(errorElement);
        return this;
    }

    validateAssignee(error) {
        this.checkValidationErrorIsDisplayed(error, '.adf-start-task-cloud-error');
        return this;
    }

    validateDate(error) {
        this.checkValidationErrorIsDisplayed(error, '.adf-error-text');
        return this;
    }

    clearField(locator) {
        BrowserActions.clearSendKeys(locator, '');
    }
}
