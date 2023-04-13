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

import { browser, by, element, protractor, ElementFinder, ElementArrayFinder, $, $$ } from 'protractor';
import { BrowserVisibility } from '../utils/browser-visibility';
import { BrowserActions } from '../utils/browser-actions';
import { Logger } from '../utils/logger';

const MAX_LOADING_TIME = 120000;

export class DataTableComponentPage {

    rootElement: ElementFinder;
    list: ElementArrayFinder;
    contents: ElementArrayFinder;
    tableBody: ElementFinder;
    allColumns: ElementArrayFinder;
    selectedRowNumber: ElementFinder;
    allSelectedRows: ElementArrayFinder;
    selectAll: ElementFinder;
    copyColumnTooltip: ElementFinder;
    emptyList: ElementFinder;
    emptyListTitle: ElementFinder;
    emptyListSubtitle: ElementFinder;
    noContentContainer: ElementFinder;
    mainMenuButton: ElementFinder;

    rows = `adf-datatable div[class*='adf-datatable-body'] adf-datatable-row[class*='adf-datatable-row']`;

    constructor(rootElement = $$('adf-datatable').first()) {
        this.rootElement = rootElement;
        this.list = this.rootElement.$$(`div[class*='adf-datatable-body'] adf-datatable-row[class*='adf-datatable-row']`);
        this.contents = this.rootElement.$$('.adf-datatable-body span');
        this.tableBody = this.rootElement.$$(`.adf-datatable-body`).first();
        this.allColumns = this.rootElement.$$('div[data-automation-id*="auto_header_content_id"]');
        this.mainMenuButton = this.rootElement.$('[data-automation-id="adf-datatable-main-menu-button"]');
        this.selectedRowNumber = this.rootElement.$(`adf-datatable-row[class*='is-selected'] div[data-automation-id*='text_']`);
        this.allSelectedRows = this.rootElement.$$(`adf-datatable-row[class*='is-selected']`);
        this.selectAll = this.rootElement.$(`div[class*='adf-datatable-header'] mat-checkbox`);
        this.copyColumnTooltip = this.rootElement.$(`adf-copy-content-tooltip span`);
        this.emptyList = this.rootElement.$(`adf-empty-content`);
        this.emptyListTitle = this.rootElement.$(`.adf-empty-content__title`);
        this.emptyListSubtitle = this.rootElement.$(`.adf-empty-content__subtitle`);
        this.noContentContainer = $(`div[class*='adf-no-content-container']`);
    }

    geCellElementDetail(detail: string): ElementArrayFinder {
        return $$(`adf-datatable div[title="${detail}"] span`);
    }

