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

import Util = require('../../util/util');
import TestConfig = require('../../test.config');
import path = require('path');
import { browser, by, element, protractor } from 'protractor';

export class VersionManagePage {

    showNewVersionButton = element(by.css('#adf-show-version-upload-button'));
    uploadNewVersionButton = element(by.css('adf-upload-version-button input[data-automation-id="upload-single-file"]'));
    uploadNewVersionContainer = element(by.css('#adf-new-version-uploader-container'));
    cancelButton = element(by.css('#adf-new-version-cancel'));
    majorRadio = element(by.css('#adf-new-version-major'));
    minorRadio = element(by.css('#adf-new-version-minor'));
    commentText = element(by.css('#adf-new-version-text-area'));
    readOnlySwitch = element(by.id('adf-version-manager-switch-readonly'));
    downloadSwitch = element(by.id('adf-version-manager-switch-download'));
    commentsSwitch = element(by.id('adf-version-manager-switch-comments'));

    checkUploadNewVersionsButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.showNewVersionButton);
        return this;
    }

    uploadNewVersionFile(fileLocation) {
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

    chekFileVersionExist(version) {
        let fileVersion = element(by.css(`[id="adf-version-list-item-version-${version}"]`));
        return Util.waitUntilElementIsVisible(fileVersion);
    }

    chekFileVersionNotExist(version) {
        let fileVersion = element(by.css(`[id="adf-version-list-item-version-${version}"]`));
        return Util.waitUntilElementIsNotVisible(fileVersion);
    }

    getFileVersionComment(version) {
        let fileComment = element(by.css(`[id="adf-version-list-item-comment-${version}"]`));
        Util.waitUntilElementIsVisible(fileComment);
        return fileComment.getText();
    }

    getFileVersionDate(version) {
        let fileDate = element(by.css(`[id="adf-version-list-item-date-${version}"]`));
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

    clickMajorChange() {
        let radioMajor = element(by.css(`[id="adf-new-version-major"]`));
        Util.waitUntilElementIsVisible(radioMajor);
        radioMajor.click();
    }

    clickMinorChange() {
        let radioMinor = element(by.css(`[id="adf-new-version-minor"]`));
        Util.waitUntilElementIsVisible(radioMinor);
        radioMinor.click();
    }

    /**
     * disables download
     */
    disableReadOnly() {
        Util.waitUntilElementIsVisible(this.readOnlySwitch);
        this.readOnlySwitch.getAttribute('class').then((check) => {
            if (check.indexOf('mat-checked') >= 0) {
                this.readOnlySwitch.click();
            }
        });
    }

    /**
     * enables download
     */
    enableReadOnly() {
        Util.waitUntilElementIsVisible(this.readOnlySwitch);
        this.readOnlySwitch.getAttribute('class').then((check) => {
            if (check.indexOf('mat-checked') < 0) {
                this.readOnlySwitch.click();
            }
        });
    }

    /**
     * disables download
     */
    disableDownload() {
        Util.waitUntilElementIsVisible(this.downloadSwitch);
        this.downloadSwitch.getAttribute('class').then((check) => {
            if (check.indexOf('mat-checked') >= 0) {
                this.downloadSwitch.click();
            }
        });
    }

    /**
     * enables download
     */
    enableDownload() {
        Util.waitUntilElementIsVisible(this.downloadSwitch);
        this.downloadSwitch.getAttribute('class').then((check) => {
            if (check.indexOf('mat-checked') < 0) {
                this.downloadSwitch.click();
            }
        });
    }

    /**
     *
     * disables comments
     */
    disableComments() {
        Util.waitUntilElementIsVisible(this.commentsSwitch);
        this.commentsSwitch.getAttribute('class').then((check) => {
            if (check.indexOf('mat-checked') >= 0) {
                this.commentsSwitch.click();
            }
        });
    }

    /**
     * enables comments
     */
    enableComments() {
        Util.waitUntilElementIsVisible(this.commentsSwitch);
        this.commentsSwitch.getAttribute('class').then((check) => {
            if (check.indexOf('mat-checked') < 0) {
                this.commentsSwitch.click();
            }
        });
    }

    clickActionButton(version) {
        Util.waitUntilElementIsVisible(element(by.css(`[id="adf-version-list-action-menu-button-${version}"]`)));
        element(by.css(`[id="adf-version-list-action-menu-button-${version}"]`)).click();
        return this;
    }

    clickAcceptConfirm() {
        Util.waitUntilElementIsVisible(element(by.css(`[id="adf-confirm-accept"]`)));
        element(by.css(`[id="adf-confirm-accept"]`)).click();
        return this;
    }

    clickCancelConfirm() {
        Util.waitUntilElementIsVisible(element(by.css(`[id="adf-confirm-cancel"]`)));
        element(by.css(`[id="adf-confirm-cancel"]`)).click();
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
        let downloadButton = element(by.css(`[id="adf-version-list-action-download-${version}"]`));
        Util.waitUntilElementIsVisible(downloadButton);
        browser.driver.sleep(500);
        downloadButton.click();
        return this;
    }

    deleteFileVersion(version) {
        this.clickActionButton(version);
        let deleteButton = element(by.css(`[id="adf-version-list-action-delete-${version}"]`));
        Util.waitUntilElementIsVisible(deleteButton);
        browser.driver.sleep(500);
        deleteButton.click();
        return this;
    }

    restoreFileVersion(version) {
        this.clickActionButton(version);
        let restoreButton = element(by.css(`[id="adf-version-list-action-restore-${version}"]`));
        Util.waitUntilElementIsVisible(restoreButton);
        browser.driver.sleep(500);
        restoreButton.click();
        return this;
    }

    checkActionsArePresent(version) {
        Util.waitUntilElementIsVisible(element(by.css(`[id="adf-version-list-action-download-${version}"]`)));
        Util.waitUntilElementIsVisible(element(by.css(`[id="adf-version-list-action-delete-${version}"]`)));
        Util.waitUntilElementIsVisible(element(by.css(`[id="adf-version-list-action-restore-${version}"]`)));
    }

    closeVersionDialog() {
        browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
        Util.waitUntilElementIsNotOnPage(this.uploadNewVersionContainer);
    }
}
