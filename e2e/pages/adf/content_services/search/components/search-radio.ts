/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import Util = require('../../../../../util/util');
import { element, by, browser } from 'protractor';

export class SearchRadioPage {

    filter;
    showMoreButtonForType = element(by.css('adf-search-radio button[title="Show more"]'));
    showLessButtonForType = element(by.css('adf-search-radio button[title="Show less"]'));

    constructor(filter) {
        this.filter = filter;
    }

    checkFilterTypeRadioButtonIsDisplayed(filterName) {
        let filterType = element(by.css('mat-radio-button[data-automation-id="search-radio-' + filterName + '"]'));
        return Util.waitUntilElementIsVisible(filterType);
    }

    checkFilterTypeRadioButtonIsChecked(filterName) {
        let selectedFilterType = element(by.css('mat-radio-button[data-automation-id="search-radio-' + filterName + '"][class*="checked"]'));
        return Util.waitUntilElementIsVisible(selectedFilterType);
    }

    clickFilterTypeRadioButton(filterName) {
        browser.executeScript(`document.querySelector('[data-automation-id="search-radio-${filterName}"] input').click();`);
    }

    checkRadioButtonsNumberOnPage() {
        let radioButtons = element.all(by.css('mat-radio-button'));
        return radioButtons.count();
    }

    checkShowMoreButtonForTypeIsDisplayed() {
        return Util.waitUntilElementIsVisible(this.showMoreButtonForType);
    }

    checkShowLessButtonForTypeIsDisplayed() {
        return Util.waitUntilElementIsVisible(this.showLessButtonForType);
    }

    checkShowMoreButtonForTypeIsNotDisplayed() {
        return Util.waitUntilElementIsNotVisible(this.showMoreButtonForType);
    }

    checkShowLessButtonForTypeIsNotDisplayed() {
        return Util.waitUntilElementIsNotVisible(this.showLessButtonForType);
    }

    clickShowMoreButton() {
        Util.waitUntilElementIsVisible(this.showMoreButtonForType);
        return this.showMoreButtonForType.click();
    }

    clickShowLessButton() {
        Util.waitUntilElementIsVisible(this.showLessButtonForType);
        return this.showLessButtonForType.click();
    }

}
