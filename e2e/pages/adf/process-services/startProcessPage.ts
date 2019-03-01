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

import { Util } from '../../../util/util';
import { by, element, Key, protractor, browser } from 'protractor';

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
        Util.waitUntilElementIsVisible(this.noProcess);
    }

    pressDownArrowAndEnter() {
        this.processDefinition.sendKeys(protractor.Key.ARROW_DOWN);
        return browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }

    checkNoProcessDefinitionOptionIsDisplayed() {
        Util.waitUntilElementIsNotOnPage(this.processDefinitionOptionsPanel);
    }

    getDefaultName() {
        Util.waitUntilElementIsVisible(this.defaultProcessName);
        return this.defaultProcessName.getAttribute('value');
    }

    deleteDefaultName(name) {
        Util.waitUntilElementIsVisible(this.processNameInput);
        this.processNameInput.getAttribute('value').then((currentValue) => {
            for (let i = currentValue.length; i >= 0; i--) {
                if (currentValue === name) {
                    this.processNameInput.sendKeys(protractor.Key.BACK_SPACE);
                }
            }
        });
    }

    enterProcessName(name) {
        Util.waitUntilElementIsVisible(this.processNameInput);
        this.clearProcessName();
        this.processNameInput.sendKeys(name);
    }

    clearProcessName() {
        Util.waitUntilElementIsVisible(this.processNameInput);
        this.processNameInput.clear();
    }

    selectFromProcessDropdown(name) {
        this.clickProcessDropdownArrow();
        return this.selectOption(name);
    }

    clickProcessDropdownArrow() {
        Util.waitUntilElementIsVisible(this.selectProcessDropdownArrow);
        Util.waitUntilElementIsClickable(this.selectProcessDropdownArrow);
        this.selectProcessDropdownArrow.click();
    }

    checkOptionIsDisplayed(name) {
        let selectProcessDropdown = element(by.cssContainingText('.mat-option-text', name));
        Util.waitUntilElementIsVisible(selectProcessDropdown);
        Util.waitUntilElementIsClickable(selectProcessDropdown);
        return this;
    }

    checkOptionIsNotDisplayed(name) {
        let selectProcessDropdown = element(by.cssContainingText('.mat-option-text', name));
        Util.waitUntilElementIsNotOnPage(selectProcessDropdown);
        return this;
    }

    selectOption(name) {
        let selectProcessDropdown = element(by.cssContainingText('.mat-option-text', name));
        Util.waitUntilElementIsVisible(selectProcessDropdown);
        Util.waitUntilElementIsClickable(selectProcessDropdown);
        selectProcessDropdown.click();
        return this;
    }

    typeProcessDefinition(name) {
        Util.waitUntilElementIsVisible(this.processDefinition);
        Util.waitUntilElementIsClickable(this.processDefinition);
        this.processDefinition.clear();
        this.processDefinition.sendKeys(name);
        return this;
    }

    getProcessDefinitionValue() {
        Util.waitUntilElementIsVisible(this.processDefinition);
        return this.processDefinition.getAttribute('value');
    }

    clickCancelProcessButton() {
        Util.waitUntilElementIsVisible(this.cancelProcessButton);
        this.cancelProcessButton.click();
    }

    clickFormStartProcessButton() {
        Util.waitUntilElementIsVisible(this.formStartProcessButton);
        Util.waitUntilElementIsClickable(this.formStartProcessButton);
        return this.formStartProcessButton.click();
    }

    checkStartProcessButtonIsEnabled() {
        expect(this.startProcessButton.isEnabled()).toBe(true);
    }

    checkStartProcessButtonIsDisabled() {
        expect(this.startProcessButton.isEnabled()).toBe(false);
    }

    clickStartProcessButton() {
        return this.startProcessButton.click();
    }

    checkSelectProcessPlaceholderIsDisplayed() {
        Util.waitUntilElementIsVisible(this.processDefinition);
        let processPlaceholder = this.processDefinition.getAttribute('value').then(((result) => {
            return result;
        }));
        return processPlaceholder;
    }

    checkValidationErrorIsDisplayed(error, elementRef = 'mat-error') {
        const errorElement = element(by.cssContainingText(elementRef, error));
        Util.waitUntilElementIsVisible(errorElement);
        return this;
    }

    blur(locator) {
        locator.click();
        locator.sendKeys(Key.TAB);
        return this;
    }

    clearField(locator) {
        Util.waitUntilElementIsVisible(locator);
        locator.getAttribute('value').then((result) => {
            for (let i = result.length; i >= 0; i--) {
                locator.sendKeys(protractor.Key.BACK_SPACE);
            }
        });
    }
}
