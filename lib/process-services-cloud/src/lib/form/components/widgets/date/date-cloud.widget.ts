/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, OnInit, ViewEncapsulation, DestroyRef, inject } from '@angular/core';
import { DateAdapter, ErrorStateMatcher, MAT_DATE_FORMATS } from '@angular/material/core';
import {
    ADF_DATE_FORMATS,
    AdfDateFnsAdapter,
    DateFnsUtils,
    DEFAULT_DATE_FORMAT,
    FormFieldModel,
    FormService,
    getDateFieldRange,
    getDynamicDateFieldRange,
    isEmptyFieldValue,
    getValidationSummaryTranslationParameters,
    WidgetComponent,
    ReactiveFormWidget
} from '@alfresco/adf-core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export const getDateCloudWidgetRange = (field: FormFieldModel, today: Date): { min?: Date | null; max?: Date | null } =>
    field?.dynamicDateRangeSelection ? getDynamicDateFieldRange(field, today) : getDateFieldRange(field);

@Component({
    selector: 'date-widget',
    imports: [NgIf, TranslatePipe, MatFormFieldModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule, MatIconModule],
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
export class DateCloudWidgetComponent extends WidgetComponent implements OnInit, ReactiveFormWidget {
    typeId = 'DateCloudWidgetComponent';

    minDate: Date = null;
    maxDate: Date = null;
    startAt: Date = null;

    dateInputControl: FormControl<Date> = new FormControl<Date>(null);
    translateParameters: Record<string, string> = {};

    readonly errorStateMatcher: ErrorStateMatcher = {
        isErrorState: (control) => !!control?.touched && this.hasValidationError()
    };

    public readonly formService = inject(FormService);

    private readonly destroyRef = inject(DestroyRef);
    private readonly dateAdapter = inject(DateAdapter);

    ngOnInit(): void {
        this.setFormControlValue();
        this.updateFormControlState();
        this.initDateAdapter();
        this.initRangeSelection();
        this.initStartAt();
        this.subscribeToDateChanges();
        this.validateField();
    }

    updateReactiveFormControl(): void {
        this.setFormControlValue();
        this.updateFormControlState();
        if (this.field?.form?.showAllValidationErrors) {
            this.dateInputControl.markAsTouched();
        }
        this.validateField();
    }

    private setFormControlValue(): void {
        if (this.field.value !== this.dateInputControl.value) {
            this.dateInputControl.setValue(this.field.value, { emitEvent: false });
        }
    }

    hasValidationError(): boolean {
        return !this.field.isValid && this.field.validationSummary.isActive();
    }

    hasRequiredError(): boolean {
        return !!this.field.required && isEmptyFieldValue(this.field.value);
    }

    private updateFormControlState(): void {
        this.field?.readOnly || this.readOnly
            ? this.dateInputControl.disable({ emitEvent: false })
            : this.dateInputControl.enable({ emitEvent: false });

        if (this.field) {
            this.field.inputDisabled = this.readOnly;
        }
        this.dateInputControl.updateValueAndValidity({ emitEvent: false });
    }

    private subscribeToDateChanges(): void {
        this.dateInputControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((newDate: Date) => {
            this.field.value = newDate;
            this.updateField();
        });
    }

    private updateField(): void {
        this.validateField();
        this.onFieldChanged(this.field);
    }

    get formattedMinDate(): string {
        const min = this.dateInputControl.errors?.matDatepickerMin?.min;
        return min ? DateFnsUtils.formatDate(min, this.field.dateDisplayFormat).toLocaleUpperCase() : '';
    }

    get formattedMaxDate(): string {
        const max = this.dateInputControl.errors?.matDatepickerMax?.max;
        return max ? DateFnsUtils.formatDate(max, this.field.dateDisplayFormat).toLocaleUpperCase() : '';
    }

    private validateField(): void {
        this.field.inputErrors = this.dateInputControl.hasError('matDatepickerParse') ? { matDatepickerParse: true } : null;
        this.field.validate();
        this.translateParameters = getValidationSummaryTranslationParameters(this.field.validationSummary);
    }

    private initDateAdapter(): void {
        if (this.field?.dateDisplayFormat) {
            const adapter = this.dateAdapter as AdfDateFnsAdapter;
            adapter.displayFormat = this.field.dateDisplayFormat;
        }
    }

    private initStartAt(): void {
        if (this.field?.value) {
            this.startAt = this.dateAdapter.parse(this.field.value, DEFAULT_DATE_FORMAT);
        }
    }

    private initRangeSelection(): void {
        const { min, max } = getDateCloudWidgetRange(this.field, this.dateAdapter.today());
        this.minDate = min;
        this.maxDate = max;

        if (this.field?.dynamicDateRangeSelection) {
            this.field.minValue = min === null ? null : DateFnsUtils.formatDate(min, DEFAULT_DATE_FORMAT);
            this.field.maxValue = max === null ? null : DateFnsUtils.formatDate(max, DEFAULT_DATE_FORMAT);
        }
    }
}
