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

import { element, by, protractor, browser } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class UploadDialog {

    closeButton = element((by.css('footer[class*="upload-dialog__actions"] button[id="adf-upload-dialog-close"]')));
    dialog = element(by.css('div[id="upload-dialog"]'));
    minimizedDialog = element(by.css('div[class*="upload-dialog--minimized"]'));
    uploadedStatusIcon = by.css('mat-icon[class*="status--done"]');
    cancelledStatusIcon = by.css('div[class*="status--cancelled"]');
    errorStatusIcon = by.css('div[class*="status--error"] mat-icon');
    errorTooltip = element(by.css('div.mat-tooltip'));
    rowByRowName = by.xpath('ancestor::adf-file-uploading-list-row');
    title = element(by.css('span[class*="upload-dialog__title"]'));
    minimizeButton = element(by.css('mat-icon[title="Minimize"]'));
    maximizeButton = element(by.css('mat-icon[title="Maximize"]'));
    canUploadConfirmationTitle = element(by.css('p[class="upload-dialog__confirmation--title"]'));
    canUploadConfirmationDescription = element(by.css('p[class="upload-dialog__confirmation--text"]'));
    confirmationDialogNoButton = element(by.partialButtonText('No'));
    confirmationDialogYesButton = element(by.partialButtonText('Yes'));
    cancelUploadsElement = element((by.css('footer[class*="upload-dialog__actions"] button[id="adf-upload-dialog-cancel-all"]')));

    clickOnCloseButton() {
        this.checkCloseButtonIsDisplayed();
        BrowserActions.click(this.closeButton);
        return this;
    }

    checkCloseButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.closeButton);
        return this;
    }

    dialogIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.dialog);
        return this;
    }

    dialogIsMinimized() {
        BrowserVisibility.waitUntilElementIsVisible(this.minimizedDialog);
        return this;
    }

    dialogIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotOnPage(this.dialog);
        return this;
    }

    getRowsName(content) {
        const row = element.all(by.css(`div[class*='uploading-row'] span[title="${content}"]`)).first();
        BrowserVisibility.waitUntilElementIsVisible(row);
        return row;
    }

    getRowByRowName(content) {
        return this.getRowsName(content).element(this.rowByRowName);
    }

    fileIsUploaded(content) {
        BrowserVisibility.waitUntilElementIsVisible(this.getRowByRowName(content).element(this.uploadedStatusIcon));
        return this;
    }

    fileIsError(content) {
        BrowserVisibility.waitUntilElementIsVisible(this.getRowByRowName(content).element(this.errorStatusIcon));
        return this;
    }

    filesAreUploaded(content) {
        for (let i = 0; i < content.length; i++) {
            this.fileIsUploaded(content[i]);
        }
        return this;
    }

    fileIsNotDisplayedInDialog(content) {
        BrowserVisibility.waitUntilElementIsNotVisible(element(by.css(`div[class*='uploading-row'] span[title="${content}"]`)));
        return this;
    }

    cancelUploads() {
        BrowserActions.click(this.cancelUploadsElement);
        return this;
    }

    fileIsCancelled(content) {
        BrowserVisibility.waitUntilElementIsVisible(this.getRowByRowName(content).element(this.cancelledStatusIcon));
        return this;
    }

    removeUploadedFile(content) {
        BrowserVisibility.waitUntilElementIsVisible(this.getRowByRowName(content).element(this.uploadedStatusIcon));
        this.getRowByRowName(content).element(this.uploadedStatusIcon).click();
        return this;
    }

    getTitleText() {
        BrowserVisibility.waitUntilElementIsVisible(this.title);
        const deferred = protractor.promise.defer();
        this.title.getText().then((text) => {
            deferred.fulfill(text);
        });
        return deferred.promise;
    }

    getConfirmationDialogTitleText() {
        BrowserVisibility.waitUntilElementIsVisible(this.canUploadConfirmationTitle);
        const deferred = protractor.promise.defer();
        this.canUploadConfirmationTitle.getText().then((text) => {
            deferred.fulfill(text);
        });
        return deferred.promise;
    }

    getConfirmationDialogDescriptionText() {
        BrowserVisibility.waitUntilElementIsVisible(this.canUploadConfirmationDescription);
        const deferred = protractor.promise.defer();
        this.canUploadConfirmationDescription.getText().then((text) => {
            deferred.fulfill(text);
        });
        return deferred.promise;
    }

    clickOnConfirmationDialogYesButton() {
        BrowserActions.click(this.confirmationDialogYesButton);
        return this;
    }

    clickOnConfirmationDialogNoButton() {
        BrowserActions.click(this.confirmationDialogNoButton);
        return this;
    }

    async checkUploadCompleted() {
        return (await this.numberOfCurrentFilesUploaded()) === (await this.numberOfInitialFilesUploaded());
    }

    numberOfCurrentFilesUploaded() {
        const deferred = protractor.promise.defer();
        this.getTitleText().then((text: any) => {
            deferred.fulfill(text.split('Uploaded ')[1].split(' / ')[0]);
        });
        return deferred.promise;
    }

    numberOfInitialFilesUploaded() {
        const deferred = protractor.promise.defer();
        this.getTitleText().then((text: any) => {
            deferred.fulfill(text.split('Uploaded ')[1].split(' / ')[1]);
        });
        return deferred.promise;
    }

    minimizeUploadDialog() {
        BrowserActions.click(this.minimizeButton);
        return this;
    }

    maximizeUploadDialog() {
        BrowserActions.click(this.maximizeButton);
        return this;
    }

    displayTooltip() {
        BrowserVisibility.waitUntilElementIsVisible(element(this.errorStatusIcon));
        browser.actions().mouseMove(element(this.errorStatusIcon)).perform();
    }

    getTooltip() {
        return BrowserActions.getText(this.errorTooltip);
    }

}
