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

import { element, by, $ } from 'protractor';
import { DateUtil } from '../../utils/date-util';
import { BrowserVisibility } from '../../utils/browser-visibility';
import { BrowserActions } from '../../utils/browser-actions';
import { TestElement } from '../../test-element';

export class DatePickerCalendarPage {

    datePicker = $('mat-calendar[id*="mat-datepicker"]');
    nextMonthButton = $('button[class*="mat-calendar-next-button"]');
    previousMonthButton = $('button[class*="mat-calendar-previous-button"]');
    todayDate = TestElement.byCss('div.mat-calendar-body-today');
    periodButton = $('button[class*=mat-calendar-period-button]');

    async getSelectedDate(): Promise<string> {
        return BrowserActions.getAttribute($('button[class*="mat-calendar-body-active"]'), 'aria-label');
    }

    async checkDatesAfterDateAreDisabled(date): Promise<void> {
        const afterDate = DateUtil.formatDate('DD-MM-YY', date, 1);
        const afterCalendar = $(`td[class*="mat-calendar-body-cell"][aria-label="${afterDate}"]`);
        if (await afterCalendar.isPresent()) {
            const aria = await BrowserActions.getAttribute(afterCalendar, 'aria-disabled');
            await expect(aria).toBe('true');
        }
        const isEnabled = await this.nextMonthButton.isEnabled();
        await expect(isEnabled).toBe(false);
    }

    async checkDatesBeforeDateAreDisabled(date): Promise<void> {
        const beforeDate = DateUtil.formatDate('DD-MM-YY', date, -1);
        const beforeCalendar = $(`td[class*="mat-calendar-body-cell"][aria-label="${beforeDate}"]`);
        if (await beforeCalendar.isPresent()) {
            const aria = await BrowserActions.getAttribute(beforeCalendar, 'aria-disabled');
            await expect(aria).toBe('true');
        }
        const isEnabled = await this.previousMonthButton.isEnabled();
        await expect(isEnabled).toBe(false);
    }

    async selectTodayDate(): Promise<void> {
        await this.todayDate.waitPresent();
        await this.todayDate.click();
        await this.checkDatePickerIsNotDisplayed();
    }

    async closeDatePicker(): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        await this.checkDatePickerIsNotDisplayed();
    }

    async checkDatePickerIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.datePicker);
    }

    async checkDatePickerIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.datePicker);
    }

    async selectDateRange(startDay: number, endDay: number): Promise<void> {
        const startDayElement = element(by.cssContainingText(`div.mat-calendar-body-cell-content.mat-focus-indicator`, `${startDay}`));
        const endDayElement = element(by.cssContainingText(`div.mat-calendar-body-cell-content.mat-focus-indicator`, `${endDay}`));
        await this.checkDatePickerIsDisplayed();
        await BrowserActions.click(startDayElement);
        await BrowserActions.click(endDayElement);
        await this.checkDatePickerIsNotDisplayed();
    }

    async selectExactDate(date: Date): Promise<void> {
        await this.checkDatePickerIsDisplayed();
        await this.setDateUsingPeriodButton(date);
        await this.checkDatePickerIsNotDisplayed();
    }

    async selectExactDateRange(start: Date, end: Date): Promise<void> {
        await this.checkDatePickerIsDisplayed();
        await this.setDateUsingPeriodButton(start);
        await this.setDateUsingPeriodButton(end);
        await this.checkDatePickerIsNotDisplayed();
    }

    private async setDateUsingPeriodButton(date: Date) {
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const year = date.getFullYear();
        const month = months[date.getMonth()];
        const day = date.getDate();
        const yearElement = element(by.cssContainingText(`div.mat-calendar-body-cell-content.mat-focus-indicator`, `${year}`));
        const monthElement = element(by.cssContainingText(`div.mat-calendar-body-cell-content.mat-focus-indicator`, `${month}`));
        const dayElement = element(by.cssContainingText(`div.mat-calendar-body-cell-content.mat-focus-indicator`, `${day}`));

        await BrowserActions.click(this.periodButton);
        await BrowserActions.click(yearElement);
        await BrowserActions.click(monthElement);
        await BrowserActions.click(dayElement);
    }
}
