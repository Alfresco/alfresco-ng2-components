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

import { DropActions, BrowserActions, BrowserVisibility, DocumentListPage, DropdownPage, Logger } from '@alfresco/adf-testing';
import { $$, browser, protractor, $ } from 'protractor';
import { FolderDialogPage } from './dialog/folder-dialog.page';
import { NavigationBarPage } from './navigation-bar.page';
import * as path from 'path';

export class ContentServicesPage {
    columns = {
        name: 'Display name',
        size: 'Size',
        nodeId: 'Node id',
        createdBy: 'Created by',
        created: 'Created'
    };

    contentList = new DocumentListPage($$('adf-upload-drag-area adf-document-list').first());
    createFolderDialog = new FolderDialogPage();
    uploadBorder = $('#document-list-container');
    currentFolder = $('div[class*="adf-breadcrumb-item adf-active"] div');
    createFolderButton = $('button[data-automation-id="create-new-folder"]');
    uploadFileButton = $('.adf-upload-button-file-container button');
    uploadFileButtonInput = $('input[data-automation-id="upload-single-file"]');
    uploadMultipleFileButton = $('input[data-automation-id="upload-multiple-files"]');
    uploadFolderButton = $('input[data-automation-id="uploadFolder"]');
    emptyPagination = $('adf-pagination[class*="adf-pagination__empty"]');
    dragAndDrop = $$('adf-upload-drag-area div').first();
    nameHeader = $$('div[data-automation-id="auto_header_content_id_name"] > span').first();
    sizeHeader = $$('div[data-automation-id="auto_header_content_id_content.sizeInBytes"] > span').first();
    createdByHeader = $$('div[data-automation-id="auto_header_content_id_createdByUser.displayName"] > span').first();
    createdHeader = $$('div[data-automation-id="auto_header_content_id_createdAt"] > span').first();
    emptyFolder = $('.adf-empty-folder-this-space-is-empty');
    emptyFolderImage = $('.adf-empty-folder-image');
    nameColumnHeader = 'name';
    createdByColumnHeader = 'createdByUser.displayName';
    createdColumnHeader = 'createdAt';
    deleteContentElement = $('button[data-automation-id="Delete"]');
    versionManagerAction = $('button[data-automation-id="Manage versions"]');
    downloadContent = $('button[data-automation-id="Download"]');
    downloadButton = $('button[title="Download"]');
    multiSelectToggle = $('[data-automation-id="multiSelectToggle"]');
    selectionModeDropdown = $('.mat-select[placeholder="Selection Mode"]');

    async isContextActionEnabled(actionName: string): Promise<boolean> {
        const actionButton = $(`button[data-automation-id="context-${actionName}"`);
        await BrowserVisibility.waitUntilElementIsVisible(actionButton);
        return actionButton.isEnabled();
    }

    getDocumentList(): DocumentListPage {
        return this.contentList;
    }

    async deleteContent(content: string): Promise<void> {
        await this.contentList.clickOnActionMenu(content);
        await BrowserActions.click(this.deleteContentElement);
        await this.checkContentIsNotDisplayed(content);
    }

    async versionManagerContent(content: string): Promise<void> {
        await this.contentList.clickOnActionMenu(content);
        await BrowserActions.click(this.versionManagerAction);
    }

    async getElementsDisplayedId() {
        return this.contentList.dataTablePage().getAllRowsColumnValues(this.columns.nodeId);
    }

    // @deprecated prefer waitTillContentLoaded
    async checkDocumentListElementsAreDisplayed(): Promise<void> {
        await this.checkAcsContainer();
        await this.waitForTableBody();
    }

