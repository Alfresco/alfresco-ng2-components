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
import { DropdownPage } from '../../material/pages/dropdown.page';

export class ContentNodeSelectorDialogPage {
    dialog: ElementFinder = element(by.css(`adf-content-node-selector`));
    header: ElementFinder = this.dialog.element(by.css(`header[data-automation-id='content-node-selector-title']`));
    searchInputElement: ElementFinder = this.dialog.element(by.css(`input[data-automation-id='content-node-selector-search-input']`));
    searchLabel: ElementFinder = this.searchInputElement.element(by.xpath("ancestor::div[@class='mat-form-field-infix']/span/label"));
    selectedRow: ElementFinder = this.dialog.element(by.css(`adf-datatable-row[class*="adf-is-selected"]`));
    cancelButton: ElementFinder = element(by.css(`button[data-automation-id='content-node-selector-actions-cancel']`));
    moveCopyButton: ElementFinder = element(by.css(`button[data-automation-id='content-node-selector-actions-choose']`));

    contentList: DocumentListPage = new DocumentListPage(this.dialog);
    siteListDropdown = new DropdownPage(this.dialog.element(by.css(`mat-select[data-automation-id='site-my-files-option']`)));

    async checkDialogIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.dialog);
    }

    async checkDialogIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.dialog);
    }

    async getDialogHeaderText(): Promise<string> {
        return BrowserActions.getText(this.header);
    }

    async checkSearchInputIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.searchInputElement);
    }

    async getSearchLabel(): Promise<string> {
        return BrowserActions.getText(this.searchLabel);
    }

    async checkSelectedSiteIsDisplayed(siteName): Promise<void> {
        await this.siteListDropdown.checkOptionIsSelected(siteName);
    }

    async checkSelectedFolder(folderName: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.selectedRow.element(by.cssContainingText('adf-name-location-cell', folderName)));
    }

    async checkCancelButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.cancelButton);
    }

    async clickCancelButton(): Promise<void> {
        await BrowserActions.click(this.cancelButton);
    }

    async checkCancelButtonIsEnabled(): Promise<boolean> {
        return this.cancelButton.isEnabled();
    }

    async checkCopyMoveButtonIsEnabled(): Promise<boolean> {
        return this.moveCopyButton.isEnabled();
    }

    async checkMoveCopyButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.moveCopyButton);
    }

    async getMoveCopyButtonText(): Promise<string> {
        return BrowserActions.getText(this.moveCopyButton);
    }

    async clickMoveCopyButton(): Promise<void> {
        await BrowserActions.click(this.moveCopyButton);
    }

    async numberOfResultsDisplayed(): Promise<number> {
        return this.contentList.dataTablePage().numberOfRows();
    }

    async typeIntoNodeSelectorSearchField(text): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.searchInputElement);
        await BrowserActions.clearSendKeys(this.searchInputElement, text);
    }

    async clickContentNodeSelectorResult(name): Promise<void> {
        await this.contentList.dataTablePage().clickRowByContent(name);
    }

    async doubleClickContentNodeSelectorResult(name): Promise<void> {
        // First click to select from search mode and second click to actually open node
        await this.contentList.dataTablePage().doubleClickRowByContent(name);
        await this.contentList.dataTablePage().doubleClickRowByContent(name);
    }

    async attachFileFromContentNode(folderName: string, fileName: string) {
        await this.checkDialogIsDisplayed();
        await this.checkSearchInputIsDisplayed();
        await this.checkCancelButtonIsDisplayed();

        const contentList = await this.contentListPage();

        await contentList.dataTablePage().waitForTableBody();
        await contentList.dataTablePage().waitTillContentLoaded();
        await contentList.dataTablePage().checkRowContentIsDisplayed(folderName);
        await contentList.dataTablePage().doubleClickRowByContent(folderName);

        await contentList.dataTablePage().waitForTableBody();
        await contentList.dataTablePage().waitTillContentLoaded();
        await contentList.dataTablePage().checkRowContentIsDisplayed(fileName);

        await this.clickContentNodeSelectorResult(fileName);
        await this.checkCopyMoveButtonIsEnabled();
        await this.clickMoveCopyButton();
    }

    contentListPage(): DocumentListPage {
        return this.contentList;
    }
}
