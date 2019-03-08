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

import TestConfig = require('../../test.config');
import { Util } from '../../util/util';
import { DocumentListPage } from './content-services/documentListPage';
import { CreateFolderDialog } from './dialog/createFolderDialog';
import { CreateLibraryDialog } from './dialog/createLibraryDialog';
import { NodeActions } from '../../actions/ACS/node.actions';
import { DropActions } from '../../actions/drop.actions';
import { by, element, protractor, $$, browser } from 'protractor';

import path = require('path');

export class ContentServicesPage {

    contentList = new DocumentListPage(element.all(by.css('adf-upload-drag-area adf-document-list')).first());
    createFolderDialog = new CreateFolderDialog();
    nodeActions = new NodeActions();
    createLibraryDialog = new CreateLibraryDialog();
    dragAndDropAction = new DropActions();
    uploadBorder = element(by.id('document-list-container'));
    contentServices = element(by.css('a[data-automation-id="Content Services"]'));
    currentFolder = element(by.css('div[class*="adf-breadcrumb-item adf-active"] div'));
    createFolderButton = element(by.css('button[data-automation-id="create-new-folder"]'));
    createLibraryButton = element(by.css('button[data-automation-id="create-new-library"]'));
    activeBreadcrumb = element(by.css('div[class*="active"]'));
    tooltip = by.css('div[class*="--text adf-full-width"] span');
    uploadFileButton = element(by.css('input[data-automation-id="upload-single-file"]'));
    uploadMultipleFileButton = element(by.css('input[data-automation-id="upload-multiple-files"]'));
    uploadFolderButton = element(by.css('input[data-automation-id="uploadFolder"]'));
    errorSnackBar = element(by.css('simple-snack-bar[class*="mat-simple-snackbar"]'));
    loadMoreButton = element(by.css('button[data-automation-id="adf-infinite-pagination-button"]'));
    emptyPagination = element(by.css('adf-pagination[class*="adf-pagination__empty"]'));
    dragAndDrop = element.all(by.css('adf-upload-drag-area div')).first();
    nameHeader = element(by.css('div[data-automation-id="auto_id_name"] > span'));
    sizeHeader = element(by.css('div[data-automation-id="auto_id_content.sizeInBytes"] > span'));
    createdByHeader = element(by.css('div[data-automation-id="auto_id_createdByUser.displayName"] > span'));
    createdHeader = element(by.css('div[data-automation-id="auto_id_createdAt"] > span'));
    recentFiles = element(by.css('.adf-container-recent'));
    recentFilesExpanded = element(by.css('.adf-container-recent mat-expansion-panel-header.mat-expanded'));
    recentFilesClosed = element(by.css('.adf-container-recent mat-expansion-panel-header'));
    recentFileIcon = element(by.css('.adf-container-recent mat-expansion-panel-header mat-icon'));
    documentListSpinner = element(by.css('mat-progress-spinner'));
    emptyFolder = element(by.css('.adf-empty-folder-this-space-is-empty'));
    emptyFolderImage = element(by.css('.adf-empty-folder-image'));
    emptyRecent = element(by.css('.adf-container-recent .adf-empty-list__title'));
    gridViewButton = element(by.css('button[data-automation-id="document-list-grid-view"]'));
    cardViewContainer = element(by.css('div.adf-document-list-container div.adf-datatable-card'));
    copyButton = element(by.css('button[data-automation-id="content-node-selector-actions-choose"]'));
    searchInputElement = element(by.css('input[data-automation-id="content-node-selector-search-input"]'));
    shareNodeButton = element(by.cssContainingText('mat-icon', ' share '));
    nameColumnHeader = 'name';
    createdByColumnHeader = 'createdByUser.displayName';
    createdColumnHeader = 'createdAt';
    deleteContentElement = element(by.css('button[data-automation-id*="DELETE"]'));
    metadataAction = element(by.css('button[data-automation-id*="METADATA"]'));
    versionManagerAction = element(by.css('button[data-automation-id*="VERSIONS"]'));
    moveContentElement = element(by.css('button[data-automation-id*="MOVE"]'));
    copyContentElement = element(by.css('button[data-automation-id*="COPY"]'));
    lockContentElement = element(by.css('button[data-automation-id="DOCUMENT_LIST.ACTIONS.LOCK"]'));
    downloadContent = element(by.css('button[data-automation-id*="DOWNLOAD"]'));
    siteListDropdown = element(by.css(`mat-select[data-automation-id='site-my-files-option']`));

