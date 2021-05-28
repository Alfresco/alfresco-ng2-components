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

import { element, by } from 'protractor';
import { BrowserVisibility, TogglePage, BrowserActions, DateTimePickerPage } from '@alfresco/adf-testing';
import moment = require('moment');

export class ShareDialogPage {

    togglePage = new TogglePage();
    dateTimePickerPage = new DateTimePickerPage();
    shareDialog = element(by.css('adf-share-dialog'));
    dialogTitle = element.all(by.css('[data-automation-id="adf-share-dialog-title"]')).first();
    shareToggle = element(by.css('[data-automation-id="adf-share-toggle"] label'));
    expireToggle = element(by.css(`[data-automation-id="adf-expire-toggle"] label`));
    shareToggleChecked = element(by.css('mat-dialog-container mat-slide-toggle.mat-checked'));
    shareLink = element(by.css('[data-automation-id="adf-share-link"]'));
    closeButton = element(by.css('button[data-automation-id="adf-share-dialog-close"]'));
    copySharedLinkButton = element(by.css('.adf-input-action'));
    expirationDateInput = element(by.css('input[formcontrolname="time"]'));
    confirmationDialog = element(by.css('adf-confirm-dialog'));
    confirmationCancelButton = element(by.id('adf-confirm-cancel'));
    confirmationRemoveButton = element(by.id('adf-confirm-accept'));

    async checkDialogIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.dialogTitle);
    }

    async clickUnShareFile() {
        await this.togglePage.enableToggle(this.shareToggle);
    }

    async clickExpireToggle() {
        await this.togglePage.enableToggle(this.expireToggle);
    }

    async clickConfirmationDialogCancelButton(): Promise<void> {
        await BrowserActions.click(this.confirmationCancelButton);
    }

    async clickConfirmationDialogRemoveButton(): Promise<void> {
        await BrowserActions.click(this.confirmationRemoveButton);
    }

    async checkShareLinkIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.shareLink);
    }

    async getShareLink(): Promise<string> {
        return BrowserActions.getInputValue(this.shareLink);
    }

    async clickCloseButton(): Promise<void> {
        await BrowserActions.click(this.closeButton);
    }

    async clickShareLinkButton(): Promise<void> {
        await BrowserActions.click(this.copySharedLinkButton);
    }

    async shareToggleButtonIsChecked(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsPresent(this.shareToggleChecked);
    }

    async dialogIsClosed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsStale(this.shareDialog);
    }

    async clickDateTimePickerButton(): Promise<void> {
        await this.dateTimePickerPage.clickDateTimePicker();
    }

    async calendarTodayDayIsDisabled(): Promise<void> {
        const tomorrow = moment().add(1, 'days').format('D');

        if (tomorrow !== '1') {
            await this.dateTimePickerPage.checkCalendarTodayDayIsDisabled();
        }
    }

    async setDefaultDay(): Promise<void> {
        const tomorrow = moment().add(1, 'days').format('D');
        await this.dateTimePickerPage.setDate(tomorrow);
    }

    async setDefaultHour(): Promise<void> {
        await this.dateTimePickerPage.dateTime.setDefaultEnabledHour();
    }

    async setDefaultMinutes() {
        await this.dateTimePickerPage.dateTime.setDefaultEnabledMinutes();
    }

    async dateTimePickerDialogIsClosed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsStale(element(by.css('mat-datetimepicker-content')));
    }

    async getExpirationDate(): Promise<string> {
        return BrowserActions.getInputValue(this.expirationDateInput);
    }

    async expirationDateInputHasValue(value): Promise<void> {
        await BrowserVisibility.waitUntilElementHasValue(this.expirationDateInput, value);
    }

    async confirmationDialogIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.confirmationDialog);
    }
}
