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

import {
    DropActions,
    BrowserActions,
    BrowserVisibility,
    DateUtil,
    DocumentListPage,
    TogglePage,
    DropdownPage,
    Logger
} from '@alfresco/adf-testing';
import { $$, browser, by, element, ElementFinder, protractor, $ } from 'protractor';
import { CreateLibraryDialogPage } from './dialog/create-library-dialog.page';
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
    togglePage = new TogglePage();
    createFolderDialog = new FolderDialogPage();
    createLibraryDialog = new CreateLibraryDialogPage();

    multipleFileUploadToggle = $('#adf-document-list-enable-drop-files');
    uploadBorder = $('#document-list-container');
    contentServices = $('.app-sidenav-link[data-automation-id="Content Services"]');
    currentFolder = $('div[class*="adf-breadcrumb-item adf-active"] div');
    createFolderButton = $('button[data-automation-id="create-new-folder"]');
    editFolderButton = $('button[data-automation-id="edit-folder"]');
    deleteNodesButton = $('button[data-automation-id="delete-toolbar-button"]');
    createLibraryButton = $('button[data-automation-id="create-new-library"]');
    activeBreadcrumb = $('div[class*="active"]');
    uploadFileButton = $('.adf-upload-button-file-container button');
    uploadFileButtonInput = $('input[data-automation-id="upload-single-file"]');
    uploadMultipleFileButton = $('input[data-automation-id="upload-multiple-files"]');
    uploadFolderButton = $('input[data-automation-id="uploadFolder"]');
    errorSnackBar = $('simple-snack-bar[class*="mat-simple-snackbar"]');
    emptyPagination = $('adf-pagination[class*="adf-pagination__empty"]');
    dragAndDrop = $$('adf-upload-drag-area div').first();
    nameHeader = $$('div[data-automation-id="auto_header_content_id_name"] > span').first();
    sizeHeader = $$('div[data-automation-id="auto_header_content_id_content.sizeInBytes"] > span').first();
    createdByHeader = $$('div[data-automation-id="auto_header_content_id_createdByUser.displayName"] > span').first();
    createdHeader = $$('div[data-automation-id="auto_header_content_id_createdAt"] > span').first();
    recentFiles = $('.app-container-recent');
    recentFilesExpanded = $('.app-container-recent mat-expansion-panel-header.mat-expanded');
    recentFilesClosed = $('.app-container-recent mat-expansion-panel-header');
    recentFileIcon = $('.app-container-recent mat-expansion-panel-header mat-icon');
    emptyFolder = $('.adf-empty-folder-this-space-is-empty');
    emptyFolderImage = $('.adf-empty-folder-image');
    emptyRecent = $('.app-container-recent .app-empty-list__title');
    gridViewButton = $('button[data-automation-id="document-list-grid-view"]');
    cardViewContainer = $('div.app-document-list-container div.adf-datatable-card');
    shareNodeButton = element(by.cssContainingText('mat-icon', ' share '));
    nameColumnHeader = 'name';
    createdByColumnHeader = 'createdByUser.displayName';
    createdColumnHeader = 'createdAt';
    deleteContentElement = $('button[data-automation-id*="DELETE"]');
    metadataAction = $('button[data-automation-id*="METADATA"]');
    versionManagerAction = $('button[data-automation-id*="VERSIONS"]');
    moveContentElement = $('button[data-automation-id*="MOVE"]');
    copyContentElement = $('button[data-automation-id*="COPY"]');
    lockContentElement = $('button[data-automation-id="DOCUMENT_LIST.ACTIONS.LOCK"]');
    downloadContent = $('button[data-automation-id*="DOWNLOAD"]');
    downloadButton = $('button[title="Download"]');
    favoriteButton = $('button[data-automation-id="favorite"]');
    markedFavorite = element(by.cssContainingText('button[data-automation-id="favorite"] mat-icon', 'star'));
    notMarkedFavorite = element(by.cssContainingText('button[data-automation-id="favorite"] mat-icon', 'star_border'));
    multiSelectToggle = $('[data-automation-id="multiSelectToggle"]');
    selectAllCheckbox = $$('.adf-checkbox-sr-only').first();
    selectionModeDropdown = $('.mat-select[placeholder="Selection Mode"]');
    selectedNodesList = $$('.app-content-service-settings li');
    siteListDropdown = new DropdownPage($(`mat-select[data-automation-id='site-my-files-option']`));
    sortingDropdown = new DropdownPage($('mat-select[data-automation-id="grid-view-sorting"]'));

    async pressContextMenuActionNamed(actionName): Promise<void> {
        await BrowserActions.clickExecuteScript(`button[data-automation-id="context-${actionName}"]`);
    }

    async checkContextActionIsVisible(actionName) {
        const actionButton = $(`button[data-automation-id="context-${actionName}"`);
        await BrowserVisibility.waitUntilElementIsVisible(actionButton);
    }

    async isContextActionEnabled(actionName): Promise<boolean> {
        const actionButton = $(`button[data-automation-id="context-${actionName}"`);
        await BrowserVisibility.waitUntilElementIsVisible(actionButton);
        return actionButton.isEnabled();
    }

    getDocumentList(): DocumentListPage {
        return this.contentList;
    }

    async closeActionContext(): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
    }

    async checkLockedIcon(content): Promise<void> {
        return this.contentList.checkLockedIcon(content);
    }

    async checkUnlockedIcon(content): Promise<void> {
        return this.contentList.checkUnlockedIcon(content);
    }

    async checkDeleteIsDisabled(content): Promise<void> {
        await this.contentList.clickOnActionMenu(content);
        const disabledDelete = $(`button[data-automation-id*='DELETE'][disabled='true']`);
        await BrowserVisibility.waitUntilElementIsVisible(disabledDelete);
    }

    async deleteContent(content): Promise<void> {
        await this.contentList.clickOnActionMenu(content);
        await BrowserActions.click(this.deleteContentElement);
        await this.checkContentIsNotDisplayed(content);
    }

    async clickDeleteOnToolbar(): Promise<void> {
        await BrowserActions.click(this.deleteNodesButton);
    }

    async checkToolbarDeleteIsDisabled(): Promise<boolean> {
        return !(await this.deleteNodesButton.isEnabled());
    }

    async metadataContent(content): Promise<void> {
        await this.contentList.clickOnActionMenu(content);
        await BrowserActions.click(this.metadataAction);
    }

    async versionManagerContent(content): Promise<void> {
        await this.contentList.clickOnActionMenu(content);
        await BrowserActions.click(this.versionManagerAction);
    }

    async copyContent(content): Promise<void> {
        await this.contentList.clickOnActionMenu(content);
        await BrowserActions.click(this.copyContentElement);
    }

    async moveContent(content): Promise<void> {
        await this.contentList.clickOnActionMenu(content);
        await BrowserActions.click(this.moveContentElement);
    }

    async lockContent(content): Promise<void> {
        await this.contentList.clickOnActionMenu(content);
        await BrowserActions.click(this.lockContentElement);
    }

    async clickFileHyperlink(fileName): Promise<void> {
        const hyperlink = this.contentList.dataTablePage().getFileHyperlink(fileName);
        await BrowserActions.click(hyperlink);
    }

    async checkFileHyperlinkIsEnabled(fileName): Promise<void> {
        const hyperlink = this.contentList.dataTablePage().getFileHyperlink(fileName);
        await BrowserVisibility.waitUntilElementIsVisible(hyperlink);
    }

    async clickHyperlinkNavigationToggle(): Promise<void> {
        const hyperlinkToggle = element(by.cssContainingText('.mat-slide-toggle-content', 'Hyperlink navigation'));
        await BrowserActions.click(hyperlinkToggle);
    }

    async enableDropFilesInAFolder(): Promise<void> {
        await this.togglePage.enableToggle(this.multipleFileUploadToggle);
    }

    async disableDropFilesInAFolder(): Promise<void> {
        await browser.executeScript('arguments[0].scrollIntoView()', this.multipleFileUploadToggle);
        await this.togglePage.disableToggle(this.multipleFileUploadToggle);
    }

    async getElementsDisplayedId() {
        return this.contentList.dataTablePage().getAllRowsColumnValues(this.columns.nodeId);
    }

    checkElementsDateSortedAsc(elements) {
        let sorted = true;
        let i = 0;

        while (elements.length > 1 && sorted === true && i < (elements.length - 1)) {
            const left = DateUtil.parse(elements[i], 'DD-MM-YY');
            const right = DateUtil.parse(elements[i + 1], 'DD-MM-YY');
            if (left > right) {
                sorted = false;
            }
            i++;
        }

        return sorted;
    }

    checkElementsDateSortedDesc(elements) {
        let sorted = true;
        let i = 0;

        while (elements.length > 1 && sorted === true && i < (elements.length - 1)) {
            const left = DateUtil.parse(elements[i], 'DD-MM-YY');
            const right = DateUtil.parse(elements[i + 1], 'DD-MM-YY');
            if (left < right) {
                sorted = false;
            }
            i++;
        }

        return sorted;
    }

    async checkRecentFileToBeShowed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.recentFiles);
    }

    async expandRecentFiles(): Promise<void> {
        await this.checkRecentFileToBeShowed();
        await this.checkRecentFileToBeClosed();
        await BrowserActions.click(this.recentFilesClosed);
        await this.checkRecentFileToBeOpened();
    }

    async closeRecentFiles(): Promise<void> {
        await this.checkRecentFileToBeShowed();
        await this.checkRecentFileToBeOpened();
        await BrowserActions.click(this.recentFilesExpanded);
        await this.checkRecentFileToBeClosed();
    }

    async checkRecentFileToBeClosed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.recentFilesClosed);
    }

    async checkRecentFileToBeOpened(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.recentFilesExpanded);
    }

    async getRecentFileIcon(): Promise<string> {
        return BrowserActions.getText(this.recentFileIcon);
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

    async clickOnContentServices(): Promise<void> {
        await BrowserActions.click(this.contentServices);
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

    async checkListIsSortedBySizeColumn(sortOrder: string): Promise<any> {
        return this.contentList.dataTablePage().checkListIsSorted(sortOrder, this.columns.size);
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

    async selectRow(nodeName): Promise<void> {
        await this.contentList.selectRow(nodeName);
    }

    async clickOnCreateNewFolder(): Promise<void> {
        await BrowserActions.click(this.createFolderButton);
    }

    async clickOnFavoriteButton(): Promise<void> {
        await BrowserActions.click(this.favoriteButton);
    }

    async checkIsMarkedFavorite(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.markedFavorite);
    }

    async checkIsNotMarkedFavorite(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.notMarkedFavorite);
    }

    async clickOnEditFolder(): Promise<void> {
        await BrowserActions.click(this.editFolderButton);
    }

    async isEditFolderButtonEnabled(): Promise<boolean> {
        return this.editFolderButton.isEnabled();
    }

    async openCreateLibraryDialog(): Promise<void> {
        await BrowserActions.click(this.createLibraryButton);
        await this.createLibraryDialog.libraryDialog.waitVisible();
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

    async checkContentIsDisplayed(content): Promise<void> {
        await this.contentList.dataTablePage().checkContentIsDisplayed(this.columns.name, content);
    }

    async checkContentsAreDisplayed(content): Promise<void> {
        for (let i = 0; i < content.length; i++) {
            await this.checkContentIsDisplayed(content[i]);
        }
    }

    async checkContentIsNotDisplayed(content): Promise<void> {
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

    async getActiveBreadcrumb(): Promise<string> {
        return BrowserActions.getAttribute(this.activeBreadcrumb, 'title');
    }

    async uploadFile(fileLocation): Promise<void> {
        await this.checkUploadButton();
        await this.uploadFileButtonInput.sendKeys(path.resolve(path.join(browser.params.testConfig.main.rootPath, fileLocation)));
        await this.checkUploadButton();
    }

    async uploadMultipleFile(files): Promise<void> {
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

    async getSingleFileButtonTooltip(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsPresent(this.uploadFileButton);
        return BrowserActions.getAttribute(this.uploadFileButtonInput, 'title');
    }

    async getMultipleFileButtonTooltip(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsPresent(this.uploadMultipleFileButton);
        return BrowserActions.getAttribute(this.uploadMultipleFileButton, 'title');
    }

    async getFolderButtonTooltip(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsPresent(this.uploadFolderButton);
        return BrowserActions.getAttribute(this.uploadFolderButton, 'title');
    }

    async checkUploadButton(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsClickable(this.uploadFileButton);
    }

    async uploadButtonIsEnabled(): Promise<boolean> {
        return this.uploadFileButton.isEnabled();
    }

    async getErrorMessage(): Promise<string> {
        return BrowserActions.getText(this.errorSnackBar);
    }

    async enableInfiniteScrolling(): Promise<void> {
        const infiniteScrollButton = element(by.cssContainingText('.mat-slide-toggle-content', 'Enable Infinite Scrolling'));
        await BrowserActions.click(infiniteScrollButton);
    }

    async enableCustomPermissionMessage(): Promise<void> {
        const customPermissionMessage = element(by.cssContainingText('.mat-slide-toggle-content', 'Enable custom permission message'));
        await BrowserActions.click(customPermissionMessage);
    }

    async enableMediumTimeFormat(): Promise<void> {
        const mediumTimeFormat = $('#enableMediumTimeFormat');
        await BrowserActions.click(mediumTimeFormat);
    }

    async enableThumbnails(): Promise<void> {
        const thumbnailSlide = $('#adf-thumbnails-upload-switch');
        await BrowserActions.click(thumbnailSlide);
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

    async dragAndDropFolder(folderName: string): Promise<void> {
        await this.checkDragAndDropDIsDisplayed();
        await DropActions.dropFolder(this.dragAndDrop, folderName);
    }

    async checkLockIsDisplayedForElement(name): Promise<void> {
        const lockButton = $(`div.adf-datatable-cell[data-automation-id="${name}"] button`);
        await BrowserVisibility.waitUntilElementIsVisible(lockButton);
    }

    async getColumnValueForRow(file, columnName): Promise<string> {
        return this.contentList.dataTablePage().getColumnValueForRow(this.columns.name, file, columnName);
    }

    async getStyleValueForRowText(rowName, styleName): Promise<string> {
        const row = $(`div.adf-datatable-cell[data-automation-id="${rowName}"] span.adf-datatable-cell-value[title="${rowName}"]`);
        await BrowserVisibility.waitUntilElementIsVisible(row);
        return row.getCssValue(styleName);
    }

    async checkEmptyFolderTextToBe(text): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.emptyFolder);
        await expect(await this.emptyFolder.getText()).toContain(text);
    }

    async checkEmptyFolderImageUrlToContain(url): Promise<void> {
        await expect(await BrowserActions.getAttribute(this.emptyFolderImage, 'src')).toContain(url);
    }

    async checkEmptyRecentFileIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.emptyRecent);
    }

    async getRowIconImageUrl(fileName): Promise<string> {
        const iconRow = $(`.app-document-list-container div.adf-datatable-cell[data-automation-id="${fileName}"] img`);
        return BrowserActions.getAttribute(iconRow, 'src');
    }

    async checkGridViewButtonIsVisible(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.gridViewButton);
    }

    async clickGridViewButton(): Promise<void> {
        await this.checkGridViewButtonIsVisible();
        await BrowserActions.click(this.gridViewButton);
    }

    async checkCardViewContainerIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.cardViewContainer);
    }

    async getCardElementShowedInPage(): Promise<number> {
        await BrowserVisibility.waitUntilElementIsVisible(this.cardViewContainer);
        return $$('div.app-document-list-container div.adf-datatable-card div.adf-cell-value img').count();
    }

    async getDocumentCardIconForElement(elementName): Promise<string> {
        const elementIcon = $(`.app-document-list-container div.adf-datatable-cell[data-automation-id="${elementName}"] img`);
        return BrowserActions.getAttribute(elementIcon, 'src');
    }

    async checkDocumentCardPropertyIsShowed(elementName, propertyName): Promise<void> {
        const elementProperty = $(`.app-document-list-container div.adf-datatable-cell[data-automation-id="${elementName}"][title="${propertyName}"]`);
        await BrowserVisibility.waitUntilElementIsVisible(elementProperty);
    }

    async getAttributeValueForElement(elementName, propertyName): Promise<string> {
        const elementSize = $(`.app-document-list-container div.adf-datatable-cell[data-automation-id="${elementName}"][title="${propertyName}"] span`);
        return BrowserActions.getText(elementSize);
    }

    async checkMenuIsShowedForElementIndex(elementIndex): Promise<void> {
        const elementMenu = $(`button[data-automation-id="action_menu_${elementIndex}"]`);
        await BrowserVisibility.waitUntilElementIsVisible(elementMenu);
    }

    async navigateToCardFolder(folderName): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        const folderCard = $(`.app-document-list-container div.adf-image-table-cell.adf-datatable-cell[data-automation-id="${folderName}"]`);
        await BrowserActions.click(folderCard);
        const folderSelected = $(`.adf-datatable-row.adf-is-selected div[data-automation-id="${folderName}"].adf-datatable-cell--image`);
        await BrowserVisibility.waitUntilElementIsVisible(folderSelected);
        await browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }

    async selectGridSortingFromDropdown(sortingOption): Promise<void> {
        await this.sortingDropdown.selectDropdownOption(sortingOption);
    }

    async checkRowIsDisplayed(rowName): Promise<void> {
        const row = this.contentList.dataTablePage().getCellElementByValue(this.columns.name, rowName);
        await BrowserVisibility.waitUntilElementIsVisible(row);
    }

    async clickShareButton(): Promise<void> {
        await browser.sleep(2000);
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.click(this.shareNodeButton);
    }

    async checkSelectedSiteIsDisplayed(siteName): Promise<void> {
        await this.siteListDropdown.checkOptionIsSelected(siteName);
    }

    async clickDownloadButton(): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.click(this.downloadButton);
    }

    async clickMultiSelectToggle() {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.click(this.multiSelectToggle);
    }

    async multiSelectToggleIsEnabled(): Promise<boolean> {
        return this.multiSelectToggle.isEnabled();
    }

    async clickSelectAllCheckbox(): Promise<void> {
        await BrowserActions.click(this.selectAllCheckbox);
    }

    getRowByName(rowName: string): ElementFinder {
        return this.contentList.dataTable.getRow(this.columns.name, rowName);
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

    async getItemSelected(): Promise<string> {
        return BrowserActions.getArrayText(this.selectedNodesList);
    }

    async selectItemWithCheckbox(itemName: string): Promise<void> {
        const item = $(`adf-datatable-row[aria-label="${itemName}"] mat-checkbox .mat-checkbox-input`);
        await BrowserVisibility.waitUntilElementIsVisible(item);
        await BrowserActions.click(item);
    }

    async unSelectItemWithCheckbox(itemName: string): Promise<void> {
        const item = $(`adf-datatable-row[aria-label="${itemName} selected"] mat-checkbox .mat-checkbox-input`);
        await BrowserVisibility.waitUntilElementIsVisible(item);
        await BrowserActions.click(item);
    }
}
