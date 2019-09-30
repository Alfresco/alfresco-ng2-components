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

import { by, protractor, ElementFinder, Locator, element } from 'protractor';
import { DatePickerPage } from '../../../material/pages/date-picker.page';
import { BrowserVisibility } from '../../../core/utils/browser-visibility';
import { BrowserActions } from '../../../core/utils/browser-actions';

export class DateRangeFilterPage {

    fromField: Locator = by.css('input[data-automation-id="date-range-from-input"]');
    fromDateToggle: Locator = by.css('mat-datepicker-toggle[data-automation-id="date-range-from-date-toggle"]');
    toField: Locator = by.css('input[data-automation-id="date-range-to-input"]');
    toDateToggle: Locator = by.css('mat-datepicker-toggle[data-automation-id="date-range-to-date-toggle"]');
    applyButton: Locator = by.css('button[data-automation-id="date-range-apply-btn"]');
    clearButton: Locator = by.css('button[data-automation-id="date-range-clear-btn"]');
    fromErrorMessage: Locator = by.css('mat-error[data-automation-id="date-range-from-error"]');
    toErrorMessage: Locator = by.css('mat-error[data-automation-id="date-range-to-error"]');
    filter: ElementFinder;

    constructor(filter: ElementFinder) {
        this.filter = filter;
    }

    async getFromDate(): Promise<string> {
        return await this.filter.element(this.fromField).getAttribute('value');
    }

    async putFromDate(date): Promise<void> {
        await this.checkFromFieldIsDisplayed();
        await BrowserActions.clearSendKeys(this.filter.element(this.fromField), date);
        await this.filter.element(this.fromField).sendKeys(protractor.Key.ENTER);
    }

    async getFromCalendarSelectedDate(): Promise<string> {
        const datePicker = await this.openFromDatePicker();
        const selectedDate = await datePicker.getSelectedDate();
        await datePicker.closeDatePicker();
        return selectedDate;
    }

    async openFromDatePicker(): Promise<DatePickerPage> {
        await BrowserActions.click(this.filter.element(this.fromDateToggle));

        const datePicker = new DatePickerPage();
        await datePicker.checkDatePickerIsDisplayed();
        return datePicker;
    }

    async openToDatePicker(): Promise<DatePickerPage> {
        await BrowserActions.click(this.filter.element(this.toDateToggle));
        const datePicker = new DatePickerPage();
        await datePicker.checkDatePickerIsDisplayed();
        return datePicker;
    }

    async clickFromField(): Promise<void> {
        await BrowserActions.click(this.filter.element(this.fromField));
    }

    async checkFromErrorMessageIsDisplayed(msg: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.fromErrorMessage));
        const text = await BrowserActions.getText(this.filter.element(this.fromErrorMessage));
        await expect(text).toEqual(msg);
    }

    async checkFromErrorMessageIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.filter.element(this.fromErrorMessage));
    }

    async checkFromFieldIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.fromField));
    }

    async checkFromDateToggleIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.fromDateToggle));
    }

    async getToDate(): Promise<string> {
        return await this.filter.element(this.toField).getAttribute('value');
    }

    async putToDate(date): Promise<void> {
        await this.checkToFieldIsDisplayed();
        await BrowserActions.clearSendKeys(element(this.toField), date);
        await this.filter.element(this.toField).sendKeys(protractor.Key.ENTER);
    }

    async clickToField(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsClickable(this.filter.element(this.toField));
        await BrowserActions.click(this.filter.element(this.toField));
    }

    async checkToErrorMessageIsDisplayed(msg): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.toErrorMessage));
        const text = await BrowserActions.getText(this.filter.element(this.toErrorMessage));
        await expect(text).toEqual(msg);
    }

    async checkToFieldIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.toField));
    }

    async checkToDateToggleIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.toDateToggle));
    }

    async clickApplyButton(): Promise<void> {
        await BrowserActions.click(this.filter.element(this.applyButton));
    }

    async checkApplyButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.applyButton));
    }

    async checkApplyButtonIsEnabled(): Promise<void> {
        const isEnabled = await this.filter.element(this.applyButton).isEnabled();
        await expect(isEnabled).toBe(true);
    }

    async checkApplyButtonIsDisabled(): Promise<void> {
        const isEnabled = await this.filter.element(this.applyButton).isEnabled();
        await expect(isEnabled).toBe(false);
    }

    async checkClearButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.clearButton));
    }
}
