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

    var myTasks = element(by.css('span[data-automation-id="My Tasks_filter"]'));
    var queuedTask = element(by.css('span[data-automation-id="Queued Tasks_filter"]'));
    var completedTask = element(by.css('span[data-automation-id="Completed Tasks_filter"]'));
    var involvedTask = element(by.css('span[data-automation-id="Involved Tasks_filter"]'));
    var tasksAccordionButton = element(by.css('div[class="adf-panel-heading adf-panel-heading-selected"]'));
    var tasksAccordionExpanded = element(by.css("mat-expansion-panel[class*='mat-expanded']"));
    var activeFilter = element(by.css("mat-list-item[class*='active']"));
    var taskIcon = by.xpath("ancestor::div[@class='mat-list-item-content']/mat-icon");

    this.checkTaskFilterDisplayed = function(name) {
        var customTask = element(by.css(`span[data-automation-id="${name}_filter"]`));
        Util.waitUntilElementIsVisible(customTask);
        return customTask;
    };

    this.getTaskFilterIcon = function(name) {
        var customTask = element(by.css(`span[data-automation-id="${name}_filter"]`));
        Util.waitUntilElementIsVisible(customTask);
        var icon = customTask.element(taskIcon);
        Util.waitUntilElementIsVisible(icon);
        return icon.getText();
    };

    this.checkTaskFilterHasNoIcon = function(name) {
        var customTask = element(by.css(`span[data-automation-id="${name}_filter"]`));
        Util.waitUntilElementIsVisible(customTask);
        Util.waitUntilElementIsNotOnPage(customTask.element(taskIcon));
    };

    this.clickTaskFilter = function(name) {
        var customTask = element(by.css(`span[data-automation-id="${name}_filter"]`));
        Util.waitUntilElementIsVisible(customTask);
        return customTask.click();
    };

    this.checkTaskFilterNotDisplayed = function(name) {
        var customTask = element(by.css(`span[data-automation-id="${name}_filter"]`));
        Util.waitUntilElementIsNotVisible(customTask);
        return customTask;
    };



    this.checkMyTasksFilter = function() {
        Util.waitUntilElementIsVisible(myTasks);
        return myTasks;
    };

    this.checkQueuedTaskFilter = function() {
        Util.waitUntilElementIsVisible(queuedTask);
        return queuedTask;
    };

    this.clickMyTaskTaskFilter = function() {
        Util.waitUntilElementIsVisible(myTasks);
        return myTasks.click();
    };

    this.clickCompletedTaskFilter = function() {
        Util.waitUntilElementIsClickable(completedTask);
        return completedTask.click();
    };

    this.checkCompletedTaskFilter = function() {
        Util.waitUntilElementIsVisible(completedTask);
        return completedTask;
    };

    this.clickQueuedTaskFilter = function() {
        Util.waitUntilElementIsVisible(queuedTask);
        return queuedTask.click();
    };

    this.clickInvolvedTaskFilter = function() {
        Util.waitUntilElementIsVisible(involvedTask);
        return involvedTask.click();
    };

    this.checkInvolvedTaskFilter = function() {
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
    

    this.checkActiveFilterActive = function() {
        Util.waitUntilElementIsVisible(activeFilter);
        return activeFilter.getText();
    }


};

module.exports = TaskFiltersPage;
