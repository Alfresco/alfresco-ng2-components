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
import { DataTableComponentPage } from '../dataTableComponentPage';
import { element, by } from 'protractor';

export class ProcessListCloudComponent {

    processList = element(by.css('adf-cloud-process-list'));
    noProcessFound = element.all(by.css("p[class='adf-empty-content__title']")).first();

    dataTable = new DataTableComponentPage(this.processList);

    getDataTable() {
        return this.dataTable;
    }

    checkContentIsDisplayedByName(processName) {
        return this.dataTable.checkContentIsDisplayed('Name', processName);
    }

    checkContentIsDisplayedById(processId) {
        return this.dataTable.checkContentIsDisplayed('Id', processId);
    }

    checkContentIsNotDisplayedById(processId) {
        return this.dataTable.checkContentIsNotDisplayed('Id', processId);
    }

    getAllRowsNameColumn() {
        return this.dataTable.getAllRowsColumnValues('Name');
    }

    checkProcessListIsLoaded() {
        Util.waitUntilElementIsVisible(this.processList);
        return this;
    }

    getNoProcessFoundMessage() {
        Util.waitUntilElementIsVisible(this.noProcessFound);
        return this.noProcessFound.getText();
    }

    getAllRowsByColumn(column) {
        return this.dataTable.getAllRowsColumnValues(column);
    }

}
