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

import { FormFields } from '../form-fields';
import { BrowserVisibility, BrowserActions } from '../../../utils/public-api';
import { element, by, browser } from 'protractor';

export class AttachFileWidgetPage {

    formFields = new FormFields();
    uploadLocator = by.css('button[id="attachfile"]');
    localStorageButton = element(by.css('input[id="attachfile"]'));
    filesListLocator = by.css('div[id="adf-attach-widget-readonly-list"]');
    attachFileWidget = element(by.css('#attachfile'));
    attachedFileMenu = element(by.css('mat-list-item button'));
    attachedFileOptions = element(by.css('.mat-menu-panel .mat-menu-content'));
    viewFileOptionButton = element(by.css(`.mat-menu-panel .mat-menu-content button[id$="show-file"]`));
    downloadFileOptionButton = element(by.css(`.mat-menu-panel .mat-menu-content button[id$="download-file"]`));
    removeFileOptionButton = element(by.css(`.mat-menu-panel .mat-menu-content button[id$="remove"]`));

    async attachFile(fieldId, fileLocation): Promise<void> {
        const widget = await this.formFields.getWidget(fieldId);
        const uploadButton = await widget.element(this.uploadLocator);
        await BrowserActions.click(uploadButton);
        await BrowserVisibility.waitUntilElementIsPresent(this.localStorageButton);
        await this.localStorageButton.sendKeys(fileLocation);
    }

    async checkFileIsAttached(fieldId, name): Promise<void> {
        const widget = await this.formFields.getWidget(fieldId);
        const fileAttached = widget.element(this.filesListLocator).element(by.cssContainingText('mat-list-item span ', name));
        await BrowserVisibility.waitUntilElementIsVisible(fileAttached);
    }

    async viewFile(name: string): Promise<void> {
        const fileView = element(this.filesListLocator).element(by.cssContainingText('mat-list-item span ', name));
        await BrowserActions.click(fileView);
        await browser.actions().doubleClick(fileView).perform();
    }

    async attachFileWidgetDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.attachFileWidget);
    }

    async toggleAttachedFileMenu(fieldId: string, fileName: string): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        const widget = await this.formFields.getWidget(fieldId);
        const fileAttached = await widget.element(this.filesListLocator).element(by.cssContainingText('mat-list-item span ', fileName));
        await BrowserVisibility.waitUntilElementIsVisible(fileAttached);
        const id = await fileAttached.getAttribute('id');
        const optionMenu = widget.element(by.css(`button[id='${id}-option-menu']`));
        await BrowserActions.click(optionMenu);
    }

    async checkAttachFileOptionsActiveForm(): Promise <void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.attachedFileOptions);
        await BrowserVisibility.waitUntilElementIsVisible(this.viewFileOptionButton);
        await BrowserVisibility.waitUntilElementIsVisible(this.downloadFileOptionButton);
        await BrowserVisibility.waitUntilElementIsVisible(this.removeFileOptionButton);
    }

    async checkAttachFileOptionsCompletedForm(): Promise <void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.attachedFileOptions);
        await BrowserVisibility.waitUntilElementIsVisible(this.viewFileOptionButton);
        await BrowserVisibility.waitUntilElementIsVisible(this.downloadFileOptionButton);
        await BrowserVisibility.waitUntilElementIsNotVisible(this.removeFileOptionButton);
    }

    async viewAttachedFile(): Promise<void> {
        await BrowserActions.click(this.viewFileOptionButton);
    }

    async downloadFile(): Promise<void> {
        await BrowserActions.click(this.downloadFileOptionButton);
    }

    async removeAttachedFile(): Promise<void> {
        await BrowserActions.click(this.removeFileOptionButton);
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

    async checkUploadIsNotVisible(fieldId): Promise<void> {
        const widget = await this.formFields.getWidget(fieldId);
        const uploadButton = await widget.element(this.uploadLocator);
        await BrowserVisibility.waitUntilElementIsNotPresent(uploadButton);
    }

    async selectUploadSource(name: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.attachedFileOptions);
        await BrowserActions.click(element(by.css(`button[id="attach-${name}"]`)));
    }

    async clickUploadButton(fieldId): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        const widget = await this.formFields.getWidget(fieldId);
        const uploadButton = await widget.element(this.uploadLocator);
        await BrowserActions.click(uploadButton);
    }
}
