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
import { by, element, ElementFinder } from 'protractor';

export class TasksListPage {

    taskList: ElementFinder = element(by.css('adf-tasklist'));
    noTasksFound: ElementFinder = element.all(by.css("div[class='adf-empty-content__title']")).first();
    dataTable: DataTableComponentPage = new DataTableComponentPage(this.taskList);

    getDataTable() {
        return this.dataTable;
    }

    getRowsDisplayedWithSameName(taskName): Promise<string> {
        return this.dataTable.getRowsWithSameColumnValues('Name', taskName);
    }

    checkContentIsDisplayed(taskName): Promise<void> {
        return this.dataTable.checkContentIsDisplayed('Name', taskName);
    }

    checkContentIsNotDisplayed(taskName): Promise<void> {
        return this.dataTable.checkContentIsNotDisplayed('Name', taskName);
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

    async checkTaskListIsLoaded(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.taskList);
    }

    getNoTasksFoundMessage(): Promise<string> {
        return BrowserActions.getText(this.noTasksFound);
    }

}
