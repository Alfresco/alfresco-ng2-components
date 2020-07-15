/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { OnInit, Component, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MOMENT_DATE_FORMATS, UserPreferencesService, UserPreferenceValues } from '@alfresco/adf-core';

import { SearchWidget } from '../../search-widget.interface';
import { SearchWidgetSettings } from '../../search-widget-settings.interface';
import { SearchQueryBuilderService } from '../../search-query-builder.service';
import { LiveErrorStateMatcher } from '../../forms/live-error-state-matcher';
import { Moment } from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

declare let moment: any;

const DEFAULT_FORMAT_DATE: string = 'DD/MM/YYYY';

@Component({
    selector: 'adf-search-date-range',
    templateUrl: './search-date-range.component.html',
    styleUrls: ['./search-date-range.component.scss'],
    providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS}
    ],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-date-range' }
})
export class SearchDateRangeComponent implements SearchWidget, OnInit, OnDestroy {

    from: FormControl;
    to: FormControl;

    form: FormGroup;
    matcher = new LiveErrorStateMatcher();

    id: string;
    settings?: SearchWidgetSettings;
    context?: SearchQueryBuilderService;
    datePickerDateFormat = DEFAULT_FORMAT_DATE;
    maxDate: any;
    isActive = false;
    startValue: any = null;

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
        if (this.settings) {
            this.datePickerDateFormat = this.settings.dateFormat || DEFAULT_FORMAT_DATE;
        }
        const theCustomDateAdapter = <MomentDateAdapter> <any> this.dateAdapter;
        theCustomDateAdapter.overrideDisplayFormat = this.datePickerDateFormat;

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

        this.from = new FormControl('', validators);
        this.to = new FormControl('', validators);

        this.form = new FormGroup({
            from: this.from,
            to: this.to
        });
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    apply(model: { from: string, to: string }, isValid: boolean) {
        if (isValid && this.id && this.context && this.settings && this.settings.field) {
            this.isActive = true;

            const start = moment(model.from).startOf('day').format();
            const end = moment(model.to).endOf('day').format();

            this.context.queryFragments[this.id] = `${this.settings.field}:['${start}' TO '${end}']`;
            this.context.update();
        }
    }

    submitValues() {
        this.apply(this.form.value, this.form.valid);
    }

    hasValidValue() {
        return this.form.valid;
    }

    getCurrentValue() {
        return { from : this.dateAdapter.format(this.form.value.from, this.datePickerDateFormat),
                to: this.dateAdapter.format(this.form.value.from, this.datePickerDateFormat) };
    }

    setValue(parsedDate: string) {
        const splittedValue = parsedDate.split('||');
        const fromValue = this.dateAdapter.parse(splittedValue[0], this.datePickerDateFormat);
        const toValue = this.dateAdapter.parse(splittedValue[1], this.datePickerDateFormat);
        this.from.setValue(fromValue);
        this.from.markAsDirty();
        this.from.markAsTouched();
        this.to.setValue(toValue);
        this.to.markAsDirty();
        this.to.markAsTouched();
        this.submitValues();
    }

    reset() {
        this.isActive = false;
        this.form.reset({
            from: '',
            to: ''
        });
        if (this.id && this.context) {
            this.context.queryFragments[this.id] = '';
            this.context.update();
        }
    }

    onChangedHandler(event: any, formControl: FormControl) {

        const inputValue = event.srcElement.value;

        const formatDate = this.dateAdapter.parse(inputValue, this.datePickerDateFormat);
        if (formatDate && formatDate.isValid()) {
            formControl.setValue(formatDate);
        } else if (formatDate) {
            formControl.setErrors({
                'invalidOnChange': true
            });
        } else {
            formControl.setErrors({
                'required': true
            });
        }
    }

    setLocale(locale) {
        this.dateAdapter.setLocale(locale);
        moment.locale(locale);
    }

    hasParseError(formControl) {
        return formControl.hasError('matDatepickerParse') && formControl.getError('matDatepickerParse').text;
    }

    forcePlaceholder(event: any) {
        event.srcElement.click();
    }

    getFromMaxDate(): any {
        let maxDate: string;
        if (!this.to.value || this.maxDate && (moment(this.maxDate).isBefore(this.to.value))) {
            maxDate = this.maxDate;
        } else {
            maxDate = moment(this.to.value);
        }
        return maxDate;
    }
}
