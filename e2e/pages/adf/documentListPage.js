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

var Page = require('astrolabe').Page;
var Util = require('../../util/util');

var contentServices = element(by.css("a[data-automation-id='files'] span"));
var siteList = element(by.css("md-select[class*='dropdown-list']"));
var folderID = element(by.css('adf-files-component p'));
var folderText = element(by.css("md-input-container[class*='create-folder--name'] input"));
var createButtonDialog = element(by.xpath("//span[contains(text(), 'Create')]/ancestor::button"));
var createFolderButton = element(by.xpath("//md-icon[contains(text(), 'create_new_folder')]"));
var currentFolder = element(by.xpath("//div[@class='adf-breadcrumb-container']/li[last()]/div"));
var deleteContent = element(by.css("button[adf-node-permission='delete']"));

/**
 * Provides the Login Page.
 * @module pages
 * @submodule share
 * @class pages.share.LoginPage
 */
module.exports = Page.create({

    /**
     * Provides the document list.
     * @property documentList
     * @type protractor.Element
     */
    documentList: {
        get: function () {
            return element(by.css("tr[class='alfresco-datatable__row'] > td"));
        }
    },

    /**
     * Provides the upload button.
     * @property uploadButton
     * @type protractor.Element
     */
    uploadButton: {
        get: function () {
            return element(by.css("input[data-automation-id='upload-single-file']"));
        }
    },

    /**
     * Provides the mutiple upload button .
     * @property uploadButton
     * @type protractor.Elementx
     */
    multipleUploadButton: {
        get: function () {
            return element(by.css("input[data-automation-id='upload-multiple-files']"));
        }
    },

    /**
     * Provides the mutiple upload button enabled
     * @property multipleUploadEnabled
     * @type protractor.Element
     */
    multipleUploadEnabled: {
        get: function () {
            return element(by.css("alfresco-upload-button[data-automation-id='multiple-file-upload'][ng-reflect-multiple-files='true']"));
        }
    },

    /**
     * Provides the extensions accepted text field
     * @property acceptedFilesText
     * @type protractor.Element
     */
    acceptedFilesText: {
        get: function () {
            return element(by.css("input[data-automation-id='accepted-files-type']"));
        }
    },

    /**
     * Provides the create folder button
     * @property createFolderButton
     * @type protractor.Element
     */
    createFolderButton: {
        get: function () {
            return element(by.cssContainingText("button[id='actions'] > i", "add"));
        }
    },

    /**
     * Provides the create new folder button in dialog
     * @property createFolderButton
     * @type protractor.Element
     */
    createFolderButtonDialog: {
        get: function () {
            return element(by.cssContainingText("span[class='mdl-menu__text']", "New Folder"));
        }
    },

    /**
     * Provides the longer wait required
     * @property goToDocList
     * @type protractor.Element
     * */
    goToDocList: {
        value: function () {
            Util.waitUntilElementIsVisible(contentServices);
            contentServices.click();
            Util.waitUntilElementIsVisible(siteList);
        }
    },

    /**
     * Provides the longer wait required
     * @property waitForElements
     * @type protractor.Element
     * */
    waitForElements: {
        value: function () {
            Util.waitUntilElementIsVisible(this.uploadButton);
        }
    },

    /**
     * Creates new folder
     * @property createFolder
     * */
    createFolder: {
        value: function (folderName) {
            Util.waitUntilElementIsVisible(createFolderButton);
            createFolderButton.click();
            Util.waitUntilElementIsVisible(folderText);
            folderText.sendKeys(folderName);
            createButtonDialog.click();
            this.checkItemInDocList(folderName);
        }
    },

    /**
     * Deletes content
     * @property deleteContent
     * */
    deleteContent: {
        value: function (contentName) {
            var contentName = element(by.css("div[data-automation-id*='text_"+ contentName+"']"));
            Util.waitUntilElementIsVisible(contentName);
            contentName.click();
            deleteContent.click();
        }
    },

    /**
     * Retrieve row by row number
     *
     * @param rowNumber
     */
    getRowByRowNumber: {
        value: function (rowNumber) {
            return element(by.css("div[data-automation-id='text_" + rowNumber + "']"));
        }
    },


    /**
     * Go into folder
     * @property goIntoFolder
     * */
    goIntoFolder: {
        value: function (folderName) {
            this.checkItemInDocList(folderName);
            browser.actions().doubleClick(element(by.css("div[data-automation-id*='text_"+ folderName+"']"))).perform();
        }
    },

    /**
     * Go into folder via breadcrumb
     * @property goIntoFolderViaBreadcrumbs
     * */
    goIntoFolderViaBreadcrumbs: {
        value: function (folderName) {
            var  breadcrumb = element(by.cssContainingText("a[data-automation-id='breadcrumb_"+ folderName +"']", folderName));

            Util.waitUntilElementIsVisible(breadcrumb);
            breadcrumb.click();
            this.waitForElements();
        }
    },

    currentFolderName: {
         value: function () {
             var deferred = protractor.promise.defer();
             Util.waitUntilElementIsVisible(currentFolder);
             currentFolder.getText().then(function (result) {
                 deferred.fulfill(result);
             })
             return deferred.promise;
         }
    },

    /**
     * Go into folder
     * @property goIntoFolder
     * */
    checkFolderInBreadcrumbs: {
        value: function (folderName) {
            var  breadcrumb = element(by.cssContainingText("a[data-automation-id='breadcrumb_"+ folderName +"']", folderName));

            Util.waitUntilElementIsVisible(breadcrumb);
        }
    },

    /**
     * Check file/fodler in document list
     * @property checkItemInDocList
     * */
    checkItemInDocList: {
        value: function (fileName) {
            Util.waitUntilElementIsVisible(element(by.cssContainingText("div[data-automation-id='text_" + fileName + "']", fileName)));
        }
    },

    /**
     * Check file is not in document list
     * @property checkFileIsNotInDocList
     * */
    checkFileIsNotInDocList: {
        value: function (fileName) {
            Util.waitUntilElementIsNotOnPage(element(by.cssContainingText("div[data-automation-id='text_" + fileName + "']", fileName)));
        }
    },

    /**
     * Check number of times file appears in document list
     * @property checkNumberOfFilesInDocList
     * */
    checkNumberOfFilesInDocList: {
        value: function (fileName, numberOfFiles) {
            this.checkItemInDocList(fileName);

            var file = element.all(by.cssContainingText("div[data-automation-id='text_" + fileName + "']", fileName));
            expect(file.count()).toEqual(numberOfFiles);
        }
    },

    /**
     * uploads file
     * @property uploadFile
     * */
    uploadFile: {
        value: function (fileLocation, fileName) {
            var uploadButton = element(by.css("input[data-automation-id='upload-single-file']"));
            Util.waitUntilElementIsVisible(uploadButton);
            Util.uploadFile(uploadButton, uploadButton, fileLocation);
            this.checkItemInDocList(fileName);
        }
    },

    /**
     * uploads file without checking document list
     * @property uploadFileWithoutCheck
     * */
    uploadFileWithoutCheck: {
        value: function (fileLocation) {
            Util.waitUntilElementIsVisible(this.uploadButton);
            Util.uploadFile(this.uploadButton, this.uploadButton, fileLocation);
        }
    },

    /**
     * Check file in upload dialog
     * @property checkFileInUploadDialog
     * */
    checkFileInUploadDialog: {
        value: function (fileName) {
            Util.waitUntilElementIsVisible(element(by.cssContainingText("td[data-automation-id='dialog_" + fileName + "'] > div", fileName)));
        }
    },

    /**
     * Check all uploads are complete
     * @property checkAllUploadsComplete
     * */
    checkAllUploadsComplete: {
        value: function (fileName) {
            var dialogUpload = element.all(by.css("td[data-automation-id*='dialog_']"));
            var singleUpload = element(by.cssContainingText("div[ng-reflect-klass='file-dialog'] div[class='title'] ", "upload complete"));
            var multipleUploads = element(by.cssContainingText("div[ng-reflect-klass='file-dialog'] div[class='title'] ", "uploads complete"));

            dialogUpload.count().then(function(count) {
                if (count === 1) {
                    Util.waitUntilElementIsVisible(singleUpload);
                }
                else if (count > 1) {
                    Util.waitUntilElementIsVisible(multipleUploads);
                }
            });
        }
    },

    /**
     * Check done icon for file
     * @property checkDoneIcon
     * */
    checkDoneIcon: {
        value: function (fileName) {
            Util.waitUntilElementIsVisible(element(by.xpath("//i[contains(@data-automation-id, 'done_icon')]/../../../td[contains(@data-automation-id, '" + fileName + "')]")));
        }
    },

    /**
     * Check abort icon for file
     * @property checkUploadAbortedIcon
     * */
    checkAbortedIcon: {
        value: function (fileName) {
            Util.waitUntilElementIsVisible(element(by.xpath("//i[contains(@data-automation-id, 'upload_stopped')]/../../../td[contains(@data-automation-id, '" + fileName + "')]")));
        }
    },

    /**
     * Check progress bar in dialog
     * @property checkDoneIcon
     * */
    checkProgressBar: {
        value: function (fileName) {
            Util.waitUntilElementIsVisible(element(by.css("div[data-automation-id='dialog_progress_" + fileName +"']")));
        }
    },

    /**
     * check upload dialog
     * @property checkUploadDialog
     * */
    checkUploadDialog: {
        value: function (fileName) {
            var uploadDialog = element(by.css("file-uploading-dialog[class='dialog-show'] > div[class='file-dialog show']"));

            Util.waitUntilElementIsVisible(uploadDialog);
            this.checkFileInUploadDialog(fileName);
            this.checkAllUploadsComplete();
            this.checkDoneIcon(fileName);
            this.checkProgressBar(fileName);
        }
    },

    /**
     * Close upload dialog
     * @property closeUploadDialog
     * */
    closeUploadDialog: {
        value: function () {
            var closeDialog = element(by.css("div[title='close upload list'] > i"));
            Util.waitUntilElementIsVisible(closeDialog);
            closeDialog.click();
            Util.waitUntilElementIsNotOnPage(closeDialog);
        }
    },

    /**
     * Minimise upload dialog
     * @property minimiseUploadDialog
     * */
    minimiseUploadDialog: {
        value: function () {
            var minimiseDialog = element(by.css("div[class='minimize-button'] > i[title='minimize upload list']"));
            Util.waitUntilElementIsVisible(minimiseDialog);
            minimiseDialog.click();
            Util.waitUntilElementIsNotOnPage(minimiseDialog);
        }
    },

    /**
     * Maximise upload dialog
     * @property maximiseUploadDialog
     * */
    maximiseUploadDialog: {
        value: function () {
            var maximiseDialog = element(by.css("div[class='minimize-button active'] > i[title='expand upload list']"));
            Util.waitUntilElementIsVisible(maximiseDialog);
            maximiseDialog.click();
            Util.waitUntilElementIsNotOnPage(maximiseDialog);
        }
    },

    /**
     * Click undo upload via message window
     * @property clickUndoUploadViaWindow
     * */
    clickUndoUploadViaWindow: {
        value: function () {
            var notificationWindow = element(by.css("div[id='undo-notification-bar']"));
            var undoButton = element(by.css("alfresco-upload-button div[id='undo-notification-bar'] > button[data-automation-id='undo_upload_button']"));

            Util.waitUntilElementIsVisible(notificationWindow);
            Util.waitUntilElementIsVisible(undoButton);
            undoButton.click();
        }
    },

    /**
     * Undo upload via window
     * @property undoUploadViaWindow
     * */
    undoUploadViaWindow: {
        value: function (fileName) {
            this.clickUndoUploadViaWindow();
            this.checkFileIsNotInDocList(fileName);
            this.checkAbortedIcon(fileName);
        }
    },

    /**
     * Click undo upload via upload dialog
     * @property clickUndoUploadViaWindow
     * */
    clickUndoUploadViaDialog: {
        value: function (fileName) {
            var dialog = element(by.css("file-uploading-dialog[class='dialog-show']"));
            var undoIcon = element(by.xpath("//i[contains(@data-automation-id, 'abort_cancel_upload')]/../../../td[contains(@data-automation-id, '" + fileName + "')]"));

            Util.waitUntilElementIsVisible(dialog);
            Util.waitUntilElementIsVisible(undoIcon);
            undoIcon.click();
        }
    },

    /**
     * Undo upload via dialog
     * @property undoUploadViaDialog
     * */
    undoUploadViaDialog: {
        value: function (fileName) {
            this.clickUndoUploadViaDialog(fileName);
            this.checkFileIsNotInDocList(fileName);
            this.checkAbortedIcon(fileName);
        }
    },

    /**
     * Click cancel upload via upload dialog
     * @property clickUndoUploadViaWindow
     * */
    clickCancelUploadViaDialog: {
        value: function () {
            var dialog = element(by.css("file-uploading-dialog[class='dialog-show']"));
            var cancelButton = element(by.css("a[data-automation-id='cancel_upload_all']"));

            Util.waitUntilElementIsVisible(dialog);
            Util.waitUntilElementIsVisible(cancelButton);
            cancelButton.click();
        }
    },

    /**
     * cancel upload via dialog
     * @property undoUploadViaDialog
     * */
    cancelUploadViaDialog: {
        value: function (fileName) {
            this.clickCancelUploadViaDialog();
            this.checkFileIsNotInDocList(fileName);
            this.checkAbortedIcon(fileName);
        }
    },

    /**
     * Enable multiple file upload
     * @property enableMultipleFileUpload
     * */
    enableMultipleFileUpload: {
        value: function () {
            var multiFileUploadSwitch = element(by.css("label[for='switch-multiple-file']"));

            Util.waitUntilElementIsVisible(multiFileUploadSwitch);
            multiFileUploadSwitch.click();
            Util.waitUntilElementIsVisible(this.multipleUploadButton);
            Util.waitUntilElementIsVisible(this.multipleUploadEnabled);
        }
    },

    /**
     * Disable multiple file upload
     * @property diableMultipleFileUpload
     * */
    disableMultipleFileUpload: {
        value: function () {
            var multiFileUploadSwitch = element(by.css("label[for='switch-multiple-file']"));

            Util.waitUntilElementIsVisible(multiFileUploadSwitch);
            multiFileUploadSwitch.click();
            Util.waitUntilElementIsNotOnPage(this.multipleUploadButton);
            Util.waitUntilElementIsNotOnPage(this.multipleUploadEnabled);
            Util.waitUntilElementIsVisible(this.uploadButton);
        }
    },

    /**
     * upload mutiple files, 3
     * @property uploadMutipleFiles
     * */
    uploadMutipleFiles: {
        value: function (file1Location, file2Location) {
            Util.waitUntilElementIsVisible(this.multipleUploadButton);
            Util.waitUntilElementIsVisible(this.multipleUploadEnabled);

            var firstFile = Util.uploadParentFolder(file1Location);
            var secondFile = Util.uploadParentFolder(file2Location);

            Util.uploadFile(this.multipleUploadButton, this.multipleUploadButton, firstFile + "\n" + secondFile);
        }
    },

    /**
     * Enable filter on
     * @property enableFilter
     * */
    enableFilter: {
        value: function () {
            var acceptedFileTypeSwitch = element(by.css("label[for='switch-accepted-file-type']"));

            Util.waitUntilElementIsVisible(acceptedFileTypeSwitch);
            acceptedFileTypeSwitch.click();
            Util.waitUntilElementIsVisible(this.acceptedFilesText);
            Util.waitUntilElementIsVisible(this.uploadButton);
        }
    },

    /**
     * Disable multiple file upload
     * @property disableFilter
     * */
    disableFilter: {
        value: function () {
            var acceptedFileTypeSwitch = element(by.css("label[for='switch-accepted-file-type']"));

            Util.waitUntilElementIsVisible(acceptedFileTypeSwitch);
            acceptedFileTypeSwitch.click();
            Util.waitUntilElementIsNotOnPage(this.acceptedFilesText);
            Util.waitUntilElementIsVisible(this.uploadButton);
        }
    },

    /**
     * Enter allowed file types
     * @property allowedFileTypes
     * */
    setAllowedFileTypes: {
        value: function (allowedFileTypes) {
            var uploadButtonRestricted = element(by.css("input[data-automation-id='upload-single-file'][ng-reflect-accept='" + allowedFileTypes + "']"));

            Util.waitUntilElementIsVisible(this.acceptedFilesText);
            this.acceptedFilesText.clear();
            this.acceptedFilesText.sendKeys(allowedFileTypes);
            Util.waitUntilElementIsVisible(uploadButtonRestricted);
        }
    },

    /**
     * Enable versioning
     * @property enableVersioning
     * */
    enableVersioning: {
        value: function () {
            var versioningSwitch = element(by.css("label[for='switch-versioning']"));
            var versioningEnabled = element(by.css("alfresco-upload-button[data-automation-id='multiple-file-upload'][ng-reflect-versioning='true']"));

            Util.waitUntilElementIsVisible(versioningSwitch);
            versioningSwitch.click();
            Util.waitUntilElementIsVisible(versioningEnabled);
            Util.waitUntilElementIsVisible(this.uploadButton);
        }
    },

    /**
     * Disable versioning
     * @property disableVersioning
     * */
    disableVersioning: {
        value: function () {
            var versioningSwitch = element(by.css("label[for='switch-versioning']"));
            var versioningEnabled = element(by.css("alfresco-upload-button[data-automation-id='multiple-file-upload'][ng-reflect-versioning='true']"));

            Util.waitUntilElementIsVisible(versioningSwitch);
            versioningSwitch.click();
            Util.waitUntilElementIsNotOnPage(versioningEnabled);
            Util.waitUntilElementIsVisible(this.uploadButton);
        }
    },

    /**
     * adds versioning additon to to filename
     * @property  versionedFileName
     * */
    versionedFileName: {
        value: function (fileName, versioningAddition) {
            var fullFileName = fileName.split(".");
            var nameWithoutExtension = fullFileName[0];
            var extension = fullFileName[1];
            var versionedFileName = nameWithoutExtension + versioningAddition + "." + extension;

            return versionedFileName;
        }
    },

    /**
     * sort document list by display name, ascending/descending
     * @property  sortDisplayName
     * */
    sortDisplayName: {
        value: function (sorting) {
            var sortingIcon = element(by.css("th[class*='header--sorted-" + sorting + "'][data-automation-id='auto_id_name']"));

            Util.waitUntilElementIsVisible(sortingIcon);
            sortingIcon.click();
        }
    },

    /**
     * check first folder name
     * @property  checkFirstFolderName
     * */
    checkFirstFolderName: {
        value: function (folderName) {
            var firstFolder = element(by.xpath("//img[(contains(@src, 'folder.svg'))]/../../../../td/div/div[(contains(@data-automation-id, 'text_" + folderName +"'))]"));

            Util.waitUntilElementIsVisible(firstFolder);
            Util.waitUntilElementIsVisible(this.documentList);
            expect(firstFolder.getText()).toEqual(folderName);

        }
    },

    /**
     * check first file's name
     * @property  checkFirstFilesName
     * */
    checkFirstFilesName: {
        value: function (fileName) {
            var firstFile = element(by.xpath("//img[not (contains(@src, 'folder.svg'))]/../../../../td/div/div[(contains(@data-automation-id, 'text_" + fileName +"'))]"));

            Util.waitUntilElementIsVisible(firstFile);
            Util.waitUntilElementIsVisible(this.documentList);
            expect(firstFile.getText()).toEqual(fileName);
        }
    },

    /**
     * click created by when no icon is displayed
     * @property  clickCreatedBy
     * */
    clickCreatedBy: {
        value: function () {
            var createdBy = element(by.css("th[data-automation-id='auto_id_createdByUser.displayName']"));

            Util.waitUntilElementIsVisible(createdBy);
            createdBy.click();
        }
    },

    /**
     * sort document list by created by, ascending/descending
     * @property  sortCreatedBy
     * */
    sortCreatedBy: {
        value: function (sorting) {
            var sortingIcon = element(by.css("th[class*='header--sorted-" + sorting + "'][data-automation-id='auto_id_createdByUser.displayName']"));

            Util.waitUntilElementIsVisible(sortingIcon);
            sortingIcon.click();
        }
    },

    /**
     * check first folder creator
     * @property  checkFirstFolderName
     * */
    checkFirstFolderCreator: {
        value: function (folderName, creator) {
            var firstFolder = element(by.xpath("//img[(contains(@src, 'folder.svg'))]/../../../../td/div/div[(contains(@data-automation-id, 'text_" + creator +"'))]"));

            Util.waitUntilElementIsVisible(firstFolder);
            Util.waitUntilElementIsVisible(this.documentList);
            expect(firstFolder.getText()).toContain(creator);
        }
    },

    /**
     * check first file creator
     * @property  checkFirstFileName
     * */
    checkFirstFilesCreator: {
        value: function (fileName, creator) {
            var firstFile = element(by.xpath("//img[not (contains(@src, 'folder.svg'))]/../../../../td/div/div[(contains(@data-automation-id, 'text_" + creator +"'))]"));

            Util.waitUntilElementIsVisible(firstFile);
            Util.waitUntilElementIsVisible(this.documentList);
            expect(firstFile.getText()).toContain(creator);
        }
    },

    /**
     * click created on when no icon is displayed
     * @property  clickCreatedOn
     * */
    clickCreatedOn: {
        value: function () {
            var createdOn = element(by.css("th[data-automation-id='auto_id_createdAt']"));

            Util.waitUntilElementIsVisible(createdOn);
            createdOn.click();
        }
    },

    /**
     * sort document list by created on, ascending/descending
     * @property  sortCreatedBy
     * */
    sortCreatedBy: {
        value: function (sorting) {
            var sortingIcon = element(by.css("th[class*='header--sorted-" + sorting + "'][data-automation-id='auto_id_createdAt']"));

            Util.waitUntilElementIsVisible(sortingIcon);
            sortingIcon.click();
        }
    },

    /**
     * check first folder created on date
     * @property  checkFirstFolderDate
     * */
    checkFirstFolderDate: {
        value: function () {
            var firstFolder = element(by.xpath("//img[not (contains(@src, 'folder.svg'))]/../../../../td/div/div[(contains(@data-automation-id, 'date_'))]"));

            var todaysDate = Util.getCrtDateLongFormat();

            Util.waitUntilElementIsVisible(firstFolder);
            Util.waitUntilElementIsVisible(this.documentList);
            expect(firstFolder.getText()).toContain(todaysDate);
        }
    },

    /**
     * check first files created on date
     * @property  checkFirstFilesDate
     * */
    checkFirstFilesDate: {
        value: function () {
            var firstFile = element(by.xpath("//img[not (contains(@src, 'folder.svg'))]/../../../../td/div/div[(contains(@data-automation-id, 'date_'))]"));

            var todaysDate = Util.getCrtDateLongFormat();

            Util.waitUntilElementIsVisible(firstFile);
            Util.waitUntilElementIsVisible(this.documentList);
            expect(firstFile.getText()).toContain(todaysDate);
        }
    },

    getCurrentFolderID: {
        value: function () {
            return folderID.getText();
        }
    },

});
