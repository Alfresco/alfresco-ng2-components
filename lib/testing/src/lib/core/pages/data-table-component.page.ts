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
import { ElementFinder, ElementArrayFinder } from 'protractor/built/element';
import { BrowserVisibility } from '../utils/browser-visibility';
import { BrowserActions } from '../utils/browser-actions';

export class DataTableComponentPage {

    rootElement: ElementFinder;
    list: ElementArrayFinder;
    contents;
    tableBody;
    spinner;
    rows = by.css(`adf-datatable div[class*='adf-datatable-body'] div[class*='adf-datatable-row']`);
    allColumns;
    selectedRowNumber;
    allSelectedRows;
    selectAll;
    copyColumnTooltip;

    constructor(rootElement: ElementFinder = element.all(by.css('adf-datatable')).first()) {
        this.rootElement = rootElement;
        this.list = this.rootElement.all(by.css(`div[class*='adf-datatable-body'] div[class*='adf-datatable-row']`));
        this.contents = this.rootElement.all(by.css('div[class="adf-datatable-body"] span'));
        this.tableBody = this.rootElement.all(by.css(`div[class='adf-datatable-body']`)).first();
        this.spinner = this.rootElement.element(by.css('mat-progress-spinner'));
        this.allColumns = this.rootElement.all(by.css('div[data-automation-id*="auto_id_entry."]'));
        this.selectedRowNumber = this.rootElement.element(by.css(`div[class*='is-selected'] div[data-automation-id*='text_']`));
        this.allSelectedRows = this.rootElement.all(by.css(`div[class*='is-selected']`));
        this.selectAll = this.rootElement.element(by.css(`div[class*='adf-datatable-header'] mat-checkbox`));
        this.copyColumnTooltip = this.rootElement.element(by.css(`adf-copy-content-tooltip span`));
    }

    checkAllRowsButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.selectAll);
        return this;
    }

    checkAllRows() {
        BrowserVisibility.waitUntilElementIsVisible(this.selectAll);
        BrowserVisibility.waitUntilElementIsClickable(this.selectAll).then(() => {
            this.selectAll.click();
            BrowserVisibility.waitUntilElementIsVisible(this.selectAll.element(by.css('input[aria-checked="true"]')));
        });
        return this;
    }

    uncheckAllRows() {
        BrowserVisibility.waitUntilElementIsVisible(this.selectAll);
        BrowserVisibility.waitUntilElementIsClickable(this.selectAll).then(() => {
            this.selectAll.click();
            BrowserVisibility.waitUntilElementIsNotOnPage(this.selectAll.element(by.css('input[aria-checked="true"]')));
        });
        return this;
    }

    clickCheckbox(columnName, columnValue) {
        const checkbox = this.getRowCheckbox(columnName, columnValue);
        BrowserVisibility.waitUntilElementIsClickable(checkbox);
        checkbox.click();
    }

    checkRowIsNotChecked(columnName, columnValue) {
        BrowserVisibility.waitUntilElementIsNotOnPage(this.getRowCheckbox(columnName, columnValue).element(by.css('input[aria-checked="true"]')));
    }

    checkRowIsChecked(columnName, columnValue) {
        const rowCheckbox = this.getRowCheckbox(columnName, columnValue);
        BrowserVisibility.waitUntilElementIsVisible(rowCheckbox.element(by.css('input[aria-checked="true"]')));
    }

    getRowCheckbox(columnName, columnValue) {
        return this.getRow(columnName, columnValue)
            .element(by.css('mat-checkbox'));
    }

    checkNoRowIsSelected() {
        BrowserVisibility.waitUntilElementIsNotOnPage(this.selectedRowNumber);
    }

    getNumberOfSelectedRows() {
        return this.allSelectedRows.count();
    }

    selectRowWithKeyboard(columnName, columnValue) {
        const row = this.getRow(columnName, columnValue);
        browser.actions().sendKeys(protractor.Key.COMMAND).click(row).perform();
    }

    selectRow(columnName, columnValue) {
        BrowserActions.closeMenuAndDialogs();
        const row = this.getRow(columnName, columnValue);
        BrowserActions.click(row);
        return this;
    }

    checkRowIsSelected(columnName, columnValue) {
        const selectedRow = this.getCellElementByValue(columnName, columnValue).element(by.xpath(`ancestor::div[contains(@class, 'is-selected')]`));
        BrowserVisibility.waitUntilElementIsVisible(selectedRow);
        return this;
    }

    checkRowIsNotSelected(columnName, columnValue) {
        const selectedRow = this.getCellElementByValue(columnName, columnValue).element(by.xpath(`ancestor::div[contains(@class, 'is-selected')]`));
        BrowserVisibility.waitUntilElementIsNotOnPage(selectedRow);
        return this;
    }

    getColumnValueForRow(identifyingColumn, identifyingValue, columnName) {
        const row = this.getRow(identifyingColumn, identifyingValue);
        BrowserVisibility.waitUntilElementIsVisible(row);
        const rowColumn = row.element(by.css(`div[title="${columnName}"] span`));
        return BrowserActions.getText(rowColumn);
    }

    /**
     * Check the list is sorted.
     *
     * @param sortOrder: 'true' if the list is expected to be sorted ascendant and 'false' for descendant
     * @param locator: locator for column
     * @return 'true' if the list is sorted as expected and 'false' if it isn't
     */
    checkListIsSorted(sortOrder, locator) {
        const deferred = protractor.promise.defer();
        const column = element.all(by.css(`div[title='${locator}'] span`));
        BrowserVisibility.waitUntilElementIsVisible(column.first());
        const initialList = [];
        column.each(function (currentElement) {
            currentElement.getText().then(function (text) {
                initialList.push(text);
            });
        }).then(function () {
            let sortedList = initialList;
            sortedList = sortedList.sort();
            if (sortOrder === false) {
                sortedList = sortedList.reverse();
            }
            deferred.fulfill(initialList.toString() === sortedList.toString());
        });
        return deferred.promise;
    }

    rightClickOnRow(columnName, columnValue) {
        BrowserActions.closeMenuAndDialogs();
        const row = this.getRow(columnName, columnValue);
        browser.actions().click(row, protractor.Button.RIGHT).perform();
        BrowserVisibility.waitUntilElementIsVisible(element(by.id('adf-context-menu-content')));
    }

    getTooltip(columnName, columnValue) {
        return this.getCellElementByValue(columnName, columnValue).getAttribute('title');
    }

    getFileHyperlink(filename) {
        return element(by.cssContainingText('adf-name-column[class*="adf-datatable-link"] span', filename));
    }

    numberOfRows() {
        return this.rootElement.all(this.rows).count();
    }

    async getAllRowsColumnValues(column) {
        const columnLocator = by.css("adf-datatable div[class*='adf-datatable-body'] div[class*='adf-datatable-row'] div[title='" + column + "'] span");
        BrowserVisibility.waitUntilElementIsVisible(element.all(columnLocator).first());
        const initialList: any = await element.all(columnLocator).getText();
        return initialList.filter((el) => el);
    }

    async getRowsWithSameColumnValues(columnName, columnValue) {
        const columnLocator = by.css(`div[title='${columnName}'] div[data-automation-id="text_${columnValue}"] span`);
        BrowserVisibility.waitUntilElementIsVisible(this.rootElement.all(columnLocator).first());
        return this.rootElement.all(columnLocator).getText();
    }

    doubleClickRow(columnName: string, columnValue: string) {
        BrowserActions.closeMenuAndDialogs();
        const row = this.getRow(columnName, columnValue);
        BrowserActions.click(row);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
        return this;
    }

    waitForTableBody() {
        BrowserVisibility.waitUntilElementIsVisible(this.tableBody);
    }

    getFirstElementDetail(detail) {
        const firstNode = element.all(by.css(`adf-datatable div[title="${detail}"] span`)).first();
        return firstNode.getText();
    }

    geCellElementDetail(detail) {
        return element.all(by.css(`adf-datatable div[title="${detail}"] span`));
    }

    sortByColumn(sortOrder, column) {
        const locator = by.css(`div[data-automation-id="auto_id_${column}"]`);
        BrowserVisibility.waitUntilElementIsVisible(element(locator));
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

    checkContentIsDisplayed(columnName, columnValue) {
        const row = this.getCellElementByValue(columnName, columnValue);
        BrowserVisibility.waitUntilElementIsVisible(row);
        return this;
    }

    checkContentIsNotDisplayed(columnName, columnValue) {
        const row = this.getCellElementByValue(columnName, columnValue);
        BrowserVisibility.waitUntilElementIsNotOnPage(row);
        return this;
    }

    getRow(columnName, columnValue) {
        const row = this.rootElement.all(by.css(`div[title="${columnName}"] div[data-automation-id="text_${columnValue}"]`)).first()
            .element(by.xpath(`ancestor::div[contains(@class, 'adf-datatable-row')]`));
        return row;
    }

    contentInPosition(position) {
        BrowserVisibility.waitUntilElementIsVisible(this.contents);
        return this.contents.get(position - 1).getText();
    }

    getCellElementByValue(columnName, columnValue) {
        return this.rootElement.all(by.css(`div[title="${columnName}"] div[data-automation-id="text_${columnValue}"] span`)).first();
    }

    checkSpinnerIsDisplayed() {
        BrowserVisibility.waitUntilElementIsPresent(this.spinner);
        return this;
    }

    checkSpinnerIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotOnPage(this.spinner);
        return this;
    }

    tableIsLoaded() {
        BrowserVisibility.waitUntilElementIsVisible(this.rootElement);
        return this;
    }

    checkColumnIsDisplayed(column) {
        BrowserVisibility.waitUntilElementIsVisible(element(by.css(`div[data-automation-id="auto_id_entry.${column}"]`)));
        return this;
    }

    getNumberOfColumns() {
        return this.allColumns.count();
    }

    getNumberOfRows() {
        return this.list.count();
    }

    getCellByRowNumberAndColumnName(rowNumber, columnName) {
        return this.list.get(rowNumber).element(by.css(`div[title="${columnName}"] span`));
    }

    getCellByRowContentAndColumn(rowColumn, rowContent, columnName) {
        return this.getRow(rowColumn, rowContent).element(by.css(`div[title='${columnName}']`));
    }

    selectRowByContent(content) {
        const row = this.getCellByContent(content);
        return row.click();
    }

    checkRowByContentIsSelected(folderName) {
        const selectedRow = this.getCellByContent(folderName).element(by.xpath(`ancestor::div[contains(@class, 'is-selected')]`));
        BrowserVisibility.waitUntilElementIsVisible(selectedRow);
        return this;
    }

    getCellByContent(content) {
        const cell = this.rootElement.element(by.cssContainingText(`div[class*='adf-datatable-row'] div[class*='adf-name-location-cell-name']`, content));
        BrowserVisibility.waitUntilElementIsVisible(cell);
        return cell;
    }

    clickRowByContent(name) {
        const resultElement = this.rootElement.all(by.css(`div[data-automation-id='${name}']`)).first();
        BrowserActions.click(resultElement);
    }

    getCopyContentTooltip() {
        return BrowserActions.getText(this.copyColumnTooltip);
    }

    copyContentTooltipIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotPresent(this.copyColumnTooltip);
        return this;
    }

    mouseOverColumn(columnName, columnValue) {
        const column = this.getCellElementByValue(columnName, columnValue);
        this.mouseOverElement(column);
        return this;
    }

    mouseOverElement(elem) {
        BrowserVisibility.waitUntilElementIsVisible(elem);
        browser.actions().mouseMove(elem).perform();
        return this;
    }

    clickColumn(columnName, columnValue) {
        const column = this.getCellElementByValue(columnName, columnValue);
        this.clickElement(column);
        return this;
    }

    clickElement(elem) {
        BrowserActions.click(elem);
        return this;
    }
}
