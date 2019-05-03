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
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class StartProcessPage {

    defaultProcessName = element(by.css('input[id="processName"]'));
    processNameInput = element(by.id('processName'));
    selectProcessDropdownArrow = element(by.css('button[id="adf-select-process-dropdown"]'));
    cancelProcessButton = element(by.id('cancel_process'));
    formStartProcessButton = element(by.css('button[data-automation-id="adf-form-start process"]'));
    startProcessButton = element(by.css('button[data-automation-id="btn-start"]'));
    noProcess = element(by.id('no-process-message'));
    processDefinition = element(by.css('input[id="processDefinitionName"]'));
    processDefinitionOptionsPanel = element(by.css('div[class*="processDefinitionOptions"]'));

    checkNoProcessMessage() {
        BrowserVisibility.waitUntilElementIsVisible(this.noProcess);
    }

    pressDownArrowAndEnter() {
        this.processDefinition.sendKeys(protractor.Key.ARROW_DOWN);
        return browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }

    checkNoProcessDefinitionOptionIsDisplayed() {
        BrowserVisibility.waitUntilElementIsNotOnPage(this.processDefinitionOptionsPanel);
    }

    getDefaultName() {
        BrowserVisibility.waitUntilElementIsVisible(this.defaultProcessName);
        return this.defaultProcessName.getAttribute('value');
    }

    deleteDefaultName(name) {
        BrowserVisibility.waitUntilElementIsVisible(this.processNameInput);
        this.processNameInput.getAttribute('value').then((currentValue) => {
            for (let i = currentValue.length; i >= 0; i--) {
                if (currentValue === name) {
                    this.processNameInput.sendKeys(protractor.Key.BACK_SPACE);
                }
            }
        });
    }

    enterProcessName(name) {
        BrowserVisibility.waitUntilElementIsVisible(this.processNameInput);
        this.clearProcessName();
        this.processNameInput.sendKeys(name);
    }

    clearProcessName() {
        BrowserVisibility.waitUntilElementIsVisible(this.processNameInput);
        this.processNameInput.clear();
    }

    selectFromProcessDropdown(name) {
        this.clickProcessDropdownArrow();
        return this.selectOption(name);
    }

    clickProcessDropdownArrow() {
        BrowserActions.click(this.selectProcessDropdownArrow);
    }

    checkOptionIsDisplayed(name) {
        const selectProcessDropdown = element(by.cssContainingText('.mat-option-text', name));
        BrowserVisibility.waitUntilElementIsVisible(selectProcessDropdown);
        BrowserVisibility.waitUntilElementIsClickable(selectProcessDropdown);
        return this;
    }

    checkOptionIsNotDisplayed(name) {
        const selectProcessDropdown = element(by.cssContainingText('.mat-option-text', name));
        BrowserVisibility.waitUntilElementIsNotOnPage(selectProcessDropdown);
        return this;
    }

    selectOption(name) {
        const selectProcessDropdown = element(by.cssContainingText('.mat-option-text', name));
        BrowserActions.click(selectProcessDropdown);
        return this;
    }

    typeProcessDefinition(name) {
        BrowserVisibility.waitUntilElementIsVisible(this.processDefinition);
        BrowserVisibility.waitUntilElementIsClickable(this.processDefinition);
        this.processDefinition.clear();
        this.processDefinition.sendKeys(name);
        return this;
    }

    getProcessDefinitionValue() {
        BrowserVisibility.waitUntilElementIsVisible(this.processDefinition);
        return this.processDefinition.getAttribute('value');
    }

    clickCancelProcessButton() {
        BrowserActions.click(this.cancelProcessButton);
    }

    clickFormStartProcessButton() {
        return BrowserActions.click(this.formStartProcessButton);

    }

    checkStartProcessButtonIsEnabled() {
        expect(this.startProcessButton.isEnabled()).toBe(true);
    }

    checkStartProcessButtonIsDisabled() {
        expect(this.startProcessButton.isEnabled()).toBe(false);
    }

    clickStartProcessButton() {
        return BrowserActions.click(this.startProcessButton);
    }

    checkSelectProcessPlaceholderIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.processDefinition);
        const processPlaceholder = this.processDefinition.getAttribute('value').then(((result) => {
            return result;
        }));
        return processPlaceholder;
    }

    checkValidationErrorIsDisplayed(error, elementRef = 'mat-error') {
        const errorElement = element(by.cssContainingText(elementRef, error));
        BrowserVisibility.waitUntilElementIsVisible(errorElement);
        return this;
    }

    blur(locator) {
        BrowserActions.click(locator);
        locator.sendKeys(Key.TAB);
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
