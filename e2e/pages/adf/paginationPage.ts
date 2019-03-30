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

import { browser, by, element, protractor } from 'protractor';
import { BrowserVisibility } from '@alfresco/adf-testing';

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
        BrowserVisibility.waitUntilElementIsVisible(this.itemsPerPageDropdown);
        BrowserVisibility.waitUntilElementIsClickable(this.itemsPerPageDropdown);
        browser.actions().mouseMove(this.itemsPerPageDropdown).perform();
        BrowserVisibility.waitUntilElementIsVisible(this.itemsPerPageDropdown);
        BrowserVisibility.waitUntilElementIsClickable(this.itemsPerPageDropdown);
        this.itemsPerPageDropdown.click();
        BrowserVisibility.waitUntilElementIsVisible(this.pageSelectorDropDown);

        const itemsPerPage = element.all(by.cssContainingText('.mat-menu-item', numberOfItem)).first();
        BrowserVisibility.waitUntilElementIsClickable(itemsPerPage);
        BrowserVisibility.waitUntilElementIsVisible(itemsPerPage);
        itemsPerPage.click();
        return this;
    }

    checkPageSelectorIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotOnPage(this.pageSelectorArrow);
    }

    checkPageSelectorIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.pageSelectorArrow);
    }

    checkPaginationIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsOnPage(this.paginationSectionEmpty);
        return this;
    }

    getCurrentItemsPerPage() {
        BrowserVisibility.waitUntilElementIsVisible(this.itemsPerPage);
        return this.itemsPerPage.getText();
    }

    getCurrentPage() {
        BrowserVisibility.waitUntilElementIsVisible(this.paginationSection);
        BrowserVisibility.waitUntilElementIsVisible(this.currentPage);
        return this.currentPage.getText();
    }

    getTotalPages() {
        BrowserVisibility.waitUntilElementIsVisible(this.totalPages);
        return this.totalPages.getText();
    }

    getPaginationRange() {
        BrowserVisibility.waitUntilElementIsVisible(this.paginationRange);
        return this.paginationRange.getText();
    }

    clickOnNextPage() {
        BrowserVisibility.waitUntilElementIsVisible(this.nextPageButton);
        BrowserVisibility.waitUntilElementIsClickable(this.nextPageButton);
        browser.actions().mouseMove(this.nextPageButton).perform();
        BrowserVisibility.waitUntilElementIsVisible(this.nextPageButton);
        BrowserVisibility.waitUntilElementIsClickable(this.nextPageButton);
        return this.nextPageButton.click();
    }

    clickOnPageDropdown() {
        BrowserVisibility.waitUntilElementIsVisible(this.pageDropDown);
        BrowserVisibility.waitUntilElementIsClickable(this.pageDropDown);
        return this.pageDropDown.click();
    }

    clickOnPageDropdownOption(numberOfItemPerPage: string) {
        BrowserVisibility.waitUntilElementIsVisible(element.all(this.pageDropDownOptions).first());
        const option = element(by.cssContainingText('div[class*="mat-menu-content"] button', numberOfItemPerPage));
        BrowserVisibility.waitUntilElementIsVisible(option);
        option.click();
        return this;
    }

    getPageDropdownOptions() {
        const deferred = protractor.promise.defer();
        BrowserVisibility.waitUntilElementIsVisible(element.all(this.pageDropDownOptions).first());
        const initialList = [];
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
        BrowserVisibility.waitUntilElementIsVisible(this.nextButtonDisabled);
    }

    checkPreviousPageButtonIsDisabled() {
        BrowserVisibility.waitUntilElementIsVisible(this.previousButtonDisabled);
    }

    checkNextPageButtonIsEnabled() {
        BrowserVisibility.waitUntilElementIsNotOnPage(this.nextButtonDisabled);
    }

    checkPreviousPageButtonIsEnabled() {
        BrowserVisibility.waitUntilElementIsNotOnPage(this.previousButtonDisabled);
    }

    getTotalNumberOfFiles() {
        BrowserVisibility.waitUntilElementIsVisible(this.totalFiles);
        const numberOfFiles = this.totalFiles.getText().then(function (totalNumber) {
            const totalNumberOfFiles = totalNumber.split('of ')[1];
            return totalNumberOfFiles;
        });

        return numberOfFiles;
    }
}
