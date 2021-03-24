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
import { Locator, element, by, browser } from 'protractor';
import { TestElement } from '../../../test-element';

export class AttachFileWidgetPage {

    formFields = new FormFields();
    alfrescoTypeUploadLocator: Locator = by.css('button[id="attachfile"]');
    localStorageButton = element(by.css('input[id="attachfile"]'));
    filesListLocator: Locator = by.css('div[id="adf-attach-widget-readonly-list"]');
    attachFileWidget = element(by.css('#attachfile'));
    attachedFileMenu = element(by.css('mat-list-item button'));
    attachedFileOptions = element(by.css('.mat-menu-panel .mat-menu-content'));
    viewFileOptionButton = element(by.css(`.mat-menu-panel .mat-menu-content button[id$="show-file"]`));
    downloadFileOptionButton = element(by.css(`.mat-menu-panel .mat-menu-content button[id$="download-file"]`));
    removeFileOptionButton = TestElement.byCss(`.mat-menu-panel .mat-menu-content button[id$="remove"]`);

    async attachFile(fieldId, fileLocation): Promise<void> {
        const widget = await this.formFields.getWidget(fieldId);
        const uploadButton = await widget.element(this.alfrescoTypeUploadLocator);
        await BrowserActions.click(uploadButton);
        await BrowserVisibility.waitUntilElementIsPresent(this.localStorageButton);
        await this.localStorageButton.sendKeys(fileLocation);
    }

    async checkNoFileIsAttached(fieldId): Promise<void> {
        const widget = await this.formFields.getWidget(fieldId);
        const fileItem = widget.element(this.filesListLocator).element(by.css('mat-list-item'));
        await BrowserVisibility.waitUntilElementIsNotVisible(fileItem);
    }

    async checkFileIsAttached(fieldId, name): Promise<void> {
        const widget = await this.formFields.getWidget(fieldId);
        const fileAttached = widget.element(this.filesListLocator).element(by.cssContainingText('mat-list-item span ', name));
        await BrowserVisibility.waitUntilElementIsVisible(fileAttached);
    }

    async checkFilesAreAttachedToWidget(fieldId, name): Promise<void> {
        await name.forEach(async fileName => {
            await this.checkFileIsAttached(fieldId, fileName);
        });
    }

    async checkFileIsNotAttached(fieldId, name): Promise<void> {
        const widget = await this.formFields.getWidget(fieldId);
        const fileNotAttached = widget.element(this.filesListLocator).element(by.cssContainingText('mat-list-item span ', name));
        await BrowserVisibility.waitUntilElementIsNotVisible(fileNotAttached);
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
        await this.removeFileOptionButton.waitVisible();
    }

    async checkAttachFileOptionsCompletedForm(): Promise <void> {
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

    async isRemoveFileOptionDisplayed(): Promise<boolean> {
        return this.removeFileOptionButton.isDisplayed();
    }

    async checkUploadIsNotVisible(fieldId): Promise<void> {
        const alfrescoTypeUploadLocator = by.css(`button[id="${fieldId}"]`);
        const widget = await this.formFields.getWidget(fieldId);
        const uploadButton = await widget.element(alfrescoTypeUploadLocator);
        await BrowserVisibility.waitUntilElementIsNotPresent(uploadButton);
    }

    async checkUploadIsVisible(fieldId): Promise<void> {
        const alfrescoTypeUploadLocator = by.css(`button[id="${fieldId}"]`);
        const widget = await this.formFields.getWidget(fieldId);
        const uploadButton = await widget.element(alfrescoTypeUploadLocator);
        await BrowserVisibility.waitUntilElementIsPresent(uploadButton);
    }

    async checkLocalTypeUploadIsPresent(fieldId): Promise<void> {
        const localTypeUpload = element(by.css(`input[id="${fieldId}"]`));
        await BrowserVisibility.waitUntilElementIsPresent(localTypeUpload);
    }

    async checkLocalTypeUploadIsNotPresent(fieldId): Promise<void> {
        const localTypeUpload = element(by.css(`input[id="${fieldId}"]`));
        await BrowserVisibility.waitUntilElementIsNotPresent(localTypeUpload);
    }

    async selectUploadSource(name: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.attachedFileOptions);
        await BrowserActions.click(element(by.css(`button[id="attach-${name}"]`)));
    }

    async clickUploadButton(fieldId): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        const widget = await this.formFields.getWidget(fieldId);
        const uploadButton = await widget.element(this.alfrescoTypeUploadLocator);
        await BrowserActions.click(uploadButton);
    }
}
