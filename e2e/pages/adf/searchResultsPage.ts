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
import { element, by, protractor } from 'protractor';
import { ContentServicesPage } from './contentServicesPage';

export class SearchResultsPage {

    noResultsMessage = element(by.css('div[class="adf-no-result-message"]'));
    dataTable = new DataTableComponentPage();
    searchSortingPicker = new SearchSortingPickerPage();
    contentServices = new ContentServicesPage();

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

    sortAndCheckListIsOrderedByName(sortOrder) {
        let deferred = protractor.promise.defer();
        this.sortByName(sortOrder);
        this.dataTable.waitForTableBody();
        if (sortOrder === true) {
            this.checkListIsOrderedByNameAsc().then((result) => {
                deferred.fulfill(result);
            });
        } else {
            this.checkListIsOrderedByNameDesc().then((result) => {
                deferred.fulfill(result);
            });
        }
        return deferred.promise;
    }

    async checkListIsOrderedByNameAsc() {
        let list = await this.contentServices.getElementsDisplayedName();
        return this.contentServices.checkElementsSortedAsc(list);
    }

    async checkListIsOrderedByNameDesc() {
        let list = await this.contentServices.getElementsDisplayedName();
        return this.contentServices.checkElementsSortedDesc(list);
    }

    sortAndCheckListIsOrderedByAuthor(alfrescoJsApi, sortOrder) {
        let deferred = protractor.promise.defer();
        this.sortByAuthor(sortOrder);
        this.dataTable.waitForTableBody();
        if (sortOrder === true) {
            this.checkListIsOrderedByAuthorAsc(alfrescoJsApi).then((result) => {
                deferred.fulfill(result);
            });
        } else {
            this.checkListIsOrderedByAuthorDesc(alfrescoJsApi).then((result) => {
                deferred.fulfill(result);
            });
        }
        return deferred.promise;
    }

    async checkListIsOrderedByAuthorAsc(alfrescoJsApi) {
        let list = await this.contentServices.getElementsDisplayedAuthor(alfrescoJsApi);
        return this.contentServices.checkElementsSortedAsc(list);
    }

    async checkListIsOrderedByAuthorDesc(alfrescoJsApi) {
        let list = await this.contentServices.getElementsDisplayedAuthor(alfrescoJsApi);
        return this.contentServices.checkElementsSortedDesc(list);
    }

    sortAndCheckListIsOrderedByCreated(sortOrder) {
        let deferred = protractor.promise.defer();
        this.sortByCreated(sortOrder);
        this.dataTable.waitForTableBody();
        if (sortOrder === true) {
            this.checkListIsOrderedByCreatedAsc().then((result) => {
                deferred.fulfill(result);
            });
        } else {
            this.checkListIsOrderedByCreatedDesc().then((result) => {
                deferred.fulfill(result);
            });
        }
        return deferred.promise;
    }

    async checkListIsOrderedByCreatedAsc() {
        let stringList = await this.contentServices.getElementsDisplayedCreated();
        let list;
        await stringList.forEach((stringDate) => {
            list.push(new Date(stringDate));
        });
        return this.contentServices.checkElementsSortedAsc(list);
    }

    async checkListIsOrderedByCreatedDesc() {
        let list = await this.contentServices.getElementsDisplayedCreated();
        return this.contentServices.checkElementsSortedDesc(list);
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
