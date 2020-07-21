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
import { BrowserVisibility, BrowserActions, ProcessInstanceHeaderPage } from '@alfresco/adf-testing';

export class ProcessDetailsPage {
    processInstanceHeaderPage = new ProcessInstanceHeaderPage();
    processTitle = element(by.css('.mat-card-title'));
    processDetailsMessage = element(by.css('adf-process-instance-details div'));
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

    checkProcessTitleIsDisplayed(): Promise<string> {
        return BrowserActions.getText(this.processTitle);
    }

    checkProcessDetailsMessage(): Promise<string> {
        return BrowserActions.getText(this.processDetailsMessage);
    }

    isProcessStatusFieldVisible(): Promise<boolean> {
        return this.processInstanceHeaderPage.isStatusFieldDisplayed();
    }

    isProcessEndDateFieldVisible(): Promise<boolean> {
        return this.processInstanceHeaderPage.isEndDateFieldDisplayed();
    }

    isProcessCategoryFieldVisible(): Promise<boolean> {
        return this.processInstanceHeaderPage.isCategoryFieldDisplayed();
    }

    isProcessBusinessKeyFieldVisible(): Promise<boolean> {
        return this.processInstanceHeaderPage.isBusinessKeyFieldDisplayed();
    }

    isProcessCreatedByFieldVisible(): Promise<boolean> {
        return this.processInstanceHeaderPage.isStartedByFieldDisplayed();
    }

    isProcessCreatedFieldVisible(): Promise<boolean> {
        return this.processInstanceHeaderPage.isStartDateFieldDisplayed();
    }

    isProcessIdFieldVisible(): Promise<boolean> {
        return this.processInstanceHeaderPage.isIdFieldDisplayed();
    }

    isProcessDescriptionFieldVisible(): Promise<boolean> {
        return this.processInstanceHeaderPage.isDescriptionFieldDisplayed();
    }

    getProcessStatus(): Promise<string> {
        return this.processInstanceHeaderPage.getStatusFieldValue();
    }

    getEndDate(): Promise<string> {
        return this.processInstanceHeaderPage.getEndDateFieldValue();
    }

    getProcessCategory(): Promise<string> {
        return this.processInstanceHeaderPage.getCategoryFieldValue();
    }

    getBusinessKey(): Promise<string> {
        return this.processInstanceHeaderPage.getBusinessKeyFieldValue();
    }

    getCreatedBy(): Promise<string> {
        return this.processInstanceHeaderPage.getStartedByFieldValue();
    }

    getCreated(): Promise<string> {
        return this.processInstanceHeaderPage.getStartDateFieldValue();
    }

    getId(): Promise<string> {
        return this.processInstanceHeaderPage.getIdFieldValue();
    }

    getProcessDescription(): Promise<string> {
        return this.processInstanceHeaderPage.getDescriptionFieldValue();
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
