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

var ContentServicesPage = function (){

    var contentList = new ContentList();
    var createFolderDialog = new CreateFolderDialog();
    var uploadBorder = element(by.css("div[class='document-list-container']"));
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

    /**
     * Check Document List is displayed
     * @method checkAcsContainer
     */
    this.checkAcsContainer = function (){
        Util.waitUntilElementIsVisible(uploadBorder);
        return this;
    };

    this.waitForTableBody = function (){
        Util.waitUntilElementIsVisible(tableBody);
    };

    /**
     * Go to Document List Page
     * @method goToDocumentList
     * */
    this.goToDocumentList = function() {
        Util.waitUntilElementIsVisible(contentServices);
        Util.waitUntilElementIsClickable(contentServices);
        contentServices.click();
        this.checkAcsContainer();
    };

    this.navigateToDocumentList = function() {
        browser.driver.get(contentServicesURL);
        this.checkAcsContainer();
    };

    this.numberOfResultsDisplayed = function () {
        return contentList.getAllDisplayedRows();
    };

    this.currentFolderName = function() {
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
        return element(by.css("nav[data-automation-id='breadcrumb'] div[title='" +content +"']")).getAttribute('title');
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
        contentList.checkListIsOrderedByNameColumn(sortOrder).then(function(result) {
            deferred.fulfill(result);
        });
        return deferred.promise;
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
        contentList.checkListIsOrderedByAuthorColumn(sortOrder).then(function(result) {
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
        contentList.checkListIsOrderedByCreatedColumn(sortOrder).then(function(result) {
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

    this.createNewFolder = function (folder) {
        Util.waitUntilElementIsVisible(createFolderButton);
        createFolderButton.click();
        createFolderDialog.addFolderName(folder);
        createFolderDialog.clickOnCreateButton();
        return this;
    };

    this.checkContentIsDisplayed = function (content) {
        contentList.checkContentIsDisplayed(content);
        return this;
    };

    this.checkContentsAreDisplayed = function (content) {
        for( i=0; i < content.length; i++) {
            this.checkContentIsDisplayed(content[i]);
        }
        return this;
    };

    this.checkContentIsNotDisplayed = function (content) {
        contentList.checkContentIsNotDisplayed(content);
        return this;
    };

    this.checkContentsAreNotDisplayed = function (content) {
        for( i=0; i < content.length; i++) {
            this.checkContentIsNotDisplayed(content[i]);
        }
        return this;
    };

    this.checkEmptyFolderMessageIsDisplayed = function () {
        contentList.checkEmptyFolderMessageIsDisplayed();
        return this;
    };

    this.navigateToFolderViaBreadcrumbs = function (folder) {
        contentList.tableIsLoaded();
        var  breadcrumb = element(by.css("a[data-automation-id='breadcrumb_"+ folder +"']"));
        Util.waitUntilElementIsVisible(breadcrumb);
        breadcrumb.click();
        contentList.tableIsLoaded();
        return this;
    };

    this.getActiveBreadcrumb = function () {
        Util.waitUntilElementIsVisible(activeBreadcrumb);
        return activeBreadcrumb.getAttribute("title");
    };

    this.getCurrentFolderID = function() {
        Util.waitUntilElementIsVisible(folderID);
        return folderID.getText();
    };

    this.checkIconColumn = function (file, extension) {
        contentList.checkIconColumn(file, extension);
        return this;
    };

    this.uploadFile = function (fileLocation) {
        this.checkUploadButton();
        uploadFileButton.sendKeys(path.resolve(path.join(TestConfig.main.rootPath, fileLocation)));
        this.checkUploadButton();
        return this;
    };

    this.uploadMultipleFile = function (files) {
        Util.waitUntilElementIsVisible(uploadMultipleFileButton);
        var allFiles = path.resolve(path.join(TestConfig.main.rootPath, files[0]));
        for(var i =1; i< files.length; i++) {
            allFiles = allFiles + "\n" + path.resolve(path.join(TestConfig.main.rootPath, files[i]));
        };
        uploadMultipleFileButton.sendKeys(allFiles);
        Util.waitUntilElementIsVisible(uploadMultipleFileButton);
        return this;
    };

    this.uploadFolder = function (folder) {
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

    this.deleteContent = function (content) {
        contentList.deleteContent(content);
        return this;
    };

    this.deleteContents = function (content) {
        for( i=0; i<content.length; i++) {
            this.deleteContent(content[i]);
            this.checkContentIsNotDisplayed(content[i]);
        };
        return this;
    };

    this.getErrorMessage = function() {
        Util.waitUntilElementIsVisible(errorSnackBar);
        var deferred = protractor.promise.defer();
        errorSnackBar.getText().then( function (text) {
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

    this.clickLoadMoreButton = function () {
        Util.waitUntilElementIsVisible(loadMoreButton);
        Util.waitUntilElementIsClickable(loadMoreButton);
        loadMoreButton.click();
        return this;
    };

    this.checkPaginationIsNotDisplayed = function (){
        Util.waitUntilElementIsVisible(emptyPagination);
    };

};

module.exports = ContentServicesPage;
