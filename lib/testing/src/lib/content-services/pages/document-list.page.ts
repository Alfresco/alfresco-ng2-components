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

import { Locator, by, element, ElementFinder, browser } from 'protractor';
import { DataTableComponentPage } from '../../core/pages/data-table-component.page';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';
import { Logger } from '../../../..';

export class DocumentListPage {

    rootElement: ElementFinder;
    optionButton: Locator = by.css('button[data-automation-id*="action_menu_"]');
    tableBody: ElementFinder;
    dataTable: DataTableComponentPage;

    constructor(rootElement = element.all(by.css('adf-document-list')).first()) {
        this.rootElement = rootElement;
        this.dataTable = new DataTableComponentPage(this.rootElement);
        this.tableBody = rootElement.all(by.css('.adf-datatable-body')).first();
    }

    async checkLockedIcon(content: string): Promise<void> {
        const row = this.dataTable.getRow('Display name', content);
        const lockIcon = row.element(by.cssContainingText('div[title="Lock"] mat-icon', 'lock'));
        await BrowserVisibility.waitUntilElementIsVisible(lockIcon);
    }

    async checkUnlockedIcon(content: string): Promise<void> {
        const row = this.dataTable.getRow('Display name', content);
        const lockIcon = row.element(by.cssContainingText('div[title="Lock"] mat-icon', 'lock_open'));
        await BrowserVisibility.waitUntilElementIsVisible(lockIcon);
    }

    async waitForTableBody(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.tableBody);
    }

    async getTooltip(nodeName: string): Promise<string> {
        return this.dataTable.getTooltip('Display name', nodeName);
    }

    async selectRow(nodeName: string): Promise<void> {
        await this.dataTable.selectRow('Display name', nodeName);
    }

    async selectRowWithKeyboard(nodeName: string): Promise<void> {
        await this.dataTable.selectRowWithKeyboard('Display name', nodeName);
    }

    async rightClickOnRow(nodeName: string): Promise<void> {
        await this.dataTable.rightClickOnRow('Display name', nodeName);
    }

    async clickOnActionMenu(content: string): Promise<void> {
        Logger.log(`Click action menu ${content}`);
        await BrowserActions.closeMenuAndDialogs();
        const row = this.dataTable.getRow('Display name', content);
        await BrowserActions.click(row.element(this.optionButton));
        await BrowserActions.waitUntilActionMenuIsVisible();
        await browser.sleep(500);
    }

    async checkActionMenuIsNotDisplayed(): Promise<void> {
        await BrowserActions.waitUntilActionMenuIsNotVisible();
    }

    dataTablePage(): DataTableComponentPage {
        return new DataTableComponentPage(this.rootElement);
    }

    async getAllRowsColumnValues(column: string) {
        return this.dataTable.getAllRowsColumnValues(column);
    }

    async doubleClickRow(nodeName: string): Promise<void> {
        await this.dataTable.doubleClickRow('Display name', nodeName);
    }

    async isItemPresent(name: string): Promise<boolean> {
        return this.dataTable.getRow('Display name', name).isPresent();
    }

    async getLibraryRole(name: string): Promise<string> {
        return this.dataTable.getRow('Display name', name).element(by.css('adf-library-role-column')).getText();
    }

}
