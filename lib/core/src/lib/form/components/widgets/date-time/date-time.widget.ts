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
import { DatetimeAdapter, MAT_DATETIME_FORMATS } from '@mat-datetimepicker/core';
import { MomentDatetimeAdapter, MAT_MOMENT_DATETIME_FORMATS } from '@mat-datetimepicker/moment';
import { UserPreferencesService, UserPreferenceValues } from '../../../../common/services/user-preferences.service';
import { MomentDateAdapter } from '../../../../common/utils/moment-date-adapter';
import { MOMENT_DATE_FORMATS } from '../../../../common/utils/moment-date-formats.model';
import { FormService } from '../../../services/form.service';
import { WidgetComponent } from '../widget.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import { format, isValid, parse } from 'date-fns';

@Component({
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS },
        { provide: DatetimeAdapter, useClass: MomentDatetimeAdapter },
        { provide: MAT_DATETIME_FORMATS, useValue: MAT_MOMENT_DATETIME_FORMATS }
    ],
    selector: 'date-time-widget',
    templateUrl: './date-time.widget.html',
    styleUrls: ['./date-time.widget.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DateTimeWidgetComponent extends WidgetComponent implements OnInit, OnDestroy {

    DATE_TIME_FORMAT = 'd-M-yyyy hh:mm a';

    minDate: Date;
    maxDate: Date;

    private onDestroy$ = new Subject<boolean>();

    constructor(public formService: FormService,
                private dateAdapter: DateAdapter<DateFnsAdapter>,
                private userPreferencesService: UserPreferencesService) {
        super(formService);
    }

    ngOnInit() {
        this.userPreferencesService
            .select(UserPreferenceValues.Locale)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(locale => this.dateAdapter.setLocale(locale));

        if (this.field) {
            if (this.field.minValue) {
                this.minDate = parse(this.field.minValue, this.DATE_TIME_FORMAT, new Date());
            }

            if (this.field.maxValue) {
                this.maxDate = parse(this.field.maxValue, this.DATE_TIME_FORMAT, new Date());
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
            this.field.value = format(date, this.DATE_TIME_FORMAT);
        } else {
            this.field.value = newDateValue;
        }
        this.onFieldChanged(this.field);
    }
}
