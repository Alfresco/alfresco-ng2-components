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

import { Column } from './column';
import { by, element, ElementFinder, protractor, browser, $$ } from 'protractor';
import { BrowserActions } from '../../utils/browser-actions';
import { BrowserVisibility } from '../../utils/browser-visibility';

export class DataTableItem {
    columns = new Array<Column>();
    rootElement: ElementFinder;
    rows = `div[class*='adf-datatable-body'] adf-datatable-row[class*='adf-datatable-row']`;

    constructor(rootElement = $$('adf-datatable').first()) {
        this.rootElement = rootElement;
    }

    addItem(column: Column): void {
        this.columns.push(column);
    }

    async getColumn(columnName: string): Promise<Column> {
        return this.columns.find(
            (column) =>  column.getColumnName() === columnName
        );
    }

    async getRow(columnName: string, columnValue: string): Promise<ElementFinder> {
        const column = await this.getColumn(columnName);
        const locator = `//div[@title="${column.columnName}"]` + column.createLocator(columnValue) + `//ancestor::adf-datatable-row[contains(@class, 'adf-datatable-row')]`;
        return this.rootElement.element(by.xpath(locator));
    }

    async selectRow(columnName: string, columnValue: string): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        const row = await this.getRow(columnName, columnValue);
        await BrowserActions.click(row);
    }

    async rightClickOnRow(columnName: string, columnValue: string): Promise<void> {
        const row = await this.getRow(columnName, columnValue);
        await browser.actions().mouseMove(row).perform();
        await browser.actions().click(row, protractor.Button.RIGHT).perform();
    }

    async waitForFirstRow(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.rootElement.$$(this.rows).first());
    }

    async clickAndEnterOnRow(columnName: string, columnValue: string): Promise<void> {
        const row = await this.getRow(columnName, columnValue);
        await BrowserActions.click(row);
        await this.checkRowIsSelected(columnName, columnValue);
        await browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }

    async getColumnValueForRow(identifyingColumnName: string, identifyingColumnValue: string, columnName: string): Promise<string> {
        const row = await this.getRow(identifyingColumnName, identifyingColumnValue);
        await BrowserVisibility.waitUntilElementIsVisible(row);
        const rowColumn = row.$(`div[title="${columnName}"] span`);
        return BrowserActions.getText(rowColumn);
    }

    async checkRowIsSelected(columnName: string, columnValue: string): Promise<void> {
        const column = await this.getColumn(columnName);
        const locator = `//div[@title="${column.columnName}"]` + column.createLocator(columnValue) + `//ancestor::adf-datatable-row[contains(@class, 'is-selected')]`;
        await BrowserVisibility.waitUntilElementIsVisible(element(by.xpath(locator)));
    }

    async checkRowIsNotSelected(columnName: string, columnValue: string): Promise<void> {
        const column = await this.getColumn(columnName);
        const locator = `//div[@title="${column.columnName}"]` + column.createLocator(columnValue) + `//ancestor::adf-datatable-row[contains(@class, 'is-selected')]`;
        await BrowserVisibility.waitUntilElementIsNotVisible(element(by.xpath(locator)));
    }

    async selectRowWithKeyboard(columnName: string, columnValue: string): Promise<void> {
        await browser.actions().sendKeys(protractor.Key.COMMAND).perform();
        await this.selectRow(columnName, columnValue);
        await browser.actions().sendKeys(protractor.Key.NULL).perform();
    }
}
