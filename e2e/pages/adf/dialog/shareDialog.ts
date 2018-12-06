/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { Util } from '../../../util/util';
import { FormControllersPage } from '../material/formControllersPage';

export class ShareDialog {

    formControllersPage = new FormControllersPage();
    shareDialog = element(by.css('adf-share-dialog'));
    dialogTitle = element(by.css('[data-automation-id="adf-share-dialog-title"]'));
    shareToggle = element(by.css('[data-automation-id="adf-share-toggle"] label'));
    shareToggleChecked = element(by.css('mat-dialog-container mat-slide-toggle.mat-checked'));
    shareToggleUnchecked = element(by.css('mat-dialog-container mat-slide-toggle:not(.mat-checked)'));
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
        return Util.waitUntilElementIsVisible(this.dialogTitle);
    }

    clickUnShareFile() {
        this.formControllersPage.enableToggle(this.shareToggle);
    }

    clickConfirmationDialogCancelButton() {
        Util.waitUntilElementIsVisible(this.confirmationCancelButton);
        this.confirmationCancelButton.click();
    }

    clickConfirmationDialogRemoveButton() {
        Util.waitUntilElementIsVisible(this.confirmationRemoveButton);
        this.confirmationRemoveButton.click();
    }

    checkShareLinkIsDisplayed() {
        return Util.waitUntilElementIsVisible(this.shareLink);
    }

    getShareLink() {
        Util.waitUntilElementIsVisible(this.shareLink);
        return this.shareLink.getAttribute('value');
    }

    clickCloseButton() {
        Util.waitUntilElementIsVisible(this.closeButton);
        return this.closeButton.click();
    }

    clickShareLinkButton() {
        Util.waitUntilElementIsVisible(this.copySharedLinkButton);
        return this.copySharedLinkButton.click();
    }

    shareToggleButtonIsChecked() {
        Util.waitUntilElementIsPresent(this.shareToggleChecked);
    }

    shareToggleButtonIsDisabled() {
        Util.waitUntilElementIsPresent(this.shareToggleDisabled);
    }

    shareToggleButtonIsUnchecked() {
        Util.waitUntilElementIsVisible(this.shareToggleUnchecked);
    }

    checkNotificationWithMessage(message) {
        Util.waitUntilElementIsVisible(
            element(by.cssContainingText('simple-snack-bar', message))
        );
    }

    waitForNotificationToClose() {
        Util.waitUntilElementIsStale(element(by.css('simple-snack-bar')));
    }

    dialogIsClosed() {
        Util.waitUntilElementIsStale(this.shareDialog);
    }

    clickDateTimePickerButton() {
        Util.waitUntilElementIsVisible(this.timeDatePickerButton);
        this.timeDatePickerButton.click();
    }

    calendarTodayDayIsDisabled() {
        const today = this.dayPicker.element(by.css('.mat-datetimepicker-calendar-body-today')).getText();
        Util.waitUntilElementIsPresent(element(by.cssContainingText('.mat-datetimepicker-calendar-body-disabled', today)));
    }

    setDefaultDay() {
        const selector = '.mat-datetimepicker-calendar-body-cell:not(.mat-datetimepicker-calendar-body-disabled)';
        Util.waitUntilElementIsVisible(this.dayPicker);
        let tomorrow = new Date(new Date().getTime() + 48 * 60 * 60 * 1000).getDate().toString();
        this.dayPicker.element(by.cssContainingText(selector, tomorrow)).click();
    }

    setDefaultHour() {
        const selector = '.mat-datetimepicker-clock-cell:not(.mat-datetimepicker-clock-cell-disabled)';
        Util.waitUntilElementIsVisible(this.clockPicker);
        Util.waitUntilElementIsVisible(this.hoursPicker);
        this.hoursPicker.all(by.css(selector)).first().click();
    }

    setDefaultMinutes() {
        const selector = '.mat-datetimepicker-clock-cell:not(.mat-datetimepicker-clock-cell-disabled)';
        Util.waitUntilElementIsVisible(this.minutePicker);
        this.minutePicker.all(by.css(selector)).first().click();
    }

    dateTimePickerDialogIsClosed() {
        Util.waitUntilElementIsStale(element(by.css('mat-datetimepicker-content')));
    }

    getExpirationDate() {
        return this.expirationDateInput.getAttribute('value');
    }

    expirationDateInputHasValue(value) {
        Util.waitUntilElementHasValue(this.expirationDateInput, value);
    }

    confirmationDialogIsDisplayed() {
        return Util.waitUntilElementIsVisible(this.confirmationDialog);
    }

    confirmationDialogIsNotDisplayed() {
        return Util.waitUntilElementIsNotVisible(this.confirmationDialog);
    }
}
