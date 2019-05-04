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

import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';
import { DataTableComponentPage } from '@alfresco/adf-testing';
import { by, element } from 'protractor';

export class TasksListPage {

    taskList = element(by.css('adf-tasklist'));
    noTasksFound = element.all(by.css("div[class='adf-empty-content__title']")).first();
    dataTable = new DataTableComponentPage(this.taskList);

    getDataTable() {
        return this.dataTable;
    }

    getRowsDisplayedWithSameName(taskName) {
        return this.dataTable.getRowsWithSameColumnValues('Name', taskName);
    }

    checkContentIsDisplayed(taskName) {
        return this.dataTable.checkContentIsDisplayed('Name', taskName);
    }

    checkContentIsNotDisplayed(taskName) {
        return this.dataTable.checkContentIsNotDisplayed('Name', taskName);
    }

    checkRowIsSelected(taskName) {
        return this.dataTable.checkRowIsSelected('Name', taskName);
    }

    selectRow(taskName) {
        return this.dataTable.selectRow('Name', taskName);
    }

    getAllRowsNameColumn() {
        return this.dataTable.getAllRowsColumnValues('Name');
    }

    checkTaskListIsLoaded() {
        BrowserVisibility.waitUntilElementIsVisible(this.taskList);
        return this;
    }

    getNoTasksFoundMessage() {
        return BrowserActions.getText(this.noTasksFound);
    }

}
