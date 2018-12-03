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

import { Util } from '../../util/util';
import { ContentListPage } from './dialog/contentListPage';
import { DataTablePage } from './dataTablePage';
import { element, by, protractor, browser } from 'protractor';

export class SearchResultsPage {

    noResultsMessage = element(by.css('div[class="adf-no-result-message"]'));
    noResultsMessageBy = by.css('div[class="adf-no-result-message"]');
    contentList = new ContentListPage();
    dataTable = new DataTablePage();
    sortArrowLocator = by.css('adf-sorting-picker button mat-icon');
    sortingArrow = element(by.css('adf-sorting-picker div[class="mat-select-arrow"]'));

    tableIsLoaded() {
        this.contentList.tableIsLoaded();
    }

    closeActionButton() {
        let container = element(by.css('div.cdk-overlay-backdrop.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing'));
        Util.waitUntilElementIsVisible(container);
        container.click();
        Util.waitUntilElementIsNotVisible(container);
        return this;
    }

    checkContentIsDisplayed(content) {
        this.contentList.checkContentIsDisplayed(content);
        return this;
    }

    numberOfResultsDisplayed() {
        return this.contentList.getAllDisplayedRows();
    }

    checkContentIsNotDisplayed(content) {
        Util.waitUntilElementIsNotOnPage(element(by.css("span[title='" + content + "']")));
    }

    checkNoResultMessageIsDisplayed() {
        Util.waitUntilElementIsPresent(element(this.noResultsMessageBy));
        Util.waitUntilElementIsVisible(element(this.noResultsMessageBy));
        return this;
    }

    checkNoResultMessageIsNotDisplayed() {
        Util.waitUntilElementIsNotOnPage(this.noResultsMessage);
        return this;
    }

    navigateToFolder(content) {
        this.contentList.doubleClickRow(content);
        return this;
    }

    deleteContent(content) {
        this.contentList.deleteContent(content);
    }

    checkDeleteIsDisabled(content) {
        this.contentList.checkDeleteIsDisabled(content);
        this.closeActionButton();
    }

    sortByName(sortOrder) {
        this.sortBy(sortOrder, 'Name');
    }

    sortBy(sortOrder, sortType) {
        Util.waitUntilElementIsClickable(this.sortingArrow);
        this.sortingArrow.click();

        let selectedSortingOption = element(by.cssContainingText('span[class="mat-option-text"]', sortType));
        Util.waitUntilElementIsClickable(selectedSortingOption);
        selectedSortingOption.click();

        this.sortByOrder(sortOrder);
    }

    sortByOrder(sortOrder) {
        Util.waitUntilElementIsVisible(element(this.sortArrowLocator));
        return element(this.sortArrowLocator).getText().then((result) => {
            if (sortOrder === true) {
                if (result !== 'arrow_upward') {
                    browser.executeScript(`document.querySelector('adf-sorting-picker button mat-icon').click();`);
                }
            } else {
                if (result === 'arrow_upward') {
                    browser.executeScript(`document.querySelector('adf-sorting-picker button mat-icon').click();`);
                }
            }

            return Promise.resolve();
        });
    }

    sortByAuthor(sortOrder) {
        this.sortBy(sortOrder, 'Author');
    }

    sortByCreated(sortOrder) {
        this.sortBy(sortOrder, 'Created');
    }

    sortBySize(sortOrder) {
        this.sortBy(sortOrder, 'Size');
        return this;
    }

    sortAndCheckListIsOrderedByName(sortOrder) {
        this.sortByName(sortOrder);
        this.dataTable.waitForTableBody();
        let deferred = protractor.promise.defer();
        this.contentList.checkListIsOrderedByNameColumn(sortOrder).then((result) => {
            deferred.fulfill(result);
        });
        return deferred.promise;
    }

    sortAndCheckListIsOrderedByAuthor(sortOrder) {
        this.sortByAuthor(sortOrder);
        let deferred = protractor.promise.defer();
        this.contentList.checkListIsOrderedByAuthorColumn(sortOrder).then((result) => {
            deferred.fulfill(result);
        });
        return deferred.promise;
    }

    sortAndCheckListIsOrderedByCreated(sortOrder) {
        this.sortByCreated(sortOrder);
        let deferred = protractor.promise.defer();
        this.contentList.checkListIsOrderedByCreatedColumn(sortOrder).then((result) => {
            deferred.fulfill(result);
        });
        return deferred.promise;
    }

}
