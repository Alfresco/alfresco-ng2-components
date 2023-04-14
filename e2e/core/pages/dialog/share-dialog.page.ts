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

import { $$, $ } from 'protractor';
import { BrowserVisibility, TogglePage, BrowserActions, DateTimePickerPage } from '@alfresco/adf-testing';
import * as moment from 'moment';

export class ShareDialogPage {

    togglePage = new TogglePage();
    dateTimePickerPage = new DateTimePickerPage();
    shareDialog = $('adf-share-dialog');
    dialogTitle = $$('[data-automation-id="adf-share-dialog-title"]').first();
    shareToggle = $('[data-automation-id="adf-share-toggle"] label');
    expireToggle = $(`[data-automation-id="adf-expire-toggle"] label`);
    shareToggleChecked = $('mat-dialog-container mat-slide-toggle.mat-checked');
    shareLink = $('[data-automation-id="adf-share-link"]');
    closeButton = $('button[data-automation-id="adf-share-dialog-close"]');
    copySharedLinkButton = $('.adf-input-action');
    expirationDateInput = $('input[formcontrolname="time"]');
    confirmationDialog = $('adf-confirm-dialog');
    confirmationCancelButton = $('#adf-confirm-cancel');
    confirmationRemoveButton = $('#adf-confirm-accept');

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
        await BrowserVisibility.waitUntilElementIsStale($('mat-datetimepicker-content'));
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
