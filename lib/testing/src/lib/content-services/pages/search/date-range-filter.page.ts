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

import { by, browser, protractor, ElementFinder, Locator } from 'protractor';
import { DatePickerPage } from '../../../material/pages/date-picker.page';
import { BrowserVisibility } from '../../../core/utils/browser-visibility';
import { BrowserActions } from '../../../core/utils/browser-actions';
import { promise as wdpromise } from 'selenium-webdriver';

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

    getFromDate(): wdpromise.Promise<string> {
        return this.filter.element(this.fromField).getAttribute('value');
    }

    async putFromDate(date): Promise<void> {
        await this.checkFromFieldIsDisplayed();
        await BrowserActions.clearSendKeys(this.filter.element(this.fromField), date);
        this.filter.element(this.fromField).sendKeys(protractor.Key.ENTER);
    }

    async getFromCalendarSelectedDate(): Promise<string> {
        const datePicker = await this.openFromDatePicker();
        const selectedDate = await datePicker.getSelectedDate();
        await datePicker.closeDatePicker();
        return selectedDate;
    }

    async openFromDatePicker(): Promise<DatePickerPage> {
        await BrowserVisibility.waitUntilElementIsClickable(this.filter.element(this.fromDateToggle));
        this.filter.element(this.fromDateToggle).click();
        const datePicker = new DatePickerPage();
        await datePicker.checkDatePickerIsDisplayed();
        return datePicker;
    }

    async openToDatePicker(): Promise<DatePickerPage> {
        await BrowserVisibility.waitUntilElementIsClickable(this.filter.element(this.toDateToggle));
        this.filter.element(this.toDateToggle).click();
        const datePicker = new DatePickerPage();
        await datePicker.checkDatePickerIsDisplayed();
        return datePicker;
    }

    async clickFromField(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsClickable(this.filter.element(this.fromField));
        this.filter.element(this.fromField).click();
    }

    async checkFromErrorMessageIsDisplayed(msg: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.fromErrorMessage));
        browser.controlFlow().execute(async () => {
            const text = await BrowserActions.getText(this.filter.element(this.fromErrorMessage));
            await expect(text).toEqual(msg);
        });
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

    getToDate(): wdpromise.Promise<string> {
        return this.filter.element(this.toField).getAttribute('value');
    }

    async putToDate(date): Promise<void> {
        await this.checkToFieldIsDisplayed();
        this.filter.element(this.toField).clear();
        this.filter.element(this.toField).sendKeys(date);
        this.filter.element(this.toField).sendKeys(protractor.Key.ENTER);
    }

    async clickToField(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsClickable(this.filter.element(this.toField));
        this.filter.element(this.toField).click();
    }

    async checkToErrorMessageIsDisplayed(msg): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.toErrorMessage));
        browser.controlFlow().execute(async () => {
            const text = await BrowserActions.getText(this.filter.element(this.toErrorMessage));
            await expect(text).toEqual(msg);
        });
    }

    async checkToFieldIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.toField));
    }

    async checkToDateToggleIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.toDateToggle));
    }

    async clickApplyButton(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsClickable(this.filter.element(this.applyButton));
        this.filter.element(this.applyButton).click();
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
