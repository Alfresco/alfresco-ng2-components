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
import { SearchCategoriesPage } from './content_services/search/search-categories';

export class SearchFiltersPage {

    searchCategoriesPage = new SearchCategoriesPage();

    searchFilters = element(by.css('adf-search-filter'));
    fileTypeFilter = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-SEARCH.FACET_FIELDS.TYPE"]'));
    creatorFilter = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-SEARCH.FACET_FIELDS.CREATOR"]'));
    fileSizeFilter = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-SEARCH.FACET_FIELDS.SIZE"]'));
    nameFilter = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-Name"]'));
    checkListFilter = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-Check List"]'));

    checkSearchFiltersIsDisplayed() {
        Util.waitUntilElementIsVisible(this.searchFilters);
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

    checkNameFilterIsDisplayed() {
        this.searchCategoriesPage.checkFilterIsDisplayed(this.nameFilter);
        return this;
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

    clickFileTypeFilterHeader() {
        this.searchCategoriesPage.clickFilterHeader(this.fileTypeFilter);
        return this;
    }

    checkFileTypeFilterIsCollapsed() {
        this.searchCategoriesPage.checkFilterIsCollapsed(this.fileTypeFilter);
        return this;
    }

    checkFileSizeFilterIsCollapsed() {
        this.searchCategoriesPage.checkFilterIsCollapsed(this.fileSizeFilter);
        return this;
    }
}
