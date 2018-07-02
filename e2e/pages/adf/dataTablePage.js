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

var TestConfig = require('../../test.config');
var Util = require('../../util/util');

var DataTablePage = function () {

    var dataTableURL = TestConfig.adf.url + TestConfig.adf.port + "/datatable";
    var multiSelect = element(by.css("div[data-automation-id='multiselect'] label > div[class='mat-checkbox-inner-container']"));
    var selectionButton = element(by.css("div[class='mat-select-arrow']"));
    var selectionDropDown = element(by.css("div[class*='ng-trigger-transformPanel']"));
    var allSelectedRows = element.all(by.css("div[class*='is-selected']"));
    var selectedRowNumber = element(by.css("div[class*='is-selected'] div[data-automation-id*='text_']"));
    var selectAll = element(by.css("div[class*='header'] label"));
    var list = element.all(by.css("div[class*=adf-datatable-row]"));
    var addRow = element(by.xpath("//span[contains(text(),'Add row')]/.."));
    var replaceRows = element(by.xpath("//span[contains(text(),'Replace rows')]/.."));
    var replaceColumns = element(by.xpath("//span[contains(text(),'Replace columns')]/.."));
    var loadNode = element(by.xpath("//span[contains(text(),'Load Node')]/.."));
    var createdOnColumn = element(by.css("div[data-automation-id='auto_id_createdOn']"));
    var pageLoaded = element(by.css("div[data-automation-id='auto_id_id']"));
    var tableBody = element.all(by.css("adf-document-list div[class='adf-datatable-body']")).first();

    this.goToDatatable = function () {
        browser.driver.get(dataTableURL);
        Util.waitUntilElementIsVisible(pageLoaded);
    };

    /**
     * Retrieve row by row number
     *
     * @param rowNumber
     */
    this.getRowByRowNumber = function (rowNumber) {
        Util.waitUntilElementIsVisible(element(by.css("div[data-automation-id='text_" + rowNumber +"']")));
        return element(by.css("div[data-automation-id='text_" + rowNumber +"']"));
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
    * @property clickMultiSelect
    * */
    this.clickMultiSelect = function () {
        Util.waitUntilElementIsVisible(multiSelect);
        multiSelect.click();
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
        var row = this.getRowByRowNumber(rowNumber);
        browser.actions().sendKeys(protractor.Key.COMMAND).click(row).perform();
    };

    /**
    * Select a specific selection mode
    * @method selectSelectionMode
    * @param {String} selection mode
    */
    this.selectSelectionMode = function (selectionMode) {
        var selectMode = element(by.cssContainingText("span[class='mat-option-text']", selectionMode));
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
        var isRowSelected = this.getRowByRowNumber(rowNumber).element(by.xpath("ancestor::div[contains(@class, 'is-selected')]"));
        Util.waitUntilElementIsVisible(isRowSelected);
    };

    /**
    * Check if a specific row is not selected
    * @method checkRowIsNotSelected
    * @param {String} row number
    */
    this.checkRowIsNotSelected = function (rowNumber) {
        var isRowSelected = this.getRowByRowNumber(rowNumber).element(by.xpath("ancestor::div[contains(@class, 'adf-datatable-row custom-row-style ng-star-inserted is-selected')]"));
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
        var rowID = this.getRowByRowNumber(id);
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

    /**
    * check the nodeID is the same with the userHome folder's ID
    * @method replaceColumns
    */
    this.checkLoadNode = function (userHome) {
        var nodeId = element(by.css("div[data-automation-id*='" + userHome + "']"));

        Util.waitUntilElementIsVisible(loadNode);
        loadNode.click();
        Util.waitUntilElementIsVisible(nodeId, 10000);
    };

    this.navigateToContent = function(content) {
        var row = this.getRowByRowName(content);
        Util.waitUntilElementIsPresent(row);
        row.click();
        this.checkRowIsSelected(content);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
        return this;
    };

    this.getRowsName = function (content) {
        var row = element(by.css("div[data-automation-id*='" + content + "']"));
        Util.waitUntilElementIsPresent(row);
        return row;
    };

    this.getRowByRowName = function (content) {
        var rowByRowName = by.xpath("ancestor::div[contains(@class, 'adf-datatable-row')]");
        Util.waitUntilElementIsPresent(this.getRowsName(content).element(rowByRowName));
        return this.getRowsName(content).element(rowByRowName);
    };

    this.waitForTableBody = function (){
        Util.waitUntilElementIsVisible(tableBody);
    };

};
module.exports = DataTablePage;
