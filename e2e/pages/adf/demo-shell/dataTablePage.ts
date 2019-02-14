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
import { DataTableComponentPage } from '../dataTableComponentPage';
import { Util } from '../../../util/util';

export class DataTablePage {

    dataTable = new DataTableComponentPage();
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

    insertFilter(filterText) {
        let inputFilter = element(by.css(`#adf-datatable-filter-input`));
        inputFilter.clear();
        return inputFilter.sendKeys(filterText);
    }

    addRow() {
        Util.waitUntilElementIsVisible(this.addRowElement);
        this.addRowElement.click();
    }

    replaceRows(id) {
        let rowID = this.dataTable.getRow('Id', id);
        Util.waitUntilElementIsVisible(rowID);
        this.replaceRowsElement.click();
        Util.waitUntilElementIsNotVisible(rowID);
    }

    replaceColumns() {
        Util.waitUntilElementIsVisible(this.replaceColumnsElement);
        this.replaceColumnsElement.click();
        Util.waitUntilElementIsNotOnPage(this.createdOnColumn);
    }

    clickMultiSelect() {
        Util.waitUntilElementIsVisible(this.multiSelect);
        this.multiSelect.click();
    }

    clickReset() {
        Util.waitUntilElementIsVisible(this.reset);
        this.reset.click();
    }

    checkRowIsNotSelected(rowNumber) {
        let isRowSelected = this.dataTable.getRow('Id', rowNumber)
            .element(by.xpath(`ancestor::div[contains(@class, 'adf-datatable-row custom-row-style ng-star-inserted is-selected')]`));
        Util.waitUntilElementIsNotOnPage(isRowSelected);
    }

    checkNoRowIsSelected() {
        Util.waitUntilElementIsNotOnPage(this.selectedRowNumber);
    }

    checkAllRows() {
        Util.waitUntilElementIsVisible(this.selectAll);
        this.selectAll.click();
    }

    checkRowIsChecked(rowNumber) {
        Util.waitUntilElementIsVisible(this.getRowCheckbox(rowNumber));
    }

    checkRowIsNotChecked(rowNumber) {
        Util.waitUntilElementIsNotOnPage(this.getRowCheckbox(rowNumber));
    }

    getNumberOfSelectedRows() {
        return this.allSelectedRows.count();
    }

    clickCheckbox(rowNumber) {
        let checkbox = this.dataTable.getRow('Id', rowNumber).element(by.xpath(`ancestor::div[contains(@class, 'adf-datatable-row')]//mat-checkbox/label`));
        Util.waitUntilElementIsVisible(checkbox);
        checkbox.click();
    }

    selectRow(rowNumber) {
        return this.dataTable.getRow('Id', rowNumber).click();
    }

    selectRowWithKeyboard(rowNumber) {
        let row = this.dataTable.getRow('Id', rowNumber);
        browser.actions().sendKeys(protractor.Key.COMMAND).click(row).perform();
    }

    selectSelectionMode(selectionMode) {
        let selectMode = element(by.cssContainingText(`span[class='mat-option-text']`, selectionMode));
        this.selectionButton.click();
        Util.waitUntilElementIsVisible(this.selectionDropDown);
        selectMode.click();
    }

    getRowCheckbox(rowNumber) {
        return this.dataTable.getRow('Id', rowNumber).element(by.xpath(`ancestor::div/div/mat-checkbox[contains(@class, 'mat-checkbox-checked')]`));
    }
}
