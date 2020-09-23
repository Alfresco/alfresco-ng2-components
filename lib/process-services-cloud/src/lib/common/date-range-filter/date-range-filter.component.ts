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
import { ProcessFilterProperties, ProcessFilterOptions } from '../../process/process-filters/models/process-filter-cloud.model';
import { FormGroup, FormControl } from '@angular/forms';
import { DateRangeFilterService } from './date-range-filter.service';
import { DateRangeFilter, DateCloudFilterType } from '../../models/date-cloud-filter.model';

const DEFAULT_DATE_RANGE_OPTIONS = [
    DateCloudFilterType.NO_DATE,
    DateCloudFilterType.TODAY,
    DateCloudFilterType.WEEK,
    DateCloudFilterType.MONTH,
    DateCloudFilterType.QUARTER,
    DateCloudFilterType.YEAR,
    DateCloudFilterType.RANGE
];

@Component({
     selector: 'adf-cloud-date-range-filter',
     styleUrls: ['./date-range-filter.component.scss'],
     templateUrl: './date-range-filter.component.html'
 })
 export class DateRangeFilterComponent {

    @Input()
    processFilterProperty: ProcessFilterProperties;

    @Input()
    options: DateCloudFilterType[] = DEFAULT_DATE_RANGE_OPTIONS;

    @Output()
    dateChanged = new EventEmitter<DateRangeFilter>();

    type: DateCloudFilterType;
    filteredProperties: ProcessFilterOptions[] = [];
    dateRangeForm = new FormGroup({
        from: new FormControl(),
        to: new FormControl()
    });

    constructor(private dateRangeFilterService: DateRangeFilterService) {}

    ngOnInit() {
        const defaultProperties = this.createDefaultDateOptions();
        this.filteredProperties = defaultProperties.filter((filterProperty: ProcessFilterOptions) => this.isValidProperty(this.options, filterProperty));
    }

    onSelectionChange(option: MatSelectChange) {
        this.type = option.value;
        const dateRange = this.dateRangeFilterService.getDateRange(this.type);
        if (!this.isDateRangeType()) {
            this.dateChanged.emit(dateRange);
        }
    }

    isDateRangeType(): boolean {
        return this.type === DateCloudFilterType.RANGE;
    }

    onDateRangeClosed() {
        const dateRange = {
            startDate: this.dateRangeForm.controls.from.value,
            endDate: this.dateRangeForm.controls.to.value
        };
        this.dateChanged.emit(dateRange);
    }

    private isValidProperty(filterProperties: string[], filterProperty: any): boolean {
        return filterProperties ? filterProperties.indexOf(filterProperty.value) >= 0 : true;
    }

    private createDefaultDateOptions(): ProcessFilterOptions[] {
        return  [
            {
                value: DateCloudFilterType.NO_DATE,
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.DATE_RANGE.NO_DATE'
            },
            {
                value: DateCloudFilterType.TODAY,
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.DATE_RANGE.TODAY'
            },
            {
                value: DateCloudFilterType.TOMORROW,
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.DATE_RANGE.TOMORROW'
            },
            {
                value: DateCloudFilterType.NEXT_7_DAYS,
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.DATE_RANGE.NEXT_7_DAYS'
            },
            {
                value: DateCloudFilterType.WEEK,
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.DATE_RANGE.WEEK'
            },
            {
                value: DateCloudFilterType.MONTH,
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.DATE_RANGE.MONTH'
            },
            {
                value: DateCloudFilterType.QUARTER,
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.DATE_RANGE.QUARTER'
            },
            {
                value: DateCloudFilterType.YEAR,
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.DATE_RANGE.YEAR'
            },
            {
                value: DateCloudFilterType.RANGE,
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.DATE_RANGE.RANGE'
            }
        ];
    }
 }
