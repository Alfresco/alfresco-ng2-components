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

import { by, ElementFinder, browser, $ } from 'protractor';
import { BrowserActions } from '../../../../core/utils/browser-actions';
import { Logger } from '../../../../core/utils/logger';
import { BrowserVisibility } from '../../../../core/utils/browser-visibility';
import { TestElement } from '../../../../core/test-element';

export class AttachFileWidgetCloudPage {

    widget: ElementFinder;
    filesListLocator: string = 'div[class="adf-file-properties-table"]';

    constructor(fieldId: string) {
        this.assignWidget(fieldId);
    }

    async isFileTablePropertiesDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.widget.$(this.filesListLocator));
    }

    getFileAttachedLocatorByContainingText = async (text: string): Promise<ElementFinder> => this.widget.$(this.filesListLocator).element(by.cssContainingText('table tbody tr td span ', text));

    assignWidget(fieldId: string): void {
        this.widget = $(`adf-form-field div[id='field-${fieldId}-container']`);
    }

    async clickAttachContentFile(fileId: string): Promise<void> {
        const uploadButton = this.widget.$(`button[id=${fileId}]`);
        await BrowserActions.click(uploadButton);
    }

    async checkUploadContentButtonIsDisplayed(fileId: string): Promise<void> {
        const uploadButton = this.widget.$(`button[id=${fileId}]`);
        await BrowserVisibility.waitUntilElementIsVisible(uploadButton);
    }

    async checkUploadContentButtonIsNotDisplayed(fileId: string): Promise<void> {
        const uploadButton = this.widget.$(`button[id=${fileId}]`);
        await BrowserVisibility.waitUntilElementIsNotVisible(uploadButton);
    }

    async checkFileIsAttached(name): Promise<void> {
        const fileAttached = await this.getFileAttachedLocatorByContainingText(name);
        await this.isFileTablePropertiesDisplayed();
        await BrowserVisibility.waitUntilElementIsVisible(fileAttached);
    }

    async checkFilesAreAttached(filesName: string[]): Promise<void> {
        for (const fileName of filesName) {
            await this.checkFileIsAttached(fileName);
        }
    }

    async checkNoFileIsAttached(): Promise<void> {
        const fileItem = new TestElement(this.widget.$(this.filesListLocator).$('table'));
        await fileItem.waitNotVisible();
    }

    async checkFileIsNotAttached(name): Promise<void> {
        const fileAttached = await this.getFileAttachedLocatorByContainingText(name);
        await BrowserVisibility.waitUntilElementIsNotVisible(fileAttached);
    }

    async getFileId(name: string): Promise<string> {
        const fileAttached = await this.getFileAttachedLocatorByContainingText(name);
        return BrowserActions.getAttribute(fileAttached, 'id');
    }

    async clickActionMenu(fileName: string, actionName: string): Promise<void> {
        Logger.info('Click action menu');
        await BrowserActions.closeMenuAndDialogs();
        const fileId = await this.getFileId(fileName);
        Logger.info(`FileId ${fileId}`);
        const optionMenu = this.widget.$(`button[id='${fileId}-option-menu']`);
        await BrowserActions.click(optionMenu);
        await BrowserActions.waitUntilActionMenuIsVisible();
        await browser.waitForAngular();
        const actionButton = $(`button#${fileId}-${actionName}`);
        await BrowserActions.click(actionButton);
        await BrowserVisibility.waitUntilElementIsNotVisible(actionButton);
        await browser.waitForAngular();
    }

    async removeFile(fileName: string): Promise<void> {
        await this.clickActionMenu(fileName, 'remove');
    }

    async downloadFile(fileName: string): Promise<void> {
        await this.clickActionMenu(fileName, 'download-file');
    }

    async viewFile(fileName: string): Promise<void> {
        await this.clickActionMenu(fileName, 'show-file');
    }
}
