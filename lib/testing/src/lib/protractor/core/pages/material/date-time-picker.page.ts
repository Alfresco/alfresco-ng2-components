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

import { ElementFinder, $ } from 'protractor';
import { BrowserActions } from '../../utils/browser-actions';
import { DateTimePickerCalendarPage } from './date-time-picker-calendar.page';

export class DateTimePickerPage {

    rootElement: ElementFinder;
    dateTimePicker = $('.mat-datetimepicker-toggle');
    datePicker = $('.mat-datepicker-toggle');
    dateTime = new DateTimePickerCalendarPage();

    constructor(rootElement?: ElementFinder) {
        if (rootElement) {
            this.rootElement = rootElement;
            this.dateTimePicker  = this.rootElement.$('.mat-datetimepicker-toggle');
            this.datePicker  = this.rootElement.$('.mat-datepicker-toggle');
        }
    }

    async setTodayDateTimeValue(): Promise<void> {
        await BrowserActions.click(this.dateTimePicker);
        await this.dateTime.waitTillDateDisplayed();
        await this.dateTime.setToday();
        await this.dateTime.setTime();
    }

    async setTodayDateValue(): Promise<void> {
        await BrowserActions.click(this.dateTimePicker);
        await this.dateTime.waitTillDateDisplayed();
        await this.dateTime.setToday();
    }

    async setDate(date?: string): Promise<boolean> {
        await BrowserActions.click(this.datePicker);
        return this.dateTime.setDate(date);
    }

    async clickDateTimePicker(): Promise<void> {
        await BrowserActions.click(this.datePicker);
    }

    async checkCalendarTodayDayIsDisabled(): Promise<void> {
        await this.dateTime.checkCalendarTodayDayIsDisabled();
    }
}
