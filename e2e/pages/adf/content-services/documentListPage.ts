/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { DataTablePage } from '../dataTablePage';
import { Util } from '../../../util/util';

export class DocumentListPage {

    rootElement: ElementFinder;
    actionMenu = element(by.css('div[role="menu"]'));
    optionButton = by.css('button[data-automation-id*="action_menu_"]');
    dataTable = new DataTablePage(this.rootElement);

    constructor(rootElement: ElementFinder = element.all(by.css('adf-upload-drag-area adf-document-list')).first()) {
        this.rootElement = rootElement;
    }

    clickRowToSelectWithRoot(rowName) {
        return this.dataTable.clickRowToSelectWithRoot(rowName);
    }

    clickOnActionMenuWithRoot(content) {
        this.dataTable.getRowByRowNameWithRoot(content).element(this.optionButton).click();
        Util.waitUntilElementIsVisible(this.actionMenu);
        browser.sleep(500);
        return this;
    }

    dataTablePage() {
        return new DataTablePage(this.rootElement);
    }

    getAllRowsNameColumn() {
        return this.dataTable.getAllRowsColumnValues('Display name');
    }

    clickOnActionMenu(content) {
        this.dataTable.getRowByRowName(content).element(this.optionButton).click();
        Util.waitUntilElementIsVisible(this.actionMenu);
        return this;
    }

    navigateToFolder(folder) {
        this.dataTable.doubleClickRow(folder);
        return this;
    }

    checkContextActionIsVisible(actionName) {
        let actionButton = element(by.css(`button[data-automation-id="context-${actionName}"`));
        Util.waitUntilElementIsVisible(actionButton);
        Util.waitUntilElementIsClickable(actionButton);
        return actionButton;
    }

    pressContextMenuActionNamed(actionName) {
        let actionButton = this.checkContextActionIsVisible(actionName);
        actionButton.click();
    }
}
