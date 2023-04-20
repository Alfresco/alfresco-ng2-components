/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { $, $$, by } from 'protractor';
import { DocumentListPage } from '../pages/document-list.page';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';
import { DropdownPage } from '../../core/pages/material/dropdown.page';
import { BreadcrumbDropdownPage } from '../pages/breadcrumb/breadcrumb-dropdown.page';
import { Logger } from '../../core/utils/logger';
import { TabPage } from '../../core/pages/form/widgets/tab.page';
import { UploadButtonPage } from '../pages/upload-button.page';
import { FileModel } from '../../core/models/file.model';
import { TestElement } from '../../core/public-api';

export class ContentNodeSelectorDialogPage {
    dialog = $(`adf-content-node-selector`);
    header = this.dialog.$(`h1[data-automation-id='content-node-selector-title']`);
    searchInputElement = this.dialog.$(`input[data-automation-id='content-node-selector-search-input']`);
    searchLabel = this.dialog.$('.adf-content-node-selector-content-input .mat-form-field-label');
    selectedRow = this.dialog.$(`adf-datatable-row[class*="adf-is-selected"]`);
    cancelButton = $(`button[data-automation-id='content-node-selector-actions-cancel']`);
    moveCopyButton = $(`button[data-automation-id='content-node-selector-actions-choose']`);

    contentList = new DocumentListPage(this.dialog);
    dataTable = this.contentList.dataTablePage();
    siteListDropdown = new DropdownPage(this.dialog.$(`mat-select[data-automation-id='site-my-files-option']`));
    breadcrumbDropdown = new BreadcrumbDropdownPage();
    tab: TabPage = new TabPage();
    uploadButtonComponent = new UploadButtonPage();
    selectedFileCounter = TestElement.byCss('adf-node-counter');

    uploadFromLocalTab = $$('*[role="tab"]').get(1);
    uploadFromLocalTabName = 'Upload from your device';
    repositoryTabName = 'Repository';

    breadcrumbDropdownPage(): BreadcrumbDropdownPage {
        return this.breadcrumbDropdown;
    }

    tabPage(): TabPage {
        return this.tab;
    }

    uploadButtonPage(): UploadButtonPage {
        return this.uploadButtonComponent;
    }

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

    async checkSelectedSiteIsDisplayed(siteName: string): Promise<void> {
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
        return this.dataTable.numberOfRows();
    }

    async typeIntoNodeSelectorSearchField(text: string): Promise<void> {
        Logger.log(`Search Node content node selector ${text}`);

        await BrowserVisibility.waitUntilElementIsVisible(this.searchInputElement);
        await BrowserActions.clearSendKeys(this.searchInputElement, text, 100);
        await this.dataTable.waitTillContentLoaded();
    }

    async clickContentNodeSelectorResult(name: string): Promise<void> {
        await this.dataTable.clickRowByContent(name);
        await this.dataTable.checkRowByContentIsSelected(name);
    }

    async doubleClickContentNodeSelectorResult(name: string): Promise<void> {
        await this.dataTable.doubleClickRowByContent(name);
    }

    async attachFileFromContentNode(folderName: string, fileName: string): Promise<void> {
        await this.checkDialogIsDisplayed();
        await this.checkSearchInputIsDisplayed();
        await this.checkCancelButtonIsDisplayed();

        await this.dataTable.waitForTableBody();
        await this.dataTable.waitTillContentLoaded();
        await this.dataTable.checkRowContentIsDisplayed(folderName);
        await this.dataTable.doubleClickRowByContent(folderName);

        await this.dataTable.waitForTableBody();
        await this.dataTable.waitTillContentLoaded();
        await this.dataTable.checkRowContentIsDisplayed(fileName);

        await this.clickContentNodeSelectorResult(fileName);
        await this.checkCopyMoveButtonIsEnabled();
        await this.clickMoveCopyButton();
    }

    async checkFileServerTabIsLoaded(): Promise<void>  {
        await this.checkDialogIsDisplayed();
        await this.dataTable.waitForTableBody();
        await this.breadcrumbDropdown.checkCurrentFolderIsDisplayed();
    }

    async attachFilesFromLocal(files: FileModel[]): Promise<void> {
        await this.checkFileServerTabIsLoaded();

        await this.tab.clickTabByLabel(this.uploadFromLocalTabName);

        await this.uploadButtonComponent.attachFiles(files);

        await this.tab.clickTabByLabel(this.repositoryTabName);

        await this.dataTable.waitForTableBody();
        await this.dataTable.waitTillContentLoaded();
        for ( const file of files) {
            await this.dataTable.checkRowContentIsDisplayed(file.getName());
        }

        await this.checkCopyMoveButtonIsEnabled();
        await this.clickMoveCopyButton();
    }

    async searchAndSelectResult(searchText: string, name: string) {
        await this.typeIntoNodeSelectorSearchField(searchText);
        await this.contentListPage().dataTablePage().waitTillContentLoaded();
        await this.contentListPage().dataTablePage().waitForFirstRow();
        try {
            await this.contentListPage().dataTablePage().checkRowContentIsDisplayed(name);
        } catch (e) {
            Logger.error(`failed to get search result :: ${name}`);
        }
        await this.clickContentNodeSelectorResult(name);
    }

    contentListPage(): DocumentListPage {
        return this.contentList;
    }

    async isUploadFromLocalTabEnabled(): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsPresent(this.uploadFromLocalTab);
        const disabled = await BrowserActions.getAttribute(this.uploadFromLocalTab, 'aria-disabled');
        return disabled === 'false';
    }
}
