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

import { BrowserVisibility, DateRangeFilterPage, NumberRangeFilterPage, SearchCategoriesPage, SearchCheckListPage, SearchRadioPage, SearchSliderPage, SearchTextPage } from '@alfresco/adf-testing';
import { $, by } from 'protractor';

export class SearchFiltersPage {

    searchCategoriesPage: SearchCategoriesPage = new SearchCategoriesPage();

    searchFilters = $('adf-search-filter');
    fileTypeFilter = $('mat-expansion-panel[data-automation-id="expansion-panel-SEARCH.FACET_FIELDS.TYPE"]');
    creatorFilter = $('mat-expansion-panel[data-automation-id="expansion-panel-SEARCH.FACET_FIELDS.CREATOR"]');
    fileSizeFilter = $('mat-expansion-panel[data-automation-id="expansion-panel-SEARCH.FACET_FIELDS.SIZE"]');
    nameFilter = $('mat-expansion-panel[data-automation-id="expansion-panel-Name"]');
    checkListFilter = $('mat-expansion-panel[data-automation-id="expansion-panel-Check List"]');
    createdDateRangeFilter = $('mat-expansion-panel[data-automation-id="expansion-panel-Created Date (range)"]');
    typeFilter = $('mat-expansion-panel[data-automation-id="expansion-panel-Type"]');
    sizeRangeFilter = $('mat-expansion-panel[data-automation-id="expansion-panel-Content Size (range)"]');
    sizeSliderFilter = $('mat-expansion-panel[data-automation-id="expansion-panel-Content Size"]');
    facetQueriesDefaultGroup = $('mat-expansion-panel[data-automation-id="expansion-panel-SEARCH.FACET_QUERIES.MY_FACET_QUERIES"],' +
        'mat-expansion-panel[data-automation-id="expansion-panel-My facet queries"]');
    facetQueriesTypeGroup = $('mat-expansion-panel[data-automation-id="expansion-panel-Type facet queries"]');
    facetQueriesSizeGroup = $('mat-expansion-panel[data-automation-id="expansion-panel-Size facet queries"]');
    facetIntervalsByCreated = $('mat-expansion-panel[data-automation-id="expansion-panel-The Created"]');
    facetIntervalsByModified = $('mat-expansion-panel[data-automation-id="expansion-panel-TheModified"]');

