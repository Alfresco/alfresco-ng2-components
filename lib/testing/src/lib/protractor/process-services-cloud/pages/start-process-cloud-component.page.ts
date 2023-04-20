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

import { by, element, Key, protractor, browser, ElementFinder, $, $$ } from 'protractor';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';
import { FormFields } from '../../core/pages/form/form-fields';

export class StartProcessCloudPage {

    defaultProcessName = $('input[id="processName"]');
    processNameInput = $('[data-automation-id="adf-inplace-input"]');
    selectProcessDropdownArrow = $('button[id="adf-select-process-dropdown"]');
    cancelProcessButton = $('#cancel_process');
    formStartProcessButton = $('button[data-automation-id="adf-form-start process"]');
    startProcessButton = $('button[data-automation-id="btn-start"]');
    startProcessButtonDisabled = $('button[data-automation-id="btn-start"][disabled]');
    noProcess = $('#no-process-message');
    processDefinition = $('input[id="processDefinitionName"]');
    processDefinitionOptionsPanel = $('div[class*="processDefinitionOptions"]');

    getSelectProcessDropdownLocatorByName = (name: string): ElementFinder => element(by.cssContainingText('.mat-option-text', name));

    async checkNoProcessMessage(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.noProcess);
    }

    async pressDownArrowAndEnter(): Promise<void> {
        await this.processDefinition.sendKeys(protractor.Key.ARROW_DOWN);
        await browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }

    async checkNoProcessDefinitionOptionIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.processDefinitionOptionsPanel);
    }

    async enterProcessName(name: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.processNameInput, name);
    }

    async getProcessName(): Promise<string> {
        return BrowserActions.getInputValue(this.processNameInput);
    }

    async selectFromProcessDropdown(name: string): Promise<void> {
        await this.clickProcessDropdownArrow();
        await this.selectOption(name);
    }

    async selectFirstOptionFromProcessDropdown(): Promise<void> {
        await this.clickProcessDropdownArrow();
        const selectFirstProcessDropdown = $$('.mat-option-text').first();
        await BrowserActions.click(selectFirstProcessDropdown);
    }

    async clickProcessDropdownArrow(): Promise<void> {
        await BrowserActions.click(this.selectProcessDropdownArrow);
    }

    async checkOptionIsDisplayed(name: string): Promise<void> {
        const selectProcessDropdown = this.getSelectProcessDropdownLocatorByName(name);
        await BrowserVisibility.waitUntilElementIsVisible(selectProcessDropdown);
        await BrowserVisibility.waitUntilElementIsClickable(selectProcessDropdown);
    }

    async selectOption(name: string): Promise<void> {
        const selectProcessDropdown = this.getSelectProcessDropdownLocatorByName(name);
        await BrowserActions.click(selectProcessDropdown);
    }

    async clickCancelProcessButton(): Promise<void> {
        await BrowserActions.click(this.cancelProcessButton);
    }

    async isStartProcessButtonEnabled(): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.startProcessButtonDisabled);
        await BrowserVisibility.waitUntilElementIsVisible(this.startProcessButton);
        await BrowserVisibility.waitUntilElementIsClickable(this.startProcessButton);

        return this.startProcessButton.isEnabled();
    }

    async isStartProcessButtonDisabled(): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.startProcessButtonDisabled);
            return true;
        } catch (error) {
            return false;
        }
    }

    async clickStartProcessButton(): Promise<void> {
        await BrowserActions.click(this.startProcessButton);
    }

    async checkValidationErrorIsDisplayed(error: string, elementRef = 'mat-error'): Promise<void> {
        const errorElement = element(by.cssContainingText(elementRef, error));
        await BrowserVisibility.waitUntilElementIsVisible(errorElement);
    }

    async blur(locator: ElementFinder): Promise<void> {
        await BrowserActions.click(locator);
        await locator.sendKeys(Key.TAB);
    }

    async clearField(locator: ElementFinder) {
        await BrowserVisibility.waitUntilElementIsVisible(locator);
        await BrowserActions.clearWithBackSpace(locator);
    }

    async startProcessWithProcessDefinition(processName: string, processDefinition: string) {
        await this.selectFromProcessDropdown(processDefinition);
        await this.enterProcessName(processName);
        await BrowserVisibility.waitUntilElementIsNotVisible(this.startProcessButtonDisabled);
        await BrowserVisibility.waitUntilElementIsVisible(this.startProcessButton);
        await this.clickStartProcessButton();
    }

    formFields(): FormFields {
        return new FormFields();
    }
}
