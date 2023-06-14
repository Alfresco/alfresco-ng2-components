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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { endOfDay, format, formatISO, parse, startOfDay } from 'date-fns';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { TranslationService } from '@alfresco/adf-core';
import { SearchWidget } from '../../models/search-widget.interface';
import { SearchWidgetSettings } from '../../models/search-widget-settings.interface';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';

enum DateRangeType {
    ANY = 'ANY',
    IN_LAST = 'IN_LAST',
    BETWEEN = 'BETWEEN',
}

enum InLastDateType {
    DAYS = 'DAYS',
    WEEKS = 'WEEKS',
    MONTHS = 'MONTHS'
}

interface SearchDateRangeAdvanced {
    dateRangeType: DateRangeType;

    [indexer: string]: any;
}

const DEFAULT_DATE_DISPLAY_FORMAT: string = 'dd-MMM-yyyy';

@Component({
    selector: 'adf-search-date-range-advanced',
    templateUrl: './search-date-range-advanced.component.html',
    styleUrls: ['./search-date-range-advanced.component.scss'],
    providers: [
        {provide: DateAdapter, useClass: NativeDateAdapter},
    ],
    encapsulation: ViewEncapsulation.None,
    host: {class: 'adf-search-date-range-advanced'}
})
export class SearchDateRangeAdvancedComponent implements SearchWidget, OnInit {
    displayValue$: Subject<string> = new Subject<string>();
    isActive: boolean;

    id: string;
    settings?: SearchWidgetSettings;
    context?: SearchQueryBuilderService;
    startValue: SearchDateRangeAdvanced;
    disableUpdateOnSubmit: boolean;
    maxDate: any;
    dateRangeTypeValue: DateRangeType = DateRangeType.ANY;
    inLastValue: string;
    inLastValueType: InLastDateType = InLastDateType.DAYS;
    betweenStartDate: any;
    betweenEndDate: any;

    DateRangeType = DateRangeType;
    InLastDateType = InLastDateType;

    private datePickerFormat: string;

    constructor(private translate: TranslationService) {
    }

    ngOnInit(): void {
        this.datePickerFormat = this.settings?.dateFormat ? this.settings.dateFormat : DEFAULT_DATE_DISPLAY_FORMAT;
        if (this.settings) {
            if (!this.settings.maxDate || this.settings.maxDate === 'today') {
                this.maxDate = endOfDay(new Date());
            } else {
                this.maxDate = endOfDay(parse(this.settings.maxDate, this.datePickerFormat, new Date()));
            }
        }

        if (this.startValue) {
            this.setValue(this.startValue);
        }
    }

    getCurrentValue(): SearchDateRangeAdvanced {
        let currentValue = {};
        switch (this.dateRangeTypeValue) {
            case DateRangeType.IN_LAST:
                currentValue = {
                    inLastValue: this.inLastValue,
                    inLastValueType: this.inLastValueType
                };
                break;
            case DateRangeType.BETWEEN:
                currentValue = {
                    betweenStartDate: this.betweenStartDate,
                    betweenEndDate: this.betweenEndDate
                };
                break;
        }
        return {
            dateRangeType: this.dateRangeTypeValue,
            ...currentValue
        };
    }

    hasValidValue(): boolean {
        let isValid = false;
        switch (this.dateRangeTypeValue) {
            case DateRangeType.ANY:
                isValid = true;
                break;
            case DateRangeType.IN_LAST:
                if (this.inLastValue) {
                    isValid = true;
                }
                break;
            case DateRangeType.BETWEEN:
                if (this.betweenStartDate && this.betweenEndDate) {
                    isValid = true;
                }
                break;
            default:
                isValid = false;
        }
        return isValid;
    }

    reset(): void {
        this.isActive = false;

        this.dateRangeTypeValue = DateRangeType.ANY;
        this.inLastValue = '';
        this.inLastValueType = InLastDateType.DAYS;
        this.betweenStartDate = '';
        this.betweenEndDate = '';

        if (this.id && this.context) {
            this.context.queryFragments[this.id] = '';
            if (!this.disableUpdateOnSubmit) {
                this.updateQuery();
            }
        }

    }

    setValue(value: SearchDateRangeAdvanced) {
        this.dateRangeTypeValue = value.dateRangeType ? value.dateRangeType : DateRangeType.ANY;
        switch (this.dateRangeTypeValue) {
            case DateRangeType.IN_LAST:
                this.inLastValue = value.inLastValue;
                this.inLastValueType = value.inLastValueType;
                break;
            case DateRangeType.BETWEEN:
                this.betweenStartDate = value.betweenStartDate;
                this.betweenEndDate = value.betweenEndDate;
                break;
        }
    }

    submitValues(): void {
        let query = '';
        this.isActive = true;
        switch (this.dateRangeTypeValue) {
            case DateRangeType.IN_LAST:
                if (this.hasValidValue()) {
                    query = `${this.settings.field}:[NOW/DAY-${this.inLastValue}${this.inLastValueType} TO NOW/DAY+1DAY]`;
                }
                break;
            case DateRangeType.BETWEEN:
                if (this.hasValidValue()) {
                    const start = formatISO(startOfDay(this.betweenStartDate));
                    const end = formatISO(endOfDay(this.betweenEndDate));
                    query = `${this.settings.field}:['${start}' TO '${end}']`;
                }
        }
        this.context.queryFragments[this.id] = query;
        this.updateDisplayValue();
        if (!this.disableUpdateOnSubmit) {
            this.updateQuery();
        }
    }

    updateDisplayValue(): void {
        let displayLabel = '';
        switch (this.dateRangeTypeValue) {
            case DateRangeType.IN_LAST:
                if (this.hasValidValue()) {
                    displayLabel = this.translate.instant(`SEARCH.DATE_RANGE_ADVANCED.IN_LAST_DISPLAY_LABELS.${this.inLastValueType}`, {value: this.inLastValue});
                }
                break;
            case DateRangeType.BETWEEN:
                if (this.hasValidValue()) {
                    const start = format(startOfDay(this.betweenStartDate), this.datePickerFormat);
                    const end = format(endOfDay(this.betweenEndDate), this.datePickerFormat);
                    displayLabel = `${start} - ${end}`;
                }
                break;
        }
        this.displayValue$.next(displayLabel);
    }

    private updateQuery() {
        if (this.id && this.context) {
            this.context.update();
        }
    }
}

//TODO: Format dates for Between date range type
