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

import { element, by, browser } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class SearchRadioPage {

    filter;
    showMoreButton = element(by.css('adf-search-radio button[title="Show more"]'));
    showLessButton = element(by.css('adf-search-radio button[title="Show less"]'));

    constructor(filter) {
        this.filter = filter;
    }

    checkFilterRadioButtonIsDisplayed(filterName) {
        const filterType = element(by.css('mat-radio-button[data-automation-id="search-radio-' + filterName + '"]'));
        return BrowserVisibility.waitUntilElementIsVisible(filterType);
    }

    checkFilterRadioButtonIsChecked(filterName) {
        const selectedFilterType = element(by.css('mat-radio-button[data-automation-id="search-radio-' + filterName + '"][class*="checked"]'));
        return BrowserVisibility.waitUntilElementIsVisible(selectedFilterType);
    }

    clickFilterRadioButton(filterName) {
        browser.executeScript(`document.querySelector('[data-automation-id="search-radio-${filterName}"] input').click();`);
    }

    getRadioButtonsNumberOnPage() {
        const radioButtons = element.all(by.css('mat-radio-button'));
        return radioButtons.count();
    }

    checkShowMoreButtonIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.showMoreButton);
    }

    checkShowLessButtonIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.showLessButton);
    }

    checkShowMoreButtonIsNotDisplayed() {
        return BrowserVisibility.waitUntilElementIsNotVisible(this.showMoreButton);
    }

    checkShowLessButtonIsNotDisplayed() {
        return BrowserVisibility.waitUntilElementIsNotVisible(this.showLessButton);
    }

    clickShowMoreButton() {
        return BrowserActions.click(this.showMoreButton);
    }

    clickShowLessButton() {
        return BrowserActions.click(this.showLessButton);
    }

}
