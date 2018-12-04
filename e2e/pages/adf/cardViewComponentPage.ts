/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { Util } from '../../util/util';

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
    listContent = element(by.className('mat-select-content'));
    editableSwitch = element(by.id('adf-toggle-editable'));

    clickOnAddButton() {
        Util.waitUntilElementIsVisible(this.addButton);
        this.addButton.click();
        return this;
    }

    clickOnResetButton() {
        Util.waitUntilElementIsVisible(this.resetButton);
        this.resetButton.click();
        return this;
    }

    clickOnTextField() {
        let toggleText = element(by.css(`div[data-automation-id='card-textitem-edit-toggle-name']`));
        Util.waitUntilElementIsVisible(toggleText);
        toggleText.click();
        Util.waitUntilElementIsVisible(this.textField);
        return this;
    }

    clickOnTextClearIcon() {
        let clearIcon = element(by.css(`mat-icon[data-automation-id="card-textitem-reset-name"]`));
        Util.waitUntilElementIsVisible(clearIcon);
        return clearIcon.click();
    }

    clickOnTextSaveIcon() {
        let saveIcon = element(by.css(`mat-icon[data-automation-id="card-textitem-update-name"]`));
        Util.waitUntilElementIsVisible(saveIcon);
        return saveIcon.click();
    }

    getTextFieldText() {
        let textField = element(by.css(`span[data-automation-id="card-textitem-value-name"]`));
        Util.waitUntilElementIsVisible(textField);
        return textField.getText();
    }

    enterTextField(text) {
        Util.waitUntilElementIsVisible(this.textField);
        this.textField.sendKeys('');
        this.textField.clear();
        this.textField.sendKeys(text);
        return this;
    }

    clickOnIntField() {
        let toggleText = element(by.css('div[data-automation-id="card-textitem-edit-toggle-int"]'));
        Util.waitUntilElementIsVisible(toggleText);
        toggleText.click();
        Util.waitUntilElementIsVisible(this.intField);
        return this;
    }

    clickOnIntClearIcon() {
        let clearIcon = element(by.css('mat-icon[data-automation-id="card-textitem-reset-int"]'));
        Util.waitUntilElementIsVisible(clearIcon);
        return clearIcon.click();
    }

    clickOnIntSaveIcon() {
        let saveIcon = element(by.css('mat-icon[data-automation-id="card-textitem-update-int"]'));
        Util.waitUntilElementIsVisible(saveIcon);
        return saveIcon.click();
    }

    enterIntField(text) {
        Util.waitUntilElementIsVisible(this.intField);
        this.intField.sendKeys('');
        this.intField.clear();
        this.intField.sendKeys(text);
        return this;
    }

    getIntFieldText() {
        let textField = element(by.css('span[data-automation-id="card-textitem-value-int"]'));
        Util.waitUntilElementIsVisible(textField);
        return textField.getText();
    }

    getErrorInt() {
        let errorElement = element(by.css('mat-error[data-automation-id="card-textitem-error-int"]'));
        Util.waitUntilElementIsVisible(errorElement);
        return errorElement.getText();
    }

    clickOnFloatField() {
        let toggleText = element(by.css('div[data-automation-id="card-textitem-edit-toggle-float"]'));
        Util.waitUntilElementIsVisible(toggleText);
        toggleText.click();
        Util.waitUntilElementIsVisible(this.floatField);
        return this;
    }

    clickOnFloatClearIcon() {
        let clearIcon = element(by.css(`mat-icon[data-automation-id="card-textitem-reset-float"]`));
        Util.waitUntilElementIsVisible(clearIcon);
        return clearIcon.click();
    }

    clickOnFloatSaveIcon() {
        let saveIcon = element(by.css(`mat-icon[data-automation-id="card-textitem-update-float"]`));
        Util.waitUntilElementIsVisible(saveIcon);
        return saveIcon.click();
    }

    enterFloatField(text) {
        Util.waitUntilElementIsVisible(this.floatField);
        this.floatField.sendKeys('');
        this.floatField.clear();
        this.floatField.sendKeys(text);
        return this;
    }

    getFloatFieldText() {
        let textField = element(by.css('span[data-automation-id="card-textitem-value-float"]'));
        Util.waitUntilElementIsVisible(textField);
        return textField.getText();
    }

    getErrorFloat() {
        let errorElement = element(by.css('mat-error[data-automation-id="card-textitem-error-float"]'));
        Util.waitUntilElementIsVisible(errorElement);
        return errorElement.getText();
    }

    setName(name) {
        Util.waitUntilElementIsVisible(this.nameInputField);
        this.nameInputField.sendKeys(name);
        return this;
    }

    setValue(value) {
        Util.waitUntilElementIsVisible(this.valueInputField);
        this.valueInputField.sendKeys(value);
        return this;
    }

    waitForOutput() {
        Util.waitUntilElementIsVisible(this.consoleLog);
        return this;
    }

    getOutputText(index) {
        return this.consoleLog.all(by.css('p')).get(index).getText();
    }

    deletePairsValues() {
        Util.waitUntilElementIsVisible(this.deleteButton);
        this.deleteButton.click();
        return this;
    }

    checkNameAndValueVisibility(index) {
        Util.waitUntilElementIsNotOnPage(this.getKeyValueRow(index));
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
        Util.waitUntilElementIsVisible(this.listContent);
    }

    checkboxClick() {
        this.checkbox.click();
    }

    selectValueFromComboBox(index) {
        this.getMatSelectValue(index).click();
        Util.waitUntilElementIsVisible(this.consoleLog);
        return this;
    }

    getSelectionValue() {
        return this.selectedValue.getText();
    }

    disableEdit() {
        Util.waitUntilElementIsVisible(this.editableSwitch);
        this.editableSwitch.getAttribute('class').then((check) => {
            if (check === 'mat-slide-toggle mat-primary mat-checked') {
                this.editableSwitch.click();
                expect(this.editableSwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary');
            }
        });
    }

}
