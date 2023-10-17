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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ADF_DATE_FORMATS, ADF_DATETIME_FORMATS, AdfDateFnsAdapter, AdfDateTimeFnsAdapter, DateFnsUtils } from '@alfresco/adf-core';
import { SearchWidget } from '../../models/search-widget.interface';
import { SearchWidgetSettings } from '../../models/search-widget-settings.interface';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';
import { LiveErrorStateMatcher } from '../../forms/live-error-state-matcher';
import { Subject } from 'rxjs';
import { DatetimeAdapter, MAT_DATETIME_FORMATS, MatDatetimepickerInputEvent } from '@mat-datetimepicker/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { isValid, isBefore, startOfMinute, endOfMinute } from 'date-fns';

export interface DatetimeRangeValue {
    from: string;
    to: string;
}

interface FormProps {
    from: FormControl<Date>;
    to: FormControl<Date>;
}

export const DEFAULT_DATETIME_FORMAT: string = 'dd/MM/yyyy HH:mm';

@Component({
    selector: 'adf-search-datetime-range',
    templateUrl: './search-datetime-range.component.html',
    styleUrls: ['./search-datetime-range.component.scss'],
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: ADF_DATE_FORMATS },
        { provide: MAT_DATETIME_FORMATS, useValue: ADF_DATETIME_FORMATS },
        { provide: DateAdapter, useClass: AdfDateFnsAdapter },
        { provide: DatetimeAdapter, useClass: AdfDateTimeFnsAdapter }
    ],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-date-range' }
})
export class SearchDatetimeRangeComponent implements SearchWidget, OnInit {
    from: FormControl<Date>;
    to: FormControl<Date>;

    form: FormGroup<FormProps>;
    matcher = new LiveErrorStateMatcher();

    id: string;
    settings?: SearchWidgetSettings;
    context?: SearchQueryBuilderService;
    datetimePickerFormat: string;
    maxDatetime: any;
    fromMaxDatetime: any;
    isActive = false;
    startValue: any;
    enableChangeUpdate: boolean;
    displayValue$: Subject<string> = new Subject<string>();

    constructor(private dateAdapter: DateAdapter<Date>,
        private dateTimeAdapter: DatetimeAdapter<Date>) {}

    getFromValidationMessage(): string {
        return this.from.hasError('invalidOnChange') || this.hasParseError(this.from)
            ? 'SEARCH.FILTER.VALIDATION.INVALID-DATETIME'
            : this.from.hasError('matDatepickerMax')
            ? 'SEARCH.FILTER.VALIDATION.BEYOND-MAX-DATETIME'
            : this.from.hasError('required')
            ? 'SEARCH.FILTER.VALIDATION.REQUIRED-VALUE'
            : '';
    }

    getToValidationMessage(): string {
        return this.to.hasError('invalidOnChange') || this.hasParseError(this.to)
            ? 'SEARCH.FILTER.VALIDATION.INVALID-DATETIME'
            : this.to.hasError('matDatepickerMin')
            ? 'SEARCH.FILTER.VALIDATION.NO-DAYS'
            : this.to.hasError('matDatepickerMax')
            ? 'SEARCH.FILTER.VALIDATION.BEYOND-MAX-DATETIME'
            : this.to.hasError('required')
            ? 'SEARCH.FILTER.VALIDATION.REQUIRED-VALUE'
            : '';
    }

