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

import { element, by, Key, protractor } from 'protractor';
import { BrowserVisibility } from '../../core/browser-visibility';

export class StartTasksCloudPage {

    name = element(by.css('input[id="name_id"]'));
    dueDate = element(by.css('input[id="date_id"]'));
    description = element(by.css('textarea[id="description_id"]'));
    priority = element(by.css('input[formcontrolname="priority"]'));
    startButton = element(by.css('button[id="button-start"]'));
    startButtonEnabled = element(by.css('button[id="button-start"]:not(disabled)'));
    cancelButton = element(by.css('button[id="button-cancel"]'));

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

    addPriority(userPriority) {
        BrowserVisibility.waitUntilElementIsVisible(this.priority);
        this.priority.sendKeys(userPriority);
        return this;
    }

    addDueDate(date) {
        BrowserVisibility.waitUntilElementIsVisible(this.dueDate);
        this.clearField(this.dueDate);
        this.dueDate.sendKeys(date);
        return this;
    }

    clickStartButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.startButton);
        BrowserVisibility.waitUntilElementIsClickable(this.startButton);
        return this.startButton.click();
    }

    checkStartButtonIsEnabled() {
        BrowserVisibility.waitUntilElementIsVisible(this.startButtonEnabled);
        return this;
    }

    checkStartButtonIsDisabled() {
        BrowserVisibility.waitUntilElementIsVisible(this.startButton.getAttribute('disabled'));
        return this;
    }

    clickCancelButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.cancelButton);
        BrowserVisibility.waitUntilElementIsClickable(this.cancelButton);
        return this.cancelButton.click();
    }

    blur(locator) {
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
        BrowserVisibility.waitUntilElementIsVisible(locator);
        locator.getAttribute('value').then((result) => {
            for (let i = result.length; i >= 0; i--) {
                locator.sendKeys(protractor.Key.BACK_SPACE);
            }
        });
    }
}
