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
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { ADF_DATE_FORMATS, AdfDateFnsAdapter } from '@alfresco/adf-core';
import { SearchWidget } from '../../models/search-widget.interface';
import { SearchWidgetSettings } from '../../models/search-widget-settings.interface';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';
import { LiveErrorStateMatcher } from '../../forms/live-error-state-matcher';
import { Subject } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { startOfDay, endOfDay, isBefore, isValid as isValidDate } from 'date-fns';

export interface DateRangeValue {
    from: string;
    to: string;
}

const DEFAULT_FORMAT_DATE: string = 'DD/MM/YYYY';

interface DateRangeForm {
    from: FormControl<Date>;
    to: FormControl<Date>;
}

@Component({
    selector: 'adf-search-date-range',
    templateUrl: './search-date-range.component.html',
    styleUrls: ['./search-date-range.component.scss'],
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: ADF_DATE_FORMATS },
        { provide: DateAdapter, useClass: AdfDateFnsAdapter }
    ],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-date-range' }
})
export class SearchDateRangeComponent implements SearchWidget, OnInit {
    from: FormControl<Date>;
    to: FormControl<Date>;

    form: FormGroup<DateRangeForm>;
    matcher = new LiveErrorStateMatcher();

    id: string;
    settings?: SearchWidgetSettings;
    context?: SearchQueryBuilderService;
    datePickerFormat: string;
    maxDate: Date;
    fromMaxDate: Date;
    isActive = false;
    startValue: any;
    enableChangeUpdate: boolean;
    displayValue$ = new Subject<string>();

    constructor(private dateAdapter: DateAdapter<Date>) {}

    getFromValidationMessage(): string {
        return this.from.hasError('invalidOnChange') || this.hasParseError(this.from)
            ? 'SEARCH.FILTER.VALIDATION.INVALID-DATE'
            : this.from.hasError('matDatepickerMax')
            ? 'SEARCH.FILTER.VALIDATION.BEYOND-MAX-DATE'
            : this.from.hasError('required')
            ? 'SEARCH.FILTER.VALIDATION.REQUIRED-VALUE'
            : '';
    }

    getToValidationMessage(): string {
        return this.to.hasError('invalidOnChange') || this.hasParseError(this.to)
            ? 'SEARCH.FILTER.VALIDATION.INVALID-DATE'
            : this.to.hasError('matDatepickerMin')
            ? 'SEARCH.FILTER.VALIDATION.NO-DAYS'
            : this.to.hasError('matDatepickerMax')
            ? 'SEARCH.FILTER.VALIDATION.BEYOND-MAX-DATE'
            : this.to.hasError('required')
            ? 'SEARCH.FILTER.VALIDATION.REQUIRED-VALUE'
            : '';
    }

    ngOnInit() {
        this.datePickerFormat = this.settings?.dateFormat ? this.settings.dateFormat : DEFAULT_FORMAT_DATE;

        const customDateAdapter = this.dateAdapter as AdfDateFnsAdapter;
        customDateAdapter.displayFormat = this.datePickerFormat;

        const validators = Validators.compose([Validators.required]);

        if (this.settings?.maxDate) {
            if (this.settings.maxDate === 'today') {
                this.maxDate = endOfDay(this.dateAdapter.today());
            } else {
                this.maxDate =  endOfDay(this.dateAdapter.parse(this.settings.maxDate, this.datePickerFormat));
            }
        }

        if (this.startValue) {
            const splitValue = this.startValue.split('||');
            const fromValue = this.dateAdapter.parse(splitValue[0], this.datePickerFormat);
            const toValue = this.dateAdapter.parse(splitValue[1], this.datePickerFormat);
            this.from = new FormControl(fromValue, validators);
            this.to = new FormControl(toValue, validators);
        } else {
            this.from = new FormControl(null, validators);
            this.to = new FormControl(null, validators);
        }

        this.form = new FormGroup({
            from: this.from,
            to: this.to
        });

        this.setFromMaxDate();
        this.enableChangeUpdate = this.settings?.allowUpdateOnChange ?? true;
    }

    apply(model: Partial<{ from: Date; to: Date }>, isValid: boolean) {
        if (isValid && this.id && this.context && this.settings && this.settings.field) {
            this.isActive = true;

            const start = startOfDay(model.from).toISOString();
            const end = endOfDay(model.to).toISOString();

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

    getCurrentValue(): DateRangeValue {
        return {
            from: this.dateAdapter.format(this.form.value.from, this.datePickerFormat),
            to: this.dateAdapter.format(this.form.value.from, this.datePickerFormat)
        };
    }

    updateDisplayValue(): void {
        if (this.form.invalid || this.form.pristine) {
            this.displayValue$.next('');
        } else {
            this.displayValue$.next(
                `${this.dateAdapter.format(this.form.value.from, this.datePickerFormat)} - ${this.dateAdapter.format(
                    this.form.value.to,
                    this.datePickerFormat
                )}`
            );
        }
    }

    setValue(parsedDate: string) {
        const splitValue = parsedDate.split('||');
        const fromValue = this.dateAdapter.parse(splitValue[0], this.datePickerFormat);
        const toValue = this.dateAdapter.parse(splitValue[1], this.datePickerFormat);
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
            if (this.enableChangeUpdate) {
                this.updateQuery();
            }
        }

        this.setFromMaxDate();
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

    onChangedHandler(event: MatDatepickerInputEvent<Date>, formControl: FormControl) {
        const inputValue = event.value;

        if (isValidDate(inputValue)) {
            formControl.setValue(inputValue);
        } else if (inputValue) {
            formControl.setErrors({
                invalidOnChange: true
            });
        }

        this.setFromMaxDate();
    }

    hasParseError(formControl: FormControl): boolean {
        return formControl.hasError('matDatepickerParse') && formControl.getError('matDatepickerParse').text;
    }

    forcePlaceholder(event: any) {
        event.srcElement.click();
    }

    setFromMaxDate() {
        this.fromMaxDate = !this.to.value || (this.maxDate && isBefore(this.maxDate, this.to.value)) ? this.maxDate : this.to.value;
    }
}
