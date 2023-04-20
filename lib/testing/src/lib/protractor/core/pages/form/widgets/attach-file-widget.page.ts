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

import { FormFields } from '../form-fields';
import { BrowserVisibility, BrowserActions } from '../../../utils/public-api';
import { by, browser, $ } from 'protractor';
import { TestElement } from '../../../test-element';

export class AttachFileWidgetPage {

    formFields = new FormFields();
    alfrescoTypeUploadLocator = 'button[id="attachfile"]';
    localStorageButton = $('input[id="attachfile"]');
    filesListLocator = 'div[data-automation-id="adf-attach-widget-readonly-list"]';
    attachFileWidget = $('#attachfile');
    attachedFileMenu = $('mat-list-item button');
    attachedFileOptions = $('.mat-menu-panel .mat-menu-content');
    viewFileOptionButton = $(`.mat-menu-panel .mat-menu-content button[id$="show-file"]`);
    downloadFileOptionButton = $(`.mat-menu-panel .mat-menu-content button[id$="download-file"]`);
    removeFileOptionButton = TestElement.byCss(`.mat-menu-panel .mat-menu-content button[id$="remove"]`);

    async attachFile(fieldId: string, fileLocation: string): Promise<void> {
        const widget = await this.formFields.getWidget(fieldId);
        const uploadButton = await widget.$(this.alfrescoTypeUploadLocator);
        await BrowserActions.click(uploadButton);
        await BrowserVisibility.waitUntilElementIsPresent(this.localStorageButton);
        await this.localStorageButton.sendKeys(fileLocation);
    }

    async checkNoFileIsAttached(fieldId: string): Promise<void> {
        const widget = await this.formFields.getWidget(fieldId);
        const fileItem = widget.$(this.filesListLocator).$('mat-list-item');
        await BrowserVisibility.waitUntilElementIsNotVisible(fileItem);
    }

    async checkNoFileIsAttachedToWidgets(fieldIds: string[]): Promise<void> {
        for (const fieldId of fieldIds) {
            await this.checkNoFileIsAttached(fieldId);
        }
    }

    async checkFileIsAttached(fieldId: string, name: string): Promise<void> {
        const fileAttached = await this.getFileAttachedNotAttachedLocator(fieldId, name);
        await BrowserVisibility.waitUntilElementIsVisible(fileAttached);
    }

    async checkFilesAreAttachedToWidget(fieldId: string, names: string[]): Promise<void> {
        for (const fileName of names) {
            await this.checkFileIsAttached(fieldId, fileName);
        }
    }

    async checkFileIsNotAttached(fieldId: string, name: string): Promise<void> {
        const fileNotAttached = await this.getFileAttachedNotAttachedLocator(fieldId, name);
        await BrowserVisibility.waitUntilElementIsNotVisible(fileNotAttached);
    }

    async viewFile(name: string): Promise<void> {
        const fileView = $(this.filesListLocator).element(by.cssContainingText('mat-list-item span ', name));
        await BrowserActions.click(fileView);
        await browser.actions().doubleClick(fileView).perform();
    }

    async attachFileWidgetDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.attachFileWidget);
    }

    async toggleAttachedFileMenu(fieldId: string, fileName: string): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        const widget = await this.formFields.getWidget(fieldId);
        const fileAttached = await this.getFileAttachedNotAttachedLocator(fieldId, fileName);
        const id = await BrowserActions.getAttribute(fileAttached, 'id');
        const optionMenu = widget.$(`button[id='${id}-option-menu']`);
        await BrowserActions.click(optionMenu);
    }

    async checkAttachFileOptionsActiveForm(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.attachedFileOptions);
        await BrowserVisibility.waitUntilElementIsVisible(this.viewFileOptionButton);
        await BrowserVisibility.waitUntilElementIsVisible(this.downloadFileOptionButton);
        await this.removeFileOptionButton.waitVisible();
    }

    async checkAttachFileOptionsCompletedForm(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.attachedFileOptions);
        await BrowserVisibility.waitUntilElementIsVisible(this.viewFileOptionButton);
        await BrowserVisibility.waitUntilElementIsVisible(this.downloadFileOptionButton);
        await this.removeFileOptionButton.waitNotVisible();
    }

    async viewAttachedFile(): Promise<void> {
        await BrowserActions.click(this.viewFileOptionButton);
    }

    async downloadFile(): Promise<void> {
        await BrowserActions.click(this.downloadFileOptionButton);
    }

    async removeAttachedFile(): Promise<void> {
        await this.removeFileOptionButton.click();
    }

    async viewFileEnabled(): Promise<boolean> {
        return this.viewFileOptionButton.isEnabled();
    }

    async downloadFileEnabled(): Promise<boolean> {
        return this.downloadFileOptionButton.isEnabled();
    }

    async removeFileEnabled(): Promise<boolean> {
        return this.removeFileOptionButton.isEnabled();
    }

    async checkUploadIsNotVisible(fieldId: string): Promise<void> {
        const alfrescoTypeUploadLocator = `button[id="${fieldId}"]`;
        const widget = await this.formFields.getWidget(fieldId);
        const uploadButton = await widget.$(alfrescoTypeUploadLocator);
        await BrowserVisibility.waitUntilElementIsNotPresent(uploadButton);
    }

    async checkUploadIsVisible(fieldId: string): Promise<void> {
        const alfrescoTypeUploadLocator = `button[id="${fieldId}"]`;
        const widget = await this.formFields.getWidget(fieldId);
        const uploadButton = await widget.$(alfrescoTypeUploadLocator);
        await BrowserVisibility.waitUntilElementIsPresent(uploadButton);
    }

    async checkLocalTypeUploadIsPresent(fieldId: string): Promise<void> {
        const localTypeUpload = $(`input[id="${fieldId}"]`);
        await BrowserVisibility.waitUntilElementIsPresent(localTypeUpload);
    }

    async checkLocalTypeUploadIsNotPresent(fieldId: string): Promise<void> {
        const localTypeUpload = $(`input[id="${fieldId}"]`);
        await BrowserVisibility.waitUntilElementIsNotPresent(localTypeUpload);
    }

    async selectUploadSource(name: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.attachedFileOptions);
        await BrowserActions.click($(`button[id="attach-${name}"]`));
    }

    async clickUploadButton(fieldId: string): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        const widget = await this.formFields.getWidget(fieldId);
        const uploadButton = await widget.$(this.alfrescoTypeUploadLocator);
        await BrowserActions.click(uploadButton);
    }

    private async getFileAttachedNotAttachedLocator(fieldId: string, name: string) {
        const widget = await this.formFields.getWidget(fieldId);
        return widget.$(this.filesListLocator).element(by.cssContainingText('mat-list-item span span span', name));
    }
}
