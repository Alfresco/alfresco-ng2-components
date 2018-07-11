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

var Util = require('../../../util/util');

var ContentList = function () {

    var deleteContent = element(by.css("button[data-automation-id*='DELETE']"));
    var moveContent = element(by.css("button[data-automation-id*='MOVE']"));
    var copyContent = element(by.css("button[data-automation-id*='COPY']"));
    var downloadContent = element(by.css("button[data-automation-id*='DOWNLOAD']"));
    var actionMenu = element(by.css("div[role='menu']"));
    var optionButton = by.css("button[data-automation-id*='action_menu_']");
    var rowByRowName = by.xpath("ancestor::div[contains(@class, 'adf-datatable-row')]");
    var nameColumn = by.css("div[class*='document-list-container'] div[class*='adf-datatable-row'] div[class*='--text full-width'] span");
    var nameColumnHeader = by.css("div[data-automation-id='auto_id_name']");
    var createdByColumn = by.css("div[class*='--text'][title='Created by'] span");
    var createdByColumnHeader = by.css("div[data-automation-id*='auto_id_createdByUser']");
    var createdColumn = by.css("div[class*='--date'] span");
    var createdColumnHeader = by.css("div[data-automation-id*='auto_id_createdAt']");
    var rows = by.css("div[class='document-list-container'] div[class*='adf-datatable-body'] div[class*='adf-datatable-row']");
    var emptyFolderMessage = element(by.css("div[class='adf-empty-folder-this-space-is-empty']"));
    var table = element(by.css("div[class*='upload-border']"));

    this.getRowsName = function (content) {
        var row = element(by.xpath("//div[@class='document-list-container']//span[@title='" + content + "']"));
        Util.waitUntilElementIsVisible(row);
        return row;
    };

    this.getRowByRowName = function (content) {
        Util.waitUntilElementIsOnPage(this.getRowsName(content).element(rowByRowName));
        Util.waitUntilElementIsVisible(this.getRowsName(content).element(rowByRowName));
        return this.getRowsName(content).element(rowByRowName);
    };

    this.getAllDisplayedRows = function () {
        return element.all(rows).count();
    };

    this.getAllRowsNameColumn = function () {
        return this.getAllRowsColumnValues(nameColumn);
    };

    this.getAllRowsColumnValues = function (locator) {
        var deferred = protractor.promise.defer();
        Util.waitUntilElementIsVisible(element.all(locator).first());
        var initialList = [];

        element.all(locator).each(function (element) {
            element.getText().then(function (text) {
                if (text !== '') {
                    initialList.push(text);
                }
                ;
            });
        }).then(function () {
            deferred.fulfill(initialList);
        });

        return deferred.promise;
    };

    this.deleteContent = function (content) {
        this.clickOnActionMenu(content);
        this.waitForContentOptions();
        deleteContent.click();
    };

    this.moveContent = function (content) {
        this.clickOnActionMenu(content);
        moveContent.click();
    };

    this.copyContent = function (content) {
        this.clickOnActionMenu(content);
        copyContent.click();
    };

    this.waitForContentOptions = function () {
        Util.waitUntilElementIsVisible(copyContent);
        Util.waitUntilElementIsVisible(moveContent);
        Util.waitUntilElementIsVisible(deleteContent);
        Util.waitUntilElementIsVisible(downloadContent);
    };

    this.clickOnActionMenu = function (content) {
        this.getRowByRowName(content).element(optionButton).click();
        Util.waitUntilElementIsVisible(actionMenu);
        return this;
    };

    this.sortByColumn = function (sortOrder, locator) {
        Util.waitUntilElementIsVisible(element(locator));
        return element(locator).getAttribute('class').then(function (result) {
            if (sortOrder === true) {
                if (!result.includes('sorted-asc')) {
                    if (result.includes('sorted-desc') || result.includes('sortable')) {
                        element(locator).click();
                    }
                }
            }
            else {
                if (result.includes('sorted-asc')) {
                    element(locator).click();
                } else if (result.includes('sortable')) {
                    element(locator).click();
                    element(locator).click();
                }
            }

            return Promise.resolve();
        });
    };

    /**
     * Sort the list by name column.
     *
     * @param sortOrder: 'true' to sort the list ascendant and 'false' for descendant
     */
    this.sortByName = function (sortOrder) {
        this.sortByColumn(sortOrder, nameColumnHeader);
    };

    /**
     * Sort the list by author column.
     *
     * @param sortOrder: 'true' to sort the list ascendant and 'false' for descendant
     */
    this.sortByAuthor = function (sortOrder) {
        this.sortByColumn(sortOrder, createdByColumnHeader);
    };

    /**
     * Sort the list by created column.
     *
     * @param sortOrder: 'true' to sort the list ascendant and 'false' for descendant
     */
    this.sortByCreated = function (sortOrder) {
        this.sortByColumn(sortOrder, createdColumnHeader);
    };

    /**
     * Check the list is sorted by name column.
     *
     * @param sortOrder: 'true' if the list is expected to be sorted ascendant and 'false' for descendant
     * @return sorted : 'true' if the list is sorted as expected and 'false' if it isn't
     */
    this.checkListIsOrderedByNameColumn = function (sortOrder) {
        var deferred = protractor.promise.defer();
        deferred.fulfill(this.checkListIsSorted(sortOrder, nameColumn));
        return deferred.promise;
    };

    /**
     * Check the list is sorted by author column.
     *
     * @param sortOrder: 'true' if the list is expected to be sorted ascendant and 'false' for descendant
     * @return sorted : 'true' if the list is sorted as expected and 'false' if it isn't
     */
    this.checkListIsOrderedByAuthorColumn = function (sortOrder) {
        var deferred = protractor.promise.defer();
        deferred.fulfill(this.checkListIsSorted(sortOrder, createdByColumn));
        return deferred.promise;
    };

    /**
     * Check the list is sorted by created column.
     *
     * @param sortOrder: 'true' if the list is expected to be sorted ascendant and 'false' for descendant
     * @return sorted : 'true' if the list is sorted as expected and 'false' if it isn't
     */
    this.checkListIsOrderedByCreatedColumn = function (sortOrder) {
        var deferred = protractor.promise.defer();
        var lastValue;
        var sorted = true;

        element.all(createdColumn).map(function (element) {
            return element.getText();
        }).then(function (texts) {
            texts.forEach(function (text) {
                if (lastValue !== undefined) {
                    var currentDate = new Date(text);
                    var lastDate = new Date(lastValue);
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
    };

    /**
     * Check the list is sorted.
     *
     * @param sortOrder: 'true' if the list is expected to be sorted ascendant and 'false' for descendant
     * @param locator: locator for column
     * @return 'true' if the list is sorted as expected and 'false' if it isn't
     */
    this.checkListIsSorted = function (sortOrder, locator) {
        var deferred = protractor.promise.defer();
        Util.waitUntilElementIsVisible(element.all(locator).first());
        var initialList = [];
        element.all(locator).each(function (element) {
            element.getText().then(function (text) {
                initialList.push(text);
            });
        }).then(function () {
            var sortedList = initialList;
            sortedList = sortedList.sort();
            if (sortOrder === false) {
                sortedList = sortedList.reverse();
            }
            deferred.fulfill(initialList.toString() === sortedList.toString());
        });
        return deferred.promise;
    };

    this.navigateToFolder = function (folder) {
        var row = this.getRowsName(folder);
        Util.waitUntilElementIsVisible(row);
        Util.waitUntilElementIsOnPage(row);
        row.click();
        this.checkRowIsSelected(folder);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
        return this;
    };

    this.doubleClickRow = function (selectRow) {
        var row = this.getRowsName(selectRow);
        Util.waitUntilElementIsVisible(row);
        Util.waitUntilElementIsClickable(row);
        row.click();
        Util.waitUntilElementIsVisible(this.getRowByRowName(selectRow).element(by.css("div[class*='--image'] mat-icon[svgicon*='selected']")));
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
        return this;
    };

    this.doubleClickEntireRow = function (selectRow) {
        var row = this.getRowByRowName(selectRow);
        Util.waitUntilElementIsVisible(row);
        Util.waitUntilElementIsClickable(row);
        row.click();
        Util.waitUntilElementIsVisible(this.getRowByRowName(selectRow).element(by.css("div[class*='--image'] mat-icon[svgicon*='selected']")));
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
        return this;
    };

    this.checkRowIsSelected = function (content) {
        var isRowSelected = this.getRowsName(content).element(by.xpath("ancestor::div[contains(@class, 'is-selected')]"));
        Util.waitUntilElementIsVisible(isRowSelected);
    };

    this.checkContentIsDisplayed = function (content) {
        Util.waitUntilElementIsVisible(this.getRowByRowName(content));
        return this;
    };

    this.checkContentIsNotDisplayed = function (content) {
        Util.waitUntilElementIsNotVisible(element(by.css("adf-document-list span[title='" + content + "']")));
        return this;
    };

    this.checkEmptyFolderMessageIsDisplayed = function () {
        Util.waitUntilElementIsVisible(emptyFolderMessage);
        return this;
    };

    this.tableIsLoaded = function () {
        Util.waitUntilElementIsVisible(table);
        return this;
    };

    this.checkIconColumn = function (file, extension) {
        var row = this.getRowByRowName(file);
        Util.waitUntilElementIsVisible(row);
        Util.waitUntilElementIsVisible(row.element(by.css("div[class*='--image'] img[alt*='" + extension + "']")));
    };

};
module.exports = ContentList;
