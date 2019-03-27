/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { by, element, protractor } from 'protractor';
import { BrowserVisibility } from '@alfresco/adf-testing';

export class ProcessDetailsPage {

    // Process Details
    processTitle = element(by.css('mat-card-title[class="mat-card-title"]'));
    processDetailsMessage = element(by.css('adf-process-instance-details div[class="ng-star-inserted"]'));
    processStatusField = element(by.css('span[data-automation-id="card-textitem-value-status"]'));
    processEndDateField = element(by.css('span[data-automation-id="card-dateitem-ended"]'));
    processCategoryField = element(by.css('span[data-automation-id="card-textitem-value-category"]'));
    processBusinessKeyField = element(by.css('span[data-automation-id="card-textitem-value-businessKey"]'));
    processCreatedByField = element(by.css('span[data-automation-id="card-textitem-value-assignee"]'));
    processCreatedField = element(by.css('span[data-automation-id="card-dateitem-created"]'));
    processIdField = element(by.css('span[data-automation-id="card-textitem-value-id"]'));
    processDescription = element(by.css('span[data-automation-id="card-textitem-value-description"]'));
    showDiagramButtonDisabled = element(by.css('button[id="show-diagram-button"][disabled]'));
    propertiesList = element(by.css('div[class="adf-property-list"]'));
    // Show Diagram
    showDiagramButton = element(by.id('show-diagram-button'));
    diagramCanvas = element(by.css('svg[xmlns="http://www.w3.org/2000/svg"]'));
    backButton = element(by.css('app-show-diagram button[class="mat-mini-fab mat-accent"]'));
    // Comments
    commentInput = element(by.id('comment-input'));
    // Audit Log
    auditLogButton = element(by.css('button[adf-process-audit]'));
    // Cancel Process button
    cancelProcessButton = element(by.css('div[data-automation-id="header-status"] > button'));
    // Tasks
    activeTask = element(by.css('div[data-automation-id="active-tasks"]'));
    completedTask = element(by.css('div[data-automation-id="completed-tasks"]'));
    taskTitle = element(by.css('h2[class="adf-activiti-task-details__header"]'));

    checkDetailsAreDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.processStatusField);
        BrowserVisibility.waitUntilElementIsVisible(this.processEndDateField);
        BrowserVisibility.waitUntilElementIsVisible(this.processCategoryField);
        BrowserVisibility.waitUntilElementIsVisible(this.processBusinessKeyField);
        BrowserVisibility.waitUntilElementIsVisible(this.processCreatedByField);
        BrowserVisibility.waitUntilElementIsVisible(this.processCreatedField);
        BrowserVisibility.waitUntilElementIsVisible(this.processIdField);
        BrowserVisibility.waitUntilElementIsVisible(this.processDescription);
        BrowserVisibility.waitUntilElementIsVisible(this.showDiagramButton);
        BrowserVisibility.waitUntilElementIsVisible(this.activeTask);
        BrowserVisibility.waitUntilElementIsVisible(this.cancelProcessButton);
        BrowserVisibility.waitUntilElementIsVisible(this.commentInput);
        BrowserVisibility.waitUntilElementIsVisible(this.auditLogButton);
        return this;
    }

    checkProcessTitleIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.processTitle);
        return this.processTitle.getText();
    }

    checkProcessDetailsMessage() {
        BrowserVisibility.waitUntilElementIsVisible(this.processDetailsMessage);
        return this.processDetailsMessage.getText();
    }

    getProcessStatus() {
        BrowserVisibility.waitUntilElementIsVisible(this.processStatusField);
        return this.processStatusField.getText();
    }

    getEndDate() {
        BrowserVisibility.waitUntilElementIsVisible(this.processEndDateField);
        return this.processEndDateField.getText();
    }

    getProcessCategory() {
        BrowserVisibility.waitUntilElementIsVisible(this.processCategoryField);
        return this.processCategoryField.getText();
    }

    getBusinessKey() {
        BrowserVisibility.waitUntilElementIsVisible(this.processBusinessKeyField);
        return this.processBusinessKeyField.getText();
    }

    getCreatedBy() {
        BrowserVisibility.waitUntilElementIsVisible(this.processCreatedByField);
        return this.processCreatedByField.getText();
    }

    getCreated() {
        BrowserVisibility.waitUntilElementIsVisible(this.processCreatedField);
        return this.processCreatedField.getText();
    }

    getId() {
        BrowserVisibility.waitUntilElementIsVisible(this.processIdField);
        return this.processIdField.getText();
    }

    getProcessDescription() {
        BrowserVisibility.waitUntilElementIsVisible(this.processDescription);
        return this.processDescription.getText();
    }

    clickShowDiagram() {
        BrowserVisibility.waitUntilElementIsVisible(this.showDiagramButton);
        BrowserVisibility.waitUntilElementIsClickable(this.showDiagramButton);
        this.showDiagramButton.click();
        BrowserVisibility.waitUntilElementIsVisible(this.diagramCanvas);
        BrowserVisibility.waitUntilElementIsVisible(this.backButton);
        BrowserVisibility.waitUntilElementIsClickable(this.backButton);
        this.backButton.click();
    }

    checkShowDiagramIsDisabled() {
        BrowserVisibility.waitUntilElementIsVisible(this.showDiagramButtonDisabled);
    }

    addComment(comment) {
        BrowserVisibility.waitUntilElementIsVisible(this.commentInput);
        this.commentInput.sendKeys(comment);
        this.commentInput.sendKeys(protractor.Key.ENTER);
        return this;
    }

    checkCommentIsDisplayed(comment) {
        const commentInserted = element(by.cssContainingText('div[id="comment-message"]', comment));
        BrowserVisibility.waitUntilElementIsVisible(commentInserted);
        return this;
    }

    clickAuditLogButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.auditLogButton);
        BrowserVisibility.waitUntilElementIsClickable(this.auditLogButton);
        this.auditLogButton.click();
    }

    clickCancelProcessButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.cancelProcessButton);
        BrowserVisibility.waitUntilElementIsClickable(this.cancelProcessButton);
        this.cancelProcessButton.click();
    }

    clickOnActiveTask() {
        BrowserVisibility.waitUntilElementIsVisible(this.activeTask);
        return this.activeTask.click();
    }

    clickOnCompletedTask() {
        BrowserVisibility.waitUntilElementIsClickable(this.completedTask);
        return this.completedTask.click();
    }

    checkActiveTaskTitleIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.taskTitle);
    }

    checkProcessDetailsCard() {
        BrowserVisibility.waitUntilElementIsVisible(this.propertiesList);
    }
}
