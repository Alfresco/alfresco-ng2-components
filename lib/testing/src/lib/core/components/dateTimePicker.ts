/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import {
    ElementFinder,
    by,
    browser,
    ExpectedConditions as EC
} from 'protractor';
import { Component } from './component';
import * as moment from 'moment';

export class DateTimePicker extends Component {
    static selectors = {
        root: '.mat-datetimepicker-popup',

        header: '.mat-datetimepicker-calendar-header',
        year: '.mat-datetimepicker-calendar-header-year',
        date: '.mat-datetimepicker-calendar-header-date',

        content: '.mat-datetimepicker-calendar-content',
        dayPicker: 'mat-datetimepicker-month-view',

        today: '.mat-datetimepicker-calendar-body-today',
        firstActiveDay:
            '.mat-datetimepicker-calendar-body-active .mat-datetimepicker-calendar-body-cell-content'
    };

    calendar: ElementFinder = browser.element(
        by.css(DateTimePicker.selectors.root)
    );
    headerDate: ElementFinder = this.component.element(
        by.css(DateTimePicker.selectors.date)
    );
    headerYear: ElementFinder = this.component.element(
        by.css(DateTimePicker.selectors.year)
    );
    dayPicker: ElementFinder = this.component.element(
        by.css(DateTimePicker.selectors.dayPicker)
    );

    constructor(ancestor?: ElementFinder) {
        super(DateTimePicker.selectors.root, ancestor);
    }

    async waitForDateTimePickerToOpen() {
        await browser.wait(EC.presenceOf(this.calendar), this.waitTimeout);
    }

    async waitForDateTimePickerToClose() {
        await browser.wait(EC.stalenessOf(this.calendar), this.waitTimeout);
    }

    async isCalendarOpen() {
        return await browser.isElementPresent(
            by.css(DateTimePicker.selectors.root)
        );
    }

    async getDate() {
        return await this.headerDate.getText();
    }

    async getYear() {
        return await this.headerYear.getText();
    }

    async setDefaultDay() {
        const today = moment();
        const tomorrow = today.add(1, 'day');
        const dayOfTomorrow = tomorrow.date();
        const date = await this.getDate();
        const year = await this.getYear();
        const elem = this.dayPicker.element(
            by.cssContainingText(
                DateTimePicker.selectors.firstActiveDay,
                `${dayOfTomorrow}`
            )
        );
        await elem.click();
        return `${date} ${year}`;
    }
}