    pressContextMenuActionNamed(actionName) {
        let actionButton = this.checkContextActionIsVisible(actionName);
        actionButton.click();
    }

    checkContextActionIsVisible(actionName) {
        let actionButton = element(by.css(`button[data-automation-id="context-${actionName}"`));
        Util.waitUntilElementIsVisible(actionButton);
        Util.waitUntilElementIsClickable(actionButton);
        return actionButton;
    }

    getDocumentList() {
        return this.contentList;
    }

    checkLockedIcon(content) {
        return this.contentList.checkLockedIcon(content);
    }

    checkUnlockedIcon(content) {
        return this.contentList.checkUnlockedIcon(content);
    }

    checkDeleteIsDisabled(content) {
        this.contentList.clickOnActionMenu(content);
        this.waitForContentOptions();
        let disabledDelete = element(by.css(`button[data-automation-id*='DELETE'][disabled='true']`));
        Util.waitUntilElementIsVisible(disabledDelete);
    }

    deleteContent(content) {
        this.contentList.clickOnActionMenu(content);
        this.waitForContentOptions();
        this.deleteContentElement.click();
    }

    metadataContent(content) {
        this.contentList.clickOnActionMenu(content);
        this.waitForContentOptions();
        this.metadataAction.click();
    }

    versionManagerContent(content) {
        this.contentList.clickOnActionMenu(content);
        this.waitForContentOptions();
        this.versionManagerAction.click();
    }

    copyContent(content) {
        this.contentList.clickOnActionMenu(content);
        this.copyContentElement.click();
    }

    lockContent(content) {
        this.contentList.clickOnActionMenu(content);
        this.lockContentElement.click();
    }

    waitForContentOptions() {
        Util.waitUntilElementIsVisible(this.copyContentElement);
        Util.waitUntilElementIsVisible(this.moveContentElement);
        Util.waitUntilElementIsVisible(this.deleteContentElement);
        Util.waitUntilElementIsVisible(this.downloadContent);
    }

    clickFileHyperlink(fileName) {
        let hyperlink = this.contentList.dataTablePage().getFileHyperlink(fileName);

        Util.waitUntilElementIsClickable(hyperlink);
        hyperlink.click();
        return this;
    }

    checkFileHyperlinkIsEnabled(fileName) {
        let hyperlink = this.contentList.dataTablePage().getFileHyperlink(fileName);
        Util.waitUntilElementIsVisible(hyperlink);
        return this;
    }

    clickHyperlinkNavigationToggle() {
        let hyperlinkToggle = element(by.cssContainingText('.mat-slide-toggle-content', 'Hyperlink navigation'));
        Util.waitUntilElementIsVisible(hyperlinkToggle);
        hyperlinkToggle.click();
        return this;
    }

    getElementsDisplayedCreated() {
        return this.contentList.dataTablePage().getAllRowsColumnValues('Created');
    }

    getElementsDisplayedSize() {
        return this.contentList.dataTablePage().getAllRowsColumnValues('Size');
    }

    getElementsDisplayedAuthor(alfrescoJsApi) {
        let deferred = protractor.promise.defer();
        let initialList = [];
        let idList = this.getElementsDisplayedId();
        let numberOfElements = this.numberOfResultsDisplayed();
        this.nodeActions.getNodesDisplayed(alfrescoJsApi, idList, numberOfElements).then((nodes) => {
            nodes.forEach((item) => {
                item.entry.createdByUser.id.then((author) => {
                    if (author !== '') {
                        initialList.push(author);
                    }
                });
            });
        }).then(function () {
            deferred.fulfill(initialList);
        });

        return deferred.promise;
    }

    getElementsDisplayedName() {
        return this.contentList.dataTablePage().getAllRowsColumnValues('Display name');
    }

    getElementsDisplayedId() {
        return this.contentList.dataTablePage().getAllRowsColumnValues('Node id');
    }

