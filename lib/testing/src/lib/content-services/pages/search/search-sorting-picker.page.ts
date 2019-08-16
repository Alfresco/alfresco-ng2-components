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

import { browser, by, element, ElementFinder } from 'protractor';
import { BrowserActions } from '../../../core/utils/browser-actions';
import { BrowserVisibility } from '../../../core/utils/browser-visibility';

export class SearchSortingPickerPage {

    sortingSelector: ElementFinder = element(by.css('adf-sorting-picker div[class="mat-select-arrow"]'));
    orderArrow: ElementFinder = element(by.css('adf-sorting-picker button mat-icon'));
    optionsDropdown: ElementFinder = element(by.css('div .mat-select-panel'));

    async sortBy(sortOrder: string, sortType: string | RegExp): Promise<void> {
        await BrowserActions.click(this.sortingSelector);
        const selectedSortingOption = element(by.cssContainingText('span[class="mat-option-text"]', sortType));
        await BrowserActions.click(selectedSortingOption);
        await this.sortByOrder(sortOrder);
    }

    /**
     *  Sort the list by name column.
     *
     * @param sortOrder : 'ASC' to sort the list ascendant and 'DESC' for descendant
     */
    async sortByOrder(sortOrder: string): Promise<any> {
        await BrowserVisibility.waitUntilElementIsVisible(this.orderArrow);

        const result = await BrowserActions.getText(this.orderArrow);
        if (sortOrder.toLocaleLowerCase() === 'asc') {
            if (result !== 'arrow_upward') {
                await browser.executeScript(`document.querySelector('adf-sorting-picker button mat-icon').click();`);
            }
        } else {
            if (result === 'arrow_upward') {
                await browser.executeScript(`document.querySelector('adf-sorting-picker button mat-icon').click();`);
            }
        }
    }

    async clickSortingOption(option): Promise<void> {
        const selectedSortingOption = element(by.cssContainingText('span[class="mat-option-text"]', option));
        await BrowserActions.click(selectedSortingOption);
    }

    async clickSortingSelector(): Promise<void> {
        await BrowserActions.click(this.sortingSelector);
    }

    async checkOptionIsDisplayed(option): Promise<void> {
        const optionSelector = this.optionsDropdown.element(by.cssContainingText('span[class="mat-option-text"]', option));
        await BrowserVisibility.waitUntilElementIsVisible(optionSelector);
    }

    async checkOptionIsNotDisplayed(option): Promise<void> {
        const optionSelector = this.optionsDropdown.element(by.cssContainingText('span[class="mat-option-text"]', option));
        await BrowserVisibility.waitUntilElementIsNotVisible(optionSelector);
    }

    async checkOptionsDropdownIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.optionsDropdown);
    }

    async checkSortingSelectorIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.sortingSelector);
    }

    async checkOrderArrowIsDownward(): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsVisible(this.orderArrow);

        const result = await BrowserActions.getText(this.orderArrow);
        return result !== 'arrow_upward';
    }

    async checkOrderArrowIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.orderArrow);
    }

}
