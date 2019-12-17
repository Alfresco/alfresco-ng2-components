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

import { element, by, ElementFinder } from 'protractor';
import { BrowserActions } from '../../core/utils/browser-actions';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { CardTextItemPage } from '../../core/pages/card-view/card-view-text-item.page';

export class TaskHeaderCloudPage {

    assigneeCardTextItem: CardTextItemPage = new CardTextItemPage('assignee');
    statusCardTextItem: CardTextItemPage = new CardTextItemPage('status');
    priorityCardTextItem: CardTextItemPage = new CardTextItemPage('priority');
    dueDateField: ElementFinder = element.all(by.css('span[data-automation-id*="dueDate"] span')).first();
    categoryField: ElementFinder = element(by.css('span[data-automation-id*="category"] span'));
    createdField: ElementFinder = element(by.css('span[data-automation-id="card-dateitem-created"] span'));
    parentNameField: ElementFinder = element(by.css('span[data-automation-id*="parentName"] span'));
    parentTaskIdField: ElementFinder = element(by.css('span[data-automation-id*="parentTaskId"] span'));
    endDateField: ElementFinder = element.all(by.css('span[data-automation-id*="endDate"] span')).first();
    idCardTextItem: CardTextItemPage = new CardTextItemPage('id');
    descriptionCardTextItem: CardTextItemPage = new CardTextItemPage('description');
    taskPropertyList: ElementFinder = element(by.css('adf-cloud-task-header adf-card-view div[class="adf-property-list"]'));

    async getAssignee(): Promise<string> {
        return this.assigneeCardTextItem.getFieldValue();
    }

    async clickOnAssignee(): Promise<void> {
        await this.assigneeCardTextItem.clickOnToggleTextField();
    }

    async getStatus(): Promise<string> {
        return this.statusCardTextItem.getFieldValue();
    }

    async getPriority(): Promise<string> {
        return this.priorityCardTextItem.getFieldValue();
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
        return this.idCardTextItem.getFieldValue();
    }

    async getDescription(): Promise<string> {
        return this.descriptionCardTextItem.getFieldValue();
    }

    async getDueDate(): Promise<string> {
        return BrowserActions.getText(this.dueDateField);
    }

    async checkTaskPropertyListIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.taskPropertyList);
    }

}
