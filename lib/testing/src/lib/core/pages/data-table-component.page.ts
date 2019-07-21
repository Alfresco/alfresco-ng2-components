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

    async checkAllRowsButtonIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.selectAll);
        return this;
    }

    async checkAllRows() {
        await BrowserActions.click(this.selectAll);
        await BrowserVisibility.waitUntilElementIsVisible(this.selectAll.element(by.css('input[aria-checked="true"]')));
        return this;
    }

    async uncheckAllRows() {
        await BrowserActions.click(this.selectAll);
        await BrowserVisibility.waitUntilElementIsNotOnPage(this.selectAll.element(by.css('input[aria-checked="true"]')));
        return this;
    }

    async clickCheckbox(columnName, columnValue) {
        const checkbox = this.getRowCheckbox(columnName, columnValue);
        await BrowserActions.click(checkbox);
        return this;
    }

    async checkRowIsNotChecked(columnName, columnValue) {
        await BrowserVisibility.waitUntilElementIsNotOnPage(this.getRowCheckbox(columnName, columnValue).element(by.css('input[aria-checked="true"]')));
    }

    async checkRowIsChecked(columnName, columnValue) {
        const rowCheckbox = this.getRowCheckbox(columnName, columnValue);
        await BrowserVisibility.waitUntilElementIsVisible(rowCheckbox.element(by.css('input[aria-checked="true"]')));
    }

    getRowCheckbox(columnName, columnValue) {
        return this.getRow(columnName, columnValue)
            .element(by.css('mat-checkbox'));
    }

    async checkNoRowIsSelected() {
        await BrowserVisibility.waitUntilElementIsNotOnPage(this.selectedRowNumber);
    }

    getNumberOfSelectedRows() {
        return this.allSelectedRows.count();
    }

    selectRowWithKeyboard(columnName, columnValue) {
        const row = this.getRow(columnName, columnValue);
        browser.actions().sendKeys(protractor.Key.COMMAND).click(row).perform();
    }

    async selectRow(columnName, columnValue) {
        await BrowserActions.closeMenuAndDialogs();
        const row = this.getRow(columnName, columnValue);
        await BrowserActions.click(row);
        return this;
    }

    async checkRowIsSelected(columnName, columnValue) {
        const selectedRow = this.getCellElementByValue(columnName, columnValue).element(by.xpath(`ancestor::div[contains(@class, 'is-selected')]`));
        await BrowserVisibility.waitUntilElementIsVisible(selectedRow);
        return this;
    }

    async checkRowIsNotSelected(columnName, columnValue) {
        const selectedRow = this.getCellElementByValue(columnName, columnValue).element(by.xpath(`ancestor::div[contains(@class, 'is-selected')]`));
        await BrowserVisibility.waitUntilElementIsNotOnPage(selectedRow);
        return this;
    }

    async getColumnValueForRow(identifyingColumn, identifyingValue, columnName): Promise<string> {
        const row = this.getRow(identifyingColumn, identifyingValue);
        await BrowserVisibility.waitUntilElementIsVisible(row);
        const rowColumn = row.element(by.css(`div[title="${columnName}"] span`));
        return BrowserActions.getText(rowColumn);
    }

    /**
     * Check the list is sorted.
     *
     * @param sortOrder: 'ASC' if the list is expected to be sorted ascending and 'DESC' for descending
     * @param columnTitle: titleColumn column
     * @return 'true' if the list is sorted as expected and 'false' if it isn't
     */
    async checkListIsSorted(sortOrder: string, columnTitle: string) {
        const deferred = protractor.promise.defer();
        const column = element.all(by.css(`div.adf-datatable-cell[title='${columnTitle}'] span`));
        await BrowserVisibility.waitUntilElementIsVisible(column.first());
        const initialList = [];
        column.each(function (currentElement) {
            currentElement.getText().then(function (text) {
                if (text.length !== 0) {
                    initialList.push(text.toLowerCase());
                }
            });
        }).then(function () {
            let sortedList = [...initialList];
            sortedList = sortedList.sort();
            if (sortOrder.toLocaleLowerCase() === 'desc') {
                sortedList = sortedList.reverse();
            }

            deferred.fulfill(initialList.toString() === sortedList.toString());
        });
        return deferred.promise;
    }

    async rightClickOnRow(columnName, columnValue) {
        await BrowserActions.closeMenuAndDialogs();
        const row = this.getRow(columnName, columnValue);
        browser.actions().click(row, protractor.Button.RIGHT).perform();
        await BrowserVisibility.waitUntilElementIsVisible(element(by.id('adf-context-menu-content')));
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
        await BrowserVisibility.waitUntilElementIsVisible(element.all(columnLocator).first());
        const initialList: any = await element.all(columnLocator).getText();
        return initialList.filter((el) => el);
    }

    async getRowsWithSameColumnValues(columnName, columnValue): Promise<string> {
        const columnLocator = by.css(`div[title='${columnName}'] div[data-automation-id="text_${columnValue}"] span`);
        await BrowserVisibility.waitUntilElementIsVisible(this.rootElement.all(columnLocator).first());
        return BrowserActions.getText(this.rootElement.all(columnLocator))
    }

    async doubleClickRow(columnName: string, columnValue: string): Promise<string> {
        await BrowserActions.closeMenuAndDialogs();
        const row = this.getRow(columnName, columnValue);
        await BrowserActions.click(row);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
        return this;
    }

    async waitForTableBody() {
        await BrowserVisibility.waitUntilElementIsVisible(this.tableBody);
    }

    async getFirstElementDetail(detail): Promise<string> {
        const firstNode = element.all(by.css(`adf-datatable div[title="${detail}"] span`)).first();
        return BrowserActions.getText(firstNode);
    }

    geCellElementDetail(detail) {
        return element.all(by.css(`adf-datatable div[title="${detail}"] span`));
    }

    /**
     *  Sort the list by name column.
     *
     * @param sortOrder : 'ASC' to sort the list ascendant and 'DESC' for descendant
     */
    async sortByColumn(sortOrder: string, titleColumn: string) {
        const locator = by.css(`div[data-automation-id="auto_id_${titleColumn}"]`);
        await BrowserVisibility.waitUntilElementIsVisible(element(locator));
        return element(locator).getAttribute('class').then(function (result) {
            if (sortOrder.toLocaleLowerCase() === 'asc') {
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

    async checkContentIsDisplayed(columnName, columnValue) {
        const row = this.getCellElementByValue(columnName, columnValue);
        await BrowserVisibility.waitUntilElementIsVisible(row);
        return this;
    }

    async checkContentIsNotDisplayed(columnName, columnValue) {
        const row = this.getCellElementByValue(columnName, columnValue);
        await BrowserVisibility.waitUntilElementIsNotOnPage(row);
        return this;
    }

    getRow(columnName, columnValue) {
        return this.rootElement.all(by.css(`div[title="${columnName}"] div[data-automation-id="text_${columnValue}"]`)).first()
            .element(by.xpath(`ancestor::div[contains(@class, 'adf-datatable-row')]`));
    }

    getRowByIndex(index: number) {
        return this.rootElement.element(by.xpath(`//div[contains(@class,'adf-datatable-body')]//div[contains(@class,'adf-datatable-row')][${index}]`));
    }

    async contentInPosition(position): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.contents);
        return BrowserActions.getText(this.contents.get(position - 1));
    }

    getCellElementByValue(columnName, columnValue) {
        return this.rootElement.all(by.css(`div[title="${columnName}"] div[data-automation-id="text_${columnValue}"] span`)).first();
    }

    async checkSpinnerIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsPresent(this.spinner);
        return this;
    }

    async checkSpinnerIsNotDisplayed() {
        await BrowserVisibility.waitUntilElementIsNotOnPage(this.spinner);
        return this;
    }

    async tableIsLoaded() {
        await BrowserVisibility.waitUntilElementIsVisible(this.rootElement);
        return this;
    }

    async waitTillContentLoaded() {
        return BrowserVisibility.waitUntilElementIsVisible(this.contents);
    }

    async checkColumnIsDisplayed(column) {
        await BrowserVisibility.waitUntilElementIsVisible(element(by.css(`div[data-automation-id="auto_id_entry.${column}"]`)));
        return this;
    }

    getNumberOfColumns() {
        return this.allColumns.count();
    }

    getNumberOfRows() {
        return this.list.count();
    }

    getCellByRowNumberAndColumnName(rowNumber, columnName) {
        return this.list.get(rowNumber).all(by.css(`div[title="${columnName}"] span`)).first();
    }

    getCellByRowContentAndColumn(rowColumn, rowContent, columnName) {
        return this.getRow(rowColumn, rowContent).element(by.css(`div[title='${columnName}']`));
    }

    async selectRowByContent(content) {
        const row = await this.getCellByContent(content);
        await BrowserActions.click(row);
    }

    async checkRowByContentIsSelected(folderName) {
        const selectedRow = await this.getCellByContent(folderName);
        selectedRow.element(by.xpath(`ancestor::div[contains(@class, 'is-selected')]`));
        await BrowserVisibility.waitUntilElementIsVisible(selectedRow);
        return this;
    }

    async checkRowByContentIsNotSelected(folderName) {
        const selectedRow = await this.getCellByContent(folderName);
        selectedRow.element(by.xpath(`ancestor::div[contains(@class, 'is-selected')]`));
        await BrowserVisibility.waitUntilElementIsNotVisible(selectedRow);
        return this;
    }

    async getCellByContent(content) {
        const cell = this.rootElement.all(by.cssContainingText(`div[class*='adf-datatable-row'] div[class*='adf-datatable-cell']`, content)).first();
        await BrowserVisibility.waitUntilElementIsVisible(cell);
        return cell;
    }

    async checkCellByHighlightContent(content) {
        const cell = this.rootElement.element(by.cssContainingText(`div[class*='adf-datatable-row'] div[class*='adf-name-location-cell-name'] span.adf-highlight`, content));
        await BrowserVisibility.waitUntilElementIsVisible(cell);
        return cell;
    }

    async clickRowByContent(name) {
        const resultElement = this.rootElement.all(by.css(`div[data-automation-id='${name}']`)).first();
        await BrowserActions.click(resultElement);
    }

    async clickRowByContentCheckbox(name) {
        const resultElement = this.rootElement.all(by.css(`div[data-automation-id='${name}']`)).first().element(by.xpath(`ancestor::div/div/mat-checkbox`));
        await BrowserActions.click(resultElement);
    }

    async checkRowContentIsDisplayed(content) {
        const resultElement = this.rootElement.all(by.css(`div[data-automation-id='${content}']`)).first();
        await BrowserVisibility.waitUntilElementIsVisible(resultElement);
        return this;
    }

    async checkRowContentIsNotDisplayed(content) {
        const resultElement = this.rootElement.all(by.css(`div[data-automation-id='${content}']`)).first();
        await BrowserVisibility.waitUntilElementIsNotVisible(resultElement);
        return this;
    }

    async checkRowContentIsDisabled(content) {
        const resultElement = this.rootElement.all(by.css(`div[data-automation-id='${content}'] div.adf-cell-value img[aria-label='disable']`)).first();
        await BrowserVisibility.waitUntilElementIsVisible(resultElement);
        return this;
    }

    async doubleClickRowByContent(name) {
        const resultElement = this.rootElement.all(by.css(`div[data-automation-id='${name}']`)).first();
        await BrowserActions.click(resultElement);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
        return this;
    }

    async getCopyContentTooltip(): Promise<string> {
        return BrowserActions.getText(this.copyColumnTooltip);
    }

    async copyContentTooltipIsNotDisplayed() {
        await BrowserVisibility.waitUntilElementIsNotPresent(this.copyColumnTooltip);
        return this;
    }

    mouseOverColumn(columnName, columnValue) {
        const column = this.getCellElementByValue(columnName, columnValue);
        this.mouseOverElement(column);
        return this;
    }

    async mouseOverElement(elem) {
        await BrowserVisibility.waitUntilElementIsVisible(elem);
        browser.actions().mouseMove(elem).perform();
        return this;
    }

    async clickColumn(columnName, columnValue) {
        await BrowserActions.clickExecuteScript(`div[title="${columnName}"] div[data-automation-id="text_${columnValue}"] span`);
        return this;
    }
}
