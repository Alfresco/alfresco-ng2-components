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
import { Util } from '../../util/util';
import { ElementFinder, ElementArrayFinder } from 'protractor/built/element';

export class DataTablePage {

    rootElement: ElementFinder;
    list: ElementArrayFinder;
    contents = element.all(by.css('div[class="adf-datatable-body"] span'));
    multiSelect = element(by.css(`div[data-automation-id='multiselect'] label > div[class='mat-checkbox-inner-container']`));
    selectionButton = element(by.css(`div[class='mat-select-arrow']`));
    selectionDropDown = element(by.css(`div[class*='ng-trigger-transformPanel']`));
    allSelectedRows = element.all(by.css(`div[class*='is-selected']`));
    selectedRowNumber = element(by.css(`div[class*='is-selected'] div[data-automation-id*='text_']`));
    selectAll = element(by.css(`div[class*='header'] mat-checkbox`));
    addRowElement = element(by.xpath(`//span[contains(text(),'Add row')]/..`));
    replaceRowsElement = element(by.xpath(`//span[contains(text(),'Replace rows')]/..`));
    reset = element(by.xpath(`//span[contains(text(),'Reset to default')]/..`));
    replaceColumnsElement = element(by.xpath(`//span[contains(text(),'Replace columns')]/..`));
    createdOnColumn = element(by.css(`div[data-automation-id='auto_id_createdOn']`));
    tableBody = element.all(by.css(`div[class='adf-datatable-body']`)).first();
    spinner = element(by.css('mat-progress-spinner'));
    rows = by.css(`adf-datatable div[class*='adf-datatable-body'] div[class*='adf-datatable-row']`);
    allColumns = element.all(by.css('div[data-automation-id*="auto_id_entry."]'));

    constructor(rootElement: ElementFinder = element(by.css('adf-datatable'))) {
        this.rootElement = rootElement;
        this.list = this.rootElement.all(by.css(`div[class*=adf-datatable-body] div[class*=adf-datatable-row]`));
    }

    getFileHyperlink(filename) {
        return element(by.cssContainingText('adf-name-column[class*="adf-datatable-link"] span', filename));
    }

    getAllDisplayedRows() {
        return element.all(this.rows).count();
    }

    getAllRowsNameColumn() {
        return this.getAllRowsColumnValues('Name');
    }

    async getAllRowsColumnValues(locator) {
        let columnLocator = by.css("adf-datatable div[class*='adf-datatable-body'] div[class*='adf-datatable-row'] div[title='" + locator + "'] span");
        Util.waitUntilElementIsVisible(element.all(columnLocator).first());
        let initialList = await element.all(columnLocator).getText();
        return initialList.filter((el) => el);
    }

    getRowByRowNumber(rowNumber) {
        Util.waitUntilElementIsVisible(element(by.css(`div[data-automation-id='text_` + rowNumber + `']`)));
        return element(by.css(`div[data-automation-id='text_` + rowNumber + `']`));
    }

    getRowCheckbox(rowNumber) {
        return this.getRowByRowNumber(rowNumber).element(by.xpath(`ancestor::div/div/mat-checkbox[contains(@class, 'mat-checkbox-checked')]`));
    }

    clickMultiSelect() {
        Util.waitUntilElementIsVisible(this.multiSelect);
        this.multiSelect.click();
    }

    clickReset() {
        Util.waitUntilElementIsVisible(this.reset);
        this.reset.click();
    }

    clickCheckbox(rowNumber) {
        let checkbox = this.getRowByRowNumber(rowNumber).element(by.xpath(`ancestor::div[contains(@class, 'adf-datatable-row')]//mat-checkbox/label`));
        Util.waitUntilElementIsVisible(checkbox);
        checkbox.click();
    }

    clickCheckboxByName(rowName) {
        let checkbox = this.getRowsName(rowName).element(by.xpath(`ancestor::div[contains(@class, 'adf-datatable-row')]//mat-checkbox/label`));
        Util.waitUntilElementIsVisible(checkbox);
        checkbox.click();
    }

    getRowCheckboxByName(rowName) {
        return this.getRowsName(rowName).element(by.xpath(`ancestor::div/div/mat-checkbox[contains(@class, 'mat-checkbox-checked')]`));
    }

