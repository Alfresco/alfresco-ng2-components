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

import { by, element, ElementFinder } from 'protractor';
import { DataTableComponentPage } from '@alfresco/adf-testing';
import { BrowserActions } from '@alfresco/adf-testing';

export class FiltersPage {

    activeFilter: ElementFinder = element(by.css('mat-list-item[class*="active"]'));
    dataTable: DataTableComponentPage = new DataTableComponentPage();

    async getActiveFilter(): Promise<string> {
        return BrowserActions.getText(this.activeFilter);
    }

    async goToFilter(filterName): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.clickExecuteScript(`span[data-automation-id="${filterName}_filter"]`);
    }

    async sortByName(sortOrder: string): Promise<void> {
        await this.dataTable.sortByColumn(sortOrder, 'name');
    }

    async getAllRowsNameColumn() {
        return await this.dataTable.getAllRowsColumnValues('Name');
    }

}
