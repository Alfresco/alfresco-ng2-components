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
import { DataTableComponentPage } from './dataTableComponentPage';
import { SearchSortingPickerPage } from './content-services/search/components/search-sortingPicker.page';
import { element, by } from 'protractor';
import { ContentServicesPage } from './contentServicesPage';

export class SearchResultsPage {

    noResultsMessage = element(by.css('div[class="adf-no-result-message"]'));
    dataTable = new DataTableComponentPage();
    searchSortingPicker = new SearchSortingPickerPage();
    contentServices = new ContentServicesPage();

    getNodeHighlight(content) {
        return this.dataTable.getCellByRowAndColumn('Display name', content, 'Search');
    }

    tableIsLoaded() {
        this.dataTable.tableIsLoaded();
    }

    closeActionButton() {
        let container = element(by.css('div.cdk-overlay-backdrop.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing'));
        Util.waitUntilElementIsVisible(container);
        container.click();
        Util.waitUntilElementIsNotVisible(container);
        return this;
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
        Util.waitUntilElementIsVisible(this.noResultsMessage);
        return this;
    }

    checkNoResultMessageIsNotDisplayed() {
        Util.waitUntilElementIsNotOnPage(this.noResultsMessage);
        return this;
    }

    navigateToFolder(content) {
        this.dataTable.doubleClickRow('Display name', content);
        return this;
    }

    deleteContent(content) {
        this.contentServices.deleteContent(content);
    }

    checkDeleteIsDisabled(content) {
        this.contentServices.checkDeleteIsDisabled(content);
        this.closeActionButton();
    }

    sortByName(sortOrder) {
        this.searchSortingPicker.sortBy(sortOrder, 'Name');
    }

    sortByAuthor(sortOrder) {
        this.searchSortingPicker.sortBy(sortOrder, 'Author');
    }

    sortByCreated(sortOrder) {
        this.searchSortingPicker.sortBy(sortOrder, 'Created');
    }

    sortBySize(sortOrder) {
        this.searchSortingPicker.sortBy(sortOrder, 'Size');
        return this;
    }

    async checkListIsOrderedByNameAsc() {
        let list = await this.contentServices.getElementsDisplayedName();
        return this.contentServices.checkElementsSortedAsc(list);
    }

    async checkListIsOrderedByNameDesc() {
        let list = await this.contentServices.getElementsDisplayedName();
        return this.contentServices.checkElementsSortedDesc(list);
    }

    async checkListIsOrderedByAuthorAsc() {
        let authorList = await this.dataTable.geCellElementDetail('Created by');
        return this.contentServices.checkElementsSortedAsc(authorList);
    }

    async checkListIsOrderedByAuthorDesc() {
        let authorList = await this.dataTable.geCellElementDetail('Created by');
        return this.contentServices.checkElementsSortedDesc(authorList);
    }

    async checkListIsOrderedBySizeAsc() {
        let list = await this.contentServices.getElementsDisplayedSize();
        return this.contentServices.checkElementsSortedAsc(list);
    }

    async checkListIsOrderedBySizeDesc() {
        let list = await this.contentServices.getElementsDisplayedSize();
        return this.contentServices.checkElementsSortedDesc(list);
    }

}
