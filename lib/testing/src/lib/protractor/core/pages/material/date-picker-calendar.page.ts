/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { BrowserVisibility } from '../../utils/browser-visibility';
import { BrowserActions } from '../../utils/browser-actions';
import { TestElement } from '../../test-element';
import { addDays, format, subDays } from 'date-fns';
import { materialLocators } from './material-locators';

export class DatePickerCalendarPage {
    datePicker = $(`${materialLocators.Calendar.root}[id*="${materialLocators.Datepicker.root}"]`);
    nextMonthButton = $(`button[class*="${materialLocators.Calendar.button('next')}"]`);
    previousMonthButton = $(`button[class*="${materialLocators.Calendar.button('previous')}"]`);
    todayDate = TestElement.byCss(`${materialLocators.Calendar.body.today.class}`);
    periodButton = $(`button[class*=${materialLocators.Calendar.button('period')}]`);

    focusedElement = `span${materialLocators.Calendar.body.cell.content.class}${materialLocators.Calendar.focus}`;

    async getSelectedDate(): Promise<string> {
        return BrowserActions.getAttribute($(`button[class*="${materialLocators.Calendar.body.active.root}"]`), 'aria-label');
    }

    async checkDatesAfterDateAreDisabled(date: Date): Promise<void> {
        const afterDate = format(addDays(date, 1), 'dd-MM-yy');
        const afterCalendar = $(`td[class*="${materialLocators.Calendar.body.cell.root}"][aria-label="${afterDate}"]`);
        if (await afterCalendar.isPresent()) {
            const aria = await BrowserActions.getAttribute(afterCalendar, 'aria-disabled');
            expect(aria).toBe('true');
        }
        const isEnabled = await this.nextMonthButton.isEnabled();
        expect(isEnabled).toBe(false);
    }

    async checkDatesBeforeDateAreDisabled(date: Date): Promise<void> {
        const beforeDate = format(subDays(date, 1), 'dd-MM-yy');
        const beforeCalendar = $(`td[class*="${materialLocators.Calendar.body.cell.root}"][aria-label="${beforeDate}"]`);
        if (await beforeCalendar.isPresent()) {
            const aria = await BrowserActions.getAttribute(beforeCalendar, 'aria-disabled');
            expect(aria).toBe('true');
        }
        const isEnabled = await this.previousMonthButton.isEnabled();
        expect(isEnabled).toBe(false);
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
        const startDayElement = element(by.cssContainingText(this.focusedElement, `${startDay}`));
        const endDayElement = element(by.cssContainingText(this.focusedElement, `${endDay}`));
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
        const yearElement = element(by.cssContainingText(this.focusedElement, `${year}`));
        const monthElement = element(by.cssContainingText(this.focusedElement, `${month}`));
        const dayElement = element(by.cssContainingText(this.focusedElement, `${day}`));

        await BrowserActions.click(this.periodButton);
        await BrowserActions.click(yearElement);
        await BrowserActions.click(monthElement);
        await BrowserActions.click(dayElement);
    }
}
