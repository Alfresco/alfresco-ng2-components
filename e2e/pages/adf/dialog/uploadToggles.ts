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

import { browser, by, element, ElementFinder } from 'protractor';
import { BrowserActions, BrowserVisibility, FormControllersPage } from '@alfresco/adf-testing';

export class UploadToggles {

    formControllersPage: FormControllersPage = new FormControllersPage();
    multipleFileUploadToggle: ElementFinder = element(by.id('adf-multiple-upload-switch'));
    uploadFolderToggle: ElementFinder = element(by.id('adf-folder-upload-switch'));
    extensionFilterToggle: ElementFinder = element(by.id('adf-extension-filter-upload-switch'));
    maxSizeToggle: ElementFinder = element(by.id('adf-max-size-filter-upload-switch'));
    versioningToggle: ElementFinder = element(by.id('adf-version-upload-switch'));
    extensionAcceptedField: ElementFinder = element(by.css('input[data-automation-id="accepted-files-type"]'));
    maxSizeField: ElementFinder = element(by.css('input[data-automation-id="max-files-size"]'));
    disableUploadCheckbox: ElementFinder = element(by.css('[id="adf-disable-upload"]'));

    async enableMultipleFileUpload(): Promise<void> {
        await browser.executeScript('arguments[0].scrollIntoView()', this.multipleFileUploadToggle);
        await this.formControllersPage.enableToggle(this.multipleFileUploadToggle);
    }

    async disableMultipleFileUpload(): Promise<void> {
        await browser.executeScript('arguments[0].scrollIntoView()', this.multipleFileUploadToggle);
        await this.formControllersPage.disableToggle(this.multipleFileUploadToggle);
    }

    async enableFolderUpload(): Promise<void> {
        await this.formControllersPage.enableToggle(this.uploadFolderToggle);
    }

    async checkMultipleFileUploadToggleIsEnabled(): Promise<void> {
        const enabledToggle: ElementFinder = element(by.css('mat-slide-toggle[id="adf-multiple-upload-switch"][class*="mat-checked"]'));
        await BrowserVisibility.waitUntilElementIsVisible(enabledToggle);
    }

    async checkMaxSizeToggleIsEnabled(): Promise<void> {
        const enabledToggle: ElementFinder = element(by.css('mat-slide-toggle[id="adf-max-size-filter-upload-switch"][class*="mat-checked"]'));
        await BrowserVisibility.waitUntilElementIsVisible(enabledToggle);
    }

    async checkVersioningToggleIsEnabled(): Promise<void> {
        const enabledToggle: ElementFinder = element(by.css('mat-slide-toggle[id="adf-version-upload-switch"][class*="mat-checked"]'));
        await BrowserVisibility.waitUntilElementIsVisible(enabledToggle);
    }

    async disableFolderUpload(): Promise<void> {
        await this.formControllersPage.disableToggle(this.uploadFolderToggle);
    }

    async enableExtensionFilter(): Promise<void> {
        await browser.executeScript('arguments[0].scrollIntoView()', this.extensionFilterToggle);
        await this.formControllersPage.enableToggle(this.extensionFilterToggle);
    }

    async disableExtensionFilter(): Promise<void> {
        await browser.executeScript('arguments[0].scrollIntoView()', this.extensionFilterToggle);
        await this.formControllersPage.disableToggle(this.extensionFilterToggle);
    }

    async enableMaxSize(): Promise<void> {
        await this.formControllersPage.enableToggle(this.maxSizeToggle);
    }

    async disableMaxSize(): Promise<void> {
        await this.formControllersPage.disableToggle(this.maxSizeToggle);
    }

    async enableVersioning(): Promise<void> {
        await this.formControllersPage.enableToggle(this.versioningToggle);
    }

    async disableVersioning(): Promise<void> {
        await this.formControllersPage.disableToggle(this.versioningToggle);
    }

    async clickCheckboxDisableUpload(): Promise<void> {
        await BrowserActions.click(this.disableUploadCheckbox);
    }

    async addExtension(extension): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.extensionAcceptedField);
        await this.extensionAcceptedField.sendKeys(',' + extension);
    }

    async addMaxSize(size): Promise<void> {
        await this.clearText();
        await this.maxSizeField.sendKeys(size);
    }

    async clearText(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.maxSizeField);
        await BrowserActions.clearSendKeys(this.maxSizeField, '');
    }

}
