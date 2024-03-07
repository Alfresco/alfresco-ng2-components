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

import { element, by, $, $$ } from 'protractor';
import { BrowserVisibility } from '../../utils/browser-visibility';
import { BrowserActions } from '../../utils/browser-actions';
import { materialLocators } from './material-locators';

export class DateTimePickerCalendarPage {

    datePicker = $(`[class*='picker-content']`);
    today = $(`[class*='calendar-body-today']`);
    timePicker = $(materialLocators.DatetimePicker.clock.class);
    hourTime = $$(`${materialLocators.DatetimePicker.clock.hours.class} .${materialLocators.DatetimePicker.clock.cell()}`).first();
    minutesTime = $$(`${materialLocators.DatetimePicker.clock.minutes.class} .${materialLocators.DatetimePicker.clock.cell()}`).first();
    firstEnabledSelector = `.${materialLocators.DatetimePicker.clock.cell()}:not(.${materialLocators.DatetimePicker.clock.cell('disabled')}`;
    hoursPicker = $(materialLocators.DatetimePicker.clock.hours.class);
    minutePicker = $(materialLocators.DatetimePicker.clock.minutes.class);

    async waitTillDateDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.datePicker);
    }

    async setToday(): Promise<void> {
        await BrowserActions.click(this.today);
    }

    async setTime(): Promise<void> {
        await BrowserActions.clickScript(this.hourTime);
        await BrowserActions.clickScript(this.minutesTime);
    }

    async setDate(date?: string): Promise<boolean> {
        try {
            if (date) {
                await BrowserActions.clickScript(element.all(by.cssContainingText(materialLocators.Datepicker.calendar.body.cell.content.class, date)).first());
            } else {
                await this.setToday();
            }
            await this.setTime();
            return true;
        } catch {
            return false;
        }
    }

    async checkCalendarTodayDayIsDisabled(): Promise<void> {
        const locatorString = materialLocators.Calendar.body.cell.content.class;
        await BrowserVisibility.waitUntilElementIsPresent(element(by.cssContainingText(locatorString, await BrowserActions.getText(this.today))));
    }

    async setDefaultEnabledHour(): Promise<void> {
        await BrowserActions.click(this.hoursPicker.$$(this.firstEnabledSelector).first());
    }

    async setDefaultEnabledMinutes() {
        await BrowserActions.click(this.minutePicker.$$(this.firstEnabledSelector).first());
    }
}
