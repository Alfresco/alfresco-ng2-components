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

export class TaskListCloudComponentPage {

    column = {
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

    taskList = element(by.css('adf-cloud-task-list'));
    noTasksFound = element.all(by.css("div[class='adf-empty-content__title']")).first();

    dataTable = new DataTableComponentPage(this.taskList);

    getDataTable() {
        return this.dataTable;
    }

    clickCheckbox(taskName) {
        return this.dataTable.clickCheckbox(this.column.name, taskName);
    }

    checkRowIsNotChecked(taskName) {
        return this.dataTable.checkRowIsNotChecked(this.column.name, taskName);
    }

    checkRowIsChecked(taskName) {
        return this.dataTable.checkRowIsChecked(this.column.name, taskName);
    }

    getRowsWithSameName(taskName) {
        return this.dataTable.getRowsWithSameColumnValues(this.column.name, taskName);
    }

    getRowsWithSameId(taskId) {
        return this.dataTable.getRowsWithSameColumnValues('Id', taskId);
    }

    checkRowIsSelected(taskName) {
        return this.dataTable.checkRowIsSelected(this.column.name, taskName);
    }

    checkRowIsNotSelected(taskName) {
        return this.dataTable.checkRowIsNotSelected(this.column.name, taskName);
    }

    selectRowWithKeyboard(taskName) {
        return this.dataTable.selectRowWithKeyboard(this.column.name, taskName);
    }

    selectRow(taskName) {
        return this.dataTable.selectRow(this.column.name, taskName);
    }

    getRow(taskName) {
        return this.dataTable.getCellElementByValue(this.column.name, taskName);
    }

    checkContentIsDisplayedById(taskId) {
        return this.dataTable.checkContentIsDisplayed(this.column.id, taskId);
    }

    checkContentIsDisplayedByProcessInstanceId(taskName) {
        return this.dataTable.checkContentIsDisplayed(this.column.processInstanceId, taskName);
    }

    checkContentIsDisplayedByName(taskName) {
        return this.dataTable.checkContentIsDisplayed(this.column.name, taskName);
    }

    checkContentIsNotDisplayedByName(taskName) {
        return this.dataTable.checkContentIsNotDisplayed(this.column.name, taskName);
    }

    checkTaskListIsLoaded() {
        BrowserVisibility.waitUntilElementIsVisible(this.taskList);
        return this;
    }

    getNoTasksFoundMessage() {
        return BrowserActions.getText(this.noTasksFound);
    }

    getAllRowsNameColumn() {
        return this.dataTable.getAllRowsColumnValues(this.column.name);
    }

    checkListIsSortedByNameColumn(sortOrder) {
        return this.dataTable.checkListIsSorted(sortOrder, this.column.name);
    }

    checkListIsSortedByIdColumn(sortOrder) {
        return this.dataTable.checkListIsSorted(sortOrder, this.column.id);
    }

    checkListIsSortedByProcessDefinitionIdColumn(sortOrder) {
        return this.dataTable.checkListIsSorted(sortOrder, this.column.processDefinitionId);
    }

    checkListIsSortedByProcessInstanceIdColumn(sortOrder) {
        return this.dataTable.checkListIsSorted(sortOrder, this.column.processInstanceId);
    }

    checkListIsSortedByAssigneeColumn(sortOrder) {
        return this.dataTable.checkListIsSorted(sortOrder, this.column.assignee);
    }

    checkListIsSortedByParentTaskIdColumn(sortOrder) {
        return this.dataTable.checkListIsSorted(sortOrder, this.column.parentTaskId);
    }

    checkListIsSortedByPriorityColumn(sortOrder) {
        return this.dataTable.checkListIsSorted(sortOrder, this.column.priority);
    }

    checkListIsSortedByStandAloneColumn(sortOrder) {
        return this.dataTable.checkListIsSorted(sortOrder, this.column.standAlone);
    }

    checkListIsSortedByOwnerColumn(sortOrder) {
        return this.dataTable.checkListIsSorted(sortOrder, this.column.owner);
    }

    getIdCellValue(rowName) {
        const locator = new DataTableComponentPage().getCellByRowContentAndColumn(this.column.name, rowName, this.column.id);
        return BrowserActions.getText(locator);
    }

}
