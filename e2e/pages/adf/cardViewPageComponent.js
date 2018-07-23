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

var Util = require('../../util/util');

var CardViewComponentPage = function () {

    const addButton = element(by.className('card-view__key-value-pairs__add-btn'));
    const keyValueRow = 'card-view__key-value-pairs__row';
    const selectValue = 'mat-option';
    const textField = element(by.css("input[data-automation-id='card-textitem-editinput-name']"));
    const intField = element(by.css("input[data-automation-id='card-textitem-editinput-int']"));
    const floatField = element(by.css("input[data-automation-id='card-textitem-editinput-float']"));
    const valueInputField = element(by.xpath("//*[contains(@id,'input') and @placeholder='Value']"));
    const nameInputField = element(by.xpath("//*[contains(@id,'input') and @placeholder='Name']"));
    const consoleLog = element(by.className('console'));
    const deleteButton = element.all(by.className('card-view__key-value-pairs__remove-btn')).first();
    const select = element(by.css('mat-select[data-automation-class="select-box"]'));
    const checkbox = element(by.css("mat-checkbox[data-automation-id='card-boolean-boolean']"));
    const resetButton = element(by.css("#adf-reset-card-log"));
    const selectedValue = element(by.css('.mat-select-value-text span'));
    const listContent = element(by.className('mat-select-content'));
    const editableSwitch = element(by.id('adf-toogle-editable'));

    this.clickOnAddButton = function () {
        Util.waitUntilElementIsVisible(addButton);
        addButton.click();
        return this;
    };

    this.clickOnResetButton= function () {
        Util.waitUntilElementIsVisible(resetButton);
        resetButton.click();
        return this;
    };

    this.clickOnTextField = function () {
        let toggleText = element(by.css("div[data-automation-id='card-textitem-edit-toggle-name']"));
        Util.waitUntilElementIsVisible(toggleText);
        toggleText.click();
        Util.waitUntilElementIsVisible(textField);
        return this;
    };

    this.clickOnTextClearIcon = function () {
        let clearIcon = element(by.css("mat-icon[data-automation-id=\"card-textitem-reset-name\"]"));
        Util.waitUntilElementIsVisible(clearIcon);
        return clearIcon.click();
    };

    this.clickOnTextSaveIcon = function () {
        let saveIcon = element(by.css("mat-icon[data-automation-id=\"card-textitem-update-name\"]"));
        Util.waitUntilElementIsVisible(saveIcon);
        return saveIcon.click();
    };

    this.getTextFieldText = function (text) {
        var textField = element(by.css("span[data-automation-id='card-textitem-value-name']"));
        Util.waitUntilElementIsVisible(textField);
        return textField.getText();
    };

    this.enterTextField = function (text) {
        Util.waitUntilElementIsVisible(textField);
        textField.sendKeys('');
        textField.clear().sendKeys(text);
        return this;
    };

    this.clickOnIntField = function () {
        let toggleText = element(by.css('div[data-automation-id="card-textitem-edit-toggle-int"]'));
        Util.waitUntilElementIsVisible(toggleText);
        toggleText.click();
        Util.waitUntilElementIsVisible(intField);
        return this;
    };

    this.clickOnIntClearIcon = function () {
        let clearIcon = element(by.css('mat-icon[data-automation-id="card-textitem-reset-int"]'));
        Util.waitUntilElementIsVisible(clearIcon);
        return clearIcon.click();
    };

    this.clickOnIntSaveIcon = function () {
        let saveIcon = element(by.css('mat-icon[data-automation-id="card-textitem-update-int"]'));
        Util.waitUntilElementIsVisible(saveIcon);
        return saveIcon.click();
    };

    this.enterIntField = function (text) {
        Util.waitUntilElementIsVisible(intField);
        intField.sendKeys('');
        intField.clear().sendKeys(text);
        return this;
    };

    this.getIntFieldText = function (text) {
        var textField = element(by.css('span[data-automation-id="card-textitem-value-int"]'));
        Util.waitUntilElementIsVisible(textField);
        return textField.getText();
    };

    this.getErrorInt = function (text) {
        let errorElement = element(by.css('mat-error[data-automation-id="card-textitem-error-int"]'));
        Util.waitUntilElementIsVisible(errorElement);
        return errorElement.getText();
    };

    this.clickOnFloatField = function () {
        let toggleText = element(by.css('div[data-automation-id="card-textitem-edit-toggle-float"]'));
        Util.waitUntilElementIsVisible(toggleText);
        toggleText.click();
        Util.waitUntilElementIsVisible(floatField);
        return this;
    };

    this.clickOnFloatClearIcon = function () {
        let clearIcon = element(by.css("mat-icon[data-automation-id='card-textitem-reset-float']"));
        Util.waitUntilElementIsVisible(clearIcon);
        return clearIcon.click();
    };

    this.clickOnFloatSaveIcon = function () {
        let saveIcon = element(by.css("mat-icon[data-automation-id='card-textitem-update-float']"));
        Util.waitUntilElementIsVisible(saveIcon);
        return saveIcon.click();
    };

    this.enterFloatField = function (text) {
        Util.waitUntilElementIsVisible(floatField);
        floatField.sendKeys('');
        floatField.clear().sendKeys(text);
        return this;
    };

    this.getFloatFieldText = function (text) {
        var textField = element(by.css('span[data-automation-id="card-textitem-value-float"]'));
        Util.waitUntilElementIsVisible(textField);
        return textField.getText();
    };

    this.getErrorFloat = function (text) {
        let errorElement = element(by.css('mat-error[data-automation-id="card-textitem-error-float"]'));
        Util.waitUntilElementIsVisible(errorElement);
        return errorElement.getText();
    };

    this.setName = function (name) {
        Util.waitUntilElementIsVisible(nameInputField);
        nameInputField.sendKeys(name);
        return this;
    };

    this.setValue = function (value) {
        Util.waitUntilElementIsVisible(valueInputField);
        valueInputField.sendKeys(value);
        return this;
    };


    this.waitForOutput = function () {
        Util.waitUntilElementIsVisible(consoleLog);
        return this;
    };

    this.getOutputText = function (index) {
        return consoleLog.all(by.css('p')).get(index).getText();
    };

    this.deletePairsValues = function () {
        Util.waitUntilElementIsVisible(deleteButton);
        deleteButton.click();
        return this;
    };

    this.checkNameAndValueVisibility = (index) => {
        Util.waitUntilElementIsNotOnPage(this.getKeyValueRow(index));
        return this;
    };

    this.getKeyValueRow = (index) => {
        return element.all(by.css(keyValueRow)).get(index);

    };

    this.getMatSelectValue = (index) => {
        return element.all(by.className(selectValue)).get(index);
    };

    this.clickSelectBox = () => {
        select.click();
        Util.waitUntilElementIsVisible(listContent);
    };

    this.checkboxClick = () => {
        checkbox.click();
    };

    this.selectValueFromComboBox = (index) => {
        this.getMatSelectValue(index).click();
        Util.waitUntilElementIsVisible(consoleLog);
        return this;
    };

    this.getSelectionValue = () => {
        return selectedValue.getText();
    };

    this.disableEdit = function () {
        Util.waitUntilElementIsVisible(editableSwitch);
        editableSwitch.getAttribute('class').then(function (check) {
            if (check === 'mat-slide-toggle mat-primary mat-checked') {
                editableSwitch.click();
                expect(editableSwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary');
            }
        })
    };

}
module.exports = CardViewComponentPage;
