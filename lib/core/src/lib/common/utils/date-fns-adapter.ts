/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import { DateFnsUtils } from './date-fns-utils';
import { Inject, Injectable, Optional } from '@angular/core';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import { UserPreferenceValues, UserPreferencesService } from '../services/user-preferences.service';
import { isValid, Locale, parse } from 'date-fns';

/**
 * Date-fns adapter with moment-to-date-fns conversion.
 *
 * Automatically switches locales based on user preferences.
 * Supports custom display format.
 *
 * @example
 *
 * Add the following to the component `providers` section
 *
 * providers: [
 *  { provide: MAT_DATE_FORMATS, useValue: ADF_FORM_DATE_FORMATS },
 *  { provide: DateAdapter, useClass: AdfDateFnsAdapter }
 * ]
 *
 * Setting custom format
 *
 * constructor(private dateAdapter: DateAdapter<Date>) {}
 *
 * ngOnInit() {
 *   const adapter = this.dateAdapter as AdfDateFnsAdapter;
     adapter.displayFormat = '<custom date-fns format>';
 * }
 */

export const DEFAULT_DATE_FORMAT = 'dd-MM-yyyy';

/**
 * Material date formats for Date-fns
 */
export const ADF_DATE_FORMATS: MatDateFormats = {
    parse: {
        dateInput: DEFAULT_DATE_FORMAT
    },
    display: {
        dateInput: DEFAULT_DATE_FORMAT,
        monthLabel: 'LLL',
        monthYearLabel: 'LLL uuuu',
        dateA11yLabel: 'PP',
        monthYearA11yLabel: 'LLLL uuuu'
    }
};

@Injectable({ providedIn: 'root' })
export class AdfDateFnsAdapter extends DateFnsAdapter {
    private _displayFormat?: string = null;

    get displayFormat(): string | null {
        return this._displayFormat;
    }

    set displayFormat(value: string | null) {
        this._displayFormat = value ? DateFnsUtils.convertMomentToDateFnsFormat(value) : null;
    }

    constructor(
        @Optional() @Inject(MAT_DATE_LOCALE) matDateLocale: Locale,
        @Optional() @Inject(MAT_DATE_FORMATS) private formats: MatDateFormats,
        preferences: UserPreferencesService
    ) {
        super(matDateLocale);

        preferences.select(UserPreferenceValues.Locale).subscribe((locale: string) => {
            this.setLocale(DateFnsUtils.getLocaleFromString(locale));
        });
    }

    override parse(value: any, parseFormat: string | string[]): Date {
        const dateValue = this.isValid(value) ? value : this.parseAndValidateDate(value);
        const format = Array.isArray(parseFormat)
            ? parseFormat.map(DateFnsUtils.convertMomentToDateFnsFormat)
            : DateFnsUtils.convertMomentToDateFnsFormat(parseFormat);
        return super.parse(dateValue, format);
    }

    override format(date: Date, displayFormat: string): string {
        displayFormat = DateFnsUtils.convertMomentToDateFnsFormat(displayFormat);

        if (this.displayFormat && displayFormat === this.formats?.display?.dateInput) {
            return super.format(date, this.displayFormat || displayFormat);
        }

        return super.format(date, displayFormat);
    }

    private parseAndValidateDate(value: any): Date {
        const parsedDate = parse(value, this.displayFormat || DEFAULT_DATE_FORMAT, new Date());
        return isValid(parsedDate) ? parsedDate : value;
    }
}
