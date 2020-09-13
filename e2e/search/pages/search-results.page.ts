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

import { BrowserVisibility, DataTableComponentPage, SearchSortingPickerPage } from '@alfresco/adf-testing';
import { by, element } from 'protractor';
import { ContentServicesPage } from '../../core/pages/content-services.page';

export class SearchResultsPage {

    noResultsMessage = element(by.css('.app-no-result-message'));
    dataTable = new DataTableComponentPage();
    searchSortingPicker = new SearchSortingPickerPage();
    contentServices = new ContentServicesPage();

    getNodeHighlight(content: string) {
        return this.dataTable.getCellByRowContentAndColumn('Display name', content, 'Search');
    }

    async tableIsLoaded(): Promise<void> {
        await this.dataTable.tableIsLoaded();
    }

    async checkContentIsDisplayed(content: string): Promise<void> {
        await this.dataTable.checkContentIsDisplayed('Display name', content);
    }

    async numberOfResultsDisplayed(): Promise<number> {
        return this.dataTable.numberOfRows();
    }

    async checkContentIsNotDisplayed(content: string): Promise<void> {
        await this.dataTable.checkContentIsNotDisplayed('Display name', content);
    }

    async checkNoResultMessageIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.noResultsMessage);
    }

    async checkNoResultMessageIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.noResultsMessage);
    }

    async navigateToFolder(content: string): Promise<void> {
        await this.contentServices.openFolder(content);
    }

    async deleteContent(content: string): Promise<void> {
        await this.contentServices.deleteContent(content);
    }

    async sortByName(sortOrder: string): Promise<void> {
        await this.searchSortingPicker.sortBy(sortOrder, 'Name');
    }

    async sortByAuthor(sortOrder: string): Promise<void> {
        await this.searchSortingPicker.sortBy(sortOrder, 'Author');
    }

    async sortByCreated(sortOrder: string): Promise<void> {
        await this.searchSortingPicker.sortBy(sortOrder, 'Created');
    }

    async sortBySize(sortOrder: string): Promise<void> {
        await this.searchSortingPicker.sortBy(sortOrder, 'Size');
    }

    async checkListIsOrderedByNameAsc(): Promise<any> {
        return this.contentServices.contentList.dataTablePage().checkListIsSorted('ASC', 'Display name');
    }

    async checkListIsOrderedByNameDesc(): Promise<any> {
        return this.contentServices.contentList.dataTablePage().checkListIsSorted('DESC', 'Display name');
    }

}
