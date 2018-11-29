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

import { element, by, browser } from 'protractor';

var TestConfig = require('../../test.config');
var Util = require('../../util/util');

var DataTablePage = function (rootElement = element(by.css("adf-datatable"))) {

    var dataTableURL = TestConfig.adf.url + TestConfig.adf.port + "/datatable";

    var contents = element.all(by.css('div[class="adf-datatable-body"] span'));
    var multiSelect = element(by.css("div[data-automation-id='multiselect'] label > div[class='mat-checkbox-inner-container']"));
    var selectionButton = element(by.css("div[class='mat-select-arrow']"));
    var selectionDropDown = element(by.css("div[class*='ng-trigger-transformPanel']"));
    var allSelectedRows = element.all(by.css("div[class*='is-selected']"));
    var selectedRowNumber = element(by.css("div[class*='is-selected'] div[data-automation-id*='text_']"));
    var selectAll = element(by.css("div[class*='header'] label"));
    var list = rootElement.all(by.css("div[class*=adf-datatable-body] div[class*=adf-datatable-row]"));
    var addRow = element(by.xpath("//span[contains(text(),'Add row')]/.."));
    var replaceRows = element(by.xpath("//span[contains(text(),'Replace rows')]/.."));
    var reset = element(by.xpath("//span[contains(text(),'Reset to default')]/.."));
    var replaceColumns = element(by.xpath("//span[contains(text(),'Replace columns')]/.."));
    var createdOnColumn = element(by.css("div[data-automation-id='auto_id_createdOn']"));
    var pageLoaded = element(by.css("div[data-automation-id='auto_id_id']"));
    var tableBody = element.all(by.css("div[class='adf-datatable-body']")).first();
    var spinner = element(by.css('mat-progress-spinner'));
    var rows = by.css("adf-datatable div[class*='adf-datatable-body'] div[class*='adf-datatable-row']");
    var nameColumn = by.css("adf-datatable div[class*='adf-datatable-body'] div[class*='adf-datatable-row'] div[title='Name'] span");

    this.goToDatatable = function () {
        browser.driver.get(dataTableURL);
        Util.waitUntilElementIsVisible(pageLoaded);
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
            });
        }).then(function () {
            deferred.fulfill(initialList);
        });

        return deferred.promise;
    };

    /**
     * Retrieve row by row number
     *
     * @param rowNumber
     */
    this.getRowByRowNumber = function (rowNumber) {
        Util.waitUntilElementIsVisible(element(by.css("div[data-automation-id='text_" + rowNumber + "']")));
        return element(by.css("div[data-automation-id='text_" + rowNumber + "']"));
    };

    /**
     * Retrieve the checkbox of the row
     *
     * @param rowNumber
     */
    this.getRowCheckbox = function (rowNumber) {
        return this.getRowByRowNumber(rowNumber).element(by.xpath("ancestor::div/div/mat-checkbox[contains(@class, 'mat-checkbox-checked')]"));
    };

    /**
     * Click multiselect option
     * */
    this.clickMultiSelect = function () {
        Util.waitUntilElementIsVisible(multiSelect);
        multiSelect.click();
    };

    /**
     * Click reset option
     * */
    this.clickReset = function () {
        Util.waitUntilElementIsVisible(reset);
        reset.click();
    };

    /**
     * Click specific checkbox in row
     * @method clickCheckbox
     * @param {String} row number
     */
    this.clickCheckbox = function (rowNumber) {
        var checkbox = this.getRowByRowNumber(rowNumber).element(by.xpath("ancestor::div[contains(@class, 'adf-datatable-row')]//mat-checkbox/label"));
        Util.waitUntilElementIsVisible(checkbox);
        checkbox.click();
    };

    /**
     * Select a specific row
     * @method selectRow
     * @param {String} row number
     */
    this.selectRow = function (rowNumber) {
        return this.getRowByRowNumber(rowNumber).click();
    };

    /**
     * Select a specific row using command key
     * @method selectRow
     * @param {String} row number
     */
    this.selectRowWithKeyboard = function (rowNumber) {
        let row = this.getRowByRowNumber(rowNumber);
        browser.actions().sendKeys(protractor.Key.COMMAND).click(row).perform();
    };

    /**
     * Select a specific selection mode
     * @method selectSelectionMode
     * @param {String} selection mode
     */
    this.selectSelectionMode = function (selectionMode) {
        let selectMode = element(by.cssContainingText("span[class='mat-option-text']", selectionMode));
        selectionButton.click();
        Util.waitUntilElementIsVisible(selectionDropDown);
        selectMode.click();
    };

    /**
     * Check if a specific row is selected
     * @method checkRowIsSelected
     * @param {String} row number
     */
    this.checkRowIsSelected = function (rowNumber) {
        let isRowSelected = this.getRowByRowNumber(rowNumber).element(by.xpath("ancestor::div[contains(@class, 'is-selected')]"));
        Util.waitUntilElementIsVisible(isRowSelected);
    };

    /**
     * Check if a specific row is not selected
     * @method checkRowIsNotSelected
     * @param {String} row number
     */
    this.checkRowIsNotSelected = function (rowNumber) {
        let isRowSelected = this.getRowByRowNumber(rowNumber).element(by.xpath("ancestor::div[contains(@class, 'adf-datatable-row custom-row-style ng-star-inserted is-selected')]"));
        Util.waitUntilElementIsNotOnPage(isRowSelected);
    };

    /**
     * Check no row is selected
     * @method checkNoRowIsSelected
     */
    this.checkNoRowIsSelected = function () {
        Util.waitUntilElementIsNotOnPage(selectedRowNumber);
    };

    this.checkAllRows = function () {
        Util.waitUntilElementIsVisible(selectAll);
        selectAll.click();
    };

    /**
     * Check specfic row is checked
     * @method checkRowIsChecked
     * @param {String} row number
     */
    this.checkRowIsChecked = function (rowNumber) {
        Util.waitUntilElementIsVisible(this.getRowCheckbox(rowNumber));
    };

    /**
     * Check specfic row is not checked
     * @method checkRowIsNotChecked
     * @param {String} row number
     */
    this.checkRowIsNotChecked = function (rowNumber) {
        Util.waitUntilElementIsNotOnPage(this.getRowCheckbox(rowNumber));
    };

    /**
     * Add a row to the table
     * @method addRow
     */
    this.addRow = function () {
        Util.waitUntilElementIsVisible(addRow);
        addRow.click();
    };

    /**
     * Get the number of rows of the table
     * @method getNumberOfRows
     */
    this.getNumberOfRows = function () {
        return list.count();
    };

    /**
     * Get the number of selected rows of the table
     * @method getNumberOfSelectedRows
     */
    this.getNumberOfSelectedRows = function () {
        return allSelectedRows.count();
    };

    /**
     * replace rows
     * @method replaceRows
     * @param {String} id
     */
    this.replaceRows = function (id) {
        let rowID = this.getRowByRowNumber(id);
        Util.waitUntilElementIsVisible(rowID);
        replaceRows.click();
        Util.waitUntilElementIsNotOnPage(rowID);
    };

    /**
     * replace columns
     * @method replaceColumns
     */
    this.replaceColumns = function () {
        Util.waitUntilElementIsVisible(replaceColumns);
        replaceColumns.click();
        Util.waitUntilElementIsNotOnPage(createdOnColumn);
    };

    this.getRowsName = function (content) {
        let row = element(by.css("div[data-automation-id*='" + content + "']"));
        Util.waitUntilElementIsPresent(row);
        return row;
    };

    this.doubleClickRow = function (rowName) {
        let row = this.getRowByRowName(rowName);
        Util.waitUntilElementIsVisible(row);
        Util.waitUntilElementIsClickable(row);
        row.click();
        Util.waitUntilElementIsVisible(row.all(by.css("div[class*='--image'] mat-icon[svgicon*='selected']")).first());
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
        return this;
    };

    this.getRowByRowName = function (content) {
        let rowByRowName = by.xpath("ancestor::div[contains(@class, 'adf-datatable-row')]");
        Util.waitUntilElementIsPresent(this.getRowsName(content).element(rowByRowName));
        return this.getRowsName(content).element(rowByRowName);
    };

    this.waitForTableBody = function () {
        Util.waitUntilElementIsVisible(tableBody);
    };

    this.insertFilter = function (filterText) {
        let inputFilter = element(by.xpath("//*[@id=\"adf-datatable-filter-input\"]"));
        inputFilter.clear();
        return inputFilter.sendKeys(filterText);
    };

    this.getNodeIdFirstElement = function () {
        let firstNode = element.all(by.css('adf-datatable div[title="Node id"] span')).first();
        return firstNode.getText();
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

    this.checkContentIsDisplayed = function(content) {
        var row = by.cssContainingText("[class='adf-datatable-cell-value']", content);
        Util.waitUntilElementIsVisible(tableBody.all(row).first());
        return this;
    };

    this.checkContentIsNotDisplayed = function(content) {
        var row = by.cssContainingText("[class='adf-datatable-cell-value']", content);
        Util.waitUntilElementIsNotOnPage(tableBody.all(row).first());
        return this;
    };

    this.selectRowByContentName = function(content) {
        var row = by.cssContainingText("[class='adf-datatable-cell-value']", content);
        Util.waitUntilElementIsVisible(tableBody.element(row));
        tableBody.element(row).click();
        return this;
    };

    this.contentInPosition = function (position){
        Util.waitUntilElementIsVisible(contents);
        return contents.get(position -1).getText();
    };

    this.checkSpinnerIsDisplayed = function () {
        Util.waitUntilElementIsPresent(spinner);
    };

    this.checkRowIsDisplayedByName = function (name) {
        Util.waitUntilElementIsVisible(element(by.css("div[filename='"+name+"']")));
    };

    this.checkRowIsNotDisplayedByName = function (taskName) {
        Util.waitUntilElementIsNotOnPage(element(by.css("div[filename='"+taskName+"']")));
    };

    this.getNumberOfRowsDisplayedWithSameName = function (taskName) {
        Util.waitUntilElementIsVisible(element(by.css("div[filename='"+taskName+"']")));
        return element.all(by.css("div[title='Name'][filename='"+taskName+"']")).count();
    };

};
module.exports = DataTablePage;
