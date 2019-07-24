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

import { browser, by, element, ElementArrayFinder, ElementFinder, protractor } from 'protractor';
import { DataTableComponentPage } from '@alfresco/adf-testing';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

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
    allSelectedRows: ElementArrayFinder = element.all(by.css(`div[class*='is-selected']`));
    selectedRowNumber: ElementFinder = element(by.css(`div[class*='is-selected'] div[data-automation-id*='text_']`));
    selectAll: ElementFinder = element(by.css(`div[class*='header'] label`));
    addRowElement: ElementFinder = element(by.xpath(`//span[contains(text(),'Add row')]/..`));
    replaceRowsElement: ElementFinder = element(by.xpath(`//span[contains(text(),'Replace rows')]/..`));
    replaceColumnsElement: ElementFinder = element(by.xpath(`//span[contains(text(),'Replace columns')]/..`));
    createdOnColumn: ElementFinder = element(by.css(`div[data-automation-id='auto_id_createdOn']`));
    idColumnHeader: ElementFinder = element(by.css(`div[data-automation-id='auto_id_id']`));
    pasteClipboardInput: ElementFinder = element(by.css(`input[data-automation-id='paste clipboard input']`));

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

    async checkRowIsNotSelected(rowNumber): Promise<void> {
        const isRowSelected = this.dataTable.getCellElementByValue(this.columns.id, rowNumber)
            .element(by.xpath(`ancestor::div[contains(@class, 'adf-datatable-row custom-row-style ng-star-inserted is-selected')]`));
        await BrowserVisibility.waitUntilElementIsNotVisible(isRowSelected);
    }

    async checkNoRowIsSelected(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.selectedRowNumber);
    }

    async checkAllRows(): Promise<void> {
        await BrowserActions.click(this.selectAll);
    }

    async checkRowIsChecked(rowNumber): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.getRowCheckbox(rowNumber));
    }

    async checkRowIsNotChecked(rowNumber): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.getRowCheckbox(rowNumber));
    }

    async getNumberOfSelectedRows(): Promise<number> {
        return this.allSelectedRows.count();
    }

    async clickCheckbox(rowNumber): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        const checkbox = this.dataTable.getCellElementByValue(this.columns.id, rowNumber)
            .element(by.xpath(`ancestor::div[contains(@class, 'adf-datatable-row')]//mat-checkbox/label`));
        await BrowserActions.click(checkbox);
    }

    async selectRow(rowNumber): Promise<void> {
        const row = this.dataTable.getCellElementByValue(this.columns.id, rowNumber);
        await BrowserActions.click(row);
    }

    async selectRowWithKeyboard(rowNumber): Promise<void> {
        await browser.actions().sendKeys(protractor.Key.COMMAND).perform();
        await this.selectRow(rowNumber);
        await browser.actions().sendKeys(protractor.Key.NULL).perform();
    }

    async selectSelectionMode(selectionMode): Promise<void> {
        const selectMode: ElementFinder = element(by.cssContainingText(`span[class='mat-option-text']`, selectionMode));
        await BrowserActions.clickExecuteScript('div[class="mat-select-arrow"]');
        await BrowserActions.click(selectMode);
    }

    getRowCheckbox(rowNumber): ElementFinder {
        return this.dataTable.getCellElementByValue(this.columns.id, rowNumber).element(by.xpath(`ancestor::div/div/mat-checkbox[contains(@class, 'mat-checkbox-checked')]`));
    }

    async getCopyContentTooltip(): Promise<string> {
        return await this.dataTable.getCopyContentTooltip();
    }

    async mouseOverNameColumn(name): Promise<void> {
        await this.dataTable.mouseOverColumn(this.columns.name, name);
    }

    async mouseOverCreatedByColumn(name): Promise<void> {
        await this.dataTable.mouseOverColumn(this.columns.createdBy, name);
    }

    async mouseOverIdColumn(name): Promise<void> {
        await this.dataTable.mouseOverColumn(this.columns.id, name);
    }

    async mouseOverJsonColumn(rowNumber): Promise<void> {
        await this.dataTable.mouseOverElement(this.dataTable.getCellByRowNumberAndColumnName(rowNumber - 1, this.columns.json));
    }

    getDropTargetIdColumnCell(rowNumber): ElementFinder {
        return this.dataTable.getCellByRowNumberAndColumnName(rowNumber - 1, this.columns.id);
    }

    getDropTargetIdColumnHeader(): ElementFinder {
        return this.idColumnHeader;
    }

    async clickOnIdColumn(name): Promise<void> {
        await this.dataTable.clickColumn(this.columns.id, name);
    }

    async clickOnJsonColumn(rowNumber): Promise<void> {
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
        return await this.pasteClipboardInput.getAttribute('value');
    }
}
