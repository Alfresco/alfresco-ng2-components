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
import { element, by, ElementFinder } from 'protractor';
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

    getDataTable(): DataTableComponentPage {
        return this.dataTable;
    }

    clickCheckbox(taskName): Promise<void> {
        return this.dataTable.clickCheckbox(column.name, taskName);
    }

    checkRowIsNotChecked(taskName): Promise<void> {
        return this.dataTable.checkRowIsNotChecked(column.name, taskName);
    }

    checkRowIsChecked(taskName): Promise<void> {
        return this.dataTable.checkRowIsChecked(column.name, taskName);
    }

    getRowsWithSameName(taskName): Promise<string> {
        return this.dataTable.getRowsWithSameColumnValues(column.name, taskName);
    }

    getRowsWithSameId(taskId): Promise<string> {
        return this.dataTable.getRowsWithSameColumnValues('Id', taskId);
    }

    checkRowIsSelected(taskName): Promise<void> {
        return this.dataTable.checkRowIsSelected(column.name, taskName);
    }

    checkRowIsNotSelected(taskName): Promise<void> {
        return this.dataTable.checkRowIsNotSelected(column.name, taskName);
    }

    selectRowWithKeyboard(taskName): Promise<void> {
        return this.dataTable.selectRowWithKeyboard(column.name, taskName);
    }

    selectRow(taskName): Promise<void> {
        return this.dataTable.selectRow(column.name, taskName);
    }

    selectRowByTaskId(taskId: string): Promise<void> {
        return this.dataTable.selectRow(column.id, taskId);
    }

    getRow(taskName): ElementFinder {
        return this.dataTable.getCellElementByValue(column.name, taskName);
    }

    checkContentIsDisplayedById(taskId): Promise<void> {
        return this.dataTable.checkContentIsDisplayed(column.id, taskId);
    }

    async checkContentIsNotDisplayedById(taskId): Promise<void> {
        return this.dataTable.checkContentIsNotDisplayed(column.id, taskId);
    }

    async checkContentIsDisplayedByProcessInstanceId(taskName): Promise<void> {
        return this.dataTable.checkContentIsDisplayed(column.processInstanceId, taskName);
    }

    async checkContentIsDisplayedByName(taskName): Promise<void> {
        return this.dataTable.checkContentIsDisplayed(column.name, taskName);
    }

    async checkContentIsNotDisplayedByName(taskName): Promise<void> {
        return this.dataTable.checkContentIsNotDisplayed(column.name, taskName);
    }

    async checkTaskListIsLoaded(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.taskList);
    }

    async getNoTasksFoundMessage(): Promise<string> {
        return BrowserActions.getText(this.noTasksFound);
    }

    async getAllRowsNameColumn() {
        return await this.dataTable.getAllRowsColumnValues(column.name);
    }

    async getAllRowsByIdColumn() {
        return await this.dataTable.getAllRowsColumnValues(column.id);
    }

    async getAllRowsByProcessDefIdColumn() {
        return await this.dataTable.getAllRowsColumnValues(column.processDefinitionId);
    }

    async getAllRowsByProcessInstanceIdColumn() {
        return await this.dataTable.getAllRowsColumnValues(column.processInstanceId);
    }

    async getAllRowsByAssigneeColumn() {
        return await this.dataTable.getAllRowsColumnValues(column.assignee);
    }

    async getAllRowsByParentTaskIdColumn() {
        return await this.dataTable.getAllRowsColumnValues(column.parentTaskId);
    }

    async getAllRowsByPriorityColumn() {
        return await this.dataTable.getAllRowsColumnValues(column.priority);
    }

    async getAllRowsByStandAloneColumn() {
        return await this.dataTable.getAllRowsColumnValues(column.standAlone);
    }

    async getAllRowsByOwnerColumn() {
        return await this.dataTable.getAllRowsColumnValues(column.owner);
    }

    async getIdCellValue(rowName): Promise<string> {
        const locator = new DataTableComponentPage().getCellByRowContentAndColumn(column.name, rowName, column.id);
        return BrowserActions.getText(locator);
    }

}
