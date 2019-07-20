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

import { element, by, ElementFinder } from 'protractor';
import { BrowserActions } from '../../../core/utils/browser-actions';
import { BrowserVisibility } from '../../../core/utils/browser-visibility';

export class SearchCheckListPage {

    filter: ElementFinder;
    inputBy = by.css('div[class*="mat-expansion-panel-content"] input');
    showMoreBy = by.css('button[title="Show more"]');
    showLessBy = by.css('button[title="Show less"]');
    clearAllButton = by.css('button');

    constructor(filter: ElementFinder) {
        this.filter = filter;
    }

    clickCheckListOption(option: string) {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
        const result = this.filter.all(by.css(`mat-checkbox[data-automation-id*='${option}'] .mat-checkbox-inner-container`)).first();
        BrowserActions.click(result);
    }

    checkChipIsDisplayed(option: string) {
        await BrowserVisibility.waitUntilElementIsVisible(element(by.cssContainingText('mat-chip', option)).element(by.css('mat-icon')));
        return this;
    }

    checkChipIsNotDisplayed(option: string) {
        await BrowserVisibility.waitUntilElementIsNotOnPage(element(by.cssContainingText('mat-chip', option)).element(by.css('mat-icon')));
        return this;
    }

    removeFilterOption(option: string) {
        const cancelChipButton = element(by.cssContainingText('mat-chip', option)).element(by.css('mat-icon'));
        BrowserActions.click(cancelChipButton);
        return this;
    }

    filterBy(option: string) {
        this.checkSearchFilterInputIsDisplayed();
        this.searchInFilter(option);
        this.clickCheckListOption(option);
        return this;
    }

    checkSearchFilterInputIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.all(this.inputBy).first());
        return this;
    }

    searchInFilter(option: string) {
        await BrowserVisibility.waitUntilElementIsClickable(this.filter);
        const inputElement = this.filter.all(this.inputBy).first();
        await BrowserVisibility.waitUntilElementIsClickable(inputElement);

        inputElement.clear();
        this.filter.all(this.inputBy).first().sendKeys(option);
        return this;
    }

    checkShowLessButtonIsNotDisplayed() {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.filter.element(this.showLessBy));
        return this;
    }

    checkShowLessButtonIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.showLessBy));
        return this;
    }

    checkShowMoreButtonIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.showMoreBy));
        return this;
    }

    checkShowMoreButtonIsNotDisplayed() {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.filter.element(this.showMoreBy));
        return this;
    }

    clickShowMoreButtonUntilIsNotDisplayed() {
        this.filter.element(this.showMoreBy).isDisplayed().then(async (visible) => {
            if (visible) {
                this.filter.element(this.showMoreBy).click();

                this.clickShowMoreButtonUntilIsNotDisplayed();
            }
        }, () => {
        });
        return this;
    }

    clickShowLessButtonUntilIsNotDisplayed() {
        this.filter.element(this.showLessBy).isDisplayed().then(async (visible) => {
            if (visible) {
                this.filter.element(this.showLessBy).click();

                this.clickShowLessButtonUntilIsNotDisplayed();
            }
        }, () => {
        });
        return this;
    }

    getBucketNumberOfFilterType(option: string) {
        const fileTypeFilter = this.filter.all(by.css('mat-checkbox[data-automation-id*=".' + option + '"] span')).first();
        await BrowserVisibility.waitUntilElementIsVisible(fileTypeFilter);
        const bucketNumber = fileTypeFilter.getText().then((valueOfBucket) => {
            const numberOfBucket = valueOfBucket.split('(')[1];
            const totalNumberOfBucket = numberOfBucket.split(')')[0];
            return totalNumberOfBucket.trim();
        });

        return bucketNumber;
    }

    checkCheckListOptionIsDisplayed(option: string) {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
        const result = this.filter.element(by.css(`mat-checkbox[data-automation-id*='-${option}']`));
        return await BrowserVisibility.waitUntilElementIsVisible(result);
    }

    checkCheckListOptionIsNotSelected(option: string) {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
        const result = this.filter.element(by.css(`mat-checkbox[data-automation-id*='-${option}'][class*='checked']`));
        return await BrowserVisibility.waitUntilElementIsNotVisible(result);
    }

    checkCheckListOptionIsSelected(option: string) {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
        const result = this.filter.element(by.css(`mat-checkbox[data-automation-id*='-${option}'][class*='checked']`));
        return await BrowserVisibility.waitUntilElementIsVisible(result);
    }

    checkClearAllButtonIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
        const result = this.filter.element(this.clearAllButton);
        return await BrowserVisibility.waitUntilElementIsVisible(result);
    }

    clickClearAllButton() {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
        const result = this.filter.element(this.clearAllButton);
        await BrowserVisibility.waitUntilElementIsVisible(result);
        return BrowserActions.click(result);

    }

    getCheckListOptionsNumberOnPage() {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
        const checkListOptions = this.filter.all(by.css('div[class="checklist"] mat-checkbox'));
        return checkListOptions.count();
    }

    clickShowMoreButton() {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.showMoreBy));
        return this.filter.element(this.showMoreBy).click();
    }

    clickShowLessButton() {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.showLessBy));
        return this.filter.element(this.showLessBy).click();
    }

}
