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

import path = require('path');
import { browser, by, element, ElementFinder } from 'protractor';
import { FormControllersPage } from '@alfresco/adf-testing';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class VersionManagePage {

    formControllersPage: FormControllersPage = new FormControllersPage();

    showNewVersionButton: ElementFinder = element(by.id('adf-show-version-upload-button'));
    uploadNewVersionInput: ElementFinder = element(by.css('adf-upload-version-button input[data-automation-id="upload-single-file"]'));
    uploadNewVersionButton: ElementFinder = element(by.css('adf-upload-version-button'));
    uploadNewVersionContainer: ElementFinder = element(by.id('adf-new-version-uploader-container'));
    cancelButton: ElementFinder = element(by.id('adf-new-version-cancel'));
    majorRadio: ElementFinder = element(by.id('adf-new-version-major'));
    minorRadio: ElementFinder = element(by.id('adf-new-version-minor'));
    commentText: ElementFinder = element(by.id('adf-new-version-text-area'));
    readOnlySwitch: ElementFinder = element(by.id('adf-version-manager-switch-readonly'));
    downloadSwitch: ElementFinder = element(by.id('adf-version-manager-switch-download'));
    commentsSwitch: ElementFinder = element(by.id('adf-version-manager-switch-comments'));

    async checkUploadNewVersionsButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.showNewVersionButton);
    }

    async checkCancelButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.cancelButton);
    }

    async uploadNewVersionFile(fileLocation): Promise<void> {
        await BrowserVisibility.waitUntilElementIsPresent(this.uploadNewVersionInput);
        await this.uploadNewVersionInput.sendKeys(path.resolve(path.join(browser.params.testConfig.main.rootPath, fileLocation)));
        await BrowserVisibility.waitUntilElementIsVisible(this.showNewVersionButton);
    }

    async getFileVersionName(version): Promise<string> {
        const fileElement: ElementFinder = element(by.css(`[id="adf-version-list-item-name-${version}"]`));
        return await BrowserActions.getText(fileElement);
    }

    async checkFileVersionExist(version): Promise<void> {
        const fileVersion: ElementFinder = element(by.id(`adf-version-list-item-version-${version}`));
        await BrowserVisibility.waitUntilElementIsVisible(fileVersion);
    }

    async checkFileVersionNotExist(version): Promise<void> {
        const fileVersion: ElementFinder = element(by.id(`adf-version-list-item-version-${version}`));
        await BrowserVisibility.waitUntilElementIsNotVisible(fileVersion);
    }

    async getFileVersionComment(version): Promise<string> {
        const fileComment: ElementFinder = element(by.id(`adf-version-list-item-comment-${version}`));
        return await BrowserActions.getText(fileComment);
    }

    async getFileVersionDate(version): Promise<string> {
        const fileDate: ElementFinder = element(by.id(`adf-version-list-item-date-${version}`));
        return await BrowserActions.getText(fileDate);
    }

    async enterCommentText(text): Promise<void> {
        await BrowserActions.clearSendKeys(this.commentText, text);
    }

    async clickMajorChange(): Promise<void> {
        const radioMajor: ElementFinder = element(by.id(`adf-new-version-major`));
        await BrowserActions.click(radioMajor);
    }

    async clickMinorChange(): Promise<void> {
        const radioMinor: ElementFinder = element(by.id(`adf-new-version-minor`));
        await BrowserActions.click(radioMinor);
    }

    /**
     * disables readOnly
     */
    async disableReadOnly(): Promise<void> {
        await this.formControllersPage.disableToggle(this.readOnlySwitch);
    }

    /**
     * enables readOnly
     */
    async enableReadOnly(): Promise<void> {
        await this.formControllersPage.enableToggle(this.readOnlySwitch);
    }

    /**
     * disables download
     */
    async disableDownload(): Promise<void> {
        await this.formControllersPage.disableToggle(this.downloadSwitch);
    }

    /**
     * enables download
     */
    async enableDownload(): Promise<void> {
        await this.formControllersPage.enableToggle(this.downloadSwitch);
    }

    /**
     *
     * disables comments
     */
    async disableComments(): Promise<void> {
        await this.formControllersPage.disableToggle(this.commentsSwitch);
    }

    /**
     * enables comments
     */
    async enableComments(): Promise<void> {
        await this.formControllersPage.enableToggle(this.commentsSwitch);
    }

    async clickActionButton(version): Promise<void> {
        await BrowserActions.click(element(by.id(`adf-version-list-action-menu-button-${version}`)));
        await BrowserVisibility.waitUntilElementIsVisible(element(by.css('.cdk-overlay-container .mat-menu-content')));
    }

    async clickAcceptConfirm(): Promise<void> {
        await BrowserActions.click(element(by.id(`adf-confirm-accept`)));
    }

    async clickCancelConfirm(): Promise<void> {
        await BrowserActions.click(element(by.id(`adf-confirm-cancel`)));
    }

    async closeActionsMenu(): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
    }

    async closeDisabledActionsMenu(): Promise<void> {
        const container: ElementFinder = element(by.css('div.cdk-overlay-backdrop.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing'));
        await BrowserActions.closeDisabledMenu();
        await BrowserVisibility.waitUntilElementIsNotVisible(container);
    }

    async downloadFileVersion(version): Promise<void> {
        await this.clickActionButton(version);
        const downloadButton: ElementFinder = element(by.id(`adf-version-list-action-download-${version}`));
        await BrowserActions.click(downloadButton);
        await BrowserVisibility.waitUntilElementIsNotVisible(downloadButton);
    }

    async deleteFileVersion(version): Promise<void> {
        await this.clickActionButton(version);
        const deleteButton: ElementFinder = element(by.id(`adf-version-list-action-delete-${version}`));
        await BrowserActions.click(deleteButton);
    }

    async restoreFileVersion(version): Promise<void> {
        await this.clickActionButton(version);
        const restoreButton: ElementFinder = element(by.id(`adf-version-list-action-restore-${version}`));
        await BrowserActions.click(restoreButton);
    }

    async checkActionsArePresent(version): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element(by.id(`adf-version-list-action-download-${version}`)));
        await BrowserVisibility.waitUntilElementIsVisible(element(by.id(`adf-version-list-action-delete-${version}`)));
        await BrowserVisibility.waitUntilElementIsVisible(element(by.id(`adf-version-list-action-restore-${version}`)));
    }

    async closeVersionDialog(): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserVisibility.waitUntilElementIsNotVisible(this.uploadNewVersionContainer);
    }
}
