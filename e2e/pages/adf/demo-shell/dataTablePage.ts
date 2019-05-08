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

import { browser, by, element, protractor } from 'protractor';
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

    dataTable;
    multiSelect = element(by.css(`div[data-automation-id='multiselect'] label > div[class='mat-checkbox-inner-container']`));
    reset = element(by.xpath(`//span[contains(text(),'Reset to default')]/..`));
    selectionButton = element(by.css(`div[class='mat-select-arrow']`));
    selectionDropDown = element(by.css(`div[class*='ng-trigger-transformPanel']`));
    allSelectedRows = element.all(by.css(`div[class*='is-selected']`));
    selectedRowNumber = element(by.css(`div[class*='is-selected'] div[data-automation-id*='text_']`));
    selectAll = element(by.css(`div[class*='header'] label`));
    addRowElement = element(by.xpath(`//span[contains(text(),'Add row')]/..`));
    replaceRowsElement = element(by.xpath(`//span[contains(text(),'Replace rows')]/..`));
    replaceColumnsElement = element(by.xpath(`//span[contains(text(),'Replace columns')]/..`));
    createdOnColumn = element(by.css(`div[data-automation-id='auto_id_createdOn']`));
    idColumnHeader = element(by.css(`div[data-automation-id='auto_id_id']`));
    pasteClipboardInput = element(by.css(`input[data-automation-id='paste clipboard input']`));

    constructor(data?) {
        if (this.data[data]) {
            this.dataTable = new DataTableComponentPage(element(by.css(`div[data-automation-id='` + this.data[data] + `']`)));
        } else {
            this.dataTable = new DataTableComponentPage(element(by.css(`div[data-automation-id='` + this.data.defaultTable + `']`)));
        }
    }

    insertFilter(filterText) {
        const inputFilter = element(by.css(`#adf-datatable-filter-input`));
        inputFilter.clear();
        return inputFilter.sendKeys(filterText);
    }

    addRow() {
        BrowserActions.click(this.addRowElement);
    }

    replaceRows(id) {
        const rowID = this.dataTable.getCellElementByValue(this.columns.id, id);
        BrowserVisibility.waitUntilElementIsVisible(rowID);
        BrowserActions.click(this.replaceRowsElement);
        BrowserVisibility.waitUntilElementIsNotVisible(rowID);
    }

    replaceColumns() {
        BrowserActions.click(this.replaceColumnsElement);
        BrowserVisibility.waitUntilElementIsNotOnPage(this.createdOnColumn);
    }

    clickMultiSelect() {
        BrowserActions.click(this.multiSelect);
    }

    clickReset() {
        BrowserActions.click(this.reset);
    }

    checkRowIsNotSelected(rowNumber) {
        const isRowSelected = this.dataTable.getCellElementByValue(this.columns.id, rowNumber)
            .element(by.xpath(`ancestor::div[contains(@class, 'adf-datatable-row custom-row-style ng-star-inserted is-selected')]`));
        BrowserVisibility.waitUntilElementIsNotOnPage(isRowSelected);
    }

    checkNoRowIsSelected() {
        BrowserVisibility.waitUntilElementIsNotOnPage(this.selectedRowNumber);
    }

    checkAllRows() {
        BrowserActions.click(this.selectAll);
    }

    checkRowIsChecked(rowNumber) {
        BrowserVisibility.waitUntilElementIsVisible(this.getRowCheckbox(rowNumber));
    }

    checkRowIsNotChecked(rowNumber) {
        BrowserVisibility.waitUntilElementIsNotOnPage(this.getRowCheckbox(rowNumber));
    }

    getNumberOfSelectedRows() {
        return this.allSelectedRows.count();
    }

    clickCheckbox(rowNumber) {
        BrowserActions.closeMenuAndDialogs();
        const checkbox = this.dataTable.getCellElementByValue(this.columns.id, rowNumber)
            .element(by.xpath(`ancestor::div[contains(@class, 'adf-datatable-row')]//mat-checkbox/label`));
        BrowserActions.click(checkbox);
    }

    async selectRow(rowNumber) {
        BrowserActions.clickExecuteScript(`div[title="${this.columns.id}"] div[data-automation-id="text_${rowNumber}"] span`);
        return this;
    }

    selectRowWithKeyboard(rowNumber) {
        const row = this.dataTable.getCellElementByValue(this.columns.id, rowNumber);
        browser.actions().sendKeys(protractor.Key.COMMAND).click(row).perform();
    }

    selectSelectionMode(selectionMode) {
        const selectMode = element(by.cssContainingText(`span[class='mat-option-text']`, selectionMode));
        BrowserActions.clickExecuteScript('div[class="mat-select-arrow"]');
        BrowserActions.click(selectMode);
    }

    getRowCheckbox(rowNumber) {
        return this.dataTable.getCellElementByValue(this.columns.id, rowNumber).element(by.xpath(`ancestor::div/div/mat-checkbox[contains(@class, 'mat-checkbox-checked')]`));
    }

    getCopyContentTooltip() {
        return this.dataTable.getCopyContentTooltip();
    }

    mouseOverNameColumn(name) {
        return this.dataTable.mouseOverColumn(this.columns.name, name);
    }

    mouseOverCreatedByColumn(name) {
        return this.dataTable.mouseOverColumn(this.columns.createdBy, name);
    }

    mouseOverIdColumn(name) {
        return this.dataTable.mouseOverColumn(this.columns.id, name);
    }

    mouseOverJsonColumn(rowNumber) {
        return this.dataTable.mouseOverElement(this.dataTable.getCellByRowNumberAndColumnName(rowNumber - 1, this.columns.json));
    }

    getDropTargetIdColumnCell(rowNumber) {
        return this.dataTable.getCellByRowNumberAndColumnName(rowNumber - 1, this.columns.id);
    }

    getDropTargetIdColumnHeader() {
        return this.idColumnHeader;
    }

    clickOnIdColumn(name) {
        return this.dataTable.clickColumn(this.columns.id, name);
    }

    clickOnJsonColumn(rowNumber) {
        return this.dataTable.clickElement(this.dataTable.getCellByRowNumberAndColumnName(rowNumber - 1, this.columns.json));
    }

    clickOnNameColumn(name) {
        return this.dataTable.clickColumn(this.columns.name, name);
    }

    clickOnCreatedByColumn(name) {
        return this.dataTable.clickColumn(this.columns.createdBy, name);
    }

    pasteClipboard() {
        this.pasteClipboardInput.clear();
        BrowserActions.click(this.pasteClipboardInput);
        this.pasteClipboardInput.sendKeys(protractor.Key.chord(protractor.Key.SHIFT, protractor.Key.INSERT));
        return this;
    }

    getClipboardInputText() {
        BrowserVisibility.waitUntilElementIsVisible(this.pasteClipboardInput);
        return this.pasteClipboardInput.getAttribute('value');
    }
}
