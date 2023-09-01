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

/* eslint-disable @angular-eslint/component-selector */

import { Component, OnInit, ViewEncapsulation, OnDestroy, Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WidgetComponent, UserPreferencesService, UserPreferenceValues, FormService, DateFnsUtils } from '@alfresco/adf-core';
import { addDays, format, isValid, subDays } from 'date-fns';
import { DateFnsAdapter, MAT_DATE_FNS_FORMATS } from '@angular/material-date-fns-adapter';
import { DATE_FORMAT_CLOUD } from '../../../../models/date-format-cloud.model';

@Component({
    selector: 'date-widget',
    providers: [
        { provide: DateAdapter, useClass: DateFnsAdapter },
        { provide: MAT_DATE_FORMATS, useValue: MAT_DATE_FNS_FORMATS }],
    templateUrl: './date-cloud.widget.html',
    styleUrls: ['./date-cloud.widget.scss'],
    host: {
        '(click)': 'event($event)',
        '(blur)': 'event($event)',
        '(change)': 'event($event)',
        '(focus)': 'event($event)',
        '(focusin)': 'event($event)',
        '(focusout)': 'event($event)',
        '(input)': 'event($event)',
        '(invalid)': 'event($event)',
        '(select)': 'event($event)'
    },
    encapsulation: ViewEncapsulation.None
})
export class DateCloudWidgetComponent extends WidgetComponent implements OnInit, OnDestroy {
    typeId = 'DateCloudWidgetComponent';

    minDate: string;
    maxDate: string;

    private onDestroy$ = new Subject<boolean>();

    constructor(public formService: FormService,
                private dateAdapter: DateAdapter<DateFnsAdapter>,
                private userPreferencesService: UserPreferencesService,
                @Inject(MAT_DATE_FORMATS) private dateFormatConfig: MatDateFormats) {
        super(formService);
    }

    ngOnInit() {
        this.userPreferencesService
            .select(UserPreferenceValues.Locale)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(locale => this.dateAdapter.setLocale(DateFnsUtils.getLocaleFromString(locale)));

            this.dateFormatConfig.display.dateInput = this.field.dateDisplayFormat;

        if (this.field) {
            if (this.field.dynamicDateRangeSelection) {
                const today = new Date();
                if (Number.isInteger(this.field.minDateRangeValue)) {
                    this.minDate = format(subDays(today, this.field.minDateRangeValue), DATE_FORMAT_CLOUD);
                    this.field.minValue = this.minDate;
                }

                if (Number.isInteger(this.field.maxDateRangeValue)) {
                    this.maxDate = format(addDays(today, this.field.maxDateRangeValue), DATE_FORMAT_CLOUD);
                    this.field.maxValue = this.maxDate;
                }
            } else {
                if (this.field.minValue) {
                    this.minDate = format(new Date(this.field.minValue), DATE_FORMAT_CLOUD);
                }

                if (this.field.maxValue) {
                    this.maxDate = format(new Date(this.field.maxValue), DATE_FORMAT_CLOUD);
                }
            }
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    onDateChanged(newDateValue) {
        const date = new Date(newDateValue);
        if (isValid(date)) {
            this.field.value = format(date, this.field.dateDisplayFormat);
        } else {
            this.field.value = newDateValue;
        }
        this.onFieldChanged(this.field);
    }
}