    checkRowIsNotCheckedByName(rowName) {
        Util.waitUntilElementIsNotOnPage(this.getRowCheckboxByName(rowName));
    }

    checkRowIsCheckedByName(rowName) {
        Util.waitUntilElementIsVisible(this.getRowCheckboxByName(rowName));
    }

    selectRow(rowNumber) {
        return this.getRowByRowNumber(rowNumber).click();
    }

    selectRowWithKeyboard(rowNumber) {
        let row = this.getRowByRowNumber(rowNumber);
        browser.actions().sendKeys(protractor.Key.COMMAND).click(row).perform();
    }

    selectSelectionMode(selectionMode) {
        let selectMode = element(by.cssContainingText(`span[class='mat-option-text']`, selectionMode));
        this.selectionButton.click();
        Util.waitUntilElementIsVisible(this.selectionDropDown);
        selectMode.click();
    }

    selectRowByRowName(rowName) {
        let row = element(by.cssContainingText(`[data-automation-id*="${rowName}"]`, rowName));
        Util.waitUntilElementIsVisible(row);
        Util.waitUntilElementIsClickable(row);
        return row.click();
    }

    checkRowIsSelectedByName(rowName) {
        let row = element(by.cssContainingText(`[data-automation-id*="${rowName}"]`, rowName));
        let isRowSelected = row.element(by.xpath(`ancestor::div[contains(@class, 'is-selected')]`));
        Util.waitUntilElementIsVisible(isRowSelected);
    }

    checkRowIsNotSelectedByName(rowName) {
        let row = element(by.cssContainingText(`[data-automation-id*="${rowName}"]`, rowName));
        let isRowSelected = row.element(by.xpath(`ancestor::div[contains(@class, 'is-selected')]`));
        Util.waitUntilElementIsNotOnPage(isRowSelected);
    }

    selectRowByNameWithKeyboard(rowName) {
        let row = element(by.cssContainingText(`[data-automation-id*="${rowName}"]`, rowName));
        browser.actions().sendKeys(protractor.Key.COMMAND).click(row).perform();
    }

    checkRowIsSelected(rowNumber) {
        let isRowSelected = this.getRowByRowNumber(rowNumber).element(by.xpath(`ancestor::div[contains(@class, 'is-selected')]`));
        Util.waitUntilElementIsVisible(isRowSelected);
    }

    checkRowIsNotSelected(rowNumber) {
        let isRowSelected = this.getRowByRowNumber(rowNumber)
            .element(by.xpath(`ancestor::div[contains(@class, 'adf-datatable-row custom-row-style ng-star-inserted is-selected')]`));
        Util.waitUntilElementIsNotOnPage(isRowSelected);
    }

    checkNoRowIsSelected() {
        Util.waitUntilElementIsNotOnPage(this.selectedRowNumber);
    }

    checkAllRowsButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.selectAll);
        Util.waitUntilElementIsVisible(this.selectAll);
        return this;
    }

    checkAllRows() {
        Util.waitUntilElementIsVisible(this.selectAll);
        Util.waitUntilElementIsClickable(this.selectAll);
        this.selectAll.click();
    }

    checkRowIsChecked(rowNumber) {
        Util.waitUntilElementIsVisible(this.getRowCheckbox(rowNumber));
    }

    checkRowIsNotChecked(rowNumber) {
        Util.waitUntilElementIsNotOnPage(this.getRowCheckbox(rowNumber));
    }

    addRow() {
        Util.waitUntilElementIsVisible(this.addRowElement);
        this.addRowElement.click();
    }

    getNumberOfRows() {
        return this.list.count();
    }

    getNumberOfSelectedRows() {
        return this.allSelectedRows.count();
    }

    replaceRows(id) {
        let rowID = this.getRowByRowNumber(id);
        Util.waitUntilElementIsVisible(rowID);
        this.replaceRowsElement.click();
        Util.waitUntilElementIsNotOnPage(rowID);
    }

    replaceColumns() {
        Util.waitUntilElementIsVisible(this.replaceColumnsElement);
        this.replaceColumnsElement.click();
        Util.waitUntilElementIsNotOnPage(this.createdOnColumn);
    }

    getRowsName(content) {
        let row = element(by.css(`div[data-automation-id*='` + content + `']`));
        Util.waitUntilElementIsPresent(row);
        return row;
    }

    doubleClickRow(rowName) {
        let row = this.getRowByRowName(rowName);
        Util.waitUntilElementIsVisible(row);
        Util.waitUntilElementIsClickable(row);
        row.click();
        Util.waitUntilElementIsVisible(row.all(by.css(`div[class*='--image'] mat-icon[svgicon*='selected']`)).first());
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
        return this;
    }

    getRowByRowName(content) {
        let rowByRowName = by.xpath(`ancestor::div[contains(@class, 'adf-datatable-row')]`);
        Util.waitUntilElementIsPresent(this.getRowsName(content).element(rowByRowName));
        return this.getRowsName(content).element(rowByRowName);
    }

    waitForTableBody() {
        Util.waitUntilElementIsVisible(this.tableBody);
    }

    insertFilter(filterText) {
        let inputFilter = element(by.css(`#adf-datatable-filter-input`));
        inputFilter.clear();
        return inputFilter.sendKeys(filterText);
    }

    getNodeIdFirstElement() {
        let firstNode = element.all(by.css('adf-datatable div[title="Node id"] span')).first();
        return firstNode.getText();
    }

    sortByColumn(sortOrder, locator) {
        Util.waitUntilElementIsVisible(element(locator));
        return element(locator).getAttribute('class').then(function (result) {
            if (sortOrder === true) {
                if (!result.includes('sorted-asc')) {
                    if (result.includes('sorted-desc') || result.includes('sortable')) {
                        element(locator).click();
                    }
                }
            } else {
                if (result.includes('sorted-asc')) {
                    element(locator).click();
                } else if (result.includes('sortable')) {
                    element(locator).click();
                    element(locator).click();
                }
            }

            return Promise.resolve();
        });
    }

    checkContentIsDisplayed(content) {
        let row = by.cssContainingText(`[data-automation-id*="${content}"]`, content);
        Util.waitUntilElementIsVisible(this.tableBody.all(row).first());
        return this;
    }

    checkContentIsNotDisplayed(content) {
        let row = by.cssContainingText(`[data-automation-id*="${content}"]`, content);
        Util.waitUntilElementIsNotOnPage(this.tableBody.all(row).first());
        return this;
    }

    selectRowByContentName(content) {
        let row = by.cssContainingText(`[data-automation-id*="${content}"]`, content);
        Util.waitUntilElementIsVisible(this.tableBody.element(row));
        this.tableBody.element(row).click();
        return this;
    }

    contentInPosition(position) {
        Util.waitUntilElementIsVisible(this.contents);
        return this.contents.get(position - 1).getText();
    }

    checkSpinnerIsDisplayed() {
        Util.waitUntilElementIsPresent(this.spinner);
        return this;
    }

    checkSpinnerIsNotDisplayed() {
        Util.waitUntilElementIsNotOnPage(this.spinner);
        return this;
    }

    checkSpinnerIsNotDisplayed() {
        Util.waitUntilElementIsNotOnPage(this.spinner);
    }

    checkRowIsDisplayedByName(filename) {
        Util.waitUntilElementIsVisible(element.all(by.css(`div[filename="${filename}"]`)).first());
    }

    checkRowIsNotDisplayedByName(filename) {
        Util.waitUntilElementIsNotOnPage(element.all(by.css(`div[filename="${filename}"]`)).first());
    }

    getNumberOfRowsDisplayedWithSameName(filename) {
        Util.waitUntilElementIsVisible(element(by.css(`div[filename="${filename}"]`)));
        return element.all(by.css(`div[title='Name'][filename="${filename}"]`)).count();
    }

    getNumberOfRowsDisplayedByName(filename) {
        let rowLocator = by.cssContainingText(`[data-automation-id*="${filename}"]`, filename);
        Util.waitUntilElementIsVisible(element(rowLocator));
        return element.all(by.css(`div[title='Name'] div[data-automation-id*="${filename}"]`)).count();
    }

    checkColumnIsDisplayed(column) {
        Util.waitUntilElementIsVisible(element(by.css(`div[data-automation-id="auto_id_entry.${column}"]`)));
        return this;
    }

    getNoOfColumns() {
        return this.allColumns.count();
    }

    getCellByNameAndColumn(content, columnName) {
        return this.getRowByRowName(content).element(by.css(`div[title='${columnName}']`));
    }

}
