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

var SearchDialog = function () {

    var searchIcon = element(by.css("button[class*='adf-search-button']"));
    var searchBar = element(by.css("adf-search-control div[style*='translateX(0%)'] input"));
    var searchBarNotExpanded = element(by.css("adf-search-control div[style*='translateX(81%)']"));
    var no_result_message = element(by.css("p[class*='adf-search-fixed-text']"));
    var rowsAuthor = by.css("div[class='mat-list-text'] p[class*='adf-search-fixed-text']");
    var completeName = by.css("h4[class*='adf-search-fixed-text']");
    var highlightName = by.css("div[id*='results-content'] span[class='highlight']");
    var searchDialog = element(by.css("mat-list[id*='autocomplete-search-result-list']"));
    var allRows = element.all(by.css("h4[class*='adf-search-fixed-text']"));

    this.pressDownArrowAndEnter = function () {
        element(by.css("adf-search-control div[style*='translateX(0%)'] input")).sendKeys(protractor.Key.ARROW_DOWN);
        return browser.actions().sendKeys(protractor.Key.ENTER).perform();
    };


    this.clickOnSearchIcon = function () {
        Util.waitUntilElementIsVisible(searchIcon);
        searchIcon.click();
        return this;
    };

    this.checkSearchIconIsVisible = function () {
        Util.waitUntilElementIsVisible(searchIcon);
        return this;
    };

    this.checkSearchBarIsVisible = function () {
        Util.waitUntilElementIsVisible(searchBar);
        return this;
    };

    this.checkSearchBarIsNotVisible = function () {
        Util.waitUntilElementIsVisible(searchBarNotExpanded);
        return this;
    };

    this.checkNoResultMessageIsDisplayed = function () {
        Util.waitUntilElementIsVisible(no_result_message);
        return this;
    };

    this.checkNoResultMessageIsNotDisplayed = function () {
        Util.waitUntilElementIsNotOnPage(no_result_message);
        return this;
    };

    this.enterText = function (text) {
        Util.waitUntilElementIsVisible(searchBar);
        searchBar.click();
        searchBar.sendKeys(text);
        return this;
    };

    this.enterTextAndPressEnter = function (text) {
        Util.waitUntilElementIsVisible(searchBar);
        searchBar.click();
        searchBar.sendKeys(text);
        searchBar.sendKeys(protractor.Key.ENTER);
        return this;
    };

    this.resultTableContainsRow = function (name) {
        Util.waitUntilElementIsVisible(searchDialog);
        Util.waitUntilElementIsVisible(this.getRowByRowName(name));
        return this;
    };
    this.clickOnSpecificRow = function (name) {
        this.resultTableContainsRow(name);
        this.getRowByRowName(name).click();
        return this;
    };

    this.getRowByRowName = function (name) {
        return element(by.css("mat-list-item[data-automation-id='autocomplete_for_" + name + "']"));
    };

    this.getSpecificRowsHighlightName = function (name) {
        var deferred = protractor.promise.defer();
        this.getRowByRowName(name).element(highlightName).getText().then(function (result) {
            deferred.fulfill(result);
        })
        return deferred.promise;
    };

    this.getSpecificRowsCompleteName = function (name) {
        var deferred = protractor.promise.defer();
        this.getRowByRowName(name).element(completeName).getText().then(function (result) {
            deferred.fulfill(result);
        })
        return deferred.promise;
    };

    this.getSpecificRowsAuthor = function (name) {
        var deferred = protractor.promise.defer();
        this.getRowByRowName(name).element(rowsAuthor).getText().then(function (result) {
            deferred.fulfill(result);
        })
        return deferred.promise;
    };

    this.clearText = function () {
        Util.waitUntilElementIsVisible(searchBar);
        var deferred = protractor.promise.defer();
        searchBar.clear().then(function () {
            searchBar.sendKeys(protractor.Key.ESCAPE);
        });
        return deferred.promise;
    };
};
module.exports = SearchDialog;
