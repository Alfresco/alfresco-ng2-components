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

import { by, element } from 'protractor';
import { DataTableComponentPage } from '@alfresco/adf-testing';
import { BrowserActions } from '@alfresco/adf-testing';

export class FiltersPage {

    activeFilter = element(by.css('mat-list-item[class*="active"]'));
    dataTable = new DataTableComponentPage();

    getActiveFilter() {
        return BrowserActions.getText(this.activeFilter);
    }

    goToFilter(filterName) {
        BrowserActions.closeMenuAndDialogs();
        const filter = element(by.css(`span[data-automation-id="${filterName}_filter"]`));
        BrowserActions.click(filter);
        return this;
    }

    sortByName(sortOrder) {
        this.dataTable.sortByColumn(sortOrder, 'name');
    }

    getAllRowsNameColumn() {
        return this.dataTable.getAllRowsColumnValues('Name');
    }

}
