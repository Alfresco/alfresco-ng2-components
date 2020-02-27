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

import { BrowserActions, BrowserVisibility, DataTableComponentPage, DropdownPage } from '@alfresco/adf-testing';
import { browser, by, element, ElementArrayFinder, ElementFinder, protractor } from 'protractor';

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
    multiSelect: ElementFinder = element(by.css(`div[data-automation-id='multiselect'] label > div[class='mat-checkbox-inner-container']`));
    reset: ElementFinder = element(by.xpath(`//span[contains(text(),'Reset to default')]/..`));
    allSelectedRows: ElementArrayFinder = element.all(by.css(`adf-datatable-row[class*='is-selected']`));
    selectedRowNumber: ElementFinder = element(by.css(`adf-datatable-row[class*='is-selected'] div[data-automation-id*='text_']`));
    selectAll: ElementFinder = element(by.css(`div[class*='header'] label`));
    addRowElement: ElementFinder = element(by.xpath(`//span[contains(text(),'Add row')]/..`));
    replaceRowsElement: ElementFinder = element(by.xpath(`//span[contains(text(),'Replace rows')]/..`));
    replaceColumnsElement: ElementFinder = element(by.xpath(`//span[contains(text(),'Replace columns')]/..`));
    createdOnColumn: ElementFinder = element(by.css(`div[data-automation-id='auto_id_createdOn']`));
    idColumnHeader: ElementFinder = element(by.css(`div[data-automation-id='auto_id_id']`));
    pasteClipboardInput: ElementFinder = element(by.css(`input[data-automation-id='paste clipboard input']`));

    selectModeDropdown = new DropdownPage(element(by.css(`mat-select[data-automation-id='datatable-selection-mode']`)));

    constructor(data?) {
        if (this.data[data]) {
            this.dataTable = new DataTableComponentPage(element(by.css(`div[data-automation-id='` + this.data[data] + `']`)));
        } else {
            this.dataTable = new DataTableComponentPage(element(by.css(`div[data-automation-id='` + this.data.defaultTable + `']`)));
        }
    }

    async insertFilter(filterText): Promise<void> {
        const inputFilter: ElementFinder = element(by.css(`#adf-datatable-filter-input`));
        await BrowserActions.clearSendKeys(inputFilter, filterText);
    }

    async addRow(): Promise<void> {
        await BrowserActions.click(this.addRowElement);
    }

    async replaceRows(id): Promise<void> {
        const rowID = this.dataTable.getCellElementByValue(this.columns.id, id);
        await BrowserVisibility.waitUntilElementIsVisible(rowID);
        await BrowserActions.click(this.replaceRowsElement);
        await BrowserVisibility.waitUntilElementIsNotVisible(rowID);
    }

    async replaceColumns(): Promise<void> {
        await BrowserActions.click(this.replaceColumnsElement);
        await BrowserVisibility.waitUntilElementIsNotVisible(this.createdOnColumn);
    }

    async clickMultiSelect(): Promise<void> {
        await BrowserActions.click(this.multiSelect);
    }

    async clickReset(): Promise<void> {
        await BrowserActions.click(this.reset);
    }

    async checkRowIsNotSelected(rowNumber: string): Promise<void> {
        const isRowSelected = this.dataTable.getCellElementByValue(this.columns.id, rowNumber)
            .element(by.xpath(`ancestor::adf-datatable-row[contains(@class, 'adf-datatable-row custom-row-style ng-star-inserted is-selected')]`));
        await BrowserVisibility.waitUntilElementIsNotVisible(isRowSelected);
    }

    async checkNoRowIsSelected(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.selectedRowNumber);
    }

    async checkAllRows(): Promise<void> {
        await BrowserActions.click(this.selectAll);
    }

    async checkRowIsChecked(rowNumber: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.getRowCheckbox(rowNumber));
    }

    async checkRowIsNotChecked(rowNumber: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.getRowCheckbox(rowNumber));
    }

    async getNumberOfSelectedRows(): Promise<number> {
        return this.allSelectedRows.count();
    }

    async clickCheckbox(rowNumber: string): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        const checkbox = this.dataTable.getCellElementByValue(this.columns.id, rowNumber)
            .element(by.xpath(`ancestor::adf-datatable-row[contains(@class, 'adf-datatable-row')]//mat-checkbox/label`));
        await BrowserActions.click(checkbox);
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

    async selectSelectionMode(selectionMode): Promise<void> {
        await this.selectModeDropdown.clickDropdown();
        await this.selectModeDropdown.selectOption(selectionMode);
    }

    getRowCheckbox(rowNumber: string): ElementFinder {
        return this.dataTable.getCellElementByValue(this.columns.id, rowNumber).element(by.xpath(`ancestor::adf-datatable-row/div/mat-checkbox[contains(@class, 'mat-checkbox-checked')]`));
    }

    async getCopyContentTooltip(): Promise<string> {
        return this.dataTable.getCopyContentTooltip();
    }

    async mouseOverNameColumn(name: string): Promise<void> {
        await this.dataTable.mouseOverColumn(this.columns.name, name);
    }

    async mouseOverCreatedByColumn(name: string): Promise<void> {
        await this.dataTable.mouseOverColumn(this.columns.createdBy, name);
    }

    async mouseOverIdColumn(name: string): Promise<void> {
        await this.dataTable.mouseOverColumn(this.columns.id, name);
    }

    async mouseOverJsonColumn(rowNumber: number): Promise<void> {
        const cell = this.dataTable.getCellByRowNumberAndColumnName(rowNumber - 1, this.columns.json);
        await BrowserVisibility.waitUntilElementIsVisible(cell);
        await browser.actions().mouseMove(cell).perform();
    }

    getDropTargetIdColumnCell(rowNumber: number): ElementFinder {
        return this.dataTable.getCellByRowNumberAndColumnName(rowNumber - 1, this.columns.id);
    }

    getDropTargetIdColumnHeader(): ElementFinder {
        return this.idColumnHeader;
    }

    async clickOnIdColumn(name: string): Promise<void> {
        await this.dataTable.clickColumn(this.columns.id, name);
    }

    async clickOnJsonColumn(rowNumber: number): Promise<void> {
        await BrowserActions.click(this.dataTable.getCellByRowNumberAndColumnName(rowNumber - 1, this.columns.json));
    }

    async clickOnNameColumn(name): Promise<void> {
        await this.dataTable.clickColumn(this.columns.name, name);
    }

    async clickOnCreatedByColumn(name): Promise<void> {
        await this.dataTable.clickColumn(this.columns.createdBy, name);
    }

    async pasteClipboard(): Promise<void> {
        await this.pasteClipboardInput.clear();
        await BrowserActions.click(this.pasteClipboardInput);
        await this.pasteClipboardInput.sendKeys(protractor.Key.chord(protractor.Key.SHIFT, protractor.Key.INSERT));
    }

    async getClipboardInputText(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.pasteClipboardInput);
        return this.pasteClipboardInput.getAttribute('value');
    }
}
