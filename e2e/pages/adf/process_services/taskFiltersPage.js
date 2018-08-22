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

    var myTasks = element(by.css("span[data-automation-id='My Tasks_filter']"));
    var queuedTask = element(by.css("span[data-automation-id='Queued Tasks_filter']"));
    var completedTask = element(by.css("span[data-automation-id='Completed Tasks_filter']"));
    var involvedTask = element(by.css("span[data-automation-id='Involved Tasks_filter']"));
    var tasksAccordionButton = element(by.css("div[data-automation-id='adf-panel-heading']"));
    var tasksAccordionExpanded = element(by.css(`mat-expansion-panel[class*='mat-expanded']`));
    var startTaskButton = element(by.css("button[id='button-start']"));
    var newTaskButton = element(by.css("button[data-automation-id='btn-start-task']"));
    var activeFilter = element(by.css(`mat-list-item[class*='active']`));
    var emptyTaskDetails = element(by.css("adf-task-details > div > div"));
    var emptyTaskList = element(by.css("p[class='adf-empty-content__title']"));

    this.checkMyTasksItem = function() {
        Util.waitUntilElementIsVisible(myTasks);
        return myTasks;
    };

    this.checkQueuedTaskItem = function() {
        Util.waitUntilElementIsVisible(queuedTask);
        return queuedTask;
    };

    this.clickMyTaskTaskItem = function() {
        Util.waitUntilElementIsVisible(myTasks);
        return myTasks.click();
    };

    this.clickCompletedTaskItem = function() {
        Util.waitUntilElementIsVisible(completedTask);
        return completedTask.click();
    };

    this.checkCompletedTaskItem = function() {
        Util.waitUntilElementIsVisible(completedTask);
        return completedTask;
    };

    this.clickQueuedTaskItem = function() {
        Util.waitUntilElementIsVisible(queuedTask);
        return queuedTask.click();
    };

    this.clickInvolvedTaskItem = function() {
        Util.waitUntilElementIsVisible(involvedTask);
        return involvedTask.click();
    };

    this.checkInvolvedTaskItem = function() {
        Util.waitUntilElementIsVisible(involvedTask);
        return involvedTask;
    };

    this.clickTasksAccordionButton = function() {
        Util.waitUntilElementIsVisible(tasksAccordionButton);
        return tasksAccordionButton.click();
    };

    this.checkTasksAccordionExtended = function() {
        Util.waitUntilElementIsVisible(tasksAccordionExpanded);
        return tasksAccordionExpanded;
    };

    this.checkTasksAccordionClosed = function() {
        Util.waitUntilElementIsNotVisible(tasksAccordionExpanded);
        return tasksAccordionExpanded;
    };

    this.clickStartTaskButton = function() {
        Util.waitUntilElementIsVisible(startTaskButton);
        startTaskButton.click();
    };

    this.clickNewTaskButton = function() {
        Util.waitUntilElementIsVisible(newTaskButton);
        newTaskButton.click();
    };

    this.checkActiveFilterActive = function() {
        Util.waitUntilElementIsVisible(activeFilter);
        return activeFilter.getText();
    }

    this.checkEmptyTaskList = function() {
        Util.waitUntilElementIsVisible(emptyTaskList);
        return emptyTaskList.getText();
    };

    this.checkEmptyTaskDetails = function() {
        Util.waitUntilElementIsVisible(emptyTaskDetails);
        return emptyTaskDetails.getText();
    }
};

module.exports = TaskFiltersPage;