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

import { $, browser, by, element } from 'protractor';
import { BrowserActions } from '../../../core/utils/browser-actions';
import { BrowserVisibility } from '../../../core/utils/browser-visibility';
import { DropdownPage } from '../../../core/pages/material/dropdown.page';

export class SearchSortingPickerPage {

    sortingDropdown = new DropdownPage($('.adf-sorting-picker .mat-select-arrow'));
    orderArrow = $('adf-sorting-picker button mat-icon');

    async sortBy(sortOrder: string, sortType: string | RegExp): Promise<void> {
        await this.sortingDropdown.clickDropdown();
        const selectedSortingOption = element(by.cssContainingText('.mat-option-text', sortType));
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

    async clickSortingOption(option: string): Promise<void> {
        const selectedSortingOption = element(by.cssContainingText('.mat-option-text', option));
        await BrowserActions.click(selectedSortingOption);
    }

    async checkOptionIsDisplayed(option: string): Promise<void> {
        await this.sortingDropdown.checkOptionIsDisplayed(option);
    }

    async checkOptionIsNotDisplayed(option: string): Promise<void> {
        await this.sortingDropdown.checkOptionIsNotDisplayed(option);
    }

    async checkOptionsDropdownIsDisplayed(): Promise<void> {
        await this.sortingDropdown.checkOptionsPanelIsDisplayed();
    }

    async checkSortingDropdownIsDisplayed(): Promise<void> {
        await this.sortingDropdown.checkDropdownIsVisible();
    }

    async clickSortingDropdown(): Promise<void> {
        await this.sortingDropdown.clickDropdown();
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
