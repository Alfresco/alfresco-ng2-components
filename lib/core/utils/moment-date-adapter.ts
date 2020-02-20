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

import { DateAdapter } from '@angular/material';
import { isMoment, Moment } from 'moment';
import moment from 'moment-es6';

export class MomentDateAdapter extends DateAdapter<Moment> {

    private localeData: any = moment.localeData();

    overrideDisplayFormat: string;

    getYear(date: Moment): number {
        return date.year();
    }

    getMonth(date: Moment): number {
        return date.month();
    }

    getDate(date: Moment): number {
        return date.date();
    }

    getDayOfWeek(date: Moment): number {
        return date.day();
    }

    getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
        switch (style) {
            case 'long':
                return this.localeData.months();
            case 'short':
                return this.localeData.monthsShort();
            case 'narrow':
                return this.localeData.monthsShort().map((month) => month[0]);
            default :
                return [];
        }
    }

    getDateNames(): string[] {
        const dateNames: string[] = [];
        for (let date = 1; date <= 31; date++) {
            dateNames.push(String(date));
        }

        return dateNames;
    }

    getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
        switch (style) {
            case 'long':
                return this.localeData.weekdays();
            case 'short':
                return this.localeData.weekdaysShort();
            case 'narrow':
                return this.localeData.weekdaysShort();
            default :
                return [];
        }
    }

    getYearName(date: Moment): string {
        return String(date.year());
    }

    getFirstDayOfWeek(): number {
        return this.localeData.firstDayOfWeek();
    }

    getNumDaysInMonth(date: Moment): number {
        return date.daysInMonth();
    }

    clone(date: Moment): Moment {
        const locale = this.locale || 'en';
        return date.clone().locale(locale);
    }

    createDate(year: number, month: number, date: number): Moment {
        return moment([year, month, date]);
    }

    today(): Moment {
        const locale = this.locale || 'en';
        return moment().locale(locale);
    }

    parse(value: any, parseFormat: any): Moment {
        const locale = this.locale || 'en';

        if (value && typeof value === 'string') {
            let m = moment(value, parseFormat, locale, true);
            if (!m.isValid()) {
                // use strict parsing because Moment's parser is very forgiving, and this can lead to undesired behavior.
                m = moment(value, this.overrideDisplayFormat, locale, true);
            }
            if (m.isValid()) {
                // if user omits year, it defaults to 2001, so check for that issue.
                if (m.year() === 2001 && value.indexOf('2001') === -1) {
                    // if 2001 not actually in the value string, change to current year
                    const currentYear = new Date().getFullYear();
                    m.set('year', currentYear);
                    // if date is in the future, set previous year
                    if (m.isAfter(moment())) {
                        m.set('year', currentYear - 1);
                    }
                }
            }
            return m;
        }

        return value ? moment(value).locale(locale) : null;
    }

    format(date: Moment, displayFormat: any): string {
        date = this.clone(date);
        displayFormat = this.overrideDisplayFormat ? this.overrideDisplayFormat : displayFormat;

        if (date && date.format) {
            return date.format(displayFormat);
        } else {
            return '';
        }
    }

    addCalendarYears(date: Moment, years: number): Moment {
        return date.clone().add(years, 'y');
    }

    addCalendarMonths(date: Moment, months: number): Moment {
        return date.clone().add(months, 'M');
    }

    addCalendarDays(date: Moment, days: number): Moment {
        return date.clone().add(days, 'd');
    }

    getISODateString(date: Moment): string {
        return date.toISOString();
    }

    setLocale(locale: any): void {
        super.setLocale(locale);

        this.localeData = moment.localeData(locale);
    }

    compareDate(first: Moment, second: Moment): number {
        return first.diff(second, 'seconds', true);
    }

    sameDate(first: any | Moment, second: any | Moment): boolean {
        if (first == null) {
            // same if both null
            return second == null;
        } else if (isMoment(first)) {
            return first.isSame(second);
        } else {
            const isSame = super.sameDate(first, second);
            return isSame;
        }
    }

    clampDate(date: Moment, min?: any | Moment, max?: any | Moment): Moment {
        if (min && date.isBefore(min)) {
            return min;
        } else if (max && date.isAfter(max)) {
            return max;
        } else {
            return date;
        }
    }

    isDateInstance(date: any) {
        let isValidDateInstance = false;

        if (date) {
            isValidDateInstance = date._isAMomentObject;
        }

        return isValidDateInstance;
    }

    isValid(date: Moment): boolean {
        return date.isValid();
    }

    toIso8601(date: Moment): string {
        return this.clone(date).format();
    }

    fromIso8601(iso8601String: string): Moment | null {
        const locale = this.locale || 'en';
        const d = moment(iso8601String, moment.ISO_8601).locale(locale);
        return this.isValid(d) ? d : null;
    }

    invalid(): Moment {
        return moment.invalid();
    }
}
