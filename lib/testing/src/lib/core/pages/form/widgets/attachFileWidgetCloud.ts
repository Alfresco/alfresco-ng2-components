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
    formFields: FormFields = new FormFields();
    contentButton: ElementFinder = element(by.css('button[id="attach-Alfresco Content"]'));
    filesListLocator = by.css('div[id="adf-attach-widget-readonly-list"]');

    constructor(fieldId: string) {
        this.assignWidget(fieldId);
    }

    async assignWidget(fieldId: string) {
        this.widget = await this.formFields.getWidget(fieldId);
    }

    async attachLocalFile(fileLocation: string) {
        browser.setFileDetector(new remote.FileDetector());
        const uploadButton = this.widget.element(by.css(`a input`));
        await BrowserVisibility.waitUntilElementIsVisible(uploadButton);
        uploadButton.sendKeys(browser.params.rootPath + '/e2e' + fileLocation);
        await BrowserVisibility.waitUntilElementIsVisible(uploadButton);
        return this;
    }

    async clickAttachContentFile(fileId: string): Promise<void> {
        const uploadButton = this.widget.element(by.css(`button[id=${fileId}]`));
        await BrowserActions.click(uploadButton);
        await BrowserActions.click(this.contentButton);
    }

    async checkUploadContentButtonIsDisplayed(fileId: string) {
        const uploadButton = this.widget.element(by.css(`button[id=${fileId}]`));
        await BrowserVisibility.waitUntilElementIsVisible(uploadButton);
        return this;
    }

    async checkUploadContentButtonIsNotDisplayed(fileId: string) {
        const uploadButton = this.widget.element(by.css(`button[id=${fileId}]`));
        await BrowserVisibility.waitUntilElementIsNotVisible(uploadButton);
        return this;
    }

    async checkFileIsAttached(name) {
        const fileAttached = this.widget.element(this.filesListLocator).element(by.cssContainingText('mat-list-item span ', name));
        await BrowserVisibility.waitUntilElementIsVisible(fileAttached);
        return this;
    }

    async checkFileIsNotAttached(name) {
        const fileAttached = this.widget.element(this.filesListLocator).element(by.cssContainingText('mat-list-item span ', name));
        await BrowserVisibility.waitUntilElementIsNotVisible(fileAttached);
        return this;
    }

    async getFileId(name: string) {
        const fileAttached = this.widget.element(this.filesListLocator).element(by.cssContainingText('mat-list-item span ', name));
        await BrowserVisibility.waitUntilElementIsVisible(fileAttached);
        return fileAttached.getAttribute('id');
    }

    async removeFile(fileName: string) {
        const fileId = await this.getFileId(fileName);
        const deleteButton = this.widget.element(by.css(`button[id='${fileId}-remove']`));
        await BrowserActions.click(deleteButton);
        return this;
    }

    async viewFile(name) {
        const fileView = element(this.filesListLocator).element(by.cssContainingText('mat-list-item span ', name));
        await BrowserActions.click(fileView);
        browser.actions().doubleClick(fileView).perform();
        return this;
    }
}
