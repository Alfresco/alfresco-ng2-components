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

import { by, element, protractor } from 'protractor';
import { BrowserVisibility, FormControllersPage } from '@alfresco/adf-testing';

export class UploadToggles {

    formControllersPage = new FormControllersPage();
    multipleFileUploadToggle = element(by.id('adf-multiple-upload-switch'));
    uploadFolderToggle = element(by.id('adf-folder-upload-switch'));
    extensionFilterToggle = element(by.id('adf-extension-filter-upload-switch'));
    maxSizeToggle = element(by.id('adf-max-size-filter-upload-switch'));
    versioningToggle = element(by.id('adf-version-upload-switch'));
    extensionAcceptedField = element(by.css('input[data-automation-id="accepted-files-type"]'));
    maxSizeField = element(by.css('input[data-automation-id="max-files-size"]'));
    disableUploadCheckbox = element(by.css('[id="adf-disable-upload"]'));

    enableMultipleFileUpload() {
        this.formControllersPage.enableToggle(this.multipleFileUploadToggle);
        return this;
    }

    disableMultipleFileUpload() {
        this.formControllersPage.disableToggle(this.multipleFileUploadToggle);
        return this;
    }

    enableFolderUpload() {
        this.formControllersPage.enableToggle(this.uploadFolderToggle);
        return this;
    }

    checkFolderUploadToggleIsEnabled() {
        const enabledToggle = element(by.css('mat-slide-toggle[id="adf-folder-upload-switch"][class*="mat-checked"]'));
        BrowserVisibility.waitUntilElementIsVisible(enabledToggle);
        return this;
    }

    checkMultipleFileUploadToggleIsEnabled() {
        const enabledToggle = element(by.css('mat-slide-toggle[id="adf-multiple-upload-switch"][class*="mat-checked"]'));
        BrowserVisibility.waitUntilElementIsVisible(enabledToggle);
        return this;
    }

    checkMaxSizeToggleIsEnabled() {
        const enabledToggle = element(by.css('mat-slide-toggle[id="adf-max-size-filter-upload-switch"][class*="mat-checked"]'));
        BrowserVisibility.waitUntilElementIsVisible(enabledToggle);
        return this;
    }

    checkVersioningToggleIsEnabled() {
        const enabledToggle = element(by.css('mat-slide-toggle[id="adf-version-upload-switch"][class*="mat-checked"]'));
        BrowserVisibility.waitUntilElementIsVisible(enabledToggle);
        return this;
    }

    disableFolderUpload() {
        this.formControllersPage.disableToggle(this.uploadFolderToggle);
        return this;
    }

    enableExtensionFilter() {
        this.formControllersPage.enableToggle(this.extensionFilterToggle);
        return this;
    }

    disableExtensionFilter() {
        this.formControllersPage.disableToggle(this.extensionFilterToggle);
        return this;
    }

    enableMaxSize() {
        this.formControllersPage.enableToggle(this.maxSizeToggle);
        return this;
    }

    disableMaxSize() {
        this.formControllersPage.disableToggle(this.maxSizeToggle);
        return this;
    }

    enableVersioning() {
        this.formControllersPage.enableToggle(this.versioningToggle);
        return this;
    }

    disableVersioning() {
        this.formControllersPage.disableToggle(this.versioningToggle);
        return this;
    }

    clickCheckboxDisableUpload() {
        return this.disableUploadCheckbox.click();
    }

    addExtension(extension) {
        BrowserVisibility.waitUntilElementIsVisible(this.extensionAcceptedField);
        this.extensionAcceptedField.sendKeys(',' + extension);
    }

    addMaxSize(size) {
        this.clearText();
        this.maxSizeField.sendKeys(size);
    }

    clearText() {
        BrowserVisibility.waitUntilElementIsVisible(this.maxSizeField);
        const deferred = protractor.promise.defer();
        this.maxSizeField.clear().then(() => {
            this.maxSizeField.sendKeys(protractor.Key.ESCAPE);
        });
        return deferred.promise;
    }

}
