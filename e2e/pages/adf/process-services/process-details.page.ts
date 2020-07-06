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
    processTitle = element(by.css('.mat-card-title'));
    processDetailsMessage = element(by.css('adf-process-instance-details div'));
    processStatusField = element(by.css('[data-automation-id="card-textitem-value-status"]'));
    processEndDateField = element(by.css('span[data-automation-id="card-dateitem-ended"]'));
    processCategoryField = element(by.css('[data-automation-id="card-textitem-value-category"]'));
    processBusinessKeyField = element(by.css('[data-automation-id="card-textitem-value-businessKey"]'));
    processCreatedByField = element(by.css('[data-automation-id="card-textitem-value-assignee"]'));
    processCreatedField = element(by.css('span[data-automation-id="card-dateitem-created"]'));
    processIdField = element(by.css('[data-automation-id="card-textitem-value-id"]'));
    processDescription = element(by.css('[data-automation-id="card-textitem-value-description"]'));
    showDiagramButtonDisabled = element(by.css('button[id="show-diagram-button"][disabled]'));
    propertiesList = element(by.css('.adf-property-list'));
    showDiagramButton = element(by.id('show-diagram-button'));
    diagramCanvas = element(by.css('svg[xmlns="http://www.w3.org/2000/svg"]'));
    backButton = element(by.css('app-show-diagram button.mat-mini-fab.mat-accent'));
    commentInput = element(by.id('comment-input'));
    auditLogButton = element(by.css('button[adf-process-audit]'));
    auditLogEmptyListMessage = element(by.css('.app-empty-list-header'));
    cancelProcessButton = element(by.css('div[data-automation-id="header-status"] > button'));
    activeTask = element(by.css('div[data-automation-id="active-tasks"]'));
    completedTask = element(by.css('div[data-automation-id="completed-tasks"]'));
    taskTitle = element(by.css('.adf-activiti-task-details__header'));

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
        return BrowserActions.getInputValue(this.processStatusField);
    }

    getEndDate(): Promise<string> {
        return BrowserActions.getText(this.processEndDateField);
    }

    getProcessCategory(): Promise<string> {
        return BrowserActions.getInputValue(this.processCategoryField);
    }

    getBusinessKey(): Promise<string> {
        return BrowserActions.getInputValue(this.processBusinessKeyField);
    }

    getCreatedBy(): Promise<string> {
        return BrowserActions.getInputValue(this.processCreatedByField);
    }

    getCreated(): Promise<string> {
        return BrowserActions.getText(this.processCreatedField);
    }

    getId(): Promise<string> {
        return BrowserActions.getInputValue(this.processIdField);
    }

    getProcessDescription(): Promise<string> {
        return BrowserActions.getInputValue(this.processDescription);
    }

    async clickShowDiagram(): Promise<void> {
        await BrowserActions.click(this.showDiagramButton);
        await BrowserVisibility.waitUntilElementIsVisible(this.diagramCanvas);
        await BrowserActions.click(this.backButton);

    }

    async checkShowDiagramIsDisabled(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.showDiagramButtonDisabled);
    }

    async addComment(comment: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.commentInput);
        await this.commentInput.sendKeys(comment);
        await this.commentInput.sendKeys(protractor.Key.ENTER);
    }

    async checkCommentIsDisplayed(comment: string): Promise<void> {
        const commentInserted = element(by.cssContainingText('div[id="comment-message"]', comment));
        await BrowserVisibility.waitUntilElementIsVisible(commentInserted);
    }

    async clickAuditLogButton(): Promise<void> {
        await BrowserActions.click(this.auditLogButton);
    }

    getEmptyMessage(): Promise<string> {
        return BrowserActions.getText(this.auditLogEmptyListMessage);
    }

    async clickCancelProcessButton(): Promise<void> {
        await BrowserActions.click(this.cancelProcessButton);
    }

    async clickOnActiveTask(): Promise<void> {
        await BrowserActions.click(this.activeTask);
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
