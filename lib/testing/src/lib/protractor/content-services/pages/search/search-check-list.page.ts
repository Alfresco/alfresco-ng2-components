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

import { element, by, ElementFinder, browser } from 'protractor';
import { BrowserActions } from '../../../core/utils/browser-actions';
import { BrowserVisibility } from '../../../core/utils/browser-visibility';

export class SearchCheckListPage {

    filter: ElementFinder;
    inputBy = 'div[class*="mat-expansion-panel-content"] input';
    showMoreBy = 'button[title="Show more"]';
    showLessBy = 'button[title="Show less"]';
    clearAllButton = 'button';

    constructor(filter: ElementFinder) {
        this.filter = filter;
    }

    async clickCheckListOption(option: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
        const result = this.filter.$$(`mat-checkbox[data-automation-id*='${option}'] .mat-checkbox-inner-container`).first();
        await BrowserActions.click(result);
    }

    async checkChipIsDisplayed(option: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element(by.cssContainingText('mat-chip', option)).$('mat-icon'));
    }

    async checkChipIsNotDisplayed(option: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(element(by.cssContainingText('mat-chip', option)).$('mat-icon'));
    }

    async removeFilterOption(option: string): Promise<void> {
        const cancelChipButton = element(by.cssContainingText('mat-chip', option)).$('mat-icon');
        await BrowserActions.click(cancelChipButton);
    }

    async filterBy(option: string): Promise<SearchCheckListPage> {
        await this.checkSearchFilterInputIsDisplayed();
        await this.searchInFilter(option);
        await this.clickCheckListOption(option);

        return this;
    }

    async checkSearchFilterInputIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.$$(this.inputBy).first());
    }

    async searchInFilter(option: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsClickable(this.filter);
        const inputElement = this.filter.$$(this.inputBy).first();
        await BrowserVisibility.waitUntilElementIsClickable(inputElement);
        await BrowserActions.clearSendKeys(inputElement, option);
    }

    async checkShowLessButtonIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.filter.$(this.showLessBy));
    }

    async checkShowLessButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.$(this.showLessBy));
    }

    async checkShowMoreButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.$(this.showMoreBy));
    }

    async checkShowMoreButtonIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.filter.$(this.showMoreBy));
    }

    async clickShowMoreButtonUntilIsNotDisplayed(): Promise<void> {
        const visible = await browser.isElementPresent(this.filter.$(this.showMoreBy));
        if (visible) {
            await BrowserActions.click(this.filter.$(this.showMoreBy));
            await this.clickShowMoreButtonUntilIsNotDisplayed();
        }
    }

    async clickShowLessButtonUntilIsNotDisplayed(): Promise<void> {
        const visible = await browser.isElementPresent(this.filter.$(this.showLessBy));
        if (visible) {
            await BrowserActions.click(this.filter.$(this.showLessBy));
            await this.clickShowLessButtonUntilIsNotDisplayed();
        }
    }

    async getBucketNumberOfFilterType(option: string): Promise<any> {
        const fileTypeFilter = this.filter.$$('mat-checkbox[data-automation-id*=".' + option + '"] div').first();
        await BrowserVisibility.waitUntilElementIsVisible(fileTypeFilter);
        const valueOfBucket = await BrowserActions.getText(fileTypeFilter);
        const numberOfBucket = valueOfBucket.split('(')[1];
        const totalNumberOfBucket = numberOfBucket.split(')')[0];
        return totalNumberOfBucket.trim();
    }

    async checkCheckListOptionIsDisplayed(option: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
        const result = this.filter.$(`mat-checkbox[data-automation-id*='-${option}']`);
        await BrowserVisibility.waitUntilElementIsVisible(result);
    }

    async checkCheckListOptionIsNotSelected(option: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
        const result = this.filter.$(`mat-checkbox[data-automation-id*='-${option}'][class*='checked']`);
        await BrowserVisibility.waitUntilElementIsNotVisible(result);
    }

    async checkCheckListOptionIsSelected(option: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
        const result = this.filter.$(`mat-checkbox[data-automation-id*='-${option}'][class*='checked']`);
        await BrowserVisibility.waitUntilElementIsVisible(result);
    }

    async checkClearAllButtonIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
        const result = this.filter.$(this.clearAllButton);
        await BrowserVisibility.waitUntilElementIsVisible(result);
    }

    async clickClearAllButton(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
        const result = this.filter.$(this.clearAllButton);
        await BrowserActions.click(result);

    }

    async getCheckListOptionsNumberOnPage(): Promise<number> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
        const checkListOptions = this.filter.$$('.checklist mat-checkbox');
        return checkListOptions.count();
    }

    async clickShowMoreButton(): Promise<void> {
        await BrowserActions.click(this.filter.$(this.showMoreBy));
    }

    async clickShowLessButton(): Promise<void> {
        await BrowserActions.click(this.filter.$(this.showLessBy));
    }

}
