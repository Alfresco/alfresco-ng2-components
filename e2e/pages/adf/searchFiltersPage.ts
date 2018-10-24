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

import Util = require('../../util/util');
import { element, by } from 'protractor';

export class SearchFiltersPage {

    searchFilters = element(by.css('adf-search-filter'));
    fileTypeFilter = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-SEARCH.FACET_FIELDS.TYPE"]'));
    searchFileTypeFilter = element(by.css('input[data-automation-id="facet-result-filter-SEARCH.FACET_FIELDS.TYPE"]'));
    creatorFilter = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-SEARCH.FACET_FIELDS.CREATOR"]'));
    searchCreatorFilter = element(by.css('input[data-automation-id="facet-result-filter-SEARCH.FACET_FIELDS.CREATOR"]'));
    fileSizeFilter = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-SEARCH.FACET_FIELDS.SIZE"]'));
    createdFilter = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-SEARCH.FACET_FIELDS.CREATED"'));
    showMoreButtonForCreated = this.createdFilter.element(by.css('button[title="Show more"]'));
    showLessButtonForCreated = this.createdFilter.element(by.css('button[title="Show less"]'));
    pngImageFileType = element(by.css('mat-checkbox[data-automation-id="checkbox-SEARCH.FACET_FIELDS.TYPE-PNG Image"]'));

    checkSearchFiltersIsDisplayed() {
        Util.waitUntilElementIsVisible(this.searchFilters);
    }

    checkFileTypeFilterIsDisplayed() {
        Util.waitUntilElementIsVisible(this.fileTypeFilter);
    }

    checkSearchFileTypeFilterIsDisplayed() {
        Util.waitUntilElementIsVisible(this.fileTypeFilter);
    }

    checkCreatorFilterIsDisplayed() {
        Util.waitUntilElementIsVisible(this.creatorFilter);
    }

    checkSearchCreatorFilterIsDisplayed() {
        Util.waitUntilElementIsVisible(this.searchCreatorFilter);
    }

    searchInFileTypeFilter(fileType) {
        Util.waitUntilElementIsClickable(this.searchFileTypeFilter);
        this.searchFileTypeFilter.clear();
        this.searchFileTypeFilter.sendKeys(fileType);
    }

    searchInCreatorFilter(creatorName) {
        Util.waitUntilElementIsClickable(this.searchCreatorFilter);
        this.searchCreatorFilter.clear();
        this.searchCreatorFilter.sendKeys(creatorName);
    }

    selectFileType(fileType) {
        let result = element(by.css(`mat-checkbox[data-automation-id='checkbox-SEARCH.FACET_FIELDS.TYPE-${fileType}'] .mat-checkbox-inner-container`));
        Util.waitUntilElementIsClickable(result);
        result.click();
    }

    selectCreator(creatorName) {
        let result = element(by.css(`mat-checkbox[data-automation-id='checkbox-SEARCH.FACET_FIELDS.CREATOR-${creatorName}'] .mat-checkbox-inner-container`));
        Util.waitUntilElementIsClickable(result);
        result.click();
    }

    clickFileSizeFilterHeader() {
        let fileSizeFilterHeader = this.fileSizeFilter.element(by.css('mat-expansion-panel-header'));
        Util.waitUntilElementIsClickable(fileSizeFilterHeader);
        return fileSizeFilterHeader.click();
    }

    clickFileTypeFilterHeader() {
        let fileTypeFilterHeader = this.fileTypeFilter.element(by.css('mat-expansion-panel-header'));
        Util.waitUntilElementIsClickable(fileTypeFilterHeader);
        return fileTypeFilterHeader.click();
    }

    checkFileTypeFilterIsCollapsed() {
        this.fileTypeFilter.getAttribute('class').then((elementClass) => {
            expect(elementClass).not.toContain('mat-expanded');
        });
    }

    checkFileSizeFilterIsCollapsed() {
        this.fileSizeFilter.getAttribute('class').then((elementClass) => {
            expect(elementClass).not.toContain('mat-expanded');
        });
    }

    filterByFileType(fileType) {
        this.checkFileTypeFilterIsDisplayed();

        this.checkSearchFileTypeFilterIsDisplayed();
        this.searchInFileTypeFilter(fileType);
        this.selectFileType(fileType);
    }

    filterByCreator(creatorFirstName, creatorLastName) {
        this.checkCreatorFilterIsDisplayed();

        this.checkSearchCreatorFilterIsDisplayed();
        this.searchInCreatorFilter(`${creatorFirstName} ${creatorLastName}`);
        this.selectCreator(`${creatorFirstName} ${creatorLastName}`);
    }

    removeCreatorFilter(creatorFirstName, creatorLastName) {
        let cancelChipButton = element(by.cssContainingText('mat-chip', ` ${creatorFirstName} ${creatorLastName} `)).element(by.css('mat-icon'));
        Util.waitUntilElementIsClickable(cancelChipButton);
        return cancelChipButton.click();
    }

    checkCreatorChipIsDisplayed(creatorFirstName, creatorLastName) {
        return Util.waitUntilElementIsVisible(element(by.cssContainingText('mat-chip', ` ${creatorFirstName} ${creatorLastName} `)).element(by.css('mat-icon')));
    }

    checkCreatorChipIsNotDisplayed(creatorFirstName, creatorLastName) {
        return Util.waitUntilElementIsNotOnPage(element(by.cssContainingText('mat-chip', ` ${creatorFirstName} ${creatorLastName} `)).element(by.css('mat-icon')));
    }

    clickCreatedShowMoreButtonUntilIsNotDisplayed() {
        Util.waitUntilElementIsVisible(this.createdFilter);

        this.showMoreButtonForCreated.isDisplayed().then(async (visible) => {
            if (visible) {
                this.showMoreButtonForCreated.click();

                this.clickCreatedShowMoreButtonUntilIsNotDisplayed();
            }
        }, err => {
        });
    }

    checkCreatedShowMoreButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.showMoreButtonForCreated);
    }

    clickCreatedShowLessButtonUntilIsNotDisplayed() {
        Util.waitUntilElementIsVisible(this.createdFilter);

        this.showLessButtonForCreated.isDisplayed().then(async (visible) => {
            if (visible) {
                this.showLessButtonForCreated.click();

                this.clickCreatedShowLessButtonUntilIsNotDisplayed();
            }
        }, err => {
        });
    }

    checkCreatedShowLessButtonIsNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.showLessButtonForCreated);
    }

    checkCreatedShowLessButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.showLessButtonForCreated);
    }

    clickPngImageType() {
        Util.waitUntilElementIsVisible(this.pngImageFileType);
        return this.pngImageFileType.click();
    }

    getBucketNumberOfFilterType(fileType, filterLength) {
        let fileTypeFilter = element(by.css('mat-checkbox[data-automation-id="checkbox-SEARCH.FACET_FIELDS.'+ fileType +'"] span'));
        Util.waitUntilElementIsVisible(fileTypeFilter);
        let bucketNumber = fileTypeFilter.getText().then((valueOfBucket) => {
            let numberOfBucket = valueOfBucket.substring(filterLength, valueOfBucket.length -1);
            return numberOfBucket;
        });

        return bucketNumber;
    }

}
