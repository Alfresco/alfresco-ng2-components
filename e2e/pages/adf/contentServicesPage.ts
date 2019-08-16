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

import { FolderDialog } from './dialog/folderDialog';
import { CreateLibraryDialog } from './dialog/createLibraryDialog';
import { FormControllersPage } from '@alfresco/adf-testing';
import { DropActions } from '../../actions/drop.actions';
import { by, element, protractor, $$, browser, ElementFinder } from 'protractor';

import path = require('path');
import { BrowserVisibility, DocumentListPage, BrowserActions, DateUtil } from '@alfresco/adf-testing';
import { NavigationBarPage } from './navigationBarPage';

export class ContentServicesPage {

    columns = {
        name: 'Display name',
        size: 'Size',
        nodeId: 'Node id',
        createdBy: 'Created by',
        created: 'Created'
    };

    contentList: DocumentListPage = new DocumentListPage(element.all(by.css('adf-upload-drag-area adf-document-list')).first());
    formControllersPage: FormControllersPage = new FormControllersPage();
    createFolderDialog: FolderDialog = new FolderDialog();
    createLibraryDialog: CreateLibraryDialog = new CreateLibraryDialog();
    dragAndDropAction: DropActions = new DropActions();

    multipleFileUploadToggle: ElementFinder = element(by.id('adf-document-list-enable-drop-files'));
    uploadBorder: ElementFinder = element(by.id('document-list-container'));
    contentServices: ElementFinder = element(by.css('.adf-sidenav-link[data-automation-id="Content Services"]'));
    currentFolder: ElementFinder = element(by.css('div[class*="adf-breadcrumb-item adf-active"] div'));
    createFolderButton: ElementFinder = element(by.css('button[data-automation-id="create-new-folder"]'));
    editFolderButton: ElementFinder = element(by.css('button[data-automation-id="edit-folder"]'));
    createLibraryButton: ElementFinder = element(by.css('button[data-automation-id="create-new-library"]'));
    activeBreadcrumb: ElementFinder = element(by.css('div[class*="active"]'));
    tooltip = by.css('div[class*="--text adf-full-width"] span');
    uploadFileButton: ElementFinder = element(by.css('.adf-upload-button-file-container button'));
    uploadFileButtonInput: ElementFinder = element(by.css('input[data-automation-id="upload-single-file"]'));
    uploadMultipleFileButton: ElementFinder = element(by.css('input[data-automation-id="upload-multiple-files"]'));
    uploadFolderButton: ElementFinder = element(by.css('input[data-automation-id="uploadFolder"]'));
    errorSnackBar: ElementFinder = element(by.css('simple-snack-bar[class*="mat-simple-snackbar"]'));
    emptyPagination: ElementFinder = element(by.css('adf-pagination[class*="adf-pagination__empty"]'));
    dragAndDrop: ElementFinder = element.all(by.css('adf-upload-drag-area div')).first();
    nameHeader: ElementFinder = element(by.css('div[data-automation-id="auto_id_name"] > span'));
    sizeHeader: ElementFinder = element(by.css('div[data-automation-id="auto_id_content.sizeInBytes"] > span'));
    createdByHeader: ElementFinder = element(by.css('div[data-automation-id="auto_id_createdByUser.displayName"] > span'));
    createdHeader: ElementFinder = element(by.css('div[data-automation-id="auto_id_createdAt"] > span'));
    recentFiles: ElementFinder = element(by.css('.adf-container-recent'));
    recentFilesExpanded: ElementFinder = element(by.css('.adf-container-recent mat-expansion-panel-header.mat-expanded'));
    recentFilesClosed: ElementFinder = element(by.css('.adf-container-recent mat-expansion-panel-header'));
    recentFileIcon: ElementFinder = element(by.css('.adf-container-recent mat-expansion-panel-header mat-icon'));
    emptyFolder: ElementFinder = element(by.css('.adf-empty-folder-this-space-is-empty'));
    emptyFolderImage: ElementFinder = element(by.css('.adf-empty-folder-image'));
    emptyRecent: ElementFinder = element(by.css('.adf-container-recent .adf-empty-list__title'));
    gridViewButton: ElementFinder = element(by.css('button[data-automation-id="document-list-grid-view"]'));
    cardViewContainer: ElementFinder = element(by.css('div.adf-document-list-container div.adf-datatable-card'));
    shareNodeButton: ElementFinder = element(by.cssContainingText('mat-icon', ' share '));
    nameColumnHeader = 'name';
    createdByColumnHeader = 'createdByUser.displayName';
    createdColumnHeader = 'createdAt';
    deleteContentElement: ElementFinder = element(by.css('button[data-automation-id*="DELETE"]'));
    metadataAction: ElementFinder = element(by.css('button[data-automation-id*="METADATA"]'));
    versionManagerAction: ElementFinder = element(by.css('button[data-automation-id*="VERSIONS"]'));
    moveContentElement: ElementFinder = element(by.css('button[data-automation-id*="MOVE"]'));
    copyContentElement: ElementFinder = element(by.css('button[data-automation-id*="COPY"]'));
    lockContentElement: ElementFinder = element(by.css('button[data-automation-id="DOCUMENT_LIST.ACTIONS.LOCK"]'));
    downloadContent: ElementFinder = element(by.css('button[data-automation-id*="DOWNLOAD"]'));
    siteListDropdown: ElementFinder = element(by.css(`mat-select[data-automation-id='site-my-files-option']`));
    downloadButton: ElementFinder = element(by.css('button[title="Download"]'));
    favoriteButton: ElementFinder = element(by.css('button[data-automation-id="favorite"]'));
    markedFavorite: ElementFinder = element(by.cssContainingText('button[data-automation-id="favorite"] mat-icon', 'star'));
    notMarkedFavorite: ElementFinder = element(by.cssContainingText('button[data-automation-id="favorite"] mat-icon', 'star_border'));
    multiSelectToggle: ElementFinder = element(by.cssContainingText('span.mat-slide-toggle-content', ' Multiselect (with checkboxes) '));

