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

import { element, by, browser, ElementFinder, $, $$ } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class UploadDialogPage {

    closeButton = $('footer[class*="upload-dialog__actions"] button[id="adf-upload-dialog-close"]');
    dialog = $('div[id="upload-dialog"]');
    minimizedDialog = $('div[class*="upload-dialog--minimized"]');
    uploadedStatusIcon = 'mat-icon[class*="status--done"]';
    cancelledStatusIcon = 'div[class*="status--cancelled"]';
    errorStatusIcon = 'div[class*="status--error"] mat-icon';
    errorTooltip = $('div.mat-tooltip');
    rowByRowName = by.xpath('ancestor::adf-file-uploading-list-row');
    title = $('span[class*="upload-dialog__title"]');
    minimizeButton = $('mat-icon[title="Minimize"]');
    maximizeButton = $('mat-icon[title="Maximize"]');
    canUploadConfirmationTitle = $('.upload-dialog__confirmation--title');
    canUploadConfirmationDescription = $('.upload-dialog__confirmation--text');
    confirmationDialogNoButton = element(by.partialButtonText('No'));
    confirmationDialogYesButton = element(by.partialButtonText('Yes'));
    cancelUploadsElement = $('footer[class*="upload-dialog__actions"] button[id="adf-upload-dialog-cancel-all"]');
    cancelUploadInProgressButton = $('div[data-automation-id="cancel-upload-progress"]');

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

    async getRowByRowName(content: string): Promise<ElementFinder> {
        const row = await $$(`div[class*='uploading-row'] span[title="${content}"]`).last();
        await BrowserVisibility.waitUntilElementIsVisible(row);
        return row.element(this.rowByRowName);
    }

    async fileIsUploaded(content: string): Promise<void> {
        const row: ElementFinder = await this.getRowByRowName(content);
        await BrowserVisibility.waitUntilElementIsVisible(row.$(this.uploadedStatusIcon), 10000);
    }

    async fileIsError(content: string) {
        const row: ElementFinder = await this.getRowByRowName(content);
        await BrowserVisibility.waitUntilElementIsVisible(row.$(this.errorStatusIcon));
    }

    async filesAreUploaded(content: string[]): Promise<void> {
        for (let i = 0; i < content.length; i++) {
            await this.fileIsUploaded(content[i]);
        }
    }

    async fileIsNotDisplayedInDialog(content: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible($(`div[class*='uploading-row'] span[title="${content}"]`));
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
        const row: ElementFinder = await this.getRowByRowName(content);
        await BrowserVisibility.waitUntilElementIsVisible(row);
        await BrowserVisibility.waitUntilElementIsVisible(row.$(this.cancelledStatusIcon), 10000);
    }

    async removeUploadedFile(content: string): Promise<void> {
        const row: ElementFinder = await this.getRowByRowName(content);
        await BrowserVisibility.waitUntilElementIsVisible(row.$(this.uploadedStatusIcon));
        const elementRow = await this.getRowByRowName(content);
        await BrowserActions.click(elementRow.$(this.uploadedStatusIcon));
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
        await BrowserVisibility.waitUntilElementIsVisible($(this.errorStatusIcon));
        await browser.actions().mouseMove($(this.errorStatusIcon)).perform();
    }

    async getTooltip(): Promise<string> {
        return BrowserActions.getText(this.errorTooltip);
    }
}
