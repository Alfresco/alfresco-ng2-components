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

import { by, element, Key, protractor, browser, $ } from 'protractor';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';
import { DropdownPage } from '../../core/pages/material/dropdown.page';
import { FormFields } from '../../core/pages/form/form-fields';
import { Logger } from '../../core/utils/logger';

export class StartProcessPage {

    defaultProcessName = $('input[id="processName"]');
    processNameInput = $('#processName');
    disabledSelectProcessDropdown = $('input[id="processDefinitionName"][disabled]');
    selectProcessDropdownArrow = $('button[id="adf-select-process-dropdown"]');
    cancelProcessButton = $('#cancel_process');
    formStartProcessButton = $('button[data-automation-id="adf-form-start process"]');
    startProcessButton = $('button[data-automation-id="btn-start"]');
    startProcessButtonDisabled = $('button[data-automation-id="btn-start"][disabled]');
    noProcess = $('.adf-empty-content__title');
    processDefinition = $('input[id="processDefinitionName"]');
    processDefinitionOptionsPanel = $('div[class*="mat-autocomplete-panel"]');

    processDefinitionDropdown = new DropdownPage($('#adf-select-process-dropdown'));
    applicationDropdown = new DropdownPage($('[data-automation-id*="start-process-app"] .mat-select-arrow'));

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
        return BrowserActions.getInputValue(this.defaultProcessName);
    }

    async deleteDefaultName() {
        await BrowserVisibility.waitUntilElementIsVisible(this.processNameInput);
        await BrowserActions.clearWithBackSpace(this.processNameInput);
    }

    async enterProcessName(name): Promise<void> {
        await BrowserActions.clearSendKeys(this.processNameInput, name);
    }

    async selectFromProcessDropdown(name: string, retry = 0): Promise<void> {
        Logger.log(`select Process Dropdown retry: ${retry}`);
        try {
            await this.clickProcessDropdownArrow();
            await this.selectProcessOption(name);
        } catch (error) {
            if (retry < 3) {
                retry++;
                await this.selectFromProcessDropdown(name, retry);
            }
        }
        try {
            await BrowserVisibility.waitUntilElementIsVisible($('.mat-card-content'), 2000);
        } catch (error) {
            Logger.log(`No start form on process`);
        }

    }

    async selectFromApplicationDropdown(name): Promise<void> {
        await this.applicationDropdown.clickDropdown();
        await this.applicationDropdown.selectOption(name);
    }

    async clickProcessDropdownArrow(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.selectProcessDropdownArrow);
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
        return BrowserActions.getInputValue(this.processDefinition);
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

    async isStartProcessButtonEnabled() {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.startProcessButtonDisabled);
        return this.startProcessButton.isEnabled();
    }

    async checkStartProcessButtonIsDisabled() {
        await expect(await this.startProcessButton.isEnabled()).toBe(false);
    }

    async clickStartProcessButton(): Promise<void> {
        await BrowserActions.click(this.startProcessButton);
    }

    async checkSelectProcessPlaceholderIsDisplayed(): Promise<string> {
        return BrowserActions.getInputValue(this.processDefinition);
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

    async selectApplicationAndProcess(applicationName: string, processName: string) {
        await this.selectFromApplicationDropdown(applicationName);
        await this.checkProcessDefinitionDropdownIsEnabled();
        await this.selectFromProcessDropdown(processName);
    }
}
