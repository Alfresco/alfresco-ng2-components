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

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { endOfDay, format, formatISO, parse, startOfDay } from 'date-fns';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { TranslationService } from '@alfresco/adf-core';
import { InLastDateType } from './in-last-date-type';
import { DateRangeType } from './date-range-type';
import { SearchDateRangeAdvanced } from './search-date-range-advanced';
import { FormBuilder, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

const DEFAULT_DATE_DISPLAY_FORMAT: string = 'dd-MMM-yy';

@Component({
    selector: 'adf-search-date-range-advanced',
    templateUrl: './search-date-range-advanced.component.html',
    styleUrls: ['./search-date-range-advanced.component.scss'],
    providers: [
        {provide: DateAdapter, useClass: NativeDateAdapter}
    ],
    encapsulation: ViewEncapsulation.None,
    host: {class: 'adf-search-date-range-advanced'}
})
export class SearchDateRangeAdvancedComponent implements OnInit, OnDestroy {
    @Input()
    dateFormat: string;
    @Input()
    maxDate: string;
    @Input()
    field: string;
    @Input()
    set initialValue(value: SearchDateRangeAdvanced) {
        if (value) {
            this._form.patchValue(value);
        }
    }

    @Output()
    updatedQuery = new EventEmitter<string>();
    @Output()
    updatedDisplayValue = new EventEmitter<string>();
    @Output()
    changed = new EventEmitter<Partial<SearchDateRangeAdvanced>>();
    @Output()
    valid = new EventEmitter<boolean>();

    private _form = this.formBuilder.group<SearchDateRangeAdvanced>({
        dateRangeType: DateRangeType.ANY,
        inLastValueType: InLastDateType.DAYS,
        inLastValue: undefined,
        betweenStartDate: undefined,
        betweenEndDate: undefined
    });
    private _convertedMaxDate: Date;
    private datePickerFormat: string;
    private destroy$ = new Subject<void>();

    get form(): SearchDateRangeAdvancedComponent['_form'] {
        return this._form;
    }

    get convertedMaxDate(): Date {
        return this._convertedMaxDate;
    }

    readonly DateRangeType = DateRangeType;
    readonly InLastDateType = InLastDateType;

    constructor(private translate: TranslationService, private formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.datePickerFormat = this.dateFormat ? this.dateFormat : DEFAULT_DATE_DISPLAY_FORMAT;
        this._convertedMaxDate = endOfDay(this.maxDate && this.maxDate !== 'today' ?
            parse(this.maxDate, this.datePickerFormat, new Date()) : new Date());
        this.form.controls.dateRangeType.valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((dateRangeType) => this.updateValidators(dateRangeType));
        this.form.valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((searchDateRangeAdvanced) => this.onChange(searchDateRangeAdvanced));
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private updateValidators(dateRangeType: DateRangeType) {
        if (dateRangeType === DateRangeType.BETWEEN) {
            this.form.controls.betweenStartDate.setValidators(Validators.required);
            this.form.controls.betweenEndDate.setValidators(Validators.required);
            this.form.controls.inLastValue.clearValidators();
        } else if (dateRangeType === DateRangeType.IN_LAST) {
            this.form.controls.inLastValue.setValidators(Validators.required);
            this.form.controls.betweenStartDate.clearValidators();
            this.form.controls.betweenEndDate.clearValidators();
        }
        this.form.controls.betweenStartDate.updateValueAndValidity();
        this.form.controls.betweenEndDate.updateValueAndValidity();
        this.form.controls.inLastValue.updateValueAndValidity();
    }

    private onChange(searchDateRangeAdvanced: Partial<SearchDateRangeAdvanced>): void {
        let query = '';
        if (this.form.valid) {
            if (searchDateRangeAdvanced.dateRangeType === DateRangeType.IN_LAST) {
                query = `${this.field}:[NOW/DAY-${searchDateRangeAdvanced.inLastValue}${searchDateRangeAdvanced.inLastValueType} TO NOW/DAY+1DAY]`;
            } else if (searchDateRangeAdvanced.dateRangeType === DateRangeType.BETWEEN) {
                query = `${this.field}:['${formatISO(startOfDay(searchDateRangeAdvanced.betweenStartDate))}' TO '${formatISO(endOfDay(searchDateRangeAdvanced.betweenEndDate))}']`;
            }
        }
        this.updateDisplayValue(searchDateRangeAdvanced);
        this.updatedQuery.emit(query);
        this.changed.emit(searchDateRangeAdvanced);
        this.valid.emit(this.form.valid);
    }

    private updateDisplayValue(searchDateRangeAdvanced: Partial<SearchDateRangeAdvanced>): void {
        let displayLabel = '';
        if (this.form.valid) {
            if (searchDateRangeAdvanced.dateRangeType === DateRangeType.IN_LAST) {
                displayLabel = this.translate
                    .instant(`SEARCH.DATE_RANGE_ADVANCED.IN_LAST_DISPLAY_LABELS.${searchDateRangeAdvanced.inLastValueType}`, {
                        value: searchDateRangeAdvanced.inLastValue
                    });
            } else if (searchDateRangeAdvanced.dateRangeType === DateRangeType.BETWEEN) {
                displayLabel = `${format(startOfDay(searchDateRangeAdvanced.betweenStartDate), this.datePickerFormat)} - ${format(endOfDay(searchDateRangeAdvanced.betweenEndDate), this.datePickerFormat)}`;
            }
        }
        this.updatedDisplayValue.next(displayLabel);
    }
}

//TODO: Format dates for Between date range type
