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
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

import { SearchWidget } from '../../search-widget.interface';
import { SearchWidgetSettings } from '../../search-widget-settings.interface';
import { SearchQueryBuilderService } from '../../search-query-builder.service';
import { LiveErrorStateMatcher } from '../../forms/live-error-state-matcher';
import moment from 'moment-es6';
import { Moment } from 'moment';
import { AppConfigService, UserPreferencesService, UserPreferenceValues } from '@alfresco/adf-core';

const DEFAULT_FORMAT_DATE: string = 'DD/MM/YYYY';

export class CustomMomentDateAdapter extends MomentDateAdapter {
    customDateFormat: string;

    parse(value: any, parseFormat: any): any {
        const dateFormat = this.customDateFormat ? this.customDateFormat : DEFAULT_FORMAT_DATE;

        return super.parse(value, dateFormat);
    }

    format(value: Moment, displayFormat: string): string {
        const dateFormat = this.customDateFormat ? this.customDateFormat : DEFAULT_FORMAT_DATE;

        return super.format(value, dateFormat);
    }
}

@Component({
    selector: 'adf-search-date-range',
    templateUrl: './search-date-range.component.html',
    styleUrls: ['./search-date-range.component.scss'],
    providers: [
        {provide: DateAdapter, useClass: CustomMomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
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
    maxFrom: any;
    datePickerDateFormat = DEFAULT_FORMAT_DATE;

    constructor(private appConfigService: AppConfigService,
                private dateAdapter: DateAdapter<Moment>,
                private userPreferencesService: UserPreferencesService) {
    }

    ngOnInit() {
        this.datePickerDateFormat = this.appConfigService.get('search.datePicker.dateFormat', DEFAULT_FORMAT_DATE);

        const theCustomDateAdapter = <CustomMomentDateAdapter> this.dateAdapter;
        theCustomDateAdapter.customDateFormat = this.datePickerDateFormat;

        this.userPreferencesService.select(UserPreferenceValues.Locale).subscribe((locale) => {
            this.dateAdapter.setLocale(locale);
            moment.locale(locale);
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

        this.maxFrom = moment().startOf('day');
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

    onChangedHandler(event: any, formControl) {
        const inputValue = event.srcElement.value;

        if (inputValue) {
            const formatDate = moment(inputValue, this.datePickerDateFormat);

            if (formatDate.isValid()) {
                formControl.setValue(formatDate);
            }
        }
    }
}
