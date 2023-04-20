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

import { protractor, ElementFinder, $ } from 'protractor';
import { DatePickerCalendarPage } from '../../../core/pages/material/date-picker-calendar.page';
import { BrowserVisibility } from '../../../core/utils/browser-visibility';
import { BrowserActions } from '../../../core/utils/browser-actions';

export class DateRangeFilterPage {

    fromField = 'input[data-automation-id="date-range-from-input"]';
    fromDateToggle = 'mat-datepicker-toggle[data-automation-id="date-range-from-date-toggle"]';
    toField = 'input[data-automation-id="date-range-to-input"]';
    toDateToggle = 'mat-datepicker-toggle[data-automation-id="date-range-to-date-toggle"]';
    applyButton = 'button[data-automation-id="date-range-apply-btn"]';
    clearButton = 'button[data-automation-id="date-range-clear-btn"]';
    fromErrorMessage = 'mat-error[data-automation-id="date-range-from-error"]';
    toErrorMessage = 'mat-error[data-automation-id="date-range-to-error"]';
    filter: ElementFinder;

    constructor(filter: ElementFinder) {
        this.filter = filter;
    }

    async getFromDate(): Promise<string> {
        return BrowserActions.getInputValue(this.filter.$(this.fromField));
    }

    async putFromDate(date): Promise<void> {
        await this.checkFromFieldIsDisplayed();
        await BrowserActions.clearSendKeys(this.filter.$(this.fromField), date);
        await this.filter.$(this.fromField).sendKeys(protractor.Key.ENTER);
    }

    async getFromCalendarSelectedDate(): Promise<string> {
        const datePicker = await this.openFromDatePicker();
        const selectedDate = await datePicker.getSelectedDate();
        await datePicker.closeDatePicker();
        return selectedDate;
    }

    async openFromDatePicker(): Promise<DatePickerCalendarPage> {
        await BrowserActions.click(this.filter.$(this.fromDateToggle));

        const datePicker = new DatePickerCalendarPage();
        await datePicker.checkDatePickerIsDisplayed();
        return datePicker;
    }

    async openToDatePicker(): Promise<DatePickerCalendarPage> {
        await BrowserActions.click(this.filter.$(this.toDateToggle));
        const datePicker = new DatePickerCalendarPage();
        await datePicker.checkDatePickerIsDisplayed();
        return datePicker;
    }

    async clickFromField(): Promise<void> {
        await BrowserActions.click(this.filter.$(this.fromField));
    }

    async checkFromErrorMessageIsDisplayed(msg: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.$(this.fromErrorMessage));
        const text = await BrowserActions.getText(this.filter.$(this.fromErrorMessage));
        await expect(text).toEqual(msg);
    }

    async checkFromErrorMessageIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.filter.$(this.fromErrorMessage));
    }

    async checkFromFieldIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.$(this.fromField));
    }

    async checkFromDateToggleIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.$(this.fromDateToggle));
    }

    async getToDate(): Promise<string> {
        return BrowserActions.getInputValue(this.filter.$(this.toField));
    }

    async putToDate(date): Promise<void> {
        await this.checkToFieldIsDisplayed();
        await BrowserActions.clearSendKeys($(this.toField), date);
        await this.filter.$(this.toField).sendKeys(protractor.Key.ENTER);
    }

    async clickToField(): Promise<void> {
        await BrowserActions.click(this.filter.$(this.toField));
    }

    async checkToErrorMessageIsDisplayed(msg): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.$(this.toErrorMessage));
        const text = await BrowserActions.getText(this.filter.$(this.toErrorMessage));
        await expect(text).toEqual(msg);
    }

    async checkToFieldIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.$(this.toField));
    }

    async checkToDateToggleIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.$(this.toDateToggle));
    }

    async clickApplyButton(): Promise<void> {
        await BrowserActions.click(this.filter.$(this.applyButton));
    }

    async checkApplyButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.$(this.applyButton));
    }

    async checkApplyButtonIsEnabled(): Promise<void> {
        const isEnabled = await this.filter.$(this.applyButton).isEnabled();
        await expect(isEnabled).toBe(true);
    }

    async checkApplyButtonIsDisabled(): Promise<void> {
        const isEnabled = await this.filter.$(this.applyButton).isEnabled();
        await expect(isEnabled).toBe(false);
    }

    async checkClearButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.$(this.clearButton));
    }

}
