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
import { BrowserVisibility, FormControllersPage, BrowserActions } from '@alfresco/adf-testing';
import moment = require('moment');

export class ShareDialog {

    formControllersPage = new FormControllersPage();
    shareDialog = element(by.css('adf-share-dialog'));
    dialogTitle = element(by.css('[data-automation-id="adf-share-dialog-title"]'));
    shareToggle = element(by.css('[data-automation-id="adf-share-toggle"] label'));
    shareToggleChecked = element(by.css('mat-dialog-container mat-slide-toggle.mat-checked'));
    shareToggleDisabled = element(by.css('mat-dialog-container mat-slide-toggle.mat-disabled'));
    shareLink = element(by.css('[data-automation-id="adf-share-link"]'));
    closeButton = element(by.css('button[data-automation-id="adf-share-dialog-close"]'));
    snackBar = element(by.css('simple-snack-bar'));
    copySharedLinkButton = element(by.css('.adf-input-action'));
    timeDatePickerButton = element(by.css('mat-datetimepicker-toggle button'));
    dayPicker = element(by.css('mat-datetimepicker-month-view'));
    clockPicker = element(by.css('mat-datetimepicker-clock'));
    hoursPicker = element(by.css('.mat-datetimepicker-clock-hours'));
    minutePicker = element(by.css('.mat-datetimepicker-clock-minutes'));
    expirationDateInput = element(by.css('input[formcontrolname="time"]'));
    confirmationDialog = element(by.css('adf-confirm-dialog'));
    confirmationCancelButton = element(by.id('adf-confirm-cancel'));
    confirmationRemoveButton = element(by.id('adf-confirm-accept'));

    checkDialogIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.dialogTitle);
    }

    clickUnShareFile() {
        this.formControllersPage.enableToggle(this.shareToggle);
    }

    clickConfirmationDialogCancelButton() {
        BrowserActions.click(this.confirmationCancelButton);
    }

    clickConfirmationDialogRemoveButton() {
        BrowserActions.click(this.confirmationRemoveButton);
    }

    checkShareLinkIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.shareLink);
    }

    getShareLink() {
        BrowserVisibility.waitUntilElementIsVisible(this.shareLink);
        return this.shareLink.getAttribute('value');
    }

    clickCloseButton() {
        return BrowserActions.click(this.closeButton);

    }

    clickShareLinkButton() {
        return BrowserActions.click(this.copySharedLinkButton);
    }

    shareToggleButtonIsChecked() {
        BrowserVisibility.waitUntilElementIsPresent(this.shareToggleChecked);
    }

    shareToggleButtonIsDisabled() {
        BrowserVisibility.waitUntilElementIsPresent(this.shareToggleDisabled);
    }

    checkNotificationWithMessage(message) {
        BrowserVisibility.waitUntilElementIsPresent(
            element(by.cssContainingText('simple-snack-bar', message))
        );
    }

    dialogIsClosed() {
        BrowserVisibility.waitUntilElementIsStale(this.shareDialog);
    }

    clickDateTimePickerButton() {
        BrowserActions.click(this.timeDatePickerButton);
    }

    calendarTodayDayIsDisabled() {
        const tomorrow = moment().add(1, 'days').format('D');

        if (tomorrow !== '1') {
            const today: any = this.dayPicker.element(by.css('.mat-datetimepicker-calendar-body-today')).getText();
            BrowserVisibility.waitUntilElementIsPresent(element(by.cssContainingText('.mat-datetimepicker-calendar-body-disabled', today)));
        }
    }

    setDefaultDay() {
        BrowserVisibility.waitUntilElementIsVisible(this.dayPicker);

        const tomorrow = moment().add(1, 'days').format('MMM D, YYYY');
        BrowserVisibility.waitUntilElementIsClickable(this.dayPicker.element(by.css(`td[aria-label="${tomorrow}"]`)));
        this.dayPicker.element(by.css(`td[aria-label="${tomorrow}"]`)).click();
    }

    setDefaultHour() {
        const selector = '.mat-datetimepicker-clock-cell:not(.mat-datetimepicker-clock-cell-disabled)';
        BrowserVisibility.waitUntilElementIsVisible(this.clockPicker);
        BrowserVisibility.waitUntilElementIsVisible(this.hoursPicker);
        this.hoursPicker.all(by.css(selector)).first().click();
    }

    setDefaultMinutes() {
        const selector = '.mat-datetimepicker-clock-cell:not(.mat-datetimepicker-clock-cell-disabled)';
        BrowserVisibility.waitUntilElementIsVisible(this.minutePicker);
        this.minutePicker.all(by.css(selector)).first().click();
    }

    dateTimePickerDialogIsClosed() {
        BrowserVisibility.waitUntilElementIsStale(element(by.css('mat-datetimepicker-content')));
    }

    getExpirationDate() {
        return this.expirationDateInput.getAttribute('value');
    }

    expirationDateInputHasValue(value) {
        BrowserVisibility.waitUntilElementHasValue(this.expirationDateInput, value);
    }

    confirmationDialogIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.confirmationDialog);
    }

    confirmationDialogIsNotDisplayed() {
        return BrowserVisibility.waitUntilElementIsNotVisible(this.confirmationDialog);
    }
}
