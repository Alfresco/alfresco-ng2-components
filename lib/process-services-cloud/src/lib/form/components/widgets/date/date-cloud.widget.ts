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

import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import moment, { Moment } from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
    MOMENT_DATE_FORMATS, MomentDateAdapter, WidgetComponent,
    UserPreferencesService, UserPreferenceValues, FormService
} from '@alfresco/adf-core';
import { DATE_FORMAT_CLOUD } from '../../../../models/date-format-cloud.model';

@Component({
    selector: 'date-widget',
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS }],
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

    minDate: Moment;
    maxDate: Moment;

    private onDestroy$ = new Subject<boolean>();

    constructor(public formService: FormService,
                private dateAdapter: DateAdapter<Moment>,
                private userPreferencesService: UserPreferencesService) {
        super(formService);
    }

    ngOnInit() {
        this.userPreferencesService
            .select(UserPreferenceValues.Locale)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(locale => this.dateAdapter.setLocale(locale));

        const momentDateAdapter = this.dateAdapter as MomentDateAdapter;
        momentDateAdapter.overrideDisplayFormat = this.field.dateDisplayFormat;

        if (this.field) {
            if (this.field.dynamicDateRangeSelection) {
                const today = this.getTodaysFormattedDate();
                if (Number.isInteger(this.field.minDateRangeValue)) {
                    this.minDate = moment(today).subtract(this.field.minDateRangeValue, 'days');
                    this.field.minValue = this.minDate.format(DATE_FORMAT_CLOUD);
                }
                if (Number.isInteger(this.field.maxDateRangeValue)) {
                    this.maxDate = moment(today).add(this.field.maxDateRangeValue, 'days');
                    this.field.maxValue = this.maxDate.format(DATE_FORMAT_CLOUD);
                }
            } else {
                if (this.field.minValue) {
                    this.minDate = moment(this.field.minValue, DATE_FORMAT_CLOUD);
                }

                if (this.field.maxValue) {
                    this.maxDate = moment(this.field.maxValue, DATE_FORMAT_CLOUD);
                }
            }
        }
    }

    getTodaysFormattedDate() {
        return moment().format(DATE_FORMAT_CLOUD);
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    onDateChanged(newDateValue) {
        const date = moment(newDateValue, this.field.dateDisplayFormat, true);
        if (date.isValid()) {
            this.field.value = date.format(this.field.dateDisplayFormat);
        } else {
            this.field.value = newDateValue;
        }
        this.onFieldChanged(this.field);
    }
}
