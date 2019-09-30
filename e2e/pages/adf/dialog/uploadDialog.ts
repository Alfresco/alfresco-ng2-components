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

import { element, by, browser, ElementFinder, Locator } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class UploadDialog {

    closeButton: ElementFinder = element((by.css('footer[class*="upload-dialog__actions"] button[id="adf-upload-dialog-close"]')));
    dialog: ElementFinder = element(by.css('div[id="upload-dialog"]'));
    minimizedDialog: ElementFinder = element(by.css('div[class*="upload-dialog--minimized"]'));
    uploadedStatusIcon: Locator = by.css('mat-icon[class*="status--done"]');
    cancelledStatusIcon: Locator = by.css('div[class*="status--cancelled"]');
    errorStatusIcon = by.css('div[class*="status--error"] mat-icon');
    errorTooltip: ElementFinder = element(by.css('div.mat-tooltip'));
    rowByRowName = by.xpath('ancestor::adf-file-uploading-list-row');
    title: ElementFinder = element(by.css('span[class*="upload-dialog__title"]'));
    minimizeButton: ElementFinder = element(by.css('mat-icon[title="Minimize"]'));
    maximizeButton: ElementFinder = element(by.css('mat-icon[title="Maximize"]'));
    canUploadConfirmationTitle: ElementFinder = element(by.css('p[class="upload-dialog__confirmation--title"]'));
    canUploadConfirmationDescription: ElementFinder = element(by.css('p[class="upload-dialog__confirmation--text"]'));
    confirmationDialogNoButton: ElementFinder = element(by.partialButtonText('No'));
    confirmationDialogYesButton: ElementFinder = element(by.partialButtonText('Yes'));
    cancelUploadsElement: ElementFinder = element((by.css('footer[class*="upload-dialog__actions"] button[id="adf-upload-dialog-cancel-all"]')));

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

    getRowsName(content) {
        const row: ElementFinder = element.all(by.css(`div[class*='uploading-row'] span[title="${content}"]`)).first();
        return row;
    }

    getRowByRowName(content) {
        const rows = this.getRowsName(content);
        return rows.element(this.rowByRowName);
    }

    async fileIsUploaded(content): Promise<void> {
        const row = await this.getRowByRowName(content);
        await BrowserVisibility.waitUntilElementIsVisible(row.element(this.uploadedStatusIcon));
    }

    async fileIsError(content) {
        const row = await this.getRowByRowName(content);
        await BrowserVisibility.waitUntilElementIsVisible(row.element(this.errorStatusIcon));
    }

    async filesAreUploaded(content): Promise<void> {
        for (let i = 0; i < content.length; i++) {
            await this.fileIsUploaded(content[i]);
        }
    }

    async fileIsNotDisplayedInDialog(content): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(element(by.css(`div[class*='uploading-row'] span[title="${content}"]`)));
    }

    async cancelUploads(): Promise<void> {
        await BrowserActions.click(this.cancelUploadsElement);
    }

    async fileIsCancelled(content): Promise<void> {
        const row = await this.getRowByRowName(content);
        await BrowserVisibility.waitUntilElementIsVisible(row.element(this.cancelledStatusIcon));
    }

    async removeUploadedFile(content): Promise<void> {
        const row = await this.getRowByRowName(content);
        await BrowserVisibility.waitUntilElementIsVisible(row.element(this.uploadedStatusIcon));
        const elementRow = await this.getRowByRowName(content);
        await BrowserActions.click(elementRow.element(this.uploadedStatusIcon));

    }

    async getTitleText(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.title);
        return await this.title.getText();
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
        return await BrowserActions.getText(this.errorTooltip);
    }

}
