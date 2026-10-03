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

import { NgIf } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, ErrorStateMatcher, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DatetimeAdapter, MAT_DATETIME_FORMATS, MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ADF_DATE_FORMATS, ADF_DATETIME_FORMATS, AdfDateFnsAdapter, AdfDateTimeFnsAdapter } from '../../../../common';
import { FormService } from '../../../services/form.service';
import { WidgetComponent } from '../widget.component';
import { getValidationSummaryTranslationParameters } from '../core/error-message.model';
import { getDateTimeFieldRange } from '../core/form-field-validator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormWidget } from '../reactive-widget.interface';

@Component({
    selector: 'date-time-widget',
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: ADF_DATE_FORMATS },
        { provide: MAT_DATETIME_FORMATS, useValue: ADF_DATETIME_FORMATS },
        { provide: DateAdapter, useClass: AdfDateFnsAdapter },
        { provide: DatetimeAdapter, useClass: AdfDateTimeFnsAdapter }
    ],
    templateUrl: './date-time.widget.html',
    styleUrls: ['./date-time.widget.scss'],
    host: {
        '(click)': 'event($event)'
    },
    imports: [NgIf, TranslatePipe, MatFormFieldModule, MatInputModule, MatDatetimepickerModule, ReactiveFormsModule, MatIconModule],
    encapsulation: ViewEncapsulation.None
})
export class DateTimeWidgetComponent extends WidgetComponent implements OnInit, ReactiveFormWidget {
    minDate: Date;
    maxDate: Date;
    datetimeInputControl: FormControl<Date> = new FormControl<Date>(null);
    translateParameters: Record<string, string> = {};

    readonly errorStateMatcher: ErrorStateMatcher = {
        isErrorState: (control) => !!control?.touched && this.hasValidationError()
    };

    public readonly formService = inject(FormService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly dateAdapter = inject(DateAdapter);
    private readonly dateTimeAdapter = inject(DatetimeAdapter);

    ngOnInit(): void {
        this.setFormControlValue();
        this.updateFormControlState();
        this.initDateAdapter();
        this.initDateRange();
        this.subscribeToDateChanges();
        this.validateField();
    }

    updateReactiveFormControl(): void {
        this.setFormControlValue();
        this.updateFormControlState();
        if (this.field?.form?.showAllValidationErrors) {
            this.datetimeInputControl.markAsTouched();
        }
        this.validateField();
    }

    private setFormControlValue(): void {
        if (this.field.value !== this.datetimeInputControl.value) {
            this.datetimeInputControl.setValue(this.field.value, { emitEvent: false });
        }
    }

    hasValidationError(): boolean {
        return !this.field.isValid && this.field.validationSummary.isActive();
    }

    private updateFormControlState(): void {
        this.field?.readOnly || this.readOnly
            ? this.datetimeInputControl.disable({ emitEvent: false })
            : this.datetimeInputControl.enable({ emitEvent: false });

        if (this.field) {
            this.field.inputDisabled = this.readOnly;
        }
        this.datetimeInputControl.updateValueAndValidity({ emitEvent: false });
    }

    private subscribeToDateChanges(): void {
        this.datetimeInputControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((newDate: Date) => {
            this.field.value = newDate;
            this.updateField();
        });
    }

    private updateField(): void {
        this.validateField();
        this.onFieldChanged(this.field);
    }

    private validateField(): void {
        this.field.inputErrors = this.datetimeInputControl.hasError('matDatepickerParse') ? { matDatepickerParse: true } : null;
        this.field.validate();
        this.translateParameters = getValidationSummaryTranslationParameters(this.field.validationSummary);
    }

    private initDateAdapter(): void {
        if (this.field?.dateDisplayFormat) {
            const dateAdapter = this.dateAdapter as AdfDateFnsAdapter;
            dateAdapter.displayFormat = this.field.dateDisplayFormat;

            const dateTimeAdapter = this.dateTimeAdapter as AdfDateTimeFnsAdapter;
            dateTimeAdapter.displayFormat = this.field.dateDisplayFormat;
        }
    }

    private initDateRange(): void {
        const { min, max } = getDateTimeFieldRange(this.field);
        this.minDate = min;
        this.maxDate = max;
    }
}
