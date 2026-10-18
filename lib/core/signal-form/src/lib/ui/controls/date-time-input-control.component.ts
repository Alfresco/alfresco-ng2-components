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

import { afterRenderEffect, ChangeDetectionStrategy, Component, computed, inject, input, signal, viewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { MatDatepickerInput, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { TranslatePipe } from '@ngx-translate/core';
import { ADF_DATE_FORMATS, AdfDateFnsAdapter } from '@alfresco/adf-core';
import { combinedDateTime, pickerDate, typedPickerValue } from './picker-values';
import { SignalInputControl } from './signal-input-control';
import { SignalFieldErrorComponent } from '../widgets/field-error/field-error.component';

const TIME_FORMAT = 'HH:mm';

const DATE_TIME_PICKER_FORMATS: MatDateFormats = {
    parse: { ...ADF_DATE_FORMATS.parse, timeInput: TIME_FORMAT },
    display: { ...ADF_DATE_FORMATS.display, timeInput: TIME_FORMAT, timeOptionLabel: TIME_FORMAT }
};

/**
 * A datetime input: Material's datepicker for the day and timepicker for the time, combined into one value. A time
 * without a day, or a part that can't be read, makes the value invalid; a day without a time is its midnight.
 */
@Component({
    selector: 'adf-signal-date-time-input',
    templateUrl: './date-time-input-control.component.html',
    styleUrl: './date-time-input-control.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: DATE_TIME_PICKER_FORMATS },
        { provide: DateAdapter, useClass: AdfDateFnsAdapter }
    ],
    imports: [MatDatepickerModule, MatTimepickerModule, MatFormFieldModule, MatInputModule, TranslatePipe, SignalFieldErrorComponent]
})
export class SignalDateTimeInputControlComponent extends SignalInputControl<Date | null> {
    readonly minDate = input<Date | null>(null);
    readonly maxDate = input<Date | null>(null);

    private readonly dateAdapter = inject(DateAdapter) as AdfDateFnsAdapter;
    private readonly dateInput = viewChild.required<MatDatepickerInput<Date>>(MatDatepickerInput);
    private readonly day = signal<Date | null>(null);
    private written: unknown;

    protected readonly time = signal<Date | null>(null);
    protected readonly timeInputId = computed(() => `${this.inputId()}-time`);

    constructor() {
        super();
        afterRenderEffect({
            write: () => {
                const value = this.value();
                if (value !== this.written) {
                    this.written = value;
                    const shown = pickerDate(value);
                    this.day.set(shown);
                    this.time.set(shown);
                    this.dateInput().value = shown;
                }
            }
        });
    }

    protected typed(text: string): void {
        this.day.set(this.parsed(text));
        this.write();
    }

    protected picked(value: Date | null, text: string): void {
        this.day.set(value ?? this.parsed(text));
        this.write();
    }

    protected changedTime(value: Date | null): void {
        this.time.set(value);
        this.write();
    }

    private parsed(text: string): Date | null {
        return typedPickerValue(this.dateAdapter, text, DATE_TIME_PICKER_FORMATS.parse.dateInput);
    }

    private write(): void {
        const value = combinedDateTime(this.day(), this.time());
        this.written = value;
        this.value.set(value);
    }
}
