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
    showMoreButton = element(by.css('adf-search-radio button[title="Show more"]'));
    showLessButton = element(by.css('adf-search-radio button[title="Show less"]'));

    constructor(filter) {
        this.filter = filter;
    }

    checkFilterRadioButtonIsDisplayed(filterName) {
        let filterType = element(by.css('mat-radio-button[data-automation-id="search-radio-' + filterName + '"]'));
        return Util.waitUntilElementIsVisible(filterType);
    }

    checkFilterRadioButtonIsChecked(filterName) {
        let selectedFilterType = element(by.css('mat-radio-button[data-automation-id="search-radio-' + filterName + '"][class*="checked"]'));
        return Util.waitUntilElementIsVisible(selectedFilterType);
    }

    clickFilterRadioButton(filterName) {
        browser.executeScript(`document.querySelector('[data-automation-id="search-radio-${filterName}"] input').click();`);
    }

    getRadioButtonsNumberOnPage() {
        let radioButtons = element.all(by.css('mat-radio-button'));
        return radioButtons.count();
    }

    checkShowMoreButtonIsDisplayed() {
        return Util.waitUntilElementIsVisible(this.showMoreButton);
    }

    checkShowLessButtonIsDisplayed() {
        return Util.waitUntilElementIsVisible(this.showLessButton);
    }

    checkShowMoreButtonIsNotDisplayed() {
        return Util.waitUntilElementIsNotVisible(this.showMoreButton);
    }

    checkShowLessButtonIsNotDisplayed() {
        return Util.waitUntilElementIsNotVisible(this.showLessButton);
    }

    clickShowMoreButton() {
        Util.waitUntilElementIsVisible(this.showMoreButton);
        return this.showMoreButton.click();
    }

    clickShowLessButton() {
        Util.waitUntilElementIsVisible(this.showLessButton);
        return this.showLessButton.click();
    }

}
