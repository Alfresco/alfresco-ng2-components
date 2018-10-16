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

export class SearchFiltersPage {

    searchFilters = element(by.css('adf-search-filter'));
    fileTypeFilter = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-1:Type"'));
    searchFileTypeFilter = element(by.css('input[data-automation-id="facet-result-filter-1:Type"'));
    creatorFilter = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-3:Creator"'));
    searchCreatorFilter = element(by.css('input[data-automation-id="facet-result-filter-3:Creator"'));
    fileSizeFilter = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-2:Size"'));
    showMoreButtonForSize = this.fileSizeFilter.element(by.css('button[title="Show more"]'));
    showLessButtonForSize = this.fileSizeFilter.element(by.css('button[title="Show less"]'));
    numberOfCheckboxesforSize = element.all(by.css('mat-checkbox[data-automation-id*="checkbox-2:Size"]'));

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
        let result = element(by.css(`mat-checkbox[data-automation-id='checkbox-1:Type-${fileType}'] .mat-checkbox-inner-container`));
        Util.waitUntilElementIsClickable(result);
        result.click();
    }

    selectCreator(creatorName) {
        let result = element(by.css(`mat-checkbox[data-automation-id='checkbox-3:Creator-${creatorName}'] .mat-checkbox-inner-container`));
        Util.waitUntilElementIsClickable(result);
        result.click();
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
                    let totalNumberOfCheckboxes = await numberOfCheckboxesforSize.count();

                    expect(totalNumberOfCheckboxes).toEqual(checkboxes);
                }
                this.showMoreButtonForSize.click();

                this.clickSizeShowMoreButtonUntilIsNotDisplayed();
            }
        }, err => {
        })
    }

    checkSizeShowMoreButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.showMoreButtonForSize);
    }

    clickSizeShowLessButtonUntilIsNotDisplayed() {
        Util.waitUntilElementIsVisible(this.fileSizeFilter);

        this.showLessButtonForSize.isDisplayed().then(async (visible) => {
            if (visible) {
                let totalNumberOfCheckboxes = await this.numberOfCheckboxesforSize.count();

                for (let checkboxes = totalNumberOfCheckboxes; checkboxes > 10; checkboxes = totalNumberOfCheckboxes - checkboxes) {
                    expect(totalNumberOfCheckboxes).toEqual(checkboxes);
                }

                this.showLessButtonForSize.click();

                this.clickSizeShowLessButtonUntilIsNotDisplayed();
            }
        }, err => {
        })
    }

    checkShowLessButtonIsNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.showLessButtonForSize);
    }

    checkShowLessButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.showLessButtonForSize);
    }

}