    async checkSearchFiltersIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.searchFilters);
    }

    sizeRangeFilterPage(): NumberRangeFilterPage {
        return SearchCategoriesPage.numberRangeFilter(this.sizeRangeFilter);
    }

    createdDateRangeFilterPage(): DateRangeFilterPage {
        return SearchCategoriesPage.dateRangeFilter(this.createdDateRangeFilter);
    }

    textFiltersPage(): SearchTextPage {
        return SearchCategoriesPage.textFiltersPage(this.nameFilter);
    }

    checkListFiltersPage(): SearchCheckListPage {
        return SearchCategoriesPage.checkListFiltersPage(this.checkListFilter);
    }

    creatorCheckListFiltersPage(): SearchCheckListPage {
        return SearchCategoriesPage.checkListFiltersPage(this.creatorFilter);
    }

    fileTypeCheckListFiltersPage(): SearchCheckListPage {
        return SearchCategoriesPage.checkListFiltersPage(this.fileTypeFilter);
    }

    typeFiltersPage(): SearchRadioPage {
        return SearchCategoriesPage.radioFiltersPage(this.typeFilter);
    }

    async checkCustomFacetFieldLabelIsDisplayed(fieldLabel: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible($(`mat-expansion-panel[data-automation-id="expansion-panel-${fieldLabel}"]`));
    }

    sizeSliderFilterPage(): SearchSliderPage {
        return SearchCategoriesPage.sliderFilter(this.sizeSliderFilter);
    }

    async checkCheckListFilterIsDisplayed(): Promise<void> {
        await this.searchCategoriesPage.checkFilterIsDisplayed(this.checkListFilter);
    }

    async checkNameFilterIsExpanded(): Promise<void> {
        await this.searchCategoriesPage.checkFilterIsExpanded(this.nameFilter);
    }

    async checkNameFilterIsDisplayed(): Promise<void> {
        await this.searchCategoriesPage.checkFilterIsDisplayed(this.nameFilter);
    }

    async checkDefaultFacetQueryGroupIsDisplayed(): Promise<void> {
        await this.searchCategoriesPage.checkFilterIsDisplayed(this.facetQueriesDefaultGroup);
    }

    async checkTypeFacetQueryGroupIsDisplayed(): Promise<void> {
        await this.searchCategoriesPage.checkFilterIsDisplayed(this.facetQueriesTypeGroup);
    }

    async checkSizeFacetQueryGroupIsDisplayed(): Promise<void> {
        await this.searchCategoriesPage.checkFilterIsDisplayed(this.facetQueriesSizeGroup);
    }

    async checkFacetIntervalsByCreatedIsDisplayed(): Promise<void> {
        await this.searchCategoriesPage.checkFilterIsDisplayed(this.facetIntervalsByCreated);
    }

    async checkFacetIntervalsByModifiedIsDisplayed(): Promise<void> {
        await this.searchCategoriesPage.checkFilterIsDisplayed(this.facetIntervalsByModified);
    }

    async isTypeFacetQueryGroupPresent(): Promise<boolean> {
        return this.facetQueriesTypeGroup.isPresent();
    }

    async isSizeFacetQueryGroupPresent(): Promise<boolean> {
        return this.facetQueriesSizeGroup.isPresent();
    }

    async clickCheckListFilter(): Promise<void> {
        await this.searchCategoriesPage.clickFilter(this.checkListFilter);
    }

    async clickFileTypeListFilter(): Promise<void> {
        await this.searchCategoriesPage.clickFilter(this.fileTypeFilter);
    }

    async clickFileSizeFilterHeader(): Promise<void> {
        await this.searchCategoriesPage.clickFilterHeader(this.fileSizeFilter);
    }

    async checkFileSizeFilterIsCollapsed(): Promise<void> {
        await this.searchCategoriesPage.checkFilterIsCollapsed(this.fileSizeFilter);
    }

    async checkFileTypeFilterIsCollapsed(): Promise<void> {
        await this.searchCategoriesPage.checkFilterIsCollapsed(this.fileTypeFilter);
    }

    async checkCheckListFilterIsCollapsed(): Promise<void> {
        await this.searchCategoriesPage.checkFilterIsCollapsed(this.checkListFilter);
    }

    async checkCheckListFilterIsExpanded(): Promise<void> {
        await this.searchCategoriesPage.checkFilterIsExpanded(this.checkListFilter);
    }

    async checkCreatedRangeFilterIsDisplayed(): Promise<void> {
        await this.searchCategoriesPage.checkFilterIsDisplayed(this.createdDateRangeFilter);
    }

    async clickCreatedRangeFilterHeader(): Promise<void> {
        await this.searchCategoriesPage.clickFilterHeader(this.createdDateRangeFilter);
    }

    async checkCreatedRangeFilterIsExpanded(): Promise<void> {
        await this.searchCategoriesPage.checkFilterIsExpanded(this.createdDateRangeFilter);
    }

    async checkTypeFilterIsDisplayed(): Promise<void> {
        await this.searchCategoriesPage.checkFilterIsDisplayed(this.typeFilter);
    }

    async checkTypeFilterIsCollapsed(): Promise<void> {
        await this.searchCategoriesPage.checkFilterIsCollapsed(this.typeFilter);
    }

    async clickTypeFilterHeader(): Promise<void> {
        await this.searchCategoriesPage.clickFilterHeader(this.typeFilter);
    }

    async checkSizeRangeFilterIsDisplayed(): Promise<void> {
        await this.searchCategoriesPage.checkFilterIsDisplayed(this.createdDateRangeFilter);
    }

    async clickSizeRangeFilterHeader(): Promise<void> {
        await this.searchCategoriesPage.clickFilterHeader(this.sizeRangeFilter);
    }

    async checkSizeRangeFilterIsExpanded(): Promise<void> {
        await this.searchCategoriesPage.checkFilterIsExpanded(this.sizeRangeFilter);
    }

    async checkSizeRangeFilterIsCollapsed(): Promise<void> {
        await this.searchCategoriesPage.checkFilterIsCollapsed(this.sizeRangeFilter);
    }

    async checkSizeSliderFilterIsDisplayed(): Promise<void> {
        await this.searchCategoriesPage.checkFilterIsDisplayed(this.sizeSliderFilter);
    }

    async clickSizeSliderFilterHeader(): Promise<void> {
        await this.searchCategoriesPage.clickFilterHeader(this.sizeSliderFilter);
    }

    async checkSizeSliderFilterIsExpanded(): Promise<void> {
        await this.searchCategoriesPage.checkFilterIsExpanded(this.sizeSliderFilter);
    }

    async checkSizeSliderFilterIsCollapsed(): Promise<void> {
        await this.searchCategoriesPage.checkFilterIsCollapsed(this.sizeSliderFilter);
    }

    async checkFacetIntervalsByCreatedIsExpanded(): Promise<void> {
        await this.searchCategoriesPage.checkFilterIsExpanded(this.facetIntervalsByCreated);
    }

    async checkFacetIntervalsByCreatedIsCollapsed(): Promise<void> {
        await this.searchCategoriesPage.checkFilterIsCollapsed(this.facetIntervalsByCreated);
    }

    async clickFacetIntervalsByCreatedFilterHeader(): Promise<void> {
        await this.searchCategoriesPage.clickFilterHeader(this.facetIntervalsByCreated);
    }

    async checkFacetIntervalsByModifiedIsExpanded(): Promise<void> {
        await this.searchCategoriesPage.checkFilterIsExpanded(this.facetIntervalsByModified);
    }

    async checkFacetIntervalsByModifiedIsCollapsed(): Promise<void> {
        await this.searchCategoriesPage.checkFilterIsCollapsed(this.facetIntervalsByModified);
    }

    async clickFacetIntervalsByModifiedFilterHeader(): Promise<void> {
        await this.searchCategoriesPage.clickFilterHeader(this.facetIntervalsByModified);
    }

    async checkFileTypeFacetLabelIsDisplayed(fileType: string | RegExp): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.fileTypeFilter.element(by.cssContainingText('.adf-facet-label', fileType)));
    }

    async checkFileTypeFacetLabelIsNotDisplayed(fileType: string | RegExp): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.fileTypeFilter.element(by.cssContainingText('.adf-facet-label', fileType)));
    }

}
