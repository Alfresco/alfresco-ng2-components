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
import { ElementFinder } from 'protractor/built/element';

export class StartTasksCloudPage {

    name: ElementFinder = element(by.css('input[id="name_id"]'));
    dueDate: ElementFinder = element(by.css('input[id="date_id"]'));
    description: ElementFinder = element(by.css('textarea[id="description_id"]'));
    priority: ElementFinder = element(by.css('input[formcontrolname="priority"]'));
    startButton: ElementFinder = element(by.css('button[id="button-start"]'));
    startButtonEnabled = element(by.css('button[id="button-start"]:not(disabled)'));
    cancelButton: ElementFinder = element(by.css('button[id="button-cancel"]'));
    form: ElementFinder = element.all(by.css('adf-cloud-start-task form')).first();
    formDefinitionSelector: ElementFinder = element(by.css('.adf-form-definition-selector'));

    async checkFormIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.form);
        return this;
    }

    async addName(userName) {
        await BrowserActions.clearSendKeys(this.name, userName);
        return this;
    }

    async addDescription(userDescription) {
        await BrowserActions.clearSendKeys(this.description, userDescription);
        return this;
    }

    async addPriority(userPriority) {
        await BrowserActions.clearSendKeys(this.priority, userPriority);
        return this;
    }

    async addDueDate(date) {
        await BrowserVisibility.waitUntilElementIsVisible(this.dueDate);
        this.clearField(this.dueDate);
        this.dueDate.sendKeys(date);
        return this;
    }

    async clickStartButton() {
        return BrowserActions.click(this.startButton);
    }

    async checkStartButtonIsEnabled() {
        await BrowserVisibility.waitUntilElementIsVisible(this.startButtonEnabled);
        return this;
    }

    async checkStartButtonIsDisabled() {
        await BrowserVisibility.waitUntilElementIsVisible(element(by.css('button[id="button-start"]:disabled')));
        return this;
    }

    async clickCancelButton() {
        return BrowserActions.click(this.cancelButton);
    }

    async blur(locator) {
        await BrowserVisibility.waitUntilElementIsVisible(locator);
        await BrowserVisibility.waitUntilElementIsClickable(locator);
        await BrowserActions.click(locator);
        locator.sendKeys(Key.TAB);
        return this;
    }

    async checkValidationErrorIsDisplayed(error, elementRef = 'mat-error') {
        const errorElement = element(by.cssContainingText(elementRef, error));
        await BrowserVisibility.waitUntilElementIsVisible(errorElement);
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

    async clearField(locator): Promise<void> {
        await BrowserActions.clearSendKeys(locator, '');
    }

    async selectFormDefinition(option: string): Promise<void> {
        await BrowserActions.click(this.formDefinitionSelector);
        const row = element(by.cssContainingText('mat-option span', option));
        await BrowserActions.click(row);
    }

    async checkFormDefinitionIsDisplayed(option: string) {
        await BrowserActions.click(this.formDefinitionSelector);
        const row = element(by.cssContainingText('mat-option span', option));
        await BrowserVisibility.waitUntilElementIsVisible(row);
        await BrowserActions.closeMenuAndDialogs();
        return this;
    }

    async checkFormDefinitionIsNotDisplayed(option: string) {
        await BrowserActions.click(this.formDefinitionSelector);
        const row = element(by.cssContainingText('mat-option span', option));
        await BrowserVisibility.waitUntilElementIsNotVisible(row);
        await BrowserActions.closeMenuAndDialogs();
        return this;
    }
}
