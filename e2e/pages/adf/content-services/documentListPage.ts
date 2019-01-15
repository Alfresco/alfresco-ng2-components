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

import { browser, by, element } from 'protractor';
import { DataTablePage } from '../dataTablePage';
import { Util } from '../../../util/util';

export class DocumentListPage {

    dataTable = new DataTablePage();
    deleteContentElement = element(by.css('button[data-automation-id*="DELETE"]'));
    metadataAction = element(by.css('button[data-automation-id*="METADATA"]'));
    versionManagerAction = element(by.css('button[data-automation-id*="VERSIONS"]'));
    moveContentElement = element(by.css('button[data-automation-id*="MOVE"]'));
    copyContentElement = element(by.css('button[data-automation-id*="COPY"]'));
    lockContentElement = element(by.css('button[data-automation-id="DOCUMENT_LIST.ACTIONS.LOCK"]'));
    downloadContent = element(by.css('button[data-automation-id*="DOWNLOAD"]'));
    actionMenu = element(by.css('div[role="menu"]'));
    optionButton = by.css('button[data-automation-id*="action_menu_"]');
    rows = by.css('div[id="document-list-container"] div[class*="adf-datatable-body"] div[class*="adf-datatable-row"]');

    dataTablePage() {
        return new DataTablePage();
    }

    deleteContent(content) {
        this.clickOnActionMenu(content);
        this.waitForContentOptions();
        this.deleteContentElement.click();
    }

    checkDeleteIsDisabled(content) {
        this.clickOnActionMenu(content);
        this.waitForContentOptions();
        let disabledDelete = element(by.css(`button[data-automation-id*='DELETE'][disabled='true']`));
        Util.waitUntilElementIsVisible(disabledDelete);
    }

    metadataContent(content) {
        this.clickOnActionMenu(content);
        this.waitForContentOptions();
        this.metadataAction.click();
    }

    versionManagerContent(content) {
        this.clickOnActionMenu(content);
        this.waitForContentOptions();
        this.versionManagerAction.click();
    }

    copyContent(content) {
        this.clickOnActionMenu(content);
        this.copyContentElement.click();
    }

    lockContent(content) {
        this.clickOnActionMenu(content);
        this.lockContentElement.click();
    }

    waitForContentOptions() {
        Util.waitUntilElementIsVisible(this.copyContentElement);
        Util.waitUntilElementIsVisible(this.moveContentElement);
        Util.waitUntilElementIsVisible(this.deleteContentElement);
        Util.waitUntilElementIsVisible(this.downloadContent);
    }

    clickOnActionMenu(content) {
        this.dataTable.getRowByRowName(content).element(this.optionButton).click();
        Util.waitUntilElementIsVisible(this.actionMenu);
        browser.sleep(500);
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

    checkLockedIcon(content) {
        let lockIcon = element(by.cssContainingText('div[filename="' + content + '"] mat-icon', 'lock'));
        Util.waitUntilElementIsVisible(lockIcon);
        return this;
    }

    checkUnlockedIcon(content) {
        let lockIcon = element(by.cssContainingText('div[filename="' + content + '"] mat-icon', 'lock_open'));
        Util.waitUntilElementIsVisible(lockIcon);
        return this;
    }
}
