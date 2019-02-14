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
import { DataTableComponentPage } from '../dataTableComponentPage';
import { Util } from '../../../util/util';

export class DocumentListPage {

    rootElement: ElementFinder;
    actionMenu = element(by.css('div[role="menu"]'));
    optionButton = by.css('button[data-automation-id*="action_menu_"]');
    tableBody;
    dataTable;

    constructor(rootElement: ElementFinder = element.all(by.css('adf-document-list')).first()) {
        this.rootElement = rootElement;
        this.dataTable = new DataTableComponentPage(this.rootElement);
        this.tableBody = rootElement.all(by.css('div[class="adf-datatable-body"]')).first();
    }

    checkLockedIcon(content) {
        let row = this.dataTable.getRowParentElement('Display name', content);
        let lockIcon = row.element(by.cssContainingText('div[title="Lock"] mat-icon', 'lock'));
        Util.waitUntilElementIsVisible(lockIcon);
        return this;
    }

    checkUnlockedIcon(content) {
        let row = this.dataTable.getRowParentElement('Display name', content);
        let lockIcon = row.element(by.cssContainingText('div[title="Lock"] mat-icon', 'lock_open'));
        Util.waitUntilElementIsVisible(lockIcon);
        return this;
    }

    waitForTableBody() {
        return Util.waitUntilElementIsVisible(this.tableBody);
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
        let row = this.dataTable.getRowParentElement('Display name', content);
        row.element(this.optionButton).click();
        Util.waitUntilElementIsVisible(this.actionMenu);
        browser.sleep(500);
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
