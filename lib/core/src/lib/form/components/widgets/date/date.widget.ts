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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { ADF_DATE_FORMATS, AdfDateFnsAdapter, DateFnsUtils, DEFAULT_DATE_FORMAT } from '../../../../common';
import { FormService } from '../../../services/form.service';
import { ErrorWidgetComponent } from '../error/error.component';
import { WidgetComponent } from '../widget.component';
import { ErrorMessageModel } from '../core/error-message.model';
import { parseISO } from 'date-fns';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormWidget } from '../reactive-widget.interface';

@Component({
    selector: 'date-widget',
    standalone: true,
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: ADF_DATE_FORMATS },
        { provide: DateAdapter, useClass: AdfDateFnsAdapter }
    ],
    styles: [
        `
            .adf-error-messages-container {
                min-height: 35px;
            }
        `
    ],
    templateUrl: './date.widget.html',
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
    imports: [MatFormFieldModule, TranslateModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule, ErrorWidgetComponent, NgIf],
    encapsulation: ViewEncapsulation.None
})
export class DateWidgetComponent extends WidgetComponent implements OnInit, ReactiveFormWidget {
    minDate: Date;
    maxDate: Date;
    startAt: Date;

    dateInputControl: FormControl<Date> = new FormControl<Date>(null);

    public readonly formService = inject(FormService);

    private readonly dateAdapter = inject(DateAdapter);
    private readonly destroyRef = inject(DestroyRef);

    ngOnInit(): void {
        this.setFormControlValue();
        this.updateFormControlState();
        this.initDateAdapter();
        this.initDateRange();
        this.initStartAt();
        this.subscribeToDateChanges();
        this.validateField();
    }

    updateReactiveFormControl(): void {
        this.updateFormControlState();
        this.validateField();
    }

    private setFormControlValue(): void {
        this.dateInputControl.setValue(this.field.value, { emitEvent: false });
    }

    private updateFormControlState(): void {
        this.dateInputControl.setValidators(this.isRequired() && this.field?.isVisible ? [Validators.required] : []);
        this.field?.readOnly || this.readOnly
            ? this.dateInputControl.disable({ emitEvent: false })
            : this.dateInputControl.enable({ emitEvent: false });

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

    private initDateRange(): void {
        if (this.field?.minValue) {
            this.minDate = parseISO(this.field.minValue);
        }

        if (this.field?.maxValue) {
            this.maxDate = parseISO(this.field.maxValue);
        }
    }

    private initStartAt(): void {
        if (this.field?.value) {
            this.startAt = this.dateAdapter.parse(this.field.value, DEFAULT_DATE_FORMAT);
        }
    }
}