    ngOnInit() {
        this.datetimePickerFormat = this.settings?.datetimeFormat ? this.settings.datetimeFormat : DEFAULT_DATETIME_FORMAT;

        const dateAdapter = this.dateAdapter as AdfDateFnsAdapter;
        dateAdapter.displayFormat = this.datetimePickerFormat;

        const dateTimeAdapter = this.dateTimeAdapter as AdfDateTimeFnsAdapter;
        dateTimeAdapter.displayFormat = this.datetimePickerFormat;

        const validators = Validators.compose([Validators.required]);

        if (this.settings?.maxDatetime) {
            this.maxDatetime = new Date(this.settings.maxDatetime);
        }

        if (this.startValue) {
            const splitValue = this.startValue.split('||');
            const fromValue = this.dateAdapter.parse(splitValue[0], this.datetimePickerFormat);
            const toValue = this.dateAdapter.parse(splitValue[1], this.datetimePickerFormat);
            this.from = new FormControl<Date>(fromValue, validators);
            this.to = new FormControl<Date>(toValue, validators);
        } else {
            this.from = new FormControl<Date>(null, validators);
            this.to = new FormControl<Date>(null, validators);
        }

        this.form = new FormGroup<FormProps>({
            from: this.from,
            to: this.to
        });

        this.setFromMaxDatetime();
        this.enableChangeUpdate = this.settings?.allowUpdateOnChange ?? true;
    }

    apply(model: Partial<{ from: Date; to: Date }>, isValidValue: boolean) {
        if (isValidValue && this.id && this.context && this.settings && this.settings.field) {
            this.isActive = true;

            const start = DateFnsUtils.utcToLocal(startOfMinute(model.from)).toISOString();
            const end = DateFnsUtils.utcToLocal(endOfMinute(model.to)).toISOString();

            this.context.queryFragments[this.id] = `${this.settings.field}:['${start}' TO '${end}']`;
            this.updateDisplayValue();
            this.context.update();
        }
    }

    submitValues() {
        this.apply(this.form.value, this.form.valid);
    }

    hasValidValue(): boolean {
        return this.form.valid;
    }

    getCurrentValue(): DatetimeRangeValue {
        return {
            from: this.dateAdapter.format(this.form.value.from, this.datetimePickerFormat),
            to: this.dateAdapter.format(this.form.value.to, this.datetimePickerFormat)
        };
    }

    updateDisplayValue(): void {
        if (this.form.invalid || this.form.pristine) {
            this.displayValue$.next('');
        } else {
            this.displayValue$.next(
                `${this.dateAdapter.format(this.form.value.from, this.datetimePickerFormat)} - ${this.dateAdapter.format(
                    this.form.value.to,
                    this.datetimePickerFormat
                )}`
            );
        }
    }

    setValue(parsedDate: string) {
        const splitValue = parsedDate.split('||');
        const fromValue = this.dateAdapter.parse(splitValue[0], this.datetimePickerFormat);
        const toValue = this.dateAdapter.parse(splitValue[1], this.datetimePickerFormat);
        this.from.setValue(fromValue);
        this.from.markAsDirty();
        this.from.markAsTouched();
        this.to.setValue(toValue);
        this.to.markAsDirty();
        this.to.markAsTouched();
        this.submitValues();
    }

    clear() {
        this.isActive = false;
        this.form.reset({
            from: null,
            to: null
        });
        if (this.id && this.context) {
            this.context.queryFragments[this.id] = '';
        }

        if (this.id && this.context && this.enableChangeUpdate) {
            this.updateQuery();
        }
        this.setFromMaxDatetime();
    }

    reset() {
        this.clear();
        this.updateQuery();
    }

    private updateQuery() {
        if (this.id && this.context) {
            this.updateDisplayValue();
            this.context.update();
        }
    }

    onChangedHandler(event: MatDatetimepickerInputEvent<Date>, formControl: FormControl<Date>) {
        const formatDate = event.value;

        if (isValid(formatDate)) {
            formControl.setValue(formatDate);
        } else if (formatDate) {
            formControl.setErrors({
                invalidOnChange: true
            });
        }

        this.setFromMaxDatetime();
    }

    hasParseError(formControl: FormControl<Date>): boolean {
        return formControl.hasError('matDatepickerParse') && formControl.getError('matDatepickerParse').text;
    }

    forcePlaceholder(event: any) {
        event.target.click();
    }

    setFromMaxDatetime() {
        this.fromMaxDatetime =
            !this.to.value || (this.maxDatetime && isBefore(this.maxDatetime, this.to.value)) ? this.maxDatetime : this.to.value;
    }
}
