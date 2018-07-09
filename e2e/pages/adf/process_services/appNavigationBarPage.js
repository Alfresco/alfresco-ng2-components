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
var TasksPage = require('./tasksPage');

var AppNavigationBarPage = function () {

    var tasksButton = element.all(by.cssContainingText("div[class*='mat-tab-label']", "Tasks")).first();
    var processButton = element.all(by.css('div[id*="mat-tab-label"]'));
    var reportsButton = element(by.id('mat-tab-label-1-2'));
    var reportsButtonSelected = element(by.css("div[id='mat-tab-label-1-2'][aria-selected='true']"))

    this.clickTasksButton = function () {
        Util.waitUntilElementIsVisible(tasksButton);
        tasksButton.click();
        return new TasksPage();
    };

    this.clickProcessButton = function () {
        processButton.get(1).click();
    };

    this.clickReportsButton = function () {
        Util.waitUntilElementIsVisible(reportsButton);
        reportsButton.click();
        Util.waitUntilElementIsVisible(reportsButtonSelected);
    };


};

module.exports = AppNavigationBarPage;
