/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { protractor } from 'protractor';
import { ProcessInstanceHeaderPage, TestElement } from '@alfresco/adf-testing';

export class ProcessDetailsPage {
    processInstanceHeaderPage = new ProcessInstanceHeaderPage();
    processTitle = TestElement.byCss('.mat-card-title');
    processDetailsMessage = TestElement.byCss('adf-process-instance-details div');
    showDiagramButtonDisabled = TestElement.byCss('button[id="show-diagram-button"][disabled]');
    propertiesList = TestElement.byCss('.adf-property-list');
    showDiagramButton = TestElement.byId('show-diagram-button');
    diagramCanvas = TestElement.byCss('svg[xmlns="http://www.w3.org/2000/svg"]');
    backButton = TestElement.byCss('app-show-diagram button.mat-mini-fab.mat-accent');
    commentInput = TestElement.byId('comment-input');
    auditLogButton = TestElement.byCss('button[adf-process-audit]');
    auditLogEmptyListMessage = TestElement.byCss('.app-empty-list-header');
    cancelProcessButton = TestElement.byCss('div[data-automation-id="header-status"] > button');
    activeTask = TestElement.byCss('div[data-automation-id="active-tasks"]');
    completedTask = TestElement.byCss('div[data-automation-id="completed-tasks"]');
    taskTitle = TestElement.byCss('.adf-activiti-task-details__header');

    checkProcessTitleIsDisplayed(): Promise<string> {
        return this.processTitle.getText();
    }

    checkProcessDetailsMessage(): Promise<string> {
        return this.processDetailsMessage.getText();
    }

    async checkProcessHeaderDetailsAreVisible(): Promise<void> {
        await this.processInstanceHeaderPage.checkDetailsAreDisplayed();
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
        await this.showDiagramButton.click();
        await this.diagramCanvas.waitVisible();
        await this.backButton.click();
    }

    async addComment(comment: string): Promise<void> {
        await this.commentInput.waitVisible();
        await this.commentInput.elementFinder.sendKeys(comment);
        await this.commentInput.elementFinder.sendKeys(protractor.Key.ENTER);
    }

    checkCommentIsDisplayed(comment: string): Promise<void> {
        return TestElement.byText('div.adf-comment-message', comment).waitVisible();
    }
}
