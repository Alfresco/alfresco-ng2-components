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

var PaginationPage = function () {

    var itemsPerPageDropdown = element(by.css("div[class*='adf-pagination__perpage-block'] button"));
    var pageSelectorDropDown = element(by.css("div[class*='adf-pagination__page-selector']"));
    var pageSelectorArrow = element(by.css("button[aria-label='Current page selector']"));
    var itemsPerPage = element(by.css("span[class='adf-pagination__max-items']"));
    var currentPage = element(by.css("span[class='adf-pagination__current-page']"));
    var totalPages = element(by.css("span[class='adf-pagination__total-pages']"));
    var paginationRange = element(by.css("span[class='adf-pagination__range']"));
    var nextPageButton = element(by.css("button[class*='adf-pagination__next-button']"));
    var nextButtonDisabled = element(by.css("button[class*='adf-pagination__next-button'][disabled]"));
    var previousButtonDisabled = element(by.css("button[class*='adf-pagination__previous-button'][disabled]"));
    var pageDropDown = element(by.css("div[class*='adf-pagination__actualinfo-block'] button"));
    var pageDropDownOptions = by.css("div[class*='mat-menu-content'] button");
    var paginationSection = element(by.css("adf-pagination"));
    var paginationSectionEmpty = element(by.css("adf-pagination[class*='adf-pagination__empty']"));
    var totalFiles = element(by.css('span[class="adf-pagination__range"]'));

    this.selectItemsPerPage = function (item) {
        Util.waitUntilElementIsVisible(itemsPerPageDropdown);
        Util.waitUntilElementIsClickable(itemsPerPageDropdown);
        browser.actions().mouseMove(itemsPerPageDropdown).perform();
        Util.waitUntilElementIsVisible(itemsPerPageDropdown);
        Util.waitUntilElementIsClickable(itemsPerPageDropdown).then(()=>{
            browser.driver.sleep(2000);
            itemsPerPageDropdown.click();
        });
        Util.waitUntilElementIsVisible(pageSelectorDropDown);

        var itemsPerPage = element.all(by.cssContainingText(".mat-menu-item", item)).first();
        Util.waitUntilElementIsClickable(itemsPerPage);
        Util.waitUntilElementIsVisible(itemsPerPage);
        itemsPerPage.click();
        return this;
    };

    this.checkPageSelectorIsNotDisplayed = function() {
        Util.waitUntilElementIsNotOnPage(pageSelectorArrow);
    };

    this.checkPageSelectorIsDisplayed = function() {
        Util.waitUntilElementIsVisible(pageSelectorArrow);
    };

    this.checkPaginationIsNotDisplayed = function () {
        Util.waitUntilElementIsOnPage(paginationSectionEmpty);
        return this;
    };

    this.getCurrentItemsPerPage = function () {
        Util.waitUntilElementIsVisible(itemsPerPage);
        return itemsPerPage.getText();
    };

    this.getCurrentPage = function () {
        Util.waitUntilElementIsVisible(paginationSection);
        Util.waitUntilElementIsVisible(currentPage);
        return currentPage.getText();
    };

    this.getTotalPages = function () {
        Util.waitUntilElementIsVisible(totalPages);
        return totalPages.getText();
    };

    this.getPaginationRange = function () {
        Util.waitUntilElementIsVisible(paginationRange);
        return paginationRange.getText();
    };

    this.clickOnNextPage = function () {
        Util.waitUntilElementIsVisible(nextPageButton);
        Util.waitUntilElementIsClickable(nextPageButton);
        browser.actions().mouseMove(nextPageButton).perform();
        Util.waitUntilElementIsVisible(nextPageButton);
        Util.waitUntilElementIsClickable(nextPageButton).then(()=> {
            browser.driver.sleep(2000);
        });
        return nextPageButton.click();
    };

    this.clickOnPageDropdown = function () {
        Util.waitUntilElementIsVisible(pageDropDown);
        Util.waitUntilElementIsClickable(pageDropDown);
        return pageDropDown.click();
    };

    this.clickOnPageDropdownOption = function (item) {
        Util.waitUntilElementIsVisible(element.all(pageDropDownOptions).first());
        var option = element(by.cssContainingText("div[class*='mat-menu-content'] button", item));
        Util.waitUntilElementIsVisible(option);
        option.click();
        return this;
    };

    this.getPageDropdownOptions = function() {
        var deferred = protractor.promise.defer();
        Util.waitUntilElementIsVisible(element.all(pageDropDownOptions).first());
        var initialList = [];
        element.all(pageDropDownOptions).each(function(element) {
            element.getText().then(function(text) {
                if(text !== '') {
                    initialList.push(text);
                }
            });
        }).then(function () {
            deferred.fulfill(initialList);
        });
        return deferred.promise;
    };

    this.checkNextPageButtonIsDisabled = function() {
        Util.waitUntilElementIsVisible(nextButtonDisabled);
    };

    this.checkPreviousPageButtonIsDisabled = function() {
        Util.waitUntilElementIsVisible(previousButtonDisabled);
    };

    this.checkNextPageButtonIsEnabled = function() {
        Util.waitUntilElementIsNotOnPage(nextButtonDisabled);
    };

    this.checkPreviousPageButtonIsEnabled = function() {
        Util.waitUntilElementIsNotOnPage(previousButtonDisabled);
    };

    this.getTotalNumberOfFiles = function () {
        Util.waitUntilElementIsVisible(totalFiles);
        var numberOfFiles = totalFiles.getText().then(function (totalNumber) {
            var totalNumberOfFiles = totalNumber.split('of ')[1];
          return totalNumberOfFiles;
        });

        return numberOfFiles;
    }
};

module.exports = PaginationPage;

