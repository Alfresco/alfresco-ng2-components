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

import { ElementFinder, browser, by, element, protractor } from 'protractor';
import { DataTablePage } from '../dataTablePage';
import { Util } from '../../../util/util';

export class ContentListPage {

    rootElement: ElementFinder;
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
    rowByRowName = by.xpath('ancestor::div[contains(@class, "adf-datatable-row")]');
    nameColumn = by.css('div[class*="datatable-body"] div[class*="adf-datatable-cell"][title="Display name"]');
    nameColumnHeader = by.css('div[data-automation-id="auto_id_name"]');
    createdByColumn = by.css('div[class*="--text"][title="Created by"] span');
    sizeColumn = by.css('div[id*="document-list-container"] div[class*="adf-datatable-row"] .adf-filesize-cell');
    createdByColumnHeader = by.css('div[data-automation-id*="auto_id_createdByUser"]');
    createdColumn = by.css('div[class*="--date"] span');
    createdColumnHeader = by.css('div[data-automation-id*="auto_id_createdAt"]');
    rows = by.css('div[id="document-list-container"] div[class*="adf-datatable-body"] div[class*="adf-datatable-row"]');
    emptyFolderMessage = element(by.css('div[class="adf-empty-folder-this-space-is-empty"]'));
    table = element.all(by.css('adf-datatable')).first();
    tableBody = element.all(by.css('adf-document-list div[class="adf-datatable-body"]')).first();

    constructor(rootElement: ElementFinder = element(by.css('adf-document-list'))) {
        this.rootElement = rootElement;
    }

    getFileHyperlink(fileName) {
        return this.dataTable.getFileHyperlink(fileName);
    }

    getColumnLocator(column) {
        return by.css(`div[id*='document-list-container'] div[class*='adf-datatable-row'] div[title='${column}'] span`);
    }

    getTooltip(nodeName) {
        return this.getRowByRowName(nodeName).element(by.css(`adf-document-list span[title="${nodeName}"]`)).getAttribute('title');
    }

    getRowsName(content) {
        let row = element.all(by.css(`adf-document-list span[title='${content}']`)).first();
        Util.waitUntilElementIsVisible(row);
        return row;
    }

    getRowsNameWithRoot(content) {
        let row = this.rootElement.all(by.css(`adf-datatable span[title='${content}']`)).first();
        Util.waitUntilElementIsVisible(row);
        return row;
    }

    getRowByRowName(content) {
        Util.waitUntilElementIsVisible(this.getRowsName(content).element(this.rowByRowName));
        return this.getRowsName(content).element(this.rowByRowName);
    }

    getRowByRowNameWithRoot(content) {
        Util.waitUntilElementIsVisible(this.getRowsNameWithRoot(content).element(this.rowByRowName));
        return this.getRowsNameWithRoot(content).element(this.rowByRowName);
    }

    getCellByNameAndColumn(content, columnName) {
        return this.getRowByRowName(content).element(by.css(`div[title='${columnName}']`));
    }

    getAllDisplayedRows() {
        return element.all(this.rows).count();
    }

    getAllRowsNameColumn() {
        return this.getAllRowsColumnValues(this.nameColumn);
    }

    getAllRowsColumnValues(locator) {
        let deferred = protractor.promise.defer();
        Util.waitUntilElementIsVisible(element.all(locator).first());
        let initialList = [];

        element.all(locator).each(function (currentElement) {
            currentElement.getText().then(function (text) {
                if (text !== '') {
                    initialList.push(text);
                }
            });
        }).then(function () {
            deferred.fulfill(initialList);
        });

        return deferred.promise;
    }

    deleteContent(content) {
        this.clickOnActionMenu(content);
        this.waitForContentOptions();
        this.deleteContentElement.click();
    }

