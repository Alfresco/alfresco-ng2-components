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
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

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
        return BrowserActions.getText(this.processTitle);
    }

    checkProcessDetailsMessage() {
        return BrowserActions.getText(this.processDetailsMessage);
    }

    getProcessStatus() {
        return BrowserActions.getText(this.processStatusField);
    }

    getEndDate() {
        return BrowserActions.getText(this.processEndDateField);
    }

    getProcessCategory() {
        return BrowserActions.getText(this.processCategoryField);
    }

    getBusinessKey() {
        return BrowserActions.getText(this.processBusinessKeyField);
    }

    getCreatedBy() {
        return BrowserActions.getText(this.processCreatedByField);
    }

    getCreated() {
        return BrowserActions.getText(this.processCreatedField);
    }

    getId() {
        return BrowserActions.getText(this.processIdField);
    }

    getProcessDescription() {
        return BrowserActions.getText(this.processDescription);
    }

    clickShowDiagram() {
        BrowserActions.click(this.showDiagramButton);
        BrowserVisibility.waitUntilElementIsVisible(this.diagramCanvas);
        BrowserActions.click(this.backButton);

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
        BrowserActions.click(this.auditLogButton);
    }

    clickCancelProcessButton() {
        BrowserActions.click(this.cancelProcessButton);
    }

    clickOnActiveTask() {
        return BrowserActions.click(this.activeTask);
    }

    clickOnCompletedTask() {
        return BrowserActions.click(this.completedTask);
    }

    checkActiveTaskTitleIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.taskTitle);
    }

    checkProcessDetailsCard() {
        BrowserVisibility.waitUntilElementIsVisible(this.propertiesList);
    }
}
