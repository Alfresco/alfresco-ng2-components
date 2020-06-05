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

import { element, by, browser, ElementFinder } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class UploadDialogPage {

    closeButton = element((by.css('footer[class*="upload-dialog__actions"] button[id="adf-upload-dialog-close"]')));
    dialog = element(by.css('div[id="upload-dialog"]'));
    minimizedDialog = element(by.css('div[class*="upload-dialog--minimized"]'));
    uploadedStatusIcon = by.css('mat-icon[class*="status--done"]');
    cancelledStatusIcon = by.css('div[class*="status--cancelled"]');
    errorStatusIcon = by.css('div[class*="status--error"] mat-icon');
    errorTooltip = element(by.css('div.mat-tooltip'));
    rowByRowName = by.xpath('ancestor::adf-file-uploading-list-row');
    title = element(by.css('span[class*="upload-dialog__title"]'));
    minimizeButton = element(by.css('mat-icon[title="Minimize"]'));
    maximizeButton = element(by.css('mat-icon[title="Maximize"]'));
    canUploadConfirmationTitle = element(by.css('.upload-dialog__confirmation--title'));
    canUploadConfirmationDescription = element(by.css('.upload-dialog__confirmation--text'));
    confirmationDialogNoButton = element(by.partialButtonText('No'));
    confirmationDialogYesButton = element(by.partialButtonText('Yes'));
    cancelUploadsElement = element((by.css('footer[class*="upload-dialog__actions"] button[id="adf-upload-dialog-cancel-all"]')));
    cancelUploadInProgressButton = element(by.css('div[data-automation-id="cancel-upload-progress"]'));

    async clickOnCloseButton(): Promise<void> {
        await this.checkCloseButtonIsDisplayed();
        await BrowserActions.clickExecuteScript('footer[class*="upload-dialog__actions"] button[id="adf-upload-dialog-close"]');
    }

    async checkCloseButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.closeButton);
    }

    async dialogIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.dialog);
    }

    async dialogIsMinimized(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.minimizedDialog);
    }

    async dialogIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.dialog);
    }

    getRowsByName(content: string): ElementFinder {
        return element.all(by.css(`div[class*='uploading-row'] span[title="${content}"]`)).first();
    }

    getRowByRowName(content: string) {
        const rows = this.getRowsByName(content);
        return rows.element(this.rowByRowName);
    }

    async fileIsUploaded(content: string): Promise<void> {
        const row = await this.getRowByRowName(content);
        await BrowserVisibility.waitUntilElementIsVisible(row.element(this.uploadedStatusIcon));
    }

    async fileIsError(content: string) {
        const row = await this.getRowByRowName(content);
        await BrowserVisibility.waitUntilElementIsVisible(row.element(this.errorStatusIcon));
    }

    async filesAreUploaded(content: string[]): Promise<void> {
        for (let i = 0; i < content.length; i++) {
            await this.fileIsUploaded(content[i]);
        }
    }

    async fileIsNotDisplayedInDialog(content: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(element(by.css(`div[class*='uploading-row'] span[title="${content}"]`)));
    }

    async cancelUploads(): Promise<void> {
        await BrowserActions.click(this.cancelUploadsElement);
    }

    async cancelProgress(): Promise<void> {
        await BrowserActions.click(this.cancelUploadInProgressButton);
    }

    async checkCancelProgressIsVisible(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.cancelUploadInProgressButton);
    }

    async fileIsCancelled(content: string): Promise<void> {
        const row = await this.getRowByRowName(content);
        await BrowserVisibility.waitUntilElementIsVisible(row.element(this.cancelledStatusIcon), 10000);
    }

    async removeUploadedFile(content: string): Promise<void> {
        const row = await this.getRowByRowName(content);
        await BrowserVisibility.waitUntilElementIsVisible(row.element(this.uploadedStatusIcon));
        const elementRow = await this.getRowByRowName(content);
        await BrowserActions.click(elementRow.element(this.uploadedStatusIcon));

    }

    async getTitleText(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.title);
        return this.title.getText();
    }

    async getConfirmationDialogTitleText(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.canUploadConfirmationTitle);
        return this.canUploadConfirmationTitle.getText();
    }

    async getConfirmationDialogDescriptionText(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.canUploadConfirmationDescription);
        return this.canUploadConfirmationDescription.getText();
    }

    async clickOnConfirmationDialogYesButton(): Promise<void> {
        await BrowserActions.click(this.confirmationDialogYesButton);
    }

    async clickOnConfirmationDialogNoButton(): Promise<void> {
        await BrowserActions.click(this.confirmationDialogNoButton);
    }

    async numberOfCurrentFilesUploaded(): Promise<string> {
        const text = await this.getTitleText();
        return text.split('Uploaded ')[1].split(' / ')[0];
    }

    async numberOfInitialFilesUploaded(): Promise<string> {
        const text = await this.getTitleText();
        return text.split('Uploaded ')[1].split(' / ')[1];
    }

    async minimizeUploadDialog(): Promise<void> {
        await BrowserActions.click(this.minimizeButton);
    }

    async maximizeUploadDialog(): Promise<void> {
        await BrowserActions.click(this.maximizeButton);
    }

    async displayTooltip(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element(this.errorStatusIcon));
        await browser.actions().mouseMove(element(this.errorStatusIcon)).perform();
    }

    async getTooltip(): Promise<string> {
        return BrowserActions.getText(this.errorTooltip);
    }
}
