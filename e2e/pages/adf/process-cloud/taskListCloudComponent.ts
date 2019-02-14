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
import { DataTableComponentPage } from '../dataTableComponentPage';
import { element, by } from 'protractor';

let column = {
    id: 'Id'
};

export class TaskListCloudComponent {

    taskList = element(by.css('adf-cloud-task-list'));
    noTasksFound = element.all(by.css("p[class='adf-empty-content__title']")).first();

    dataTable = new DataTableComponentPage(this.taskList);

    getDataTable() {
        return this.dataTable;
    }

    clickCheckbox(taskName) {
        return this.dataTable.clickCheckbox('Name', taskName);
    }

    checkRowIsNotChecked(taskName) {
        return this.dataTable.checkRowIsNotChecked('Name', taskName);
    }

    checkRowIsChecked(taskName) {
        return this.dataTable.checkRowIsChecked('Name', taskName);
    }

    getRowsWithSameName(taskName) {
        return this.dataTable.getRowsWithSameColumnValues('Name', taskName);
    }

    checkRowIsSelected(taskName) {
        return this.dataTable.checkRowIsSelected('Name', taskName);
    }

    checkRowIsNotSelected(taskName) {
        return this.dataTable.checkRowIsNotSelected('Name', taskName);
    }

    selectRowWithKeyboard(taskName) {
        return this.dataTable.selectRowWithKeyboard('Name', taskName);
    }

    selectRow(taskName) {
        return this.dataTable.selectRow('Name', taskName);
    }

    getRow(taskName) {
        return this.dataTable.getRow('Name', taskName);
    }

    checkContentIsDisplayedByProcessInstanceId(taskName) {
        return this.dataTable.checkContentIsDisplayed('ProcessInstanceId', taskName);
    }

    checkContentIsDisplayedById(taskName) {
        return this.dataTable.checkContentIsDisplayed('Id', taskName);
    }

    checkContentIsDisplayedByName(taskName) {
        return this.dataTable.checkContentIsDisplayed('Name', taskName);
    }

    checkContentIsNotDisplayedByName(taskName) {
        return this.dataTable.checkContentIsNotDisplayed('Name', taskName);
    }

    checkTaskListIsLoaded() {
        Util.waitUntilElementIsVisible(this.taskList);
        return this;
    }

    getNoTasksFoundMessage() {
        Util.waitUntilElementIsVisible(this.noTasksFound);
        return this.noTasksFound.getText();
    }

    getAllRowsNameColumn() {
        return this.dataTable.getAllRowsColumnValues('Name');
    }

    getAllRowsByColumn(columnName) {
        return this.dataTable.getAllRowsColumnValues(columnName);
    }

    getIdCellValue(rowName) {
        let locator = new DataTableComponentPage().getCellByRowAndColumn('Name', rowName, column.id);
        Util.waitUntilElementIsVisible(locator);
        return locator.getText();
    }

}