    checkElementsSortedAsc(elements) {
        let sorted = true;
        let i = 0;
        let compareNumbers = false;

        if (elements && elements[0] && typeof elements[0] === 'number') {
            compareNumbers = true;
        }
        while (elements.length > 1 && sorted === true && i < (elements.length - 1)) {
            const left = compareNumbers ? elements[i] : JSON.stringify(elements[i]);
            const right = compareNumbers ? elements[i + 1] : JSON.stringify(elements[i + 1]);
            if (left > right) {
                sorted = false;
            }
            i++;
        }
        return sorted;
    }

    checkElementsSortedDesc(elements) {
        let sorted = true;
        let i = 0;
        while (elements.length > 1 && sorted === true && i < (elements.length - 1)) {
            if (elements[i] < elements[i + 1]) {
                sorted = false;
            }
            i++;
        }
        return sorted;
    }

    getContentList() {
        return this.contentList;
    }

    checkRecentFileToBeShowed() {
        Util.waitUntilElementIsVisible(this.recentFiles);
    }

    expandRecentFiles() {
        this.checkRecentFileToBeShowed();
        this.checkRecentFileToBeClosed();
        this.recentFilesClosed.click();
        this.checkRecentFileToBeOpened();
    }

    closeRecentFiles() {
        this.checkRecentFileToBeShowed();
        this.checkRecentFileToBeOpened();
        this.recentFilesExpanded.click();
        this.checkRecentFileToBeClosed();
    }

    checkRecentFileToBeClosed() {
        Util.waitUntilElementIsVisible(this.recentFilesClosed);
    }

    checkRecentFileToBeOpened() {
        Util.waitUntilElementIsVisible(this.recentFilesExpanded);
    }

    async getRecentFileIcon() {
        await Util.waitUntilElementIsVisible(this.recentFileIcon);
        return this.recentFileIcon.getText();
    }

    checkAcsContainer() {
        Util.waitUntilElementIsVisible(this.uploadBorder);
        return this;
    }

    waitForTableBody() {
        this.contentList.waitForTableBody();
    }

    goToDocumentList() {
        this.clickOnContentServices();
        this.checkAcsContainer();
        return this;
    }

    clickOnContentServices() {
        Util.waitUntilElementIsVisible(this.contentServices);
        Util.waitUntilElementIsClickable(this.contentServices);
        this.contentServices.click();
    }

    numberOfResultsDisplayed() {
        return this.contentList.dataTablePage().numberOfRows();
    }

    currentFolderName() {
        let deferred = protractor.promise.defer();
        Util.waitUntilElementIsVisible(this.currentFolder);
        this.currentFolder.getText().then(function (result) {
            deferred.fulfill(result);
        });
        return deferred.promise;
    }

    getAllRowsNameColumn() {
        return this.contentList.getAllRowsColumnValues('Display name');
    }

    sortByName(sortOrder) {
        return this.contentList.dataTable.sortByColumn(sortOrder, this.nameColumnHeader);
    }

    sortByAuthor(sortOrder) {
        return this.contentList.dataTable.sortByColumn(sortOrder, this.createdByColumnHeader);
    }

    sortByCreated(sortOrder) {
        return this.contentList.dataTable.sortByColumn(sortOrder, this.createdColumnHeader);
    }

    sortAndCheckListIsOrderedByName(sortOrder) {
        this.sortByName(sortOrder);
        let deferred = protractor.promise.defer();
        this.checkListIsSortedByNameColumn(sortOrder).then((result) => {
            deferred.fulfill(result);
        });
        return deferred.promise;
    }

    async checkListIsSortedByNameColumn(sortOrder) {
        return await this.contentList.dataTablePage().checkListIsSorted(sortOrder, 'Display name');
    }

    async checkListIsSortedByCreatedColumn(sortOrder) {
        return await this.contentList.dataTablePage().checkListIsSorted(sortOrder, 'Created');
    }

    async checkListIsSortedByAuthorColumn(sortOrder) {
        return await this.contentList.dataTablePage().checkListIsSorted(sortOrder, 'Created by');
    }

