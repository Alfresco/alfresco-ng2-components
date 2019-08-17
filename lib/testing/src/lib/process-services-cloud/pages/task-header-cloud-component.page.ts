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

import { element, by } from 'protractor';
import { BrowserActions } from '../../core/utils/browser-actions';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { ElementFinder } from 'protractor';

export class TaskHeaderCloudPage {

    assigneeField: ElementFinder = element(by.css('span[data-automation-id*="assignee"] span'));
    statusField: ElementFinder = element(by.css('span[data-automation-id*="status"] span'));
    priorityField: ElementFinder = element(by.css('span[data-automation-id*="priority"] span'));
    dueDateField: ElementFinder = element.all(by.css('span[data-automation-id*="dueDate"] span')).first();
    categoryField: ElementFinder = element(by.css('span[data-automation-id*="category"] span'));
    createdField: ElementFinder = element(by.css('span[data-automation-id="card-dateitem-created"] span'));
    parentNameField: ElementFinder = element(by.css('span[data-automation-id*="parentName"] span'));
    parentTaskIdField: ElementFinder = element(by.css('span[data-automation-id*="parentTaskId"] span'));
    endDateField: ElementFinder = element.all(by.css('span[data-automation-id*="endDate"] span')).first();
    idField: ElementFinder = element.all(by.css('span[data-automation-id*="id"] span')).first();
    descriptionField: ElementFinder = element(by.css('span[data-automation-id*="description"] span'));
    taskPropertyList: ElementFinder = element(by.css('adf-cloud-task-header adf-card-view div[class="adf-property-list"]'));

    async getAssignee(): Promise<string> {
        return BrowserActions.getText(this.assigneeField);
    }

    async getStatus(): Promise<string> {
        return BrowserActions.getText(this.statusField);
    }

    async getPriority(): Promise<string> {
        return BrowserActions.getText(this.priorityField);
    }

    async getCategory(): Promise<string> {
        return BrowserActions.getText(this.categoryField);
    }

    async getParentName(): Promise<string> {
        return BrowserActions.getText(this.parentNameField);
    }

    async getParentTaskId(): Promise<string> {
        return BrowserActions.getText(this.parentTaskIdField);
    }

    async getEndDate(): Promise<string> {
        return BrowserActions.getText(this.endDateField);
    }

    async getCreated(): Promise<string> {
        return BrowserActions.getText(this.createdField);
    }

    async getId(): Promise<string> {
        return BrowserActions.getText(this.idField);
    }

    async getDescription(): Promise<string> {
        return BrowserActions.getText(this.descriptionField);
    }

    async getDueDate(): Promise<string> {
        return BrowserActions.getText(this.dueDateField);
    }

    async checkTaskPropertyListIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.taskPropertyList);
    }

}
