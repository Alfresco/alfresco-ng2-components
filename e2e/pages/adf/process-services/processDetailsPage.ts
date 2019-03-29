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

import { Util } from '../../../util/util';
import { by, element, protractor } from 'protractor';

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
        Util.waitUntilElementIsVisible(this.processStatusField);
        Util.waitUntilElementIsVisible(this.processEndDateField);
        Util.waitUntilElementIsVisible(this.processCategoryField);
        Util.waitUntilElementIsVisible(this.processBusinessKeyField);
        Util.waitUntilElementIsVisible(this.processCreatedByField);
        Util.waitUntilElementIsVisible(this.processCreatedField);
        Util.waitUntilElementIsVisible(this.processIdField);
        Util.waitUntilElementIsVisible(this.processDescription);
        Util.waitUntilElementIsVisible(this.showDiagramButton);
        Util.waitUntilElementIsVisible(this.activeTask);
        Util.waitUntilElementIsVisible(this.cancelProcessButton);
        Util.waitUntilElementIsVisible(this.commentInput);
        Util.waitUntilElementIsVisible(this.auditLogButton);
        return this;
    }

    checkProcessTitleIsDisplayed() {
        Util.waitUntilElementIsVisible(this.processTitle);
        return this.processTitle.getText();
    }

    checkProcessDetailsMessage() {
        Util.waitUntilElementIsVisible(this.processDetailsMessage);
        return this.processDetailsMessage.getText();
    }

    getProcessStatus() {
        Util.waitUntilElementIsVisible(this.processStatusField);
        return this.processStatusField.getText();
    }

    getEndDate() {
        Util.waitUntilElementIsVisible(this.processEndDateField);
        return this.processEndDateField.getText();
    }

    getProcessCategory() {
        Util.waitUntilElementIsVisible(this.processCategoryField);
        return this.processCategoryField.getText();
    }

    getBusinessKey() {
        Util.waitUntilElementIsVisible(this.processBusinessKeyField);
        return this.processBusinessKeyField.getText();
    }

    getCreatedBy() {
        Util.waitUntilElementIsVisible(this.processCreatedByField);
        return this.processCreatedByField.getText();
    }

    getCreated() {
        Util.waitUntilElementIsVisible(this.processCreatedField);
        return this.processCreatedField.getText();
    }

    getId() {
        Util.waitUntilElementIsVisible(this.processIdField);
        return this.processIdField.getText();
    }

    getProcessDescription() {
        Util.waitUntilElementIsVisible(this.processDescription);
        return this.processDescription.getText();
    }

    clickShowDiagram() {
        Util.waitUntilElementIsVisible(this.showDiagramButton);
        Util.waitUntilElementIsClickable(this.showDiagramButton);
        this.showDiagramButton.click();
        Util.waitUntilElementIsVisible(this.diagramCanvas);
        Util.waitUntilElementIsVisible(this.backButton);
        Util.waitUntilElementIsClickable(this.backButton);
        this.backButton.click();
    }

    checkShowDiagramIsDisabled() {
        Util.waitUntilElementIsVisible(this.showDiagramButtonDisabled);
    }

    addComment(comment) {
        Util.waitUntilElementIsVisible(this.commentInput);
        this.commentInput.sendKeys(comment);
        this.commentInput.sendKeys(protractor.Key.ENTER);
        return this;
    }

    checkCommentIsDisplayed(comment) {
        let commentInserted = element(by.cssContainingText('div[id="comment-message"]', comment));
        Util.waitUntilElementIsVisible(commentInserted);
        return this;
    }

    clickAuditLogButton() {
        Util.waitUntilElementIsVisible(this.auditLogButton);
        Util.waitUntilElementIsClickable(this.auditLogButton);
        this.auditLogButton.click();
    }

    clickCancelProcessButton() {
        Util.waitUntilElementIsVisible(this.cancelProcessButton);
        Util.waitUntilElementIsClickable(this.cancelProcessButton);
        this.cancelProcessButton.click();
    }

    clickOnActiveTask() {
        Util.waitUntilElementIsVisible(this.activeTask);
        return this.activeTask.click();
    }

    clickOnCompletedTask() {
        Util.waitUntilElementIsClickable(this.completedTask);
        return this.completedTask.click();
    }

    checkActiveTaskTitleIsDisplayed() {
        Util.waitUntilElementIsVisible(this.taskTitle);
    }

    checkProcessDetailsCard() {
        Util.waitUntilElementIsVisible(this.propertiesList);
    }
}
