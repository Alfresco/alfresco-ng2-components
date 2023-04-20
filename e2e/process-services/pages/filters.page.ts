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
import { $ } from 'protractor';

export class FiltersPage {

    activeFilter = $('.adf-active');
    dataTable: DataTableComponentPage = new DataTableComponentPage();

    async getActiveFilter(): Promise<string> {
        return BrowserActions.getText(this.activeFilter);
    }

    async goToFilter(filterName): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        const filter = $(`button[data-automation-id="${filterName}_filter"]`);
        await BrowserActions.click(filter);
        await this.dataTable.waitTillContentLoaded();
    }

    async sortByName(sortOrder: string): Promise<void> {
        await this.dataTable.sortByColumn(sortOrder, 'name');
    }

    async getAllRowsNameColumn(): Promise<string[]> {
        return this.dataTable.getAllRowsColumnValues('Name');
    }

    async checkFilterIsHighlighted(filterName: string): Promise<void> {
        const highlightedFilter = $(`.adf-active [data-automation-id='${filterName}_filter']`);
        await BrowserVisibility.waitUntilElementIsVisible(highlightedFilter);
    }
}
