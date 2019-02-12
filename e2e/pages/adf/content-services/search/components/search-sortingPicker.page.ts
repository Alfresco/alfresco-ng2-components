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
import { Util } from '../../../../../util/util';

export class SearchSortingPickerPage {

    sortingSelector = element(by.css('adf-sorting-picker div[class="mat-select-arrow"]'));
    orderArrow = element(by.css('adf-sorting-picker button mat-icon'));
    optionsDropdown = element(by.css('div[class*="mat-select-panel"]'));

    sortBy(sortOrder, sortType) {
        Util.waitUntilElementIsClickable(this.sortingSelector);
        this.sortingSelector.click();

        let selectedSortingOption = element(by.cssContainingText('span[class="mat-option-text"]', sortType));
        Util.waitUntilElementIsClickable(selectedSortingOption);
        selectedSortingOption.click();

        this.sortByOrder(sortOrder);
    }

    sortByOrder(sortOrder) {
        Util.waitUntilElementIsVisible(this.orderArrow);
        this.orderArrow.getText().then((result) => {
            if (sortOrder === true) {
                if (result !== 'arrow_upward') {
                    browser.executeScript(`document.querySelector('adf-sorting-picker button mat-icon').click();`);
                }
            } else {
                if (result === 'arrow_upward') {
                    browser.executeScript(`document.querySelector('adf-sorting-picker button mat-icon').click();`);
                }
            }
        });
    }

    clickSortingOption(option) {
        let selectedSortingOption = element(by.cssContainingText('span[class="mat-option-text"]', option));
        Util.waitUntilElementIsClickable(selectedSortingOption);
        selectedSortingOption.click();
        return this;
    }

    clickSortingSelector() {
        Util.waitUntilElementIsClickable(this.sortingSelector);
        this.sortingSelector.click();
        return this;
    }

    checkOptionIsDisplayed(option) {
        let optionSelector = this.optionsDropdown.element(by.cssContainingText('span[class="mat-option-text"]', option));
        Util.waitUntilElementIsVisible(optionSelector);
        return this;
    }

    checkOptionIsNotDisplayed(option) {
        let optionSelector = this.optionsDropdown.element(by.cssContainingText('span[class="mat-option-text"]', option));
        Util.waitUntilElementIsNotVisible(optionSelector);
        return this;
    }

    checkOptionsDropdownIsDisplayed() {
        Util.waitUntilElementIsVisible(this.optionsDropdown);
        return this;
    }

    checkSortingSelectorIsDisplayed() {
        Util.waitUntilElementIsVisible(this.sortingSelector);
        return this;
    }

    checkOrderArrowIsDownward() {
        let deferred = protractor.promise.defer();
        Util.waitUntilElementIsVisible(this.orderArrow);
        this.orderArrow.getText().then((result) => {
            deferred.fulfill(result !== 'arrow_upward');
        });
        return deferred.promise;
    }

    checkOrderArrowIsDisplayed() {
        Util.waitUntilElementIsVisible(this.orderArrow);
        return this;
    }

}
