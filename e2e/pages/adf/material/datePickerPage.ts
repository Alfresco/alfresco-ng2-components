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

import { element, by, browser } from 'protractor';
import { DateUtil } from '../../../util/dateUtil';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class DatePickerPage {

    datePicker = element(by.css('mat-calendar'));
    nextMonthButton = element(by.css('button[class*="mat-calendar-next-button"]'));
    previousMonthButton = element(by.css('button[class*="mat-calendar-previous-button"]'));

    getSelectedDate() {
        return element(by.css('td[class*="mat-calendar-body-active"]')).getAttribute('aria-label');
    }

    checkDatesAfterDateAreDisabled(date) {
        const afterDate = DateUtil.formatDate('DD-MM-YY', date, 1);
        const afterCalendar = element(by.css(`td[class*="mat-calendar-body-cell"][aria-label="${afterDate}"]`));
        browser.controlFlow().execute(async () => {
            if (await afterCalendar.isPresent()) {
                await expect(afterCalendar.getAttribute('aria-disabled')).toBe('true');
            }
            await expect(this.nextMonthButton.isEnabled()).toBe(false);
        });
        return this;
    }

    checkDatesBeforeDateAreDisabled(date) {
        const beforeDate = DateUtil.formatDate('DD-MM-YY', date, -1);
        const beforeCalendar = element(by.css(`td[class*="mat-calendar-body-cell"][aria-label="${beforeDate}"]`));
        browser.controlFlow().execute(async () => {
            if (await beforeCalendar.isPresent()) {
                await expect(beforeCalendar.getAttribute('aria-disabled')).toBe('true');
            }
            await expect(this.previousMonthButton.isEnabled()).toBe(false);
        });
        return this;
    }

    selectTodayDate() {
        this.checkDatePickerIsDisplayed();
        const todayDate = element(by.css('.mat-calendar-body-today'));
        BrowserActions.click(todayDate);
        return this;
    }

    closeDatePicker() {
        BrowserActions.closeMenuAndDialogs();
        this.checkDatePickerIsNotDisplayed();
    }

    checkDatePickerIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.datePicker);
        return this;
    }

    checkDatePickerIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.datePicker);
        return this;
    }
}
