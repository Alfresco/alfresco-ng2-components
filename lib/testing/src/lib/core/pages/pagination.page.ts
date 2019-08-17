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

import { browser, by, element, Locator } from 'protractor';
import { BrowserVisibility } from '../utils/browser-visibility';
import { BrowserActions } from '../utils/browser-actions';
import { ElementFinder } from 'protractor';

export class PaginationPage {

    pageSelectorDropDown: ElementFinder = element(by.css('div[class*="adf-pagination__page-selector"]'));
    pageSelectorArrow: ElementFinder = element(by.css('button[data-automation-id="page-selector"]'));
    itemsPerPage: ElementFinder = element(by.css('span[class="adf-pagination__max-items"]'));
    currentPage: ElementFinder = element(by.css('span[class="adf-pagination__current-page"]'));
    totalPages: ElementFinder = element(by.css('span[class="adf-pagination__total-pages"]'));
    paginationRange: ElementFinder = element(by.css('span[class="adf-pagination__range"]'));
    nextPageButton: ElementFinder = element(by.css('button[class*="adf-pagination__next-button"]'));
    nextButtonDisabled: ElementFinder = element(by.css('button[class*="adf-pagination__next-button"][disabled]'));
    previousButtonDisabled: ElementFinder = element(by.css('button[class*="adf-pagination__previous-button"][disabled]'));
    pageDropDown: ElementFinder = element(by.css('div[class*="adf-pagination__actualinfo-block"] button'));
    pageDropDownOptions: Locator = by.css('div[class*="mat-menu-content"] button');
    paginationSection: ElementFinder = element(by.css('adf-pagination'));
    paginationSectionEmpty: ElementFinder = element(by.css('adf-pagination[class*="adf-pagination__empty"]'));
    totalFiles: ElementFinder = element(by.css('span[class="adf-pagination__range"]'));

    async selectItemsPerPage(numberOfItem: string): Promise<void> {
        await browser.executeScript(`document.querySelector('div[class*="adf-pagination__perpage-block"] button').click();`);
        await BrowserVisibility.waitUntilElementIsVisible(this.pageSelectorDropDown);
        const itemsPerPage = element.all(by.cssContainingText('.mat-menu-item', numberOfItem)).first();
        await BrowserActions.click(itemsPerPage);
        await BrowserVisibility.waitUntilElementIsNotVisible(this.pageSelectorDropDown);
    }

    async checkPageSelectorIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.pageSelectorArrow);
    }

    async checkPageSelectorIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.pageSelectorArrow);
    }

    async checkPaginationIsNotDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.paginationSectionEmpty);
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

    async clickOnNextPage(): Promise<void> {
        await browser.executeScript(`document.querySelector('button[class*="adf-pagination__next-button"]').click();`);
    }

    async clickOnPageDropdown(): Promise<void> {
        await BrowserActions.click(this.pageDropDown);
    }

    async clickOnPageDropdownOption(numberOfItemPerPage: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element.all(this.pageDropDownOptions).first());
        const option = element(by.cssContainingText('div[class*="mat-menu-content"] button', numberOfItemPerPage));
        await BrowserActions.click(option);
    }

    async getPageDropdownOptions() {
        await BrowserVisibility.waitUntilElementIsVisible(element.all(this.pageDropDownOptions).first());
        const initialList = [];
        await element.all(this.pageDropDownOptions).each(async (currentOption) => {
            const text = await BrowserActions.getText(currentOption);
            if (text !== '') {
                initialList.push(text);
            }
        });
        return initialList;
    }

    async checkNextPageButtonIsDisabled(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.nextButtonDisabled);
    }

    async checkPreviousPageButtonIsDisabled(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.previousButtonDisabled);
    }

    async checkNextPageButtonIsEnabled(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.nextButtonDisabled);
    }

    async checkPreviousPageButtonIsEnabled(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.previousButtonDisabled);
    }

    async getTotalNumberOfFiles() {
        await BrowserVisibility.waitUntilElementIsVisible(this.totalFiles);
        const totalNumberOfFiles = await BrowserActions.getText(this.totalFiles);
        return totalNumberOfFiles.split('of ')[1];
    }
}
