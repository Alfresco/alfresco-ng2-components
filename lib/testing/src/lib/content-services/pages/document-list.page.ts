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

import { by, element, ElementFinder, browser } from 'protractor';
import { DataTableComponentPage } from '../../core/pages/data-table-component.page';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';

export class DocumentListPage {

    rootElement: ElementFinder;
    actionMenu = element(by.css('div[role="menu"]'));
    optionButton = by.css('button[data-automation-id*="action_menu_"]');
    tableBody: ElementFinder;
    dataTable: DataTableComponentPage;

    constructor(rootElement: ElementFinder = element.all(by.css('adf-document-list')).first()) {
        this.rootElement = rootElement;
        this.dataTable = new DataTableComponentPage(this.rootElement);
        this.tableBody = rootElement.all(by.css('div[class="adf-datatable-body"]')).first();
    }

    checkLockedIcon(content) {
        const row = this.dataTable.getRow('Display name', content);
        const lockIcon = row.element(by.cssContainingText('div[title="Lock"] mat-icon', 'lock'));
        BrowserVisibility.waitUntilElementIsVisible(lockIcon);
        return this;
    }

    checkUnlockedIcon(content) {
        const row = this.dataTable.getRow('Display name', content);
        const lockIcon = row.element(by.cssContainingText('div[title="Lock"] mat-icon', 'lock_open'));
        BrowserVisibility.waitUntilElementIsVisible(lockIcon);
        return this;
    }

    waitForTableBody() {
        return BrowserVisibility.waitUntilElementIsVisible(this.tableBody);
    }

    getTooltip(nodeName) {
        return this.dataTable.getTooltip('Display name', nodeName);
    }

    selectRow(nodeName) {
        return this.dataTable.selectRow('Display name', nodeName);
    }

    rightClickOnRow(nodeName) {
        return this.dataTable.rightClickOnRow('Display name', nodeName);
    }

    clickOnActionMenu(content) {
        BrowserActions.closeMenuAndDialogs();
        const row = this.dataTable.getRow('Display name', content);
        row.element(this.optionButton).click();
        BrowserVisibility.waitUntilElementIsVisible(this.actionMenu);
        browser.sleep(500);
        return this;
    }

    checkActionMenuIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.actionMenu);
        return this;
    }

    dataTablePage() {
        return new DataTableComponentPage(this.rootElement);
    }

    getAllRowsColumnValues(column) {
        return this.dataTable.getAllRowsColumnValues(column);
    }

    doubleClickRow(nodeName) {
        this.dataTable.doubleClickRow('Display name', nodeName);
        return this;
    }
}
