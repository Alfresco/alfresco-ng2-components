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

import { by, element, ElementFinder, protractor } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class ProcessDetailsPage {

    // Process Details
    processTitle: ElementFinder = element(by.css('mat-card-title[class="mat-card-title"]'));
    processDetailsMessage: ElementFinder = element(by.css('adf-process-instance-details div[class="ng-star-inserted"]'));
    processStatusField: ElementFinder = element(by.css('span[data-automation-id="card-textitem-value-status"]'));
    processEndDateField: ElementFinder = element(by.css('span[data-automation-id="card-dateitem-ended"]'));
    processCategoryField: ElementFinder = element(by.css('span[data-automation-id="card-textitem-value-category"]'));
    processBusinessKeyField: ElementFinder = element(by.css('span[data-automation-id="card-textitem-value-businessKey"]'));
    processCreatedByField: ElementFinder = element(by.css('span[data-automation-id="card-textitem-value-assignee"]'));
    processCreatedField: ElementFinder = element(by.css('span[data-automation-id="card-dateitem-created"]'));
    processIdField: ElementFinder = element(by.css('span[data-automation-id="card-textitem-value-id"]'));
    processDescription: ElementFinder = element(by.css('span[data-automation-id="card-textitem-value-description"]'));
    showDiagramButtonDisabled: ElementFinder = element(by.css('button[id="show-diagram-button"][disabled]'));
    propertiesList: ElementFinder = element(by.css('div[class="adf-property-list"]'));
    // Show Diagram
    showDiagramButton: ElementFinder = element(by.id('show-diagram-button'));
    diagramCanvas: ElementFinder = element(by.css('svg[xmlns="http://www.w3.org/2000/svg"]'));
    backButton: ElementFinder = element(by.css('app-show-diagram button[class="mat-mini-fab mat-accent"]'));
    // Comments
    commentInput: ElementFinder = element(by.id('comment-input'));
    // Audit Log
    auditLogButton: ElementFinder = element(by.css('button[adf-process-audit]'));
    // Cancel Process button
    cancelProcessButton: ElementFinder = element(by.css('div[data-automation-id="header-status"] > button'));
    // Tasks
    activeTask: ElementFinder = element(by.css('div[data-automation-id="active-tasks"]'));
    startForm: ElementFinder = element(by.css('div[data-automation-id="start-form"]'));
    completedTask: ElementFinder = element(by.css('div[data-automation-id="completed-tasks"]'));
    taskTitle: ElementFinder = element(by.css('h2[class="adf-activiti-task-details__header"]'));

    async checkDetailsAreDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.processStatusField);
        await BrowserVisibility.waitUntilElementIsVisible(this.processEndDateField);
        await BrowserVisibility.waitUntilElementIsVisible(this.processCategoryField);
        await BrowserVisibility.waitUntilElementIsVisible(this.processBusinessKeyField);
        await BrowserVisibility.waitUntilElementIsVisible(this.processCreatedByField);
        await BrowserVisibility.waitUntilElementIsVisible(this.processCreatedField);
        await BrowserVisibility.waitUntilElementIsVisible(this.processIdField);
        await BrowserVisibility.waitUntilElementIsVisible(this.processDescription);
        await BrowserVisibility.waitUntilElementIsVisible(this.showDiagramButton);
        await BrowserVisibility.waitUntilElementIsVisible(this.activeTask);
        await BrowserVisibility.waitUntilElementIsVisible(this.cancelProcessButton);
        await BrowserVisibility.waitUntilElementIsVisible(this.commentInput);
        await BrowserVisibility.waitUntilElementIsVisible(this.auditLogButton);
    }

    checkProcessTitleIsDisplayed(): Promise<string> {
        return BrowserActions.getText(this.processTitle);
    }

    checkProcessDetailsMessage(): Promise<string> {
        return BrowserActions.getText(this.processDetailsMessage);
    }

    getProcessStatus(): Promise<string> {
        return BrowserActions.getText(this.processStatusField);
    }

    getEndDate(): Promise<string> {
        return BrowserActions.getText(this.processEndDateField);
    }

    getProcessCategory(): Promise<string> {
        return BrowserActions.getText(this.processCategoryField);
    }

    getBusinessKey(): Promise<string> {
        return BrowserActions.getText(this.processBusinessKeyField);
    }

    getCreatedBy(): Promise<string> {
        return BrowserActions.getText(this.processCreatedByField);
    }

    getCreated(): Promise<string> {
        return BrowserActions.getText(this.processCreatedField);
    }

    getId(): Promise<string> {
        return BrowserActions.getText(this.processIdField);
    }

    getProcessDescription(): Promise<string> {
        return BrowserActions.getText(this.processDescription);
    }

    async clickShowDiagram(): Promise<void> {
        await BrowserActions.click(this.showDiagramButton);
        await BrowserVisibility.waitUntilElementIsVisible(this.diagramCanvas);
        await BrowserActions.click(this.backButton);

    }

    async checkShowDiagramIsDisabled(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.showDiagramButtonDisabled);
    }

    async addComment(comment): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.commentInput);
        await this.commentInput.sendKeys(comment);
        await this.commentInput.sendKeys(protractor.Key.ENTER);
    }

    async checkCommentIsDisplayed(comment): Promise<void> {
        const commentInserted: ElementFinder = element(by.cssContainingText('div[id="comment-message"]', comment));
        await BrowserVisibility.waitUntilElementIsVisible(commentInserted);
    }

    async clickAuditLogButton(): Promise<void> {
        await BrowserActions.click(this.auditLogButton);
    }

    async clickCancelProcessButton(): Promise<void> {
        await BrowserActions.click(this.cancelProcessButton);
    }

    async clickOnActiveTask(): Promise<void> {
        await BrowserActions.click(this.activeTask);
    }

    async clickOnStartForm(): Promise<void> {
        await BrowserActions.click(this.startForm);
    }

    async clickOnCompletedTask(): Promise<void> {
        await BrowserActions.click(this.completedTask);
    }

    async checkActiveTaskTitleIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.taskTitle);
    }

    async checkProcessDetailsCard(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.propertiesList);
    }
}