    async pressContextMenuActionNamed(actionName): Promise<void> {
        await BrowserActions.clickExecuteScript(`button[data-automation-id="context-${actionName}"]`);
    }

    async checkContextActionIsVisible(actionName) {
        const actionButton: ElementFinder = element(by.css(`button[data-automation-id="context-${actionName}"`));
        await BrowserVisibility.waitUntilElementIsVisible(actionButton);
    }

    async isContextActionEnabled(actionName): Promise<boolean> {
        const actionButton: ElementFinder = element(by.css(`button[data-automation-id="context-${actionName}"`));
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
        return await this.contentList.checkLockedIcon(content);
    }

    async checkUnlockedIcon(content): Promise<void> {
        return await this.contentList.checkUnlockedIcon(content);
    }

    async checkDeleteIsDisabled(content): Promise<void> {
        await this.contentList.clickOnActionMenu(content);
        await this.waitForContentOptions();
        const disabledDelete: ElementFinder = element(by.css(`button[data-automation-id*='DELETE'][disabled='true']`));
        await BrowserVisibility.waitUntilElementIsVisible(disabledDelete);
    }

    async deleteContent(content): Promise<void> {
        await this.contentList.clickOnActionMenu(content);
        await this.waitForContentOptions();
        await BrowserActions.click(this.deleteContentElement);
    }

    async metadataContent(content): Promise<void> {
        await this.contentList.clickOnActionMenu(content);
        await this.waitForContentOptions();
        await BrowserActions.click(this.metadataAction);
    }

    async versionManagerContent(content): Promise<void> {
        await this.contentList.clickOnActionMenu(content);
        await this.waitForContentOptions();
        await BrowserActions.click(this.versionManagerAction);
    }

