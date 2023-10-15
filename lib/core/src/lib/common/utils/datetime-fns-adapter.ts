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

import { Inject, Injectable, Optional } from '@angular/core';
import { DateFnsUtils } from './date-fns-utils';
import { DatetimeAdapter, MAT_DATETIME_FORMATS, MatDatetimeFormats } from '@mat-datetimepicker/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Locale, addHours, addMinutes } from 'date-fns';

/**
 * Material date/time formats for Date-fns (mat-datetimepicker)
 */
export const ADF_DATETIME_FORMATS: MatDatetimeFormats = {
    parse: {
        dateInput: 'P', // L
        monthInput: 'LLLL', // MMMM
        timeInput: 'p', // LT
        datetimeInput: 'Pp' // L LT
    },
    display: {
        dateInput: 'P', // L
        monthInput: 'LLLL', // MMMM
        datetimeInput: 'Pp', // L LT
        timeInput: 'p', // LT
        monthYearLabel: 'LLL uuuu', // MMM YYYY
        dateA11yLabel: 'PP', // LL
        monthYearA11yLabel: 'LLLL uuuu', // MMMM YYYY
        popupHeaderDateLabel: 'ccc, dd MMM' // ddd, DD MMM
    }
};

/** The default hour names to use if Intl API is not available. */
const DEFAULT_HOUR_NAMES = range(24, (i) => String(i));

/** The default minute names to use if Intl API is not available. */
const DEFAULT_MINUTE_NAMES = range(60, (i) => String(i));

// eslint-disable-next-line jsdoc/require-jsdoc
function range<T>(length: number, valueFunction: (index: number) => T): T[] {
    const valuesArray = Array(length);
    for (let i = 0; i < length; i++) {
        valuesArray[i] = valueFunction(i);
    }
    return valuesArray;
}

@Injectable()
export class AdfDateTimeFnsAdapter extends DatetimeAdapter<Date> {
    private _displayFormat?: string = null;

    get displayFormat(): string | null {
        return this._displayFormat;
    }

    set displayFormat(value: string | null) {
        this._displayFormat = value ? DateFnsUtils.convertMomentToDateFnsFormat(value) : null;
    }

    constructor(
        @Optional() @Inject(MAT_DATE_LOCALE) matDateLocale: Locale,
        @Optional() @Inject(MAT_DATETIME_FORMATS) private formats: MatDatetimeFormats,
        dateAdapter: DateAdapter<Date, Locale>
    ) {
        super(dateAdapter);
        this.setLocale(matDateLocale);
    }

    getHour(date: Date): number {
        return date.getHours();
    }

    getMinute(date: Date): number {
        return date.getMinutes();
    }

    getFirstDateOfMonth(date: Date): Date {
        const result = new Date();
        result.setFullYear(date.getFullYear(), date.getMonth(), 1);
        return result;
    }

    isInNextMonth(startDate: Date, endDate: Date): boolean {
        const nextMonth = this.getDateInNextMonth(startDate);
        return this.sameMonthAndYear(nextMonth, endDate);
    }

    getHourNames(): string[] {
        return DEFAULT_HOUR_NAMES;
    }

    getMinuteNames(): string[] {
        return DEFAULT_MINUTE_NAMES;
    }

    addCalendarHours(date: Date, hours: number): Date {
        return addHours(date, hours);
    }

    addCalendarMinutes(date: Date, minutes: number): Date {
        return addMinutes(date, minutes);
    }

    createDatetime(year: number, month: number, date: number, hour: number, minute: number): Date {
        const result = new Date();
        result.setFullYear(year, month, date);
        result.setHours(hour, minute, 0, 0);
        return result;
    }

    private getDateInNextMonth(date: Date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 1, date.getHours(), date.getMinutes());
    }

    override parse(value: any, parseFormat: any): Date {
        return this._delegate.parse(value, parseFormat);
    }

    override format(date: Date, displayFormat: any): string {
        displayFormat = DateFnsUtils.convertMomentToDateFnsFormat(displayFormat);

        if (this.displayFormat && displayFormat === this.formats?.display?.datetimeInput) {
            return this._delegate.format(date, this.displayFormat || displayFormat);
        }

        return this._delegate.format(date, displayFormat);
    }
}
