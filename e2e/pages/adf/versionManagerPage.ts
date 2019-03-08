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

import { Util } from '../../util/util';
import TestConfig = require('../../test.config');
import path = require('path');
import remote = require('selenium-webdriver/remote');
import { browser, by, element, protractor } from 'protractor';
import { FormControllersPage } from './material/formControllersPage';

export class VersionManagePage {

    formControllersPage = new FormControllersPage();

    showNewVersionButton = element(by.id('adf-show-version-upload-button'));
    uploadNewVersionButton = element(by.css('adf-upload-version-button input[data-automation-id="upload-single-file"]'));
    uploadNewVersionContainer = element(by.id('adf-new-version-uploader-container'));
    cancelButton = element(by.id('adf-new-version-cancel'));
    majorRadio = element(by.id('adf-new-version-major'));
    minorRadio = element(by.id('adf-new-version-minor'));
    commentText = element(by.id('adf-new-version-text-area'));
    readOnlySwitch = element(by.id('adf-version-manager-switch-readonly'));
    downloadSwitch = element(by.id('adf-version-manager-switch-download'));
    commentsSwitch = element(by.id('adf-version-manager-switch-comments'));

    checkUploadNewVersionsButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.showNewVersionButton);
        return this;
    }

    clickAddNewVersionsButton() {
        Util.waitUntilElementIsVisible(this.showNewVersionButton);
        this.showNewVersionButton.click();
        return this;
    }

    checkCancelButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.cancelButton);
        return this;
    }

    uploadNewVersionFile(fileLocation) {
        browser.setFileDetector(new remote.FileDetector());
        Util.waitUntilElementIsVisible(this.uploadNewVersionButton);
        this.uploadNewVersionButton.sendKeys(path.resolve(path.join(TestConfig.main.rootPath, fileLocation)));
        Util.waitUntilElementIsVisible(this.showNewVersionButton);
        return this;
    }

    getFileVersionName(version) {
        let fileElement = element(by.css(`[id="adf-version-list-item-name-${version}"]`));
        Util.waitUntilElementIsVisible(fileElement);
        return fileElement.getText();
    }

    checkFileVersionExist(version) {
        let fileVersion = element(by.id(`adf-version-list-item-version-${version}`));
        return Util.waitUntilElementIsVisible(fileVersion);
    }

    checkFileVersionNotExist(version) {
        let fileVersion = element(by.id(`adf-version-list-item-version-${version}`));
        return Util.waitUntilElementIsNotVisible(fileVersion);
    }

    getFileVersionComment(version) {
        let fileComment = element(by.id(`adf-version-list-item-comment-${version}`));
        Util.waitUntilElementIsVisible(fileComment);
        return fileComment.getText();
    }

    getFileVersionDate(version) {
        let fileDate = element(by.id(`adf-version-list-item-date-${version}`));
        Util.waitUntilElementIsVisible(fileDate);
        return fileDate.getText();
    }

    enterCommentText(text) {
        Util.waitUntilElementIsVisible(this.commentText);
        this.commentText.sendKeys('');
        this.commentText.clear();
        this.commentText.sendKeys(text);
        return this;
    }

    checkCommentTextIsDisplayed() {
        Util.waitUntilElementIsVisible(this.commentText);
        return this;
    }

    clickMajorChange() {
        let radioMajor = element(by.id(`adf-new-version-major`));
        Util.waitUntilElementIsVisible(radioMajor);
        radioMajor.click();
    }

    clickMinorChange() {
        let radioMinor = element(by.id(`adf-new-version-minor`));
        Util.waitUntilElementIsVisible(radioMinor);
        radioMinor.click();
    }

    checkMajorChangeIsDisplayed() {
        Util.waitUntilElementIsVisible(this.majorRadio);
        return this;
    }

    checkMinorChangeIsDisplayed() {
        Util.waitUntilElementIsVisible(this.minorRadio);
        return this;
    }

    /**
     * disables readOnly
     */
    disableReadOnly() {
        this.formControllersPage.disableToggle(this.readOnlySwitch);
    }

    /**
     * enables readOnly
     */
    enableReadOnly() {
        this.formControllersPage.enableToggle(this.readOnlySwitch);
    }

    /**
     * disables download
     */
    disableDownload() {
        this.formControllersPage.disableToggle(this.downloadSwitch);
    }

    /**
     * enables download
     */
    enableDownload() {
        this.formControllersPage.enableToggle(this.downloadSwitch);
    }

    /**
     *
     * disables comments
     */
    disableComments() {
        this.formControllersPage.disableToggle(this.commentsSwitch);
    }

    /**
     * enables comments
     */
    enableComments() {
        this.formControllersPage.enableToggle(this.commentsSwitch);
    }

    clickActionButton(version) {
        Util.waitUntilElementIsVisible(element(by.id(`adf-version-list-action-menu-button-${version}`)));
        element(by.id(`adf-version-list-action-menu-button-${version}`)).click();
        return this;
    }

    clickAcceptConfirm() {
        Util.waitUntilElementIsVisible(element(by.id(`adf-confirm-accept`)));
        element(by.id(`adf-confirm-accept`)).click();
        return this;
    }

    clickCancelConfirm() {
        Util.waitUntilElementIsVisible(element(by.id(`adf-confirm-cancel`)));
        element(by.id(`adf-confirm-cancel`)).click();
        return this;
    }

    closeActionButton() {
        let container = element(by.css('div.cdk-overlay-backdrop.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing'));
        Util.waitUntilElementIsVisible(container);
        container.click();
        Util.waitUntilElementIsNotVisible(container);
        return this;
    }

    downloadFileVersion(version) {
        this.clickActionButton(version);
        let downloadButton = element(by.id(`adf-version-list-action-download-${version}`));
        Util.waitUntilElementIsVisible(downloadButton);
        browser.driver.sleep(500);
        downloadButton.click();
        return this;
    }

    deleteFileVersion(version) {
        this.clickActionButton(version);
        let deleteButton = element(by.id(`adf-version-list-action-delete-${version}`));
        Util.waitUntilElementIsVisible(deleteButton);
        browser.driver.sleep(500);
        deleteButton.click();
        return this;
    }

    restoreFileVersion(version) {
        this.clickActionButton(version);
        let restoreButton = element(by.id(`adf-version-list-action-restore-${version}`));
        Util.waitUntilElementIsVisible(restoreButton);
        browser.driver.sleep(500);
        restoreButton.click();
        return this;
    }

    checkActionsArePresent(version) {
        Util.waitUntilElementIsVisible(element(by.id(`adf-version-list-action-download-${version}`)));
        Util.waitUntilElementIsVisible(element(by.id(`adf-version-list-action-delete-${version}`)));
        Util.waitUntilElementIsVisible(element(by.id(`adf-version-list-action-restore-${version}`)));
    }

    closeVersionDialog() {
        browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
        Util.waitUntilElementIsNotOnPage(this.uploadNewVersionContainer);
    }
}