    // @deprecated prefer waitTillContentLoaded
    async checkAcsContainer(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.uploadBorder);
    }

    // @deprecated prefer waitTillContentLoaded
    async waitForTableBody(): Promise<void> {
        await this.contentList.dataTablePage().waitTillContentLoaded();
    }

    async goToDocumentList(): Promise<void> {
        const navigationBarPage = new NavigationBarPage();
        await navigationBarPage.navigateToContentServices();
        await this.contentList.dataTablePage().waitTillContentLoaded();
    }

    async numberOfResultsDisplayed(): Promise<number> {
        return this.contentList.dataTablePage().numberOfRows();
    }

    async currentFolderName(): Promise<string> {
        return BrowserActions.getText(this.currentFolder);
    }

    async getAllRowsNameColumn(): Promise<any> {
        return this.contentList.getAllRowsColumnValues(this.columns.name);
    }

    async sortByName(sortOrder: string): Promise<any> {
        await this.contentList.dataTable.sortByColumn(sortOrder, this.nameColumnHeader);
    }

    async sortByAuthor(sortOrder: string): Promise<any> {
        await this.contentList.dataTable.sortByColumn(sortOrder, this.createdByColumnHeader);
    }

    async sortByCreated(sortOrder: string): Promise<any> {
        await this.contentList.dataTable.sortByColumn(sortOrder, this.createdColumnHeader);
    }

    async sortAndCheckListIsOrderedByName(sortOrder: string): Promise<any> {
        await this.sortByName(sortOrder);
        return this.checkListIsSortedByNameColumn(sortOrder);
    }

    async checkListIsSortedByNameColumn(sortOrder: string): Promise<any> {
        return this.contentList.dataTablePage().checkListIsSorted(sortOrder, this.columns.name);
    }

    async checkListIsSortedByCreatedColumn(sortOrder: string): Promise<any> {
        return this.contentList.dataTablePage().checkListIsSorted(sortOrder, this.columns.created);
    }

    async checkListIsSortedByAuthorColumn(sortOrder: string): Promise<any> {
        return this.contentList.dataTablePage().checkListIsSorted(sortOrder, this.columns.createdBy);
    }

    async sortAndCheckListIsOrderedByAuthor(sortOrder: string): Promise<any> {
        await this.sortByAuthor(sortOrder);
        return this.checkListIsSortedByAuthorColumn(sortOrder);
    }

    async sortAndCheckListIsOrderedByCreated(sortOrder: string): Promise<any> {
        await this.sortByCreated(sortOrder);
        return this.checkListIsSortedByCreatedColumn(sortOrder);
    }

    async doubleClickRow(nodeName: string): Promise<void> {
        Logger.log(`Open Folder/File ${nodeName}`);
        await this.contentList.doubleClickRow(nodeName);
    }

    async selectRow(nodeName: string): Promise<void> {
        await this.contentList.selectRow(nodeName);
    }

    async clickOnCreateNewFolder(): Promise<void> {
        await BrowserActions.click(this.createFolderButton);
    }

    async createNewFolder(folderName: string): Promise<void> {
        await this.clickOnCreateNewFolder();
        await this.createFolderDialog.addFolderName(folderName);
        await this.createFolderDialog.clickOnCreateUpdateButton();
    }

    async createAndOpenNewFolder(folderName: string): Promise<void> {
        await this.createNewFolder(folderName);
        await this.checkContentIsDisplayed(folderName);
        await this.openFolder(folderName);
    }

    async openFolder(folderName: string): Promise<void> {
        await this.doubleClickRow(folderName);
        await this.contentList.dataTablePage().waitTillContentLoaded();
    }

    async checkContentIsDisplayed(content: string): Promise<void> {
        await this.contentList.dataTablePage().checkContentIsDisplayed(this.columns.name, content);
    }

    async checkContentsAreDisplayed(content: string[]): Promise<void> {
        for (const item of content) {
            await this.checkContentIsDisplayed(item);
        }
    }

    async checkContentIsNotDisplayed(content: string): Promise<void> {
        await this.contentList.dataTablePage().checkContentIsNotDisplayed(this.columns.name, content);
    }

    async deleteAndCheckFolderNotDisplayed(folderName: string): Promise<void> {
        await this.deleteContent(folderName);
        await this.checkContentIsNotDisplayed(folderName);
    }

    async deleteSubFolderUnderRoot(folderName: string, subFolderName: string): Promise<void> {
        await this.goToDocumentList();
        await this.openFolder(folderName);
        await this.deleteAndCheckFolderNotDisplayed(subFolderName);
    }

    async uploadFile(fileLocation: string): Promise<void> {
        await this.checkUploadButton();
        await this.uploadFileButtonInput.sendKeys(path.resolve(path.join(browser.params.testConfig.main.rootPath, fileLocation)));
        await this.checkUploadButton();
    }

    async uploadMultipleFile(files: string[]): Promise<void> {
        await BrowserVisibility.waitUntilElementIsPresent(this.uploadMultipleFileButton);
        let allFiles = path.resolve(path.join(browser.params.testConfig.main.rootPath, files[0]));
        for (let i = 1; i < files.length; i++) {
            allFiles = allFiles + '\n' + path.resolve(path.join(browser.params.testConfig.main.rootPath, files[i]));
        }
        await this.uploadMultipleFileButton.sendKeys(allFiles);
        await BrowserVisibility.waitUntilElementIsPresent(this.uploadMultipleFileButton);
    }

    async uploadFolder(folderLocation: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsPresent(this.uploadFolderButton);
        await this.uploadFolderButton.sendKeys(path.resolve(path.join(browser.params.testConfig.main.rootPath, folderLocation)));
    }

    async checkUploadButton(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsClickable(this.uploadFileButton);
    }

    async enableMediumTimeFormat(): Promise<void> {
        const mediumTimeFormat = $('#enableMediumTimeFormat');
        await BrowserActions.click(mediumTimeFormat);
    }

    async checkPaginationIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.emptyPagination);
    }

    async getDocumentListRowNumber(): Promise<number> {
        const documentList = $('adf-upload-drag-area adf-document-list');
        await BrowserVisibility.waitUntilElementIsVisible(documentList);
        return $$('adf-upload-drag-area adf-document-list .adf-datatable-row').count();
    }

    async checkColumnNameHeader(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.nameHeader);
    }

    async checkColumnSizeHeader(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.sizeHeader);
    }

    async checkColumnCreatedByHeader(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.createdByHeader);
    }

    async checkColumnCreatedHeader(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.createdHeader);
    }

    async checkDragAndDropDIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.dragAndDrop);
    }

    async dragAndDropFile(file: string): Promise<void> {
        await this.checkDragAndDropDIsDisplayed();
        await DropActions.dropFile(this.dragAndDrop, file);
    }

    async checkLockIsDisplayedForElement(name: string): Promise<void> {
        const lockButton = $(`div.adf-datatable-cell[data-automation-id="${name}"] button`);
        await BrowserVisibility.waitUntilElementIsVisible(lockButton);
    }

    async getColumnValueForRow(file: string, columnName: string): Promise<string> {
        return this.contentList.dataTablePage().getColumnValueForRow(this.columns.name, file, columnName);
    }

    async checkEmptyFolderTextToBe(text: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.emptyFolder);
        await expect(await this.emptyFolder.getText()).toContain(text);
    }

    async checkEmptyFolderImageUrlToContain(url): Promise<void> {
        await expect(await BrowserActions.getAttribute(this.emptyFolderImage, 'src')).toContain(url);
    }

    async getAttributeValueForElement(elementName: string, propertyName: string): Promise<string> {
        const elementSize = $(
            `.app-document-list-container div.adf-datatable-cell[data-automation-id="${elementName}"][title="${propertyName}"] span`
        );
        return BrowserActions.getText(elementSize);
    }

    async clickDownloadButton(): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.click(this.downloadButton);
    }

    async clickMultiSelectToggle() {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.click(this.multiSelectToggle);
    }

    async selectFolder(folderName: string): Promise<void> {
        const folderSelected = $(`div[data-automation-id="${folderName}"] .adf-datatable-center-img-ie`);
        await BrowserVisibility.waitUntilElementIsVisible(folderSelected);
        await BrowserActions.click(folderSelected);
    }

    async selectFolderWithCommandKey(folderName: string): Promise<void> {
        await browser.actions().sendKeys(protractor.Key.COMMAND).perform();
        await this.selectRow(folderName);
        await browser.actions().sendKeys(protractor.Key.NULL).perform();
    }

    async chooseSelectionMode(option: string): Promise<void> {
        const dropdownPage = new DropdownPage(this.selectionModeDropdown);
        await dropdownPage.selectDropdownOption(option);
    }
}
