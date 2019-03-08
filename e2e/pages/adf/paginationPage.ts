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

import { Util } from '../../util/util';
import { browser, by, element, protractor } from 'protractor';

export class PaginationPage {

    itemsPerPageDropdown = element(by.css('div[class*="adf-pagination__perpage-block"] button'));
    pageSelectorDropDown = element(by.css('div[class*="adf-pagination__page-selector"]'));
    pageSelectorArrow = element(by.css('button[data-automation-id="page-selector"]'));
    itemsPerPage = element(by.css('span[class="adf-pagination__max-items"]'));
    currentPage = element(by.css('span[class="adf-pagination__current-page"]'));
    totalPages = element(by.css('span[class="adf-pagination__total-pages"]'));
    paginationRange = element(by.css('span[class="adf-pagination__range"]'));
    nextPageButton = element(by.css('button[class*="adf-pagination__next-button"]'));
    nextButtonDisabled = element(by.css('button[class*="adf-pagination__next-button"][disabled]'));
    previousButtonDisabled = element(by.css('button[class*="adf-pagination__previous-button"][disabled]'));
    pageDropDown = element(by.css('div[class*="adf-pagination__actualinfo-block"] button'));
    pageDropDownOptions = by.css('div[class*="mat-menu-content"] button');
    paginationSection = element(by.css('adf-pagination'));
    paginationSectionEmpty = element(by.css('adf-pagination[class*="adf-pagination__empty"]'));
    totalFiles = element(by.css('span[class="adf-pagination__range"]'));

    selectItemsPerPage(numberOfItem: string) {
        Util.waitUntilElementIsVisible(this.itemsPerPageDropdown);
        Util.waitUntilElementIsClickable(this.itemsPerPageDropdown);
        browser.actions().mouseMove(this.itemsPerPageDropdown).perform();
        Util.waitUntilElementIsVisible(this.itemsPerPageDropdown);
        Util.waitUntilElementIsClickable(this.itemsPerPageDropdown);
        this.itemsPerPageDropdown.click();
        Util.waitUntilElementIsVisible(this.pageSelectorDropDown);

        let itemsPerPage = element.all(by.cssContainingText('.mat-menu-item', numberOfItem)).first();
        Util.waitUntilElementIsClickable(itemsPerPage);
        Util.waitUntilElementIsVisible(itemsPerPage);
        itemsPerPage.click();
        return this;
    }

    checkPageSelectorIsNotDisplayed() {
        Util.waitUntilElementIsNotOnPage(this.pageSelectorArrow);
    }

    checkPageSelectorIsDisplayed() {
        Util.waitUntilElementIsVisible(this.pageSelectorArrow);
    }

    checkPaginationIsNotDisplayed() {
        Util.waitUntilElementIsOnPage(this.paginationSectionEmpty);
        return this;
    }

    getCurrentItemsPerPage() {
        Util.waitUntilElementIsVisible(this.itemsPerPage);
        return this.itemsPerPage.getText();
    }

    getCurrentPage() {
        Util.waitUntilElementIsVisible(this.paginationSection);
        Util.waitUntilElementIsVisible(this.currentPage);
        return this.currentPage.getText();
    }

    getTotalPages() {
        Util.waitUntilElementIsVisible(this.totalPages);
        return this.totalPages.getText();
    }

    getPaginationRange() {
        Util.waitUntilElementIsVisible(this.paginationRange);
        return this.paginationRange.getText();
    }

    clickOnNextPage() {
        Util.waitUntilElementIsVisible(this.nextPageButton);
        Util.waitUntilElementIsClickable(this.nextPageButton);
        browser.actions().mouseMove(this.nextPageButton).perform();
        Util.waitUntilElementIsVisible(this.nextPageButton);
        Util.waitUntilElementIsClickable(this.nextPageButton);
        return this.nextPageButton.click();
    }

    clickOnPageDropdown() {
        Util.waitUntilElementIsVisible(this.pageDropDown);
        Util.waitUntilElementIsClickable(this.pageDropDown);
        return this.pageDropDown.click();
    }

    clickOnPageDropdownOption(numberOfItemPerPage: string) {
        Util.waitUntilElementIsVisible(element.all(this.pageDropDownOptions).first());
        let option = element(by.cssContainingText('div[class*="mat-menu-content"] button', numberOfItemPerPage));
        Util.waitUntilElementIsVisible(option);
        option.click();
        return this;
    }

    getPageDropdownOptions() {
        let deferred = protractor.promise.defer();
        Util.waitUntilElementIsVisible(element.all(this.pageDropDownOptions).first());
        let initialList = [];
        element.all(this.pageDropDownOptions).each(function (currentOption) {
            currentOption.getText().then(function (text) {
                if (text !== '') {
                    initialList.push(text);
                }
            });
        }).then(function () {
            deferred.fulfill(initialList);
        });
        return deferred.promise;
    }

    checkNextPageButtonIsDisabled() {
        Util.waitUntilElementIsVisible(this.nextButtonDisabled);
    }

    checkPreviousPageButtonIsDisabled() {
        Util.waitUntilElementIsVisible(this.previousButtonDisabled);
    }

    checkNextPageButtonIsEnabled() {
        Util.waitUntilElementIsNotOnPage(this.nextButtonDisabled);
    }

    checkPreviousPageButtonIsEnabled() {
        Util.waitUntilElementIsNotOnPage(this.previousButtonDisabled);
    }

    getTotalNumberOfFiles() {
        Util.waitUntilElementIsVisible(this.totalFiles);
        let numberOfFiles = this.totalFiles.getText().then(function (totalNumber) {
            let totalNumberOfFiles = totalNumber.split('of ')[1];
            return totalNumberOfFiles;
        });

        return numberOfFiles;
    }
}
