/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { OnInit, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MOMENT_DATE_FORMATS } from '@alfresco/adf-core';

import { SearchWidget } from '../../search-widget.interface';
import { SearchWidgetSettings } from '../../search-widget-settings.interface';
import { SearchQueryBuilderService } from '../../search-query-builder.service';
import { LiveErrorStateMatcher } from '../../forms/live-error-state-matcher';
import { Moment } from 'moment';
import { UserPreferencesService, UserPreferenceValues } from '@alfresco/adf-core';

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
export class SearchDateRangeComponent implements SearchWidget, OnInit {

    from: FormControl;
    to: FormControl;

    form: FormGroup;
    matcher = new LiveErrorStateMatcher();

    id: string;
    settings?: SearchWidgetSettings;
    context?: SearchQueryBuilderService;
    maxDate: any;
    datePickerDateFormat = DEFAULT_FORMAT_DATE;

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

        this.userPreferencesService.select(UserPreferenceValues.Locale).subscribe((locale) => {
            this.setLocale(locale);
        });

        const validators = Validators.compose([
            Validators.required
        ]);

        this.from = new FormControl('', validators);
        this.to = new FormControl('', validators);

        this.form = new FormGroup({
            from: this.from,
            to: this.to
        });

        this.maxDate = this.dateAdapter.today().startOf('day');
    }

    apply(model: { from: string, to: string }, isValid: boolean) {
        if (isValid && this.id && this.context && this.settings && this.settings.field) {
            const start = moment(model.from).startOf('day').format();
            const end = moment(model.to).endOf('day').format();

            this.context.queryFragments[this.id] = `${this.settings.field}:['${start}' TO '${end}']`;
            this.context.update();
        }
    }

    reset() {
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

}
