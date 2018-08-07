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

var Util = require('../../util/util');

var SearchFiltersPage = function () {

    var searchFilters = element(by.css("adf-search-filter"));
    var fileTypeFilter = element(by.css("mat-expansion-panel[data-automation-id='expansion-panel-1:Type'"));
    var searchFileTypeFilter = element(by.css("input[data-automation-id='facet-result-filter-1:Type'"));
    var creatorFilter = element(by.css("mat-expansion-panel[data-automation-id='expansion-panel-3:Creator'"));
    var searchCreatorFilter = element(by.css("input[data-automation-id='facet-result-filter-3:Creator'"));

    this.checkSearchFiltersIsDisplayed = function () {
        Util.waitUntilElementIsVisible(searchFilters);
    };

    this.checkFileTypeFilterIsDisplayed = function () {
        Util.waitUntilElementIsVisible(fileTypeFilter);
    };

    this.checkSearchFileTypeFilterIsDisplayed = function () {
        Util.waitUntilElementIsVisible(fileTypeFilter);
    };

    this.checkCreatorFilterIsDisplayed = function () {
        Util.waitUntilElementIsVisible(creatorFilter);
    };

    this.checkSearchCreatorFilterIsDisplayed = function () {
        Util.waitUntilElementIsVisible(searchCreatorFilter);
    };

    this.clickFileTypeFilter = function () {
        Util.waitUntilElementIsClickable(fileTypeFilter);
        return fileTypeFilter.click();
    };

    this.clickCreatorFilter = function () {
        Util.waitUntilElementIsClickable(creatorFilter);
        return creatorFilter.click();
    };

    this.searchInFileTypeFilter = function (fileType) {
        Util.waitUntilElementIsClickable(searchFileTypeFilter);
        searchFileTypeFilter.clear();
        searchFileTypeFilter.sendKeys(fileType);
    };

    this.searchInCreatorFilter = function (creatorName) {
        Util.waitUntilElementIsClickable(searchCreatorFilter);
        searchCreatorFilter.clear();
        searchCreatorFilter.sendKeys(creatorName);
    };

    this.selectFileType = function (fileType) {
        let result = element(by.css(`mat-checkbox[data-automation-id='checkbox-1:Type-${fileType}']`));
        Util.waitUntilElementIsClickable(result);
        result.click();
    };

    this.selectCreator = function (creatorName) {
        let result = element(by.css(`mat-checkbox[data-automation-id='checkbox-3:Creator-${creatorName}']`));
        Util.waitUntilElementIsClickable(result);
        result.click();
    };

    this.filterByFileType = function (fileType) {
        this.checkFileTypeFilterIsDisplayed();
        this.clickFileTypeFilter();

        this.checkSearchFileTypeFilterIsDisplayed();
        this.searchInFileTypeFilter(fileType);
        this.selectFileType(fileType);
    };

    this.filterByCreator = function (creatorFirstName, creatorLastName) {
        this.checkCreatorFilterIsDisplayed();
        this.clickCreatorFilter();

        this.checkSearchCreatorFilterIsDisplayed();
        this.searchInCreatorFilter(`${creatorFirstName} ${creatorLastName}`);
        this.selectCreator(`${creatorFirstName} ${creatorLastName}`);
    };
};
module.exports = SearchFiltersPage;
