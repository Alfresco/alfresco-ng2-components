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

var Util = require('../../../util/util');

var StartProcessPage = function () {

    var defaultProcessName = element(by.css("input[id='processName']"));
    var processNameInput = element(by.id('processName'));
    var selectProcessDropdownArrow = element(by.css("button[id='adf-select-process-dropdown']"));
    var cancelProcessButton = element(by.id('cancel_process'));
    var formStartProcessButton = element(by.css('button[data-automation-id="adf-form-start process"]'));
    var startProcessButton = element(by.css("button[data-automation-id='btn-start']"));
    var noProcess = element(by.id('no-process-message'));
    var processDefinition = element(by.css("input[id='processDefinitionName']"));
    var processDefinitionOptionsPanel = element(by.css("div[class*='processDefinitionOptions']"));

    this.checkNoProcessMessage = function () {
        Util.waitUntilElementIsVisible(noProcess);
    };

    this.pressDownArrowAndEnter = function () {
        processDefinition.sendKeys(protractor.Key.ARROW_DOWN);
        return browser.actions().sendKeys(protractor.Key.ENTER).perform();
    };

    this.checkNoProcessDefinitionOptionIsDisplayed = function () {
        Util.waitUntilElementIsNotOnPage(processDefinitionOptionsPanel);
    };

    this.getDefaultName = function () {
        Util.waitUntilElementIsVisible(defaultProcessName);
        return defaultProcessName.getAttribute("value");
    };

    this.deleteDefaultName = function (value) {
        Util.waitUntilElementIsVisible(processNameInput);
        processNameInput.getAttribute('value').then(function (value){
            for (var i = value.length; i >= 0; i--) {
                processNameInput.sendKeys(protractor.Key.BACK_SPACE);
            }
        });
    };

    this.enterProcessName = function (name) {
        Util.waitUntilElementIsVisible(processNameInput);
        processNameInput.clear();
        processNameInput.sendKeys(name);
    };

    this.selectFromProcessDropdown = function (name) {
        this.clickProcessDropdownArrow();
        return this.selectOption(name);
    };

    this.clickProcessDropdownArrow = function() {
        Util.waitUntilElementIsVisible(selectProcessDropdownArrow);
        Util.waitUntilElementIsClickable(selectProcessDropdownArrow)
        selectProcessDropdownArrow.click();
    };

    this.checkOptionIsDisplayed = function (name) {
        var selectProcessDropdown = element(by.cssContainingText('.mat-option-text', name));
        Util.waitUntilElementIsVisible(selectProcessDropdown);
        Util.waitUntilElementIsClickable(selectProcessDropdown);
        return this;
    };

    this.checkOptionIsNotDisplayed = function (name) {
        var selectProcessDropdown = element(by.cssContainingText('.mat-option-text', name));
        Util.waitUntilElementIsNotOnPage(selectProcessDropdown);
        return this;
    };

    this.selectOption = function (name) {
        var selectProcessDropdown = element(by.cssContainingText('.mat-option-text', name));
        Util.waitUntilElementIsVisible(selectProcessDropdown);
        Util.waitUntilElementIsClickable(selectProcessDropdown);
        selectProcessDropdown.click();
        return this;
    };

    this.typeProcessDefinition = function (name) {
        Util.waitUntilElementIsVisible(processDefinition);
        Util.waitUntilElementIsClickable(processDefinition);
        processDefinition.sendKeys(name);
        return this;
    };

    this.getProcessDefinitionValue = function () {
        Util.waitUntilElementIsVisible(processDefinition);
        return processDefinition.getAttribute('value');
    };

    this.clickCancelProcessButton = function () {
        Util.waitUntilElementIsVisible(cancelProcessButton);
        cancelProcessButton.click();
    };

    this.clickFormStartProcessButton = function () {
        Util.waitUntilElementIsVisible(formStartProcessButton);
        Util.waitUntilElementIsClickable(formStartProcessButton);
        return formStartProcessButton.click();
    };

    this.checkStartProcessButtonIsEnabled = function () {
        expect(startProcessButton.isEnabled()).toBe(true);
    };

    this.checkStartProcessButtonIsDisabled = function () {
        expect(startProcessButton.isEnabled()).toBe(false);
    };

    this.clickStartProcessButton = function () {
        return startProcessButton.click();
    };

};

module.exports = StartProcessPage;
