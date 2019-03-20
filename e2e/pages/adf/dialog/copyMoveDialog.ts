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
import { Util } from '../../../util/util';
import { DocumentListPage } from '../content-services/documentListPage';

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
        Util.waitUntilElementIsVisible(this.dialog);
        return this;
    }

    checkDialogIsNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.dialog);
        return this;
    }

    getDialogHeaderText() {
        Util.waitUntilElementIsVisible(this.header);
        return this.header.getText();
    }

    checkSearchInputIsDisplayed() {
        Util.waitUntilElementIsVisible(this.searchInputElement);
        return this;
    }

    getSearchLabel() {
        Util.waitUntilElementIsVisible(this.searchLabel);
        return this.searchLabel.getText();
    }

    checkSelectedSiteIsDisplayed(siteName) {
        Util.waitUntilElementIsVisible(this.siteListDropdown.element(by.cssContainingText('.mat-select-value-text span', siteName)));
    }

    checkCancelButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.cancelButton);
    }

    clickCancelButton() {
        Util.waitUntilElementIsVisible(this.cancelButton);
        return this.cancelButton.click();
    }

    checkMoveCopyButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.moveCopyButton);
    }

    getMoveCopyButtonText() {
        Util.waitUntilElementIsVisible(this.moveCopyButton);
        return this.moveCopyButton.getText();
    }

    clickMoveCopyButton() {
        Util.waitUntilElementIsVisible(this.moveCopyButton);
        return this.moveCopyButton.click();
    }

    numberOfResultsDisplayed() {
        return this.contentList.dataTablePage().numberOfRows();
    }

    selectRow(folderName) {
        let row = this.getRow(folderName).element(by.xpath(`ancestor::div[contains(@class, 'adf-datatable-row')]`));
        return row.click();
    }

    checkRowIsSelected(folderName) {
            let selectedRow = this.getRow(folderName).element(by.xpath(`ancestor::div[contains(@class, 'is-selected')]`));
            Util.waitUntilElementIsVisible(selectedRow);
            return this;
    }

    getRow(folderName) {
        let row = (element.all(by.css(`div[class*='adf-datatable-row'] div[filename='${folderName}']`))).first();
        Util.waitUntilElementIsVisible(row);
        return row;
    }

    clickLoadMoreButton() {
        Util.waitUntilElementIsVisible(this.loadMoreButton);
        Util.waitUntilElementIsClickable(this.loadMoreButton);
        this.loadMoreButton.click();
        return this;
    }

    checkLoadMoreButtonIsNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.loadMoreButton);
    }

}
