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

import * as path from 'path';
import { BrowserActions, BrowserVisibility, TogglePage, getTestConfig } from '@alfresco/adf-testing';
import { by, element } from 'protractor';

const testConfig = getTestConfig();

export class VersionManagePage {

    togglePage = new TogglePage();

    showNewVersionButton = element(by.id('adf-show-version-upload-button'));
    uploadNewVersionInput = element(by.css('adf-upload-version-button input[data-automation-id="upload-single-file"]'));
    uploadNewVersionButton = element(by.css('adf-upload-version-button'));
    uploadNewVersionContainer = element(by.id('adf-new-version-uploader-container'));
    cancelButton = element(by.id('adf-new-version-cancel'));
    majorRadio = element(by.id('adf-new-version-major'));
    minorRadio = element(by.id('adf-new-version-minor'));
    commentText = element(by.id('adf-new-version-text-area'));
    readOnlySwitch = element(by.id('adf-version-manager-switch-readonly'));
    downloadSwitch = element(by.id('adf-version-manager-switch-download'));
    commentsSwitch = element(by.id('adf-version-manager-switch-comments'));

    async checkUploadNewVersionsButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.showNewVersionButton);
    }

    async checkCancelButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.cancelButton);
    }

    async uploadNewVersionFile(fileLocation: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsPresent(this.uploadNewVersionInput);
        await this.uploadNewVersionInput.sendKeys(path.resolve(path.join(testConfig.main.rootPath, fileLocation)));
        await BrowserVisibility.waitUntilElementIsVisible(this.showNewVersionButton);
    }

    async getFileVersionName(version: string): Promise<string> {
        const fileElement = element(by.css(`[id="adf-version-list-item-name-${version}"]`));
        return BrowserActions.getText(fileElement);
    }

    async checkFileVersionExist(version: string): Promise<void> {
        const fileVersion = element(by.id(`adf-version-list-item-version-${version}`));
        await BrowserVisibility.waitUntilElementIsVisible(fileVersion);
    }

    async checkFileVersionNotExist(version: string): Promise<void> {
        const fileVersion = element(by.id(`adf-version-list-item-version-${version}`));
        await BrowserVisibility.waitUntilElementIsNotVisible(fileVersion);
    }

    async getFileVersionComment(version: string): Promise<string> {
        const fileComment = element(by.id(`adf-version-list-item-comment-${version}`));
        return BrowserActions.getText(fileComment);
    }

    async getFileVersionDate(version: string): Promise<string> {
        const fileDate = element(by.id(`adf-version-list-item-date-${version}`));
        return BrowserActions.getText(fileDate);
    }

    async enterCommentText(text: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.commentText, text);
    }

    async clickMajorChange(): Promise<void> {
        const radioMajor = element(by.id(`adf-new-version-major`));
        await BrowserActions.click(radioMajor);
    }

    async clickMinorChange(): Promise<void> {
        const radioMinor = element(by.id(`adf-new-version-minor`));
        await BrowserActions.click(radioMinor);
    }

    /**
     * disables readOnly
     */
    async disableReadOnly(): Promise<void> {
        await this.togglePage.disableToggle(this.readOnlySwitch);
    }

    /**
     * enables readOnly
     */
    async enableReadOnly(): Promise<void> {
        await this.togglePage.enableToggle(this.readOnlySwitch);
    }

    /**
     * disables download
     */
    async disableDownload(): Promise<void> {
        await this.togglePage.disableToggle(this.downloadSwitch);
    }

    /**
     * enables download
     */
    async enableDownload(): Promise<void> {
        await this.togglePage.enableToggle(this.downloadSwitch);
    }

    /**
     *
     * disables comments
     */
    async disableComments(): Promise<void> {
        await this.togglePage.disableToggle(this.commentsSwitch);
    }

    /**
     * enables comments
     */
    async enableComments(): Promise<void> {
        await this.togglePage.enableToggle(this.commentsSwitch);
    }

    async clickActionButton(version: string): Promise<void> {
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
        const container = element(by.css('div.cdk-overlay-backdrop.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing'));
        await BrowserActions.closeDisabledMenu();
        await BrowserVisibility.waitUntilElementIsNotVisible(container);
    }

    async downloadFileVersion(version: string): Promise<void> {
        await this.clickActionButton(version);
        const downloadButton = element(by.id(`adf-version-list-action-download-${version}`));
        await BrowserActions.click(downloadButton);
        await BrowserVisibility.waitUntilElementIsNotVisible(downloadButton);
    }

    async deleteFileVersion(version: string): Promise<void> {
        await this.clickActionButton(version);
        const deleteButton = element(by.id(`adf-version-list-action-delete-${version}`));
        await BrowserActions.click(deleteButton);
    }

    async restoreFileVersion(version: string): Promise<void> {
        await this.clickActionButton(version);
        const restoreButton = element(by.id(`adf-version-list-action-restore-${version}`));
        await BrowserActions.click(restoreButton);
    }

    async checkActionsArePresent(version: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element(by.id(`adf-version-list-action-download-${version}`)));
        await BrowserVisibility.waitUntilElementIsVisible(element(by.id(`adf-version-list-action-delete-${version}`)));
        await BrowserVisibility.waitUntilElementIsVisible(element(by.id(`adf-version-list-action-restore-${version}`)));
    }

    async closeVersionDialog(): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserVisibility.waitUntilElementIsNotVisible(this.uploadNewVersionContainer);
    }
}
