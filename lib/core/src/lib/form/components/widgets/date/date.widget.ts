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
import { Component, OnInit, ViewEncapsulation, OnDestroy, Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { FormService } from '../../../services/form.service';
import { WidgetComponent } from '../widget.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DateFnsAdapter, MAT_DATE_FNS_FORMATS } from '@angular/material-date-fns-adapter';
import { DateFnsUtils } from '../../../../common';
import { isValid } from 'date-fns';
import { FormFieldModel } from '../core';
import { TranslationService } from '../../../../../../../core/src/lib/translation';

@Component({
    selector: 'date-widget',
    providers: [
        { provide: DateAdapter, useClass: DateFnsAdapter },
        { provide: MAT_DATE_FORMATS, useValue: MAT_DATE_FNS_FORMATS }
    ],
    templateUrl: './date.widget.html',
    styleUrls: ['./date.widget.scss'],
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

    minDate: string;
    maxDate: string;

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
            this.minDate = isValid(this.field.minValue) ? DateFnsUtils.formatDate(new Date(this.field.minValue), this.DATE_FORMAT) : this.field.minValue;
            this.maxDate = isValid(this.field.maxValue) ? DateFnsUtils.formatDate(new Date(this.field.maxValue), this.DATE_FORMAT) : this.field.maxValue;
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    formatLabel(field: FormFieldModel): string {
        const displayName = this.translationService.instant(field.name);
        const displayFormat = DateFnsUtils.convertDateFnsToMomentFormat(field.dateDisplayFormat);

        return `${displayName} (${displayFormat})`;
    }

    onDateChanged(newDateValue) {
        const date = DateFnsUtils.parseDate(newDateValue, this.field.dateDisplayFormat);
        if (isValid(date)) {
            this.field.value = DateFnsUtils.formatDate(date, this.field.dateDisplayFormat);
        } else {
            this.field.value = newDateValue;
        }
        this.onFieldChanged(this.field);
    }
}
