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

/* eslint-disable @angular-eslint/no-input-rename */

import { ADF_DATE_FORMATS, AdfDateFnsAdapter } from '@alfresco/adf-core';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { ReportParameterDetailsModel } from '../../../../diagram/models/report/report-parameter-details.model';
import { isAfter } from 'date-fns';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';

const FORMAT_DATE_ACTIVITI = 'yyyy-MM-dd';
const DISPLAY_FORMAT = 'dd/MM/yyyy';

interface DateRangeProps {
    startDate: FormControl<Date>;
    endDate: FormControl<Date>;
}

@Component({
    selector: 'adf-date-range-widget',
    imports: [CommonModule, TranslateModule, ReactiveFormsModule, MatGridListModule, MatFormFieldModule, MatInputModule, MatDatepickerModule],
    templateUrl: './date-range.widget.html',
    styleUrls: ['./date-range.widget.scss'],
    providers: [
        { provide: DateAdapter, useClass: AdfDateFnsAdapter },
        { provide: MAT_DATE_FORMATS, useValue: ADF_DATE_FORMATS }
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

    minDate: Date;
    maxDate: Date;
    startDateValue = new Date();
    endDateValue = new Date();

    constructor(private dateAdapter: DateAdapter<Date>) {}

    ngOnInit() {
        const dateAdapter = this.dateAdapter as AdfDateFnsAdapter;
        dateAdapter.displayFormat = DISPLAY_FORMAT;

        if (this.field) {
            if (this.field.value?.startDate) {
                this.startDateValue = this.dateAdapter.parse(this.field.value.startDate, FORMAT_DATE_ACTIVITI);
            }

            if (this.field.value?.endDate) {
                this.endDateValue = this.dateAdapter.parse(this.field.value.endDate, FORMAT_DATE_ACTIVITI);
            }
        }

        if (!this.dateRange) {
            this.dateRange = new FormGroup({} as any);
        }

        const startDateControl = new FormControl<Date>(this.startDateValue);
        startDateControl.setValidators(Validators.required);
        this.dateRange.addControl('startDate', startDateControl);

        const endDateControl = new FormControl<Date>(this.endDateValue);
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

    private formatDateTime(date: Date) {
        const datePart = this.dateAdapter.format(date, FORMAT_DATE_ACTIVITI);
        return `${datePart}T00:00:00.000Z`;
    }

    dateCheck(formControl: FormGroup<DateRangeProps>) {
        const startDate = formControl.get('startDate').value;
        const endDate = formControl.get('endDate').value;
        const isAfterCheck = isAfter(startDate, endDate);

        return isAfterCheck ? { greaterThan: true } : null;
    }

    isStartDateGreaterThanEndDate(): boolean {
        return !!this.dateRange?.errors?.greaterThan;
    }

    isStartDateEmpty(): boolean {
        return this.dateRange?.controls.startDate && !this.dateRange.controls.startDate.valid;
    }
}
