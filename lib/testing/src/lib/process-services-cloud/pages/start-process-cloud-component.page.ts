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

import { by, element, Key, protractor, browser, ElementFinder } from 'protractor';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';
import { FormFields } from '../../core/pages/form/formFields';

export class StartProcessCloudPage {

    defaultProcessName = element(by.css('input[id="processName"]'));
    processNameInput = element(by.id('processName'));
    selectProcessDropdownArrow = element(by.css('button[id="adf-select-process-dropdown"]'));
    cancelProcessButton = element(by.id('cancel_process'));
    formStartProcessButton = element(by.css('button[data-automation-id="adf-form-start process"]'));
    startProcessButton = element(by.css('button[data-automation-id="btn-start"]'));
    noProcess = element(by.id('no-process-message'));
    processDefinition = element(by.css('input[id="processDefinitionName"]'));
    processDefinitionOptionsPanel = element(by.css('div[class*="processDefinitionOptions"]'));

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
        await BrowserVisibility.waitUntilElementIsVisible(this.processNameInput);
        await BrowserActions.clearSendKeys(this.processNameInput, name);
    }

    async getProcessName(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.processNameInput);
        return this.processNameInput.getAttribute('value');
    }

    async selectFromProcessDropdown(name: string): Promise<void> {
        await this.clickProcessDropdownArrow();
        await this.selectOption(name);
    }

    async clickProcessDropdownArrow(): Promise<void> {
        await BrowserActions.click(this.selectProcessDropdownArrow);
    }

    async checkOptionIsDisplayed(name: string): Promise<void> {
        const selectProcessDropdown = element(by.cssContainingText('.mat-option-text', name));
        await BrowserVisibility.waitUntilElementIsVisible(selectProcessDropdown);
        await BrowserVisibility.waitUntilElementIsClickable(selectProcessDropdown);
    }

    async selectOption(name: string): Promise<void> {
        const selectProcessDropdown = element(by.cssContainingText('.mat-option-text', name));
        await BrowserActions.click(selectProcessDropdown);
    }

    async clickCancelProcessButton(): Promise<void> {
        await BrowserActions.click(this.cancelProcessButton);
    }

    async checkStartProcessButtonIsEnabled(): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsPresent(this.startProcessButton);
        return this.startProcessButton.isEnabled();
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

    formFields(): FormFields {
        return new FormFields();
    }
}
