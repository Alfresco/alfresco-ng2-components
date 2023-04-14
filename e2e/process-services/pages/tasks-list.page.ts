/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { BrowserActions, BrowserVisibility, DataTableComponentPage } from '@alfresco/adf-testing';
import { browser, $, $$ } from 'protractor';

export class TasksListPage {

    taskList = $('adf-tasklist');
    noTasksFound = $$('.adf-empty-content__title').first();
    dataTable = new DataTableComponentPage(this.taskList);

    getDataTable(): DataTableComponentPage {
        return this.dataTable;
    }

    getRowsDisplayedWithSameName(taskName: string): Promise<string> {
        return this.dataTable.getRowsWithSameColumnValues('Name', taskName);
    }

    async checkContentIsDisplayed(taskName: string): Promise<void> {
        await this.dataTable.checkContentIsDisplayed('Name', taskName);
    }

    async checkContentIsNotDisplayed(taskName: string): Promise<void> {
        await this.dataTable.checkContentIsNotDisplayed('Name', taskName);
    }

    async checkRowIsSelected(taskName: string): Promise<void> {
        await this.dataTable.checkRowIsSelected('Name', taskName);
    }

    async selectRow(taskName: string): Promise<void> {
        await this.dataTable.selectRow('Name', taskName);
        await browser.sleep(1000);
    }

    getAllRowsNameColumn(): Promise<string[]> {
        return this.dataTable.getAllRowsColumnValues('Name');
    }

    async checkTaskListIsLoaded(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.taskList);
    }

    getNoTasksFoundMessage(): Promise<string> {
        return BrowserActions.getText(this.noTasksFound);
    }

}
