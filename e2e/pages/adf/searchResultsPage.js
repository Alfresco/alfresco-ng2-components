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

var Util = require('../../util/util');
var ContentList = require('./dialog/contentList');
var DatatablePage = require('./dataTablePage');

var SearchResultsPage = function () {

    var noResultsMessage = element(by.css("div[class='adf-no-result-message']"));
    var noResultsMessageBy = by.css("div[class='adf-no-result-message']");
    var contentList = new ContentList();
    var dataTable = new DatatablePage();
    var sortArrowLocator = by.css("adf-sorting-picker button mat-icon");
    var sortDropdownLocator = by.css("mat-option span");
    var sortingArrow = element(by.css("adf-sorting-picker div[class='mat-select-arrow']"));

    this.checkContentIsDisplayed = function (content) {
        contentList.checkContentIsDisplayed(content);
        return this;
    };

    this.numberOfResultsDisplayed = function () {
        return contentList.getAllDisplayedRows();
    };

    this.checkContentIsNotDisplayed = function (content) {
        Util.waitUntilElementIsNotOnPage(element(by.css("span[title='" + content +"']")));
    };

    this.checkNoResultMessageIsDisplayed = function() {
        Util.waitUntilElementIsPresent(element(noResultsMessageBy));
        Util.waitUntilElementIsVisible(element(noResultsMessageBy));
        return this;
    };

    this.checkNoResultMessageIsNotDisplayed = function () {
        Util.waitUntilElementIsNotOnPage(noResultsMessage);
        return this;
    };

    this.navigateToFolder = function(content) {
        dataTable.navigateToContent(content);
        return this;
    };

    this.deleteContent = function(content) { 
        contentList.deleteContent(content);
     };

    this.copyContent = function(content) { 
        contentList.copyContent(content);
     };

    this.moveContent = function(content) { 
        contentList.moveContent(content); 
    };

    /**
     * Sort the list by name column.
     *
     * @param sortOrder: 'true' to sort the list ascendant and 'false' for descendant
     */
    this.sortByName = function (sortOrder) {
        this.sortBy(sortOrder, "Name");
    };

    /**
     * Sort the list by any option.
     *
     * @param sortOrder: 'true' to sort the list ascendant and 'false' for descendant
     * @param option
     */
    this.sortBy = function (sortOrder, option) {

        Util.waitUntilElementIsVisible(sortingArrow);
        sortingArrow.click();

        element.all(sortDropdownLocator).each(function(element) {
            element.getText().then(function(text) {
                if (text === option) {
                    element.click();
                }
            });
         });

        this.sortByOrder(sortOrder);
    };

    this.sortByOrder = function(sortOrder) {
        Util.waitUntilElementIsVisible(element(sortArrowLocator));
        return element(sortArrowLocator).getText().then(function (result) {
            if(sortOrder===true) {
                if(result !== 'arrow_upward') {
                        element(sortArrowLocator).click();
                };
            }
            else {
                if(result === 'arrow_upward') {
                    element(sortArrowLocator).click();
                };
            }

            return Promise.resolve();
        });
    };

    /**
     * Sort the list by author column.
     *
     * @param sortOrder: 'true' to sort the list ascendant and 'false' for descendant
     */
    this.sortByAuthor = function (sortOrder) {
        this.sortBy(sortOrder, "Author");
    };

    /**
     * Sort the list by created column.
     *
     * @param sortOrder: 'true' to sort the list ascendant and 'false' for descendant
     */
    this.sortByCreated = function (sortOrder) {
        this.sortBy(sortOrder, "Created");
    };

    /**
     * Sort by name and check the list is sorted.
     *
     * @param sortOrder: 'true' if the list is expected to be sorted ascendant and 'false' for descendant
     * @return result : 'true' if the list is sorted as expected and 'false' if it isn't
     */
    this.sortAndCheckListIsOrderedByName = function (sortOrder) {
        this.sortByName(sortOrder);
        dataTable.waitForTableBody();
        var deferred = protractor.promise.defer();
        contentList.checkListIsOrderedByNameColumn(sortOrder).then(function(result) {
            deferred.fulfill(result);
        });
        return deferred.promise;
    };

    /**
     * Sort by author and check the list is sorted.
     *
     * @param sortOrder: 'true' if the list is expected to be sorted ascendant and 'false' for descendant
     * @return result : 'true' if the list is sorted as expected and 'false' if it isn't
     */
    this.sortAndCheckListIsOrderedByAuthor = function (sortOrder) {
        this.sortByAuthor(sortOrder);
        var deferred = protractor.promise.defer();
        contentList.checkListIsOrderedByAuthorColumn(sortOrder).then(function(result) {
            deferred.fulfill(result);
        });
        return deferred.promise;
    };

    /**
     * Sort by created and check the list is sorted.
     *
     * @param sortOrder: 'true' if the list is expected to be sorted ascendant and 'false' for descendant
     * @return result : 'true' if the list is sorted as expected and 'false' if it isn't
     */
    this.sortAndCheckListIsOrderedByCreated = function (sortOrder) {
        this.sortByCreated(sortOrder);
        var deferred = protractor.promise.defer();
        contentList.checkListIsOrderedByCreatedColumn(sortOrder).then(function(result) {
            deferred.fulfill(result);
        });
        return deferred.promise;
    };

};
module.exports = SearchResultsPage;
