/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { BrowserActions, TestElement, TogglePage } from '@alfresco/adf-testing';
import { $, browser } from 'protractor';

export class VersionManagePage {

    togglePage = new TogglePage();

    showNewVersionButton = TestElement.byId('adf-show-version-upload-button');
    uploadNewVersionInput = TestElement.byCss('.adf-upload-version-button input[data-automation-id="upload-single-file"]');
    uploadNewVersionButton = TestElement.byCss('.adf-upload-version-button');
    uploadNewVersionContainer = TestElement.byId('adf-new-version-uploader-container');
    cancelButton = TestElement.byId('adf-new-version-cancel');
    majorRadio = TestElement.byId('adf-new-version-major');
    minorRadio = TestElement.byId('adf-new-version-minor');
    commentText = TestElement.byId('adf-new-version-text-area');
    readOnlySwitch = $('#adf-version-manager-switch-readonly');
    downloadSwitch = $('#adf-version-manager-switch-download');
    commentsSwitch = $('#adf-version-manager-switch-comments');
    confirmAccept = TestElement.byId('adf-confirm-accept');
    confirmCancel = TestElement.byId('adf-confirm-cancel');

    async uploadNewVersionFile(fileLocation: string): Promise<void> {
        const filePath = path.resolve(path.join(browser.params.testConfig.main.rootPath, fileLocation));

        await this.uploadNewVersionInput.waitPresent();
        await this.uploadNewVersionInput.elementFinder.sendKeys(filePath);
        await this.showNewVersionButton.waitVisible();
    }

    getFileVersionName(version: string): Promise<string> {
        return TestElement.byCss(`[id="adf-version-list-item-name-${version}"]`).getText();
    }

    checkFileVersionExist(version: string): Promise<void> {
        return TestElement.byId(`adf-version-list-item-version-${version}`).waitVisible();
    }

    checkFileVersionNotExist(version: string): Promise<void> {
        return TestElement.byId(`adf-version-list-item-version-${version}`).waitNotVisible();
    }

    getFileVersionComment(version: string): Promise<string> {
        return TestElement.byId(`adf-version-list-item-comment-${version}`).getText();
    }

    getFileVersionDate(version: string): Promise<string> {
        return TestElement.byId(`adf-version-list-item-date-${version}`).getText();
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
        await TestElement.byId(`adf-version-list-action-menu-button-${version}`).click();
        await TestElement.byCss('.cdk-overlay-container .mat-menu-content').waitVisible();
    }

    async closeActionsMenu(): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
    }

    async closeDisabledActionsMenu(): Promise<void> {
        const container = TestElement.byCss('div.cdk-overlay-backdrop.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing');
        await BrowserActions.closeDisabledMenu();
        await container.waitNotVisible();
    }

    async downloadFileVersion(version: string): Promise<void> {
        await this.clickActionButton(version);

        const downloadButton = TestElement.byId(`adf-version-list-action-download-${version}`);
        await downloadButton.click();
        await downloadButton.waitNotVisible();
    }

    async deleteFileVersion(version: string): Promise<void> {
        await this.clickActionButton(version);

        const deleteButton = TestElement.byId(`adf-version-list-action-delete-${version}`);
        await deleteButton.click();
    }

    async restoreFileVersion(version: string): Promise<void> {
        await this.clickActionButton(version);

        const restoreButton = TestElement.byId(`adf-version-list-action-restore-${version}`);
        await restoreButton.click();
    }

    async viewFileVersion(version): Promise<void> {
        await this.clickActionButton(version);

        const viewButton = TestElement.byId(`adf-version-list-action-view-${version}`);
        await viewButton.click();
    }

    async checkActionsArePresent(version: string): Promise<void> {
        await TestElement.byId(`adf-version-list-action-download-${version}`).waitVisible();
        await TestElement.byId(`adf-version-list-action-delete-${version}`).waitVisible();
        await TestElement.byId(`adf-version-list-action-restore-${version}`).waitVisible();
    }

    async closeVersionDialog(): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        await this.uploadNewVersionContainer.waitNotVisible();
    }
}
