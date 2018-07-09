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

};

module.exports = TasksListPage;


