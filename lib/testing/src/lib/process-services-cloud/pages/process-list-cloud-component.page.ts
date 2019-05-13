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
import { element, by } from 'protractor';
import { BrowserActions } from '../../core/utils/browser-actions';

export class ProcessListCloudComponentPage {

    columns = {
        id: 'Id',
        name: 'Name'
    };

    processList = element(by.css('adf-cloud-process-list'));
    noProcessFound = element.all(by.css("div[class='adf-empty-content__title']")).first();

    dataTable = new DataTableComponentPage(this.processList);

    getDataTable() {
        return this.dataTable;
    }

    selectRow(processName) {
        return this.dataTable.selectRow(this.columns.name, processName);
    }

    selectRowById(processId) {
        return this.dataTable.selectRow(this.columns.id, processId);
    }

    checkRowIsSelectedById(processId) {
        return this.dataTable.checkRowIsSelected(this.columns.id, processId);
    }

    checkRowIsNotSelectedById(processId) {
        return this.dataTable.checkRowIsNotSelected(this.columns.id, processId);
    }

    checkRowIsCheckedById(processId) {
        return this.dataTable.checkRowIsChecked(this.columns.id, processId);
    }

    checkRowIsNotCheckedById(processId) {
        return this.dataTable.checkRowIsNotChecked(this.columns.id, processId);
    }

    checkCheckboxById(processId) {
        return this.dataTable.clickCheckbox(this.columns.id, processId);
    }

    checkContentIsDisplayedByName(processName) {
        return this.dataTable.checkContentIsDisplayed(this.columns.name, processName);
    }

    checkContentIsDisplayedById(processId) {
        return this.dataTable.checkContentIsDisplayed(this.columns.id, processId);
    }

    checkContentIsNotDisplayedById(processId) {
        return this.dataTable.checkContentIsNotDisplayed(this.columns.id, processId);
    }

    selectRowWithKeyboard(processId) {
        return this.dataTable.selectRowWithKeyboard(this.columns.id, processId);
    }

    getAllRowsNameColumn() {
        return this.dataTable.getAllRowsColumnValues(this.columns.name);
    }

    checkProcessListIsLoaded() {
        BrowserVisibility.waitUntilElementIsVisible(this.processList);
        return this;
    }

    getNoProcessFoundMessage() {
        return BrowserActions.getText(this.noProcessFound);
    }

    getAllRowsByColumn(column) {
        return this.dataTable.getAllRowsColumnValues(column);
    }

}