    async checkListIsSortedBySizeColumn(sortOrder) {
        return await this.contentList.dataTablePage().checkListIsSorted(sortOrder, 'Size');
    }

    sortAndCheckListIsOrderedByAuthor(sortOrder) {
        this.sortByAuthor(sortOrder);
        let deferred = protractor.promise.defer();
        this.checkListIsSortedByAuthorColumn(sortOrder).then((result) => {
            deferred.fulfill(result);
        });
        return deferred.promise;
    }

    sortAndCheckListIsOrderedByCreated(sortOrder) {
        this.sortByCreated(sortOrder);
        let deferred = protractor.promise.defer();
        this.checkListIsSortedByCreatedColumn(sortOrder).then((result) => {
            deferred.fulfill(result);
        });
        return deferred.promise;
    }

    doubleClickRow(nodeName) {
        this.contentList.doubleClickRow(nodeName);
        return this;
    }

    clickOnCreateNewFolder() {
        Util.waitUntilElementIsVisible(this.createFolderButton);
        this.createFolderButton.click();
        return this;
    }

    openCreateLibraryDialog() {
        Util.waitUntilElementIsVisible(this.createLibraryButton);
        this.createLibraryButton.click();
        this.createLibraryDialog.waitForDialogToOpen();
        return this.createLibraryDialog;
    }

    createNewFolder(folder) {
        this.clickOnCreateNewFolder();
        this.createFolderDialog.addFolderName(folder);
        browser.sleep(200);
        this.createFolderDialog.clickOnCreateButton();
        return this;
    }

    checkContentIsDisplayed(content) {
        this.contentList.dataTablePage().checkContentIsDisplayed('Display name', content);
        return this;
    }

    checkContentsAreDisplayed(content) {
        for (let i = 0; i < content.length; i++) {
            this.checkContentIsDisplayed(content[i]);
        }
        return this;
    }

    checkContentIsNotDisplayed(content) {
        this.contentList.dataTablePage().checkContentIsNotDisplayed('Display name', content);
        return this;
    }

    getActiveBreadcrumb() {
        Util.waitUntilElementIsVisible(this.activeBreadcrumb);
        return this.activeBreadcrumb.getAttribute('title');
    }

    uploadFile(fileLocation) {
        this.checkUploadButton();
        Util.waitUntilElementIsVisible(this.uploadFileButton);
        this.uploadFileButton.sendKeys(path.resolve(path.join(TestConfig.main.rootPath, fileLocation)));
        this.checkUploadButton();
        return this;
    }

    uploadMultipleFile(files) {
        Util.waitUntilElementIsVisible(this.uploadMultipleFileButton);
        let allFiles = path.resolve(path.join(TestConfig.main.rootPath, files[0]));
        for (let i = 1; i < files.length; i++) {
            allFiles = allFiles + '\n' + path.resolve(path.join(TestConfig.main.rootPath, files[i]));
        }
        this.uploadMultipleFileButton.sendKeys(allFiles);
        Util.waitUntilElementIsVisible(this.uploadMultipleFileButton);
        return this;
    }

    uploadFolder(folder) {
        Util.waitUntilElementIsVisible(this.uploadFolderButton);
        this.uploadFolderButton.sendKeys(path.resolve(path.join(TestConfig.main.rootPath, folder)));
        Util.waitUntilElementIsVisible(this.uploadFolderButton);
        return this;
    }

    getSingleFileButtonTooltip() {
        Util.waitUntilElementIsVisible(this.uploadFileButton);
        return this.uploadFileButton.getAttribute('title');
    }

    getMultipleFileButtonTooltip() {
        Util.waitUntilElementIsVisible(this.uploadMultipleFileButton);
        return this.uploadMultipleFileButton.getAttribute('title');
    }

    getFolderButtonTooltip() {
        Util.waitUntilElementIsVisible(this.uploadFolderButton);
        return this.uploadFolderButton.getAttribute('title');
    }

    checkUploadButton() {
        Util.waitUntilElementIsVisible(this.uploadFileButton);
        Util.waitUntilElementIsClickable(this.uploadFileButton);
        return this;
    }

    uploadButtonIsEnabled() {
        return this.uploadFileButton.isEnabled();
    }

