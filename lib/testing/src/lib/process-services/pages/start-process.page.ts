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

import { by, element, Key, protractor, browser } from 'protractor';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';
import { DropdownPage } from '../../core/pages/material/dropdown.page';
import { FormFields } from '../../core/pages/form/form-fields';

export class StartProcessPage {

    defaultProcessName = element(by.css('input[id="processName"]'));
    processNameInput = element(by.id('processName'));
    disabledSelectProcessDropdown = element(by.css('input[id="processDefinitionName"][disabled]'));
    selectProcessDropdownArrow = element(by.css('button[id="adf-select-process-dropdown"]'));
    cancelProcessButton = element(by.id('cancel_process'));
    formStartProcessButton = element(by.css('button[data-automation-id="adf-form-start process"]'));
    startProcessButton = element(by.css('button[data-automation-id="btn-start"]'));
    noProcess = element(by.css('.adf-empty-content__title'));
    processDefinition = element(by.css('input[id="processDefinitionName"]'));
    processDefinitionOptionsPanel = element(by.css('div[class*="mat-autocomplete-panel"]'));

    processDefinitionDropdown = new DropdownPage(element(by.id('adf-select-process-dropdown')));
    applicationDropdown = new DropdownPage(element(by.css('[data-automation-id*="start-process-app"] .mat-select-arrow')));

    async checkNoProcessMessage(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.noProcess);
    }

    async pressDownArrowAndEnter(): Promise<void> {
        await this.processDefinition.sendKeys(protractor.Key.ARROW_DOWN);
        await browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }

    async checkNoProcessDefinitionOptionIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.processDefinitionOptionsPanel);
    }

    async getDefaultName(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.defaultProcessName);
        return this.defaultProcessName.getAttribute('value');
    }

    async deleteDefaultName() {
        await BrowserVisibility.waitUntilElementIsVisible(this.processNameInput);
        await BrowserActions.clearWithBackSpace(this.processNameInput);
    }

    async enterProcessName(name): Promise<void> {
        await BrowserActions.clearSendKeys(this.processNameInput, name);
    }

    async selectFromProcessDropdown(name): Promise<void> {
        await this.clickProcessDropdownArrow();
        await this.selectProcessOption(name);
    }

    async selectFromApplicationDropdown(name): Promise<void> {
        await this.applicationDropdown.clickDropdown();
        await this.applicationDropdown.selectOption(name);
    }

    async clickProcessDropdownArrow(): Promise<void> {
        await BrowserActions.click(this.selectProcessDropdownArrow);
    }

    async checkProcessOptionIsDisplayed(name): Promise<void> {
        await this.processDefinitionDropdown.checkOptionIsDisplayed(name);
    }

    async checkProcessOptionIsNotDisplayed(name): Promise<void> {
        await this.processDefinitionDropdown.checkOptionIsNotDisplayed(name);
    }

    async selectProcessOption(name): Promise<void> {
        await this.processDefinitionDropdown.selectOption(name);
    }

    async typeProcessDefinition(name): Promise<void> {
        await BrowserActions.clearSendKeys(this.processDefinition, name);
    }

    async getProcessDefinitionValue(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.processDefinition);
        return this.processDefinition.getAttribute('value');
    }

    async clickCancelProcessButton(): Promise<void> {
        await BrowserActions.click(this.cancelProcessButton);
    }

    async isCancelProcessButtonEnabled(): Promise<boolean> {
        return this.cancelProcessButton.isEnabled();
    }

    async clickFormStartProcessButton(): Promise<void> {
        await BrowserActions.click(this.formStartProcessButton);
    }

    async isStartFormProcessButtonEnabled() {
        await BrowserVisibility.waitUntilElementIsVisible(this.formStartProcessButton);
        return this.formStartProcessButton.isEnabled();
    }

    async checkStartProcessButtonIsEnabled() {
        await expect(await this.startProcessButton.isEnabled()).toBe(true);
    }

    async checkStartProcessButtonIsDisabled() {
        await expect(await this.startProcessButton.isEnabled()).toBe(false);
    }

    async clickStartProcessButton(): Promise<void> {
        await BrowserActions.click(this.startProcessButton);
    }

    async checkSelectProcessPlaceholderIsDisplayed(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.processDefinition);
        const processPlaceholder = await this.processDefinition.getAttribute('value');
        return processPlaceholder;
    }

    async checkValidationErrorIsDisplayed(error: string, elementRef = 'mat-error'): Promise<void> {
        const errorElement = element(by.cssContainingText(elementRef, error));
        await BrowserVisibility.waitUntilElementIsVisible(errorElement);
    }

    async blur(locator): Promise<void> {
        await BrowserActions.click(locator);
        await locator.sendKeys(Key.TAB);
    }

    async clearField(locator): Promise<void> {
        await BrowserActions.clearWithBackSpace(locator);
    }

    formFields(): FormFields {
        return new FormFields();
    }

    async checkProcessDefinitionDropdownIsEnabled(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.disabledSelectProcessDropdown);
    }

    async startProcess(name: string, processName: string) {
        await this.selectFromProcessDropdown(processName);
        await this.enterProcessName(name);
        await this.clickStartProcessButton();
    }

    async startProcessWithApplication(name: string, applicationName: string, processName: string) {
        await this.enterProcessName(name);
        await this.selectFromApplicationDropdown(applicationName);
        await this.checkProcessDefinitionDropdownIsEnabled();
        await this.selectFromProcessDropdown(processName);
        await this.clickStartProcessButton();
    }
}
