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

import { Column } from './column';
import { by, element, ElementFinder, Locator, protractor, browser } from 'protractor';
import { BrowserActions } from '../../utils/browser-actions';
import { BrowserVisibility } from '../../utils/browser-visibility';

export class DataTableItem {
    columns = new Array<Column>();
    rootElement: ElementFinder;
    rows: Locator = by.css(`div[class*='adf-datatable-body'] adf-datatable-row[class*='adf-datatable-row']`);

    constructor(rootElement: ElementFinder = element.all(by.css('adf-datatable')).first()) {
        this.rootElement = rootElement;
    }

    addItem(column: Column): void {
        this.columns.push(column);
    }

    getColumn(columnName: string): Column {
        return this.columns.find(
            (column) => column.columnName === columnName
        );
    }

    getRow(columnName: string, columnValue: string): ElementFinder {
        const column = this.getColumn(columnName);
        const locator = `//div[@title="${columnName}"]` + column.createLocator(columnValue) + `//ancestor::adf-datatable-row[contains(@class, 'adf-datatable-row')]`;
        return this.rootElement.element(by.xpath(locator));
    }

    async selectRow(columnName: string, columnValue: string): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        const row = await this.getRow(columnName, columnValue);
        await BrowserActions.click(row);
    }

    async rightClickOnRow(columnName: string, columnValue: string): Promise<void> {
        const row = this.getRow(columnName, columnValue);
        await BrowserActions.rightClick(row);
    }

    async waitForFirstRow(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.rootElement.all(this.rows).first());
    }

    async doubleClickRow(columnName: string, columnValue: string): Promise<void> {
        const row = this.getRow(columnName, columnValue);
        await BrowserActions.click(row);
        await browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }
}
