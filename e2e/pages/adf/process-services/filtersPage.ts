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
import { Util } from '../../../util/util';
import { DataTableComponentPage } from '../dataTableComponentPage';

export class FiltersPage {

    activeFilter = element(by.css('mat-list-item[class*="active"]'));
    dataTable = new DataTableComponentPage();

    getActiveFilter() {
        Util.waitUntilElementIsVisible(this.activeFilter);
        return this.activeFilter.getText();
    }

    goToFilter(filterName) {
        let filter = element(by.css(`span[data-automation-id="${filterName}_filter"]`));
        Util.waitUntilElementIsVisible(filter);
        filter.click();
        return this;
    }

    sortByName(sortOrder) {
        this.dataTable.sortByColumn(sortOrder, 'name');
    }

    getAllRowsNameColumn() {
        return this.dataTable.getAllRowsColumnValues('Name');
    }

}
