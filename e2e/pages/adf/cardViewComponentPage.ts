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
import { BrowserVisibility } from '@alfresco/adf-testing';

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
    selectedValue = element(by.css('.mat-select-value-text span'));
    listContent = element(by.css('.mat-select-panel'));
    editableSwitch = element(by.id('adf-toggle-editable'));

    clickOnAddButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.addButton);
        this.addButton.click();
        return this;
    }

    clickOnResetButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.resetButton);
        this.resetButton.click();
        return this;
    }

    clickOnTextField() {
        const toggleText = element(by.css(`div[data-automation-id='card-textitem-edit-toggle-name']`));
        BrowserVisibility.waitUntilElementIsVisible(toggleText);
        toggleText.click();
        BrowserVisibility.waitUntilElementIsVisible(this.textField);
        return this;
    }

    clickOnTextClearIcon() {
        const clearIcon = element(by.css(`mat-icon[data-automation-id="card-textitem-reset-name"]`));
        BrowserVisibility.waitUntilElementIsVisible(clearIcon);
        return clearIcon.click();
    }

    clickOnTextSaveIcon() {
        const saveIcon = element(by.css(`mat-icon[data-automation-id="card-textitem-update-name"]`));
        BrowserVisibility.waitUntilElementIsVisible(saveIcon);
        return saveIcon.click();
    }

    getTextFieldText() {
        const textField = element(by.css(`span[data-automation-id="card-textitem-value-name"]`));
        BrowserVisibility.waitUntilElementIsVisible(textField);
        return textField.getText();
    }

    enterTextField(text) {
        BrowserVisibility.waitUntilElementIsVisible(this.textField);
        this.textField.sendKeys('');
        this.textField.clear();
        this.textField.sendKeys(text);
        return this;
    }

    clickOnIntField() {
        const toggleText = element(by.css('div[data-automation-id="card-textitem-edit-toggle-int"]'));
        BrowserVisibility.waitUntilElementIsVisible(toggleText);
        toggleText.click();
        BrowserVisibility.waitUntilElementIsVisible(this.intField);
        return this;
    }

    clickOnIntClearIcon() {
        const clearIcon = element(by.css('mat-icon[data-automation-id="card-textitem-reset-int"]'));
        BrowserVisibility.waitUntilElementIsVisible(clearIcon);
        return clearIcon.click();
    }

    clickOnIntSaveIcon() {
        const saveIcon = element(by.css('mat-icon[data-automation-id="card-textitem-update-int"]'));
        BrowserVisibility.waitUntilElementIsVisible(saveIcon);
        return saveIcon.click();
    }

    enterIntField(text) {
        BrowserVisibility.waitUntilElementIsVisible(this.intField);
        this.intField.sendKeys('');
        this.intField.clear();
        this.intField.sendKeys(text);
        return this;
    }

    getIntFieldText() {
        const textField = element(by.css('span[data-automation-id="card-textitem-value-int"]'));
        BrowserVisibility.waitUntilElementIsVisible(textField);
        return textField.getText();
    }

    getErrorInt() {
        const errorElement = element(by.css('mat-error[data-automation-id="card-textitem-error-int"]'));
        BrowserVisibility.waitUntilElementIsVisible(errorElement);
        return errorElement.getText();
    }

    clickOnFloatField() {
        const toggleText = element(by.css('div[data-automation-id="card-textitem-edit-toggle-float"]'));
        BrowserVisibility.waitUntilElementIsVisible(toggleText);
        toggleText.click();
        BrowserVisibility.waitUntilElementIsVisible(this.floatField);
        return this;
    }

    clickOnFloatClearIcon() {
        const clearIcon = element(by.css(`mat-icon[data-automation-id="card-textitem-reset-float"]`));
        BrowserVisibility.waitUntilElementIsVisible(clearIcon);
        return clearIcon.click();
    }

    clickOnFloatSaveIcon() {
        const saveIcon = element(by.css(`mat-icon[data-automation-id="card-textitem-update-float"]`));
        BrowserVisibility.waitUntilElementIsVisible(saveIcon);
        return saveIcon.click();
    }

    enterFloatField(text) {
        BrowserVisibility.waitUntilElementIsVisible(this.floatField);
        this.floatField.sendKeys('');
        this.floatField.clear();
        this.floatField.sendKeys(text);
        return this;
    }

    getFloatFieldText() {
        const textField = element(by.css('span[data-automation-id="card-textitem-value-float"]'));
        BrowserVisibility.waitUntilElementIsVisible(textField);
        return textField.getText();
    }

    getErrorFloat() {
        const errorElement = element(by.css('mat-error[data-automation-id="card-textitem-error-float"]'));
        BrowserVisibility.waitUntilElementIsVisible(errorElement);
        return errorElement.getText();
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
        return this.consoleLog.all(by.css('p')).get(index).getText();
    }

    deletePairsValues() {
        BrowserVisibility.waitUntilElementIsVisible(this.deleteButton);
        this.deleteButton.click();
        return this;
    }

    checkNameAndValueVisibility(index) {
        BrowserVisibility.waitUntilElementIsNotOnPage(this.getKeyValueRow(index));
        return this;
    }

    getKeyValueRow(index) {
        return element.all(by.css(this.keyValueRow)).get(index);

    }

    getMatSelectValue(index) {
        return element.all(by.className(this.selectValue)).get(index);
    }

    clickSelectBox() {
        this.select.click();
        BrowserVisibility.waitUntilElementIsVisible(this.listContent);
    }

    checkboxClick() {
        this.checkbox.click();
    }

    selectValueFromComboBox(index) {
        const value = this.getMatSelectValue(index).click();
        BrowserVisibility.waitUntilElementIsVisible(value);
        return this;
    }

    getSelectionValue() {
        return this.selectedValue.getText();
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
