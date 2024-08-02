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

import { Component, OnInit, ViewEncapsulation, OnDestroy, inject } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
    WidgetComponent,
    FormService,
    AdfDateFnsAdapter,
    DateFnsUtils,
    ADF_DATE_FORMATS,
    ErrorWidgetComponent,
    ErrorMessageModel
} from '@alfresco/adf-core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { addDays, parseISO } from 'date-fns';
import { FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'date-widget',
    standalone: true,
    imports: [
        NgIf,
        TranslateModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatTooltipModule,
        ReactiveFormsModule,
        ErrorWidgetComponent
    ],
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
    typeId = 'DateCloudWidgetComponent';
    readonly DATE_FORMAT = 'dd-MM-yyyy';

    minDate: Date = null;
    maxDate: Date = null;
    startAt: Date = null;

    dateInputControl: FormControl<Date> = new FormControl<Date>(null);

    private onDestroy$ = new Subject<void>();

    public readonly formService = inject(FormService);
    private readonly dateAdapter = inject(DateAdapter);

    ngOnInit(): void {
        this.patchFormControl();
        this.initDateAdapter();
        this.initRangeSelection();
        this.initStartAt();
        this.subscribeToDateChanges();
        this.updateField();
    }

    updateField(): void {
        this.validateField();
        this.onFieldChanged(this.field);
    }

    private patchFormControl(): void {
        this.dateInputControl.setValue(this.field.value, { emitEvent: false });
        this.dateInputControl.setValidators(this.isRequired() ? [Validators.required] : []);
        if (this.field?.readOnly || this.readOnly) {
            this.dateInputControl.disable({ emitEvent: false });
        }

        this.dateInputControl.updateValueAndValidity({ emitEvent: false });
    }

    private subscribeToDateChanges(): void {
        this.dateInputControl.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe((newDate: Date) => {
            this.field.value = newDate;
            this.updateField();
        });
    }

    private validateField(): void {
        if (this.dateInputControl.invalid) {
            this.handleErrors(this.dateInputControl.errors);
            this.field.markAsInvalid();
        } else {
            this.resetErrors();
            this.field.markAsValid();
        }
    }

    private handleErrors(errors: ValidationErrors): void {
        const errorAttributes = new Map<string, string>();
        switch (true) {
            case !!errors.matDatepickerParse:
                this.updateValidationSummary(this.field.dateDisplayFormat || this.field.defaultDateTimeFormat);
                break;
            case !!errors.required:
                this.updateValidationSummary('FORM.FIELD.REQUIRED');
                break;
            case !!errors.matDatepickerMin: {
                const minValue = DateFnsUtils.formatDate(errors.matDatepickerMin.min, this.field.dateDisplayFormat).toLocaleUpperCase();
                errorAttributes.set('minValue', minValue);
                this.updateValidationSummary('FORM.FIELD.VALIDATOR.NOT_LESS_THAN', errorAttributes);
                break;
            }
            case !!errors.matDatepickerMax: {
                const maxValue = DateFnsUtils.formatDate(errors.matDatepickerMax.max, this.field.dateDisplayFormat).toLocaleUpperCase();
                errorAttributes.set('maxValue', maxValue);
                this.updateValidationSummary('FORM.FIELD.VALIDATOR.NOT_GREATER_THAN', errorAttributes);
                break;
            }
            default:
                break;
        }
    }

    private updateValidationSummary(message: string, attributes?: Map<string, string>): void {
        this.field.validationSummary = new ErrorMessageModel({ message, attributes });
    }

    private resetErrors(): void {
        this.updateValidationSummary('');
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
            this.minDate = parseISO(this.field.minValue);
        }

        if (this.field?.maxValue) {
            this.maxDate = parseISO(this.field.maxValue);
        }
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
