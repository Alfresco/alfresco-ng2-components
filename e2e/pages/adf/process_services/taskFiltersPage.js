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

var TaskFiltersPage = function () {

    var myTasks = element.all(by.css('span[data-automation-id="My Tasks_filter"]'));
    var queuedTask = element.all(by.css('span[data-automation-id="Queued Tasks_filter"]'));
    var completedTask = element.all(by.css('span[data-automation-id="Completed Tasks_filter"]'));
    var involvedTask = element.all(by.css('span[data-automation-id="Involved Tasks_filter"]'));
    var tasksAccordionButton = element.all(by.css('div[class="adf-panel-heading adf-panel-heading-selected"]'));
    var tasksAccordion = element.all(by.css('div[class="mat-expansion-panel-content ng-trigger ng-trigger-bodyExpansion mat-expanded"]'));

    this.checkMyTasksItem = function() {
        Util.waitUntilElementIsVisible(myTasks);
        return myTasks.getText();
    };

    this.checkQueuedTaskItem = function() {
        Util.waitUntilElementIsVisible(queuedTask);
        return queuedTask.getText();
    };

    this.checkCompletedTaskItem = function() {
        Util.waitUntilElementIsVisible(completedTask);
        return completedTask.getText();
    };

    this.checkInvolvedTaskItem = function() {
        Util.waitUntilElementIsVisible(involvedTask);
        return involvedTask.getText();
    };

    this.clickTasksAccordionButton = function() {
        Util.waitUntilElementIsVisible(tasksAccordionButton);
        return tasksAccordionButton.click();
    };

    this.checkTasksAccordion = function() {
        Util.waitUntilElementIsVisible(tasksAccordion);
        return tasksAccordion;
    };


};

module.exports = TaskFiltersPage;


