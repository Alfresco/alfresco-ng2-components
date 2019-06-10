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

import { DataTableComponentPage } from '@alfresco/adf-testing';
import { element, by } from 'protractor';
import { ContentServicesPage } from './contentServicesPage';
import { BrowserVisibility, SearchSortingPickerPage } from '@alfresco/adf-testing';

export class SearchResultsPage {

    noResultsMessage = element(by.css('div[class="adf-no-result-message"]'));
    dataTable = new DataTableComponentPage();
    searchSortingPicker = new SearchSortingPickerPage();
    contentServices = new ContentServicesPage();

    getNodeHighlight(content) {
        return this.dataTable.getCellByRowContentAndColumn('Display name', content, 'Search');
    }

    tableIsLoaded() {
        this.dataTable.tableIsLoaded();
    }

    checkContentIsDisplayed(content) {
        this.dataTable.checkContentIsDisplayed('Display name', content);
        return this;
    }

    numberOfResultsDisplayed() {
        return this.dataTable.numberOfRows();
    }

    checkContentIsNotDisplayed(content) {
        this.dataTable.checkContentIsNotDisplayed('Display name', content);
        return this;
    }

    checkNoResultMessageIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.noResultsMessage);
        return this;
    }

    checkNoResultMessageIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotOnPage(this.noResultsMessage);
        return this;
    }

    navigateToFolder(content) {
        this.dataTable.doubleClickRow('Display name', content);
        return this;
    }

    deleteContent(content) {
        this.contentServices.deleteContent(content);
    }

    sortByName(sortOrder: string) {
        this.searchSortingPicker.sortBy(sortOrder, 'Name');
    }

    sortByAuthor(sortOrder: string) {
        this.searchSortingPicker.sortBy(sortOrder, 'Author');
    }

    sortByCreated(sortOrder: string) {
        this.searchSortingPicker.sortBy(sortOrder, 'Created');
    }

    sortBySize(sortOrder: string) {
        this.searchSortingPicker.sortBy(sortOrder, 'Size');
        return this;
    }

    async checkListIsOrderedByNameAsc() {
        return this.contentServices.contentList.dataTablePage().checkListIsSorted('ASC', 'Display name');
    }

    async checkListIsOrderedByNameDesc() {
        return this.contentServices.contentList.dataTablePage().checkListIsSorted('DESC', 'Display name');
    }

    async checkListIsOrderedByAuthorAsc() {
        return this.contentServices.contentList.dataTablePage().checkListIsSorted('ASC', 'Created by');
    }

    async checkListIsOrderedByAuthorDesc() {
        return this.contentServices.contentList.dataTablePage().checkListIsSorted('DESC', 'Created by');
    }

}
