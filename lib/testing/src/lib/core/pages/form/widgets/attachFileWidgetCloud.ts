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

import { FormFields } from '../formFields';
import { BrowserVisibility, BrowserActions } from '../../../utils/public-api';
import * as remote from 'selenium-webdriver/remote';
import { element, by, browser, ElementFinder } from 'protractor';

export class AttachFileWidgetCloud {

    widget: ElementFinder;
    constructor(fieldId: string) {
        this.widget = this.formFields.getWidget(fieldId);
    }

    formFields = new FormFields();
    contentButton = element(by.css('button[id="attach-Alfresco Content"]'));
    filesListLocator = by.css('div[id="adf-attach-widget-readonly-list"]');

    attachLocalFile(fileLocation: string) {
        browser.setFileDetector(new remote.FileDetector());
        const uploadButton = this.widget.element(by.css(`a input`));
        BrowserVisibility.waitUntilElementIsVisible(uploadButton);
        uploadButton.sendKeys(browser.params.rootPath + '/e2e' + fileLocation);
        BrowserVisibility.waitUntilElementIsVisible(uploadButton);
        return this;
    }

    async clickAttachContentFile(fileId: string) {
        const uploadButton = this.widget.element(by.css(`button[id=${fileId}]`));
        await BrowserActions.click(uploadButton);
        await BrowserActions.click(this.contentButton);
    }

    checkUploadContentButtonIsDisplayed(fileId: string) {
        const uploadButton = this.widget.element(by.css(`button[id=${fileId}]`));
        BrowserVisibility.waitUntilElementIsVisible(uploadButton);
        return this;
    }

    checkUploadContentButtonIsNotDisplayed(fileId: string) {
        const uploadButton = this.widget.element(by.css(`button[id=${fileId}]`));
        BrowserVisibility.waitUntilElementIsNotVisible(uploadButton);
        return this;
    }

    checkFileIsAttached(name) {
        const fileAttached = this.widget.element(this.filesListLocator).element(by.cssContainingText('mat-list-item span ', name));
        BrowserVisibility.waitUntilElementIsVisible(fileAttached);
        return this;
    }

    checkFileIsNotAttached(name) {
        const fileAttached = this.widget.element(this.filesListLocator).element(by.cssContainingText('mat-list-item span ', name));
        BrowserVisibility.waitUntilElementIsNotVisible(fileAttached);
        return this;
    }

    async getFileId(name: string) {
        const fileAttached = this.widget.element(this.filesListLocator).element(by.cssContainingText('mat-list-item span ', name));
        BrowserVisibility.waitUntilElementIsVisible(fileAttached);
        const fileId = await fileAttached.getAttribute('id');
        return fileId;
    }

    async removeFile(fileName: string) {
        const fileId = await this.getFileId(fileName);
        const deleteButton = this.widget.element(by.css(`button[id='${fileId}-remove']`));
        BrowserActions.click(deleteButton);
        return this;
    }

    viewFile(name) {
        const fileView = element(this.filesListLocator).element(by.cssContainingText('mat-list-item span ', name));
        BrowserActions.click(fileView);
        browser.actions().doubleClick(fileView).perform();
        return this;
    }
}
