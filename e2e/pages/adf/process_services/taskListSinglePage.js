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
var DataTable = require('../dataTablePage');

var TaskListSinglePage = function () {

    var appId = element(by.css("input[data-automation-id='appId input']"));
    var itemsPerPage = element(by.css("input[data-automation-id='items per page']"));
    var page = element(by.css("input[data-automation-id='page']"));
    var taskName = element(by.css("input[data-automation-id='task name']"));
    var noTasksFound = element(by.css("p[class='adf-empty-content__title']"));
    var resetButton = element(by.css("div[class='adf-reset-button'] button"));
    var emptyPagination = element(by.css("adf-pagination[class*='adf-pagination__empty']"));
    var dueBefore = element(by.css("input[data-automation-id='due before']"));
    var dueAfter = element(by.css("input[data-automation-id='due after']"));

    this.typeAppId = function(input) {
        Util.waitUntilElementIsVisible(appId);
        this.clearText(appId);
        appId.sendKeys(input);
        return this;
    };

    this.getAppId = function() {
        Util.waitUntilElementIsVisible(appId);
        return appId.getAttribute('value');
    };

    this.typeTaskName = function(input) {
        Util.waitUntilElementIsVisible(taskName);
        this.clearText(taskName);
        taskName.sendKeys(input);
        return this;
    };

    this.getTaskName = function() {
        Util.waitUntilElementIsVisible(taskName);
        return taskName.getAttribute('value');
    };

    this.typeItemsPerPage = function(input) {
        Util.waitUntilElementIsVisible(itemsPerPage);
        this.clearText(itemsPerPage);
        itemsPerPage.sendKeys(input);
        return this;
    };

    this.getItemsPerPage = function() {
        Util.waitUntilElementIsVisible(itemsPerPage);
        return itemsPerPage.getAttribute('value');
    };

    this.typePage = function(input) {
        Util.waitUntilElementIsVisible(page);
        this.clearText(page);
        page.sendKeys(input);
        return this;
    };

    this.getPage = function() {
        Util.waitUntilElementIsVisible(page);
        return page.getAttribute('value');
    };

    this.typeDueAfter = function(input) {
        Util.waitUntilElementIsVisible(dueAfter);
        this.clearText(dueAfter);
        dueAfter.sendKeys(input);
        return this;
    };

    this.getDueAfter = function() {
        Util.waitUntilElementIsVisible(dueAfter);
        return dueAfter.getAttribute('value');
    };

    this.typeDueBefore = function(input) {
        Util.waitUntilElementIsVisible(dueBefore);
        this.clearText(dueBefore);
        dueBefore.sendKeys(input);
        return this;
    };

    this.getDueBefore = function() {
        Util.waitUntilElementIsVisible(dueBefore);
        return dueBefore.getAttribute('value');
    };

    this.clearText = function (input) { 
        Util.waitUntilElementIsVisible(input);
        return input.clear(); 
    };

    this.usingDataTable = function () {
        return new DataTable();
    };

    this.getNoTasksFoundMessage = function () {
        Util.waitUntilElementIsVisible(noTasksFound);
        return noTasksFound.getText();
    };

    this.clickResetButton = function () {
        Util.waitUntilElementIsVisible(resetButton);
        resetButton.click();
    };

    this.checkPaginationIsNotDisplayed = function () {
        Util.waitUntilElementIsVisible(emptyPagination);
    };

};

module.exports = TaskListSinglePage;


