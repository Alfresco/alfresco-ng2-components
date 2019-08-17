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

import { element, by, Key, ElementFinder } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class StartTaskDialog {

    name: ElementFinder = element(by.css('input[id="name_id"]'));
    dueDate: ElementFinder = element(by.css('input[id="date_id"]'));
    description: ElementFinder = element(by.css('textarea[id="description_id"]'));
    assignee: ElementFinder = element(by.css('div#people-widget-content input'));
    startButton: ElementFinder = element(by.css('button[id="button-start"]'));
    startButtonEnabled: ElementFinder = element(by.css('button[id="button-start"]:not(disabled)'));
    cancelButton: ElementFinder = element(by.css('button[id="button-cancel"]'));
    formDropDown: ElementFinder = element(by.css('mat-select[id="form_id"]'));

    async addName(userName): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.name);
        await this.name.clear();
        await this.name.sendKeys(userName);
    }

    async addDescription(userDescription): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.description);
        await this.description.sendKeys(userDescription);
    }

    async addDueDate(date): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.dueDate);
        await this.dueDate.sendKeys(date);
    }

    async addAssignee(name): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.assignee);
        await this.assignee.sendKeys(name);
        await this.selectAssigneeFromList(name);
    }

    async selectAssigneeFromList(name): Promise<void> {
        const assigneeRow: ElementFinder = element(by.cssContainingText('mat-option span.adf-people-label-name', name));
        await BrowserActions.click(assigneeRow);
        await BrowserVisibility.waitUntilElementIsNotVisible(assigneeRow);
    }

    async getAssignee(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.assignee);
        return this.assignee.getAttribute('placeholder');
    }

    async addForm(form): Promise<void> {
        await BrowserActions.click(this.formDropDown);
        return this.selectForm(form);
    }

    async selectForm(form): Promise<void> {
        const option: ElementFinder = element(by.cssContainingText('span[class*="mat-option-text"]', form));
        await BrowserActions.click(option);
    }

    async clickStartButton(): Promise<void> {
        return BrowserActions.click(this.startButton);
    }

    async checkStartButtonIsEnabled(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.startButtonEnabled);
    }

    async checkStartButtonIsDisabled(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element(by.css('button[id="button-start"]:disabled')));
    }

    async clickCancelButton(): Promise<void> {
        await BrowserActions.click(this.cancelButton);
    }

    async blur(locator): Promise<void> {
        await BrowserActions.click(locator);
        await locator.sendKeys(Key.TAB);
    }

    async checkValidationErrorIsDisplayed(error, elementRef = 'mat-error'): Promise<void> {
        const errorElement: ElementFinder = element(by.cssContainingText(elementRef, error));
        await BrowserVisibility.waitUntilElementIsVisible(errorElement);
    }
}
