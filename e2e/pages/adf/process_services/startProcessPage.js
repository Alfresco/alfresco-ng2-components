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
    var selectProcessDropdownArrow = element(by.css("input[aria-label='Number']"));
    var cancelProcessButton = element(by.id('cancel_process'));
    var formStartProcessButton = element(by.css('button[data-automation-id="adf-form-start process"]'));
    var startProcessButton = element(by.css("button[data-automation-id='btn-start']"));
    var noProcess = element(by.id('no-process-message'));

    this.checkNoProcessMessage = function () {
        Util.waitUntilElementIsVisible(noProcess);
    }

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
        Util.waitUntilElementIsVisible(selectProcessDropdownArrow);
        Util.waitUntilElementIsClickable(selectProcessDropdownArrow)
        selectProcessDropdownArrow.click();
        var selectProcessDropdown = element(by.cssContainingText('.mat-option-text', name));
        Util.waitUntilElementIsVisible(selectProcessDropdown);
        Util.waitUntilElementIsClickable(selectProcessDropdown);
        selectProcessDropdown.click();
        return this;
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

};

module.exports = StartProcessPage;
