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

import { $$, $ } from 'protractor';
import { BrowserActions } from '../../core/utils/browser-actions';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { CardTextItemPage } from '../../core/pages/card-view/card-view-text-item.page';
import { CardSelectItemPage } from '../../core/pages/card-view/card-view-select-item.page';

export class TaskHeaderCloudPage {

    assigneeCardTextItem = new CardTextItemPage('assignee');
    statusCardTextItem = new CardTextItemPage('status');
    priorityCardSelectItem = new CardSelectItemPage('priority');
    dueDateField = $$('span[data-automation-id*="dueDate"] span').first();
    categoryCardTextItem = new CardTextItemPage('category');
    createdField = $('span[data-automation-id="card-dateitem-created"]');
    parentNameCardTextItem = new CardTextItemPage('parentName');
    parentTaskIdCardTextItem = new CardTextItemPage('parentTaskId');
    endDateField = $$('span[data-automation-id*="endDate"] span').first();
    idCardTextItem = new CardTextItemPage('id');
    descriptionCardTextItem = new CardTextItemPage('description');
    taskPropertyList = $('adf-cloud-task-header adf-card-view .adf-property-list');
    processInstanceIdCardTextItem = new CardTextItemPage('processInstanceId');

    async getAssignee(): Promise<string> {
        return this.assigneeCardTextItem.getFieldValue();
    }

    async getStatus(): Promise<string> {
        return this.statusCardTextItem.getFieldValue();
    }

    async getPriority(): Promise<string> {
        return this.priorityCardSelectItem.getSelectedOptionText();
    }

    async getReadonlyPriority(): Promise<string> {
        return this.priorityCardSelectItem.getReadonlyValue();
    }

    async getCategory(): Promise<string> {
        return this.categoryCardTextItem.getFieldValue();
    }

    async getParentName(): Promise<string> {
        return this.parentNameCardTextItem.getFieldValue();
    }

    async getParentTaskId(): Promise<string> {
        return this.parentTaskIdCardTextItem.getFieldValue();
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

    async getProcessInstanceId(): Promise<string> {
        return this.processInstanceIdCardTextItem.getFieldValue();
    }

    async getDescription(): Promise<string> {
        return this.descriptionCardTextItem.getFieldValue();
    }

    async getDueDate(): Promise<string> {
        return BrowserActions.getText(this.dueDateField);
    }

    async checkTaskPropertyListIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.taskPropertyList, 90000);
    }
}
