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

import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {
    MOMENT_DATE_FORMATS,
    MomentDateAdapter,
    UserPreferencesService,
    UserPreferenceValues
} from '@alfresco/adf-core';

import { SearchWidget } from '../../models/search-widget.interface';
import { SearchWidgetSettings } from '../../models/search-widget-settings.interface';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';
import { LiveErrorStateMatcher } from '../../forms/live-error-state-matcher';
import { Moment } from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface DateRangeValue {
    from: string;
    to: string;
}

declare let moment: any;

const DEFAULT_FORMAT_DATE: string = 'DD/MM/YYYY';

@Component({
    selector: 'adf-search-date-range',
    templateUrl: './search-date-range.component.html',
    styleUrls: ['./search-date-range.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS }
    ],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-date-range' }
})
export class SearchDateRangeComponent implements SearchWidget, OnInit, OnDestroy {

    from: UntypedFormControl;
    to: UntypedFormControl;

    form: UntypedFormGroup;
    matcher = new LiveErrorStateMatcher();

    id: string;
    settings?: SearchWidgetSettings;
    context?: SearchQueryBuilderService;
    datePickerFormat: string;
    maxDate: any;
    fromMaxDate: any;
    isActive = false;
    startValue: any;
    enableChangeUpdate: boolean;
    displayValue$: Subject<string> = new Subject<string>();

    private onDestroy$ = new Subject<boolean>();

    constructor(private dateAdapter: DateAdapter<Moment>,
                private userPreferencesService: UserPreferencesService) {
    }

    getFromValidationMessage(): string {
        return this.from.hasError('invalidOnChange') || this.hasParseError(this.from) ? 'SEARCH.FILTER.VALIDATION.INVALID-DATE' :
            this.from.hasError('matDatepickerMax') ? 'SEARCH.FILTER.VALIDATION.BEYOND-MAX-DATE' :
            this.from.hasError('required') ? 'SEARCH.FILTER.VALIDATION.REQUIRED-VALUE' :
            '';
    }

    getToValidationMessage(): string {
        return this.to.hasError('invalidOnChange') || this.hasParseError(this.to) ? 'SEARCH.FILTER.VALIDATION.INVALID-DATE' :
            this.to.hasError('matDatepickerMin') ? 'SEARCH.FILTER.VALIDATION.NO-DAYS' :
            this.to.hasError('matDatepickerMax') ? 'SEARCH.FILTER.VALIDATION.BEYOND-MAX-DATE' :
            this.to.hasError('required') ? 'SEARCH.FILTER.VALIDATION.REQUIRED-VALUE' :
            '';
    }

    ngOnInit() {
        this.datePickerFormat = this.settings?.dateFormat ? this.settings.dateFormat : DEFAULT_FORMAT_DATE;

        const customDateAdapter = this.dateAdapter as MomentDateAdapter;
        customDateAdapter.overrideDisplayFormat = this.datePickerFormat;

        this.userPreferencesService
            .select(UserPreferenceValues.Locale)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(locale => this.setLocale(locale));

        const validators = Validators.compose([
            Validators.required
        ]);

        if (this.settings && this.settings.maxDate) {
            if (this.settings.maxDate === 'today') {
                this.maxDate = this.dateAdapter.today().endOf('day');
            } else {
                this.maxDate = moment(this.settings.maxDate).endOf('day');
            }
        }

        if (this.startValue) {
            const splitValue = this.startValue.split('||');
            const fromValue = this.dateAdapter.parse(splitValue[0], this.datePickerFormat);
            const toValue = this.dateAdapter.parse(splitValue[1], this.datePickerFormat);
            this.from = new UntypedFormControl(fromValue, validators);
            this.to = new UntypedFormControl(toValue, validators);
        } else {
            this.from = new UntypedFormControl('', validators);
            this.to = new UntypedFormControl('', validators);
        }

        this.form = new UntypedFormGroup({
            from: this.from,
            to: this.to
        });

        this.setFromMaxDate();
        this.enableChangeUpdate = this.settings?.allowUpdateOnChange ?? true;
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    apply(model: { from: string; to: string }, isValid: boolean) {
        if (isValid && this.id && this.context && this.settings && this.settings.field) {
            this.isActive = true;

            const start = moment(model.from).startOf('day').format();
            const end = moment(model.to).endOf('day').format();

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
            this.displayValue$.next(`${this.dateAdapter.format(this.form.value.from, this.datePickerFormat)} - ${this.dateAdapter.format(this.form.value.to, this.datePickerFormat)}`);
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
            from: '',
            to: ''
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

    onChangedHandler(event: any, formControl: UntypedFormControl) {

        const inputValue = event.value;
        const formatDate = this.dateAdapter.parse(inputValue, this.datePickerFormat);
        if (formatDate && formatDate.isValid()) {
            formControl.setValue(formatDate);
        } else if (formatDate) {
            formControl.setErrors({
                invalidOnChange: true
            });
        }

        this.setFromMaxDate();
    }

    setLocale(locale) {
        this.dateAdapter.setLocale(locale);
        moment.locale(locale);
    }

    hasParseError(formControl): boolean {
        return formControl.hasError('matDatepickerParse') && formControl.getError('matDatepickerParse').text;
    }

    forcePlaceholder(event: any) {
        event.srcElement.click();
    }

    setFromMaxDate() {
        this.fromMaxDate = (!this.to.value || this.maxDate && (moment(this.maxDate).isBefore(this.to.value))) ? this.maxDate : moment(this.to.value);
    }
}
