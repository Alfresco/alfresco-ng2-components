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

import { by, element } from 'protractor';
import { DateUtil } from '../../utils/date-util';
import { BrowserVisibility } from '../../utils/browser-visibility';
import { BrowserActions } from '../../utils/browser-actions';

export class DatePickerCalendarPage {

    datePicker = element(by.css('mat-calendar'));
    nextMonthButton = element(by.css('button[class*="mat-calendar-next-button"]'));
    previousMonthButton = element(by.css('button[class*="mat-calendar-previous-button"]'));
    todayDate = element(by.css('.mat-calendar-body-today'));

    async getSelectedDate(): Promise<string> {
        return element(by.css('td[class*="mat-calendar-body-active"]')).getAttribute('aria-label');
    }

    async checkDatesAfterDateAreDisabled(date): Promise<void> {
        const afterDate = DateUtil.formatDate('DD-MM-YY', date, 1);
        const afterCalendar = element(by.css(`td[class*="mat-calendar-body-cell"][aria-label="${afterDate}"]`));
        if (await afterCalendar.isPresent()) {
            const aria = await afterCalendar.getAttribute('aria-disabled');
            await expect(aria).toBe('true');
        }
        const isEnabled = await this.nextMonthButton.isEnabled();
        await expect(isEnabled).toBe(false);
    }

    async checkDatesBeforeDateAreDisabled(date): Promise<void> {
        const beforeDate = DateUtil.formatDate('DD-MM-YY', date, -1);
        const beforeCalendar = element(by.css(`td[class*="mat-calendar-body-cell"][aria-label="${beforeDate}"]`));
        if (await beforeCalendar.isPresent()) {
            const aria = await beforeCalendar.getAttribute('aria-disabled');
            await expect(aria).toBe('true');
        }
        const isEnabled = await this.previousMonthButton.isEnabled();
        await expect(isEnabled).toBe(false);
    }

    async selectTodayDate(): Promise<void> {
        await this.checkDatePickerIsDisplayed();
        await BrowserActions.click(this.todayDate);
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
}
