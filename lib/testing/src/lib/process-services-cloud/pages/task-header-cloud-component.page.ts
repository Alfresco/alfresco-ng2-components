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

export class TaskHeaderCloudPage {

    assigneeField = element(by.css('span[data-automation-id*="assignee"] span'));
    statusField = element(by.css('span[data-automation-id*="status"] span'));
    priorityField = element(by.css('span[data-automation-id*="priority"] span'));
    dueDateField = element.all(by.css('span[data-automation-id*="dueDate"] span')).first();
    categoryField = element(by.css('span[data-automation-id*="category"] span'));
    createdField = element(by.css('span[data-automation-id="card-dateitem-created"] span'));
    parentNameField = element(by.css('span[data-automation-id*="parentName"] span'));
    parentTaskIdField = element(by.css('span[data-automation-id*="parentTaskId"] span'));
    endDateField = element.all(by.css('span[data-automation-id*="endDate"] span')).first();
    idField = element.all(by.css('span[data-automation-id*="id"] span')).first();
    descriptionField = element(by.css('span[data-automation-id*="description"] span'));
    taskPropertyList = element(by.css('adf-cloud-task-header adf-card-view div[class="adf-property-list"]'));

    getAssignee() {
        return BrowserActions.getText(this.assigneeField);
    }

    getStatus() {
        return BrowserActions.getText(this.statusField);
    }

    getPriority() {
        return BrowserActions.getText(this.priorityField);
    }

    getCategory() {
        return BrowserActions.getText(this.categoryField);
    }

    getParentName() {
        return BrowserActions.getText(this.parentNameField);
    }

    getParentTaskId() {
        return BrowserActions.getText(this.parentTaskIdField);
    }

    getEndDate() {
        return BrowserActions.getText(this.endDateField);
    }

    getCreated() {
        return BrowserActions.getText(this.createdField);
    }

    getId() {
        return BrowserActions.getText(this.idField);
    }

    getDescription() {
        return BrowserActions.getText(this.descriptionField);
    }

    getDueDate() {
        return BrowserActions.getText(this.dueDateField);
    }

}