    getErrorMessage() {
        Util.waitUntilElementIsVisible(this.errorSnackBar);
        let deferred = protractor.promise.defer();
        this.errorSnackBar.getText().then(function (text) {
            deferred.fulfill(text);
        });
        return deferred.promise;
    }

    enableInfiniteScrolling() {
        let infiniteScrollButton = element(by.cssContainingText('.mat-slide-toggle-content', 'Enable Infinite Scrolling'));
        Util.waitUntilElementIsVisible(infiniteScrollButton);
        infiniteScrollButton.click();
        return this;
    }

    enableCustomPermissionMessage() {
        let customPermissionMessage = element(by.cssContainingText('.mat-slide-toggle-content', 'Enable custom permission message'));
        Util.waitUntilElementIsVisible(customPermissionMessage);
        customPermissionMessage.click();
        return this;
    }

    enableMediumTimeFormat() {
        let mediumTimeFormat = element(by.css('#enableMediumTimeFormat'));
        Util.waitUntilElementIsVisible(mediumTimeFormat);
        mediumTimeFormat.click();
        return this;
    }

    enableThumbnails() {
        let thumbnailSlide = element(by.id('adf-thumbnails-upload-switch'));
        Util.waitUntilElementIsVisible(thumbnailSlide);
        thumbnailSlide.click();
        return this;
    }

    clickLoadMoreButton() {
        Util.waitUntilElementIsVisible(this.loadMoreButton);
        Util.waitUntilElementIsClickable(this.loadMoreButton);
        this.loadMoreButton.click();
        return this;
    }

    checkPaginationIsNotDisplayed() {
        Util.waitUntilElementIsVisible(this.emptyPagination);
    }

    getDocumentListRowNumber() {
        let documentList = element(by.css('adf-upload-drag-area adf-document-list'));
        Util.waitUntilElementIsVisible(documentList);
        return $$('adf-upload-drag-area adf-document-list .adf-datatable-row').count();
    }

    checkColumnNameHeader() {
        Util.waitUntilElementIsVisible(this.nameHeader);
    }

    checkColumnSizeHeader() {
        Util.waitUntilElementIsVisible(this.sizeHeader);
    }

    checkColumnCreatedByHeader() {
        Util.waitUntilElementIsVisible(this.createdByHeader);
    }

    checkColumnCreatedHeader() {
        Util.waitUntilElementIsVisible(this.createdHeader);
    }

    checkDragAndDropDIsDisplayed() {
        Util.waitUntilElementIsVisible(this.dragAndDrop);
    }

    dragAndDropFile(file) {
        this.checkDragAndDropDIsDisplayed();
        this.dragAndDropAction.dropFile(this.dragAndDrop, file);
    }

    dragAndDropFolder(folder) {
        this.checkDragAndDropDIsDisplayed();
        this.dragAndDropAction.dropFolder(this.dragAndDrop, folder);
    }

    checkLockIsDisplayedForElement(name) {
        let lockButton = element(by.css(`div.adf-datatable-cell[filename="${name}"] button`));
        Util.waitUntilElementIsVisible(lockButton);
    }

    getColumnValueForRow(file, columnName) {
        return this.contentList.dataTablePage().getColumnValueForRow('Display name', file, columnName);
    }

    async getStyleValueForRowText(rowName, styleName) {
        let row = element(by.css(`div.adf-datatable-cell[filename="${rowName}"] span.adf-datatable-cell-value[title="${rowName}"]`));
        Util.waitUntilElementIsVisible(row);
        return row.getCssValue(styleName);
    }

    checkSpinnerIsShowed() {
        Util.waitUntilElementIsPresent(this.documentListSpinner);
    }

    checkEmptyFolderTextToBe(text) {
        Util.waitUntilElementIsVisible(this.emptyFolder);
        expect(this.emptyFolder.getText()).toContain(text);
    }

    checkEmptyFolderImageUrlToContain(url) {
        Util.waitUntilElementIsVisible(this.emptyFolderImage);
        expect(this.emptyFolderImage.getAttribute('src')).toContain(url);
    }

    checkEmptyRecentFileIsDisplayed() {
        Util.waitUntilElementIsVisible(this.emptyRecent);
    }

