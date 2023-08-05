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

import { BrowserActions, BrowserVisibility, DataTableComponentPage, DropdownPage } from '@alfresco/adf-testing';
import { $, $$, browser, by, element, protractor } from 'protractor';

export class DataTablePage {

    columns = {
        id: 'Id',
        name: 'Name',
        createdBy: 'Created By',
        json: 'Json'
    };

    data = {
        copyClipboardDataTable: 'copyClipboard-datatable',
        defaultTable: 'datatable'
    };

    dataTable: DataTableComponentPage;
    reset = element(by.xpath(`//span[contains(text(),'Reset to default')]/..`));
    allSelectedRows = $$(`adf-datatable-row[class*='is-selected']`);
    selectedRowNumber = $(`adf-datatable-row[class*='is-selected'] div[data-automation-id*='text_']`);
    selectModeDropdown = new DropdownPage($(`mat-select[data-automation-id='datatable-selection-mode']`));

    constructor(data?) {
        if (this.data[data]) {
            this.dataTable = new DataTableComponentPage($(`div[data-automation-id='` + this.data[data] + `']`));
        } else {
            this.dataTable = new DataTableComponentPage($(`div[data-automation-id='` + this.data.defaultTable + `']`));
        }
    }

    async checkRowIsNotSelected(rowNumber: string): Promise<void> {
        const isRowSelected = this.dataTable.getCellElementByValue(this.columns.id, rowNumber)
            .element(by.xpath(`ancestor::adf-datatable-row[contains(@class, 'adf-datatable-row custom-row-style ng-star-inserted is-selected')]`));
        await BrowserVisibility.waitUntilElementIsNotVisible(isRowSelected);
    }

    async checkNoRowIsSelected(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.selectedRowNumber);
    }

    async getNumberOfSelectedRows(): Promise<number> {
        return this.allSelectedRows.count();
    }

    async selectRow(rowNumber: string): Promise<void> {
        const row = this.dataTable.getCellElementByValue(this.columns.id, rowNumber);
        await BrowserActions.click(row);
    }

    async selectRowWithKeyboard(rowNumber: string): Promise<void> {
        await browser.actions().sendKeys(protractor.Key.COMMAND).perform();
        await this.selectRow(rowNumber);
        await browser.actions().sendKeys(protractor.Key.NULL).perform();
    }

    async selectSelectionMode(selectionMode: string): Promise<void> {
        await this.selectModeDropdown.selectDropdownOption(selectionMode);
    }
}
