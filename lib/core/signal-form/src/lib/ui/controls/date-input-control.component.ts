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

import { afterRenderEffect, booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input, model, viewChild } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { DateAdapter, ErrorStateMatcher, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerInput, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { ADF_DATE_FORMATS, AdfDateFnsAdapter } from '@alfresco/adf-core';
import { DateFieldValue } from '../../definition/form-definition.interface';
import { FieldErrorMessage } from '../widgets/field-error-message';
import { SignalFieldErrorComponent } from '../widgets/field-error/field-error.component';
import { pickerDate, typedPickerValue } from './picker-values';

@Component({
    selector: 'adf-signal-date-input',
    templateUrl: './date-input-control.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: ADF_DATE_FORMATS },
        AdfDateFnsAdapter,
        { provide: DateAdapter, useExisting: AdfDateFnsAdapter }
    ],
    imports: [MatDatepickerModule, MatFormFieldModule, MatInputModule, TranslatePipe, SignalFieldErrorComponent]
})
export class SignalDateInputControlComponent implements FormValueControl<DateFieldValue> {
    readonly value = model.required<DateFieldValue>();
    readonly touched = model(false);
    readonly disabled = input(false, { transform: booleanAttribute });
    readonly readonly = input(false, { transform: booleanAttribute });
    readonly required = input(false, { transform: booleanAttribute });

    readonly inputId = input.required<string>();
    readonly label = input<string>();
    readonly labelAutomationId = input<string>();
    readonly placeholder = input('');
    readonly tooltip = input('');
    readonly error = input<FieldErrorMessage | null>(null);
    readonly displayFormat = input<string | null>(null);
    readonly minDate = input<Date | null>(null);
    readonly maxDate = input<Date | null>(null);

    private readonly dateAdapter = inject(AdfDateFnsAdapter);
    private readonly dateInput = viewChild.required<MatDatepickerInput<Date>>(MatDatepickerInput);
    private readonly matInput = viewChild(MatInput);
    private lastWrittenValue: DateFieldValue | undefined;

    protected readonly locked = computed(() => this.disabled() || this.readonly());
    protected readonly errorStateMatcher: ErrorStateMatcher = { isErrorState: () => this.error() !== null };

    constructor() {
        afterRenderEffect({
            write: () => {
                this.dateAdapter.displayFormat = this.displayFormat();
                const value = this.value();
                if (value !== this.lastWrittenValue) {
                    this.lastWrittenValue = value;
                    this.dateInput().value = pickerDate(value);
                }
            }
        });
        afterRenderEffect({
            write: () => {
                this.error();
                this.matInput()?.updateErrorState();
            }
        });
    }

    protected updateTypedDate(text: string): void {
        this.writeValue(this.parseTypedDate(text));
    }

    protected updatePickedDate(pickedDate: Date | null, text: string): void {
        this.writeValue(pickedDate ?? this.parseTypedDate(text));
    }

    protected markTouched(): void {
        this.touched.set(true);
    }

    private parseTypedDate(text: string): Date | null {
        return typedPickerValue(this.dateAdapter, text, ADF_DATE_FORMATS.parse.dateInput);
    }

    private writeValue(value: DateFieldValue): void {
        this.lastWrittenValue = value;
        this.value.set(value);
    }
}