    checkIconForRowIsDisplayed(fileName) {
        let iconRow = element(by.css(`.adf-document-list-container div.adf-datatable-cell[filename="${fileName}"] img`));
        Util.waitUntilElementIsVisible(iconRow);
        return iconRow;
    }

    async getRowIconImageUrl(fileName) {
        let iconRow = this.checkIconForRowIsDisplayed(fileName);
        return iconRow.getAttribute('src');
    }

    checkGridViewButtonIsVisible() {
        Util.waitUntilElementIsVisible(this.gridViewButton);
    }

    clickGridViewButton() {
        this.checkGridViewButtonIsVisible();
        this.gridViewButton.click();
    }

    checkCardViewContainerIsDisplayed() {
        Util.waitUntilElementIsVisible(this.cardViewContainer);
    }

    getCardElementShowedInPage() {
        this.checkCardViewContainerIsDisplayed();
        let actualCards = $$('div.adf-document-list-container div.adf-datatable-card div.adf-cell-value img').count();
        return actualCards;
    }

    getDocumentCardIconForElement(elementName) {
        let elementIcon = element(by.css(`.adf-document-list-container div.adf-datatable-cell[filename="${elementName}"] img`));
        return elementIcon.getAttribute('src');
    }

    checkDocumentCardPropertyIsShowed(elementName, propertyName) {
        let elementProperty = element(by.css(`.adf-document-list-container div.adf-datatable-cell[filename="${elementName}"][title="${propertyName}"]`));
        Util.waitUntilElementIsVisible(elementProperty);
    }

    getAttributeValueForElement(elementName, propertyName) {
        let elementSize = element(by.css(`.adf-document-list-container div.adf-datatable-cell[filename="${elementName}"][title="${propertyName}"] span`));
        return elementSize.getText();
    }

    checkMenuIsShowedForElementIndex(elementIndex) {
        let elementMenu = element(by.css(`button[data-automation-id="action_menu_${elementIndex}"]`));
        Util.waitUntilElementIsVisible(elementMenu);
    }

    navigateToCardFolder(folderName) {
        let folderCard = element(by.css(`.adf-document-list-container div.adf-image-table-cell.adf-datatable-cell[filename="${folderName}"]`));
        folderCard.click();
        let folderSelected = element(by.css(`.adf-datatable-row.adf-is-selected div[filename="${folderName}"].adf-datatable-cell--image`));
        Util.waitUntilElementIsVisible(folderSelected);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }

    getGridViewSortingDropdown() {
        let sortingDropdown = element(by.css('mat-select[data-automation-id="grid-view-sorting"]'));
        Util.waitUntilElementIsVisible(sortingDropdown);
        return sortingDropdown;
    }

    selectGridSortingFromDropdown(sortingChosen) {
        let dropdownSorting = this.getGridViewSortingDropdown();
        dropdownSorting.click();
        let optionToClick = element(by.css(`mat-option[data-automation-id="grid-view-sorting-${sortingChosen}"]`));
        Util.waitUntilElementIsPresent(optionToClick);
        optionToClick.click();
    }

    checkRowIsDisplayed(rowName) {
        let row = this.contentList.dataTablePage().getRow('Display name', rowName);
        Util.waitUntilElementIsVisible(row);
    }

    typeIntoNodeSelectorSearchField(text) {
        Util.waitUntilElementIsVisible(this.searchInputElement);
        this.searchInputElement.sendKeys(text);
    }

    clickContentNodeSelectorResult(name) {
        let resultElement = element.all(by.css(`div[data-automation-id="content-node-selector-content-list"] div[filename="${name}"`)).first();
        Util.waitUntilElementIsVisible(resultElement);
        resultElement.click();
    }

    clickCopyButton() {
        Util.waitUntilElementIsClickable(this.copyButton);
        this.copyButton.click();
    }

    clickShareButton() {
        Util.waitUntilElementIsClickable(this.shareNodeButton);
        this.shareNodeButton.click();
    }

    checkSelectedSiteIsDisplayed(siteName) {
        Util.waitUntilElementIsVisible(this.siteListDropdown.element(by.cssContainingText('.mat-select-value-text span', siteName)));
    }
}
