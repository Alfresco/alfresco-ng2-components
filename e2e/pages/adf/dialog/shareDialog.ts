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

import { element, by, ElementFinder, promise } from 'protractor';
import { BrowserVisibility, FormControllersPage, BrowserActions } from '@alfresco/adf-testing';
import moment = require('moment');

export class ShareDialog {

    formControllersPage = new FormControllersPage();
    shareDialog: ElementFinder = element(by.css('adf-share-dialog'));
    dialogTitle: ElementFinder = element(by.css('[data-automation-id="adf-share-dialog-title"]'));
    shareToggle: ElementFinder = element(by.css('[data-automation-id="adf-share-toggle"] label'));
    shareToggleChecked: ElementFinder = element(by.css('mat-dialog-container mat-slide-toggle.mat-checked'));
    shareLink: ElementFinder = element(by.css('[data-automation-id="adf-share-link"]'));
    closeButton: ElementFinder = element(by.css('button[data-automation-id="adf-share-dialog-close"]'));
    snackBar: ElementFinder = element(by.css('simple-snack-bar'));
    copySharedLinkButton: ElementFinder = element(by.css('.adf-input-action'));
    timeDatePickerButton: ElementFinder = element(by.css('mat-datetimepicker-toggle button'));
    dayPicker: ElementFinder = element(by.css('mat-datetimepicker-month-view'));
    clockPicker: ElementFinder = element(by.css('mat-datetimepicker-clock'));
    hoursPicker: ElementFinder = element(by.css('.mat-datetimepicker-clock-hours'));
    minutePicker: ElementFinder = element(by.css('.mat-datetimepicker-clock-minutes'));
    expirationDateInput: ElementFinder = element(by.css('input[formcontrolname="time"]'));
    confirmationDialog: ElementFinder = element(by.css('adf-confirm-dialog'));
    confirmationCancelButton: ElementFinder = element(by.id('adf-confirm-cancel'));
    confirmationRemoveButton: ElementFinder = element(by.id('adf-confirm-accept'));

    async checkDialogIsDisplayed(): Promise<void> {
        await  BrowserVisibility.waitUntilElementIsVisible(this.dialogTitle);
    }

    async clickUnShareFile() {
        await this.formControllersPage.enableToggle(this.shareToggle);
    }

    async clickConfirmationDialogCancelButton(): Promise<void> {
        await BrowserActions.click(this.confirmationCancelButton);
    }

    async clickConfirmationDialogRemoveButton(): Promise<void> {
        await BrowserActions.click(this.confirmationRemoveButton);
    }

    async checkShareLinkIsDisplayed(): Promise<void> {
        await  BrowserVisibility.waitUntilElementIsVisible(this.shareLink);
    }

    async getShareLink(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.shareLink);
        return this.shareLink.getAttribute('value');
    }

    async clickCloseButton(): Promise<void> {
        await  BrowserActions.click(this.closeButton);

    }

    async clickShareLinkButton(): Promise<void> {
        await  BrowserActions.click(this.copySharedLinkButton);
    }

    async shareToggleButtonIsChecked(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsPresent(this.shareToggleChecked);
    }

    async dialogIsClosed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsStale(this.shareDialog);
    }

    async clickDateTimePickerButton(): Promise<void> {
        await BrowserActions.click(this.timeDatePickerButton);
    }

    async calendarTodayDayIsDisabled(): Promise<void> {
        const tomorrow = moment().add(1, 'days').format('D');

        if (tomorrow !== '1') {
            const today: any = this.dayPicker.element(by.css('.mat-datetimepicker-calendar-body-today')).getText();
            await BrowserVisibility.waitUntilElementIsPresent(element(by.cssContainingText('.mat-datetimepicker-calendar-body-disabled', today)));
        }
    }

    async setDefaultDay(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.dayPicker);

        const tomorrow = moment().add(1, 'days').format('LL');
        await BrowserVisibility.waitUntilElementIsClickable(this.dayPicker.element(by.css(`td[aria-label="${tomorrow}"]`)));
        this.dayPicker.element(by.css(`td[aria-label="${tomorrow}"]`)).click();
    }

    async setDefaultHour(): Promise<void> {
        const selector = '.mat-datetimepicker-clock-cell:not(.mat-datetimepicker-clock-cell-disabled)';
        await BrowserVisibility.waitUntilElementIsVisible(this.clockPicker);
        await BrowserVisibility.waitUntilElementIsVisible(this.hoursPicker);
        await this.hoursPicker.all(by.css(selector)).first().click();
    }

    async setDefaultMinutes() {
        const selector = '.mat-datetimepicker-clock-cell:not(.mat-datetimepicker-clock-cell-disabled)';
        await BrowserVisibility.waitUntilElementIsVisible(this.minutePicker);
        await this.minutePicker.all(by.css(selector)).first().click();
    }

    async dateTimePickerDialogIsClosed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsStale(element(by.css('mat-datetimepicker-content')));
    }

    getExpirationDate(): promise.Promise<string> {
        return this.expirationDateInput.getAttribute('value');
    }

    async expirationDateInputHasValue(value): Promise<void> {
        await BrowserVisibility.waitUntilElementHasValue(this.expirationDateInput, value);
    }

    async confirmationDialogIsDisplayed(): Promise<void> {
        await  BrowserVisibility.waitUntilElementIsVisible(this.confirmationDialog);
    }
}
