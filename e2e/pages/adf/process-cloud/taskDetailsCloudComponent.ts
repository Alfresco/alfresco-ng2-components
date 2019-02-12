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
import { element, by } from 'protractor';

export class TaskDetailsCloudComponent {

    assigneeField = element(by.css('span[data-automation-id*="assignee"] span'));
    statusField = element(by.css('span[data-automation-id*="status"] span'));
    priorityField = element(by.css('span[data-automation-id*="priority"] span'));
    dueDateField = element(by.css('span[data-automation-id*="dueDate"] span'));
    categoryField = element(by.css('span[data-automation-id*="category"] span'));
    createdField = element(by.css('span[data-automation-id="card-dateitem-created"] span'));
    parentNameField = element(by.css('span[data-automation-id*="parentName"] span'));
    parentTaskIdField = element(by.css('span[data-automation-id*="parentTaskId"] span'));
    endDateField = element.all(by.css('span[data-automation-id*="endDate"] span')).first();
    idField = element.all(by.css('span[data-automation-id*="id"] span')).first();
    descriptionField = element(by.css('span[data-automation-id*="description"] span'));

    getAssignee() {
        Util.waitUntilElementIsVisible(this.assigneeField);
        return this.assigneeField.getText();
    }

    getStatus() {
        Util.waitUntilElementIsVisible(this.statusField);
        return this.statusField.getText();
    }

    getPriority() {
        Util.waitUntilElementIsVisible(this.priorityField);
        return this.priorityField.getText();
    }

    getCategory() {
        Util.waitUntilElementIsVisible(this.categoryField);
        return this.categoryField.getText();
    }

    getParentName() {
        Util.waitUntilElementIsVisible(this.parentNameField);
        return this.parentNameField.getText();
    }

    getParentTaskId() {
        Util.waitUntilElementIsVisible(this.parentTaskIdField);
        return this.parentTaskIdField.getText();
    }

    getEndDate() {
        Util.waitUntilElementIsVisible(this.endDateField);
        return this.endDateField.getText();
    }

    getCreated() {
        Util.waitUntilElementIsVisible(this.createdField);
        return this.createdField.getText();
    }

    getId() {
        Util.waitUntilElementIsVisible(this.idField);
        return this.idField.getText();
    }

    getDescription() {
        Util.waitUntilElementIsVisible(this.descriptionField);
        return this.descriptionField.getText();
    }

    getDueDate() {
        Util.waitUntilElementIsVisible(this.dueDateField);
        return this.dueDateField.getText();
    }

}
