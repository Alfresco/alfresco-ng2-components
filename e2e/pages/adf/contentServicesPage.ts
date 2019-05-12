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
import { CreateFolderDialog } from './dialog/createFolderDialog';
import { CreateLibraryDialog } from './dialog/createLibraryDialog';
import { FormControllersPage } from '@alfresco/adf-testing';
import { DropActions } from '../../actions/drop.actions';
import { by, element, protractor, $$, browser } from 'protractor';

import path = require('path');
import { DateUtil } from '../../util/dateUtil';
import { BrowserVisibility, DocumentListPage, BrowserActions } from '@alfresco/adf-testing';
import { NavigationBarPage } from './navigationBarPage';

export class ContentServicesPage {

    columns = {
        name: 'Display name',
        size: 'Size',
        nodeId: 'Node id',
        createdBy: 'Created by',
        created: 'Created'
    };

    contentList = new DocumentListPage(element.all(by.css('adf-upload-drag-area adf-document-list')).first());
    formControllersPage = new FormControllersPage();
    multipleFileUploadToggle = element(by.id('adf-document-list-enable-drop-files'));
    createFolderDialog = new CreateFolderDialog();
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
    downloadButton = element(by.css('button[title="Download"]'));
    multiSelectToggle = element(by.cssContainingText('span.mat-slide-toggle-content', ' Multiselect (with checkboxes) '));

    pressContextMenuActionNamed(actionName) {
        BrowserActions.clickExecuteScript(`button[data-automation-id="context-${actionName}"]`);
    }

    checkContextActionIsVisible(actionName) {
        const actionButton = element(by.css(`button[data-automation-id="context-${actionName}"`));
        BrowserVisibility.waitUntilElementIsVisible(actionButton);
        BrowserVisibility.waitUntilElementIsClickable(actionButton);
        return actionButton;
    }

    getDocumentList() {
        return this.contentList;
    }

    closeActionContext() {
        BrowserActions.closeMenuAndDialogs();
        return this;
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
        const disabledDelete = element(by.css(`button[data-automation-id*='DELETE'][disabled='true']`));
        BrowserVisibility.waitUntilElementIsVisible(disabledDelete);
    }

    deleteContent(content) {
        this.contentList.clickOnActionMenu(content);
        this.waitForContentOptions();
        BrowserActions.click(this.deleteContentElement);
    }

    metadataContent(content) {
        this.contentList.clickOnActionMenu(content);
        this.waitForContentOptions();
        BrowserActions.click(this.metadataAction);
    }

    versionManagerContent(content) {
        this.contentList.clickOnActionMenu(content);
        this.waitForContentOptions();
        BrowserActions.click(this.versionManagerAction);
    }

    copyContent(content) {
        this.contentList.clickOnActionMenu(content);
        BrowserActions.click(this.copyContentElement);
    }

    lockContent(content) {
        this.contentList.clickOnActionMenu(content);
        BrowserActions.click(this.lockContentElement);
    }

    waitForContentOptions() {
        BrowserVisibility.waitUntilElementIsVisible(this.copyContentElement);
        BrowserVisibility.waitUntilElementIsVisible(this.moveContentElement);
        BrowserVisibility.waitUntilElementIsVisible(this.deleteContentElement);
        BrowserVisibility.waitUntilElementIsVisible(this.downloadContent);
    }

    clickFileHyperlink(fileName) {
        const hyperlink = this.contentList.dataTablePage().getFileHyperlink(fileName);

        BrowserActions.click(hyperlink);
        return this;
    }

    checkFileHyperlinkIsEnabled(fileName) {
        const hyperlink = this.contentList.dataTablePage().getFileHyperlink(fileName);
        BrowserVisibility.waitUntilElementIsVisible(hyperlink);
        return this;
    }

    clickHyperlinkNavigationToggle() {
        const hyperlinkToggle = element(by.cssContainingText('.mat-slide-toggle-content', 'Hyperlink navigation'));
        BrowserActions.click(hyperlinkToggle);
        return this;
    }

    enableDropFilesInAFolder() {
        this.formControllersPage.enableToggle(this.multipleFileUploadToggle);
        return this;
    }

    disableDropFilesInAFolder() {
        this.formControllersPage.disableToggle(this.multipleFileUploadToggle);
        return this;
    }

    getElementsDisplayedSize() {
        return this.contentList.dataTablePage().getAllRowsColumnValues(this.columns.size);
    }

    getElementsDisplayedName() {
        return this.contentList.dataTablePage().getAllRowsColumnValues(this.columns.name);
    }

    getElementsDisplayedId() {
        return this.contentList.dataTablePage().getAllRowsColumnValues(this.columns.nodeId);
    }

