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
import { BrowserActions } from '../../core/utils/browser-actions';
import { element, by, ElementFinder } from 'protractor';

export class TaskListPage {

    noTasksFound: ElementFinder = element(by.css('div[class="adf-empty-content__title"]'));
    taskList: ElementFinder = element(by.css('adf-tasklist'));
    dataTable: DataTableComponentPage = new DataTableComponentPage(this.taskList);

    getDataTable() {
        return this.dataTable;
    }

    getRowsDisplayedWithSameName(taskName): Promise<string> {
        return this.dataTable.getRowsWithSameColumnValues('Name', taskName);
    }

    checkContentIsDisplayedByColumn(column: string, processName: string): Promise<void> {
        return this.dataTable.checkContentIsDisplayed(column, processName);
    }

    checkContentIsNotDisplayedByColumn(column: string, processName: string): Promise<void> {
        return this.dataTable.checkContentIsNotDisplayed(column, processName);
    }

    async checkTaskListIsLoaded(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.taskList);
    }

    getNoTasksFoundMessage(): Promise<string> {
        return BrowserActions.getText(this.noTasksFound);
    }

    checkRowIsSelected(taskName): Promise<void> {
        return this.dataTable.checkRowIsSelected('Name', taskName);
    }

    selectRow(taskName): Promise<void> {
        return this.dataTable.selectRow('Name', taskName);
    }

    getAllRowsNameColumn(): Promise<any> {
        return this.dataTable.getAllRowsColumnValues('Name');
    }
}
