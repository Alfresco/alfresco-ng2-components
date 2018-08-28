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

var TasksListPage = function () {

    var taskList = element(by.css("adf-tasklist"));
    var tableBody = element.all(by.css("adf-datatable div[class='adf-datatable-body']")).first();
    var sortByName = element(by.css('div[data-automation-id="auto_id_name"]'));
    var firstTaskOnTaskList = element.all(by.css('div[class="adf-datatable-body"] span')).first();
    var taskOnTaskList = element.all(by.css('div[class="adf-datatable-body"] span'));
    var spinner = element(by.css('mat-progress-spinner'));

    this.clickSortByName = function () {
        Util.waitUntilElementIsVisible(sortByName);
        return sortByName.click();
    };

    this.checkHighlightedTaskInTasksList = function(taskName) {
        var row = by.cssContainingText('div[class="adf-datatable-row is-selected ng-star-inserted"] span', taskName);
        Util.waitUntilElementIsVisible(taskList.element(row));
        return this;
    };
    
    this.checkTaskIsDisplayedInTasksList = function(taskName) {
        var row = by.cssContainingText("span", taskName);
        Util.waitUntilElementIsVisible(taskList.element(row));
        return this;
    };

    this.selectTaskFromTasksList = function(taskName) {
        var row = by.cssContainingText("span", taskName);
        Util.waitUntilElementIsVisible(taskList.element(row));
        taskList.element(row).click();
        return this;
    };

    this.checkTaskIsNotDisplayedInTasksList = function(taskName) {
        var row = by.cssContainingText("span", taskName);
        Util.waitUntilElementIsNotOnPage(taskList.element(row));
        return this;
    };

    this.checkTaskListIsLoaded = function () {
        Util.waitUntilElementIsVisible(taskList);
        return this;
    };

    this.waitForTableBody = function (){
        Util.waitUntilElementIsVisible(tableBody);
    };

    this.firstTaskOnTaskList = function (){
        Util.waitUntilElementIsVisible(firstTaskOnTaskList);
        return firstTaskOnTaskList.getText();
    };

    this.taskOnTaskListInPosition = function (position){
        Util.waitUntilElementIsVisible(taskOnTaskList);
        return taskOnTaskList.get(position -1).getText();
    };

    this.checkSpinnerIsDisplayed = function () {
        Util.waitUntilElementIsPresent(spinner);
    };
};

module.exports = TasksListPage;
