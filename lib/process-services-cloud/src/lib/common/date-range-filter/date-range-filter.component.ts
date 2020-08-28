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

import { Component, Input, EventEmitter, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import moment from 'moment-es6';
import { ProcessFilterProperties, DateRangeFilter, ProcessDateFilterType } from '../../process/process-filters/models/process-filter-cloud.model';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
     selector: 'adf-cloud-date-range-filter',
     styleUrls: ['./date-range-filter.component.scss'],
     templateUrl: './date-range-filter.component.html'
 })
 export class DateRangeFilterComponent {

    @Input()
    processFilterProperty: ProcessFilterProperties;

    @Output()
    dateChanged = new EventEmitter<DateRangeFilter>();

    type: ProcessDateFilterType;
    currentDate = new Date();
    dateRange: DateRangeFilter = {
        startDate: null,
        endDate: null
    };

    dateRangeForm = new FormGroup({
        start: new FormControl(),
        end: new FormControl()
    });

    options = [
        {
            key: ProcessDateFilterType.today,
            label: 'today'
        },
        {
            key: ProcessDateFilterType.today,
            label: 'today'
        },
        {
            key: ProcessDateFilterType.week,
            label: 'week'
        },
        {
            key: ProcessDateFilterType.month,
            label: 'month'
        },
        {
            key: ProcessDateFilterType.quarter,
            label: 'quarter'
        },
        {
            key: ProcessDateFilterType.year,
            label: 'year'
        },
        {
            key: ProcessDateFilterType.range,
            label: 'Date within'
        }
    ];

    onSelectionChange(option: MatSelectChange) {
        this.type = option.value;
        this.setDate();
        this.dateChanged.emit(this.dateRange);
    }

    setDate() {
        switch (this.type) {
            case ProcessDateFilterType.today:
                this.setTodayDateRange();
                break;
            case ProcessDateFilterType.week:
                this.setCurrentWeekRange();
                break;
            case ProcessDateFilterType.month:
                this.setCurrentMonthDateRange();
                break;
            case ProcessDateFilterType.quarter:
                this.setQuarterDateRange();
                break;
            case ProcessDateFilterType.year:
                this.setCurrentYearDateRange();
                break;
            default: this.resetDateRange();
        }
    }

    isDateRangeType(): boolean {
        return this.type === ProcessDateFilterType.range;
    }

    onDateRangeClosed() {
        this.dateRange = {
            startDate: this.dateRangeForm.controls.start.value,
            endDate: this.dateRangeForm.controls.end.value
        };
        this.dateChanged.emit(this.dateRange);
    }

    private resetDateRange() {
        this.dateRange = {
            startDate: null,
            endDate: null
        };
    }

    private setCurrentYearDateRange() {
        this.dateRange = {
            startDate: moment().startOf('year').toDate(),
            endDate: moment().endOf('year').toDate()
        };
    }

    private setTodayDateRange() {
        this.dateRange = {
            startDate: moment().startOf('day').toDate(),
            endDate: moment().endOf('day').toDate()
        };
    }

    private setCurrentWeekRange() {
        this.dateRange = {
            startDate: moment().startOf('week').toDate(),
            endDate: moment().endOf('week').toDate()
        };
    }

    private setCurrentMonthDateRange() {
        this.dateRange = {
            startDate: moment().startOf('month').toDate(),
            endDate: moment().endOf('month').toDate()
        };
    }

    private setQuarterDateRange() {
        const quarter = Math.floor((this.currentDate.getMonth() / 3));
        const firstDate = new Date(this.currentDate.getFullYear(), quarter * 3, 1);
        this.dateRange = {
            startDate: firstDate,
            endDate: new Date(firstDate.getFullYear(), firstDate.getMonth() + 3, 0)
        };
    }
 }
