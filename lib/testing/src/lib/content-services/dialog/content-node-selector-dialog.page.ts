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

import { by, element, ElementFinder } from 'protractor';
import { DocumentListPage } from '../pages/document-list.page';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';

export class ContentNodeSelectorDialogPage {
    dialog: ElementFinder = element(by.css(`adf-content-node-selector`));
    header: ElementFinder = this.dialog.element(by.css(`header[data-automation-id='content-node-selector-title']`));
    searchInputElement: ElementFinder = this.dialog.element(by.css(`input[data-automation-id='content-node-selector-search-input']`));
    searchLabel: ElementFinder = this.searchInputElement.element(by.xpath("ancestor::div[@class='mat-form-field-infix']/span/label"));
    siteListDropdown: ElementFinder = this.dialog.element(by.css(`mat-select[data-automation-id='site-my-files-option']`));
    cancelButton: ElementFinder = element(by.css(`button[data-automation-id='content-node-selector-actions-cancel']`));
    moveCopyButton: ElementFinder = element(by.css(`button[data-automation-id='content-node-selector-actions-choose']`));
    contentList: DocumentListPage = new DocumentListPage(this.dialog);

    async checkDialogIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.dialog);
    }

    async checkDialogIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.dialog);
    }

    async getDialogHeaderText(): Promise<string> {
        return await BrowserActions.getText(this.header);
    }

    async checkSearchInputIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.searchInputElement);
    }

    async getSearchLabel(): Promise<string> {
        return await BrowserActions.getText(this.searchLabel);
    }

    async checkSelectedSiteIsDisplayed(siteName): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.siteListDropdown.element(by.cssContainingText('.mat-select-value-text span', siteName)));
    }

    async checkCancelButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.cancelButton);
    }

    async clickCancelButton(): Promise<void> {
        await BrowserActions.click(this.cancelButton);
    }

    async checkCancelButtonIsEnabled(): Promise<boolean> {
        return await this.cancelButton.isEnabled();
    }

    async checkCopyMoveButtonIsEnabled(): Promise<boolean> {
        return await this.moveCopyButton.isEnabled();
    }

    async checkMoveCopyButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.moveCopyButton);
    }

    async getMoveCopyButtonText(): Promise<string> {
        return await BrowserActions.getText(this.moveCopyButton);
    }

    async clickMoveCopyButton(): Promise<void> {
        await BrowserActions.click(this.moveCopyButton);
    }

    async numberOfResultsDisplayed(): Promise<number> {
        return await this.contentList.dataTablePage().numberOfRows();
    }

    async typeIntoNodeSelectorSearchField(text): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.searchInputElement);
        await BrowserActions.clearSendKeys(this.searchInputElement, text);
    }

    async clickContentNodeSelectorResult(name): Promise<void> {
        await this.contentList.dataTablePage().clickRowByContent(name);
    }

    contentListPage(): DocumentListPage {
        return this.contentList;
    }
}
