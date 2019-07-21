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
import { BrowserActions } from '../../../core/utils/browser-actions';
import { BrowserVisibility } from '../../../core/utils/browser-visibility';

export class SearchSortingPickerPage {

    sortingSelector = element(by.css('adf-sorting-picker div[class="mat-select-arrow"]'));
    orderArrow = element(by.css('adf-sorting-picker button mat-icon'));
    optionsDropdown = element(by.css('div[class*="mat-select-panel"]'));

    async sortBy(sortOrder: string, sortType: string | RegExp) {
        await BrowserActions.click(this.sortingSelector);
        const selectedSortingOption = element(by.cssContainingText('span[class="mat-option-text"]', sortType));
        await BrowserActions.click(selectedSortingOption);

        this.sortByOrder(sortOrder);
    }

    /**
     *  Sort the list by name column.
     *
     * @param sortOrder : 'ASC' to sort the list ascendant and 'DESC' for descendant
     */
    async sortByOrder(sortOrder: string) {
        await BrowserVisibility.waitUntilElementIsVisible(this.orderArrow);
        this.orderArrow.getText().then(async (result) => {
            if (sortOrder.toLocaleLowerCase() === 'asc') {
                if (result !== 'arrow_upward') {
                    await browser.executeScript(`document.querySelector('adf-sorting-picker button mat-icon').click();`);
                }
            } else {
                if (result === 'arrow_upward') {
                    await browser.executeScript(`document.querySelector('adf-sorting-picker button mat-icon').click();`);
                }
            }
        });
    }

    async clickSortingOption(option) {
        const selectedSortingOption = element(by.cssContainingText('span[class="mat-option-text"]', option));
        await BrowserActions.click(selectedSortingOption);
        return this;
    }

    async clickSortingSelector() {
        await BrowserActions.click(this.sortingSelector);
        return this;
    }

    async checkOptionIsDisplayed(option) {
        const optionSelector = this.optionsDropdown.element(by.cssContainingText('span[class="mat-option-text"]', option));
        await BrowserVisibility.waitUntilElementIsVisible(optionSelector);
        return this;
    }

    async checkOptionIsNotDisplayed(option) {
        const optionSelector = this.optionsDropdown.element(by.cssContainingText('span[class="mat-option-text"]', option));
        await BrowserVisibility.waitUntilElementIsNotVisible(optionSelector);
        return this;
    }

    async checkOptionsDropdownIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.optionsDropdown);
        return this;
    }

    async checkSortingSelectorIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.sortingSelector);
        return this;
    }

    async checkOrderArrowIsDownward() {
        const deferred = protractor.promise.defer();
        await BrowserVisibility.waitUntilElementIsVisible(this.orderArrow);
        this.orderArrow.getText().then((result) => {
            deferred.fulfill(result !== 'arrow_upward');
        });
        return deferred.promise;
    }

    async checkOrderArrowIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.orderArrow);
        return this;
    }

}
