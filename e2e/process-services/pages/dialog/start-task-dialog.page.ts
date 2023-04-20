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

import { element, by, Key, ElementFinder, $ } from 'protractor';
import { BrowserVisibility, BrowserActions, DropdownPage } from '@alfresco/adf-testing';

export class StartTaskDialogPage {

    name = $('input[id="name_id"]');
    dueDate = $('input[id="date_id"]');
    description = $('textarea[id="description_id"]');
    assignee = $('div#people-widget-content input');
    startButton = $('button[id="button-start"]');
    startButtonEnabled = $('button[id="button-start"]:not(disabled)');
    cancelButton = $('button[id="button-cancel"]');

    selectFormDropdown = new DropdownPage($('mat-select[id="form_id"]'));
    selectAssigneeDropdown = new DropdownPage();

    async addName(userName: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.name);
        await this.name.clear();
        await this.name.sendKeys(userName);
    }

    async addDescription(userDescription: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.description);
        await this.description.sendKeys(userDescription);
    }

    async addDueDate(date: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.dueDate);
        await this.dueDate.sendKeys(date);
    }

    async addAssignee(name: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.assignee);
        await this.assignee.sendKeys(name);
        await this.selectAssigneeFromList(name);
    }

    async selectAssigneeFromList(name: string): Promise<void> {
        await this.selectAssigneeDropdown.selectOption(name);
    }

    async getAssignee(): Promise<string> {
        return BrowserActions.getAttribute(this.assignee, 'data-placeholder');
    }

    async selectForm(form): Promise<void> {
        await this.selectFormDropdown.selectDropdownOption(form);
    }

    async clickStartButton(): Promise<void> {
        return BrowserActions.click(this.startButton);
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
}
