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

import { by, element, ElementFinder, browser, Locator } from 'protractor';
import { DataTableComponentPage } from '../../core/pages/data-table-component.page';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';

export class DocumentListPage {

    rootElement: ElementFinder;
    actionMenu: ElementFinder = element(by.css('div[role="menu"]'));
    optionButton: Locator = by.css('button[data-automation-id*="action_menu_"]');
    tableBody: ElementFinder;
    dataTable: DataTableComponentPage;

    constructor(rootElement: ElementFinder = element.all(by.css('adf-document-list')).first()) {
        this.rootElement = rootElement;
        this.dataTable = new DataTableComponentPage(this.rootElement);
        this.tableBody = rootElement.all(by.css('div[class="adf-datatable-body"]')).first();
    }

    async checkLockedIcon(content): Promise<void> {
        const row = this.dataTable.getRow('Display name', content);
        const lockIcon = row.element(by.cssContainingText('div[title="Lock"] mat-icon', 'lock'));
        await BrowserVisibility.waitUntilElementIsVisible(lockIcon);
    }

    async checkUnlockedIcon(content): Promise<void> {
        const row = this.dataTable.getRow('Display name', content);
        const lockIcon = row.element(by.cssContainingText('div[title="Lock"] mat-icon', 'lock_open'));
        await BrowserVisibility.waitUntilElementIsVisible(lockIcon);
    }

    async waitForTableBody(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.tableBody);
    }

    async getTooltip(nodeName): Promise<string> {
        return await this.dataTable.getTooltip('Display name', nodeName);
    }

    async selectRow(nodeName): Promise<void> {
        await this.dataTable.selectRow('Display name', nodeName);
    }

    async rightClickOnRow(nodeName): Promise<void> {
        await this.dataTable.rightClickOnRow('Display name', nodeName);
    }

    async clickOnActionMenu(content): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        const row: ElementFinder = this.dataTable.getRow('Display name', content);
        await BrowserActions.click(row.element(this.optionButton));
        await BrowserVisibility.waitUntilElementIsVisible(this.actionMenu);
        await browser.sleep(500);
    }

    async checkActionMenuIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.actionMenu);
    }

    dataTablePage(): DataTableComponentPage {
        return new DataTableComponentPage(this.rootElement);
    }

    async getAllRowsColumnValues(column) {
        return await this.dataTable.getAllRowsColumnValues(column);
    }

    async doubleClickRow(nodeName): Promise<void> {
        await this.dataTable.doubleClickRow('Display name', nodeName);
    }
}
