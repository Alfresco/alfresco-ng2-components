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

import { Util } from '../../util/util';
import { element, by } from 'protractor';
import { SearchCategoriesPage } from './content-services/search/search-categories';

export class SearchFiltersPage {

    searchCategoriesPage = new SearchCategoriesPage();

    searchFilters = element(by.css('adf-search-filter'));
    fileTypeFilter = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-SEARCH.FACET_FIELDS.TYPE"]'));
    creatorFilter = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-SEARCH.FACET_FIELDS.CREATOR"]'));
    fileSizeFilter = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-SEARCH.FACET_FIELDS.SIZE"]'));
    nameFilter = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-Name"]'));
    checkListFilter = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-Check List"]'));
    createdDateRangeFilter = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-Created Date (range)"]'));
    typeFilter = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-Type"]'));
    sizeRangeFilter = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-Content Size (range)"]'));
    sizeSliderFilter = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-Content Size"]'));
    facetQueriesDefaultGroup = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-SEARCH.FACET_QUERIES.MY_FACET_QUERIES"],' +
        'mat-expansion-panel[data-automation-id="expansion-panel-My facet queries"]'));
    facetQueriesTypeGroup = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-Type facet queries"]'));
    facetQueriesSizeGroup = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-Size facet queries"]'));
    facetIntervalsByCreated = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-TheCreated"]'));
    facetIntervalsByModified = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-TheModified"]'));

    checkSearchFiltersIsDisplayed() {
        Util.waitUntilElementIsVisible(this.searchFilters);
    }

    sizeRangeFilterPage() {
        return this.searchCategoriesPage.numberRangeFilter(this.sizeRangeFilter);
    }

    createdDateRangeFilterPage() {
        return this.searchCategoriesPage.dateRangeFilter(this.createdDateRangeFilter);
    }

    textFiltersPage() {
        return this.searchCategoriesPage.textFiltersPage(this.nameFilter);
    }

    checkListFiltersPage() {
        return this.searchCategoriesPage.checkListFiltersPage(this.checkListFilter);
    }

    creatorCheckListFiltersPage() {
        return this.searchCategoriesPage.checkListFiltersPage(this.creatorFilter);
    }

    fileTypeCheckListFiltersPage() {
        return this.searchCategoriesPage.checkListFiltersPage(this.fileTypeFilter);
    }

    sizeSliderFilterPage() {
        return this.searchCategoriesPage.sliderFilter(this.sizeSliderFilter);
    }

    checkFileTypeFilterIsDisplayed() {
        this.searchCategoriesPage.checkFilterIsDisplayed(this.fileTypeFilter);
        return this;
    }

    checkCreatorFilterIsDisplayed() {
        this.searchCategoriesPage.checkFilterIsDisplayed(this.creatorFilter);
        return this;
    }

    checkCheckListFilterIsDisplayed() {
        this.searchCategoriesPage.checkFilterIsDisplayed(this.checkListFilter);
        return this;
    }

    checkNameFilterIsExpanded() {
        this.searchCategoriesPage.checkFilterIsExpanded(this.nameFilter);
        return this;
    }

    checkNameFilterIsDisplayed() {
        this.searchCategoriesPage.checkFilterIsDisplayed(this.nameFilter);
        return this;
    }

    checkDefaultFacetQueryGroupIsDisplayed() {
        this.searchCategoriesPage.checkFilterIsDisplayed(this.facetQueriesDefaultGroup);
        return this;
    }

    checkTypeFacetQueryGroupIsDisplayed() {
        this.searchCategoriesPage.checkFilterIsDisplayed(this.facetQueriesTypeGroup);
        return this;
    }

    checkSizeFacetQueryGroupIsDisplayed() {
        this.searchCategoriesPage.checkFilterIsDisplayed(this.facetQueriesSizeGroup);
        return this;
    }

    checkFacetIntervalsByCreatedIsDisplayed() {
        this.searchCategoriesPage.checkFilterIsDisplayed(this.facetIntervalsByCreated);
        return this;
    }

    checkFacetIntervalsByModifiedIsDisplayed() {
        this.searchCategoriesPage.checkFilterIsDisplayed(this.facetIntervalsByModified);
        return this;
    }

    isTypeFacetQueryGroupPresent() {
        return this.facetQueriesTypeGroup.isPresent();
    }

    isSizeFacetQueryGroupPresent() {
        return this.facetQueriesSizeGroup.isPresent();
    }

    clickCheckListFilter() {
        this.searchCategoriesPage.clickFilter(this.checkListFilter);
        return this;
    }

    clickFileTypeListFilter() {
        this.searchCategoriesPage.clickFilter(this.fileTypeFilter);
        return this;
    }

    clickFileSizeFilterHeader() {
        this.searchCategoriesPage.clickFilterHeader(this.fileSizeFilter);
        return this;
    }
    checkFileSizeFilterIsCollapsed() {
        this.searchCategoriesPage.checkFilterIsCollapsed(this.fileSizeFilter);
        return this;
    }

    clickFileTypeFilterHeader() {
        this.searchCategoriesPage.clickFilterHeader(this.fileTypeFilter);
        return this;
    }

    checkFileTypeFilterIsCollapsed() {
        this.searchCategoriesPage.checkFilterIsCollapsed(this.fileTypeFilter);
        return this;
    }

    checkCheckListFilterIsCollapsed() {
        this.searchCategoriesPage.checkFilterIsCollapsed(this.checkListFilter);
    }

    checkCheckListFilterIsExpanded() {
        this.searchCategoriesPage.checkFilterIsExpanded(this.checkListFilter);
        return this;
    }

    checkCreatedRangeFilterIsDisplayed() {
        this.searchCategoriesPage.checkFilterIsDisplayed(this.createdDateRangeFilter);
        return this;
    }

    clickCreatedRangeFilterHeader() {
        this.searchCategoriesPage.clickFilterHeader(this.createdDateRangeFilter);
        return this;
    }

    checkCreatedRangeFilterIsExpanded() {
        this.searchCategoriesPage.checkFilterIsExpanded(this.createdDateRangeFilter);
        return this;
    }

    typeFiltersPage() {
        return this.searchCategoriesPage.radioFiltersPage(this.typeFilter);
    }

    checkTypeFilterIsDisplayed() {
        this.searchCategoriesPage.checkFilterIsDisplayed(this.typeFilter);
        return this;
    }

    clickTypeFilter() {
        this.searchCategoriesPage.clickFilter(this.typeFilter);
        return this;
    }

    checkTypeFilterIsCollapsed() {
        this.searchCategoriesPage.checkFilterIsCollapsed(this.typeFilter);
        return this;
    }

    clickTypeFilterHeader() {
        this.searchCategoriesPage.clickFilterHeader(this.typeFilter);
        return this;
    }

    checkSizeRangeFilterIsDisplayed() {
        this.searchCategoriesPage.checkFilterIsDisplayed(this.createdDateRangeFilter);
        return this;
    }

    clickSizeRangeFilterHeader() {
        this.searchCategoriesPage.clickFilterHeader(this.sizeRangeFilter);
        return this;
    }

    checkSizeRangeFilterIsExpanded() {
        this.searchCategoriesPage.checkFilterIsExpanded(this.sizeRangeFilter);
        return this;
    }

    checkSizeRangeFilterIsCollapsed() {
        this.searchCategoriesPage.checkFilterIsCollapsed(this.sizeRangeFilter);
        return this;
    }

    checkSizeSliderFilterIsDisplayed() {
        this.searchCategoriesPage.checkFilterIsDisplayed(this.sizeSliderFilter);
        return this;
    }

    clickSizeSliderFilterHeader() {
        this.searchCategoriesPage.clickFilterHeader(this.sizeSliderFilter);
        return this;
    }

    checkSizeSliderFilterIsExpanded() {
        this.searchCategoriesPage.checkFilterIsExpanded(this.sizeSliderFilter);
        return this;
    }

    checkSizeSliderFilterIsCollapsed() {
        this.searchCategoriesPage.checkFilterIsCollapsed(this.sizeSliderFilter);
        return this;
    }
}
