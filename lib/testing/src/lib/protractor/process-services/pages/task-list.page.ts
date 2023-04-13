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

import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { DataTableComponentPage } from '../../core/pages/data-table-component.page';
import { BrowserActions } from '../../core/utils/browser-actions';
import { element, by, ElementFinder } from 'protractor';

export class TaskListPage {
    rootElement: ElementFinder;
    dataTable: DataTableComponentPage;
    noTasksFound: ElementFinder;

    constructor(
        rootElement = element.all(by.css('adf-tasklist')).first()
    ) {
        this.rootElement = rootElement;
        this.dataTable = new DataTableComponentPage(this.rootElement);
        this.noTasksFound = this.rootElement.element(
            by.css('.adf-empty-content__title')
        );
    }

    getDataTable() {
        return this.dataTable;
    }

    getRowsDisplayedWithSameName(taskName: string): Promise<string> {
        return this.dataTable.getRowsWithSameColumnValues('Name', taskName);
    }

    async checkContentIsDisplayedByColumn(column: string, processName: string): Promise<void> {
        await this.dataTable.waitTillContentLoaded();
        return this.dataTable.checkContentIsDisplayed(column, processName);
    }

    async checkContentIsNotDisplayedByColumn(column: string, processName: string): Promise<void> {
        await this.dataTable.waitTillContentLoaded();
        return this.dataTable.checkContentIsNotDisplayed(column, processName);
    }

    async checkTaskListIsLoaded(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.rootElement);
    }

    getNoTasksFoundMessage(): Promise<string> {
        return BrowserActions.getText(this.noTasksFound);
    }

    checkRowIsSelected(taskName: string): Promise<void> {
        return this.dataTable.checkRowIsSelected('Name', taskName);
    }

    async selectRowByName(taskName: string): Promise<void> {
        await this.dataTable.selectRow('Name', taskName);
    }

    getAllRowsNameColumn(): Promise<any> {
        return this.dataTable.getAllRowsColumnValues('Name');
    }
}
