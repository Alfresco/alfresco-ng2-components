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

/* eslint-disable @angular-eslint/no-input-rename */

import { MOMENT_DATE_FORMATS, MomentDateAdapter } from '@alfresco/adf-core';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import moment, { Moment } from 'moment';
import { ReportParameterDetailsModel } from '../../../../diagram/models/report/report-parameter-details.model';

const FORMAT_DATE_ACTIVITI = 'YYYY-MM-DD';
const DISPLAY_FORMAT = 'DD/MM/YYYY';

interface DateRangeProps {
    startDate: FormControl<Moment>;
    endDate: FormControl<Moment>;
}

@Component({
    selector: 'adf-date-range-widget',
    templateUrl: './date-range.widget.html',
    styleUrls: ['./date-range.widget.scss'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS }
    ],
    encapsulation: ViewEncapsulation.None
})
export class DateRangeWidgetComponent implements OnInit {
    @Input('group')
    dateRange: FormGroup<DateRangeProps>;

    @Input()
    field: ReportParameterDetailsModel;

    @Output()
    dateRangeChanged = new EventEmitter<{ startDate: string; endDate: string }>();

    minDate: Moment;
    maxDate: Moment;
    startDateValue: Moment = moment();
    endDateValue: Moment = moment();

    constructor(private dateAdapter: DateAdapter<Moment>) {}

    ngOnInit() {
        const momentDateAdapter = this.dateAdapter as MomentDateAdapter;
        momentDateAdapter.overrideDisplayFormat = DISPLAY_FORMAT;

        if (this.field) {
            if (this.field.value?.startDate) {
                this.startDateValue = moment(this.field.value.startDate, FORMAT_DATE_ACTIVITI);
            }

            if (this.field.value?.endDate) {
                this.endDateValue = moment(this.field.value.endDate, FORMAT_DATE_ACTIVITI);
            }
        }

        if (!this.dateRange) {
            this.dateRange = new FormGroup({} as any);
        }

        const startDateControl = new FormControl<Moment>(this.startDateValue);
        startDateControl.setValidators(Validators.required);
        this.dateRange.addControl('startDate', startDateControl);

        const endDateControl = new FormControl<Moment>(this.endDateValue);
        endDateControl.setValidators(Validators.required);
        this.dateRange.addControl('endDate', endDateControl);

        this.dateRange.setValidators(this.dateCheck);
        this.dateRange.valueChanges.subscribe(() => this.onGroupValueChanged());
    }

    onGroupValueChanged() {
        if (this.dateRange.valid) {
            const dateStart = this.formatDateTime(this.dateRange.controls.startDate.value);
            const endStart = this.formatDateTime(this.dateRange.controls.endDate.value);
            this.dateRangeChanged.emit({ startDate: dateStart, endDate: endStart });
        }
    }

    private formatDateTime(date: Moment) {
        return date.format(FORMAT_DATE_ACTIVITI) + 'T00:00:00.000Z';
    }

    dateCheck(formControl: FormGroup<DateRangeProps>) {
        const startDate = formControl.get('startDate').value;
        const endDate = formControl.get('endDate').value;
        const isAfterCheck = startDate.isAfter(endDate);

        return isAfterCheck ? { greaterThan: true } : null;
    }

    isStartDateGreaterThanEndDate(): boolean {
        return !!this.dateRange?.errors?.greaterThan;
    }

    isStartDateEmpty(): boolean {
        return this.dateRange?.controls.startDate && !this.dateRange.controls.startDate.valid;
    }
}
