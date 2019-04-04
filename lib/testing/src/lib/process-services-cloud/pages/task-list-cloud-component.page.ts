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

const column = {
    id: 'Id'
};

export class TaskListCloudComponentPage {

    columns: {
        name: 'Name',
        processInstanceId: 'Process Instance Id',
        id: 'Id',
        processDefinitionId: 'Process Definition Id',
        assignee: 'Assignee'
    }

    taskList = element(by.css('adf-cloud-task-list'));
    noTasksFound = element.all(by.css("div[class='adf-empty-content__title']")).first();

    dataTable = new DataTableComponentPage(this.taskList);

    getDataTable() {
        return this.dataTable;
    }

    clickCheckbox(taskName) {
        return this.dataTable.clickCheckbox(this.columns.name, taskName);
    }

    checkRowIsNotChecked(taskName) {
        return this.dataTable.checkRowIsNotChecked(this.columns.name, taskName);
    }

    checkRowIsChecked(taskName) {
        return this.dataTable.checkRowIsChecked(this.columns.name, taskName);
    }

    getRowsWithSameName(taskName) {
        return this.dataTable.getRowsWithSameColumnValues(this.columns.name, taskName);
    }

    checkRowIsSelected(taskName) {
        return this.dataTable.checkRowIsSelected(this.columns.name, taskName);
    }

    checkRowIsNotSelected(taskName) {
        return this.dataTable.checkRowIsNotSelected(this.columns.name, taskName);
    }

    selectRowWithKeyboard(taskName) {
        return this.dataTable.selectRowWithKeyboard(this.columns.name, taskName);
    }

    selectRow(taskName) {
        return this.dataTable.selectRow(this.columns.name, taskName);
    }

    getRow(taskName) {
        return this.dataTable.getCellElementByValue(this.columns.name, taskName);
    }

    checkContentIsDisplayedByProcessInstanceId(taskName) {
        return this.dataTable.checkContentIsDisplayed(this.columns.processInstanceId, taskName);
    }

    checkContentIsDisplayedById(taskName) {
        return this.dataTable.checkContentIsDisplayed(this.columns.id, taskName);
    }

    checkContentIsDisplayedByName(taskName) {
        return this.dataTable.checkContentIsDisplayed(this.columns.name, taskName);
    }

    checkContentIsNotDisplayedByName(taskName) {
        return this.dataTable.checkContentIsNotDisplayed(this.columns.name, taskName);
    }

    checkTaskListIsLoaded() {
        BrowserVisibility.waitUntilElementIsVisible(this.taskList);
        return this;
    }

    getNoTasksFoundMessage() {
        BrowserVisibility.waitUntilElementIsVisible(this.noTasksFound);
        return this.noTasksFound.getText();
    }

    getAllRowsNameColumn() {
        return this.dataTable.getAllRowsColumnValues(this.columns.name);
    }

    getAllRowsByIdColumn() {
        return this.dataTable.getAllRowsColumnValues(this.columns.id);
    }

    getAllRowsByProcessDefIdColumn() {
        return this.dataTable.getAllRowsColumnValues(this.columns.processDefinitionId);
    }

    getAllRowsByProcessInstanceIdColumn() {
        return this.dataTable.getAllRowsColumnValues(this.columns.processInstanceId);
    }

    getAllRowsByAssigneeColumn() {
        return this.dataTable.getAllRowsColumnValues(this.columns.assignee);
    }

    getIdCellValue(rowName) {
        const locator = new DataTableComponentPage().getCellByRowContentAndColumn(this.columns.name, rowName, column.id);
        BrowserVisibility.waitUntilElementIsVisible(locator);
        return locator.getText();
    }

}
