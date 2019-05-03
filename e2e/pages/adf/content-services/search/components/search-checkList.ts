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
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class SearchCheckListPage {

    filter: ElementFinder;
    inputBy = by.css('div[class*="mat-expansion-panel-content"] input');
    showMoreBy = by.css('button[title="Show more"]');
    showLessBy = by.css('button[title="Show less"]');
    clearAllButton = by.css('button');

    constructor(filter: ElementFinder) {
        this.filter = filter;
    }

    clickCheckListOption(option) {
        BrowserVisibility.waitUntilElementIsVisible(this.filter);
        const result = this.filter.all(by.css(`mat-checkbox[data-automation-id*='${option}'] .mat-checkbox-inner-container`)).first();
        BrowserActions.click(result);
    }

    checkChipIsDisplayed(option) {
        BrowserVisibility.waitUntilElementIsVisible(element(by.cssContainingText('mat-chip', option)).element(by.css('mat-icon')));
        return this;
    }

    checkChipIsNotDisplayed(option) {
        BrowserVisibility.waitUntilElementIsNotOnPage(element(by.cssContainingText('mat-chip', option)).element(by.css('mat-icon')));
        return this;
    }

    removeFilterOption(option) {
        const cancelChipButton = element(by.cssContainingText('mat-chip', option)).element(by.css('mat-icon'));
        BrowserActions.click(cancelChipButton);
        return this;
    }

    filterBy(option) {
        this.checkSearchFilterInputIsDisplayed();
        this.searchInFilter(option);
        this.clickCheckListOption(option);
        return this;
    }

    checkSearchFilterInputIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.filter.all(this.inputBy).first());
        return this;
    }

    searchInFilter(option) {
        BrowserVisibility.waitUntilElementIsClickable(this.filter);
        const inputElement = this.filter.all(this.inputBy).first();
        BrowserVisibility.waitUntilElementIsClickable(inputElement);

        inputElement.clear();
        this.filter.all(this.inputBy).first().sendKeys(option);
        return this;
    }

    checkShowLessButtonIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.filter.element(this.showLessBy));
        return this;
    }

    checkShowLessButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.showLessBy));
        return this;
    }

    checkShowMoreButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.showMoreBy));
        return this;
    }

    checkShowMoreButtonIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.filter.element(this.showMoreBy));
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

    getBucketNumberOfFilterType(option) {
        const fileTypeFilter = this.filter.all(by.css('mat-checkbox[data-automation-id*=".' + option + '"] span')).first();
        BrowserVisibility.waitUntilElementIsVisible(fileTypeFilter);
        const bucketNumber = fileTypeFilter.getText().then((valueOfBucket) => {
            const numberOfBucket = valueOfBucket.split('(')[1];
            const totalNumberOfBucket = numberOfBucket.split(')')[0];
            return totalNumberOfBucket.trim();
        });

        return bucketNumber;
    }

    checkCheckListOptionIsDisplayed(option) {
        BrowserVisibility.waitUntilElementIsVisible(this.filter);
        const result = this.filter.element(by.css(`mat-checkbox[data-automation-id*='-${option}']`));
        return BrowserVisibility.waitUntilElementIsVisible(result);
    }

    checkCheckListOptionIsNotSelected(option) {
        BrowserVisibility.waitUntilElementIsVisible(this.filter);
        const result = this.filter.element(by.css(`mat-checkbox[data-automation-id*='-${option}'][class*='checked']`));
        return BrowserVisibility.waitUntilElementIsNotVisible(result);
    }

    checkCheckListOptionIsSelected(option) {
        BrowserVisibility.waitUntilElementIsVisible(this.filter);
        const result = this.filter.element(by.css(`mat-checkbox[data-automation-id*='-${option}'][class*='checked']`));
        return BrowserVisibility.waitUntilElementIsVisible(result);
    }

    checkClearAllButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.filter);
        const result = this.filter.element(this.clearAllButton);
        return BrowserVisibility.waitUntilElementIsVisible(result);
    }

    clickClearAllButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.filter);
        const result = this.filter.element(this.clearAllButton);
        BrowserVisibility.waitUntilElementIsVisible(result);
        return BrowserActions.click(result);

    }

    getCheckListOptionsNumberOnPage() {
        BrowserVisibility.waitUntilElementIsVisible(this.filter);
        const checkListOptions = this.filter.all(by.css('div[class="checklist"] mat-checkbox'));
        return checkListOptions.count();
    }

    clickShowMoreButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.showMoreBy));
        return this.filter.element(this.showMoreBy).click();
    }

    clickShowLessButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.showLessBy));
        return this.filter.element(this.showLessBy).click();
    }

}
