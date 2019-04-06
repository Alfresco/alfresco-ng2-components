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

import { by, element } from 'protractor';
import { DocumentListPage } from '../content-services/documentListPage';
import { BrowserVisibility } from '@alfresco/adf-testing';

export class CopyMoveDialog {
    dialog = element(by.css(`mat-dialog-container[role='dialog']`));
    header = this.dialog.element(by.css(`header[data-automation-id='content-node-selector-title']`));
    searchInputElement = this.dialog.element(by.css(`input[data-automation-id='content-node-selector-search-input']`));
    searchLabel = this.searchInputElement.element(by.xpath("ancestor::div[@class='mat-form-field-infix']/span/label"));
    siteListDropdown = this.dialog.element(by.css(`mat-select[data-automation-id='site-my-files-option']`));
    cancelButton = element(by.css(`button[data-automation-id='content-node-selector-actions-cancel']`));
    moveCopyButton = element(by.css(`button[data-automation-id='content-node-selector-actions-choose']`));
    contentList = new DocumentListPage(this.dialog);
    loadMoreButton = this.dialog.element(by.css('button[data-automation-id="adf-infinite-pagination-button"]'));

    checkDialogIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.dialog);
        return this;
    }

    checkDialogIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotOnPage(this.dialog);
        return this;
    }

    getDialogHeaderText() {
        BrowserVisibility.waitUntilElementIsVisible(this.header);
        return this.header.getText();
    }

    checkSearchInputIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.searchInputElement);
        return this;
    }

    getSearchLabel() {
        BrowserVisibility.waitUntilElementIsVisible(this.searchLabel);
        return this.searchLabel.getText();
    }

    checkSelectedSiteIsDisplayed(siteName) {
        BrowserVisibility.waitUntilElementIsVisible(this.siteListDropdown.element(by.cssContainingText('.mat-select-value-text span', siteName)));
    }

    checkCancelButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.cancelButton);
    }

    clickCancelButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.cancelButton);
        return this.cancelButton.click();
    }

    checkMoveCopyButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.moveCopyButton);
    }

    getMoveCopyButtonText() {
        BrowserVisibility.waitUntilElementIsVisible(this.moveCopyButton);
        return this.moveCopyButton.getText();
    }

    clickMoveCopyButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.moveCopyButton);
        return this.moveCopyButton.click();
    }

    numberOfResultsDisplayed() {
        return this.contentList.dataTablePage().numberOfRows();
    }

    selectRow(folderName) {
        const row = this.getRowByContent(folderName);
        return row.click();
    }

    checkRowIsSelected(folderName) {
        const selectedRow = this.getRowByContent(folderName).element(by.xpath(`ancestor::div[contains(@class, 'is-selected')]`));
        BrowserVisibility.waitUntilElementIsVisible(selectedRow);
        return this;
    }

    getRowByContent(folderName) {
        const row = element(by.cssContainingText(`div[class*='adf-datatable-row'] div[class*='adf-name-location-cell-name']`, folderName));
        BrowserVisibility.waitUntilElementIsVisible(row);
        return row;
    }

    clickLoadMoreButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.loadMoreButton);
        BrowserVisibility.waitUntilElementIsClickable(this.loadMoreButton);
        this.loadMoreButton.click();
        return this;
    }

    checkLoadMoreButtonIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotOnPage(this.loadMoreButton);
    }

    typeIntoNodeSelectorSearchField(text) {
        BrowserVisibility.waitUntilElementIsVisible(this.searchInputElement);
        this.searchInputElement.sendKeys(text);
    }

    clickContentNodeSelectorResult(name) {
        const resultElement = element.all(by.css(`div[data-automation-id="content-node-selector-content-list"] div[data-automation-id="${name}"`)).first();
        BrowserVisibility.waitUntilElementIsVisible(resultElement);
        BrowserVisibility.waitUntilElementIsClickable(resultElement);
        resultElement.click();
    }

}
