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

import { $, ElementFinder } from 'protractor';
import { BrowserActions } from '../../utils/browser-actions';
import { DatePickerCalendarPage } from './date-picker-calendar.page';

export class DatePickerPage {

    datePicker: ElementFinder;
    dateTime = new DatePickerCalendarPage();

    constructor(datePickerElement?: ElementFinder) {
        const locator = $('.mat-datepicker-toggle');
        this.datePicker = datePickerElement ? datePickerElement : locator;
    }

    async clickDatePicker() {
        await BrowserActions.click(this.datePicker);
    }

    async setTodayDateValue(): Promise<void> {
        await this.dateTime.selectTodayDate();
    }

    async setDateRange(start: Date, end: Date): Promise<void> {
        await this.clickDatePicker();
        await this.dateTime.selectExactDateRange(start, end);
    }
}
