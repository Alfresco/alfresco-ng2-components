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
import { element, by } from 'protractor';

export class SearchCheckListPage {

    filter;
    inputBy = by.css('div[class*="mat-expansion-panel-content"] input');
    showMoreBy = by.css('button[title="Show more"]');
    showLessBy = by.css('button[title="Show less"]');

    constructor(filter) {
        this.filter = filter;
    }

    clickCheckListOption(option) {
        Util.waitUntilElementIsVisible(this.filter);
        let result = this.filter.element(by.css(`mat-checkbox[data-automation-id*='-${option}'] .mat-checkbox-inner-container`));
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
        Util.waitUntilElementIsVisible(this.filter.element(this.inputBy));
    }

    searchInFilter(option) {
        let inputElement = this.filter.element(this.inputBy);
        Util.waitUntilElementIsClickable(this.filter);
        Util.waitUntilElementIsClickable(inputElement);

        inputElement.clear();
        this.filter.element(this.inputBy).sendKeys(option);
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

    clickShowMoreButtonUntilIsNotDisplayed() {
        this.filter.element(this.showMoreBy).isDisplayed().then(async (visible) => {
            if (visible) {
                this.filter.element(this.showMoreBy).click();

                this.clickShowMoreButtonUntilIsNotDisplayed();
            }
        }, err => {
        });
        return this;
    }

    clickShowLessButtonUntilIsNotDisplayed() {
        this.filter.element(this.showLessBy).isDisplayed().then(async (visible) => {
            if (visible) {
                this.filter.element(this.showLessBy).click();

                this.clickShowLessButtonUntilIsNotDisplayed();
            }
        }, err => {
        });
        return this;
    }

    getBucketNumberOfFilterType(option) {
        let fileTypeFilter = this.filter.element(by.css('mat-checkbox[data-automation-id*=".' + option + '"] span'));
        Util.waitUntilElementIsVisible(fileTypeFilter);
        let bucketNumber = fileTypeFilter.getText().then((valueOfBucket) => {
            let numberOfBucket = valueOfBucket.split('(')[1];
            let totalNumberOfBucket = numberOfBucket.split(')')[0];
            return totalNumberOfBucket;
        });

        return bucketNumber;
    }

}
