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
import { DocumentListPage } from '../pages/document-list.page';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';

export class ContentNodeSelectorDialogPage {
    dialog = element(by.css(`adf-content-node-selector`));
    header = this.dialog.element(by.css(`header[data-automation-id='content-node-selector-title']`));
    searchInputElement = this.dialog.element(by.css(`input[data-automation-id='content-node-selector-search-input']`));
    searchLabel = this.searchInputElement.element(by.xpath("ancestor::div[@class='mat-form-field-infix']/span/label"));
    siteListDropdown = this.dialog.element(by.css(`mat-select[data-automation-id='site-my-files-option']`));
    cancelButton = element(by.css(`button[data-automation-id='content-node-selector-actions-cancel']`));
    moveCopyButton = element(by.css(`button[data-automation-id='content-node-selector-actions-choose']`));
    contentList = new DocumentListPage(this.dialog);

    async checkDialogIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.dialog);
        return this;
    }

    async checkDialogIsNotDisplayed() {
        await BrowserVisibility.waitUntilElementIsNotOnPage(this.dialog);
        return this;
    }

    getDialogHeaderText() {
        return BrowserActions.getText(this.header);
    }

    async checkSearchInputIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.searchInputElement);
        return this;
    }

    getSearchLabel() {
        return BrowserActions.getText(this.searchLabel);
    }

    async checkSelectedSiteIsDisplayed(siteName) {
        await BrowserVisibility.waitUntilElementIsVisible(this.siteListDropdown.element(by.cssContainingText('.mat-select-value-text span', siteName)));
    }

    async checkCancelButtonIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.cancelButton);
    }

    clickCancelButton() {
        return BrowserActions.click(this.cancelButton);
    }

    checkCancelButtonIsEnabled() {
        return this.cancelButton.isEnabled();
    }

    checkCopyMoveButtonIsEnabled() {
        return this.moveCopyButton.isEnabled();
    }

    async checkMoveCopyButtonIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.moveCopyButton);
    }

    getMoveCopyButtonText() {
        return BrowserActions.getText(this.moveCopyButton);
    }

    clickMoveCopyButton() {
        return BrowserActions.click(this.moveCopyButton);
    }

    numberOfResultsDisplayed() {
        return this.contentList.dataTablePage().numberOfRows();
    }

    async typeIntoNodeSelectorSearchField(text) {
        await BrowserVisibility.waitUntilElementIsVisible(this.searchInputElement);
        this.searchInputElement.sendKeys(text);
    }

    clickContentNodeSelectorResult(name) {
        this.contentList.dataTablePage().clickRowByContent(name);
    }

    contentListPage() {
        return this.contentList;
    }
}
