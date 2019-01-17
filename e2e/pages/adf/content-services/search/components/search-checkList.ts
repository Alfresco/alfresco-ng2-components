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

import { Util } from '../../../../../util/util';
import { element, by, ElementFinder } from 'protractor';

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
        Util.waitUntilElementIsVisible(this.filter);
        let result = this.filter.all(by.css(`mat-checkbox[data-automation-id*='-${option}'] .mat-checkbox-inner-container`)).first();
        Util.waitUntilElementIsVisible(result);
        Util.waitUntilElementIsClickable(result);
        result.click();
    }

    checkChipIsDisplayed(option) {
        Util.waitUntilElementIsVisible(element(by.cssContainingText('mat-chip', option)).element(by.css('mat-icon')));
        return this;
    }

    checkChipIsNotDisplayed(option) {
        Util.waitUntilElementIsNotOnPage(element(by.cssContainingText('mat-chip', option)).element(by.css('mat-icon')));
        return this;
    }

    removeFilterOption(option) {
        let cancelChipButton = element(by.cssContainingText('mat-chip', option)).element(by.css('mat-icon'));
        Util.waitUntilElementIsClickable(cancelChipButton);
        cancelChipButton.click();
        return this;
    }

    filterBy(option) {
        this.checkSearchFilterInputIsDisplayed();
        this.searchInFilter(option);
        this.clickCheckListOption(option);
        return this;
    }

    checkSearchFilterInputIsDisplayed() {
        Util.waitUntilElementIsVisible(this.filter.all(this.inputBy).first());
        return this;
    }

    searchInFilter(option) {
        Util.waitUntilElementIsClickable(this.filter);
        let inputElement = this.filter.all(this.inputBy).first();
        Util.waitUntilElementIsClickable(inputElement);

        inputElement.clear();
        this.filter.all(this.inputBy).first().sendKeys(option);
        return this;
    }

    checkShowLessButtonIsNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.filter.element(this.showLessBy));
        return this;
    }

    checkShowLessButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.filter.element(this.showLessBy));
        return this;
    }

    checkShowMoreButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.filter.element(this.showMoreBy));
        return this;
    }

    checkShowMoreButtonIsNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.filter.element(this.showMoreBy));
        return this;
    }

    clickShowMoreButtonUntilIsNotDisplayed() {
        this.filter.element(this.showMoreBy).isDisplayed().then(async (visible) => {
            if (visible) {
                this.filter.element(this.showMoreBy).click();

                this.clickShowMoreButtonUntilIsNotDisplayed();
            }
        }, (err) => {
        });
        return this;
    }

    clickShowLessButtonUntilIsNotDisplayed() {
        this.filter.element(this.showLessBy).isDisplayed().then(async (visible) => {
            if (visible) {
                this.filter.element(this.showLessBy).click();

                this.clickShowLessButtonUntilIsNotDisplayed();
            }
        }, (err) => {
        });
        return this;
    }

    getBucketNumberOfFilterType(option) {
        let fileTypeFilter = this.filter.all(by.css('mat-checkbox[data-automation-id*=".' + option + '"] span')).first();
        Util.waitUntilElementIsVisible(fileTypeFilter);
        let bucketNumber = fileTypeFilter.getText().then((valueOfBucket) => {
            let numberOfBucket = valueOfBucket.split('(')[1];
            let totalNumberOfBucket = numberOfBucket.split(')')[0];
            return totalNumberOfBucket.trim();
        });

        return bucketNumber;
    }

    checkCheckListOptionIsDisplayed(option) {
        Util.waitUntilElementIsVisible(this.filter);
        let result = this.filter.element(by.css(`mat-checkbox[data-automation-id*='-${option}']`));
        return Util.waitUntilElementIsVisible(result);
    }

    checkCheckListOptionIsNotSelected(option) {
        Util.waitUntilElementIsVisible(this.filter);
        let result = this.filter.element(by.css(`mat-checkbox[data-automation-id*='-${option}'][class*='checked']`));
        return Util.waitUntilElementIsNotVisible(result);
    }

    checkCheckListOptionIsSelected(option) {
        Util.waitUntilElementIsVisible(this.filter);
        let result = this.filter.element(by.css(`mat-checkbox[data-automation-id*='-${option}'][class*='checked']`));
        return Util.waitUntilElementIsVisible(result);
    }

    checkClearAllButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.filter);
        let result = this.filter.element(this.clearAllButton);
        return Util.waitUntilElementIsVisible(result);
    }

    clickClearAllButton() {
        Util.waitUntilElementIsVisible(this.filter);
        let result = this.filter.element(this.clearAllButton);
        Util.waitUntilElementIsVisible(result);
        return result.click();
    }

    getCheckListOptionsNumberOnPage() {
        Util.waitUntilElementIsVisible(this.filter);
        let checkListOptions = this.filter.all(by.css('div[class="checklist"] mat-checkbox'));
        return checkListOptions.count();
    }

    clickShowMoreButton() {
        Util.waitUntilElementIsVisible(this.filter.element(this.showMoreBy));
        return this.filter.element(this.showMoreBy).click();
    }

    clickShowLessButton() {
        Util.waitUntilElementIsVisible(this.filter.element(this.showLessBy));
        return this.filter.element(this.showLessBy).click();
    }

}
