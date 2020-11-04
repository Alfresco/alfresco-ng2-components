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
import { UserPreferencesService, UserPreferenceValues } from '@alfresco/adf-core';

import { SearchWidget } from '../../search-widget.interface';
import { SearchWidgetSettings } from '../../search-widget-settings.interface';
import { SearchQueryBuilderService } from '../../search-query-builder.service';
import { LiveErrorStateMatcher } from '../../forms/live-error-state-matcher';
import { Moment } from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DatetimeAdapter, MAT_DATETIME_FORMATS } from '@mat-datetimepicker/core';
import { MAT_MOMENT_DATETIME_FORMATS } from '@mat-datetimepicker/moment';

export interface DatetimeRangeValue {
    from: string;
    to: string;
}

declare let moment: any;

const DEFAULT_DATETIME_FORMAT: string = 'DD/MM/YYYY HH:mm';

@Component({
    selector: 'adf-search-datetime-range',
    templateUrl: './search-datetime-range.component.html',
    styleUrls: ['./search-datetime-range.component.scss'],
    providers: [
        { provide: MAT_DATETIME_FORMATS, useValue: MAT_MOMENT_DATETIME_FORMATS }
    ],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-date-range' }
})
export class SearchDatetimeRangeComponent implements SearchWidget, OnInit, OnDestroy {

    from: FormControl;
    to: FormControl;

    form: FormGroup;
    matcher = new LiveErrorStateMatcher();

    id: string;
    settings?: SearchWidgetSettings;
    context?: SearchQueryBuilderService;
    datetimePickerFormat: string;
    maxDatetime: any;
    fromMaxDatetime: any;
    isActive = false;
    startValue: any;

    private onDestroy$ = new Subject<boolean>();

    constructor(private dateAdapter: DatetimeAdapter<Moment>,
                private userPreferencesService: UserPreferencesService) {
    }

    getFromValidationMessage(): string {
        return this.from.hasError('invalidOnChange') || this.hasParseError(this.from) ? 'SEARCH.FILTER.VALIDATION.INVALID-DATETIME' :
            this.from.hasError('matDatepickerMax') ? 'SEARCH.FILTER.VALIDATION.BEYOND-MAX-DATETIME' :
            this.from.hasError('required') ? 'SEARCH.FILTER.VALIDATION.REQUIRED-VALUE' :
            '';
    }

    getToValidationMessage(): string {
        return this.to.hasError('invalidOnChange') || this.hasParseError(this.to) ? 'SEARCH.FILTER.VALIDATION.INVALID-DATETIME' :
            this.to.hasError('matDatepickerMin') ? 'SEARCH.FILTER.VALIDATION.NO-DAYS' :
            this.to.hasError('matDatepickerMax') ? 'SEARCH.FILTER.VALIDATION.BEYOND-MAX-DATETIME' :
            this.to.hasError('required') ? 'SEARCH.FILTER.VALIDATION.REQUIRED-VALUE' :
            '';
    }

    ngOnInit() {
        this.datetimePickerFormat = this.settings?.datetimeFormat ? this.settings.datetimeFormat : DEFAULT_DATETIME_FORMAT;

        this.userPreferencesService
            .select(UserPreferenceValues.Locale)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(locale => this.setLocale(locale));

        const validators = Validators.compose([
            Validators.required
        ]);

        if (this.settings && this.settings.maxDatetime) {
            this.maxDatetime = moment(this.settings.maxDatetime);
        }

        if (this.startValue) {
            const splitValue = this.startValue.split('||');
            const fromValue = this.dateAdapter.parse(splitValue[0], this.datetimePickerFormat);
            const toValue = this.dateAdapter.parse(splitValue[1], this.datetimePickerFormat);
            this.from = new FormControl(fromValue, validators);
            this.to = new FormControl(toValue, validators);
        } else {
            this.from = new FormControl('', validators);
            this.to = new FormControl('', validators);
        }

        this.form = new FormGroup({
            from: this.from,
            to: this.to
        });

        this.setFromMaxDatetime();
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    apply(model: { from: string, to: string }, isValid: boolean) {
        if (isValid && this.id && this.context && this.settings && this.settings.field) {
            this.isActive = true;

            const start = moment(model.from).startOf('minute').format();
            const end = moment(model.to).endOf('minute').format();

            this.context.queryFragments[this.id] = `${this.settings.field}:['${start}' TO '${end}']`;
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
            to: this.dateAdapter.format(this.form.value.from, this.datetimePickerFormat)
        };
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
        this.setFromMaxDatetime();
    }

    onChangedHandler(event: any, formControl: FormControl) {

        const inputValue = event.value;
        const formatDate = this.dateAdapter.parse(inputValue, this.datetimePickerFormat);
        if (formatDate && formatDate.isValid()) {
            formControl.setValue(formatDate);
        } else if (formatDate) {
            formControl.setErrors({
                'invalidOnChange': true
            });
        }

        this.setFromMaxDatetime();
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

    setFromMaxDatetime() {
        this.fromMaxDatetime = (!this.to.value || this.maxDatetime && (moment(this.maxDatetime).isBefore(this.to.value))) ? this.maxDatetime : moment(this.to.value);
    }
}
