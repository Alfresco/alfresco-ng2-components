/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

var Util = require('../../util/util');
var ContentList = require('./dialog/contentList');
var CreateFolderDialog = require('./dialog/createFolderDialog');
var path = require('path');
var TestConfig = require('../../test.config');
var NavigationBarPage = require('./navigationBarPage');
var remote = require('selenium-webdriver/remote');

var ContentServicesPage = function () {

    var contentList = new ContentList();
    var createFolderDialog = new CreateFolderDialog();
    var uploadBorder = element(by.css("div[id='document-list-container']"));
    var tableBody = element.all(by.css("adf-document-list div[class='adf-datatable-body']")).first();
    var contentServices = element(by.css("a[data-automation-id='Content Services']"));
    var currentFolder = element(by.css("div[class*='adf-breadcrumb-item active'] div"));
    var createFolderButton = element(by.cssContainingText("mat-icon", "create_new_folder"));
    var activeBreadcrumb = element(by.css("div[class*='active']"));
    var folderID = element.all(by.css("div[class*='settings'] p")).first();
    var tooltip = by.css("div[class*='--text full-width'] span");
    var uploadFileButton = element(by.css("input[data-automation-id='upload-single-file']"));
    var uploadMultipleFileButton = element(by.css("input[data-automation-id='upload-multiple-files']"));
    var uploadFolderButton = element(by.css("input[data-automation-id='uploadFolder']"));
    var errorSnackBar = element(by.css("simple-snack-bar[class*='mat-simple-snackbar']"));
    var contentServicesURL = TestConfig.adf.url + TestConfig.adf.port + "/files";
    var loadMoreButton = element(by.css("button[data-automation-id='adf-infinite-pagination-button']"));
    var emptyPagination = element(by.css("adf-pagination[class*='adf-pagination__empty']"));
    var dragAndDrop = element(by.css("adf-upload-drag-area div"));
    var nameHeader = element(by.css("div[data-automation-id='auto_id_name'] > span"));
    var sizeHeader = element(by.css("div[data-automation-id='auto_id_content.sizeInBytes'] > span"));
    var createdByHeader = element(by.css("div[data-automation-id='auto_id_createdByUser.displayName'] > span"));
    var createdHeader = element(by.css("div[data-automation-id='auto_id_createdAt'] > span"));
    var recentFiles = element(by.css(".adf-container-recent"));
    var recentFilesExpanded = element(by.css(".adf-container-recent mat-expansion-panel-header.mat-expanded"));
    var recentFilesClosed = element(by.css(".adf-container-recent mat-expansion-panel-header"));
    var recentFileIcon = element(by.css(".adf-container-recent mat-expansion-panel-header mat-icon"));
    var documentListSpinner = element(by.css("mat-progress-spinner"));
    var emptyFolder = element(by.css(".adf-empty-folder-this-space-is-empty"));
    var emptyFolderImage = element(by.css(".adf-empty-folder-image"));
    var emptyRecent = element(by.css(".adf-container-recent .empty-list__title"));
    var gridViewButton = element(by.css("button[data-automation-id='document-list-grid-view']"));
    var cardViewContainer = element(by.css("div.document-list-container div.adf-data-table-card"));
    var copyButton = element(by.css('button[data-automation-id="content-node-selector-actions-choose"]'));
    var searchInputElement = element(by.css('input[data-automation-id="content-node-selector-search-input"'));

    this.checkRecentFileToBeShowed = function () {
        Util.waitUntilElementIsVisible(recentFiles);
    };

    this.expandRecentFiles = function () {
        this.checkRecentFileToBeShowed();
        this.checkRecentFileToBeClosed();
        recentFilesClosed.click();
        this.checkRecentFileToBeOpened()
    };

    this.closeRecentFiles = function() {
        this.checkRecentFileToBeShowed();
        this.checkRecentFileToBeOpened()
        recentFilesExpanded.click();
        this.checkRecentFileToBeClosed();
    };

    this.checkRecentFileToBeClosed = function () {
        Util.waitUntilElementIsVisible(recentFilesClosed);
    };

    this.checkRecentFileToBeOpened = function () {
        Util.waitUntilElementIsVisible(recentFilesExpanded);
    };

    this.getRecentFileIcon = async function () {
        await Util.waitUntilElementIsVisible(recentFileIcon);
        return recentFileIcon.getText();
    };

    /**
     * Check Document List is displayed
     * @method checkAcsContainer
     */
    this.checkAcsContainer = function () {
        Util.waitUntilElementIsVisible(uploadBorder);
        return this;
    };

    this.waitForTableBody = function () {
        Util.waitUntilElementIsVisible(tableBody);
    };

    /**
     * Go to Document List Page
     * @method goToDocumentList
     * */
    this.goToDocumentList = function () {
        this.clickOnContentServices();
        this.checkAcsContainer();
    };

    this.clickOnContentServices = function () {
        Util.waitUntilElementIsVisible(contentServices);
        Util.waitUntilElementIsClickable(contentServices);
        contentServices.click();
    };

    this.navigateToDocumentList = function () {
        var navigationBarPage = new NavigationBarPage();
        navigationBarPage.clickContentServicesButton();
        this.checkAcsContainer();
    };

    this.numberOfResultsDisplayed = function () {
        return contentList.getAllDisplayedRows();
    };

    this.currentFolderName = function () {
        var deferred = protractor.promise.defer();
        Util.waitUntilElementIsVisible(currentFolder);
        currentFolder.getText().then(function (result) {
            deferred.fulfill(result);
        });
        return deferred.promise;
    };

    this.getTooltip = function (content) {
        return contentList.getRowByRowName(content).element(tooltip).getAttribute('title');
    };

    this.getBreadcrumbTooltip = function (content) {
        return element(by.css("nav[data-automation-id='breadcrumb'] div[title='" + content + "']")).getAttribute('title');
    };

    this.getAllRowsNameColumn = function () {
        return contentList.getAllRowsNameColumn();
    };
    /**
     *  Sort the list by name column.
     *
     * @param sortOrder : 'true' to sort the list ascendant and 'false' for descendant
     */
    this.sortByName = function (sortOrder) {
        contentList.sortByName(sortOrder);
    };

    /**
     *  Sort the list by author column.
     *
     * @param sortOrder : 'true' to sort the list ascendant and 'false' for descendant
     */
    this.sortByAuthor = function (sortOrder) {
        contentList.sortByAuthor(sortOrder);
    };

    /**
     *  Sort the list by created column.
     *
     * @param sortOrder : 'true' to sort the list ascendant and 'false' for descendant
     */
    this.sortByCreated = function (sortOrder) {
        return contentList.sortByCreated(sortOrder);
    };

    /**
     *  Sort by name and check the list is sorted.
     *
     * @param sortOrder : 'true' if the list is expected to be sorted ascendant and 'false' for descendant
     * @return result : 'true' if the list is sorted as expected and 'false' if it isn't
     */
    this.sortAndCheckListIsOrderedByName = function (sortOrder) {
        this.sortByName(sortOrder);
        var deferred = protractor.promise.defer();
        contentList.checkListIsOrderedByNameColumn(sortOrder).then(function (result) {
            deferred.fulfill(result);
        });
        return deferred.promise;
    };

    this.checkListIsSortedByNameColumn = async function(sortOrder) {
        await contentList.checkListIsOrderedByNameColumn(sortOrder);
    };

    this.checkListIsSortedByCreatedColumn = async function(sortOrder) {
        await contentList.checkListIsOrderedByCreatedColumn(sortOrder);
    };

    this.checkListIsSortedByAuthorColumn = async function(sortOrder) {
        await contentList.checkListIsOrderedByAuthorColumn(sortOrder);
    };

    this.checkListIsSortedBySizeColumn = async function(sortOrder) {
        await contentList.checkListIsOrderedBySizeColumn(sortOrder);
    };

    /**
     *  Sort by author and check the list is sorted.
     *
     * @param sortOrder : 'true' if the list is expected to be sorted ascendant and 'false' for descendant
     * @return result : 'true' if the list is sorted as expected and 'false' if it isn't
     */
    this.sortAndCheckListIsOrderedByAuthor = function (sortOrder) {
        this.sortByAuthor(sortOrder);
        var deferred = protractor.promise.defer();
        contentList.checkListIsOrderedByAuthorColumn(sortOrder).then(function (result) {
            deferred.fulfill(result);
        });
        return deferred.promise;
    };

    /**
     *  Sort by created and check the list is sorted.
     *
     * @param sortOrder : 'true' if the list is expected to be sorted ascendant and 'false' for descendant
     * @return result : 'true' if the list is sorted as expected and 'false' if it isn't
     */
    this.sortAndCheckListIsOrderedByCreated = function (sortOrder) {
        this.sortByCreated(sortOrder);
        var deferred = protractor.promise.defer();
        contentList.checkListIsOrderedByCreatedColumn(sortOrder).then(function (result) {
            deferred.fulfill(result);
        });
        return deferred.promise;
    };

    this.navigateToFolder = function (folder) {
        contentList.navigateToFolder(folder);
        return this;
    };

    this.doubleClickRow = function (folder) {
        contentList.doubleClickRow(folder);
        return this;
    };

    this.doubleClickEntireRow = function (folder) {
        contentList.doubleClickEntireRow(folder);
        return this;
    };

    this.clickOnCreateNewFolder = function () {
        Util.waitUntilElementIsVisible(createFolderButton);
        createFolderButton.click();
        return this;
    };

    this.createNewFolder = function (folder) {
        this.clickOnCreateNewFolder();
        createFolderDialog.addFolderName(folder);
        createFolderDialog.clickOnCreateButton();
        return this;
    };

    this.checkContentIsDisplayed = function (content) {
        contentList.checkContentIsDisplayed(content);
        return this;
    };

    this.checkContentsAreDisplayed = function (content) {
        for (var i = 0; i < content.length; i++) {
            this.checkContentIsDisplayed(content[i]);
        }
        return this;
    };

    this.checkContentIsNotDisplayed = function (content) {
        contentList.checkContentIsNotDisplayed(content);
        return this;
    };

    this.checkContentsAreNotDisplayed = function (content) {
        for (var i = 0; i < content.length; i++) {
            this.checkContentIsNotDisplayed(content[i]);
        }
        return this;
    };

    this.checkEmptyFolderMessageIsDisplayed = function () {
        contentList.checkEmptyFolderMessageIsDisplayed();
        return this;
    };

    this.checkElementIsDisplayed = function (elementName) {
        let dataElement = element(by.css(`div[data-automation-id="${elementName}"]`));
        Util.waitUntilElementIsVisible(dataElement);
    };

    this.navigateToFolderViaBreadcrumbs = function (folder) {
        contentList.tableIsLoaded();
        var breadcrumb = element(by.css("a[data-automation-id='breadcrumb_" + folder + "']"));
        Util.waitUntilElementIsVisible(breadcrumb);
        breadcrumb.click();
        contentList.tableIsLoaded();
        return this;
    };

    this.getActiveBreadcrumb = function () {
        Util.waitUntilElementIsVisible(activeBreadcrumb);
        return activeBreadcrumb.getAttribute("title");
    };

    this.getCurrentFolderID = function () {
        Util.waitUntilElementIsVisible(folderID);
        return folderID.getText();
    };

    this.checkIconColumn = function (file, extension) {
        contentList.checkIconColumn(file, extension);
        return this;
    };

    this.uploadFile = function (fileLocation) {
        browser.setFileDetector(new remote.FileDetector());
        this.checkUploadButton();
        Util.waitUntilElementIsVisible(uploadFileButton);
        uploadFileButton.sendKeys(path.resolve(path.join(TestConfig.main.rootPath, fileLocation)));
        this.checkUploadButton();
        return this;
    };

    this.uploadMultipleFile = function (files) {
        browser.setFileDetector(new remote.FileDetector());
        Util.waitUntilElementIsVisible(uploadMultipleFileButton);
        var allFiles = path.resolve(path.join(TestConfig.main.rootPath, files[0]));
        for (var i = 1; i < files.length; i++) {
            allFiles = allFiles + "\n" + path.resolve(path.join(TestConfig.main.rootPath, files[i]));
        }
        uploadMultipleFileButton.sendKeys(allFiles);
        Util.waitUntilElementIsVisible(uploadMultipleFileButton);
        return this;
    };

    this.uploadFolder = function (folder) {
        browser.setFileDetector(new remote.FileDetector());
        Util.waitUntilElementIsVisible(uploadFolderButton);
        uploadFolderButton.sendKeys(path.resolve(path.join(TestConfig.main.rootPath, folder)));
        Util.waitUntilElementIsVisible(uploadFolderButton);
        return this;
    };

    this.getSingleFileButtonTooltip = function () {
        Util.waitUntilElementIsVisible(uploadFileButton);
        return uploadFileButton.getAttribute("title");
    };

    this.getMultipleFileButtonTooltip = function () {
        Util.waitUntilElementIsVisible(uploadMultipleFileButton);
        return uploadMultipleFileButton.getAttribute("title");
    };

    this.getFolderButtonTooltip = function () {
        Util.waitUntilElementIsVisible(uploadFolderButton);
        return uploadFolderButton.getAttribute("title");
    };

    this.checkUploadButton = function () {
        Util.waitUntilElementIsVisible(uploadFileButton);
        Util.waitUntilElementIsClickable(uploadFileButton);
        return this;
    };

    this.uploadButtonIsEnabled = function () {
        return uploadFileButton.isEnabled();
    };

    this.deleteContent = function (content) {
        contentList.deleteContent(content);
        return this;
    };

    this.deleteContents = function (content) {
        for (var i = 0; i < content.length; i++) {
            this.deleteContent(content[i]);
            this.checkContentIsNotDisplayed(content[i]);
            browser.driver.sleep(1000);
        }
        return this;
    };

    this.getErrorMessage = function () {
        Util.waitUntilElementIsVisible(errorSnackBar);
        var deferred = protractor.promise.defer();
        errorSnackBar.getText().then(function (text) {
            /*tslint:disable-next-line*/
            console.log(text);
            deferred.fulfill(text);
        });
        return deferred.promise;
    };

    this.checkItemInDocList = function (fileName) {
        Util.waitUntilElementIsVisible(element(by.css("div[data-automation-id='text_" + fileName + "']")));
    };

    this.enableInfiniteScrolling = function () {
        var infiniteScrollButton = element(by.cssContainingText('.mat-slide-toggle-content', 'Enable Infinite Scrolling'));
        Util.waitUntilElementIsVisible(infiniteScrollButton);
        infiniteScrollButton.click();
        return this;
    };

    this.enableCustomPermissionMessage = function () {
        var customPermissionMessage = element(by.cssContainingText('.mat-slide-toggle-content', 'Enable custom permission message'));
        Util.waitUntilElementIsVisible(customPermissionMessage);
        customPermissionMessage.click();
        return this;
    };

    this.enableMediumTimeFormat = function () {
        var mediumTimeFormat = element(by.css('#enableMediumTimeFormat'));
        Util.waitUntilElementIsVisible(mediumTimeFormat);
        mediumTimeFormat.click();
        return this;
    };

    this.enableThumbnails = function () {
        var thumbnailSlide = element(by.css('#enableThumbnails'));
        Util.waitUntilElementIsVisible(thumbnailSlide);
        thumbnailSlide.click();
        return this;
    };

    this.clickLoadMoreButton = function () {
        Util.waitUntilElementIsVisible(loadMoreButton);
        Util.waitUntilElementIsClickable(loadMoreButton);
        loadMoreButton.click();
        return this;
    };

    this.checkPaginationIsNotDisplayed = function () {
        Util.waitUntilElementIsVisible(emptyPagination);
    };

    this.getDocumentListRowNumber = function() {
        let documentList = element(by.css('adf-upload-drag-area adf-document-list'));
        Util.waitUntilElementIsVisible(documentList);
        let actualRows = $$('adf-upload-drag-area adf-document-list .adf-datatable-row').count();
        return actualRows;
    };

    this.checkColumnNameHeader = function() {
        Util.waitUntilElementIsVisible(nameHeader);
    };

    this.checkColumnSizeHeader = function() {
        Util.waitUntilElementIsVisible(sizeHeader);
    };

    this.checkColumnCreatedByHeader = function() {
        Util.waitUntilElementIsVisible(createdByHeader);
    };

    this.checkColumnCreatedHeader = function() {
        Util.waitUntilElementIsVisible(createdHeader);
    };

    this.checkDandDIsDisplayed = function () {
        Util.waitUntilElementIsVisible(dragAndDrop);
    };

    this.checkLockIsDislpayedForElement = function(name) {
        let lockButton = element(by.css(`div.adf-data-table-cell[filename="${name}"] button`));
        Util.waitUntilElementIsVisible(lockButton);
    };

    this.getColumnValueForRow = function (file, columnName) {
        let row = contentList.getRowByRowName(file);
        Util.waitUntilElementIsVisible(row);
        let rowColumn = row.element(by.css('div[title="'+columnName+'"] span'));
        Util.waitUntilElementIsVisible(rowColumn);
        return rowColumn.getText();
    };

    this.getStyleValueForRowText = async function(rowName, styleName) {
        let row = element(by.css(`div.adf-data-table-cell[filename="${rowName}"] span.adf-datatable-cell-value[title="${rowName}"]`));
        Util.waitUntilElementIsVisible(row);
        return row.getCssValue(styleName);
    };

    this.checkSpinnerIsShowed = function () {
        Util.waitUntilElementIsPresent(documentListSpinner);
    };

    this.checkEmptyFolderTextToBe = function (text) {
        Util.waitUntilElementIsVisible(emptyFolder);
        expect(emptyFolder.getText()).toContain(text);
    };

    this.checkEmptyFolderImageUrlToContain = function (url) {
        Util.waitUntilElementIsVisible(emptyFolderImage);
        expect(emptyFolderImage.getAttribute('src')).toContain(url);
    };

    this.checkEmptyRecentFileIsDisplayed = function () {
        Util.waitUntilElementIsVisible(emptyRecent);
    };

    this.checkIconForRowIsDisplayed = function(fileName) {
        let iconRow = element(by.css(`.document-list-container div.adf-data-table-cell[filename="${fileName}"] img`));
        Util.waitUntilElementIsVisible(iconRow);
        return iconRow;
    }

    this.getRowIconImageUrl = async function(fileName) {
        let iconRow = this.checkIconForRowIsDisplayed(fileName);
        return iconRow.getAttribute('src');
    }

    this.checkGridViewButtonIsVisible = function () {
        Util.waitUntilElementIsVisible(gridViewButton);
    }

    this.clickGridViewButton = function() {
        this.checkGridViewButtonIsVisible();
        gridViewButton.click();
    }

    this.checkCardViewContainerIsDisplayed = function () {
        Util.waitUntilElementIsVisible(cardViewContainer);
    }

    this.getCardElementShowedInPage = function() {
        this.checkCardViewContainerIsDisplayed();
        let actualCards = $$('div.document-list-container div.adf-data-table-card div.cell-value img').count();
        return actualCards;
    }

    this.getDocumentCardIconForElement = function(elementName){
        let elementIcon = element(by.css(`.document-list-container div.adf-data-table-cell[filename="${elementName}"] img`));
        return elementIcon.getAttribute('src');
    }

    this.checkDocumentCardPropertyIsShowed = function(elementName, propertyName) {
        let elementProperty = element(by.css(`.document-list-container div.adf-data-table-cell[filename="${elementName}"][title="${propertyName}"]`));
        Util.waitUntilElementIsVisible(elementProperty);
    }

    this.getAttributeValueForElement = function(elementName, propertyName) {
        let elementSize = element(by.css(`.document-list-container div.adf-data-table-cell[filename="${elementName}"][title="${propertyName}"] span`));
        return elementSize.getText();
    }

    this.checkMenuIsShowedForElementIndex = function(elementIndex) {
        let elementMenu = element(by.css(`button[data-automation-id="action_menu_${elementIndex}"]`));
        Util.waitUntilElementIsVisible(elementMenu);
    }

    this.navigateToCardFolder = function(folderName) {
        let folderCard = element(by.css(`.document-list-container div.image-table-cell.adf-data-table-cell[filename="${folderName}"]`));
        folderCard.click();
        let folderSelected = element(by.css(`.adf-datatable-row.is-selected div[filename="${folderName}"].adf-data-table-cell--image`));
        Util.waitUntilElementIsVisible(folderSelected);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }

    this.getGridViewSortingDropdown = function() {
        let sortingDropdown = element(by.css('mat-select[data-automation-id="grid-view-sorting"]'));
        Util.waitUntilElementIsVisible(sortingDropdown);
        return sortingDropdown;
    }

    this.selectGridSortingFromDropdown = function(sortingChosen){
        let dropdownSorting = this.getGridViewSortingDropdown();
        dropdownSorting.click();
        let optionToClick = element(by.css(`mat-option[data-automation-id="grid-view-sorting-${sortingChosen}"]`));
        Util.waitUntilElementIsPresent(optionToClick);
        optionToClick.click();
    }

    this.checkRowIsDisplayed = function(rowName){
        let row = contentList.getRowByRowName(rowName);
        Util.waitUntilElementIsVisible(row);
    }

    this.typeIntoNodeSelectorSearchField = function(text) {
        Util.waitUntilElementIsVisible(searchInputElement);
        searchInputElement.sendKeys(text);
    }

    this.clickContentNodeSelectorResult = function(name){
        let resultElement = element(by.css(`div[data-automation-id="content-node-selector-content-list"] div[filename="${name}"`));
        Util.waitUntilElementIsVisible(resultElement);
        resultElement.click();
    }

    this.clickCopyButton = function(){
        Util.waitUntilElementIsClickable(copyButton);
        copyButton.click();
    }
};

module.exports = ContentServicesPage;
