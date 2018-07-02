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

var Util = require('../../../../util/util');

var StartTaskDialog = function () {

    var name = element(by.css("input[id='name_id']"));
    var description = element(by.css("textarea[id='description_id']"));
    var assignee = element(by.css("input[data-automation-id='adf-people-search-input']"));
    var formDropDown = element(by.css("mat-select[id='form_id']"));
    var startButton = element(by.css("button[id='button-start']"));
    var startButtonEnabled = element(by.css("button[id='button-start']:not(disabled)"));
    var cancelButton = element(by.css("button[id='button-cancle']"));
    var removeAssigneeIcon = element(by.css("button[data-automation-id='adf-people-selector-deselect']"));

    this.addName = function (userName) {
        Util.waitUntilElementIsVisible(name);
        name.sendKeys(userName);
        return this;
    };

    this.addDescription = function (userDescription) {
        Util.waitUntilElementIsVisible(description);
        description.sendKeys(userDescription);
        return this;
    };

    this.addAssignee = function (name) {
        Util.waitUntilElementIsVisible(assignee);
        assignee.sendKeys(name);
        this.selectAssigneeFromList(name);
        Util.waitUntilElementIsVisible(removeAssigneeIcon);
        return this;
    };

    this.selectAssigneeFromList = function (name) {
        var assigneeRow = element(by.cssContainingText("adf-people-list div[class*='datatable-row'] div", name));
        Util.waitUntilElementIsVisible(assigneeRow);
        assigneeRow.click();
        return this;
    };

    this.getAssignee = function () {
        Util.waitUntilElementIsVisible(assignee);
        return assignee.getAttribute('placeholder');
    };

    this.addForm = function (form) {
        Util.waitUntilElementIsVisible(formDropDown);
        formDropDown.click();
        return this.selectForm(form);
    };

    this.selectForm = function (form) {
        var option = element(by.cssContainingText("span[class*='mat-option-text']", form));
        Util.waitUntilElementIsVisible(option);
        Util.waitUntilElementIsClickable(option);
        option.click();
        return this;
    };

    this.clickStartButton = function () {
        Util.waitUntilElementIsVisible(startButton);
        Util.waitUntilElementIsClickable(startButton);
        return startButton.click();
    };

    this.checkStartButtonIsEnabled = function () {
        Util.waitUntilElementIsVisible(startButtonEnabled);
        return this;
    };

    this.checkStartButtonIsDisabled = function () {
        Util.waitUntilElementIsVisible(startButton.getAttribute("disabled"));
        return this;
    };

    this.clickCancelButton = function () {
        Util.waitUntilElementIsVisible(cancelButton);
        Util.waitUntilElementIsClickable(cancelButton);
        return cancelButton.click();
    };
};

module.exports = StartTaskDialog;
