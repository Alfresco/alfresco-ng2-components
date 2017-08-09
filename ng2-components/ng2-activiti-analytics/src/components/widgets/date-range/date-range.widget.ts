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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

function dateCheck(c: AbstractControl) {
    let startDate = moment(c.get('startDate').value);
    let endDate = moment(c.get('endDate').value);
    let result = startDate.isAfter(endDate);
    return result ? {'greaterThan': true} : null;
}

@Component({
    selector: 'adf-date-range-widget',
    templateUrl: './date-range.widget.html',
    styleUrls: ['./date-range.widget.scss']
})
export class DateRangeWidgetComponent implements OnInit {

    public static FORMAT_DATE_ACTIVITI: string =  'YYYY-MM-DD';

    @Input('group')
    public dateRange: FormGroup;

    @Input()
    field: any;

    @Output()
    dateRangeChanged: EventEmitter<any> = new EventEmitter<any>();

    debug: boolean = false;

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        let startDateForm = this.field.value ? this.field.value.startDate : '' ;
        let startDate = this.convertToMomentDate(startDateForm);
        let endDateForm = this.field.value ? this.field.value.endDate : '' ;
        let endDate = this.convertToMomentDate(endDateForm);

        let startDateControl = new FormControl(startDate);
        startDateControl.setValidators(Validators.required);
        this.dateRange.addControl('startDate', startDateControl);

        let endDateControl = new FormControl(endDate);
        endDateControl.setValidators(Validators.required);
        this.dateRange.addControl('endDate', endDateControl);

        this.dateRange.setValidators(dateCheck);
        this.dateRange.valueChanges.subscribe(data => this.onGroupValueChanged(data));
    }

    onGroupValueChanged(data: any) {
        if (this.dateRange.valid) {
            let dateStart = this.convertToMomentDateWithTime(this.dateRange.controls['startDate'].value);
            let endStart = this.convertToMomentDateWithTime(this.dateRange.controls['endDate'].value);
            this.dateRangeChanged.emit({startDate: dateStart, endDate: endStart});
        }
    }

    public convertToMomentDateWithTime(date: string) {
        return moment(date, DateRangeWidgetComponent.FORMAT_DATE_ACTIVITI, true).format(DateRangeWidgetComponent.FORMAT_DATE_ACTIVITI) + 'T00:00:00.000Z';
    }

    private convertToMomentDate(date: string) {
        if (date) {
            return moment(date).format(DateRangeWidgetComponent.FORMAT_DATE_ACTIVITI);
        } else {
            return moment().format(DateRangeWidgetComponent.FORMAT_DATE_ACTIVITI);
        }
    }

    isStartDateGreaterThanEndDate() {
        return this.dateRange && this.dateRange.errors && this.dateRange.errors.greaterThan;
    }

    isStartDateEmpty() {
        return this.dateRange && this.dateRange.controls.startDate && !this.dateRange.controls.startDate.valid;
    }
}
