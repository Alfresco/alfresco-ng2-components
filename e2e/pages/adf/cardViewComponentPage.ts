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

import { by, element } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';
import { ElementFinder } from 'protractor/built/element';

export class CardViewComponentPage {

    addButton = element(by.className('adf-card-view__key-value-pairs__add-btn'));
    keyValueRow = 'card-view__key-value-pairs__row';
    selectValue = 'mat-option';
    textField = element(by.css(`input[data-automation-id='card-textitem-editinput-name']`));
    intField = element(by.css(`input[data-automation-id='card-textitem-editinput-int']`));
    floatField = element(by.css(`input[data-automation-id='card-textitem-editinput-float']`));
    valueInputField = element(by.xpath(`//*[contains(@id,'input') and @placeholder='Value']`));
    nameInputField = element(by.xpath(`//*[contains(@id,'input') and @placeholder='Name']`));
    consoleLog = element(by.className('adf-console'));
    deleteButton = element.all(by.className('adf-card-view__key-value-pairs__remove-btn')).first();
    select = element(by.css('mat-select[data-automation-class="select-box"]'));
    checkbox = element(by.css(`mat-checkbox[data-automation-id='card-boolean-boolean']`));
    resetButton = element(by.css(`#adf-reset-card-log`));
    listContent = element(by.css('.mat-select-panel'));
    editableSwitch = element(by.id('adf-toggle-editable'));

    clickOnAddButton() {
        BrowserActions.click(this.addButton);
        return this;
    }

    clickOnResetButton() {
        BrowserActions.click(this.resetButton);
        return this;
    }

    clickOnTextField() {
        const toggleText = element(by.css(`div[data-automation-id='card-textitem-edit-toggle-name']`));
        BrowserActions.click(toggleText);
        BrowserVisibility.waitUntilElementIsVisible(this.textField);
        return this;
    }

    clickOnTextClearIcon() {
        const clearIcon = element(by.css(`mat-icon[data-automation-id="card-textitem-reset-name"]`));
        BrowserActions.click(clearIcon);
    }

    clickOnTextSaveIcon() {
        const saveIcon = element(by.css(`mat-icon[data-automation-id="card-textitem-update-name"]`));
        BrowserActions.click(saveIcon);
    }

    getTextFieldText() {
        const textField = element(by.css(`span[data-automation-id="card-textitem-value-name"]`));
        return BrowserActions.getText(textField);
    }

    enterTextField(text) {
        BrowserVisibility.waitUntilElementIsVisible(this.textField);
        BrowserActions.clearSendKeys(this.textField, text);
        return this;
    }

    clickOnIntField() {
        const toggleText = element(by.css('div[data-automation-id="card-textitem-edit-toggle-int"]'));
        BrowserActions.click(toggleText);
        BrowserVisibility.waitUntilElementIsVisible(this.intField);
        return this;
    }

    clickOnIntClearIcon() {
        const clearIcon = element(by.css('mat-icon[data-automation-id="card-textitem-reset-int"]'));
        BrowserActions.click(clearIcon);
    }

    clickOnIntSaveIcon() {
        const saveIcon = element(by.css('mat-icon[data-automation-id="card-textitem-update-int"]'));
        BrowserActions.click(saveIcon);
    }

    enterIntField(text) {
        BrowserVisibility.waitUntilElementIsVisible(this.intField);
        BrowserActions.clearSendKeys(this.intField, text);
        return this;
    }

    getIntFieldText() {
        const textField = element(by.css('span[data-automation-id="card-textitem-value-int"]'));
        return BrowserActions.getText(textField);
    }

    getErrorInt() {
        const errorElement = element(by.css('mat-error[data-automation-id="card-textitem-error-int"]'));
        return BrowserActions.getText(errorElement);
    }

    clickOnFloatField() {
        const toggleText = element(by.css('div[data-automation-id="card-textitem-edit-toggle-float"]'));
        BrowserActions.click(toggleText);
        BrowserVisibility.waitUntilElementIsVisible(this.floatField);
        return this;
    }

    clickOnFloatClearIcon() {
        const clearIcon = element(by.css(`mat-icon[data-automation-id="card-textitem-reset-float"]`));
        BrowserActions.click(clearIcon);
    }

    clickOnFloatSaveIcon() {
        const saveIcon = element(by.css(`mat-icon[data-automation-id="card-textitem-update-float"]`));
        BrowserActions.click(saveIcon);
    }

    enterFloatField(text) {
        BrowserVisibility.waitUntilElementIsVisible(this.floatField);
        BrowserActions.clearSendKeys(this.floatField, text);
        return this;
    }

    getFloatFieldText() {
        const textField = element(by.css('span[data-automation-id="card-textitem-value-float"]'));
        return BrowserActions.getText(textField);
    }

    getErrorFloat() {
        const errorElement = element(by.css('mat-error[data-automation-id="card-textitem-error-float"]'));
        return BrowserActions.getText(errorElement);
    }

    setName(name) {
        BrowserVisibility.waitUntilElementIsVisible(this.nameInputField);
        this.nameInputField.sendKeys(name);
        return this;
    }

    setValue(value) {
        BrowserVisibility.waitUntilElementIsVisible(this.valueInputField);
        this.valueInputField.sendKeys(value);
        return this;
    }

    waitForOutput() {
        BrowserVisibility.waitUntilElementIsVisible(this.consoleLog);
        return this;
    }

    getOutputText(index) {
        return BrowserActions.getText(this.consoleLog.all(by.css('p')).get(index));
    }

    deletePairsValues() {
        BrowserActions.click(this.deleteButton);
        return this;
    }

    clickSelectBox() {
        BrowserActions.click(this.select);
        BrowserVisibility.waitUntilElementIsVisible(this.listContent);
    }

    checkboxClick() {
        BrowserActions.click(this.checkbox);
    }

    selectValueFromComboBox(index) {
        const value: ElementFinder = element.all(by.className(this.selectValue)).get(index);
        BrowserActions.click(value);
        return this;
    }

    disableEdit() {
        BrowserVisibility.waitUntilElementIsVisible(this.editableSwitch);

        this.editableSwitch.getAttribute('class').then((check) => {
            if (check.indexOf('mat-checked') > -1) {
                this.editableSwitch.click();
                expect(this.editableSwitch.getAttribute('class')).not.toContain('mat-checked');
            }
        });
    }

}