    deleteContentWithRoot(content) {
        this.clickOnActionMenuWithRoot(content);
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

    moveContent(content) {
        this.clickOnActionMenu(content);
        this.moveContentElement.click();
    }

    copyContent(content) {
        this.clickOnActionMenu(content);
        this.copyContentElement.click();
    }

    lockContent(content) {
        this.clickOnActionMenuWithRoot(content);
        this.lockContentElement.click();
    }

    waitForContentOptions() {
        Util.waitUntilElementIsVisible(this.copyContentElement);
        Util.waitUntilElementIsVisible(this.moveContentElement);
        Util.waitUntilElementIsVisible(this.deleteContentElement);
        Util.waitUntilElementIsVisible(this.downloadContent);
    }

    clickOnActionMenu(content) {
        this.getRowByRowName(content).element(this.optionButton).click();
        Util.waitUntilElementIsVisible(this.actionMenu);
        browser.sleep(500);
        return this;
    }

    clickOnActionMenuWithRoot(content) {
        this.getRowByRowNameWithRoot(content).element(this.optionButton).click();
        Util.waitUntilElementIsVisible(this.actionMenu);
        browser.sleep(500);
        return this;
    }

    sortByColumn(sortOrder, locator) {
        Util.waitUntilElementIsVisible(element(locator));
        return element(locator).getAttribute('class').then(function (result) {
            if (sortOrder === true) {
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

    /**
     * Sort the list by name column.
     *
     * @param sortOrder: 'true' to sort the list ascendant and 'false' for descendant
     */
    sortByName(sortOrder) {
        this.sortByColumn(sortOrder, this.nameColumnHeader);
    }

    /**
     * Sort the list by author column.
     *
     * @param sortOrder: 'true' to sort the list ascendant and 'false' for descendant
     */
    sortByAuthor(sortOrder) {
        this.sortByColumn(sortOrder, this.createdByColumnHeader);
    }

    /**
     * Sort the list by created column.
     *
     * @param sortOrder: 'true' to sort the list ascendant and 'false' for descendant
     */
    sortByCreated(sortOrder) {
        this.sortByColumn(sortOrder, this.createdColumnHeader);
    }

    /**
     * Check the list is sorted by name column.
     *
     * @param sortOrder: 'true' if the list is expected to be sorted ascendant and 'false' for descendant
     * @return sorted : 'true' if the list is sorted as expected and 'false' if it isn't
     */
    checkListIsOrderedByNameColumn(sortOrder) {
        let deferred = protractor.promise.defer();
        deferred.fulfill(this.checkListIsSorted(sortOrder, this.nameColumn));
        return deferred.promise;
    }

    /**
     * Check the list is sorted by author column.
     *
     * @param sortOrder: 'true' if the list is expected to be sorted ascendant and 'false' for descendant
     * @return sorted : 'true' if the list is sorted as expected and 'false' if it isn't
     */
    checkListIsOrderedByAuthorColumn(sortOrder) {
        let deferred = protractor.promise.defer();
        deferred.fulfill(this.checkListIsSorted(sortOrder, this.createdByColumn));
        return deferred.promise;
    }

    checkListIsOrderedBySizeColumn(sortOrder) {
        let deferred = protractor.promise.defer();
        deferred.fulfill(this.checkListIsSorted(sortOrder, this.sizeColumn));
        return deferred.promise;
    }

    /**
     * Check the list is sorted by created column.
     *
     * @param sortOrder: 'true' if the list is expected to be sorted ascendant and 'false' for descendant
     * @return sorted : 'true' if the list is sorted as expected and 'false' if it isn't
     */
    checkListIsOrderedByCreatedColumn(sortOrder) {
        let deferred = protractor.promise.defer();
        let lastValue;
        let sorted = true;

        element.all(this.createdColumn).map(function (currentElement) {
            return currentElement.getText();
        }).then(function (texts) {
            texts.forEach(function (text) {
                if (lastValue !== undefined) {
                    let currentDate = new Date(text);
                    let lastDate = new Date(lastValue);
                    if (sortOrder === true && currentDate.getTime() < lastDate.getTime()) {
                        sorted = false;
                    }
                    if (sortOrder === false && currentDate.getTime() > lastDate.getTime()) {
                        sorted = false;
                    }
                }
                lastValue = text;
            });
            deferred.fulfill(sorted);
        });
        return deferred.promise;
    }

    /**
     * Check the list is sorted.
     *
     * @param sortOrder: 'true' if the list is expected to be sorted ascendant and 'false' for descendant
     * @param locator: locator for column
     * @return 'true' if the list is sorted as expected and 'false' if it isn't
     */
    checkListIsSorted(sortOrder, locator) {
        let deferred = protractor.promise.defer();
        Util.waitUntilElementIsVisible(element.all(locator).first());
        let initialList = [];
        element.all(locator).each(function (currentElement) {
            currentElement.getText().then(function (text) {
                initialList.push(text);
            });
        }).then(function () {
            let sortedList = initialList;
            sortedList = sortedList.sort();
            if (sortOrder === false) {
                sortedList = sortedList.reverse();
            }
            deferred.fulfill(initialList.toString() === sortedList.toString());
        });
        return deferred.promise;
    }

    navigateToFolder(folder) {
        let row = this.getRowsName(folder);
        Util.waitUntilElementIsVisible(row);
        Util.waitUntilElementIsOnPage(row);
        row.click();
        this.checkRowIsSelected(folder);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
        return this;
    }

    doubleClickRow(selectRow) {
        let row = this.getRowsName(selectRow);
        Util.waitUntilElementIsVisible(row);
        Util.waitUntilElementIsClickable(row);
        row.click();
        Util.waitUntilElementIsVisible(this.getRowByRowName(selectRow).element(by.css(`div[class*='--image'] mat-icon[svgicon*='selected']`)));
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
        return this;
    }

    doubleClickEntireRow(selectRow) {
        let row = this.getRowByRowName(selectRow);
        Util.waitUntilElementIsVisible(row);
        Util.waitUntilElementIsClickable(row);
        row.click();
        Util.waitUntilElementIsVisible(this.getRowByRowName(selectRow).element(by.css(`div[class*='--image'] mat-icon[svgicon*='selected']`)));
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
        return this;
    }

    checkRowIsSelected(content) {
        let isRowSelected = this.getRowsName(content).element(by.xpath(`ancestor::div[contains(@class, 'is-selected')]`));
        Util.waitUntilElementIsVisible(isRowSelected);
    }

    checkRowIsSelectedWithRoot(content) {
        let isRowSelected = this.getRowsNameWithRoot(content).element(by.xpath(`ancestor::div[contains(@class, 'is-selected')]`));
        Util.waitUntilElementIsVisible(isRowSelected);
    }

    checkContentIsDisplayed(content) {
        Util.waitUntilElementIsVisible(this.getRowByRowName(content));
        return this;
    }

    getNodeIdByFilename(filename) {
        let nodeIdColumn = element.all(by.xpath(`//div[@id='document-list-container']//div[@filename='${filename}' and @title='Node id']`));
        return nodeIdColumn.getText();
    }

    async getAllNodeIdInList() {
        let nodeIdColumns = await element.all(by.xpath(`//div[@id='document-list-container']//div[@title='Node id']`));
        return await nodeIdColumns.map(async (currentElement) => {
            return await currentElement.getText().then((nodeText) => {
                return nodeText;
            });
        });
    }

    checkEmptyFolderMessageIsDisplayed() {
        Util.waitUntilElementIsVisible(this.emptyFolderMessage);
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

    clickRowToSelect(rowName) {
        let row = this.getRowByRowName(rowName);
        browser.actions().keyDown(protractor.Key.COMMAND).click(row).perform();
        this.checkRowIsSelected(rowName);
        return this;
    }

    clickRowToSelectWithRoot(rowName) {
        let row = this.getRowByRowNameWithRoot(rowName);
        browser.actions().keyDown(protractor.Key.COMMAND).click(row).perform();
        this.checkRowIsSelectedWithRoot(rowName);
        return this;
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

    waitForTableBody() {
        Util.waitUntilElementIsVisible(this.tableBody);
    }

    checkContentIsNotDisplayed(filename) {
        Util.waitUntilElementIsNotVisible(element.all(by.css(`#document-list-container span[title='${filename}']`)).first());
        return this;
    }

    tableIsLoaded() {
        Util.waitUntilElementIsVisible(this.table);
        return this;
    }

    checkIconColumn(file, extension) {
        let row = this.getRowByRowName(file);
        Util.waitUntilElementIsVisible(row.element(by.css(`div[class*='--image'] img[alt*="${extension}"]`)));
    }

    rightClickOnRowNamed(rowName) {
        let row = this.getRowByRowName(rowName);
        browser.actions().click(row, protractor.Button.RIGHT).perform();
        Util.waitUntilElementIsVisible(element(by.id('adf-context-menu-content')));
    }

    clickMenuActionNamed(actionName) {
        let actionButton = this.checkMenuActionIsVisible(actionName);
        actionButton.click();
    }

    checkMenuActionIsVisible(actionName) {
        let actionButton = element(by.css(`button[data-automation-id='DOCUMENT_LIST.ACTIONS.${actionName}']`));
        Util.waitUntilElementIsVisible(actionButton);
        Util.waitUntilElementIsClickable(actionButton);
        return actionButton;
    }

    clickRowMenuActionsButton(rowName) {
        let row = this.getRowByRowName(rowName);
        Util.waitUntilElementIsVisible(row.element(by.css('.adf-datatable__actions-cell button')));
        row.element(by.css('.adf-datatable__actions-cell button')).click();
    }

}
