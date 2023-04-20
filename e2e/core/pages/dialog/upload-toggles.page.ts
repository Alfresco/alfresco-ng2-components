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

import { $, browser } from 'protractor';
import { BrowserActions, BrowserVisibility, TogglePage } from '@alfresco/adf-testing';

export class UploadTogglesPage {

    togglePage = new TogglePage();
    multipleFileUploadToggle = $('#adf-multiple-upload-switch');
    uploadFolderToggle = $('#adf-folder-upload-switch');
    extensionFilterToggle = $('#adf-extension-filter-upload-switch');
    maxSizeToggle = $('#adf-max-size-filter-upload-switch');
    versioningToggle = $('#adf-version-upload-switch');
    extensionAcceptedField = $('input[data-automation-id="accepted-files-type"]');
    maxSizeField = $('input[data-automation-id="max-files-size"]');
    disableUploadCheckbox = $('[id="adf-disable-upload"]');

    async enableMultipleFileUpload(): Promise<void> {
        await browser.executeScript('arguments[0].scrollIntoView()', this.multipleFileUploadToggle);
        await this.togglePage.enableToggle(this.multipleFileUploadToggle);
    }

    async disableMultipleFileUpload(): Promise<void> {
        await browser.executeScript('arguments[0].scrollIntoView()', this.multipleFileUploadToggle);
        await this.togglePage.disableToggle(this.multipleFileUploadToggle);
    }

    async enableFolderUpload(): Promise<void> {
        await this.togglePage.enableToggle(this.uploadFolderToggle);
    }

    async checkFolderUploadToggleIsEnabled(): Promise<boolean> {
        try {
            const enabledFolderUpload = $('mat-slide-toggle[id="adf-folder-upload-switch"][class*="mat-checked"]');
            await BrowserVisibility.waitUntilElementIsVisible(enabledFolderUpload);
            return true;
        } catch {
            return false;
        }
    }

    async checkMultipleFileUploadToggleIsEnabled(): Promise<void> {
        const enabledToggle = $('mat-slide-toggle[id="adf-multiple-upload-switch"][class*="mat-checked"]');
        await BrowserVisibility.waitUntilElementIsVisible(enabledToggle);
    }

    async checkMaxSizeToggleIsEnabled(): Promise<void> {
        const enabledToggle = $('mat-slide-toggle[id="adf-max-size-filter-upload-switch"][class*="mat-checked"]');
        await BrowserVisibility.waitUntilElementIsVisible(enabledToggle);
    }

    async checkVersioningToggleIsEnabled(): Promise<void> {
        const enabledToggle = $('mat-slide-toggle[id="adf-version-upload-switch"][class*="mat-checked"]');
        await BrowserVisibility.waitUntilElementIsVisible(enabledToggle);
    }

    async disableFolderUpload(): Promise<void> {
        await this.togglePage.disableToggle(this.uploadFolderToggle);
    }
    async checkFolderUploadToggleIsNotEnabled(): Promise<boolean> {
        try {
            const inactiveToggleFolder = $('#adf-folder-upload-switch .mat-slide-toggle-label');
            await BrowserVisibility.waitUntilElementIsVisible(inactiveToggleFolder);
            return true;
        } catch {
            return false;
        }
    }

    async enableExtensionFilter(): Promise<void> {
        await browser.executeScript('arguments[0].scrollIntoView()', this.extensionFilterToggle);
        await this.togglePage.enableToggle(this.extensionFilterToggle);
    }

    async disableExtensionFilter(): Promise<void> {
        await browser.executeScript('arguments[0].scrollIntoView()', this.extensionFilterToggle);
        await this.togglePage.disableToggle(this.extensionFilterToggle);
    }

    async enableMaxSize(): Promise<void> {
        await this.togglePage.enableToggle(this.maxSizeToggle);
    }

    async disableMaxSize(): Promise<void> {
        await this.togglePage.disableToggle(this.maxSizeToggle);
    }

    async enableVersioning(): Promise<void> {
        await this.togglePage.enableToggle(this.versioningToggle);
    }

    async disableVersioning(): Promise<void> {
        await this.togglePage.disableToggle(this.versioningToggle);
    }

    async clickCheckboxDisableUpload(): Promise<void> {
        await BrowserActions.click(this.disableUploadCheckbox);
    }

    async addExtension(extension: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.extensionAcceptedField);
        await this.extensionAcceptedField.sendKeys(',' + extension);
    }

    async addMaxSize(size): Promise<void> {
        await this.clearText();
        await this.maxSizeField.sendKeys(size);
    }

    async clearText(): Promise<void> {
        await BrowserActions.clearSendKeys(this.maxSizeField, '');
    }

}
