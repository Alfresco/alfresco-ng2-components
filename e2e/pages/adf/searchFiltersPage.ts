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
    showMoreButtonForSize = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-SEARCH.FACET_FIELDS.SIZE"] button[title="Show more"]'));
    showLessButtonForSize = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-SEARCH.FACET_FIELDS.SIZE"] button[title="Show less"]'));
    numberOfCheckboxesForSize = element.all(by.css('mat-checkbox[data-automation-id*="checkbox-SEARCH.FACET_FIELDS.SIZE"]'));

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

    clickSizeShowMoreButtonUntilIsNotDisplayed() {
        Util.waitUntilElementIsVisible(this.fileSizeFilter);

        this.showMoreButtonForSize.isDisplayed().then(async (visible) => {
            if (visible) {
                for (let checkboxes = 5; checkboxes <= totalNumberOfCheckboxes; checkboxes + 5) {
                    let totalNumberOfCheckboxes = await numberOfCheckboxesForSize.count();

                    expect(totalNumberOfCheckboxes).toEqual(checkboxes);
                }
                this.showMoreButtonForSize.click();

                this.clickSizeShowMoreButtonUntilIsNotDisplayed();
            }
        }, err => {
        });
    }

    checkSizeShowMoreButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.showMoreButtonForSize);
    }

    clickSizeShowLessButtonUntilIsNotDisplayed() {
        Util.waitUntilElementIsVisible(this.fileSizeFilter);

        this.showLessButtonForSize.isDisplayed().then(async (visible) => {
            if (visible) {
                let totalNumberOfCheckboxes = await this.numberOfCheckboxesForSize.count();

                for (let checkboxes = totalNumberOfCheckboxes; checkboxes > 10; checkboxes = totalNumberOfCheckboxes - checkboxes) {
                    expect(totalNumberOfCheckboxes).toEqual(checkboxes);
                }

                this.showLessButtonForSize.click();

                this.clickSizeShowLessButtonUntilIsNotDisplayed();
            }
        }, err => {
        });
    }

    checkShowLessButtonIsNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.showLessButtonForSize);
    }

    checkShowLessButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.showLessButtonForSize);
    }

}