    async copyContent(content): Promise<void> {
        await this.contentList.clickOnActionMenu(content);
        await BrowserActions.click(this.copyContentElement);
    }

    async lockContent(content): Promise<void> {
        await this.contentList.clickOnActionMenu(content);
        await BrowserActions.click(this.lockContentElement);
    }

    async waitForContentOptions(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.copyContentElement);
        await BrowserVisibility.waitUntilElementIsVisible(this.moveContentElement);
        await BrowserVisibility.waitUntilElementIsVisible(this.deleteContentElement);
        await BrowserVisibility.waitUntilElementIsVisible(this.downloadContent);
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
        const hyperlinkToggle: ElementFinder = element(by.cssContainingText('.mat-slide-toggle-content', 'Hyperlink navigation'));
        await BrowserActions.click(hyperlinkToggle);
    }

    async enableDropFilesInAFolder(): Promise<void> {
        await this.formControllersPage.enableToggle(this.multipleFileUploadToggle);
    }

    async disableDropFilesInAFolder(): Promise<void> {
        await browser.executeScript('arguments[0].scrollIntoView()', this.multipleFileUploadToggle);
        await this.formControllersPage.disableToggle(this.multipleFileUploadToggle);
    }

    async getElementsDisplayedId() {
        return await this.contentList.dataTablePage().getAllRowsColumnValues(this.columns.nodeId);
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
        return await BrowserActions.getText(this.recentFileIcon);
    }

    async checkAcsContainer(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.uploadBorder);
    }

    async waitForTableBody(): Promise<void> {
        await this.contentList.waitForTableBody();
    }

    async goToDocumentList(): Promise<void> {
        const navigationBarPage = new NavigationBarPage();
        await navigationBarPage.clickContentServicesButton();
    }

    async clickOnContentServices(): Promise<void> {
        await BrowserActions.click(this.contentServices);
    }

    async numberOfResultsDisplayed(): Promise<number> {
        return await this.contentList.dataTablePage().numberOfRows();
    }

    async currentFolderName(): Promise<string> {
        return await BrowserActions.getText(this.currentFolder);
    }

    async getAllRowsNameColumn(): Promise<any> {
        return await this.contentList.getAllRowsColumnValues(this.columns.name);
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
        return await this.checkListIsSortedByNameColumn(sortOrder);
    }

    async checkListIsSortedByNameColumn(sortOrder: string): Promise<any> {
        return await this.contentList.dataTablePage().checkListIsSorted(sortOrder, this.columns.name);
    }

    async checkListIsSortedByCreatedColumn(sortOrder: string): Promise<any> {
        return await this.contentList.dataTablePage().checkListIsSorted(sortOrder, this.columns.created);
    }

    async checkListIsSortedByAuthorColumn(sortOrder: string): Promise<any> {
        return await this.contentList.dataTablePage().checkListIsSorted(sortOrder, this.columns.createdBy);
    }

    async checkListIsSortedBySizeColumn(sortOrder: string): Promise<any> {
        return await this.contentList.dataTablePage().checkListIsSorted(sortOrder, this.columns.size);
    }

    async sortAndCheckListIsOrderedByAuthor(sortOrder: string): Promise<any> {
        await this.sortByAuthor(sortOrder);
        return await this.checkListIsSortedByAuthorColumn(sortOrder);
    }

    async sortAndCheckListIsOrderedByCreated(sortOrder: string): Promise<any> {
        await this.sortByCreated(sortOrder);
        return await this.checkListIsSortedByCreatedColumn(sortOrder);
    }

    async doubleClickRow(nodeName): Promise<void> {
        await this.contentList.doubleClickRow(nodeName);
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
        await this.createLibraryDialog.waitForDialogToOpen();
    }

    async createNewFolder(folder): Promise<void> {
        await this.clickOnCreateNewFolder();
        await this.createFolderDialog.addFolderName(folder);
        await this.createFolderDialog.clickOnCreateUpdateButton();
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

    async getActiveBreadcrumb(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.activeBreadcrumb);
        return await this.activeBreadcrumb.getAttribute('title');
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

    async uploadFolder(folder): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.uploadFolderButton);
        await this.uploadFolderButton.sendKeys(path.resolve(path.join(browser.params.testConfig.main.rootPath, folder)));
        await BrowserVisibility.waitUntilElementIsVisible(this.uploadFolderButton);
    }

    async getSingleFileButtonTooltip(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsPresent(this.uploadFileButton);
        return await this.uploadFileButtonInput.getAttribute('title');
    }

    async getMultipleFileButtonTooltip(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsPresent(this.uploadMultipleFileButton);
        return await this.uploadMultipleFileButton.getAttribute('title');
    }

    async getFolderButtonTooltip(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsPresent(this.uploadFolderButton);
        return await this.uploadFolderButton.getAttribute('title');
    }

    async checkUploadButton(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsClickable(this.uploadFileButton);
    }

    async uploadButtonIsEnabled(): Promise<boolean> {
        return await this.uploadFileButton.isEnabled();
    }

    async getErrorMessage(): Promise<string> {
        return BrowserActions.getText(this.errorSnackBar);
    }

    async enableInfiniteScrolling(): Promise<void> {
        const infiniteScrollButton: ElementFinder = element(by.cssContainingText('.mat-slide-toggle-content', 'Enable Infinite Scrolling'));
        await BrowserActions.click(infiniteScrollButton);
    }

    async enableCustomPermissionMessage(): Promise<void> {
        const customPermissionMessage: ElementFinder = element(by.cssContainingText('.mat-slide-toggle-content', 'Enable custom permission message'));
        await BrowserActions.click(customPermissionMessage);
    }

    async enableMediumTimeFormat(): Promise<void> {
        const mediumTimeFormat: ElementFinder = element(by.css('#enableMediumTimeFormat'));
        await BrowserActions.click(mediumTimeFormat);
    }

    async enableThumbnails(): Promise<void> {
        const thumbnailSlide: ElementFinder = element(by.id('adf-thumbnails-upload-switch'));
        await BrowserActions.click(thumbnailSlide);
    }

    async checkPaginationIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.emptyPagination);
    }

    async getDocumentListRowNumber(): Promise<number> {
        const documentList: ElementFinder = element(by.css('adf-upload-drag-area adf-document-list'));
        await BrowserVisibility.waitUntilElementIsVisible(documentList);
        return await $$('adf-upload-drag-area adf-document-list .adf-datatable-row').count();
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

    async dragAndDropFile(file): Promise<void> {
        await this.checkDragAndDropDIsDisplayed();
        await this.dragAndDropAction.dropFile(this.dragAndDrop, file);
    }

    async dragAndDropFolder(folder): Promise<void> {
        await this.checkDragAndDropDIsDisplayed();
        await this.dragAndDropAction.dropFolder(this.dragAndDrop, folder);
    }

    async checkLockIsDisplayedForElement(name): Promise<void> {
        const lockButton: ElementFinder = element(by.css(`div.adf-datatable-cell[data-automation-id="${name}"] button`));
        await BrowserVisibility.waitUntilElementIsVisible(lockButton);
    }

    async getColumnValueForRow(file, columnName): Promise<string> {
        return await this.contentList.dataTablePage().getColumnValueForRow(this.columns.name, file, columnName);
    }

    async getStyleValueForRowText(rowName, styleName): Promise<string> {
        const row: ElementFinder = element(by.css(`div.adf-datatable-cell[data-automation-id="${rowName}"] span.adf-datatable-cell-value[title="${rowName}"]`));
        await BrowserVisibility.waitUntilElementIsVisible(row);
        return await row.getCssValue(styleName);
    }

    async checkEmptyFolderTextToBe(text): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.emptyFolder);
        await expect(await this.emptyFolder.getText()).toContain(text);
    }

    async checkEmptyFolderImageUrlToContain(url): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.emptyFolderImage);
        await expect(await this.emptyFolderImage.getAttribute('src')).toContain(url);
    }

    async checkEmptyRecentFileIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.emptyRecent);
    }

    async getRowIconImageUrl(fileName): Promise<string> {
        const iconRow: ElementFinder = element(by.css(`.adf-document-list-container div.adf-datatable-cell[data-automation-id="${fileName}"] img`));
        await BrowserVisibility.waitUntilElementIsVisible(iconRow);
        return await iconRow.getAttribute('src');
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
        return $$('div.adf-document-list-container div.adf-datatable-card div.adf-cell-value img').count();
    }

    async getDocumentCardIconForElement(elementName): Promise<string> {
        const elementIcon: ElementFinder = element(by.css(`.adf-document-list-container div.adf-datatable-cell[data-automation-id="${elementName}"] img`));
        return await elementIcon.getAttribute('src');
    }

    async checkDocumentCardPropertyIsShowed(elementName, propertyName): Promise<void> {
        const elementProperty: ElementFinder = element(by.css(`.adf-document-list-container div.adf-datatable-cell[data-automation-id="${elementName}"][title="${propertyName}"]`));
        await BrowserVisibility.waitUntilElementIsVisible(elementProperty);
    }

    async getAttributeValueForElement(elementName, propertyName): Promise<string> {
        const elementSize = element(by.css(`.adf-document-list-container div.adf-datatable-cell[data-automation-id="${elementName}"][title="${propertyName}"] span`));
        return await BrowserActions.getText(elementSize);
    }

    async checkMenuIsShowedForElementIndex(elementIndex): Promise<void> {
        const elementMenu: ElementFinder = element(by.css(`button[data-automation-id="action_menu_${elementIndex}"]`));
        await BrowserVisibility.waitUntilElementIsVisible(elementMenu);
    }

    async navigateToCardFolder(folderName): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        const folderCard: ElementFinder = element(by.css(`.adf-document-list-container div.adf-image-table-cell.adf-datatable-cell[data-automation-id="${folderName}"]`));
        await BrowserActions.click(folderCard);
        const folderSelected: ElementFinder = element(by.css(`.adf-datatable-row.adf-is-selected div[data-automation-id="${folderName}"].adf-datatable-cell--image`));
        await BrowserVisibility.waitUntilElementIsVisible(folderSelected);
        await browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }

    async selectGridSortingFromDropdown(sortingChosen): Promise<void> {
        const sortingDropdown: ElementFinder = element(by.css('mat-select[data-automation-id="grid-view-sorting"]'));
        await BrowserActions.click(sortingDropdown);
        const optionToClick: ElementFinder = element(by.css(`mat-option[data-automation-id="grid-view-sorting-${sortingChosen}"]`));
        await BrowserActions.click(optionToClick);
    }

    async checkRowIsDisplayed(rowName): Promise<void> {
        const row = this.contentList.dataTablePage().getCellElementByValue(this.columns.name, rowName);
        await BrowserVisibility.waitUntilElementIsVisible(row);
    }

    async clickShareButton(): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.click(this.shareNodeButton);
    }

    async checkSelectedSiteIsDisplayed(siteName): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.siteListDropdown.element(by.cssContainingText('.mat-select-value-text span', siteName)));
    }

    async selectSite(siteName: string): Promise<void> {
        await BrowserActions.clickOnSelectDropdownOption(siteName, this.siteListDropdown);
    }

    async clickDownloadButton(): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.click(this.downloadButton);
    }

    async clickMultiSelectToggle() {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.click(this.multiSelectToggle);
    }

    getRowByName(rowName): ElementFinder {
        return this.contentList.dataTable.getRow(this.columns.name, rowName);
    }

}
