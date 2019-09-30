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
import { BrowserActions } from '../../../core/utils/browser-actions';
import { BrowserVisibility } from '../../../core/utils/browser-visibility';
import { ElementFinder } from 'protractor';

export class SearchRadioPage {

    filter: ElementFinder;
    showMoreButton: ElementFinder = element(by.css('adf-search-radio button[title="Show more"]'));
    showLessButton: ElementFinder = element(by.css('adf-search-radio button[title="Show less"]'));

    constructor(filter: ElementFinder) {
        this.filter = filter;
    }

    async checkFilterRadioButtonIsDisplayed(filterName: string): Promise<void> {
        const filterType = element(by.css('mat-radio-button[data-automation-id="search-radio-' + filterName + '"]'));
        await BrowserVisibility.waitUntilElementIsVisible(filterType);
    }

    async checkFilterRadioButtonIsChecked(filterName: string): Promise<void> {
        const selectedFilterType = element(by.css('mat-radio-button[data-automation-id="search-radio-' + filterName + '"][class*="checked"]'));
        await BrowserVisibility.waitUntilElementIsVisible(selectedFilterType);
    }

    async clickFilterRadioButton(filterName: string): Promise<void> {
        await browser.executeScript(`document.querySelector('[data-automation-id="search-radio-${filterName}"] input').click();`);
    }

    async getRadioButtonsNumberOnPage(): Promise<number> {
        const radioButtons = element.all(by.css('mat-radio-button'));
        return radioButtons.count();
    }

    async checkShowMoreButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.showMoreButton);
    }

    async checkShowLessButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.showLessButton);
    }

    async checkShowMoreButtonIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.showMoreButton);
    }

    async checkShowLessButtonIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.showLessButton);
    }

    async clickShowMoreButton(): Promise<void> {
        await BrowserActions.click(this.showMoreButton);
    }

    async clickShowLessButton(): Promise<void> {
        await BrowserActions.click(this.showLessButton);
    }

}
