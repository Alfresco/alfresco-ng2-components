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

import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { DataTableComponentPage } from '../../core/pages/data-table-component.page';
import { element, by } from 'protractor';
import { BrowserActions } from '../../core/utils/browser-actions';

const column = {
    id: 'Id',
    name: 'Name',
    processInstanceId: 'ProcessInstanceId',
    processDefinitionId: 'ProcessDefinitionId',
    assignee: 'Assignee',
    parentTaskId: 'ParentTaskId',
    priority: 'Priority',
    standAlone: 'StandAlone',
    owner: 'Owner'
};

export class TaskListCloudComponentPage {

    taskList = element(by.css('adf-cloud-task-list'));
    noTasksFound = element.all(by.css("div[class='adf-empty-content__title']")).first();

    dataTable = new DataTableComponentPage(this.taskList);

    getDataTable() {
        return this.dataTable;
    }

    clickCheckbox(taskName) {
        return this.dataTable.clickCheckbox(column.name, taskName);
    }

    checkRowIsNotChecked(taskName) {
        return this.dataTable.checkRowIsNotChecked(column.name, taskName);
    }

    checkRowIsChecked(taskName) {
        return this.dataTable.checkRowIsChecked(column.name, taskName);
    }

    getRowsWithSameName(taskName) {
        return this.dataTable.getRowsWithSameColumnValues(column.name, taskName);
    }

    getRowsWithSameId(taskId) {
        return this.dataTable.getRowsWithSameColumnValues('Id', taskId);
    }

    checkRowIsSelected(taskName) {
        return this.dataTable.checkRowIsSelected(column.name, taskName);
    }

    checkRowIsNotSelected(taskName) {
        return this.dataTable.checkRowIsNotSelected(column.name, taskName);
    }

    selectRowWithKeyboard(taskName) {
        return this.dataTable.selectRowWithKeyboard(column.name, taskName);
    }

    selectRow(taskName) {
        return this.dataTable.selectRow(column.name, taskName);
    }

    getRow(taskName) {
        return this.dataTable.getCellElementByValue(column.name, taskName);
    }

    checkContentIsDisplayedById(taskId) {
        return this.dataTable.checkContentIsDisplayed(column.id, taskId);
    }

    checkContentIsDisplayedByProcessInstanceId(taskName) {
        return this.dataTable.checkContentIsDisplayed(column.processInstanceId, taskName);
    }

    checkContentIsDisplayedByName(taskName) {
        return this.dataTable.checkContentIsDisplayed(column.name, taskName);
    }

    checkContentIsNotDisplayedByName(taskName) {
        return this.dataTable.checkContentIsNotDisplayed(column.name, taskName);
    }

    checkTaskListIsLoaded() {
        BrowserVisibility.waitUntilElementIsVisible(this.taskList);
        return this;
    }

    getNoTasksFoundMessage() {
        return BrowserActions.getText(this.noTasksFound);
    }

    getAllRowsNameColumn() {
        return this.dataTable.getAllRowsColumnValues(column.name);
    }

    getAllRowsByIdColumn() {
        return this.dataTable.getAllRowsColumnValues(column.id);
    }

    getAllRowsByProcessDefIdColumn() {
        return this.dataTable.getAllRowsColumnValues(column.processDefinitionId);
    }

    getAllRowsByProcessInstanceIdColumn() {
        return this.dataTable.getAllRowsColumnValues(column.processInstanceId);
    }

    getAllRowsByAssigneeColumn() {
        return this.dataTable.getAllRowsColumnValues(column.assignee);
    }

    getAllRowsByParentTaskIdColumn() {
        return this.dataTable.getAllRowsColumnValues(column.parentTaskId);
    }

    getAllRowsByPriorityColumn() {
        return this.dataTable.getAllRowsColumnValues(column.priority);
    }

    getAllRowsByStandAloneColumn() {
        return this.dataTable.getAllRowsColumnValues(column.standAlone);
    }

    getAllRowsByOwnerColumn() {
        return this.dataTable.getAllRowsColumnValues(column.owner);
    }

    getIdCellValue(rowName) {
        const locator = new DataTableComponentPage().getCellByRowContentAndColumn(column.name, rowName, column.id);
        return BrowserActions.getText(locator);
    }

}
