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
import { BrowserVisibility } from '../../core/browser-visibility';
import { SitesDropdownPage } from '../../../../../../e2e/pages/adf/demo-shell/sitesDropdownPage';
import { BreadCrumbDropdownPage } from '../../../../../../e2e/pages/adf/content-services/breadcrumb/breadCrumbDropdownPage';

export class ContentNodeSelectorDialogPage {
    dialog = element(by.css(`adf-content-node-selector`));
    header = this.dialog.element(by.css(`header[data-automation-id='content-node-selector-title']`));
    searchInputElement = this.dialog.element(by.css(`input[data-automation-id='content-node-selector-search-input']`));
    searchLabel = this.searchInputElement.element(by.xpath("ancestor::div[@class='mat-form-field-infix']/span/label"));
    cancelButton = element(by.css(`button[data-automation-id='content-node-selector-actions-cancel']`));
    moveCopyButton = element(by.css(`button[data-automation-id='content-node-selector-actions-choose']`));
    contentList = new DocumentListPage(this.dialog);
    sitesDropdown = new SitesDropdownPage(this.dialog);
    breadCrumbDropdown = new BreadCrumbDropdownPage(this.dialog);

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

    typeIntoNodeSelectorSearchField(text) {
        BrowserVisibility.waitUntilElementIsVisible(this.searchInputElement);
        this.searchInputElement.sendKeys(text);
    }

    clickContentNodeSelectorResult(name) {
        this.contentList.dataTablePage().clickRowByContent(name);
    }

    contentListPage() {
        return this.contentList;
    }

    sitesDropdownPage() {
        return this.sitesDropdown;
    }

    breadCrumbDropdownPage() {
        return this.breadCrumbDropdown;
    }
}
