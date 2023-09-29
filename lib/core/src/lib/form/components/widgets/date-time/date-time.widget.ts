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
import { UserPreferencesService, UserPreferenceValues } from '../../../../common/services/user-preferences.service';
import { FormService } from '../../../services/form.service';
import { WidgetComponent } from '../widget.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DateFnsUtils } from '../../../../common';
import { TranslationService } from '../../../../../../../core/src/lib/translation/translation.service';
import { FormFieldModel } from '../core';
import { isValid } from 'date-fns';
import { DateFnsAdapter } from '@angular/material-date-fns-adapter';

@Component({
    providers: [
        { provide: DateAdapter, useClass: DateFnsAdapter }
    ],
    selector: 'date-time-widget',
    templateUrl: './date-time.widget.html',
    styleUrls: ['./date-time.widget.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DateTimeWidgetComponent extends WidgetComponent implements OnInit, OnDestroy {
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
            .subscribe((locale) => this.dateAdapter.setLocale(DateFnsUtils.getLocaleFromString(locale)));

        this.dateFormatConfig.display.dateInput = this.field.dateDisplayFormat;

        if (this.field) {
            if (this.field.minValue) {
                this.field.minValue = DateFnsUtils.addSeconds(this.field.minValue);

                const minDate = new Date(this.field.minValue);
                if (isValid(minDate)) {
                    this.minDate = DateFnsUtils.formatDate(minDate, 'YYYY-MM-DDTHH:mm:ssZ');
                }
            }

            if (this.field.maxValue) {
                this.field.maxValue = DateFnsUtils.addSeconds(this.field.maxValue);

                const maxDate = new Date(this.field.maxValue);
                if (isValid(maxDate)) {
                    this.maxDate = DateFnsUtils.formatDate(maxDate, 'YYYY-MM-DDTHH:mm:ssZ');
                }
            }
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
        const date = new Date(newDateValue);
        if (isValid(date)) {
            this.field.value = DateFnsUtils.formatDate(date, this.field.dateDisplayFormat);
        } else {
            this.field.value = newDateValue;
        }
        this.onFieldChanged(this.field);
    }
}
