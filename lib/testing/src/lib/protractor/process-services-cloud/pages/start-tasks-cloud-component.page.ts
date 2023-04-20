/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { element, by, Key, ElementFinder, $, $$ } from 'protractor';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';
import { DropdownPage } from '../../core/pages/material/dropdown.page';

export class StartTasksCloudPage {

    name = $('input[id="name_id"]');
    dueDate = $('input[id="date_id"]');
    description = $('textarea[id="description_id"]');
    priority = $('mat-select[formcontrolname="priority"]');
    startButton = $('button[id="button-start"]');
    startButtonEnabled = $('button[id="button-start"]:not(disabled)');
    cancelButton = $('button[id="button-cancel"]');
    form = $$('adf-cloud-start-task form').first();
    formDefinitionSelector = $('.adf-form-definition-selector');
    priorityStartTaskField = $('input[formControlName="priority"]');

    async checkFormIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.form);
    }

    async addName(userName: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.name, userName);
    }

    async addDescription(userDescription: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.description, userDescription);
    }

    async addPriority(userPriority: string): Promise<void> {
        // await BrowserActions.clearSendKeys(this.priority, userPriority);
        const priorityDropdown = new DropdownPage(this.priority);
        await priorityDropdown.selectDropdownOption(userPriority);
    }

    async addDueDate(date: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.dueDate);
        await BrowserActions.clearSendKeys(this.dueDate, date);
    }

    async clickStartButton(): Promise<void> {
        await BrowserActions.click(this.startButton);
    }

    async checkStartButtonIsEnabled(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.startButtonEnabled);
    }

    async checkStartButtonIsDisabled(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible($('button[id="button-start"]:disabled'));
    }

    async clickCancelButton(): Promise<void> {
        await BrowserActions.click(this.cancelButton);
    }

    async blur(locator: ElementFinder): Promise<void> {
        await BrowserActions.click(locator);
        await locator.sendKeys(Key.TAB);
    }

    async checkValidationErrorIsDisplayed(error: string, elementRef = 'mat-error'): Promise<void> {
        const errorElement = element(by.cssContainingText(elementRef, error));
        await BrowserVisibility.waitUntilElementIsVisible(errorElement);
    }

    async validateDate(error: string): Promise<void> {
        await this.checkValidationErrorIsDisplayed(error, '.adf-error-text');
    }

    async selectFormDefinition(option: string): Promise<void> {
        await BrowserActions.click(this.formDefinitionSelector);
        const row = element(by.xpath(`//mat-option/child::span [text() = '${option}']`));
        await BrowserActions.click(row);
    }

    async checkFormDefinitionIsDisplayed(option: string): Promise<void> {
        await BrowserActions.click(this.formDefinitionSelector);
        const row = element(by.cssContainingText('mat-option span', option));
        await BrowserVisibility.waitUntilElementIsVisible(row);
        await BrowserActions.closeMenuAndDialogs();
    }

    async checkFormDefinitionIsNotDisplayed(option: string): Promise<void> {
        await BrowserActions.click(this.formDefinitionSelector);
        const row = element(by.cssContainingText('mat-option span', option));
        await BrowserVisibility.waitUntilElementIsNotVisible(row);
        await BrowserActions.closeMenuAndDialogs();
    }

    async typePriorityOf(priorityValue: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.priorityStartTaskField);
        await BrowserActions.clearSendKeys(this.priorityStartTaskField, priorityValue);
    }
}
