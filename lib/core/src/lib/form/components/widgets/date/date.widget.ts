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

import { UserPreferencesService, UserPreferenceValues } from '../../../../common/services/user-preferences.service';
import { MomentDateAdapter } from '../../../../common/utils/moment-date-adapter';
import { MOMENT_DATE_FORMATS } from '../../../../common/utils/moment-date-formats.model';
import { Component, OnInit, ViewEncapsulation, OnDestroy, Input } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import moment, { Moment } from 'moment';
import { FormService } from '../../../services/form.service';
import { WidgetComponent } from '../widget.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
    selector: 'date-widget',
    providers: [
        { provide: DateAdapter, useClass: DateFnsAdapter },
        { provide: MAT_DATE_FORMATS, useValue: MAT_DATE_FNS_FORMATS }
    ],
    templateUrl: './date.widget.html',
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
export class DateWidgetComponent extends WidgetComponent implements OnInit, OnDestroy {

    DATE_FORMAT = 'DD-MM-YYYY';

    minDate: Moment;
    maxDate: Moment;
    startAt: Moment;

    @Input()
    value: any = null;

    private onDestroy$ = new Subject<boolean>();

    constructor(public formService: FormService,
                private dateAdapter: DateAdapter<DateFnsAdapter>,
                private userPreferencesService: UserPreferencesService,
                @Inject(MAT_DATE_FORMATS) private dateFormatConfig: MatDateFormats,
                private translationService: TranslationService) {
        super(formService);
    }

    ngOnInit() {
        this.userPreferencesService
            .select(UserPreferenceValues.Locale)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(locale => this.dateAdapter.setLocale(DateFnsUtils.getLocaleFromString(locale)));

        this.dateFormatConfig.display.dateInput = this.field.dateDisplayFormat;

        if (this.field) {
            if (this.field.minValue) {
                this.minDate = moment(this.field.minValue, this.DATE_FORMAT);
            }

            if (this.field.maxValue) {
                this.maxDate = moment(this.field.maxValue, this.DATE_FORMAT);
            }

            this.startAt = moment(this.field.value, this.field.dateDisplayFormat);
            this.value = moment(this.field.value, this.field.dateDisplayFormat);
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    onDateChange(event: MatDatepickerInputEvent<Moment>) {
        const value = event.value;
        const input = event.targetElement as HTMLInputElement;

        const date = moment(value, this.field.dateDisplayFormat, true);
        if (date.isValid()) {
            this.field.value = date.format(this.field.dateDisplayFormat);
        } else {
            this.field.value = input.value;
        }
        this.onFieldChanged(this.field);
    }
}
