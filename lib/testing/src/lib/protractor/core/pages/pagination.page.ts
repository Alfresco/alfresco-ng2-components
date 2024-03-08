/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { by, element, browser, $, $$ } from 'protractor';
import { BrowserVisibility } from '../utils/browser-visibility';
import { BrowserActions } from '../utils/browser-actions';
import { Logger } from '../utils/logger';

export class PaginationPage {

    pageSelectorDropDown = $('div[class*="adf-pagination__page-selector"]');
    pageSelectorArrow = $('button[data-automation-id="page-selector"]');
    itemsPerPage = $('.adf-pagination__max-items');
    itemsPerPageOpenDropdown = $('.adf-pagination__perpage-block button');
    itemsPerPageOptions = $$('.adf-pagination__page-selector .mat-menu-item');
    currentPage = $('.adf-pagination__current-page');
    totalPages = $('.adf-pagination__total-pages');
    paginationRange = $('.adf-pagination__range');
    nextPageButton = $('button[class*="adf-pagination__next-button"]');
    nextButtonDisabled = $('button[class*="adf-pagination__next-button"][disabled]');
    previousButtonDisabled = $('button[class*="adf-pagination__previous-button"][disabled]');
    pageDropDown = $('div[class*="adf-pagination__actualinfo-block"] button');
    pageDropDownOptions = $$('div[class*="mat-menu-content"] button');
    paginationSection = $('adf-pagination');
    paginationSectionEmpty = $('adf-pagination[class*="adf-pagination__empty"]');
    totalFiles = $('.adf-pagination__range');

    async selectItemsPerPage(numberOfItem: string): Promise<void> {
        await BrowserActions.clickExecuteScript(`div[class*="adf-pagination__perpage-block"] button`);
        await BrowserVisibility.waitUntilElementIsVisible(this.pageSelectorDropDown);
        const itemsPerPage = element.all(by.cssContainingText('.mat-menu-item', numberOfItem)).first();
        await BrowserVisibility.waitUntilElementIsPresent(itemsPerPage);
        await BrowserActions.click(itemsPerPage);
        await BrowserVisibility.waitUntilElementIsNotVisible(this.pageSelectorDropDown);
        Logger.log('Select page size ', numberOfItem);
        await browser.sleep(500);
    }

    async checkPageSelectorIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.pageSelectorArrow);
    }

    async checkPageSelectorIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.pageSelectorArrow);
    }

    async clickItemsPerPageDropdown(): Promise<void> {
        await BrowserActions.clickScript(this.itemsPerPageOpenDropdown);
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
        Logger.log('Next page');
        return BrowserActions.click(this.nextPageButton);
    }

    async clickOnPageDropdown(): Promise<void> {
        await BrowserActions.click(this.pageDropDown);
        Logger.log('Click page dropdown');
    }

    async clickOnPageDropdownOption(numberOfItemPerPage: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.pageDropDownOptions.first());
        const option = element(by.cssContainingText('div[class*="mat-menu-content"] button', numberOfItemPerPage));
        await BrowserActions.click(option);
    }

    async getPageDropdownOptions() {
        await BrowserVisibility.waitUntilElementIsVisible(this.pageDropDownOptions.first());
        const initialList = [];
        await this.pageDropDownOptions.each(async (currentOption) => {
            const text = await BrowserActions.getText(currentOption);
            if (text !== '') {
                initialList.push(text);
            }
        });
        return initialList;
    }

    async getItemsPerPageDropdownOptions() {
        await BrowserVisibility.waitUntilElementIsVisible(this.itemsPerPageOptions.first());
        const initialList = [];
        await this.itemsPerPageOptions.each(async (currentOption) => {
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
