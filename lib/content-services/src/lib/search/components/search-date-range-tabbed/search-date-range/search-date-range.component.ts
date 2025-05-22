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

import { Component, DestroyRef, EventEmitter, inject, Inject, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { endOfDay, isAfter, isBefore, isValid, parse } from 'date-fns';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import { DateFnsAdapter, MAT_DATE_FNS_FORMATS } from '@angular/material-date-fns-adapter';
import { InLastDateType } from './in-last-date-type';
import { DateRangeType } from './date-range-type';
import { SearchDateRange } from './search-date-range';
import { FormBuilder, ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { DateFnsUtils, UserPreferencesService, UserPreferenceValues } from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const DEFAULT_DATE_DISPLAY_FORMAT = 'dd-MMM-yy';

@Component({
    selector: 'adf-search-date-range',
    imports: [
        CommonModule,
        MatRadioModule,
        ReactiveFormsModule,
        TranslateModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule
    ],
    templateUrl: './search-date-range.component.html',
    styleUrls: ['./search-date-range.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: DateFnsAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MAT_DATE_FNS_FORMATS }
    ],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-date-range' }
})
export class SearchDateRangeComponent implements OnInit {
    @Input()
    dateFormat = DEFAULT_DATE_DISPLAY_FORMAT;
    @Input()
    maxDate: string;
    @Input()
    field: string;
    @Input()
    set initialValue(value: SearchDateRange) {
        if (value) {
            this.form.patchValue(value);
        }
    }

    @Output()
    changed = new EventEmitter<Partial<SearchDateRange>>();
    @Output()
    valid = new EventEmitter<boolean>();

    form = this.formBuilder.group<SearchDateRange>({
        dateRangeType: DateRangeType.ANY,
        inLastValueType: InLastDateType.DAYS,
        inLastValue: undefined,
        betweenStartDate: undefined,
        betweenEndDate: undefined
    });
    betweenStartDateFormControl = this.form.controls.betweenStartDate;
    betweenEndDateFormControl = this.form.controls.betweenEndDate;
    convertedMaxDate: Date;

    readonly DateRangeType = DateRangeType;
    readonly InLastDateType = InLastDateType;

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private formBuilder: FormBuilder,
        private userPreferencesService: UserPreferencesService,
        private dateAdapter: DateAdapter<DateFnsAdapter>,
        @Inject(MAT_DATE_FORMATS) private dateFormatConfig: MatDateFormats
    ) {}

    readonly endDateValidator = (formControl: UntypedFormControl): { [key: string]: boolean } | null => {
        if (isBefore(formControl.value, this.betweenStartDateFormControl.value) || isAfter(formControl.value, this.convertedMaxDate)) {
            return {
                invalidDate: true
            };
        }
        return {};
    };

    ngOnInit(): void {
        this.dateFormatConfig.display.dateInput = this.dateFormat;
        this.convertedMaxDate = endOfDay(this.maxDate && this.maxDate !== 'today' ? parse(this.maxDate, this.dateFormat, new Date()) : new Date());
        this.userPreferencesService
            .select(UserPreferenceValues.Locale)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((locale) => this.dateAdapter.setLocale(DateFnsUtils.getLocaleFromString(locale)));
        this.form.controls.dateRangeType.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((dateRangeType) => this.updateValidators(dateRangeType));
        this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.onChange());
    }
    private updateValidators(dateRangeType: DateRangeType) {
        switch (dateRangeType) {
            case DateRangeType.BETWEEN:
                this.betweenStartDateFormControl.setValidators(Validators.required);
                this.betweenEndDateFormControl.setValidators([Validators.required, this.endDateValidator]);
                this.form.controls.inLastValue.clearValidators();
                break;
            case DateRangeType.IN_LAST:
                this.form.controls.inLastValue.setValidators(Validators.required);
                this.betweenStartDateFormControl.clearValidators();
                this.betweenEndDateFormControl.clearValidators();
                break;
            default:
                this.form.controls.inLastValue.clearValidators();
                this.betweenStartDateFormControl.clearValidators();
                this.betweenEndDateFormControl.clearValidators();
                break;
        }
        this.betweenStartDateFormControl.updateValueAndValidity();
        this.betweenEndDateFormControl.updateValueAndValidity();
        this.form.controls.inLastValue.updateValueAndValidity();
    }

    private onChange(): void {
        if (this.form.valid) {
            this.changed.emit(this.form.value);
        }
        this.valid.emit(this.form.valid);
    }

    dateChanged(event: Event, formControl: UntypedFormControl) {
        if (event?.target['value']?.trim()) {
            const date = parse(event.target['value'], this.dateFormat, new Date());
            if (!isValid(date)) {
                formControl.setErrors({
                    ...formControl.errors,
                    required: false,
                    invalidDate: true
                });
            } else {
                formControl.setErrors({
                    ...formControl.errors,
                    invalidDate: false
                });
                formControl.setValue(date);
            }
        }
    }

    narrowDownAllowedCharacters(event: Event) {
        if (parseInt((event.target as HTMLInputElement).value, 10) === 0) {
            (event.target as HTMLInputElement).value = '';
        } else {
            (event.target as HTMLInputElement).value = (event.target as HTMLInputElement).value.replace(/\D/g, '');
        }
    }

    preventIncorrectNumberCharacters(event: KeyboardEvent): boolean {
        switch (event.key) {
            case '.':
            case '-':
            case 'e':
            case '+':
                return false;
            case '0':
                return !!(event.target as HTMLInputElement).value;
            default:
                return true;
        }
    }
}
