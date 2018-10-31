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

import Util = require('../../../../util/util');
import { element, by } from 'protractor';
import { SearchTextPage } from './components/search-text';
import { SearchCheckListPage } from './components/search-checkList';

export class SearchCategoriesPage {

    searchFilters = element(by.css('adf-search-filter'));
    fileTypeFilter = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-SEARCH.FACET_FIELDS.TYPE"]'));
    creatorFilter = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-SEARCH.FACET_FIELDS.CREATOR"]'));
    fileSizeFilter = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-SEARCH.FACET_FIELDS.SIZE"]'));
    createdFilter = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-SEARCH.FACET_FIELDS.CREATED"'));
    nameFilter = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-Name"]'));
    checkListFilter = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-Check List"]'));

    textFiltersPage() {
        return new SearchTextPage(this.nameFilter);
    }

    checkListFiltersPage() {
        return new SearchCheckListPage(this.checkListFilter);
    }

    checkSearchFiltersIsDisplayed() {
        Util.waitUntilElementIsVisible(this.searchFilters);
    }

    checkCheckListFilterIsDisplayed() {
        Util.waitUntilElementIsVisible(this.checkListFilter);
    }

    checkNameFilterIsDisplayed() {
        Util.waitUntilElementIsVisible(this.nameFilter);
    }

    clickCheckListFilter() {
        Util.waitUntilElementIsVisible(this.checkListFilter);
        this.checkListFilter.element(by.css('mat-expansion-panel-header')).click();
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

}

