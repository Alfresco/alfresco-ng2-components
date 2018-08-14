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

var ProcessDetailsPage = function () {

    //Process Details
    var processTitle = element(by.css("mat-card-title[class='mat-card-title']"));
    var processStatusField = element(by.css("span[data-automation-id='card-textitem-value-status']"));
    var processEndDateField = element(by.css("span[data-automation-id='card-dateitem-ended']"));
    var processCategoryField = element(by.css("span[data-automation-id='card-textitem-value-category']"));
    var processBusinessKeyField = element(by.css("span[data-automation-id='card-textitem-value-businessKey']"));
    var processCreatedByField = element(by.css("span[data-automation-id='card-textitem-value-assignee']"));
    var processCreatedField = element(by.css("span[data-automation-id='card-dateitem-created']"));
    var processIdField = element(by.css("span[data-automation-id='card-textitem-value-id']"));
    var processDescription = element(by.css("span[data-automation-id='card-textitem-value-description']"));
    var showDiagramButtonDisabled = element(by.css('button[id="show-diagram-button"][disabled]'));
    var propertiesList = element(by.css("div[class='adf-property-list']"));
    //Show Diagram
    var showDiagramButton = element(by.id('show-diagram-button'));
    var diagramCanvas = element(by.css('svg[xmlns="http://www.w3.org/2000/svg"]'));
    var backButton = element(by.css("app-show-diagram button[class='mat-mini-fab mat-accent']"));
    //Comments
    var commentInput = element(by.id('comment-input'));
    //Audit Log
    var auditLogButton = element(by.css("button[adf-process-audit]"));
    //Cancel Process button
    var cancelProcessButton = element(by.css('div[data-automation-id="header-status"] > button'));
    //Tasks
    var activeTask = element(by.css('div[data-automation-id="active-tasks"]'));
    var taskTitle = element(by.css("h2[class='activiti-task-details__header']"));

    this.checkProcessTitleIsDisplayed = function () {
        Util.waitUntilElementIsVisible(processTitle);
        return processTitle.getText();
    };

    this.getProcessStatus = function () {
        Util.waitUntilElementIsVisible(processStatusField);
        return processStatusField.getText();
    };

    this.getEndDate = function () {
        Util.waitUntilElementIsVisible(processEndDateField);
        return processEndDateField.getText();
    };

    this.getProcessCategory = function () {
        Util.waitUntilElementIsVisible(processCategoryField);
        return processCategoryField.getText();
    };

    this.getBusinessKey = function () {
        Util.waitUntilElementIsVisible(processBusinessKeyField);
        return processBusinessKeyField.getText();
    };

    this.getCreatedBy = function () {
        Util.waitUntilElementIsVisible(processCreatedByField);
        return processCreatedByField.getText();
    };

    this.getCreated = function () {
        Util.waitUntilElementIsVisible(processCreatedField);
        return processCreatedField.getText();
    };

    this.getId = function () {
        Util.waitUntilElementIsVisible(processIdField);
        return processIdField.getText();
    };

    this.getProcessDescription = function () {
        Util.waitUntilElementIsVisible(processDescription);
        return processDescription.getText();
    };

    //Show Diagram
    this.clickShowDiagram = function () {
        Util.waitUntilElementIsVisible(showDiagramButton);
        Util.waitUntilElementIsClickable(showDiagramButton);
        showDiagramButton.click();
        Util.waitUntilElementIsVisible(diagramCanvas);
        Util.waitUntilElementIsVisible(backButton);
        Util.waitUntilElementIsClickable(backButton);
        backButton.click();
    };

    this.checkShowDiagramIsDisabled = function () {
        Util.waitUntilElementIsVisible(showDiagramButtonDisabled);
    };

    //Add comment
    this.addComment = function (comment) {
        Util.waitUntilElementIsVisible(commentInput);
        commentInput.sendKeys(comment);
        commentInput.sendKeys(protractor.Key.ENTER);
        return this;
    };

    this.checkCommentIsDisplayed = function (comment) {
        var commentInserted = element(by.cssContainingText("div[id='comment-message']", comment));
        Util.waitUntilElementIsVisible(commentInserted);
        return this;
    };

    // Click Audit log
    this.clickAuditLogButton = function () {
        Util.waitUntilElementIsVisible(auditLogButton);
        Util.waitUntilElementIsClickable(auditLogButton);
        auditLogButton.click();
    };

    this.clickCancelProcessButton = function () {
        Util.waitUntilElementIsVisible(cancelProcessButton);
        Util.waitUntilElementIsClickable(cancelProcessButton);
        cancelProcessButton.click();
    };

    this.clickOnActiveTask = function () {
        Util.waitUntilElementIsVisible(activeTask);
        activeTask.click();
    };

    this.checkActiveTaskTitleIsDisplayed = function () {
        Util.waitUntilElementIsVisible(taskTitle);
    };

    this.checkProcessDetailsCard = function () {
        Util.waitUntilElementIsVisible(propertiesList);
    };
};

module.exports = ProcessDetailsPage;
