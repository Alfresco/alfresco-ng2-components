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

import { MOMENT_DATE_FORMATS, MomentDateAdapter, UserPreferencesService, UserPreferenceValues } from '@alfresco/adf-core';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, OnDestroy } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import moment, { Moment } from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const FORMAT_DATE_ACTIVITI = 'YYYY-MM-DD';
const SHOW_FORMAT = 'DD/MM/YYYY';

@Component({
    selector: 'adf-date-range-widget',
    templateUrl: './date-range.widget.html',
    styleUrls: ['./date-range.widget.scss'],
    providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS}],
    encapsulation: ViewEncapsulation.None
})
export class DateRangeWidgetComponent implements OnInit, OnDestroy {
    @Input('group')
    dateRange: UntypedFormGroup;

    @Input()
    field: any;

    @Output()
    dateRangeChanged = new EventEmitter<any>();

    minDate: Moment;
    maxDate: Moment;
    startDatePicker: Moment = moment();
    endDatePicker: Moment = moment();

    private onDestroy$ = new Subject<boolean>();

    constructor(
        private dateAdapter: DateAdapter<Moment>,
        private userPreferencesService: UserPreferencesService) {
    }

    ngOnInit() {
        this.userPreferencesService
            .select(UserPreferenceValues.Locale)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(locale => this.dateAdapter.setLocale(locale));

        const momentDateAdapter = this.dateAdapter as MomentDateAdapter;
        momentDateAdapter.overrideDisplayFormat = SHOW_FORMAT;

        if (this.field) {
            if (this.field.value && this.field.value.startDate) {
                this.startDatePicker = moment(this.field.value.startDate, FORMAT_DATE_ACTIVITI);
            }

            if (this.field.value && this.field.value.endDate) {
                this.endDatePicker = moment(this.field.value.endDate, FORMAT_DATE_ACTIVITI);
            }
        }

        const startDateControl = new UntypedFormControl(this.startDatePicker);
        startDateControl.setValidators(Validators.required);
        this.dateRange.addControl('startDate', startDateControl);

        const endDateControl = new UntypedFormControl(this.endDatePicker);
        endDateControl.setValidators(Validators.required);
        this.dateRange.addControl('endDate', endDateControl);

        this.dateRange.setValidators(this.dateCheck);
        this.dateRange.valueChanges.subscribe(() => this.onGroupValueChanged());
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    onGroupValueChanged() {
        if (this.dateRange.valid) {
            const dateStart = this.convertToMomentDateWithTime(this.dateRange.controls.startDate.value);
            const endStart = this.convertToMomentDateWithTime(this.dateRange.controls.endDate.value);
            this.dateRangeChanged.emit({startDate: dateStart, endDate: endStart});
        }
    }

    convertToMomentDateWithTime(date: string) {
        return moment(date, FORMAT_DATE_ACTIVITI, true).format(FORMAT_DATE_ACTIVITI) + 'T00:00:00.000Z';
    }

    dateCheck(formControl: AbstractControl) {
        const startDate = moment(formControl.get('startDate').value);
        const endDate = moment(formControl.get('endDate').value);
        const isAfterCheck = startDate.isAfter(endDate);
        return isAfterCheck ? {greaterThan: true} : null;
    }

    isStartDateGreaterThanEndDate() {
        return this.dateRange && this.dateRange.errors && this.dateRange.errors.greaterThan;
    }

    isStartDateEmpty() {
        return this.dateRange && this.dateRange.controls.startDate && !this.dateRange.controls.startDate.valid;
    }
}
