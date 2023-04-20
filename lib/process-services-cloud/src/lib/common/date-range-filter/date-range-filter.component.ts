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

import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ProcessFilterProperties, ProcessFilterOptions } from '../../process/process-filters/models/process-filter-cloud.model';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { DateRangeFilter, DateCloudFilterType } from '../../models/date-cloud-filter.model';
import moment from 'moment';

@Component({
     selector: 'adf-cloud-date-range-filter',
     styleUrls: ['./date-range-filter.component.scss'],
     templateUrl: './date-range-filter.component.html'
 })
 export class DateRangeFilterComponent implements OnInit {

    @Input()
    processFilterProperty: ProcessFilterProperties;

    @Input()
    options: DateCloudFilterType[];

    @Output()
    dateChanged = new EventEmitter<DateRangeFilter>();

    @Output()
    dateTypeChange = new EventEmitter<DateCloudFilterType>();

    type: DateCloudFilterType;
    filteredProperties: ProcessFilterOptions[] = [];
    dateRangeForm = new UntypedFormGroup({
        from: new UntypedFormControl(),
        to: new UntypedFormControl()
    });

    ngOnInit() {
        this.options = this.options ? this.options : this.createDefaultRangeOptions();
        const defaultProperties = this.createDefaultDateOptions();
        this.filteredProperties = defaultProperties.filter((filterProperty) => this.isValidProperty(this.options, filterProperty.value.toString()));
        if (this.hasPreselectedValues()) {
            this.setPreselectedValues();
        }
    }

    onSelectionChange(option: MatSelectChange) {
        this.type = option.value;
        if (!this.isDateRangeType()) {
            this.dateTypeChange.emit(this.type);
        }
    }

    isDateRangeType(): boolean {
        return this.type === DateCloudFilterType.RANGE;
    }

    onDateRangeClosed() {
        const dateRange = {
            startDate: moment(this.dateRangeForm.controls.from.value).startOf('day').toISOString(true),
            endDate: moment(this.dateRangeForm.controls.to.value).endOf('day').toISOString(true)
        };
        this.dateChanged.emit(dateRange);
    }

    private hasPreselectedValues() {
        return !!this.processFilterProperty?.attributes && !!this.processFilterProperty?.value;
    }

    private setPreselectedValues() {
        const from = this.getFilterAttribute('from');
        const to = this.getFilterAttribute('to');
        const type = this.getFilterAttribute('dateType');

        this.dateRangeForm.get('from').setValue(moment(this.getFilterValue(from)));
        this.dateRangeForm.get('to').setValue(moment(this.getFilterValue(to)));
        this.type = this.getFilterValue(type);
    }

    private getFilterAttribute(key: string): string {
        return this.processFilterProperty.attributes[key];
    }

    private getFilterValue(attribute: string) {
        return this.processFilterProperty.value[attribute];
    }

    private isValidProperty(filterProperties: string[], key: string): boolean {
        return filterProperties ? filterProperties.indexOf(key) >= 0 : true;
    }

    private createDefaultRangeOptions(): DateCloudFilterType[] {
        return [
            DateCloudFilterType.NO_DATE,
            DateCloudFilterType.TODAY,
            DateCloudFilterType.WEEK,
            DateCloudFilterType.MONTH,
            DateCloudFilterType.QUARTER,
            DateCloudFilterType.YEAR,
            DateCloudFilterType.RANGE
        ];
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
