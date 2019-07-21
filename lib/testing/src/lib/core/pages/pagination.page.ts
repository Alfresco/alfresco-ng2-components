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
import { BrowserVisibility } from '../utils/browser-visibility';
import { BrowserActions } from '../utils/browser-actions';

export class PaginationPage {

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

    async selectItemsPerPage(numberOfItem: string) {
        browser.executeScript(`document.querySelector('div[class*="adf-pagination__perpage-block"] button').click();`);
        await BrowserVisibility.waitUntilElementIsVisible(this.pageSelectorDropDown);
        const itemsPerPage = element.all(by.cssContainingText('.mat-menu-item', numberOfItem)).first();
        await BrowserActions.click(itemsPerPage);
        return this;
    }

    async checkPageSelectorIsNotDisplayed() {
        await BrowserVisibility.waitUntilElementIsNotOnPage(this.pageSelectorArrow);
    }

    async checkPageSelectorIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.pageSelectorArrow);
    }

    async checkPaginationIsNotDisplayed() {
        await BrowserVisibility.waitUntilElementIsOnPage(this.paginationSectionEmpty);
        return this;
    }

    async getCurrentItemsPerPage(): Promise<string> {
        return BrowserActions.getText(this.itemsPerPage);
    }

    async getCurrentPage(): Promise<string> {
        return BrowserActions.getText(this.currentPage);
    }

    async getTotalPages(): Promise<string> {
        return BrowserActions.getText(this.totalPages);
    }

    async getPaginationRange(): Promise<string> {
        return BrowserActions.getText(this.paginationRange);
    }

    async clickOnNextPage() {
        await browser.executeScript(`document.querySelector('button[class*="adf-pagination__next-button"]').click();`);
    }

    async clickOnPageDropdown() {
        return BrowserActions.click(this.pageDropDown);
    }

    async clickOnPageDropdownOption(numberOfItemPerPage: string) {
        await BrowserVisibility.waitUntilElementIsVisible(element.all(this.pageDropDownOptions).first());
        const option = element(by.cssContainingText('div[class*="mat-menu-content"] button', numberOfItemPerPage));
        await BrowserActions.click(option);
        return this;
    }

    async getPageDropdownOptions() {
        const deferred = protractor.promise.defer();
        await BrowserVisibility.waitUntilElementIsVisible(element.all(this.pageDropDownOptions).first());
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

    async checkNextPageButtonIsDisabled() {
        await BrowserVisibility.waitUntilElementIsVisible(this.nextButtonDisabled);
    }

    async checkPreviousPageButtonIsDisabled() {
        await BrowserVisibility.waitUntilElementIsVisible(this.previousButtonDisabled);
    }

    async checkNextPageButtonIsEnabled() {
        await BrowserVisibility.waitUntilElementIsNotOnPage(this.nextButtonDisabled);
    }

    async checkPreviousPageButtonIsEnabled() {
        await BrowserVisibility.waitUntilElementIsNotOnPage(this.previousButtonDisabled);
    }

    async getTotalNumberOfFiles() {
        await BrowserVisibility.waitUntilElementIsVisible(this.totalFiles);
        const numberOfFiles = this.totalFiles.getText().then(function (totalNumber) {
            const totalNumberOfFiles = totalNumber.split('of ')[1];
            return totalNumberOfFiles;
        });

        return numberOfFiles;
    }
}