    async checkAllRowsButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.selectAll);
    }

    async checkAllRows(): Promise<void> {
        await BrowserActions.click(this.selectAll);
        await BrowserVisibility.waitUntilElementIsVisible(this.selectAll.$('input[aria-checked="true"]'));
    }

    async uncheckAllRows(): Promise<void> {
        await BrowserActions.click(this.selectAll);
        await BrowserVisibility.waitUntilElementIsNotVisible(this.selectAll.$('input[aria-checked="true"]'));
    }

    async clickCheckbox(columnName: string, columnValue: string): Promise<void> {
        const checkbox = this.getRowCheckbox(columnName, columnValue);
        await BrowserActions.click(checkbox);
    }

    async checkRowIsNotChecked(columnName: string, columnValue: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.getRowCheckbox(columnName, columnValue).$('input[aria-checked="true"]'));
    }

    async checkRowIsChecked(columnName: string, columnValue: string): Promise<void> {
        const rowCheckbox = this.getRowCheckbox(columnName, columnValue);
        await BrowserVisibility.waitUntilElementIsVisible(rowCheckbox.$('input[aria-checked="true"]'));
    }

    getRowCheckbox(columnName: string, columnValue: string): ElementFinder {
        return this.getRow(columnName, columnValue).$('mat-checkbox');
    }

    async checkNoRowIsSelected(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.selectedRowNumber);
    }

    async getNumberOfSelectedRows(): Promise<number> {
        return this.allSelectedRows.count();
    }

    async selectRow(columnName: string, columnValue: string): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        const row = this.getRow(columnName, columnValue);
        await BrowserActions.click(row);
    }

    async selectRowWithKeyboard(columnName: string, columnValue: string): Promise<void> {
        await browser.actions().sendKeys(protractor.Key.COMMAND).perform();
        await this.selectRow(columnName, columnValue);
        await browser.actions().sendKeys(protractor.Key.NULL).perform();
    }

    async selectMultipleRows(columnName: string, items: string[]): Promise<void> {
        await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
        await this.clearRowsSelection();
        await browser.actions().sendKeys(protractor.Key.COMMAND).perform();
        for (const item of items) {
            await this.selectRow(columnName, item);
        }
        await browser.actions().sendKeys(protractor.Key.NULL).perform();
    }

    async clearRowsSelection(): Promise<void> {
        try {
            const count = await this.getNumberOfSelectedRows();
            if (count !== 0) {
                await browser.refresh();
                await BrowserVisibility.waitUntilElementIsVisible(this.rootElement);
            }
        } catch (error) {
            Logger.error('------ clearSelection catch : ', error);
        }
    }

    async checkRowIsSelected(columnName: string, columnValue: string): Promise<void> {
        const selectedRow = this.getCellElementByValue(columnName, columnValue).element(by.xpath(`ancestor::adf-datatable-row[contains(@class, 'is-selected')]`));
        await BrowserVisibility.waitUntilElementIsVisible(selectedRow);
    }

    async checkRowIsNotSelected(columnName: string, columnValue: string): Promise<void> {
        const selectedRow = this.getCellElementByValue(columnName, columnValue).element(by.xpath(`ancestor::adf-datatable-row[contains(@class, 'is-selected')]`));
        await BrowserVisibility.waitUntilElementIsNotVisible(selectedRow);
    }

    async getColumnValueForRow(identifyingColumn: string, identifyingValue: string, columnName: string): Promise<string> {
        const row = this.getRow(identifyingColumn, identifyingValue);
        await BrowserVisibility.waitUntilElementIsVisible(row);
        const rowColumn = row.$(`div[title="${columnName}"] span`);
        return BrowserActions.getText(rowColumn);
    }

    /**
     * Check the list is sorted.
     *
     * @param sortOrder: 'ASC' if the list is await expected to be sorted ascending and 'DESC' for descending
     * @param columnTitle: titleColumn column
     * @param listType: 'string' for string typed lists and 'number' for number typed (int, float) lists
     * @return 'true' if the list is sorted as await expected and 'false' if it isn't
     */
    async checkListIsSorted(sortOrder: string, columnTitle: string, listType: string = 'STRING'): Promise<any> {
        const column = $$(`div.adf-datatable-cell[title='${columnTitle}'] span`);
        await BrowserVisibility.waitUntilElementIsVisible(column.first());
        const initialList = [];

        const length = await column.count();

        for (let i = 0; i < length; i++) {
            const text = await BrowserActions.getText(column.get(i));
            if (text.length !== 0) {
                initialList.push(text.toLowerCase());
            }
        }

        let sortedList = [...initialList];
        if (listType.toLocaleLowerCase() === 'string') {
            sortedList = sortedList.sort();
        } else if (listType.toLocaleLowerCase() === 'number') {
            sortedList = sortedList.sort((a, b) => a - b);
        } else if (listType.toLocaleLowerCase() === 'priority') {
            sortedList = sortedList.sort(this.sortPriority);
        }

        if (['desc', 'descending'].includes(sortOrder.toLocaleLowerCase())) {
            sortedList = sortedList.reverse();
        }

        return initialList.toString() === sortedList.toString();
    }

    sortPriority(a: string, b: string) {
        if (a === b) {
            return 0;
        }

        if (a.toLocaleLowerCase() === 'none') {
            return -1;
        }

        if (a.toLocaleLowerCase() === 'low') {
            if (b === 'none') {
                return 1;
            } else {
                return -1;
            }
        }

        if (a.toLocaleLowerCase() === 'normal') {
            if (b.toLocaleLowerCase() === 'high') {
                return -1;
            } else {
                return 1;
            }
        }

        return 1;
    }

    async rightClickOnRow(columnName: string, columnValue: string): Promise<void> {
        await this.rightClickOnItem(columnName, columnValue);
        await BrowserVisibility.waitUntilElementIsVisible($('#adf-context-menu-content'));
    }

    async getTooltip(columnName: string, columnValue: string): Promise<string> {
        return BrowserActions.getAttribute(this.getCellElementByValue(columnName, columnValue), 'title');
    }

    async rightClickOnRowByIndex(index: number): Promise<void> {
        const row = this.getRowByIndex(index);
        await BrowserActions.rightClick(row);
        await BrowserVisibility.waitUntilElementIsVisible($('#adf-context-menu-content'));
    }

    async rightClickOnItem(columnName: string, columnValue: string): Promise<void> {
        const row = this.getRow(columnName, columnValue);
        await BrowserActions.rightClick(row);
    }

    getFileHyperlink(filename: string): ElementFinder {
        return element(by.cssContainingText('adf-name-column[class*="adf-datatable-link"] span', filename));
    }

    async numberOfRows(): Promise<number> {
        try {
            await this.waitForFirstRow();
            return this.rootElement.$$(this.rows).count();
        } catch (e) {
            return 0;
        }
    }

    async waitForFirstRow(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.rootElement.$$(this.rows).first());
    }

    async getAllRowsColumnValues(column: string): Promise<string[]> {
        let columnValues: string[] = [];
        const columnLocator = $$(`adf-datatable div[class*='adf-datatable-body'] adf-datatable-row[class*='adf-datatable-row'] div[title="${column}"] span`);

        await BrowserVisibility.waitUntilElementIsPresent(await columnLocator.first(), 1000);
        try {
            await BrowserVisibility.waitUntilElementIsPresent(columnLocator.first(), 1000);
            columnValues = await columnLocator
                .filter(async (el) => el.isPresent())
                .map(async (el) => el.getText());
        } catch (error) {
            Logger.log(error);
        }

        return columnValues;
    }

    async getRowsWithSameColumnValues(columnName: string, columnValue: string) {
        const columnLocator = `div[title='${columnName}'] div[data-automation-id="text_${columnValue}"] span`;
        await BrowserVisibility.waitUntilElementIsVisible(this.rootElement.$$(columnLocator).first());
        return this.rootElement.$$(columnLocator).getText();
    }

    async doubleClickRow(columnName: string, columnValue: string): Promise<void> {
        const row = this.getRow(columnName, columnValue);
        await BrowserActions.click(row);
        await browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }

    async waitForTableBody(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.tableBody);
    }

    async getFirstElementDetail(detail: string): Promise<string> {
        const firstNode = $$(`adf-datatable div[title="${detail}"] span`).first();
        return BrowserActions.getText(firstNode);
    }

    /**
     *  Sort the list by name column.
     *
     * @param sortOrder : 'ASC' to sort the list ascendant and 'DESC' for descendant
     */
    async sortByColumn(sortOrder: string, titleColumn: string): Promise<void> {
        const locator = $(`div[data-automation-id="auto_id_${titleColumn}"]`);
        await BrowserVisibility.waitUntilElementIsVisible(locator);
        const result = await BrowserActions.getAttribute(locator, 'class');

        if (sortOrder.toLocaleLowerCase() === 'asc') {
            if (!result.includes('sorted-asc')) {
                if (result.includes('sorted-desc') || result.includes('sortable')) {
                    await BrowserActions.click(locator);
                }
            }
        } else {
            if (result.includes('sorted-asc')) {
                await BrowserActions.click(locator);
            } else if (result.includes('sortable')) {
                await BrowserActions.click(locator);
                await BrowserActions.click(locator);
            }
        }
    }

    async checkContentIsDisplayed(columnName: string, columnValue: string, retry = 0): Promise<void> {
        Logger.log(`Wait content is displayed ${columnName} ${columnValue} retry: ${retry}`);
        const row = this.getCellElementByValue(columnName, columnValue);

        try {
            await BrowserVisibility.waitUntilElementIsVisible(row);
        } catch (error) {
            if (retry < 3) {
                retry++;
                await this.checkContentIsDisplayed(columnName, columnValue, retry);
            } else {
                throw error;
            }
        }
    }

    async checkContentIsNotDisplayed(columnName: string, columnValue: string, retry = 0): Promise<void> {
        Logger.log(`Wait content is displayed ${columnName} ${columnValue} retry: ${retry}`);
        const row = this.getCellElementByValue(columnName, columnValue);

        try {
            await BrowserVisibility.waitUntilElementIsNotVisible(row);
        } catch (error) {
            if (retry < 3) {
                retry++;
                await this.checkContentIsNotDisplayed(columnName, columnValue, retry);
            } else {
                throw error;
            }
        }
    }

    getRow(columnName: string, columnValue: string): ElementFinder {
        return this.rootElement.all(by.xpath(`//div[starts-with(@title, '${columnName}')]//div[contains(@data-automation-id, '${columnValue}')]//ancestor::adf-datatable-row[contains(@class, 'adf-datatable-row')]`)).first();
    }

    getRowByIndex(index: number): ElementFinder {
        return this.rootElement.element(by.xpath(`//div[contains(@class,'adf-datatable-body')]//adf-datatable-row[contains(@class,'adf-datatable-row')][${index}]`));
    }

    async contentInPosition(position: number): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.contents.first());
        return BrowserActions.getText(this.contents.get(position - 1));
    }

    getCellElementByValue(columnName: string, columnValue: string, columnPrefix = 'text_'): ElementFinder {
        return this.rootElement.$$(`div[title="${columnName}"] div[data-automation-id="${columnPrefix}${columnValue}"] span`).first();
    }

    async tableIsLoaded(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.rootElement);
    }

    async waitTillContentLoaded(): Promise<void> {

        if (await this.isSpinnerPresent()) {
            Logger.log('wait datatable loading spinner disappear');
            await BrowserVisibility.waitUntilElementIsNotVisible(this.rootElement.element(by.tagName('mat-progress-spinner')), MAX_LOADING_TIME);

            if (await this.isEmpty()) {
                Logger.log('empty page');
            } else {
                await this.waitFirstElementPresent();
            }

        } else if (await this.isEmpty()) {
            Logger.log('empty page');
        } else {
            try {
                Logger.log('wait datatable loading spinner is present');
                await BrowserVisibility.waitUntilElementIsVisible(this.rootElement.element(by.tagName('mat-progress-spinner')), 2000);
                await BrowserVisibility.waitUntilElementIsNotVisible(this.rootElement.element(by.tagName('mat-progress-spinner')), MAX_LOADING_TIME);
            } catch (error) {
            }

            if (await this.isEmpty()) {
                Logger.log('empty page');
            } else {
                await this.waitFirstElementPresent();
            }
        }
    }

    async waitTillContentLoadedInfinitePagination(): Promise<void> {
        await browser.sleep(500);

        if (await this.isInfiniteSpinnerPresent()) {
            Logger.log('wait datatable loading spinner disappear');
            await BrowserVisibility.waitUntilElementIsNotVisible(element(by.tagName('mat-progress-bar')));

            if (await this.isEmpty()) {
                Logger.log('empty page');
            } else {
                await this.waitFirstElementPresent();
            }
        } else {
            try {
                Logger.log('wait datatable loading spinner is present');
                await BrowserVisibility.waitUntilElementIsVisible(element(by.tagName('mat-progress-bar')));
            } catch (error) {
            }
            if (await this.isEmpty()) {
                Logger.log('empty page');
            } else {
                await this.waitFirstElementPresent();
            }
        }
    }

    async checkColumnIsDisplayed(columnKey: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible($(`div[data-automation-id="auto_id_${columnKey}"]`));
    }

    async isColumnDisplayed(columnTitle: string): Promise<boolean> {
        const isColumnDisplated = (await this.allColumns).some(
            async column => {
                const columnText = await column.getText();
                return columnText === columnTitle;
            }
        );

        return isColumnDisplated;
    }

    async checkNoContentContainerIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.noContentContainer);
    }

    async getNumberOfColumns(): Promise<number> {
        return this.allColumns.count();
    }

    async getNumberOfRows(): Promise<number> {
        return this.list.count();
    }

    getCellByRowNumberAndColumnName(rowNumber: number, columnName: string): ElementFinder {
        return this.list.get(rowNumber).$$(`div[title="${columnName}"] span`).first();
    }

    getCellByRowContentAndColumn(rowColumn: string, rowContent: string, columnName: string): ElementFinder {
        return this.getRow(rowColumn, rowContent).$(`div[title='${columnName}']`);
    }

    async selectRowByContent(content: string): Promise<void> {
        const row = this.getCellByContent(content);
        await BrowserActions.click(row);
    }

    async checkRowByContentIsSelected(folderName: string): Promise<void> {
        const selectedRow = this.getCellByContent(folderName).element(by.xpath(`ancestor::adf-datatable-row[contains(@class, 'is-selected')]`));
        await BrowserVisibility.waitUntilElementIsVisible(selectedRow);
    }

    async checkRowByContentIsNotSelected(folderName: string): Promise<void> {
        const selectedRow = this.getCellByContent(folderName).element(by.xpath(`ancestor::adf-datatable-row[contains(@class, 'is-selected')]`));
        await BrowserVisibility.waitUntilElementIsNotVisible(selectedRow);
    }

    getCellByContent(content: string): ElementFinder {
        return this.rootElement.all(by.cssContainingText(`adf-datatable-row[class*='adf-datatable-row'] div[class*='adf-datatable-cell']`, content)).first();
    }

    async checkCellByHighlightContent(content: string): Promise<void> {
        const cell = this.rootElement.element(by.cssContainingText(`adf-datatable-row[class*='adf-datatable-row'] div[class*='adf-name-location-cell-name'] span.adf-highlight`, content));
        await BrowserVisibility.waitUntilElementIsVisible(cell);
    }

    async clickRowByContent(name: string): Promise<void> {
        const resultElement = this.rootElement.$$(`div[data-automation-id='${name}']`).first();
        await BrowserActions.click(resultElement);
    }

    async clickRowByContentCheckbox(name: string): Promise<void> {
        const resultElement = this.rootElement.$$(`div[data-automation-id='${name}']`).first().element(by.xpath(`ancestor::adf-datatable-row/div/mat-checkbox`));
        await browser.actions().mouseMove(resultElement);
        await BrowserActions.click(resultElement);
    }

    async checkRowContentIsDisplayed(content: string): Promise<void> {
        const resultElement = this.rootElement.$$(`div[data-automation-id='${content}']`).first();
        await BrowserVisibility.waitUntilElementIsVisible(resultElement);
    }

    async checkRowContentIsNotDisplayed(content: string): Promise<void> {
        const resultElement = this.rootElement.$$(`div[data-automation-id='${content}']`).first();
        await BrowserVisibility.waitUntilElementIsNotVisible(resultElement);
    }

    async checkRowContentIsDisabled(content: string): Promise<void> {
        const resultElement = this.rootElement.$$(`div[data-automation-id='${content}'] div.adf-cell-value img[aria-label='Disabled']`).first();
        await BrowserVisibility.waitUntilElementIsVisible(resultElement);
    }

    async doubleClickRowByContent(name: string): Promise<void> {
        const resultElement = this.rootElement.$$(`div[data-automation-id='${name}']`).first();
        await BrowserActions.click(resultElement);
        await browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }

    async getCopyContentTooltip(): Promise<string> {
        return BrowserActions.getText(this.copyColumnTooltip);
    }

    async copyContentTooltipIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsStale(this.copyColumnTooltip);
    }

    async mouseOverColumn(columnName: string, columnValue: string): Promise<void> {
        const column = this.getCellElementByValue(columnName, columnValue);
        await BrowserVisibility.waitUntilElementIsVisible(column);
        await browser.actions().mouseMove(column).perform();
    }

    async clickColumn(columnName: string, columnValue: string): Promise<void> {
        await BrowserActions.clickExecuteScript(`div[title="${columnName}"] div[data-automation-id="text_${columnValue}"] span`);
    }

    async selectMultipleItems(names: string[]): Promise<void> {
        await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();

        await browser.actions().sendKeys(protractor.Key.COMMAND).perform();
        for (const name of names) {
            await this.selectRowByContent(name);
        }
        await this.clearSelection();
    }

    async clearSelection(): Promise<void> {
        await browser.actions().sendKeys(protractor.Key.NULL).perform();
    }

    async getEmptyListText(): Promise<string> {
        const isEmpty = await this.isEmpty();
        if (isEmpty) {
            return this.rootElement.$('adf-custom-empty-content-template').getText();
        }
        return '';
    }

    async isEmpty(): Promise<boolean> {
        await browser.sleep(500);

        let isDisplayed;

        try {
            isDisplayed = await this.emptyList.isDisplayed();
        } catch (error) {
            isDisplayed = false;
        }

        Logger.log(`empty page isDisplayed ${isDisplayed}`);

        return isDisplayed;
    }

    async waitForEmptyState(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.emptyList);
    }

    async getEmptyStateTitle(): Promise<string> {
        const isEmpty = await this.isEmpty();
        if (isEmpty) {
            return this.emptyListTitle.getText();
        }
        return '';
    }

    async getEmptyStateSubtitle(): Promise<string> {
        const isEmpty = await this.isEmpty();
        if (isEmpty) {
            return this.emptyListSubtitle.getText();
        }
        return '';
    }

    private async isSpinnerPresent(): Promise<boolean> {
        let isSpinnerPresent;

        try {
            isSpinnerPresent = await this.rootElement.element(by.tagName('mat-progress-spinner')).isDisplayed();
        } catch (error) {
            isSpinnerPresent = false;
        }

        return isSpinnerPresent;
    }

    private async isInfiniteSpinnerPresent(): Promise<boolean> {
        let isSpinnerPresent;

        try {
            isSpinnerPresent = await this.rootElement.element(by.tagName('mat-progress-bar')).isDisplayed();
        } catch (error) {
            isSpinnerPresent = false;
        }

        return isSpinnerPresent;
    }

    private async waitFirstElementPresent(): Promise<void> {
        try {
            Logger.log('wait first element is present');
            await BrowserVisibility.waitUntilElementIsVisible(this.contents.first());
        } catch (error) {
            Logger.log('Possible empty page');
        }
    }
}
