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
var StartTaskDialog = require('./dialog/startTaskDialog');
var FormFields = require('./formFields');
var TaskDetails = require('./taskDetailsPage');
var FiltersPage = require('./filtersPage');
var ChecklistDialog = require('./dialog/createChecklistDialog');
var TasksListPage = require('./tasksListPage');

var TasksPage = function () {

    var createButton = element(by.css("button[data-automation-id='create-button'"));
    var newTaskButton = element(by.css("button[data-automation-id='btn-start-task']"));
    var addChecklistButton = element(by.css("button[class*='adf-add-to-checklist-button']"));
    var rowByRowName = by.xpath("ancestor::mat-chip");
    var checklistContainer = by.css("div[class*='checklist-menu']");
    var taskTitle = "h2[class='activiti-task-details__header'] span";
    var rows = by.css("div[class*='adf-datatable-body'] div[class*='adf-datatable-row'] div[class*='adf-data-table-cell']");
    var completeButtonNoForm = element(by.id("adf-no-form-complete-button"));
    var checklistDialog = element(by.id("checklist-dialog"));
    var checklistNoMessage = element(by.id("checklist-none-message"));
    var numberOfChecklists = element(by.css("[data-automation-id='checklist-label'] mat-chip"));

    this.createNewTask = function () {
        this.createButtonIsDisplayed();
        this.clickOnCreateButton();
        this.newTaskButtonIsDisplayed();
        newTaskButton.click();
        return new StartTaskDialog();
    };

    this.clickOnNewTaskButton = function() {
        Util.waitUntilElementIsClickable(newTaskButton);
        newTaskButton.click();
        return this;
    };

    this.createButtonIsDisplayed = function() {
        Util.waitUntilElementIsVisible(createButton);
        return this;
    };

    this.newTaskButtonIsDisplayed = function() {
        Util.waitUntilElementIsVisible(newTaskButton);
        return this;
    };

    this.clickOnCreateButton = function() {
        Util.waitUntilElementIsClickable(createButton);
        createButton.click();
        return this;
    };

    this.formFields = function () {
      return new FormFields();
    };

    this.taskDetails = function () {
        return new TaskDetails();
    };

    this.filtersPage = function () {
        return new FiltersPage();
    };

    this.tasksListPage = function () {
        return new TasksListPage();
    };

    this.usingCheckListDialog = function () {
        return new ChecklistDialog();
    };

    this.clickOnAddChecklistButton = function () {
        Util.waitUntilElementIsClickable(addChecklistButton);
        addChecklistButton.click();
        return new ChecklistDialog();
    };

    this.getRowsName = function (name) {
        var row = element(checklistContainer).element(by.cssContainingText("span", name));
        Util.waitUntilElementIsVisible(row);
        return row;
    };

    this.getChecklistByName = function (checklist) {
        var row = this.getRowsName(checklist).element(rowByRowName);
        Util.waitUntilElementIsVisible(row);
        return row;
    };

    this.checkChecklistIsDisplayed = function (checklist) {
        Util.waitUntilElementIsVisible(this.getChecklistByName(checklist));
        return this;
    };

    this.checkChecklistIsNotDisplayed = function (checklist) {
        Util.waitUntilElementIsNotOnPage(element(checklistContainer).element(by.cssContainingText("span", checklist)));
        return this;
    };

    this.checkTaskTitle = function(taskName) {
        Util.waitUntilElementIsVisible(element(by.css(taskTitle)));
        var title = element(by.cssContainingText(taskTitle, taskName));
        Util.waitUntilElementIsVisible(title);
        return this;
    };

    this.getAllDisplayedRows = function(){
        return element.all(rows).count();
    };

    this.completeTaskNoForm = function () {
        Util.waitUntilElementIsClickable(completeButtonNoForm);
        completeButtonNoForm.click();
    };

    this.completeTaskNoFormNotDisplayed = function () {
        Util.waitUntilElementIsNotOnPage(completeButtonNoForm);
        return this;
    };

    this.checkChecklistDialogIsDisplayed = function () {
        Util.waitUntilElementIsVisible(checklistDialog);
        return this;
    };

    this.checkChecklistDialogIsNotDisplayed = function () {
        Util.waitUntilElementIsNotOnPage(checklistDialog);
        return this;
    };

    this.checkNoChecklistIsDisplayed = function () {
        Util.waitUntilElementIsVisible(checklistNoMessage);
        return this;
    };

    this.getNumberOfChecklists = function () {
        Util.waitUntilElementIsVisible(numberOfChecklists);
        return numberOfChecklists.getText();
    };

    this.removeChecklists = function (checklist) {
        var row = this.getRowsName(checklist).element(rowByRowName);
        Util.waitUntilElementIsVisible(row.element(by.css('button')));
        row.element(by.css('button')).click();
        return this;
    };

    this.checkChecklistsRemoveButtonIsNotDisplayed = function (checklist) {
        var row = this.getRowsName(checklist).element(rowByRowName);
        Util.waitUntilElementIsNotOnPage(row.element(by.css('button')));
        return this;
    };

};

module.exports = TasksPage;
