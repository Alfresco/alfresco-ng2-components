/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DatetimeAdapter, MAT_DATETIME_FORMATS, MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ADF_DATE_FORMATS, ADF_DATETIME_FORMATS, AdfDateFnsAdapter, AdfDateTimeFnsAdapter, DateFnsUtils } from '../../../../common';
import { FormService } from '../../../services/form.service';
import { ErrorWidgetComponent } from '../error/error.component';
import { WidgetComponent } from '../widget.component';
import { ErrorMessageModel } from '../core/error-message.model';
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
    imports: [NgIf, TranslatePipe, MatFormFieldModule, MatInputModule, MatDatetimepickerModule, ReactiveFormsModule, ErrorWidgetComponent],
    encapsulation: ViewEncapsulation.None
})
export class DateTimeWidgetComponent extends WidgetComponent implements OnInit, ReactiveFormWidget {
    minDate: Date;
    maxDate: Date;
    datetimeInputControl: FormControl<Date> = new FormControl<Date>(null);

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
        this.validateField();
    }

    private setFormControlValue(): void {
        this.datetimeInputControl.setValue(this.field.value, { emitEvent: false });
    }

    private updateFormControlState(): void {
        this.datetimeInputControl.setValidators(this.isRequired() && this.field?.isVisible ? [Validators.required] : []);
        this.field?.readOnly || this.readOnly
            ? this.datetimeInputControl.disable({ emitEvent: false })
            : this.datetimeInputControl.enable({ emitEvent: false });

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
        if (this.datetimeInputControl?.invalid) {
            this.handleErrors(this.datetimeInputControl.errors);
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
            const dateAdapter = this.dateAdapter as AdfDateFnsAdapter;
            dateAdapter.displayFormat = this.field.dateDisplayFormat;

            const dateTimeAdapter = this.dateTimeAdapter as AdfDateTimeFnsAdapter;
            dateTimeAdapter.displayFormat = this.field.dateDisplayFormat;
        }
    }

    private initDateRange(): void {
        if (this.field?.minValue) {
            this.minDate = DateFnsUtils.getDate(this.field.minValue);
        }

        if (this.field?.maxValue) {
            this.maxDate = DateFnsUtils.getDate(this.field.maxValue);
        }
    }
}