    checkElementsSortedAsc(elements) {
        let sorted = true;
        let i = 0;

        while (elements.length > 1 && sorted === true && i < (elements.length - 1)) {
            const left = elements[i];
            const right = elements[i + 1];
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
            const left = elements[i];
            const right = elements[i + 1];
            if (left < right) {
                sorted = false;
            }
            i++;
        }

        return sorted;
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

    getContentList() {
        return this.contentList;
    }

    checkRecentFileToBeShowed() {
        BrowserVisibility.waitUntilElementIsVisible(this.recentFiles);
    }

    expandRecentFiles() {
        this.checkRecentFileToBeShowed();
        this.checkRecentFileToBeClosed();
        BrowserActions.click(this.recentFilesClosed);
        this.checkRecentFileToBeOpened();
    }

    closeRecentFiles() {
        this.checkRecentFileToBeShowed();
        this.checkRecentFileToBeOpened();
        BrowserActions.click(this.recentFilesExpanded);
        this.checkRecentFileToBeClosed();
    }

    checkRecentFileToBeClosed() {
        BrowserVisibility.waitUntilElementIsVisible(this.recentFilesClosed);
    }

    checkRecentFileToBeOpened() {
        BrowserVisibility.waitUntilElementIsVisible(this.recentFilesExpanded);
    }

    async getRecentFileIcon() {
        return BrowserActions.getText(this.recentFileIcon);
    }

    checkAcsContainer() {
        return BrowserVisibility.waitUntilElementIsVisible(this.uploadBorder);
    }

    async waitForTableBody() {
        await this.contentList.waitForTableBody();
    }

    goToDocumentList() {
        const navigationBarPage = new NavigationBarPage();
        navigationBarPage.clickContentServicesButton();
        return this;
    }

    clickOnContentServices() {
        BrowserActions.click(this.contentServices);
    }

    numberOfResultsDisplayed() {
        return this.contentList.dataTablePage().numberOfRows();
    }

    currentFolderName() {
        const deferred = protractor.promise.defer();
        BrowserVisibility.waitUntilElementIsVisible(this.currentFolder);
        this.currentFolder.getText().then(function (result) {
            deferred.fulfill(result);
        });
        return deferred.promise;
    }

    getAllRowsNameColumn() {
        return this.contentList.getAllRowsColumnValues(this.columns.name);
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
        const deferred = protractor.promise.defer();
        this.checkListIsSortedByNameColumn(sortOrder).then((result) => {
            deferred.fulfill(result);
        });
        return deferred.promise;
    }

    async checkListIsSortedByNameColumn(sortOrder) {
        return await this.contentList.dataTablePage().checkListIsSorted(sortOrder, this.columns.name);
    }

    async checkListIsSortedByCreatedColumn(sortOrder) {
        return await this.contentList.dataTablePage().checkListIsSorted(sortOrder, this.columns.created);
    }

    async checkListIsSortedByAuthorColumn(sortOrder) {
        return await this.contentList.dataTablePage().checkListIsSorted(sortOrder, this.columns.createdBy);
    }

    async checkListIsSortedBySizeColumn(sortOrder) {
        return await this.contentList.dataTablePage().checkListIsSorted(sortOrder, this.columns.size);
    }

    sortAndCheckListIsOrderedByAuthor(sortOrder) {
        this.sortByAuthor(sortOrder);
        const deferred = protractor.promise.defer();
        this.checkListIsSortedByAuthorColumn(sortOrder).then((result) => {
            deferred.fulfill(result);
        });
        return deferred.promise;
    }

    sortAndCheckListIsOrderedByCreated(sortOrder) {
        this.sortByCreated(sortOrder);
        const deferred = protractor.promise.defer();
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
        BrowserActions.click(this.createFolderButton);
        return this;
    }

    openCreateLibraryDialog() {
        BrowserActions.click(this.createLibraryButton);
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
        this.contentList.dataTablePage().checkContentIsDisplayed(this.columns.name, content);
        return this;
    }

    checkContentsAreDisplayed(content) {
        for (let i = 0; i < content.length; i++) {
            this.checkContentIsDisplayed(content[i]);
        }
        return this;
    }

    checkContentIsNotDisplayed(content) {
        this.contentList.dataTablePage().checkContentIsNotDisplayed(this.columns.name, content);
        return this;
    }

    getActiveBreadcrumb() {
        BrowserVisibility.waitUntilElementIsVisible(this.activeBreadcrumb);
        return this.activeBreadcrumb.getAttribute('title');
    }

    uploadFile(fileLocation) {
        this.checkUploadButton();
        BrowserVisibility.waitUntilElementIsVisible(this.uploadFileButton);
        this.uploadFileButton.sendKeys(path.resolve(path.join(TestConfig.main.rootPath, fileLocation)));
        this.checkUploadButton();
        return this;
    }

    uploadMultipleFile(files) {
        BrowserVisibility.waitUntilElementIsVisible(this.uploadMultipleFileButton);
        let allFiles = path.resolve(path.join(TestConfig.main.rootPath, files[0]));
        for (let i = 1; i < files.length; i++) {
            allFiles = allFiles + '\n' + path.resolve(path.join(TestConfig.main.rootPath, files[i]));
        }
        this.uploadMultipleFileButton.sendKeys(allFiles);
        BrowserVisibility.waitUntilElementIsVisible(this.uploadMultipleFileButton);
        return this;
    }

    uploadFolder(folder) {
        BrowserVisibility.waitUntilElementIsVisible(this.uploadFolderButton);
        this.uploadFolderButton.sendKeys(path.resolve(path.join(TestConfig.main.rootPath, folder)));
        BrowserVisibility.waitUntilElementIsVisible(this.uploadFolderButton);
        return this;
    }

    getSingleFileButtonTooltip() {
        BrowserVisibility.waitUntilElementIsVisible(this.uploadFileButton);
        return this.uploadFileButton.getAttribute('title');
    }

    getMultipleFileButtonTooltip() {
        BrowserVisibility.waitUntilElementIsVisible(this.uploadMultipleFileButton);
        return this.uploadMultipleFileButton.getAttribute('title');
    }

    getFolderButtonTooltip() {
        BrowserVisibility.waitUntilElementIsVisible(this.uploadFolderButton);
        return this.uploadFolderButton.getAttribute('title');
    }

    checkUploadButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.uploadFileButton);
        BrowserVisibility.waitUntilElementIsClickable(this.uploadFileButton);
        return this;
    }

    uploadButtonIsEnabled() {
        return this.uploadFileButton.isEnabled();
    }

    getErrorMessage() {
        BrowserVisibility.waitUntilElementIsVisible(this.errorSnackBar);
        const deferred = protractor.promise.defer();
        this.errorSnackBar.getText().then(function (text) {
            deferred.fulfill(text);
        });
        return deferred.promise;
    }

    enableInfiniteScrolling() {
        const infiniteScrollButton = element(by.cssContainingText('.mat-slide-toggle-content', 'Enable Infinite Scrolling'));
        BrowserActions.click(infiniteScrollButton);
        return this;
    }

    enableCustomPermissionMessage() {
        const customPermissionMessage = element(by.cssContainingText('.mat-slide-toggle-content', 'Enable custom permission message'));
        BrowserActions.click(customPermissionMessage);
        return this;
    }

    enableMediumTimeFormat() {
        const mediumTimeFormat = element(by.css('#enableMediumTimeFormat'));
        BrowserActions.click(mediumTimeFormat);
        return this;
    }

    enableThumbnails() {
        const thumbnailSlide = element(by.id('adf-thumbnails-upload-switch'));
        BrowserActions.click(thumbnailSlide);
        return this;
    }

    checkPaginationIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.emptyPagination);
    }

    getDocumentListRowNumber() {
        const documentList = element(by.css('adf-upload-drag-area adf-document-list'));
        BrowserVisibility.waitUntilElementIsVisible(documentList);
        return $$('adf-upload-drag-area adf-document-list .adf-datatable-row').count();
    }

    checkColumnNameHeader() {
        BrowserVisibility.waitUntilElementIsVisible(this.nameHeader);
    }

    checkColumnSizeHeader() {
        BrowserVisibility.waitUntilElementIsVisible(this.sizeHeader);
    }

    checkColumnCreatedByHeader() {
        BrowserVisibility.waitUntilElementIsVisible(this.createdByHeader);
    }

    checkColumnCreatedHeader() {
        BrowserVisibility.waitUntilElementIsVisible(this.createdHeader);
    }

    checkDragAndDropDIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.dragAndDrop);
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
        const lockButton = element(by.css(`div.adf-datatable-cell[data-automation-id="${name}"] button`));
        BrowserVisibility.waitUntilElementIsVisible(lockButton);
    }

    getColumnValueForRow(file, columnName) {
        return this.contentList.dataTablePage().getColumnValueForRow(this.columns.name, file, columnName);
    }

    async getStyleValueForRowText(rowName, styleName) {
        const row = element(by.css(`div.adf-datatable-cell[data-automation-id="${rowName}"] span.adf-datatable-cell-value[title="${rowName}"]`));
        BrowserVisibility.waitUntilElementIsVisible(row);
        return row.getCssValue(styleName);
    }

    checkSpinnerIsShowed() {
        BrowserVisibility.waitUntilElementIsPresent(this.documentListSpinner);
    }

    checkEmptyFolderTextToBe(text) {
        BrowserVisibility.waitUntilElementIsVisible(this.emptyFolder);
        expect(this.emptyFolder.getText()).toContain(text);
    }

    checkEmptyFolderImageUrlToContain(url) {
        BrowserVisibility.waitUntilElementIsVisible(this.emptyFolderImage);
        expect(this.emptyFolderImage.getAttribute('src')).toContain(url);
    }

    checkEmptyRecentFileIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.emptyRecent);
    }

    checkIconForRowIsDisplayed(fileName) {
        const iconRow = element(by.css(`.adf-document-list-container div.adf-datatable-cell[data-automation-id="${fileName}"] img`));
        BrowserVisibility.waitUntilElementIsVisible(iconRow);
        return iconRow;
    }

    async getRowIconImageUrl(fileName) {
        const iconRow = this.checkIconForRowIsDisplayed(fileName);
        return iconRow.getAttribute('src');
    }

    checkGridViewButtonIsVisible() {
        BrowserVisibility.waitUntilElementIsVisible(this.gridViewButton);
    }

    clickGridViewButton() {
        this.checkGridViewButtonIsVisible();
        BrowserActions.click(this.gridViewButton);
    }

    checkCardViewContainerIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.cardViewContainer);
    }

    getCardElementShowedInPage() {
        this.checkCardViewContainerIsDisplayed();
        const actualCards = $$('div.adf-document-list-container div.adf-datatable-card div.adf-cell-value img').count();
        return actualCards;
    }

    getDocumentCardIconForElement(elementName) {
        const elementIcon = element(by.css(`.adf-document-list-container div.adf-datatable-cell[data-automation-id="${elementName}"] img`));
        return elementIcon.getAttribute('src');
    }

    checkDocumentCardPropertyIsShowed(elementName, propertyName) {
        const elementProperty = element(by.css(`.adf-document-list-container div.adf-datatable-cell[data-automation-id="${elementName}"][title="${propertyName}"]`));
        BrowserVisibility.waitUntilElementIsVisible(elementProperty);
    }

    getAttributeValueForElement(elementName, propertyName) {
        const elementSize = element(by.css(`.adf-document-list-container div.adf-datatable-cell[data-automation-id="${elementName}"][title="${propertyName}"] span`));
        return BrowserActions.getText(elementSize);
    }

    checkMenuIsShowedForElementIndex(elementIndex) {
        const elementMenu = element(by.css(`button[data-automation-id="action_menu_${elementIndex}"]`));
        BrowserVisibility.waitUntilElementIsVisible(elementMenu);
    }

    navigateToCardFolder(folderName) {
        BrowserActions.closeMenuAndDialogs();
        const folderCard = element(by.css(`.adf-document-list-container div.adf-image-table-cell.adf-datatable-cell[data-automation-id="${folderName}"]`));
        folderCard.click();
        const folderSelected = element(by.css(`.adf-datatable-row.adf-is-selected div[data-automation-id="${folderName}"].adf-datatable-cell--image`));
        BrowserVisibility.waitUntilElementIsVisible(folderSelected);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }

    getGridViewSortingDropdown() {
        const sortingDropdown = element(by.css('mat-select[data-automation-id="grid-view-sorting"]'));
        BrowserVisibility.waitUntilElementIsVisible(sortingDropdown);
        return sortingDropdown;
    }

    selectGridSortingFromDropdown(sortingChosen) {
        BrowserActions.closeMenuAndDialogs();
        const dropdownSorting = this.getGridViewSortingDropdown();
        BrowserActions.click(dropdownSorting);
        const optionToClick = element(by.css(`mat-option[data-automation-id="grid-view-sorting-${sortingChosen}"]`));
        BrowserActions.click(optionToClick);
    }

    checkRowIsDisplayed(rowName) {
        const row = this.contentList.dataTablePage().getCellElementByValue(this.columns.name, rowName);
        BrowserVisibility.waitUntilElementIsVisible(row);
    }

    clickShareButton() {
        BrowserActions.closeMenuAndDialogs();
        BrowserActions.click(this.shareNodeButton);
    }

    checkSelectedSiteIsDisplayed(siteName) {
        BrowserVisibility.waitUntilElementIsVisible(this.siteListDropdown.element(by.cssContainingText('.mat-select-value-text span', siteName)));
    }

    clickDownloadButton() {
        BrowserActions.closeMenuAndDialogs();
        BrowserActions.click(this.downloadButton);
    }

    clickMultiSelectToggle() {
        BrowserActions.closeMenuAndDialogs();
        BrowserActions.click(this.multiSelectToggle);
    }

    getRowByName(rowName) {
        return this.contentList.dataTable.getRow(this.columns.name, rowName);
    }

}
