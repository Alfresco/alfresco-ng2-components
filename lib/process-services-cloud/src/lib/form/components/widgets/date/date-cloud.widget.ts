/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

/* eslint-disable @angular-eslint/component-selector */

import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { WidgetComponent, FormService, AdfDateFnsAdapter, DateFnsUtils, ADF_DATE_FORMATS, ErrorWidgetComponent } from '@alfresco/adf-core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { addDays } from 'date-fns';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'date-widget',
    standalone: true,
    imports: [NgIf, TranslateModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule, ErrorWidgetComponent],
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: ADF_DATE_FORMATS },
        { provide: DateAdapter, useClass: AdfDateFnsAdapter }
    ],
    templateUrl: './date-cloud.widget.html',
    styleUrls: ['./date-cloud.widget.scss'],
    host: {
        '(click)': 'event($event)',
        '(blur)': 'event($event)',
        '(change)': 'event($event)',
        '(focus)': 'event($event)',
        '(focusin)': 'event($event)',
        '(focusout)': 'event($event)',
        '(input)': 'event($event)',
        '(invalid)': 'event($event)',
        '(select)': 'event($event)'
    },
    encapsulation: ViewEncapsulation.None
})
export class DateCloudWidgetComponent extends WidgetComponent implements OnInit, OnDestroy {
    readonly DATE_FORMAT = 'dd-MM-yyyy';

    minDate: Date = null;
    maxDate: Date = null;
    startAt: Date = null;

    dateInputControl: FormControl;

    private dateChangesSubscription: Subscription;

    constructor(public readonly formService: FormService, private readonly dateAdapter: DateAdapter<Date>) {
        super(formService);
    }

    ngOnInit() {
        this.initFormControl();
        this.initDateAdapter();
        this.initRangeSelection();
        this.initStartAt();
        this.subscribeToDateChanges();
    }

    private initFormControl(): void {
        this.dateInputControl = new FormControl<Date>(
            {
                value: this.field?.value,
                disabled: this.field?.readOnly || this.readOnly
            },
            this.isRequired() ? [Validators.required] : []
        );
    }

    private subscribeToDateChanges(): void {
        this.dateChangesSubscription = this.dateInputControl.valueChanges.subscribe((newDate: any) => {
            this.field.value = newDate;
            this.checkErrors();
            this.onFieldChanged(this.field);
        });
    }

    private checkErrors(): void {
        this.dateInputControl.invalid ? this.field.markAsInvalid() : this.field.markAsValid();
    }

    private initDateAdapter(): void {
        if (this.field?.dateDisplayFormat) {
            const adapter = this.dateAdapter as AdfDateFnsAdapter;
            adapter.displayFormat = this.field.dateDisplayFormat;
        }
    }

    private initStartAt(): void {
        if (this.field?.value) {
            this.startAt = this.dateAdapter.parse(this.field.value, this.DATE_FORMAT);
        }
    }

    private initRangeSelection(): void {
        if (this.field?.dynamicDateRangeSelection) {
            this.setDynamicRangeSelection();
        } else {
            this.setStaticRangeSelection();
        }
    }

    private setDynamicRangeSelection(): void {
        if (this.field.minDateRangeValue === null) {
            this.minDate = null;
            this.field.minValue = null;
        } else {
            this.minDate = addDays(this.dateAdapter.today(), this.field.minDateRangeValue);
            this.field.minValue = DateFnsUtils.formatDate(this.minDate, this.DATE_FORMAT);
        }
        if (this.field.maxDateRangeValue === null) {
            this.maxDate = null;
            this.field.maxValue = null;
        } else {
            this.maxDate = addDays(this.dateAdapter.today(), this.field.maxDateRangeValue);
            this.field.maxValue = DateFnsUtils.formatDate(this.maxDate, this.DATE_FORMAT);
        }
    }

    private setStaticRangeSelection(): void {
        if (this.field?.minValue) {
            this.minDate = this.dateAdapter.parse(this.field.minValue, this.DATE_FORMAT);
        }

        if (this.field?.maxValue) {
            this.maxDate = this.dateAdapter.parse(this.field.maxValue, this.DATE_FORMAT);
        }
    }

    ngOnDestroy(): void {
        this.dateChangesSubscription?.unsubscribe();
    }
}
