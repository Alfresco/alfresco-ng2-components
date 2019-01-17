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
import { DataTablePage } from '../dataTablePage';
import { element, by } from 'protractor';

let column = {
    id: 'Id'
};

export class TaskListCloudComponent {

    taskList = element(by.css('adf-cloud-task-list'));
    noTasksFound = element.all(by.css("p[class='adf-empty-content__title']")).first();

    dataTable = new DataTablePage(this.taskList);

    getDataTable() {
        return this.dataTable;
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
        let locator = new DataTablePage().getCellByNameAndColumn(rowName, column.id);
        Util.waitUntilElementIsVisible(locator);
        return locator.getText();
    }

}
